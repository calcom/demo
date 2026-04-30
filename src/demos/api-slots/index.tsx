import type { Demo } from "../types";
import { ApiSlotsDemo } from "./component";

const demo: Demo = {
  slug: "api-slots",
  name: "Custom booking UI",
  description: "Fetch available time slots for an event type via API and render a custom booking UI.",
  category: "API",
  Component: ApiSlotsDemo,
};

export default demo;
