import type { Demo } from "../types";
import { DemoPlaceholder } from "@/components/demo-placeholder";

function ApiSlotsDemo() {
  return (
    <DemoPlaceholder
      title="API — Available slots"
      blurb="Query the Cal.com API for available slots and render them in your own UI."
    />
  );
}

const demo: Demo = {
  slug: "api-slots",
  name: "API — Available slots",
  description: "Fetch and render slots via the Cal.com API.",
  category: "API",
  Component: ApiSlotsDemo,
};

export default demo;
