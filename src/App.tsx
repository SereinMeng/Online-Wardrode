import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import PersonalCenter from "./components/PersonalCenter";
import WardrobeListView from "./components/WardrobeListView";
import StylingCanvas from "./components/StylingCanvas";
import AITipsView from "./components/AITipsView";
import GlobalSearchOverview from "./components/GlobalSearchOverview";
import { WardrobeItem, Outfit, RecommendationLog } from "./types";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [curatorName, setCuratorName] = useState("AURA Curator");
  const [activeTab, setActiveTab] = useState<"personal-center" | "wardrobe" | "styling" | "ai-tips">("personal-center");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Lists state synced from server
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [logs, setLogs] = useState<RecommendationLog[]>([
    {
      id: "log-1",
      time: "14:23:45",
      action: "Seasonal style matching advice (Summer / Casual)",
      model: "gemini-3.5-flash",
      length: "512 chars",
      status: "SUCCESS"
    },
    {
      id: "log-2",
      time: "10:15:02",
      action: "Work clothing coordination tips (Autumn / Work)",
      model: "gemini-3.5-flash",
      length: "720 chars",
      status: "SUCCESS"
    }
  ]);

  // Handle load state
  useEffect(() => {
    if (isLoggedIn) {
      fetchItems();
      fetchOutfits();
    }
  }, [isLoggedIn]);

  // Quick keyboard shortcuts e.g. cmd+k to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/items");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Error fetching garments:", err);
    }
  };

  const fetchOutfits = async () => {
    try {
      const res = await fetch("/api/outfits");
      const data = await res.json();
      setOutfits(data);
    } catch (err) {
      console.error("Error fetching outlines:", err);
    }
  };

  const handleAddItem = async (itemDetails: Partial<WardrobeItem>) => {
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemDetails)
      });
      if (res.ok) {
        await fetchItems();
      }
    } catch (err) {
      console.error("Error adding garment:", err);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/items/${itemId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        await fetchItems();
      }
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const handleUpdateItem = async (itemId: string, updatedFields: Partial<WardrobeItem>) => {
    try {
      const res = await fetch(`/api/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        await fetchItems();
      }
    } catch (err) {
      console.error("Error updating item status:", err);
    }
  };

  const handleAddOutfit = async (outfitDetails: Partial<Outfit>) => {
    try {
      const res = await fetch("/api/outfits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(outfitDetails)
      });
      if (res.ok) {
        await fetchOutfits();
      }
    } catch (err) {
      console.error("Error curating outfit compilation:", err);
    }
  };

  const handleDeleteOutfit = async (outfitId: string) => {
    try {
      const res = await fetch(`/api/outfits/${outfitId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        await fetchOutfits();
      }
    } catch (err) {
      console.error("Error removing outfit:", err);
    }
  };

  const handleAddRecommendationLog = (action: string, model: string, length: string, status: "SUCCESS" | "FAILED") => {
    const timeStr = new Date().toTimeString().split(" ")[0];
    const newLog: RecommendationLog = {
      id: "log-" + Date.now(),
      time: timeStr,
      action,
      model,
      length,
      status
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleSearchSelectItem = (item: WardrobeItem) => {
    setActiveTab("wardrobe");
    // Optionally focus scroll. Handled cleanly.
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={(name) => { setCuratorName(name); setIsLoggedIn(true); }} />;
  }

  return (
    <div id="aura-applet-root" className="min-h-screen flex flex-col md:flex-row bg-editorial-bg text-editorial-ink font-sans overflow-x-hidden antialiased">
      
      {/* Navigation Left Rail */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={(tab) => setActiveTab(tab)} 
        onLogout={handleLogout} 
      />

      {/* Main app panel wrapper */}
      <div id="aura-main-container" className="flex-1 flex flex-col min-w-0">
        
        {/* Global Toolbar Header */}
        <Header 
          activeTab={activeTab} 
          onSearchClick={() => setIsSearchOpen(true)} 
          curatorName={curatorName} 
        />

        {/* Focal contents, switching tabs seamlessly with custom fade layout transitions */}
        <main id="aura-vistas-wrapper" className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="h-full"
            >
              {activeTab === "personal-center" && (
                <PersonalCenter 
                  curatorName={curatorName} 
                  onUpdateName={(name) => setCuratorName(name)} 
                />
              )}

              {activeTab === "wardrobe" && (
                <WardrobeListView 
                  items={items}
                  onAddItem={handleAddItem}
                  onDeleteItem={handleDeleteItem}
                  onUpdateItem={handleUpdateItem}
                />
              )}

              {activeTab === "styling" && (
                <StylingCanvas 
                  items={items}
                  outfits={outfits}
                  onAddOutfit={handleAddOutfit}
                  onDeleteOutfit={handleDeleteOutfit}
                />
              )}

              {activeTab === "ai-tips" && (
                <AITipsView 
                  items={items}
                  logs={logs}
                  onAddLog={handleAddRecommendationLog}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Search dialog backdrop modal */}
      <GlobalSearchOverview 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        items={items}
        onSelectItem={handleSearchSelectItem}
      />
    </div>
  );
}
