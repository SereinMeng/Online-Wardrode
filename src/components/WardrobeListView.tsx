import React, { useState } from "react";
import { Plus, X, Trash2, Edit2, Check, RefreshCw, Layers, Calendar, ClipboardList } from "lucide-react";
import { WardrobeItem } from "../types";

interface WardrobeListViewProps {
  items: WardrobeItem[];
  onAddItem: (item: Partial<WardrobeItem>) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onUpdateItem: (id: string, item: Partial<WardrobeItem>) => Promise<void>;
}

export default function WardrobeListView({ items, onAddItem, onDeleteItem, onUpdateItem }: WardrobeListViewProps) {
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("All");

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState<WardrobeItem["category"]>("Tops");
  const [occasion, setOccasion] = useState<WardrobeItem["occasion"]>("Casual");
  const [color, setColor] = useState("");
  const [colorHex, setColorHex] = useState("#243523");
  const [size, setSize] = useState("");
  const [material, setMaterial] = useState("");
  const [status, setStatus] = useState<WardrobeItem["status"]>("In Wardrobe");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit states
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<WardrobeItem["status"]>("In Wardrobe");

  const categories = ["All", "Tops", "Pants", "Skirts", "Coats", "Accessories"] as const;
  const occasions = ["All", "Work", "Casual", "Sport", "Date"] as const;

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);

    try {
      await onAddItem({
        name,
        brand: brand || "Unbranded",
        category,
        occasion,
        color: color || "Neutrals",
        colorHex: colorHex || "#d6cfc4",
        size: size || "Free",
        material: material || "Cotton",
        status,
        image: imageUrl.trim() || undefined
      });

      // Reset
      setName("");
      setBrand("");
      setCategory("Tops");
      setOccasion("Casual");
      setColor("");
      setColorHex("#243523");
      setSize("");
      setMaterial("");
      setStatus("In Wardrobe");
      setImageUrl("");
      setIsDrawerOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (itemId: string, newSt: WardrobeItem["status"]) => {
    try {
      await onUpdateItem(itemId, { status: newSt });
      setEditingItemId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter items logic
  const filteredItems = items.filter((item) => {
    const catMatch = selectedCategory === "All" || item.category === selectedCategory;
    const occMatch = selectedOccasion === "All" || item.occasion === selectedOccasion;
    return catMatch && occMatch;
  });

  return (
    <div id="wardrobe-viewport" className="space-y-6 relative min-h-[70vh] font-sans">
      
      {/* Search statistics summary strip */}
      <div id="wardrobe-summary-strip" className="bg-editorial-paper border border-editorial-ink/15 rounded-none p-4 flex flex-wrap items-center justify-between gap-3 shadow-none">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-editorial-ink" />
          <div>
            <span className="text-xs font-serif font-medium text-editorial-ink block">Palettes Summary</span>
            <span className="text-[10px] text-editorial-muted font-mono uppercase tracking-widest">
              {items.length} Curated Items • {items.filter(i=>i.status==="In Wardrobe").length} Available • {items.filter(i=>i.status==="In Wash").length} In Wash
            </span>
          </div>
        </div>

        {/* Trigger Drawer button */}
        <button
          id="wardrobe-open-drawer-btn"
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-editorial-ink hover:bg-transparent hover:text-editorial-ink border border-editorial-ink text-editorial-paper text-[11px] font-mono uppercase tracking-widest rounded-none transition-all cursor-pointer font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Curate New Garment (Add Item)</span>
        </button>
      </div>

      {/* FILTER BUTTON TILES GROUP, matching Editorial layout */}
      <div id="wardrobe-filters-block" className="space-y-3 bg-editorial-paper p-5 border border-editorial-ink/15 rounded-none">
        
        {/* Category filtering */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-[10px] font-mono tracking-widest text-editorial-muted uppercase min-w-[90px]">Categories:</span>
          <div className="flex flex-wrap gap-1.5 font-mono">
            {categories.map((cat) => (
              <button
                id={`filter-cat-${cat.toLowerCase()}`}
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 bg-editorial-bg border rounded-none text-[10px] uppercase tracking-wider transition-colors cursor-pointer ${
                  selectedCategory === cat 
                    ? "border-editorial-ink bg-editorial-ink text-editorial-paper font-semibold" 
                    : "border-editorial-ink/10 text-editorial-muted hover:border-editorial-ink hover:text-editorial-ink"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Occasion filtering */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-editorial-ink/10">
          <span className="text-[10px] font-mono tracking-widest text-editorial-muted uppercase min-w-[90px]">Occasions:</span>
          <div className="flex flex-wrap gap-1.5 font-mono">
            {occasions.map((occ) => (
              <button
                id={`filter-occ-${occ.toLowerCase()}`}
                key={occ}
                type="button"
                onClick={() => setSelectedOccasion(occ)}
                className={`px-3 py-1 bg-editorial-bg border rounded-none text-[10px] uppercase tracking-wider transition-colors cursor-pointer ${
                  selectedOccasion === occ 
                    ? "border-editorial-ink bg-editorial-ink text-editorial-paper font-semibold" 
                    : "border-editorial-ink/10 text-editorial-muted hover:border-editorial-ink hover:text-editorial-ink"
                }`}
              >
                {occ}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CLOTHING CARDS GRID */}
      {filteredItems.length > 0 ? (
        <div id="wardrobe-cards-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const isEditing = editingItemId === item.id;
            return (
              <div 
                id={`wardrobe-card-${item.id}`}
                key={item.id}
                className="bg-editorial-paper border border-editorial-ink/15 rounded-none overflow-hidden hover:border-editorial-ink/40 transition-all duration-300 shadow-none flex flex-col group relative"
              >
                {/* Image frame hotlink */}
                <div id={`wardrobe-card-img-frame-${item.id}`} className="relative h-[220px] bg-editorial-bg border-b border-editorial-ink/15 overflow-hidden flex items-center justify-center">
                  <img 
                    referrerPolicy="no-referrer"
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                  />
                  
                  {/* Floating tags */}
                  <span className="absolute top-3 left-3 bg-editorial-paper/90 px-2 py-0.5 border border-editorial-ink/15 rounded-none text-[8.5px] font-mono uppercase tracking-wider text-editorial-ink">
                    {item.category}
                  </span>

                  {/* Occasion rating label */}
                  <span className="absolute top-3 right-3 bg-editorial-ink text-editorial-paper px-2.5 py-0.5 rounded-none text-[8.5px] font-mono uppercase tracking-wider">
                    {item.occasion}
                  </span>

                  {/* Quick hovering operations overlay, matching Editorial theme */}
                  <div className="absolute inset-0 bg-editorial-ink/90 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2.5 p-4">
                    <span className="text-[10px] font-mono text-editorial-paper/80 uppercase tracking-widest mb-1.5">CURATOR CONTROLS</span>
                    <button
                      id={`wardrobe-quick-edit-${item.id}`}
                      type="button"
                      onClick={() => {
                        setEditingItemId(item.id);
                        setEditStatus(item.status);
                      }}
                      className="w-2/3 py-2 bg-editorial-paper hover:bg-editorial-bg text-editorial-ink rounded-none text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-none transition-transform hover:-translate-y-0.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Change Status</span>
                    </button>
                    <button
                      id={`wardrobe-quick-delete-${item.id}`}
                      type="button"
                      onClick={() => {
                        if (confirm(`Remove this ${item.name} from cloud?`)) {
                          onDeleteItem(item.id);
                        }
                      }}
                      className="w-2/3 py-2 bg-transparent hover:bg-red-900 border border-red-200/50 hover:border-red-900 text-red-200 hover:text-white rounded-none text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-none transition-transform hover:-translate-y-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>De-curate</span>
                    </button>
                  </div>
                </div>

                {/* Card contents info */}
                <div id={`wardrobe-card-info-${item.id}`} className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono tracking-widest text-editorial-muted uppercase font-semibold">
                        {item.brand}
                      </span>
                      <div className="flex items-center gap-1.5 bg-editorial-bg border border-editorial-ink/10 px-2 py-0.5 rounded-none text-[9.5px] font-mono text-editorial-ink">
                        <span>Size:</span>
                        <span className="font-semibold">{item.size}</span>
                      </div>
                    </div>
                    <h5 className="font-serif font-medium text-sm text-editorial-ink tracking-tight leading-snug pt-0.5">
                      {item.name}
                    </h5>
                    <p className="text-[10.5px] text-editorial-muted font-serif font-light italic">
                      Material: {item.material}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-editorial-ink/10">
                    {/* Color dot */}
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full border border-editorial-ink/10" style={{ backgroundColor: item.colorHex }}></span>
                      <span className="text-[10.5px] text-editorial-muted font-mono">{item.color}</span>
                    </div>

                    {/* Status Pill in Editorial Style */}
                    <div>
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <select 
                            id={`edit-item-status-select-${item.id}`}
                            value={editStatus}
                            onChange={(e) => handleStatusUpdate(item.id, e.target.value as any)}
                            className="text-[9.5px] font-mono bg-editorial-bg border border-editorial-ink/20 rounded-none px-1.5 py-0.5"
                          >
                            <option value="In Wardrobe">WARDROBE</option>
                            <option value="In Wash">WASHING</option>
                            <option value="Lent Out">LENT OUT</option>
                          </select>
                        </div>
                      ) : (
                        <span className={`px-2.5 py-0.5 border text-[9px] font-mono uppercase tracking-wider rounded-none ${
                          item.status === "In Wardrobe" ? "bg-editorial-ink/5 border-editorial-ink/25 text-editorial-ink" :
                          item.status === "In Wash" ? "bg-amber-50 border-amber-300 text-amber-800" :
                          "bg-stone-55/5 border-stone-200 text-stone-600"
                        }`}>
                          {item.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div id="wardrobe-empty-grid" className="text-center py-20 bg-editorial-paper border border-editorial-ink/15 rounded-none space-y-4">
          <ClipboardList className="w-10 h-10 text-editorial-muted/30 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-sm font-serif font-medium text-editorial-ink">No focal garments found</h4>
            <p className="text-xs text-editorial-muted max-w-xs mx-auto font-light leading-relaxed">
              No garments meet these category or occasion filters in your sanctuary.
            </p>
          </div>
          <button 
            id="wardrobe-reset-filter-btn"
            type="button" 
            onClick={() => { setSelectedCategory("All"); setSelectedOccasion("All"); }}
            className="text-xs font-mono text-editorial-ink hover:underline"
          >
            Clear Active Filters
          </button>
        </div>
      )}

      {/* CURATOR SLIDING DRAWER BACKDROP (Add New Item) */}
      {isDrawerOpen && (
        <div 
          id="wardrobe-drawer-backdrop" 
          className="fixed inset-0 bg-editorial-ink/30 backdrop-blur-xs z-50 flex justify-end"
          onClick={() => setIsDrawerOpen(false)}
        >
          {/* Drawer Panel */}
          <div 
            id="wardrobe-drawer-panel" 
            className="w-full max-w-[450px] bg-editorial-paper h-screen overflow-y-auto p-6 md:p-8 flex flex-col justify-between shadow-none border-l border-editorial-ink relative animate-slide-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div>
              <div className="flex justify-between items-center pb-5 border-b border-editorial-ink/15 mb-6">
                <div>
                  <h3 className="text-lg font-serif font-medium text-editorial-ink">
                    Curate Closet Item
                  </h3>
                  <p className="text-xs text-editorial-muted font-sans font-light">
                    Add high-quality material details to your sanctuary database.
                  </p>
                </div>
                <button 
                  id="wardrobe-close-drawer-btn"
                  type="button" 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 hover:bg-editorial-ink/5 rounded-none text-editorial-muted hover:text-editorial-ink"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form elements */}
              <form id="wardrobe-add-item-form" onSubmit={handleCreateSubmit} className="space-y-4">
                
                {/* Garment Name input */}
                <div id="drawer-field-name" className="space-y-1.5">
                  <label htmlFor="drawer-name-input" className="block text-[10.5px] font-mono tracking-wider text-editorial-muted uppercase font-medium">Garment Name</label>
                  <input 
                    id="drawer-name-input"
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Classic Silk Blouse"
                    className="w-full bg-editorial-bg text-xs text-editorial-ink px-3.5 py-2.5 rounded-none border border-editorial-ink/15 focus:outline-none focus:border-editorial-ink"
                  />
                </div>

                {/* Brand name input */}
                <div id="drawer-field-brand" className="space-y-1.5">
                  <label htmlFor="drawer-brand-input" className="block text-[10.5px] font-mono tracking-wider text-editorial-muted uppercase font-medium">Brand tag</label>
                  <input 
                    id="drawer-brand-input"
                    type="text" 
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Max Mara / Unbranded"
                    className="w-full bg-editorial-bg text-xs text-editorial-ink px-3.5 py-2.5 rounded-none border border-editorial-ink/15 focus:outline-none focus:border-editorial-ink"
                  />
                </div>

                {/* Category selectors */}
                <div id="drawer-field-category" className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="drawer-category-select" className="block text-[10.5px] font-mono tracking-wider text-editorial-muted uppercase font-medium">Category</label>
                    <select 
                      id="drawer-category-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-editorial-bg text-xs text-editorial-ink px-3 py-2.5 rounded-none border border-editorial-ink/15 focus:outline-none focus:border-editorial-ink"
                    >
                      <option value="Tops">Tops</option>
                      <option value="Pants">Pants</option>
                      <option value="Skirts">Skirts</option>
                      <option value="Coats">Coats</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="drawer-occasion-select" className="block text-[10.5px] font-mono tracking-wider text-editorial-muted uppercase font-medium">Occasion</label>
                    <select 
                      id="drawer-occasion-select"
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value as any)}
                      className="w-full bg-editorial-bg text-xs text-editorial-ink px-3 py-2.5 rounded-none border border-editorial-ink/15 focus:outline-none focus:border-editorial-ink"
                    >
                      <option value="Casual">Casual</option>
                      <option value="Work">Work</option>
                      <option value="Sport">Sport</option>
                      <option value="Date">Date</option>
                    </select>
                  </div>
                </div>

                {/* Size & Material inputs */}
                <div id="drawer-field-props" className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="drawer-size-input" className="block text-[10.5px] font-mono tracking-wider text-editorial-muted uppercase font-medium">Measurement Size</label>
                    <input 
                      id="drawer-size-input"
                      type="text" 
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      placeholder="e.g. M / 38"
                      className="w-full bg-editorial-bg text-xs text-editorial-ink px-3.5 py-2.5 rounded-none border border-editorial-ink/15 focus:outline-none focus:border-editorial-ink"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="drawer-material-input" className="block text-[10.5px] font-mono tracking-wider text-editorial-muted uppercase font-medium">Material Fibre</label>
                    <input 
                      id="drawer-material-input"
                      type="text" 
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      placeholder="e.g. Mulberry Silk"
                      className="w-full bg-editorial-bg text-xs text-editorial-ink px-3.5 py-2.5 rounded-none border border-editorial-ink/15 focus:outline-none focus:border-editorial-ink"
                    />
                  </div>
                </div>

                {/* Color Name and Color Hex picker */}
                <div id="drawer-field-color" className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="drawer-color-input" className="block text-[10.5px] font-mono tracking-wider text-editorial-muted uppercase font-medium">Aura Color Name</label>
                    <input 
                      id="drawer-color-input"
                      type="text" 
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="e.g. Sage Green"
                      className="w-full bg-editorial-bg text-xs text-editorial-ink px-3.5 py-2.5 rounded-none border border-editorial-ink/15 focus:outline-none focus:border-editorial-ink"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="drawer-color-hex" className="block text-[10.5px] font-mono tracking-wider text-editorial-muted uppercase font-medium">Acoustic Hex Selection</label>
                    <div className="flex items-center gap-2">
                      <input 
                        id="drawer-color-hex"
                        type="color" 
                        value={colorHex}
                        onChange={(e) => setColorHex(e.target.value)}
                        className="w-10 h-8 p-0 rounded-none border border-editorial-ink/15 cursor-pointer bg-transparent"
                      />
                      <span className="text-[10px] font-mono text-editorial-muted">{colorHex}</span>
                    </div>
                  </div>
                </div>

                {/* Hotlink Image URL input */}
                <div id="drawer-field-image" className="space-y-1.5">
                  <label htmlFor="drawer-image-input" className="block text-[10.5px] font-mono tracking-wider text-editorial-muted uppercase font-medium">Aura Hotlink Image URL</label>
                  <input 
                    id="drawer-image-input"
                    type="url" 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... (optional)"
                    className="w-full bg-editorial-bg text-xs text-editorial-ink px-3.5 py-2.5 rounded-none border border-editorial-ink/15 focus:outline-none font-mono"
                  />
                  <span className="text-[9.5px] text-editorial-muted/80 block font-serif font-light italic">
                    If left blank, a gorgeous premium stock cover photo will be resolved automatically.
                  </span>
                </div>

                {/* Status selector */}
                <div id="drawer-field-status" className="space-y-1.5">
                  <label htmlFor="drawer-status-select" className="block text-[10.5px] font-mono tracking-wider text-editorial-muted uppercase font-medium">Initial Status</label>
                  <select 
                    id="drawer-status-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-editorial-bg text-xs text-editorial-ink px-3 py-2.5 rounded-none border border-editorial-ink/15 focus:outline-none focus:border-editorial-ink"
                  >
                    <option value="In Wardrobe">In Wardrobe (Available)</option>
                    <option value="In Wash">In Wash (Washing Cycle)</option>
                    <option value="Lent Out">Lent Out (Active lease)</option>
                  </select>
                </div>

                {/* Submit inside Drawer */}
                <button
                  id="drawer-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 bg-editorial-ink hover:bg-transparent hover:text-editorial-ink border border-editorial-ink text-editorial-paper text-xs font-mono uppercase tracking-widest py-3.5 rounded-none transition-all cursor-pointer font-medium"
                >
                  {isSubmitting ? "Syncing..." : "Curate & Commit to Closet"}
                </button>

              </form>
            </div>

            {/* Note */}
            <div className="pt-6 border-t border-editorial-ink/10 text-center">
              <span className="text-[9px] text-editorial-muted font-mono tracking-widest uppercase block">Warm Curator Design Code</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
