"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheckIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CAL_API_URL,
  CAL_API_VERSION,
  CAL_EVENT_TYPE_ID,
} from "./cal-config";

type SlotsResponse = {
  status: "success" | string;
  data: Record<string, { start: string }[]>;
};

type RawResponse = { status: number; body: unknown };
type SelectedSlot = { date: string; start: string };

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfTodayUtc(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

function isoDay(d: Date): string {
  return `${d.toISOString().slice(0, 10)}T00:00:00.000Z`;
}

function isoDayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function ApiSlotsDemo() {
  const tz = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  );
  const [weekStart, setWeekStart] = useState<Date>(() => startOfTodayUtc());
  const [data, setData] = useState<SlotsResponse | null>(null);
  const [response, setResponse] = useState<RawResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<SelectedSlot | null>(null);
  const [booked, setBooked] = useState(false);

  const weekEnd = useMemo(
    () => new Date(weekStart.getTime() + 7 * DAY_MS),
    [weekStart],
  );

  const startIso = isoDay(weekStart);
  const endIso = isoDay(weekEnd);

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart.getTime() + i * DAY_MS);
      return { date: d, key: isoDayKey(d) };
    });
  }, [weekStart]);

  const visibleSlots = useMemo(() => {
    if (!data?.data) return {} as Record<string, { start: string }[]>;
    const result: Record<string, { start: string }[]> = {};
    for (const [key, slots] of Object.entries(data.data)) {
      const target = 6 + Math.floor(Math.random() * 8); // 6..13
      if (slots.length <= target) {
        result[key] = slots;
        continue;
      }
      const step = slots.length / target;
      result[key] = Array.from(
        { length: target },
        (_, i) => slots[Math.floor(i * step)],
      );
    }
    return result;
  }, [data]);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    setSelected(null);
    setBooked(false);
    const params = new URLSearchParams({
      start: startIso,
      end: endIso,
      timeZone: tz,
    });
    fetch(`/api/slots?${params.toString()}`, { signal: ctrl.signal })
      .then(async (r) => {
        const body = await r.json();
        setResponse({ status: r.status, body });
        if (!r.ok) {
          const msg =
            (body as { error?: { message?: string } | string })?.error &&
            typeof (body as { error?: { message?: string } }).error ===
              "object"
              ? ((body as { error: { message?: string } }).error.message ??
                `Request failed (${r.status})`)
              : typeof (body as { error?: string }).error === "string"
                ? (body as { error: string }).error
                : `Request failed (${r.status})`;
          throw new Error(msg);
        }
        return body as SlotsResponse;
      })
      .then(setData)
      .catch((e) => {
        if (e.name === "AbortError") return;
        setError(e.message);
        setData(null);
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [startIso, endIso, tz]);

  const shiftWeek = (delta: number) =>
    setWeekStart((d) => new Date(d.getTime() + delta * 7 * DAY_MS));

  const weekLabel = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
    });
    return `${fmt.format(weekStart)} – ${fmt.format(new Date(weekEnd.getTime() - DAY_MS))}`;
  }, [weekStart, weekEnd]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
        <RequestPanel startIso={startIso} endIso={endIso} timeZone={tz} />
        <ResponsePanel response={response} loading={loading} />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="h-1 bg-gradient-to-r from-primary via-primary/40 to-transparent" />
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => shiftWeek(-1)}
                aria-label="Previous week"
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => shiftWeek(1)}
                aria-label="Next week"
              >
                <ChevronRightIcon />
              </Button>
              <span className="ml-2 text-sm font-medium">{weekLabel}</span>
            </div>
            <Badge variant="secondary" className="font-mono text-xs">
              {tz}
            </Badge>
          </div>

          {error ? (
            <ErrorState message={error} />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {days.map(({ date, key }) => (
                <DayColumn
                  key={key}
                  date={date}
                  slots={visibleSlots[key] ?? []}
                  loading={loading}
                  selected={selected}
                  onSelect={(slot) => {
                    setSelected({ date: key, start: slot.start });
                    setBooked(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selected && (
        <SelectionPanel
          selected={selected}
          booked={booked}
          onBook={() => setBooked(true)}
          onClear={() => {
            setSelected(null);
            setBooked(false);
          }}
        />
      )}
    </div>
  );
}

function DayColumn({
  date,
  slots,
  loading,
  selected,
  onSelect,
}: {
  date: Date;
  slots: { start: string }[];
  loading: boolean;
  selected: SelectedSlot | null;
  onSelect: (slot: { start: string }) => void;
}) {
  const dayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        day: "numeric",
      }).format(date),
    [date],
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="text-center text-xs font-medium text-muted-foreground">
        {dayLabel}
      </div>
      <div className="flex flex-col gap-1.5">
        {loading ? (
          <>
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
          </>
        ) : slots.length === 0 ? (
          <div className="rounded-md border border-dashed py-3 text-center text-xs text-muted-foreground">
            None
          </div>
        ) : (
          slots.map((slot) => {
            const isSelected = selected?.start === slot.start;
            return (
              <button
                key={slot.start}
                type="button"
                onClick={() => onSelect(slot)}
                className={cn(
                  "relative inline-flex h-8 cursor-pointer items-center justify-center gap-1 rounded-md border text-xs font-medium tabular-nums outline-none transition-all",
                  "focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-1 focus-visible:ring-offset-card",
                  isSelected
                    ? "scale-[1.03] border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-500/30"
                    : "border-emerald-500/40 bg-emerald-500/[0.03] text-emerald-700 hover:border-emerald-500/70 hover:bg-emerald-500/10 dark:text-emerald-400",
                )}
              >
                {isSelected && <CheckIcon className="size-3" />}
                {new Date(slot.start).toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function SelectionPanel({
  selected,
  booked,
  onBook,
  onClear,
}: {
  selected: SelectedSlot;
  booked: boolean;
  onBook: () => void;
  onClear: () => void;
}) {
  const fmt = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  return (
    <div
      className={cn(
        "flex flex-col gap-3 overflow-hidden rounded-xl border bg-card p-4 transition-colors sm:flex-row sm:items-center sm:justify-between",
        booked && "border-emerald-500/40 bg-emerald-500/5",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "inline-flex size-9 items-center justify-center rounded-full transition-colors",
            booked
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              : "bg-primary/10 text-primary",
          )}
        >
          {booked ? (
            <CheckIcon className="size-4" />
          ) : (
            <CalendarCheckIcon className="size-4" />
          )}
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {booked ? "Booked!" : "Selected"}
          </span>
          <span className="text-xs text-muted-foreground">
            {fmt.format(new Date(selected.start))}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onClear}>
          Clear
        </Button>
        <Button size="sm" onClick={onBook} disabled={booked}>
          {booked ? "Confirmed" : "Book it"}
        </Button>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
      {message}
    </div>
  );
}

function RequestPanel({
  startIso,
  endIso,
  timeZone,
}: {
  startIso: string;
  endIso: string;
  timeZone: string;
}) {
  const queryParts = useMemo(
    () => [
      ["eventTypeId", String(CAL_EVENT_TYPE_ID)],
      ["start", startIso],
      ["end", endIso],
      ["timeZone", timeZone],
    ],
    [startIso, endIso, timeZone],
  );

  return (
    <Panel
      tone="request"
      label="Request"
      pill={
        <Badge
          variant="secondary"
          className="border-blue-500/30 bg-blue-500/10 font-mono text-[10px] text-blue-600 dark:text-blue-400"
        >
          GET
        </Badge>
      }
    >
      <code className="font-mono text-xs leading-relaxed">
        <span className="text-muted-foreground">GET</span>{" "}
        <span>{CAL_API_URL}</span>
        {"\n"}
        {queryParts.map(([k, v], i) => (
          <span key={k}>
            <span className="text-muted-foreground">
              {i === 0 ? "  ?" : "  &"}
            </span>
            <span className="text-blue-600 dark:text-blue-400">{k}</span>
            <span className="text-muted-foreground">=</span>
            <span className="text-emerald-600 dark:text-emerald-400">{v}</span>
            {"\n"}
          </span>
        ))}
        {"\n"}
        <span className="text-muted-foreground">cal-api-version:</span>{" "}
        <span className="text-emerald-600 dark:text-emerald-400">
          {CAL_API_VERSION}
        </span>
        {"\n"}
        <span className="text-muted-foreground">Authorization:</span>{" "}
        <span className="text-emerald-600 dark:text-emerald-400">Bearer </span>
        <span className="text-muted-foreground">
          ••••••••••••••••••••••••
        </span>
      </code>
    </Panel>
  );
}

function ResponsePanel({
  response,
  loading,
}: {
  response: RawResponse | null;
  loading: boolean;
}) {
  const isOk = response && response.status >= 200 && response.status < 300;
  const tone = isOk ? "responseOk" : response ? "responseErr" : "request";
  const statusText = response
    ? `${response.status} ${isOk ? "OK" : "Error"}`
    : loading
      ? "…"
      : "—";

  return (
    <Panel
      tone={tone}
      label="Response"
      pill={
        <Badge
          variant="secondary"
          className={cn(
            "font-mono text-[10px]",
            isOk
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : response
                ? "border-destructive/30 bg-destructive/10 text-destructive"
                : "",
          )}
        >
          {statusText}
        </Badge>
      }
    >
      {!response && loading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-2/5" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      ) : response ? (
        <ResponseBody body={response.body} />
      ) : (
        <span className="text-muted-foreground">No response yet.</span>
      )}
    </Panel>
  );
}

function ResponseBody({ body }: { body: unknown }) {
  if (
    body &&
    typeof body === "object" &&
    "data" in body &&
    typeof (body as SlotsResponse).data === "object"
  ) {
    return <SuccessBody body={body as SlotsResponse} />;
  }
  return <ErrorBody body={body} />;
}

function SuccessBody({ body }: { body: SlotsResponse }) {
  const entries = Object.entries(body.data ?? {});
  const detailed = entries.slice(0, 2);
  const summarized = entries.slice(2);

  return (
    <code className="font-mono text-xs leading-relaxed">
      <Punct>{`{`}</Punct>
      {"\n"}
      <Indent />
      <Key>"status"</Key>
      <Punct>: </Punct>
      <Str>{`"${body.status}"`}</Str>
      <Punct>,</Punct>
      {"\n"}
      <Indent />
      <Key>"data"</Key>
      <Punct>: {`{`}</Punct>
      {"\n"}
      {detailed.map(([date, slots]) => (
        <DetailedDay key={date} date={date} slots={slots} />
      ))}
      {summarized.map(([date, slots]) => (
        <span key={date}>
          <Indent depth={2} />
          <Key>{`"${date}"`}</Key>
          <Punct>: [</Punct>
          <Comment>{`/* ${slots.length} slots */`}</Comment>
          <Punct>],</Punct>
          {"\n"}
        </span>
      ))}
      <Indent />
      <Punct>{`}`}</Punct>
      {"\n"}
      <Punct>{`}`}</Punct>
    </code>
  );
}

function DetailedDay({
  date,
  slots,
}: {
  date: string;
  slots: { start: string }[];
}) {
  const preview = slots.slice(0, 2);
  const remaining = slots.length - preview.length;
  return (
    <span>
      <Indent depth={2} />
      <Key>{`"${date}"`}</Key>
      <Punct>: [</Punct>
      {"\n"}
      {preview.map((slot) => (
        <span key={slot.start}>
          <Indent depth={3} />
          <Punct>{`{ `}</Punct>
          <Key>"start"</Key>
          <Punct>: </Punct>
          <Str>{`"${slot.start}"`}</Str>
          <Punct>{` },`}</Punct>
          {"\n"}
        </span>
      ))}
      {remaining > 0 && (
        <>
          <Indent depth={3} />
          <Comment>{`// … ${remaining} more`}</Comment>
          {"\n"}
        </>
      )}
      <Indent depth={2} />
      <Punct>],</Punct>
      {"\n"}
    </span>
  );
}

function ErrorBody({ body }: { body: unknown }) {
  const text = (() => {
    try {
      return JSON.stringify(body, null, 2);
    } catch {
      return String(body);
    }
  })();
  return (
    <code className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-destructive">
      {text}
    </code>
  );
}

function Panel({
  tone,
  label,
  pill,
  children,
}: {
  tone: "request" | "responseOk" | "responseErr";
  label: string;
  pill: React.ReactNode;
  children: React.ReactNode;
}) {
  const accent = {
    request: "from-blue-500/40 via-blue-500/10 to-transparent",
    responseOk: "from-emerald-500/40 via-emerald-500/10 to-transparent",
    responseErr: "from-destructive/40 via-destructive/10 to-transparent",
  }[tone];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-code">
      <div className={cn("h-px bg-gradient-to-r", accent)} />
      <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {pill}
      </div>
      <pre className="flex-1 overflow-x-auto p-4 text-xs leading-relaxed">
        {children}
      </pre>
    </div>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return <span className="text-blue-600 dark:text-blue-400">{children}</span>;
}
function Str({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-emerald-600 dark:text-emerald-400">{children}</span>
  );
}
function Punct({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground">{children}</span>;
}
function Comment({ children }: { children: React.ReactNode }) {
  return (
    <span className="italic text-muted-foreground/70">{children}</span>
  );
}
function Indent({ depth = 1 }: { depth?: number }) {
  return <span>{"  ".repeat(depth)}</span>;
}
