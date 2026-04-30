import { LayoutGridIcon } from "lucide-react";
import type { Demo } from "../types";
import { EmbedInlineDemo } from "./component";

const demo: Demo = {
  slug: "embed-inline",
  name: "Inline embed",
  description: "Drop the booker directly into your page.",
  category: "Embeds",
  icon: LayoutGridIcon,
  Component: EmbedInlineDemo,
};

export default demo;
