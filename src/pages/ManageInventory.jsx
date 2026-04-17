import { useState } from 'react';
import { useInventory } from '../contexts/InventoryContext';
import { Trash2, Plus, Package, AlertCircle } from 'lucide-react';

const AVAILABLE_TAGS = [
  "Avant-Garde", "Layering", "Winter", "Accessories", "Minimalist",
  "Utility", "Streetwear", "Technical", "Dark-Core", "Core", "Breathable"
];

const AVAILABLE_WEATHER = ["cold", "warm", "hot", "rain", "snow", "wind", "clear", "clouds"];

const CATEGORIES = ["Outerwear", "Tops", "Bottoms", "Footwear", "Accessories"];

const EMPTY_FORM = {
  name: '',
  brand: '',
  price: '',
  category: '',
  image: '',
  description: '',
  tags: [],
  weather: [],
};

export default function ManageInventory() {
  const { inventory, addProduct, removeProduct } = useInventory();
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleTag = (tag) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag],
    }));
  };

  const toggleWeather = (w) => {
    setForm(prev => ({
      ...prev,
      weather: prev.weather.includes(w) ? prev.weather.filter(x => x !== w) : [...prev.weather, w],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.brand || !form.price || !form.category) return;

    addProduct({
      ...form,
      price: parseFloat(form.price),
      image: form.image || `https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
    });

    setForm(EMPTY_FORM);
    setSuccessMsg(`"${form.name}" has been added to the catalog.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-32">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold">Inventory Control</h1>
          <p className="font-body text-secondary text-sm mt-1">{inventory.length} products in the catalog</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-5 py-3 rounded-full font-body font-bold text-sm uppercase tracking-wider transition-all ${
            showForm
              ? 'bg-surface_container_highest text-secondary'
              : 'bg-primary-gradient text-on_primary_container shadow-neon'
          }`}
        >
          <Plus size={18} className={`transition-transform ${showForm ? 'rotate-45' : ''}`} />
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 font-body text-sm flex items-center gap-3">
          <Package size={18} />
          {successMsg}
        </div>
      )}

      {/* Add Product Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-12 bg-surface_container rounded-xl p-6 sm:p-8 border border-white/5">
          <h2 className="font-display font-bold text-xl mb-6">New Product Registration</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-body text-secondary uppercase tracking-widest font-bold">Product Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleInputChange} placeholder="e.g. Obsidian Drape Coat" className="input-field" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-body text-secondary uppercase tracking-widest font-bold">Brand *</label>
              <input type="text" name="brand" value={form.brand} onChange={handleInputChange} placeholder="e.g. NORA" className="input-field" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-body text-secondary uppercase tracking-widest font-bold">Price (USD) *</label>
              <input type="number" name="price" value={form.price} onChange={handleInputChange} placeholder="350.00" step="0.01" min="0" className="input-field" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-body text-secondary uppercase tracking-widest font-bold">Category *</label>
              <select name="category" value={form.category} onChange={handleInputChange} className="input-field" required>
                <option value="">Select category...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <label className="text-xs font-body text-secondary uppercase tracking-widest font-bold">Image URL (Optional)</label>
            <input type="url" name="image" value={form.image} onChange={handleInputChange} placeholder="https://images.unsplash.com/..." className="input-field" />
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <label className="text-xs font-body text-secondary uppercase tracking-widest font-bold">Description</label>
            <textarea name="description" value={form.description} onChange={handleInputChange} placeholder="Describe the product..." className="input-field min-h-[80px] resize-none" rows={3} />
          </div>

          {/* Style Tags */}
          <div className="mb-6">
            <label className="text-xs font-body text-secondary uppercase tracking-widest font-bold block mb-3">Style Tags</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-1.5 rounded-full text-xs font-body font-bold uppercase tracking-wider transition-all border ${
                    form.tags.includes(tag)
                      ? 'bg-primary text-on_primary border-primary shadow-neon'
                      : 'bg-surface_container_high text-secondary border-white/5 hover:text-on_surface'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Weather Tags */}
          <div className="mb-8">
            <label className="text-xs font-body text-secondary uppercase tracking-widest font-bold block mb-3">Weather Suitability</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_WEATHER.map(w => (
                <button
                  key={w}
                  type="button"
                  onClick={() => toggleWeather(w)}
                  className={`px-4 py-1.5 rounded-full text-xs font-body font-bold uppercase tracking-wider transition-all border ${
                    form.weather.includes(w)
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-surface_container_high text-secondary border-white/5 hover:text-on_surface'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary flex items-center justify-center gap-3 w-full sm:w-auto">
            <Plus size={18} /> Register Product
          </button>
        </form>
      )}

      {/* Inventory Grid */}
      <div className="space-y-3">
        {inventory.map((item) => (
          <div key={item.id} className="flex items-center gap-4 sm:gap-6 p-4 rounded-xl bg-surface_container hover:bg-surface_container_high transition-colors group">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-surface_container_highest flex-shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="flex-grow min-w-0">
              <p className="font-body text-sm font-bold text-on_surface truncate">{item.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-body text-xs text-secondary">{item.brand}</span>
                <span className="w-1 h-1 rounded-full bg-outline_variant"></span>
                <span className="font-body text-xs text-outline">{item.category}</span>
              </div>
            </div>
            <div className="hidden sm:flex gap-1.5 flex-wrap max-w-[200px]">
              {item.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-[10px] font-body uppercase tracking-wider text-outline bg-surface_container_highest px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
            <span className="font-body font-bold text-primary text-sm whitespace-nowrap">${item.price.toFixed(2)}</span>
            <button
              onClick={() => removeProduct(item.id)}
              className="p-2 rounded-full text-outline hover:text-[#ff6e84] hover:bg-surface_container_highest transition-all opacity-50 group-hover:opacity-100"
              title="Remove Product"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {inventory.length === 0 && (
          <div className="py-16 text-center">
            <AlertCircle size={40} className="mx-auto text-outline_variant mb-4" />
            <p className="font-display text-2xl text-outline_variant font-bold uppercase tracking-widest">Catalog is empty.</p>
            <p className="font-body text-sm text-secondary mt-2">Add products to populate the feed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
