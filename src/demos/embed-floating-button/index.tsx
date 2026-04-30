import type { Demo } from "../types";
import { DemoPlaceholder } from "@/components/demo-placeholder";

function EmbedFloatingButtonDemo() {
  return (
    <DemoPlaceholder
      title="Floating button"
      blurb="A persistent floating call-to-action that opens the booker when clicked."
    />
  );
}

const demo: Demo = {
  slug: "embed-floating-button",
  name: "Floating button",
  description: "A persistent CTA that opens the booker.",
  category: "Embeds",
  Component: EmbedFloatingButtonDemo,
};

export default demo;
