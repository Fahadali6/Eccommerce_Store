import { PRODUCTS } from "./data";
import type { Product } from "@/types";

const SYNONYMS: Record<string, string[]> = {
  bag:        ["backpack","tote","briefcase","duffel","folio","clutch","satchel","hobo"],
  work:       ["office","professional","commuter","business","briefcase","executive"],
  travel:     ["transit","weekender","journey","trip","luggage","duffel"],
  gym:        ["sport","training","fitness","workout","duffel","athletic"],
  laptop:     ["computer","notebook","macbook","folio","sleeve","tech"],
  ladies:     ["women","woman","female","handbag","purse","clutch","quilted"],
  backpack:   ["rucksack","pack","daypack","hiking","commuter"],
  fashion:    ["style","trendy","crossbody","shoulder","chic"],
  leather:    ["full-grain","pebbled","vegan","italian","genuine","suede"],
  waterproof: ["water-resistant","weatherproof","rain","ripstop"],
  cheap:      ["affordable","budget","value","economical"],
  premium:    ["luxury","high-end","quality","designer","exclusive"],
};

export function smartSearch(query: string): Product[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const terms = new Set<string>([q]);
  Object.entries(SYNONYMS).forEach(([k, vals]) => {
    if (q.includes(k)) vals.forEach(v => terms.add(v));
    vals.forEach(v => { if (q.includes(v)) terms.add(k); });
  });
  return PRODUCTS.map(p => {
    const blob = [p.name, p.category, p.material, p.color, ...p.tags, p.description].join(" ").toLowerCase();
    let score = 0;
    terms.forEach(t => {
      if (p.name.toLowerCase().includes(t)) score += 40;
      else if (p.category.toLowerCase().includes(t)) score += 25;
      else if (p.tags.some(tag => tag.toLowerCase().includes(t))) score += 20;
      else if (blob.includes(t)) score += 5;
    });
    return { ...p, _score: score };
  })
  .filter(p => (p as Product & { _score: number })._score > 0)
  .sort((a, b) => (b as Product & { _score: number })._score - (a as Product & { _score: number })._score)
  .slice(0, 6);
}

export function getRecommendations(opts: {
  current?: Product | null;
  viewed?: Product[];
  cart?: Product[];
  limit?: number;
}): Product[] {
  const { current, viewed = [], cart = [], limit = 4 } = opts;
  return PRODUCTS
    .filter(p => p.id !== current?.id)
    .map(p => {
      let s = 0;
      if (current) {
        if (p.category === current.category) s += 30;
        if (p.material === current.material)  s += 20;
        s += p.tags.filter(t => current.tags.includes(t)).length * 10;
        const diff = Math.abs(p.price - current.price);
        s += diff < 50 ? 15 : diff < 120 ? 8 : 0;
      }
      viewed.forEach((v, i) => {
        if (p.category === v.category) s += Math.max(12 - i * 2, 2);
      });
      cart.forEach(c => { if (p.category === c.category) s += 10; });
      if (p.trending) s += 10;
      s += p.rating * 3;
      s += Math.random() * 5;
      return { ...p, _score: s };
    })
    .sort((a, b) => (b as Product & {_score:number})._score - (a as Product & {_score:number})._score)
    .slice(0, limit);
}
