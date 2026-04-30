import type { ComponentType, SVGProps } from "react";

export type DemoCategory = "Embeds" | "Platform" | "API" | "Concepts";

export type DemoIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type Demo = {
  slug: string;
  name: string;
  description: string;
  category: DemoCategory;
  icon: DemoIcon;
  Component: ComponentType;
};
