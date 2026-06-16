import React from "react";
import { User, Library, Sparkles, Sliders, LogOut, Heart } from "lucide-react";

interface SidebarProps {
  activeTab: "personal-center" | "wardrobe" | "styling" | "ai-tips";
  onTabChange: (tab: "personal-center" | "wardrobe" | "styling" | "ai-tips") => void;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, onTabChange, onLogout }: SidebarProps) {
  const menuItems = [
    {
      id: "personal-center",
      label: "Personal Center",
      cnLabel: "个人安全中心",
      icon: User
    },
    {
      id: "wardrobe",
      label: "My Wardrobe",
      cnLabel: "衣橱单品清单",
      icon: Library
    },
    {
      id: "styling",
      label: "Outfit Styling",
      cnLabel: "穿搭灵感看板",
      icon: Sliders
    },
    {
      id: "ai-tips",
      label: "AI Styling Tips",
      cnLabel: "智能美学穿搭",
      icon: Sparkles
    }
  ] as const;

  return (
    <aside 
      id="app-sidebar-container" 
      className="w-full md:w-[260px] bg-editorial-paper text-editorial-ink flex flex-col p-6 border-b md:border-b-0 md:border-r border-editorial-ink/15 shrink-0 select-none z-30 font-sans"
    >
      {/* Brand logo top section, matches Editorial Aesthetic */}
      <div id="sidebar-brand-group" className="flex items-center gap-3 mb-10 pb-6 border-b border-editorial-ink/10">
        <div id="sidebar-logo-circle" className="w-10 h-10 rounded-none bg-editorial-ink flex items-center justify-center border border-editorial-ink">
          <Sparkles className="w-5 h-5 text-editorial-paper" />
        </div>
        <div>
          <h1 id="sidebar-brand-name" className="text-base font-serif font-medium tracking-tight text-editorial-ink">
            Aura Wardrobe
          </h1>
          <p id="sidebar-brand-sub" className="text-[9.5px] font-mono tracking-wider text-editorial-muted uppercase">
            Curator Sanctuary
          </p>
        </div>
      </div>

      {/* Navigation list */}
      <nav id="sidebar-navigation-nav" className="flex-1 space-y-1.5">
        <span className="text-[9px] font-mono tracking-[0.25em] text-editorial-muted/70 uppercase block mb-3 pl-3">Sanctuary Vistas</span>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              id={`sidebar-tab-button-${item.id}`}
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-none text-left cursor-pointer transition-all duration-200 group relative ${
                isActive 
                  ? "bg-editorial-ink text-editorial-paper border border-editorial-ink shadow-none" 
                  : "text-editorial-ink/75 hover:text-editorial-ink hover:bg-editorial-ink/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? "text-editorial-paper" : "text-editorial-muted group-hover:text-editorial-ink"}`} />
                <div className="flex flex-col">
                  <span className="text-xs font-serif font-medium tracking-wide">{item.label}</span>
                  <span className="text-[8.5px] font-mono tracking-widest text-[#8e8d8a]/70 mt-0.5 uppercase">{item.cnLabel}</span>
                </div>
              </div>
              
              {isActive && (
                <div id={`sidebar-active-dot-${item.id}`} className="w-1.5 h-1.5 bg-editorial-paper shadow-sm"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar footer curator metadata */}
      <div id="sidebar-curator-footer" className="mt-auto pt-6 border-t border-editorial-ink/10 space-y-3.5">
        <div id="sidebar-meta-status" className="flex items-center gap-2 px-3">
          <span className="relative flex h-1.5 w-1.5 bg-editorial-ink"></span>
          <span className="text-[10px] font-mono text-editorial-muted tracking-wider uppercase">SECURE IDENTITY SANCTUARY</span>
        </div>

        {/* Log Out button */}
        <button
          id="sidebar-logout-trigger"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-none text-xs font-mono tracking-wider text-editorial-ink hover:text-editorial-paper bg-transparent hover:bg-editorial-ink border border-editorial-ink transition-all cursor-pointer font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Wardrobe (Logout)</span>
        </button>

        <div className="text-center">
          <span className="text-[9px] font-mono text-editorial-muted/60">AURA v1.0 • Made with Care</span>
        </div>
      </div>
    </aside>
  );
}
