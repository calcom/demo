import type { Demo } from "../types";
import { DemoPlaceholder } from "@/components/demo-placeholder";

function EmbedPopupDemo() {
  return (
    <DemoPlaceholder
      title="Popup embed"
      blurb="Open a Cal.com booking page in a modal triggered by any element on your site."
    />
  );
}

const demo: Demo = {
  slug: "embed-popup",
  name: "Popup embed",
  description: "Launch the booker in a modal from any trigger.",
  category: "Embeds",
  Component: EmbedPopupDemo,
};

export default demo;
