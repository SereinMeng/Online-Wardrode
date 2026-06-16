export interface WardrobeItem {
  id: string;
  name: string;
  brand: string;
  category: "Tops" | "Pants" | "Skirts" | "Coats" | "Accessories";
  color: string;
  colorHex: string;
  image: string;
  size: string;
  material: string;
  occasion: "Work" | "Casual" | "Sport" | "Date";
  purchaseDate: string;
  status: "In Wardrobe" | "In Wash" | "Lent Out";
}

export interface Outfit {
  id: string;
  name: string;
  description: string;
  itemIds: string[];
  tags: string[];
  season: "Spring" | "Summer" | "Autumn" | "Winter";
}

export interface RecommendationLog {
  id: string;
  time: string;
  action: string;
  model: string;
  length: string;
  status: "SUCCESS" | "FAILED";
}
