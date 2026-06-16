import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

// Default hardcoded wardrobe items (pre-populated)
interface WardrobeItem {
  id: string;
  name: string;
  brand: string;
  category: "Tops" | "Pants" | "Skirts" | "Coats" | "Accessories";
  color: string; // name
  colorHex: string; // hex
  image: string;
  size: string;
  material: string;
  occasion: "Work" | "Casual" | "Sport" | "Date";
  purchaseDate: string;
  status: "In Wardrobe" | "In Wash" | "Lent Out";
}

interface Outfit {
  id: string;
  name: string;
  description: string;
  itemIds: string[];
  tags: string[]; // e.g. Work, Evening, etc
  season: "Spring" | "Summer" | "Autumn" | "Winter";
}

let items: WardrobeItem[] = [
  {
    id: "item-1",
    name: "White Linen Shirt",
    brand: "Zara",
    category: "Tops",
    color: "White",
    colorHex: "#ffffff",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4CUX0lQwXsLdAKvqnTLv1wLY3GuQIRUlUYQYl-hr3S8OlJypB4anCTLb_kT4qLZ0GNCXLNeqWAx2vdy95vu41DNeNxl4s9nDxcDHaludN078FGQqufAssYC5UdCpMgBrroyJacRXUeFpqG6fv0a_6qLm1HmRmqXoRRYIj_qJkwHU7Fd0-d_DjS6kMrE65B25gJoQOjxgJENDIFRTx7tD6x7L70l3uAC-AhMzkkNnZxArTfaIFggd2G97SFa2ugj7qihpGMdjDPVQ",
    size: "M",
    material: "Linen",
    occasion: "Casual",
    purchaseDate: "2026-05-15",
    status: "In Wardrobe"
  },
  {
    id: "item-2",
    name: "Straight Denim",
    brand: "Levi's",
    category: "Pants",
    color: "Navy",
    colorHex: "#1e3a8a",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ651SZoY3kPyXJx_Cq503d4-AGA0oP8kvXKz5VYzrId7pV4cmmYtGamDUvi21nU3FCqWgbhrd-_shDN225ByrFCTeQwnezyBxE0AZZx6KbPTSt5P-0hsPJx_yZRAD9iO_MTteCutTegyGE36UmdxsjtBclSSuO6fpHlQqV1LkzjQ2_yD8ajke-LNfenGKVx7bPnGJDYXSSUe2CDvsuG8B7yGnqE8FVuFRF04KpSnlk1Coe7pez-b0fb5UUZrIhzZs5l5UiAAo0tY",
    size: "S",
    material: "Cotton / Denim",
    occasion: "Casual",
    purchaseDate: "2026-04-10",
    status: "In Wardrobe"
  },
  {
    id: "item-3",
    name: "Wool Camel Coat",
    brand: "Max Mara",
    category: "Coats",
    color: "Camel",
    colorHex: "#C19A6B",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCD-ELnHx9aSBCjd0E54GqCmjnv1B6UTP7koT4PI8k-YOS99C-RydMTxOGvyYxExitqXULxAGnftxXPyB4BYPCSda_BlMkmrFQq1ga2RvUIy1wPWR3vc-OIt8Jz4ZC7Pyu84XfP_hwIKgFj5osSj6LUI_A6elOz80eeDf_ff0GrHye-De71PgF8aiWy97xCTrshK_ysZe9mNbeeIK41CaX5Z8sWI1tR5_MeoUbmfsoQ0NA7ALH9WXpJ0S3VleSHmKCTFUX_U_91Q08",
    size: "L",
    material: "Premium Wool",
    occasion: "Work",
    purchaseDate: "2025-11-20",
    status: "In Wardrobe"
  },
  {
    id: "item-4",
    name: "Leather Tote",
    brand: "Polène",
    category: "Accessories",
    color: "Charcoal",
    colorHex: "#27272a",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5hTtII-ipOo1w-QjBLuAPeCDitAb-7iPu_UZKpN7EUixWVuLYqY35hdH4HHRKnVKkVvZLPiQuvMMgu-YrqYUsI1GcezH-dTJBZqw2MEM73WYOfdRUFkfOXDVJ5a4QJy2Cjfh6KcPDtUr7fCbxVjqNlGBui1gBmxjhXSqmSJx4WhTwtM-V4nXSrLvirhQiBpT1FgIisyQnnwAeFRL_jhi2je2EDww4x9YbQECc8rYMihZvnfvS34PaNrYeIX-Iq8QPCj7CAbatAV4",
    size: "Free",
    material: "Leather",
    occasion: "Work",
    purchaseDate: "2026-01-05",
    status: "In Wardrobe"
  },
  {
    id: "item-5",
    name: "Classic Black Tee",
    brand: "Uniqlo",
    category: "Tops",
    color: "Black",
    colorHex: "#000000",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYgF2kNoyMduyR3LPmm-PH4j2Uf-pklUpsqubKj-dbcz695UoLYCduu99ZqziEdxV229RZFOaU7FJWGwKC6G98n6SUNcFQdcxUWMv4eluuLbDaSyokRaz4RaJhnr-bA2slWActWADniZPSf_e3xIOqOWT9Z218P7DtQh35vVNzJvZcCZMlSdUW4whP7899VBTf9PklDJ9EmRuCDJu_PHq3tOvIwvC0EukBnxLetCG4Qjam_-R49fKk-7SswqPj3MLS7l0czW84Zlg",
    size: "M",
    material: "Cotton",
    occasion: "Casual",
    purchaseDate: "2026-05-10",
    status: "In Wash"
  },
  {
    id: "item-6",
    name: "Pleated Trousers",
    brand: "COS",
    category: "Pants",
    color: "Cream",
    colorHex: "#f5f3ee",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuALZtnt6fu8UfN_MSrf8YL-adxj73OoGVNf8EpKgyYoR3lShoxjbhigh5FYvUUAIJPa1jS85HRiPu5wmVrachHcgymlgE1PSSv3sE8R_PtTmGYaBaZVsb6t9tABlfcEIArpU2-a7QyEu_vRaSNE8b1sNqhDaWzKH-c5HtsWiZqtdiiL8i01HkH006zxmADkEFgtYPfA-T_l8LRolw9CCPT0yc6hn22hhu1uYXQ-iUHsSu7MXykbes5KrS4soHaOupTaesDbnMXFIRw",
    size: "S",
    material: "Wool/Polyester",
    occasion: "Work",
    purchaseDate: "2026-03-24",
    status: "In Wardrobe"
  },
  {
    id: "item-7",
    name: "White Leather Sneakers",
    brand: "Common Projects",
    category: "Accessories",
    color: "White",
    colorHex: "#ffffff",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3VxVtZqUkKl71ftDoCKfTROj89U9UFddFUjJsUUfpjeEIIOZzNaUmau1AGUruD5pHe83Cj6oFKt60ntL02dhGVGBF16LrlIoIhb6_xg1kX9El3bNgqlzpyiQbjIlkwLasSVL8IkUYVR24suTEfKU_1BizQRNGqwqsxRuW7-u2FK79kuGwdiWC2K6fe_fUjnOFwBdXPDAv9FjchDL6zpOmGRt41YexW6CTimf5nyjzSHUCGJZtOsQUqa4suAUyrGY2TGcxgcC3IlU",
    size: "38",
    material: "Soft Leather",
    occasion: "Casual",
    purchaseDate: "2025-08-30",
    status: "In Wardrobe"
  },
  {
    id: "item-8",
    name: "Gold Pendant Necklace",
    brand: "Mejuri",
    category: "Accessories",
    color: "Gold",
    colorHex: "#eab308",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9afEFX2k2RDo7PBYcB-V-sJr09kFBgedyloR7XMkPSKdsHa9duRs6n6mPlWKuIqhaqDwwQRoENOW4iRA108js_AVzgNCLPf6kapaph4LAx6jwdklAR5xCH_cmMfDuLfBNTZvP8fCqiK38AhRYCyEe3hJMD5MhBEJNXlqyZI_8_XniHpSE3TtS2vf1IkM74_4wbsYw7n9W5V2IP2qMiwoBwiHKOM63mf3Lmrr2zvIyNMkOu9BJ8O8rAR3mvJ5S0YGH1c3fPHS1Ncw",
    size: "Free",
    material: "14k Gold",
    occasion: "Date",
    purchaseDate: "2026-02-14",
    status: "In Wardrobe"
  }
];

let outfits: Outfit[] = [
  {
    id: "outfit-1",
    name: "City Minimalist",
    description: "A clean silhouette for gallery openings and coffee dates.",
    itemIds: ["item-3", "item-2"],
    tags: ["Work", "Evening", "Frequent"],
    season: "Autumn"
  },
  {
    id: "outfit-2",
    name: "Casual Friday Luxe",
    description: "The perfect balance of comfort and refined style.",
    itemIds: ["item-5", "item-6", "item-7"],
    tags: ["Work", "Casual"],
    season: "Spring"
  },
  {
    id: "outfit-3",
    name: "Morning Breeze",
    description: "Light fabrics and simple gold accents for ease.",
    itemIds: ["item-1", "item-8"],
    tags: ["Casual", "Date"],
    season: "Summer"
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Log level
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // Clothing Items API routes
  app.get("/api/items", (req, res) => {
    res.json(items);
  });

  app.post("/api/items", (req, res) => {
    const newItem: WardrobeItem = {
      id: "item-" + Date.now(),
      name: req.body.name || "Untitled Item",
      brand: req.body.brand || "Unknown Brand",
      category: req.body.category || "Tops",
      color: req.body.color || "Earthy",
      colorHex: req.body.colorHex || "#526442",
      image: req.body.image || "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400",
      size: req.body.size || "Free Size",
      material: req.body.material || "Linen Blend",
      occasion: req.body.occasion || "Casual",
      purchaseDate: req.body.purchaseDate || new Date().toISOString().split("T")[0],
      status: req.body.status || "In Wardrobe"
    };

    items.push(newItem);
    res.status(201).json(newItem);
  });

  app.put("/api/items/:id", (req, res) => {
    const id = req.params.id;
    const index = items.findIndex((i) => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...req.body };
      res.json(items[index]);
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  });

  app.delete("/api/items/:id", (req, res) => {
    const id = req.params.id;
    const initialLength = items.length;
    items = items.filter((i) => i.id !== id);
    if (items.length < initialLength) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  });

  // Outfits API routes
  app.get("/api/outfits", (req, res) => {
    res.json(outfits);
  });

  app.post("/api/outfits", (req, res) => {
    const newOutfit: Outfit = {
      id: "outfit-" + Date.now(),
      name: req.body.name || "Untitled Outfit",
      description: req.body.description || "Beautifully curated look.",
      itemIds: req.body.itemIds || [],
      tags: req.body.tags || ["Casual"],
      season: req.body.season || "Autumn"
    };

    outfits.push(newOutfit);
    res.status(201).json(newOutfit);
  });

  app.delete("/api/outfits/:id", (req, res) => {
    const id = req.params.id;
    const initialLength = outfits.length;
    outfits = outfits.filter((o) => o.id !== id);
    if (outfits.length < initialLength) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Outfit not found" });
    }
  });

  // AI tips route
  app.post("/api/gemini/tips", async (req, res) => {
    try {
      const activeItems = req.body.items || items;
      const season = req.body.season || "Summer";
      const occasion = req.body.occasion || "Casual";

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        console.log("No valid API Key found. Returning mock rule-based styling advice.");
        return res.json({
          advice: `### 🌿 温暖极简美学搭配建议 (${season}季 / ${occasion}场合)

根据您衣橱中的高品质单品，我们推荐以下穿搭灵感：

1. **经典质感之选**:
   使用您的 **White Linen Shirt**，搭配 **Pleated Trousers** 或经典 **Straight Denim**。将衬衫扣子半开，挽起袖子，增添呼吸感，展现法式松弛感。

2. **配饰点睛**:
   佩戴精致的手工金色 **Gold Pendant Necklace**，提亮颈部，配以 **Leather Tote** 承重托底。这种冷暖、硬朗与柔软的对比正是 **Warm Curator** 美学的缩影。

3. **应对温差的层搭**:
   在微凉的时段，可随意将您的 **Wool Camel Coat** 披在肩上，形成具有纵深感和空间感的视觉层搭。

*温馨提示: 保持全身不超过3种主色调，以维持数字避难所的纯净与平静感受。*`
        });
      }

      // Initialize server-side GoogleGenAI client (with mandated custom User-Agent)
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const clothesPrompt = activeItems
        .map((i: WardrobeItem) => `- ${i.name} (${i.brand}, ${i.category}, 颜色:${i.color}, 材质:${i.material})`)
        .join("\n");

      const promptHtml = `You are a warm minimalist luxury fashion stylist.
The user has the following clothing items in their wardrobe:
${clothesPrompt}

Generate customized, friendly, and elegant styling recommendations (in Chinese) for the season: "${season}" and occasion: "${occasion}".
Focus on a warm, organic, and calm aesthetic (the "Warm Curator" brand identity), with a clean structure, rich ideas, and beautiful Markdown typography. Mention some of their real items above specifically. Don't add telemetry or system variables in the output. Keep to 2-3 paragraphs.`;

      const geminiResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptHtml,
        config: {
          temperature: 1
        }
      });

      res.json({
        advice: geminiResponse.text || "未能获取智能穿搭建议，请稍后再试。"
      });
    } catch (e: any) {
      console.error("Gemini Recommendation generate error: ", e);
      res.json({
        advice: `### 🌿 温暖极简美学穿搭建议

无法连接到智能大脑，已为您激活美学直觉顾问：

* 建议使用 **White Linen Shirt** 搭配经典的 100% 纯棉 **Straight Denim**，袖子轻微挽起。
* 佩戴极简金色 **Gold Pendant Necklace**。这能够打破纯白色的平淡感，带来绝佳的午后慵懒法式风情。
* 整体颜色保持在温润的米白、复古丹宁蓝、以及温暖驼色，呼应 **Warm Curator** 松弛高雅的设计核心。`
      });
    }
  });

  // Serve static files / Vite SPA
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
