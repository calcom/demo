"use client";

import { useId, useState, type ReactNode } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export type CalTheme = "light" | "dark" | "auto";
export type CalLayout = "month_view" | "week_view" | "column_view";

export type CalEmbedConfig = {
  theme: CalTheme;
  layout: CalLayout;
  hideEventTypeDetails: boolean;
  lightBrand: string;
  darkBrand: string;
};

const THEMES: { value: CalTheme; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const LAYOUTS: { value: CalLayout; label: string }[] = [
  { value: "month_view", label: "Month" },
  { value: "week_view", label: "Week" },
  { value: "column_view", label: "Column" },
];

const DEFAULTS: CalEmbedConfig = {
  theme: "auto",
  layout: "month_view",
  hideEventTypeDetails: false,
  lightBrand: "#292929",
  darkBrand: "#adadad",
};

export function useCalEmbedConfig(
  overrides: Partial<CalEmbedConfig> = {},
): { config: CalEmbedConfig; controls: ReactNode } {
  const [theme, setTheme] = useState<CalTheme>(
    overrides.theme ?? DEFAULTS.theme,
  );
  const [layout, setLayout] = useState<CalLayout>(
    overrides.layout ?? DEFAULTS.layout,
  );
  const [hideEventTypeDetails, setHideEventTypeDetails] = useState(
    overrides.hideEventTypeDetails ?? DEFAULTS.hideEventTypeDetails,
  );
  const [lightBrand, setLightBrand] = useState(
    overrides.lightBrand ?? DEFAULTS.lightBrand,
  );
  const [darkBrand, setDarkBrand] = useState(
    overrides.darkBrand ?? DEFAULTS.darkBrand,
  );

  const themeId = useId();
  const layoutId = useId();
  const hideId = useId();
  const lightId = useId();
  const darkId = useId();

  const config: CalEmbedConfig = {
    theme,
    layout,
    hideEventTypeDetails,
    lightBrand,
    darkBrand,
  };

  const controls = (
    <div className="grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor={themeId}>Theme</Label>
        <Select
          items={THEMES}
          value={theme}
          onValueChange={(v) => setTheme(v as CalTheme)}
        >
          <SelectTrigger id={themeId}>
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
        <Label htmlFor={layoutId}>Layout</Label>
        <Select
          items={LAYOUTS}
          value={layout}
          onValueChange={(v) => setLayout(v as CalLayout)}
        >
          <SelectTrigger id={layoutId}>
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
        <Label htmlFor={hideId} className="cursor-pointer">
          Hide event details
        </Label>
        <Switch
          id={hideId}
          checked={hideEventTypeDetails}
          onCheckedChange={setHideEventTypeDetails}
        />
      </div>

      <ColorField
        id={lightId}
        label="Light brand"
        value={lightBrand}
        onChange={setLightBrand}
      />
      <ColorField
        id={darkId}
        label="Dark brand"
        value={darkBrand}
        onChange={setDarkBrand}
      />
    </div>
  );

  return { config, controls };
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

export function calUiOptions(config: CalEmbedConfig) {
  return {
    theme: config.theme,
    layout: config.layout,
    hideEventTypeDetails: config.hideEventTypeDetails,
    cssVarsPerTheme: {
      light: { "cal-brand": config.lightBrand },
      dark: { "cal-brand": config.darkBrand },
    },
  };
}
