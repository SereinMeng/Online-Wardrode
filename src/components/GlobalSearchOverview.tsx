import React, { useState, useEffect } from "react";
import { Search, X, Clock, Trash2, ArrowRight } from "lucide-react";
import { WardrobeItem } from "../types";

interface GlobalSearchOverviewProps {
  isOpen: boolean;
  onClose: () => void;
  items: WardrobeItem[];
  onSelectItem: (item: WardrobeItem) => void;
}

export default function GlobalSearchOverview({ isOpen, onClose, items, onSelectItem }: GlobalSearchOverviewProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Items");
  const [history, setHistory] = useState<string[]>([
    "Linen Shirt",
    "Wool Coat",
    "Polène Bag"
  ]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter items by query & tab category
  const filteredItems = items.filter((item) => {
    // text match
    const matchesQuery = 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.brand.toLowerCase().includes(query.toLowerCase()) ||
      item.material.toLowerCase().includes(query.toLowerCase()) ||
      item.occasion.toLowerCase().includes(query.toLowerCase()) ||
      item.color.toLowerCase().includes(query.toLowerCase());

    // category tag filter
    if (selectedCategory === "All Items") return matchesQuery;
    return matchesQuery && item.category === selectedCategory;
  });

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleRemoveHistoryItem = (itemToRemove: string) => {
    setHistory(history.filter((h) => h !== itemToRemove));
  };

  const handleHistoryClick = (searchVal: string) => {
    setQuery(searchVal);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !history.includes(query.trim())) {
      setHistory([query.trim(), ...history.slice(0, 4)]);
    }
  };

  // Group items by category to match screenshot grouped style
  const categoriesInResults = Array.from(new Set(filteredItems.map(item => item.category)));
  return (
    <div 
      id="global-search-overlay" 
      className="fixed inset-0 bg-editorial-ink/30 backdrop-blur-sm z-50 flex justify-center items-start pt-[8vh] px-4 md:px-0 transition-all duration-300"
      onClick={onClose}
    >
      <div 
        id="global-search-modal"
        className="w-full max-w-[680px] bg-editorial-paper border border-editorial-ink rounded-none overflow-hidden shadow-none flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header container */}
        <div id="search-modal-header" className="p-5 border-b border-editorial-ink/10">
          <form id="search-bar-form" onSubmit={handleFormSubmit} className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-4 text-editorial-ink" />
            <input 
              id="global-search-text-input"
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search wardrobe, brand tags, materials, occasions..."
              className="w-full bg-editorial-bg pl-12 pr-12 py-3.5 text-xs text-editorial-ink rounded-none border border-editorial-ink/15 focus:outline-none focus:border-editorial-ink focus:ring-0 transition-all font-sans"
            />
            {query && (
              <button 
                id="search-clear-input-btn"
                type="button" 
                onClick={() => setQuery("")}
                className="absolute right-12 text-editorial-muted hover:text-editorial-ink transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button 
              id="search-close-modal-btn"
              type="button"
              onClick={onClose}
              className="absolute right-4 text-editorial-ink hover:bg-editorial-ink/5 p-1 rounded-none transition-all"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </form>

          {/* Quick tab filters inside Search, resembling screenshot tags */}
          <div id="search-tag-filters" className="flex flex-wrap gap-1.5 mt-4">
            {["All Items", "Tops", "Pants", "Coats", "Accessories"].map((cat) => {
              const count = cat === "All Items" 
                ? items.length 
                : items.filter(i => i.category === cat).length;
              const isActive = selectedCategory === cat;
              return (
                <button
                  id={`search-tab-${cat.toLowerCase().replace(" ", "-")}`}
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-none text-[10px] font-mono tracking-widest transition-colors ${isActive ? "bg-editorial-ink text-editorial-paper" : "bg-editorial-bg text-editorial-muted border border-editorial-ink/10 hover:bg-editorial-ink/5"}`}
                >
                  {cat === "All Items" ? "All Items" : cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Search contents scroll container */}
        <div id="search-results-viewport" className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          
          {/* History records matching Screenshot 5 */}
          {history.length > 0 && !query && (
            <div id="search-history-box" className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-editorial-muted uppercase">Recent Search History</span>
                <button 
                  id="search-clear-histories-btn"
                  type="button" 
                  onClick={handleClearHistory}
                  className="text-[9.5px] font-mono text-editorial-ink hover:underline uppercase flex items-center gap-1.5"
                >
                  Clear history <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <div id="search-history-chips" className="flex flex-wrap gap-2">
                {history.map((hItem, index) => (
                  <div 
                    id={`search-history-chip-${index}`}
                    key={hItem}
                    className="flex items-center gap-1 bg-editorial-bg border border-editorial-ink/10 px-3 py-1.5 rounded-none text-xs hover:border-editorial-ink transition-colors group cursor-pointer"
                  >
                    <span 
                      id={`search-history-click-${index}`}
                      onClick={() => handleHistoryClick(hItem)}
                      className="text-xs text-editorial-muted group-hover:text-editorial-ink font-sans"
                    >
                      {hItem}
                    </span>
                    <button 
                      id={`search-history-delete-${index}`}
                      type="button"
                      onClick={() => handleRemoveHistoryItem(hItem)}
                      className="text-editorial-muted/40 hover:text-red-700 p-0.5"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results grouped blocks */}
          {filteredItems.length > 0 ? (
            <div id="search-results-list" className="space-y-5">
              <span className="text-[10px] font-mono tracking-widest text-editorial-muted uppercase block">
                {query ? `Search Results (${filteredItems.length})` : "Curated Closet Quick Guide"}
              </span>

              {categoriesInResults.map((catName) => {
                const grouped = filteredItems.filter(i => i.category === catName);
                return (
                  <div id={`search-group-${catName.toLowerCase()}`} key={catName} className="space-y-2">
                    <h4 className="text-[10px] font-mono tracking-widest text-editorial-ink uppercase flex items-center gap-2">
                      <span className="w-1 h-3 bg-editorial-ink rounded-none inline-block"></span>
                      {catName}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {grouped.map((item) => (
                        <div 
                          id={`search-item-${item.id}`}
                          key={item.id}
                          onClick={() => {
                            onSelectItem(item);
                            onClose();
                          }}
                          className="flex items-center gap-3 p-2.5 bg-editorial-bg border border-editorial-ink/10 hover:border-editorial-ink rounded-none cursor-pointer transition-all shadow-none group"
                        >
                          <div className="w-12 h-12 rounded-none overflow-hidden bg-editorial-bg border border-editorial-ink/10 flex-shrink-0 flex items-center justify-center">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-serif font-medium text-editorial-ink block truncate group-hover:text-editorial-ink transition-colors">
                              {item.name}
                            </span>
                            <div className="flex items-center gap-1.5 text-[9.5px] text-editorial-muted font-mono mt-0.5">
                              <span>{item.brand}</span>
                              <span className="text-editorial-ink/20">•</span>
                              <span className="capitalize">{item.material}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="inline-block px-2 py-0.5 bg-editorial-paper border border-editorial-ink/10 rounded-none text-[8.5px] font-mono text-editorial-muted">
                              {item.size}
                            </span>
                            <div className="flex items-center gap-1 justify-end mt-1 text-[9px] font-mono">
                              <span className="w-1.5 h-1.5 rounded-none border border-editorial-ink/20" style={{ backgroundColor: item.colorHex }}></span>
                              <span className="text-editorial-muted">{item.color}</span>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-editorial-ink opacity-0 group-hover:opacity-100 transition-all transform translate-x-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div id="search-empty-state" className="text-center py-12 space-y-3">
              <span className="text-3xl text-editorial-muted/40">🔍</span>
              <p className="text-xs text-editorial-muted font-light font-sans">No garments match "{query}" in Aura sanctuary.</p>
              <button 
                id="search-reset-empty-btn"
                type="button"
                onClick={() => { setQuery(""); setSelectedCategory("All Items"); }}
                className="text-xs font-mono text-editorial-ink hover:underline"
              >
                Reset tags filter
              </button>
            </div>
          )}
        </div>

        {/* Footer tip bar */}
        <div id="search-modal-footer" className="p-4 bg-editorial-bg border-t border-editorial-ink/10 text-center">
          <span className="text-[9.5px] text-editorial-muted font-mono">
            💡 Press <b className="font-semibold text-editorial-ink">Esc</b> to exits search. Tap any item card to focalizing zoom.
          </span>
        </div>
      </div>
    </div>
  );
}
