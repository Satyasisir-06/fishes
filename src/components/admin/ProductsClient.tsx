"use client";

import { useState } from "react";
import { updateProductStock, toggleProductActive, updateProductDetails } from "@/lib/actions/admin-products";
import { Plus, Minus, Eye, EyeOff, Edit2, X, Upload } from "lucide-react";

export default function ProductsClient({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  
  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateStock = async (id: string, newStock: number) => {
    if (newStock < 0) return;
    setIsUpdating(id);
    const result = await updateProductStock(id, newStock);
    if (result.success) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
    }
    setIsUpdating(null);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setIsUpdating(id);
    const result = await toggleProductActive(id, !currentStatus);
    if (result.success) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p));
    }
    setIsUpdating(null);
  };

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    formData.append("id", editingProduct.id);
    formData.append("current_image_url", editingProduct.image_url || "");

    const result = await updateProductDetails(formData);

    if (result.success) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { 
        ...p, 
        name: result.name,
        category: result.category,
        price: result.price,
        image_url: result.imageUrl
      } : p));
      setEditingProduct(null);
    } else {
      alert(result.error);
    }
    setIsSaving(false);
  };

  return (
    <>
      <div className="bg-surface rounded-3xl border border-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Product</th>
                <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Category</th>
                <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Price</th>
                <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider text-center">Stock</th>
                <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted">No products found.</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className={`border-b border-white/5 transition-colors ${isUpdating === p.id ? 'opacity-50' : 'hover:bg-white/5'} ${!p.is_active ? 'bg-black/20 opacity-60' : ''}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-lg overflow-hidden shrink-0">
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted">No Img</div>
                          )}
                        </div>
                        <div className="font-bold text-foreground line-clamp-2">{p.name}</div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-muted uppercase tracking-widest">{p.category}</td>
                    <td className="p-4 font-bold text-accent">₹{p.price.toLocaleString("en-IN")}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleUpdateStock(p.id, p.stock - 1)}
                          disabled={isUpdating === p.id || p.stock === 0}
                          className="w-8 h-8 flex items-center justify-center bg-primary border border-white/10 rounded-lg text-foreground hover:bg-white/10 disabled:opacity-50"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-lg w-8 text-center">{p.stock}</span>
                        <button 
                          onClick={() => handleUpdateStock(p.id, p.stock + 1)}
                          disabled={isUpdating === p.id}
                          className="w-8 h-8 flex items-center justify-center bg-primary border border-white/10 rounded-lg text-foreground hover:bg-white/10 disabled:opacity-50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setEditingProduct(p)}
                          className="inline-flex items-center justify-center p-2 rounded-lg text-foreground bg-primary border border-white/10 hover:bg-white/10 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleToggleActive(p.id, p.is_active)}
                          disabled={isUpdating === p.id}
                          className={`inline-flex items-center justify-center p-2 rounded-lg transition-colors ${
                            p.is_active 
                              ? 'bg-accent/10 text-accent hover:bg-accent/20' 
                              : 'bg-danger/10 text-danger hover:bg-danger/20'
                          }`}
                          title={p.is_active ? "Hide from store" : "Show on store"}
                        >
                          {p.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-white/10 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-primary/50">
              <h2 className="text-xl font-bold text-foreground">Edit Product</h2>
              <button 
                onClick={() => setEditingProduct(null)}
                className="text-muted hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="edit-product-form" onSubmit={handleSaveEdit} className="flex flex-col gap-5">
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted">Product Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    defaultValue={editingProduct.name}
                    className="bg-primary border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm font-medium text-muted">Price (₹)</label>
                    <input 
                      type="number" 
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      defaultValue={editingProduct.price}
                      className="bg-primary border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm font-medium text-muted">Category</label>
                    <select 
                      name="category"
                      required
                      defaultValue={editingProduct.category}
                      className="bg-primary border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent appearance-none cursor-pointer"
                    >
                      <option value="FISH">Fish</option>
                      <option value="FOOD">Food</option>
                      <option value="TANKS">Tanks</option>
                      <option value="DECOR">Decor</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted">Product Image</label>
                  <div className="flex items-center gap-4">
                    {editingProduct.image_url ? (
                      <div className="w-16 h-16 rounded-xl bg-primary border border-white/10 overflow-hidden shrink-0">
                        <img src={editingProduct.image_url} alt="Current" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-primary border border-white/10 flex items-center justify-center shrink-0 text-muted">
                        No Img
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="flex items-center justify-center gap-2 w-full bg-primary border border-white/10 border-dashed rounded-xl px-4 py-3 text-foreground hover:bg-white/5 hover:border-accent cursor-pointer transition-colors">
                        <Upload className="w-4 h-4 text-muted" />
                        <span className="text-sm font-medium">Upload New Image</span>
                        <input type="file" name="image" accept="image/*" className="hidden" />
                      </label>
                      <p className="text-xs text-muted mt-2 text-center">Leave empty to keep current image</p>
                    </div>
                  </div>
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-white/5 bg-primary/50 flex gap-3">
              <button 
                type="button"
                onClick={() => setEditingProduct(null)}
                className="flex-1 py-3 bg-surface border border-white/10 text-foreground font-bold rounded-xl hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="edit-product-form"
                disabled={isSaving}
                className="flex-1 py-3 bg-accent text-primary font-bold rounded-xl hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
