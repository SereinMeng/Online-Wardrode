import React, { useState } from "react";
import { Sliders, Sparkles, Trash2, Library, Check, Layers, AlertCircle, Plus } from "lucide-react";
import { WardrobeItem, Outfit } from "../types";

interface StylingCanvasProps {
  items: WardrobeItem[];
  outfits: Outfit[];
  onAddOutfit: (outfit: Partial<Outfit>) => Promise<void>;
  onDeleteOutfit: (id: string) => Promise<void>;
}

export default function StylingCanvas({ items, outfits, onAddOutfit, onDeleteOutfit }: StylingCanvasProps) {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(["item-3", "item-2"]); // Prepopulate with coat & jeans
  const [outfitName, setOutfitName] = useState("");
  const [outfitDesc, setOutfitDesc] = useState("");
  const [outfitSeason, setOutfitSeason] = useState<Outfit["season"]>("Autumn");
  const [outfitTags, setOutfitTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleToggleItemInCanvas = (itemId: string) => {
    if (selectedItemIds.includes(itemId)) {
      setSelectedItemIds(selectedItemIds.filter((id) => id !== itemId));
    } else {
      setSelectedItemIds([...selectedItemIds, itemId]);
    }
  };

  const handleClearCanvas = () => {
    setSelectedItemIds([]);
    setFeedback("Canvas cleared.");
    setTimeout(() => setFeedback(""), 3000);
  };

  const handleSaveOutfitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!outfitName.trim()) {
      setFeedback("Please assign a Title to this visual compilation.");
      return;
    }
    if (selectedItemIds.length === 0) {
      setFeedback("Please select or add at least 1 closet item to compile.");
      return;
    }
    setIsSubmitting(true);
    setFeedback("");

    try {
      const parsedTags = outfitTags
        ? outfitTags.split(",").map((t) => t.trim())
        : ["Casual"];

      await onAddOutfit({
        name: outfitName,
        description: outfitDesc || "Aesthetic visual layout curated inside board.",
        itemIds: selectedItemIds,
        season: outfitSeason,
        tags: parsedTags
      });

      setFeedback("SUCCESS: Curated outfit saved inside your collections!");
      setOutfitName("");
      setOutfitDesc("");
      setOutfitTags("");
      setSelectedItemIds([]);
      setTimeout(() => setFeedback(""), 4000);
    } catch (err) {
      setFeedback("Error curating outfit.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current active images inside canvas for absolute layering
  const activeCanvasItems = items.filter((i) => selectedItemIds.includes(i.id));

  return (
    <div id="styling-canvas-viewport" className="grid grid-cols-1 lg:grid-cols-12 gap-8 select-none font-sans">
      
      {/* LEFT SECTION (Interactive Canvas collage box & form) */}
      <div id="sc-canvas-left" className="lg:col-span-8 space-y-6">
        
        {/* Visual board container */}
        <div id="sc-interactive-board" className="bg-editorial-bg border border-editorial-ink/15 rounded-none p-6 relative min-h-[420px] md:min-h-[460px] flex flex-col justify-between overflow-hidden shadow-none">
          
          {/* Subtle background gridded markers, matching screenshot styling */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-5 pointer-events-none">
            {Array.from({ length: 36 }).map((_, idx) => (
              <div key={idx} className="border-r border-b border-editorial-ink border-dashed"></div>
            ))}
          </div>

          <div className="relative z-10 flex justify-between items-center pb-3 border-b border-editorial-ink/10">
            <span className="text-[10px] font-mono tracking-widest text-editorial-ink uppercase font-semibold">COLLAGE ACTIVE SCREENBOARD</span>
            <span className="text-[9.5px] bg-editorial-ink text-editorial-paper px-2 py-0.5 rounded-none font-mono">
              Layers: {selectedItemIds.length} items
            </span>
          </div>

          {/* Absolute layers overlap visual canvas section, replicating hanger coat and jeans */}
          <div id="sc-layers-backdrop" className="relative-1 flex-1 flex items-center justify-center py-6">
            {activeCanvasItems.length > 0 ? (
              <div className="relative w-full max-w-[340px] h-[300px] flex items-center justify-center">
                {activeCanvasItems.map((item, idx) => {
                  // Replicate absolute styling mockup positions
                  const offsets = [
                    { scale: "scale-100", rotate: "rotate-0", z: "z-30", translate: "translate-x-0 translate-y-0" },
                    { scale: "scale-90", rotate: "rotate-3", z: "z-20", translate: "translate-x-12 translate-y-4" },
                    { scale: "scale-85", rotate: "-6", z: "z-10", translate: "-translate-x-12 translate-y-8" },
                    { scale: "scale-80", rotate: "rotate-12", z: "z-0", translate: "translate-y-12" }
                  ];
                  const offset = offsets[idx % offsets.length];

                  return (
                    <div 
                      id={`canvas-layer-garment-${item.id}`}
                      key={item.id}
                      className={`absolute w-44 md:w-48 bg-editorial-paper border border-editorial-ink rounded-none p-2.5 shadow-none transition-all duration-300 hover:scale-104 ${offset.z} ${offset.scale} ${offset.rotate} ${offset.translate}`}
                    >
                      <div className="w-full h-32 rounded-none overflow-hidden bg-editorial-bg border border-editorial-ink/10">
                        <img 
                          referrerPolicy="no-referrer"
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="pt-2 text-center">
                        <span className="text-[10px] font-serif font-medium text-editorial-ink block truncate">{item.name}</span>
                        <span className="text-[8.5px] font-mono text-editorial-muted capitalize">{item.material}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div id="canvas-empty-splash" className="text-center py-16 space-y-3">
                <Layers className="w-10 h-10 text-editorial-muted/30 mx-auto animate-pulse" />
                <p className="text-xs text-editorial-muted max-w-sm mx-auto font-light leading-relaxed font-sans">
                  Your board is unoccupied. Pick matching elements from the <b>Item Pool</b> list below to overlay garments onto this collage.
                </p>
              </div>
            )}
          </div>

          {/* Quick Clear controls under canvas */}
          <div className="relative z-10 flex justify-between items-center pt-3 border-t border-editorial-ink/10">
            <span className="text-[9.5px] text-editorial-muted font-mono italic">
              *Drag layers locally or select items above
            </span>
            <button
              id="sc-clear-btn"
              type="button"
              onClick={handleClearCanvas}
              className="px-3.5 py-1.5 bg-editorial-paper hover:bg-red-50 hover:text-red-700 text-editorial-ink text-[10px] font-mono uppercase tracking-widest rounded-none transition-colors border border-editorial-ink/20 cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Canvas board</span>
            </button>
          </div>
        </div>

        {/* METADATA OUTFIT SAVE FORM */}
        <div id="sc-metadata-box" className="bg-editorial-paper border border-editorial-ink/15 rounded-none p-6 shadow-none">
          <div className="pb-4 border-b border-editorial-ink/10 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-editorial-ink" />
            <h4 className="text-xs font-mono tracking-widest text-editorial-ink uppercase">PERSIST CURATED LOOK TO COLLECTIONS</h4>
          </div>

          <form id="sc-outfit-form" onSubmit={handleSaveOutfitSubmit} className="space-y-4">
            
            {feedback && (
              <div id="sc-feedback-alert" className={`p-3 text-xs rounded-none flex items-center gap-2.5 font-mono ${feedback.includes("SUCCESS") ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-red-50 border border-red-200 text-red-800"}`}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-1">
                <label htmlFor="sc-outfit-name" className="block text-[10px] font-mono tracking-wider text-editorial-muted uppercase font-medium">Outfit Title</label>
                <input 
                  id="sc-outfit-name"
                  type="text" 
                  value={outfitName}
                  onChange={(e) => setOutfitName(e.target.value)}
                  placeholder="e.g. City Minimalist Evening"
                  className="w-full bg-editorial-bg text-xs text-editorial-ink px-3.5 py-2.5 rounded-none border border-editorial-ink/15 focus:outline-none focus:border-editorial-ink"
                />
              </div>

              <div className="space-y-1.5 col-span-1">
                <label htmlFor="sc-outfit-season" className="block text-[10px] font-mono tracking-wider text-editorial-muted uppercase font-medium">Season focus</label>
                <select 
                  id="sc-outfit-season"
                  value={outfitSeason}
                  onChange={(e) => setOutfitSeason(e.target.value as any)}
                  className="w-full bg-editorial-bg text-xs text-editorial-ink px-3 py-2.5 rounded-none border border-editorial-ink/15 focus:outline-none focus:border-editorial-ink"
                >
                  <option value="Spring">Spring / 春季</option>
                  <option value="Summer">Summer / 夏季</option>
                  <option value="Autumn">Autumn / 秋季</option>
                  <option value="Winter">Winter / 冬季</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="sc-outfit-tags" className="block text-[10px] font-mono tracking-wider text-editorial-muted uppercase font-medium">Styles Tags (comma separated)</label>
              <input 
                id="sc-outfit-tags"
                type="text" 
                value={outfitTags}
                onChange={(e) => setOutfitTags(e.target.value)}
                placeholder="e.g. Work, Elegant, Frequent"
                className="w-full bg-editorial-bg text-xs text-editorial-ink px-3.5 py-2.5 rounded-none border border-editorial-ink/15 focus:outline-none focus:border-editorial-ink"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="sc-outfit-desc" className="block text-[10px] font-mono tracking-wider text-editorial-muted uppercase font-medium">Sensory description</label>
              <textarea 
                id="sc-outfit-desc"
                rows={2}
                value={outfitDesc}
                onChange={(e) => setOutfitDesc(e.target.value)}
                placeholder="Brief notes about the styling layout (e.g., Casual Fridays at studio)..."
                className="w-full bg-editorial-bg text-xs text-editorial-ink px-3.5 py-2.5 rounded-none border border-editorial-ink/15 focus:outline-none focus:border-editorial-ink resize-none font-sans"
              ></textarea>
            </div>

            <button
              id="sc-outfit-submit"
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-3 bg-editorial-ink hover:bg-transparent hover:text-editorial-ink border border-editorial-ink text-editorial-paper text-[11px] font-mono uppercase tracking-widest rounded-none transition-all cursor-pointer font-medium"
            >
              Curate & Save Look
            </button>
          </form>
        </div>

      </div>

      {/* RIGHT SIDEBAR (Garment Item Pool & Saved Outfits List) */}
      <div id="sc-sidebar-right" className="lg:col-span-4 space-y-6">
        
        {/* Item pick pool selection */}
        <div id="sc-pool-card" className="bg-editorial-paper border border-editorial-ink/15 rounded-none p-5 shadow-none space-y-4 font-sans">
          <div className="pb-3 border-b border-editorial-ink/10">
            <span className="text-[10px] font-mono tracking-widest text-editorial-ink uppercase font-semibold">GARMENTS POOL</span>
            <p className="text-[10px] text-editorial-muted font-sans font-light mt-0.5">Toggle elements into visual collage.</p>
          </div>

          <div id="sc-pool-grid" className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto scrollbar-thin pr-1">
            {items.map((item) => {
              const active = selectedItemIds.includes(item.id);
              return (
                <div 
                  id={`pool-item-${item.id}`}
                  key={item.id}
                  onClick={() => handleToggleItemInCanvas(item.id)}
                  className={`border rounded-none p-2 cursor-pointer transition-all flex items-center gap-2 ${
                    active 
                      ? "border-editorial-ink bg-editorial-ink/5" 
                      : "border-editorial-ink/10 bg-editorial-bg hover:bg-editorial-ink/5"
                  }`}
                >
                  <div className="w-10 h-10 rounded-none overflow-hidden bg-white border border-editorial-ink/10 flex-shrink-0">
                    <img 
                      referrerPolicy="no-referrer"
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10.5px] text-editorial-ink block truncate font-serif font-medium leading-tight">{item.name}</span>
                    <span className="text-[9px] text-editorial-muted font-mono">{item.brand}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Saved Visual Collections List */}
        <div id="sc-collections-card" className="bg-editorial-paper border border-editorial-ink/15 rounded-none p-5 shadow-none space-y-4">
          <div className="pb-3 border-b border-editorial-ink/10 mb-1.5 flex justify-between items-center">
            <span className="text-[10px] font-mono tracking-widest text-editorial-ink uppercase font-semibold">SAVED COMPILATIONS</span>
            <span className="text-[9.5px] bg-editorial-ink text-editorial-paper px-2 rounded-none font-mono">
              {outfits.length} looks
            </span>
          </div>

          <div id="sc-collections-list" className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
            {outfits.map((outfit) => (
              <div 
                id={`sc-saved-outfit-card-${outfit.id}`}
                key={outfit.id}
                className="border border-editorial-ink/10 bg-editorial-bg rounded-none p-3 space-y-2 relative group hover:border-editorial-ink/40 transition-colors"
              >
                {/* Visual indicator of overlapped clothes icons */}
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-serif font-medium text-editorial-ink truncate pr-8">{outfit.name}</h5>
                  <button
                    id={`sc-delete-outfit-${outfit.id}`}
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove compilation "${outfit.name}"?`)) {
                        onDeleteOutfit(outfit.id);
                      }
                    }}
                    className="absolute top-2.5 right-2.5 text-editorial-muted/50 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[10px] text-editorial-muted leading-tight font-serif italic">{outfit.description}</p>
                
                <div className="flex flex-wrap gap-1 font-mono">
                  <span className="px-1.5 py-0.5 bg-editorial-ink text-editorial-paper text-[8.5px] rounded-none uppercase">{outfit.season}</span>
                  {outfit.tags.map(t => (
                    <span key={t} className="px-1.5 py-0.5 bg-editorial-paper border border-editorial-ink/5 text-editorial-muted text-[8.5px] font-sans rounded-none font-sans">#{t}</span>
                  ))}
                </div>

                {/* Overlapped circle items icon rows */}
                <div className="flex -space-x-1.5 pt-1 overflow-hidden">
                  {outfit.itemIds.map((itemId) => {
                    const matchItem = items.find(i => i.id === itemId);
                    if (!matchItem) return null;
                    return (
                      <div key={itemId} className="w-6 h-6 rounded-none border border-editorial-paper bg-white overflow-hidden shadow-none" title={matchItem.name}>
                        <img referrerPolicy="no-referrer" src={matchItem.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
