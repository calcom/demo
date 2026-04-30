"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import {
  calUiOptions,
  useCalEmbedConfig,
} from "@/components/cal-embed-config";

const NAMESPACE = "embed-inline-demo";

export function EmbedInlineDemo() {
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
      <div className="aspect-video min-h-[520px] overflow-hidden rounded-xl border">
        <Cal
          namespace={NAMESPACE}
          calLink="rick/get-rick-rolled"
          style={{ width: "100%", height: "100%", overflow: "scroll" }}
          config={{ layout: config.layout, useSlotsViewOnSmallScreen: "true" }}
        />
      </div>
    </div>
  );
}
