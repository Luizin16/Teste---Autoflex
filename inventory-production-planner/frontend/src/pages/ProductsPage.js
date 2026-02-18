import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
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
import ProductRecipeDialog from '@/components/ProductRecipeDialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [recipeProduct, setRecipeProduct] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    value: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to load products');
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
        value: parseFloat(formData.value),
      };

      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct.code}`, data);
        toast.success('Product updated successfully');
      } else {
        await axios.post(`${API}/products`, data);
        toast.success('Product created successfully');
      }

      setShowDialog(false);
      setEditingProduct(null);
      setFormData({ code: '', name: '', value: '' });
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      code: product.code,
      name: product.name,
      value: product.value.toString(),
    });
    setShowDialog(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/products/${deleteProduct.code}`);
      setDeleteProduct(null);
      await fetchProducts();
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete product');
    }
  };

  const openDialog = () => {
    setEditingProduct(null);
    setFormData({ code: '', name: '', value: '' });
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
                Products
              </h1>
              <p className="text-sm text-slate-500 mt-2">
                Manage your product catalog and recipes
              </p>
            </div>
            <Button
              onClick={openDialog}
              data-testid="add-product-button"
              className="bg-slate-900 text-white hover:bg-slate-800 shadow-sm h-10 px-4 rounded-sm font-medium active:scale-95 transition-all"
            >
              <Plus size={18} strokeWidth={1.5} className="mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white border border-slate-200 rounded-sm">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading...</div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <Package size={48} className="mx-auto text-slate-300 mb-4" strokeWidth={1.5} />
              <p className="text-slate-500 mb-4">No products yet</p>
              <Button
                onClick={openDialog}
                data-testid="empty-add-product-button"
                className="bg-slate-900 text-white hover:bg-slate-800"
              >
                Create First Product
              </Button>
            </div>
          ) : (
            <table className="w-full border-collapse text-sm" data-testid="products-table">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left h-10 px-4 border-b border-slate-200 text-slate-500 font-medium text-xs uppercase tracking-widest">
                    Code
                  </th>
                  <th className="text-left h-10 px-4 border-b border-slate-200 text-slate-500 font-medium text-xs uppercase tracking-widest">
                    Name
                  </th>
                  <th className="text-right h-10 px-4 border-b border-slate-200 text-slate-500 font-medium text-xs uppercase tracking-widest">
                    Value
                  </th>
                  <th className="text-center h-10 px-4 border-b border-slate-200 text-slate-500 font-medium text-xs uppercase tracking-widest">
                    Recipe
                  </th>
                  <th className="text-right h-10 px-4 border-b border-slate-200 text-slate-500 font-medium text-xs uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.code}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors h-12"
                    data-testid={`product-row-${product.code}`}
                  >
                    <td className="px-4 py-2 font-mono text-xs">{product.code}</td>
                    <td className="px-4 py-2 font-medium">{product.name}</td>
                    <td className="px-4 py-2 text-right font-mono">${product.value.toFixed(2)}</td>
                    <td className="px-4 py-2 text-center">
                      <Button
                        onClick={() => setRecipeProduct(product)}
                        variant="outline"
                        size="sm"
                        data-testid={`recipe-button-${product.code}`}
                        className="h-8 px-3 text-xs border-slate-300 hover:bg-slate-50"
                      >
                        Manage Recipe
                      </Button>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => handleEdit(product)}
                          variant="ghost"
                          size="sm"
                          data-testid={`edit-button-${product.code}`}
                          className="h-8 w-8 p-0 hover:bg-slate-100"
                        >
                          <Pencil size={14} strokeWidth={1.5} />
                        </Button>
                        <Button
                          onClick={() => setDeleteProduct(product)}
                          variant="ghost"
                          size="sm"
                          data-testid={`delete-button-${product.code}`}
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
        <DialogContent className="sm:max-w-md bg-white" data-testid="product-dialog">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-bold">
              {editingProduct ? 'Edit Product' : 'Create Product'}
            </DialogTitle>
            <p className="text-sm text-slate-500">
              {editingProduct ? 'Update product information' : 'Add a new product to your catalog'}
            </p>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="code" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Product Code
                </Label>
                <Input
                  id="code"
                  data-testid="product-code-input"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  disabled={!!editingProduct}
                  required
                  className="h-10 rounded-sm border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="e.g., PROD001"
                />
              </div>
              <div>
                <Label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Product Name
                </Label>
                <Input
                  id="name"
                  data-testid="product-name-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-10 rounded-sm border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="e.g., Industrial Widget"
                />
              </div>
              <div>
                <Label htmlFor="value" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Unit Value ($)
                </Label>
                <Input
                  id="value"
                  data-testid="product-value-input"
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
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
                data-testid="cancel-product-button"
                className="border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-testid="save-product-button"
                className="bg-slate-900 text-white hover:bg-slate-800"
              >
                {editingProduct ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <AlertDialogContent className="bg-white" data-testid="delete-product-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteProduct?.name}"? This action cannot be undone
              and will remove all associated recipes.
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

      {/* Recipe Dialog */}
      {recipeProduct && (
        <ProductRecipeDialog
          product={recipeProduct}
          open={!!recipeProduct}
          onClose={() => setRecipeProduct(null)}
        />
      )}
    </div>
  );
}

export default ProductsPage;
