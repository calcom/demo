import type { Demo, DemoCategory } from "./types";
import embedPopup from "./embed-popup";
import embedInline from "./embed-inline";
import apiSlots from "./api-slots";
import apiCreditsFlow from "./api-credits-flow";
import apiEhrSync from "./api-ehr-sync";

export const demos: Demo[] = [
  embedPopup,
  embedInline,
  apiSlots,
  apiCreditsFlow,
  apiEhrSync,
];

export function getDemoBySlug(slug: string): Demo | undefined {
  return demos.find((d) => d.slug === slug);
}

const CATEGORY_ORDER: DemoCategory[] = ["Embeds", "API", "Concepts"];

export function getDemosByCategory(): Array<{
  category: DemoCategory;
  demos: Demo[];
}> {
  const grouped = new Map<DemoCategory, Demo[]>();
  for (const demo of demos) {
    const list = grouped.get(demo.category) ?? [];
    list.push(demo);
    grouped.set(demo.category, list);
  }
  return CATEGORY_ORDER.filter((c) => grouped.has(c)).map((category) => ({
    category,
    demos: grouped.get(category) ?? [],
  }));
}
