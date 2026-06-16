import React, { useState } from "react";
import { Sparkles, RefreshCw, Calendar, Heart, TrendingUp, History, User, CheckCircle, Database, AlertCircle } from "lucide-react";
import { WardrobeItem, RecommendationLog } from "../types";

interface AITipsViewProps {
  items: WardrobeItem[];
  logs: RecommendationLog[];
  onAddLog: (action: string, model: string, length: string, status: "SUCCESS" | "FAILED") => void;
}

export default function AITipsView({ items, logs, onAddLog }: AITipsViewProps) {
  const [advice, setAdvice] = useState<string>(`### 🌿 温暖极简美学搭配建议

通过对您当前衣橱包含 **White Linen Shirt**, **Wool Camel Coat** 及其他精致配件的分析，推荐以下今日搭配方案：

* **法式慵懒轻商务**: 
  使用您的 **White Linen Shirt**，下半身搭配经典的 **Straight Denim** 丹宁裤。领口稍微敞开，带上一条极其简单的金色 **Gold Pendant Necklace**，再配以 Polène 墨玉色 **Leather Tote** 承重托底。这组搭配不仅呈现出冷暖色彩的精妙对比，也为日常通勤赋予了极其舒适、松弛的感觉。

* **微温差温润层搭**: 
  若傍晚气温下降，可直接在外披上 **Wool Camel Coat** 驼色大衣。大衣的沉稳与衬衫和牛仔裤的轻灵相得益彰，烘托出您高贵淡雅的美学气场。`);

  const [isLoading, setIsLoading] = useState(false);
  const [season, setSeason] = useState<"Spring" | "Summer" | "Autumn" | "Winter">("Summer");
  const [occasion, setOccasion] = useState<"Casual" | "Work" | "Sport" | "Date">("Casual");

  const handleFetchAdvice = async () => {
    setIsLoading(true);
    const prevTimeStr = new Date().toTimeString().split(" ")[0];
    try {
      const response = await fetch("/api/gemini/tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, season, occasion })
      });
      const data = await response.json();
      setAdvice(data.advice);
      onAddLog(
        `Seasonal advice (${season} / ${occasion})`,
        "gemini-3.5-flash",
        `${data.advice.length} chars`,
        "SUCCESS"
      );
    } catch (e) {
      console.error(e);
      onAddLog(
        `Seasonal advice (${season} / ${occasion})`,
        "gemini-3.5-flash",
        "0 chars",
        "FAILED"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Simple, robust custom Markdown-to-HTML parser function to render beautiful outputs safely in React 19 without risk of breaking dependencies
  const renderAdviceAsHtml = (text: string) => {
    return text.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("###")) {
        return (
          <h4 key={idx} className="text-sm font-serif tracking-tight font-medium text-editorial-ink mt-4 mb-2 flex items-center gap-2">
            <span className="w-1 h-3 bg-editorial-ink"></span>
            {trimmed.replace("###", "").trim()}
          </h4>
        );
      }
      if (trimmed.startsWith("##")) {
        return (
          <h3 key={idx} className="text-base font-serif font-medium text-editorial-ink mt-5 mb-2 border-b border-editorial-ink/15 pb-1">
            {trimmed.replace("##", "").trim()}
          </h3>
        );
      }
      if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
        // Find bold elements
        let innerText = trimmed.substring(1).trim();
        return (
          <li key={idx} className="text-xs text-editorial-ink leading-relaxed font-light ml-4 list-disc mb-1.5 font-serif">
            {parseBoldText(innerText)}
          </li>
        );
      }
      if (trimmed.startsWith("1.") || trimmed.startsWith("2.") || trimmed.startsWith("3.")) {
        return (
          <li key={idx} className="text-xs text-editorial-ink leading-relaxed font-light ml-4 list-decimal mb-1.5 font-serif">
            {parseBoldText(trimmed.substring(2).trim())}
          </li>
        );
      }
      if (trimmed === "") {
        return <div key={idx} className="h-2"></div>;
      }
      return (
        <p key={idx} className="text-xs text-editorial-ink leading-relaxed font-light mb-2 font-serif">
          {parseBoldText(trimmed)}
        </p>
      );
    });
  };

  const parseBoldText = (text: string) => {
    const regex = /\*\*(.*?)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(<strong key={match.index} className="font-serif font-bold text-editorial-ink">{match[1]}</strong>);
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts.length > 0 ? parts : text;
  };

  return (
    <div id="ai-tips-viewport" className="space-y-8 select-none font-sans">
      
      {/* HEADER ADVICE PROMPTER PANEL */}
      <div id="ai-advice-prompter" className="bg-editorial-paper border border-editorial-ink/15 rounded-none p-6 shadow-none flex flex-col md:flex-row items-stretch gap-6">
        
        {/* Left configurations inputs */}
        <div className="w-full md:w-[280px] p-5 bg-editorial-bg border border-editorial-ink/10 rounded-none flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-editorial-ink uppercase font-semibold">ADVICE CONFIGURES</span>
            
            <div className="space-y-1">
              <label htmlFor="ai-select-season" className="text-[9.5px] font-mono text-editorial-muted uppercase">Season Anchor</label>
              <select 
                id="ai-select-season"
                value={season}
                onChange={(e) => setSeason(e.target.value as any)}
                className="w-full bg-editorial-paper text-xs text-editorial-ink rounded-none border border-editorial-ink/15 py-2.5 px-3 focus:outline-none"
              >
                <option value="Summer">Summer / 暖热夏季</option>
                <option value="Spring">Spring / 温和春季</option>
                <option value="Autumn">Autumn / 凉爽秋季</option>
                <option value="Winter">Winter / 严寒冬季</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="ai-select-occasion" className="text-[9.5px] font-mono text-editorial-muted uppercase">Scenario Occasion</label>
              <select 
                id="ai-select-occasion"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value as any)}
                className="w-full bg-editorial-paper text-xs text-editorial-ink rounded-none border border-editorial-ink/15 py-2.5 px-3 focus:outline-none"
              >
                <option value="Casual">Casual / 慵懒日常</option>
                <option value="Work">Work / 通勤洽谈</option>
                <option value="Sport">Sport / 活力运动</option>
                <option value="Date">Date / 精致约会</option>
              </select>
            </div>
          </div>

          <button
            id="ai-generate-advice-btn"
            type="button"
            onClick={handleFetchAdvice}
            disabled={isLoading}
            className="w-full py-3.5 bg-editorial-ink hover:bg-transparent hover:text-editorial-ink border border-editorial-ink text-editorial-paper text-xs font-mono uppercase tracking-widest rounded-none transition-all cursor-pointer flex items-center justify-center gap-2 font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? "Consulting Neural..." : "Update Advice"}</span>
          </button>
        </div>

        {/* Right Advice Rendering Pane */}
        <div id="ai-advice-display-pane" className="flex-1 bg-editorial-paper border border-editorial-ink/15 rounded-none p-6 flex flex-col justify-between max-h-[360px] overflow-y-auto scrollbar-thin">
          <div className="space-y-3">
            {renderAdviceAsHtml(advice)}
          </div>
        </div>
      </div>

      {/* RULE-BASED MATCHING CARDS (Matches Screenshot 5 middle section) */}
      <div id="ai-rules-recommendations" className="space-y-4">
        <div className="flex items-center justify-between border-b border-editorial-ink/10 pb-2">
          <span className="text-[10px] font-mono tracking-widest text-editorial-ink uppercase font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-editorial-ink" />
            AURA SEASONAL MATCHES
          </span>
          <span className="text-[10px] text-editorial-muted font-sans font-light">Custom match confidence based on materials</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          {/* Match 1 */}
          <div id="ai-rule-card-1" className="bg-editorial-paper border border-editorial-ink/15 rounded-none p-4 space-y-3 shadow-none hover:border-editorial-ink/30 transition-colors">
            <div className="h-44 bg-editorial-bg rounded-none overflow-hidden relative border border-editorial-ink/10">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnPgPrRlnZUwwktfqUlAKS-zN5MFZu7mv3D_hCVhAM51IaCn2DXxwUZ6MbYoVRJhglJkcEi7wnMLskREe4jxdTq-xGrEW2RMnQvb-FPzRdK3hg4olockCVAYOlbji4Hyqi0rfd9F7eB3Trc7vW8L4JAreI-rLDbZ3qBRd3FsqhJag5tkhfjXK5YEDJtDnCJDGzlIVoJtkzbifCsXPCdJ_xX5jfnvGwI7q3wgMRPYEeYrVVJDPyWMnCm1PFZqIJ_BT-B8KNfvvj4IA" 
                alt="Linen & Denim Flat Lay" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 right-2.5 bg-editorial-ink text-editorial-paper text-[9.5px] font-mono px-2.5 py-0.5 rounded-none border border-editorial-ink">
                95% MATCH
              </span>
            </div>
            <div>
              <span className="text-[9.5px] text-editorial-muted font-mono uppercase tracking-wider block">CLOSET MATCH</span>
              <h5 className="text-xs font-serif font-medium text-editorial-ink mt-0.5">Linen Shirt + Classic Indigo Denim</h5>
              <p className="text-[10.5px] text-editorial-muted font-serif font-light leading-relaxed mt-1 italic">
                A highly porous organic outfit layout engineered for mid-summer humidity blocks.
              </p>
            </div>
          </div>

          {/* Match 2 */}
          <div id="ai-rule-card-2" className="bg-editorial-paper border border-editorial-ink/15 rounded-none p-4 space-y-3 shadow-none hover:border-editorial-ink/30 transition-colors">
            <div className="h-44 bg-editorial-bg rounded-none overflow-hidden relative border border-editorial-ink/10">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7gWUL901kjZ6JDzjUK-cYF0-tnHJDZ0vN-_0W5bLWq8VhC-Y0EapXqV3Dn7tW1zj8zVR2oHHgNN0Ig2Jh32xrmIDB89WlF_19_DzeJfJt0HxRJCkQF6JAlP8L7o1wRrenAE4BymaPL-aderLFgE6n1UkpI1dYuF7k0-EokYJ9P81Rf_cnR1VIb9yKO7YnoXW9ssdIr9KeB2E2YrLcG67akfLeh7-9fdME542zXSNpFcoV6DTWvG1ncfTaeN6COl1zRqcaG5B5kBY" 
                alt="Ivory Silk look" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 right-2.5 bg-editorial-ink text-editorial-paper text-[9.5px] font-mono px-2.5 py-0.5 rounded-none border border-editorial-ink">
                92% MATCH
              </span>
            </div>
            <div>
              <span className="text-[9.5px] text-editorial-muted font-mono uppercase tracking-wider block">CURATIVE BLOUSE DETAILED</span>
              <h5 className="text-xs font-serif font-medium text-editorial-ink mt-0.5">Mulberry Sage Blouse + Pleated Pants</h5>
              <p className="text-[10.5px] text-editorial-muted font-serif font-light leading-relaxed mt-1 italic">
                Refined flowing textures suitable for gallery exhibitions and twilight meetings.
              </p>
            </div>
          </div>

          {/* Match 3 */}
          <div id="ai-rule-card-3" className="bg-editorial-paper border border-editorial-ink/15 rounded-none p-4 space-y-3 shadow-none hover:border-editorial-ink/30 transition-colors">
            <div className="h-44 bg-editorial-bg rounded-none overflow-hidden relative border border-editorial-ink/10">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD01EdHU4vqimlUOSWlMubrIvQ80Cosv5W0STeFaUqEJ2xoxcFgBJ-wiz3WuZUy0nYTUmZHZCq8a9ejOsjOzl7G9yamnOyPJ37BQkFxDpe4qQ_19OCVDehCH72ihphwE_ImAGLQIEFx4Bipo0DPt4-a4i1onqn96BUFEBEmizU5xVRQ0-_bFGmitrKdxkAeChtfBwKxnjM2XSwEVVjxy_zMrXv1d00wVeLFQ6KXL8_f3iQYg29Vbk-dF-ixIm4Lil3J7Z_2OeI6SkM" 
                alt="Dried rose rose knit layering" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 right-2.5 bg-editorial-ink text-editorial-paper text-[9.5px] font-mono px-2.5 py-0.5 rounded-none border border-editorial-ink">
                88% MATCH
              </span>
            </div>
            <div>
              <span className="text-[9.5px] text-editorial-muted font-mono uppercase tracking-wider block">KNITS & DRAPES LAYERS</span>
              <h5 className="text-xs font-serif font-medium text-editorial-ink mt-0.5">Dried Rose Layered Knit Set</h5>
              <p className="text-[10.5px] text-editorial-muted font-serif font-light leading-relaxed mt-1 italic">
                Subtle muted pink wool blends that introduce tactile warmth and gentle shadows.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SIMILAR USERS' TRENDING COMPILES */}
      <div id="ai-curators-trends" className="space-y-4">
        <div className="flex items-center justify-between border-b border-editorial-ink/10 pb-2">
          <span className="text-[10px] font-mono tracking-widest text-editorial-ink uppercase font-semibold flex items-center gap-2">
            <User className="w-4 h-4 text-editorial-ink" />
            CURATING CO-HABITANTS INSPIRATIONS
          </span>
          <span className="text-[10px] text-editorial-muted font-sans font-light">Designs popular within similar wardrobes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
          {/* Trend 1 */}
          <div id="ai-trend-1" className="flex items-center gap-3.5 bg-editorial-paper border border-editorial-ink/15 rounded-none p-3 shadow-none">
            <div className="w-16 h-16 rounded-none overflow-hidden bg-editorial-bg border border-editorial-ink/10 flex-shrink-0">
              <img 
                referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvsh_-qMta4W1VISpDhIT1d_Wm89aXNFprubuLDc-m-R3H_FVLnNLG6lVNyAcoPABwQAnkLezAZqyqdAnprCkWlVc2ZM9qnXjJJ2mxn_onjG3u_BVzmgq6k-cfuASewutEFuzNena5eCkXEroLCsw4tqW5CQFCq6kABZ_m5yYnv6rUrvK0HDSA8U1ieR_U0Akz1WEr1n1FgnRoVBwpvNBrqQ5C7aYjwGFUkkm-INvxDuybH_GUL5CsvwUx3U9BK6oZwXTbSncmHfM" 
                alt="Professional Navy Blazer look" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h6 className="text-[11.5px] font-serif font-medium text-editorial-ink truncate">Modern Professional</h6>
              <div className="flex items-center gap-1.5 text-[9.5px] text-editorial-muted font-mono mt-0.5">
                <span>Likes: 1.2k</span>
                <span>•</span>
                <span className="text-editorial-ink bg-editorial-ink/5 px-1 py-0.5">3 active</span>
              </div>
            </div>
          </div>

          {/* Trend 2 */}
          <div id="ai-trend-2" className="flex items-center gap-3.5 bg-editorial-paper border border-editorial-ink/15 rounded-none p-3 shadow-none">
            <div className="w-16 h-16 rounded-none overflow-hidden bg-editorial-bg border border-editorial-ink/10 flex-shrink-0">
              <img 
                referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVADq4IgQklpD3VjutPL7zFR2980hzxkUwB-snyLOs8u1qvud2zjPnNspOtnIUVqTIzjV0vKH0pP26eettq-fws3F2XZ1WUg5nm6LXkEtLjrcYYK1E9oAL_7Q6cKnVVbotG9BOWPvqaB1EB-7d2Ka3VywKqb9Y5RRYZbLW5x62L4ekQZTSQHAk4Z-vCrgkiWv3dB0hJEsKpgr72fxjeSCfTbcMuuoaCm1qDCR8ltxRmuPU2sx12bQBbM9dyBmi8rtE4KXyu08-hXM" 
                alt="Summer Garden Dress" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h6 className="text-[11.5px] font-serif font-medium text-editorial-ink truncate">Summer Garden Straw look</h6>
              <div className="flex items-center gap-1.5 text-[9.5px] text-editorial-muted font-mono mt-0.5">
                <span>Likes: 845</span>
                <span>•</span>
                <span className="text-editorial-ink bg-editorial-ink/5 px-1 py-0.5">5 active</span>
              </div>
            </div>
          </div>

          {/* Trend 3 */}
          <div id="ai-trend-3" className="flex items-center gap-3.5 bg-editorial-paper border border-editorial-ink/15 rounded-none p-3 shadow-none">
            <div className="w-16 h-16 rounded-none overflow-hidden bg-editorial-bg border border-editorial-ink/10 flex-shrink-0">
              <img 
                referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcz-eoDXrrxeP_wf7fVruocoYFUWu2BKu4eX04Mg3TJiH_kcWeLf2DymnZQIZ68v7acAEaxmfIfX-zSjwzB_-zirxD2BP6JSg8neRGf3fQxljSmZLK5kv9Uf2NUEfVD2osQlcJHp82NMHauICHWseKsB2S7UMu4wCC29KOy3y8lXn3nttsENMkdiR513Geb7DBxvLoxBoxVc5ctMYo-dx54NWVRfJKurz3LLrrNQg8MGo-HDBwtuquR1SSmdGsoTJlKS1-EZluZdM" 
                alt="Streetwear Leather jacket" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h6 className="text-[11.5px] font-serif font-medium text-editorial-ink truncate">Minimalist Streetwear Leather</h6>
              <div className="flex items-center gap-1.5 text-[9.5px] text-editorial-muted font-mono mt-0.5">
                <span>Likes: 2.1k</span>
                <span>•</span>
                <span className="text-editorial-ink bg-editorial-ink/5 px-1 py-0.5">2 active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RECOMMENDATION LOGS LIST TABLE (Matching Screenshot 5 bottom logs list) */}
      <div id="ai-recommendations-logger" className="space-y-3.5">
        <div className="flex items-center gap-2 border-b border-editorial-ink/10 pb-2">
          <History className="w-4 h-4 text-editorial-ink" />
          <span className="text-[10px] font-mono tracking-widest text-editorial-ink uppercase font-semibold">RECOMMENDATION LOG REVIEW</span>
        </div>

        <div className="bg-editorial-paper border border-editorial-ink/15 rounded-none overflow-hidden shadow-none">
          <table id="logs-history-table" className="w-full min-w-[500px] border-collapse text-left text-[11px] font-mono">
            <thead className="bg-editorial-bg border-b border-editorial-ink/15 text-editorial-ink">
              <tr>
                <th className="p-3.5 pl-5 font-semibold text-editorial-ink">Time stamp</th>
                <th className="p-3.5 font-semibold text-editorial-ink">Action Scope</th>
                <th className="p-3.5 font-semibold text-editorial-ink">Model name</th>
                <th className="p-3.5 font-semibold text-editorial-ink">Output length</th>
                <th className="p-3.5 pr-5 font-semibold text-editorial-ink text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-editorial-ink/10">
              {logs.map((log) => (
                <tr id={`log-row-${log.id}`} key={log.id} className="hover:bg-editorial-bg/50 transition-colors">
                  <td className="p-3.5 pl-5 text-editorial-muted">{log.time}</td>
                  <td className="p-3.5 text-editorial-ink font-serif">{log.action}</td>
                  <td className="p-3.5 text-editorial-ink italic">{log.model}</td>
                  <td className="p-3.5 text-editorial-muted">{log.length}</td>
                  <td className="p-3.5 pr-5 text-right font-mono">
                    <span className={`inline-block px-2 py-0.5 rounded-none text-[8.5px] uppercase font-semibold border ${
                      log.status === "SUCCESS" 
                        ? "bg-editorial-bg border-editorial-ink/30 text-editorial-ink" 
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
