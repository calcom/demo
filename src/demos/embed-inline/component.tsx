"use client";

import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type Theme = "light" | "dark" | "auto";
type Layout = "month_view" | "week_view" | "column_view";

const THEMES: { value: Theme; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const LAYOUTS: { value: Layout; label: string }[] = [
  { value: "month_view", label: "Month" },
  { value: "week_view", label: "Week" },
  { value: "column_view", label: "Column" },
];

const NAMESPACE = "embed-inline-demo";

export function EmbedInlineDemo() {
  const [theme, setTheme] = useState<Theme>("auto");
  const [layout, setLayout] = useState<Layout>("month_view");
  const [hideEventTypeDetails, setHideEventTypeDetails] = useState(false);
  const [lightBrand, setLightBrand] = useState("#292929");
  const [darkBrand, setDarkBrand] = useState("#adadad");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cal = await getCalApi({ namespace: NAMESPACE });
      if (cancelled) return;
      cal("ui", {
        theme,
        layout,
        hideEventTypeDetails,
        cssVarsPerTheme: {
          light: { "cal-brand": lightBrand },
          dark: { "cal-brand": darkBrand },
        },
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [theme, layout, hideEventTypeDetails, lightBrand, darkBrand]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="cal-theme">Theme</Label>
          <Select
            items={THEMES}
            value={theme}
            onValueChange={(v) => setTheme(v as Theme)}
          >
            <SelectTrigger id="cal-theme">
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              {THEMES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="cal-layout">Layout</Label>
          <Select
            items={LAYOUTS}
            value={layout}
            onValueChange={(v) => setLayout(v as Layout)}
          >
            <SelectTrigger id="cal-layout">
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              {LAYOUTS.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-3 sm:col-span-2 lg:col-span-1">
          <Label htmlFor="cal-hide-details" className="cursor-pointer">
            Hide event details
          </Label>
          <Switch
            id="cal-hide-details"
            checked={hideEventTypeDetails}
            onCheckedChange={setHideEventTypeDetails}
          />
        </div>

        <ColorField
          id="cal-light-brand"
          label="Light brand"
          value={lightBrand}
          onChange={setLightBrand}
        />
        <ColorField
          id="cal-dark-brand"
          label="Dark brand"
          value={darkBrand}
          onChange={setDarkBrand}
        />
      </div>

      <div className="h-[720px] overflow-hidden rounded-xl border">
        <Cal
          namespace={NAMESPACE}
          calLink="rick/get-rick-rolled"
          style={{ width: "100%", height: "100%", overflow: "scroll" }}
          config={{ layout, useSlotsViewOnSmallScreen: "true" }}
        />
      </div>
    </div>
  );
}

function ColorField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2 rounded-lg border bg-background px-2 py-1.5">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="size-6 cursor-pointer rounded border-0 bg-transparent p-0"
        />
        <span className="font-mono text-sm tabular-nums text-muted-foreground">
          {value.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
