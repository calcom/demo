import type { ComponentType } from "react";

export type DemoCategory = "Embeds" | "Platform" | "API" | "Concepts";

export type Demo = {
  slug: string;
  name: string;
  description: string;
  category: DemoCategory;
  Component: ComponentType;
};
