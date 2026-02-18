import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Boxes } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function RawMaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [deleteMaterial, setDeleteMaterial] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    stock_quantity: '',
  });

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(`${API}/raw-materials`);
      setMaterials(response.data);
    } catch (error) {
      toast.error('Failed to load raw materials');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        code: formData.code,
        name: formData.name,
        stock_quantity: parseFloat(formData.stock_quantity),
      };

      if (editingMaterial) {
        await axios.put(`${API}/raw-materials/${editingMaterial.code}`, data);
        toast.success('Raw material updated successfully');
      } else {
        await axios.post(`${API}/raw-materials`, data);
        toast.success('Raw material created successfully');
      }

      setShowDialog(false);
      setEditingMaterial(null);
      setFormData({ code: '', name: '', stock_quantity: '' });
      fetchMaterials();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save raw material');
    }
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setFormData({
      code: material.code,
      name: material.name,
      stock_quantity: material.stock_quantity.toString(),
    });
    setShowDialog(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/raw-materials/${deleteMaterial.code}`);
      setDeleteMaterial(null);
      await fetchMaterials();
      toast.success('Raw material deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete raw material');
    }
  };

  const openDialog = () => {
    setEditingMaterial(null);
    setFormData({ code: '', name: '', stock_quantity: '' });
    setShowDialog(true);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-4xl font-black tracking-tight uppercase text-slate-900">
                Raw Materials
              </h1>
              <p className="text-sm text-slate-500 mt-2">
                Manage inventory of production materials
              </p>
            </div>
            <Button
              onClick={openDialog}
              data-testid="add-material-button"
              className="bg-slate-900 text-white hover:bg-slate-800 shadow-sm h-10 px-4 rounded-sm font-medium active:scale-95 transition-all"
            >
              <Plus size={18} strokeWidth={1.5} className="mr-2" />
              Add Material
            </Button>
          </div>
        </div>

        {/* Materials Table */}
        <div className="bg-white border border-slate-200 rounded-sm">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading...</div>
          ) : materials.length === 0 ? (
            <div className="p-12 text-center">
              <Boxes size={48} className="mx-auto text-slate-300 mb-4" strokeWidth={1.5} />
              <p className="text-slate-500 mb-4">No raw materials yet</p>
              <Button
                onClick={openDialog}
                data-testid="empty-add-material-button"
                className="bg-slate-900 text-white hover:bg-slate-800"
              >
                Add First Material
              </Button>
            </div>
          ) : (
            <table className="w-full border-collapse text-sm" data-testid="materials-table">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left h-10 px-4 border-b border-slate-200 text-slate-500 font-medium text-xs uppercase tracking-widest">
                    Code
                  </th>
                  <th className="text-left h-10 px-4 border-b border-slate-200 text-slate-500 font-medium text-xs uppercase tracking-widest">
                    Name
                  </th>
                  <th className="text-right h-10 px-4 border-b border-slate-200 text-slate-500 font-medium text-xs uppercase tracking-widest">
                    Stock Quantity
                  </th>
                  <th className="text-right h-10 px-4 border-b border-slate-200 text-slate-500 font-medium text-xs uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {materials.map((material) => (
                  <tr
                    key={material.code}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors h-12"
                    data-testid={`material-row-${material.code}`}
                  >
                    <td className="px-4 py-2 font-mono text-xs">{material.code}</td>
                    <td className="px-4 py-2 font-medium">{material.name}</td>
                    <td className="px-4 py-2 text-right font-mono">
                      {material.stock_quantity.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => handleEdit(material)}
                          variant="ghost"
                          size="sm"
                          data-testid={`edit-button-${material.code}`}
                          className="h-8 w-8 p-0 hover:bg-slate-100"
                        >
                          <Pencil size={14} strokeWidth={1.5} />
                        </Button>
                        <Button
                          onClick={() => setDeleteMaterial(material)}
                          variant="ghost"
                          size="sm"
                          data-testid={`delete-button-${material.code}`}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={14} strokeWidth={1.5} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md bg-white" data-testid="material-dialog">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-bold">
              {editingMaterial ? 'Edit Raw Material' : 'Create Raw Material'}
            </DialogTitle>
            <p className="text-sm text-slate-500">
              {editingMaterial ? 'Update material information' : 'Add a new raw material to inventory'}
            </p>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="code" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Material Code
                </Label>
                <Input
                  id="code"
                  data-testid="material-code-input"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  disabled={!!editingMaterial}
                  required
                  className="h-10 rounded-sm border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="e.g., MAT001"
                />
              </div>
              <div>
                <Label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Material Name
                </Label>
                <Input
                  id="name"
                  data-testid="material-name-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-10 rounded-sm border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="e.g., Steel Plate"
                />
              </div>
              <div>
                <Label htmlFor="stock" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Stock Quantity
                </Label>
                <Input
                  id="stock"
                  data-testid="material-stock-input"
                  type="number"
                  step="0.01"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  required
                  className="h-10 rounded-sm border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
                data-testid="cancel-material-button"
                className="border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-testid="save-material-button"
                className="bg-slate-900 text-white hover:bg-slate-800"
              >
                {editingMaterial ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteMaterial} onOpenChange={() => setDeleteMaterial(null)}>
        <AlertDialogContent className="bg-white" data-testid="delete-material-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Raw Material</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteMaterial?.name}"? This action cannot be undone
              and will remove it from all product recipes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="cancel-delete-button">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-testid="confirm-delete-button"
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default RawMaterialsPage;
