import type { Demo } from "../types";
import { DemoPlaceholder } from "@/components/demo-placeholder";

function AtomsBookerDemo() {
  return (
    <DemoPlaceholder
      title="Atoms — Booker"
      blurb="Compose a fully custom booking experience with Cal.com Atoms in React."
    />
  );
}

const demo: Demo = {
  slug: "atoms-booker",
  name: "Atoms — Booker",
  description: "Build a custom booker UI with Cal Atoms.",
  category: "Platform",
  Component: AtomsBookerDemo,
};

export default demo;
