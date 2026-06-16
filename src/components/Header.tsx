import React from "react";
import { Search, Bell, Sparkles } from "lucide-react";

interface HeaderProps {
  activeTab: "personal-center" | "wardrobe" | "styling" | "ai-tips";
  onSearchClick: () => void;
  curatorName: string;
}

export default function Header({ activeTab, onSearchClick, curatorName }: HeaderProps) {
  const getTabTitleAndSub = () => {
    switch (activeTab) {
      case "personal-center":
        return {
          title: "Personal Security Centre",
          sub: "Configure your digital wardrobe identity credentials & preferences."
        };
      case "wardrobe":
        return {
          title: "My Digital Closet Inventory",
          sub: "Browse and catalog your conscious clothing collections, fabrics and status."
        };
      case "styling":
        return {
          title: "Outfit Styling Board",
          sub: "Curate aesthetic garments onto our mood-board canvas to save looks."
        };
      case "ai-tips":
        return {
          title: "AI Curated styling Tips",
          sub: "Converse with our neural counselor for seasonal aesthetics suggestions."
        };
    }
  };

  const { title, sub } = getTabTitleAndSub();

  return (
    <header 
      id="app-header-container" 
      className="bg-editorial-paper border-b border-editorial-ink/10 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 select-none font-sans"
    >
      {/* Title block */}
      <div id="header-text-block" className="text-center sm:text-left">
        <h2 id="header-main-title" className="text-lg md:text-xl font-serif font-medium text-editorial-ink tracking-tight">
          {title}
        </h2>
        <p id="header-main-subtitle" className="text-[11px] text-editorial-muted font-light mt-0.5 italic">
          {sub}
        </p>
      </div>

      {/* Middle/Right Quick Bar */}
      <div id="header-actions-group" className="flex items-center gap-4 w-full sm:w-auto justify-end">
        {/* Trigger Search Box directly */}
        <div 
          id="header-search-trigger"
          onClick={onSearchClick}
          className="relative max-w-xs w-full sm:w-[220px] bg-editorial-bg hover:bg-editorial-bg/85 border border-editorial-ink/15 rounded-none px-3.5 py-2 flex items-center justify-between cursor-pointer transition-all hover:border-editorial-ink group"
        >
          <div className="flex items-center gap-2 text-editorial-muted group-hover:text-editorial-ink">
            <Search className="w-3.5 h-3.5" />
            <span className="text-[10.5px] font-sans">Search closet...</span>
          </div>
          <span className="text-[8.5px] bg-[#1a1a1a]/5 px-1.5 py-0.5 border border-stone-200 text-editorial-muted rounded-none font-mono">⌘K</span>
        </div>

        {/* Ambient notification pill */}
        <div id="header-notif-circle" className="relative p-2 hover:bg-editorial-bg rounded-none cursor-not-allowed text-editorial-muted transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-editorial-ink"></span>
        </div>

        {/* Curator ID & Avatar */}
        <div id="header-identity-pill" className="flex items-center gap-2.5 pl-3 border-l border-editorial-ink/10">
          <div className="text-right hidden md:block">
            <span id="header-curator-name" className="text-xs font-serif font-medium text-editorial-ink block">
              {curatorName}
            </span>
            <span className="text-[8.5px] font-mono tracking-wider text-editorial-muted uppercase block">
              Authorized Curator
            </span>
          </div>

          <div id="header-avatar-frame" className="w-9 h-9 rounded-none overflow-hidden border border-editorial-ink/50 shadow-sm flex-shrink-0 bg-[#f5f3ee]">
            <img 
              referrerPolicy="no-referrer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAEoHSzx-U9nM8P9uvLH5HwHQUy8t1nnQ4dfCWAeyiocAs7kTgzy7OOMxfoYjSl3itATgFz--cpfzSAEL9mlKOboxHL4SFqRBOR2kfeSz4gCZeN2W5D6eP_5G3PgDvPLZokC-PBWWrHw3XruH4CVy-XJhCaaHreTH1yMA1xpOdltQsR1D_ROyRkXnevIOU0E82FxlxVq3aoomZgz8SSW98KMx6GGXywdy-7J_cSC56LJOVlctUeNr8RaG_wI9_cj-KY_XSMj71TA8" 
              alt="Curator Avatar Pic" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
