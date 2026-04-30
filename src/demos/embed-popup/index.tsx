import { SparklesIcon } from "lucide-react";
import type { Demo } from "../types";
import { EmbedPopupDemo } from "./component";

const demo: Demo = {
  slug: "embed-popup",
  name: "Popup embed",
  description: "Launch the booker in a modal from any trigger.",
  category: "Embeds",
  icon: SparklesIcon,
  Component: EmbedPopupDemo,
};

export default demo;
