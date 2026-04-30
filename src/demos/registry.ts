import type { Demo, DemoCategory } from "./types";
import embedPopup from "./embed-popup";
import embedInline from "./embed-inline";
import embedFloatingButton from "./embed-floating-button";
import atomsBooker from "./atoms-booker";
import apiSlots from "./api-slots";

export const demos: Demo[] = [
  embedPopup,
  embedInline,
  embedFloatingButton,
  atomsBooker,
  apiSlots,
];

export function getDemoBySlug(slug: string): Demo | undefined {
  return demos.find((d) => d.slug === slug);
}

const CATEGORY_ORDER: DemoCategory[] = ["Embeds", "Platform", "API"];

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
