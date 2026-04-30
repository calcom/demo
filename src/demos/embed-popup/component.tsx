"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";
import { Button } from "@/components/ui/button";
import {
  calUiOptions,
  useCalEmbedConfig,
} from "@/components/cal-embed-config";

const NAMESPACE = "embed-popup-demo";

export function EmbedPopupDemo() {
  const { config, controls } = useCalEmbedConfig();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cal = await getCalApi({ namespace: NAMESPACE });
      if (cancelled) return;
      cal("ui", calUiOptions(config));
    })();
    return () => {
      cancelled = true;
    };
  }, [config]);

  return (
    <div className="flex flex-col gap-6">
      {controls}
      <div className="flex flex-col items-center justify-center rounded-xl border bg-card px-6 py-16">
        <Button
          size="lg"
          data-cal-namespace={NAMESPACE}
          data-cal-link="rick/get-rick-rolled"
          data-cal-config={JSON.stringify({
            layout: config.layout,
            useSlotsViewOnSmallScreen: "true",
          })}
        >
          Click me
        </Button>
      </div>
    </div>
  );
}
