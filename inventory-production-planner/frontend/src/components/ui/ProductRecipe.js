import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function ProductRecipeDialog({ product, open, onClose }) {
  const [materials, setMaterials] = useState([]);
  const [productMaterials, setProductMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (open) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product]);

  const fetchData = async () => {
    try {
      const [materialsRes, productRes] = await Promise.all([
        axios.get(`${API}/raw-materials`),
        axios.get(`${API}/products/${product.code}`),
      ]);
      setMaterials(materialsRes.data);
      setProductMaterials(productRes.data.materials || []);
    } catch (error) {
      toast.error('Failed to load recipe data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    if (!selectedMaterial || !quantity) return;

    try {
      await axios.post(`${API}/product-materials`, {
        product_id: product.code,
        material_id: selectedMaterial,
        quantity_required: parseFloat(quantity),
      });
      toast.success('Material added to recipe');
      setSelectedMaterial('');
      setQuantity('');
      setShowAddForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add material');
    }
  };

  const handleRemoveMaterial = async (materialId) => {
    try {
      await axios.delete(`${API}/product-materials/${product.code}/${materialId}`);
      toast.success('Material removed from recipe');
      fetchData();
    } catch (error) {
      toast.error('Failed to remove material');
    }
  };

  const availableMaterials = materials.filter(
    (mat) => !productMaterials.find((pm) => pm.material_id === mat.code)
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white" data-testid="recipe-dialog">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-bold">
            Recipe for {product.name}
          </DialogTitle>
          <p className="text-sm text-slate-500">Manage required materials and quantities</p>
        </DialogHeader>

        <div className="py-4">
          {loading ? (
            <div className="py-8 text-center text-slate-500">Loading...</div>
          ) : (
            <>
              {/* Current Materials */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                  Required Materials
                </h3>
                {productMaterials.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    No materials in recipe yet
                  </div>
                ) : (
                  <div className="space-y-2">
                    {productMaterials.map((pm) => (
                      <div
                        key={pm.material_id}
                        className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-sm"
                        data-testid={`recipe-item-${pm.material_id}`}
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm">{pm.material_name}</div>
                          <div className="text-xs text-slate-500 font-mono">{pm.material_id}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-mono font-bold">{pm.quantity_required}</div>
                            <div className="text-xs text-slate-500">units required</div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-sm">{pm.stock_available}</div>
                            <div className="text-xs text-slate-500">in stock</div>
                          </div>
                          <Button
                            onClick={() => handleRemoveMaterial(pm.material_id)}
                            variant="ghost"
                            size="sm"
                            data-testid={`remove-material-${pm.material_id}`}
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={14} strokeWidth={1.5} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Material Form */}
              {!showAddForm ? (
                <Button
                  onClick={() => setShowAddForm(true)}
                  data-testid="show-add-material-form"
                  className="w-full border-2 border-dashed border-slate-300 bg-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-400"
                  disabled={availableMaterials.length === 0}
                >
                  <Plus size={18} strokeWidth={1.5} className="mr-2" />
                  Add Material to Recipe
                </Button>
              ) : (
                <form onSubmit={handleAddMaterial} className="space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-sm">
                  <div>
                    <Label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Select Material
                    </Label>
                    <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                      <SelectTrigger data-testid="material-select" className="h-10 rounded-sm border-slate-300">
                        <SelectValue placeholder="Choose a material" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableMaterials.map((mat) => (
                          <SelectItem key={mat.code} value={mat.code}>
                            {mat.name} ({mat.code}) - Stock: {mat.stock_quantity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Quantity Required
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      data-testid="material-quantity-input"
                      required
                      className="h-10 rounded-sm border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddForm(false);
                        setSelectedMaterial('');
                        setQuantity('');
                      }}
                      data-testid="cancel-add-material"
                      className="flex-1 border-slate-300 hover:bg-slate-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      data-testid="save-material-to-recipe"
                      className="flex-1 bg-slate-900 text-white hover:bg-slate-800"
                    >
                      Add to Recipe
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductRecipeDialog;
