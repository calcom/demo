import {
  ArrowDownIcon,
  CalendarOffIcon,
  CalendarSyncIcon,
  CodeIcon,
  HeartPulseIcon,
  RefreshCwIcon,
  ServerIcon,
  StethoscopeIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Demo } from "../types";

type Tone = "customer" | "cal" | "ehr";

function EhrSyncDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border bg-card px-4 py-8 sm:px-8">
        <Flowchart />
      </div>
      <SyncSnippet />
    </div>
  );
}

function Flowchart() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <div className="flex justify-center">
        <Block
          tone="ehr"
          icons={[<HeartPulseIcon key="a" />, <StethoscopeIcon key="b" />]}
          title="EHR system"
          subtitle="Epic, Cerner, Athena, etc. Source of truth for shifts and PTO."
          wide
        />
      </div>

      <Connector label="Pull shifts (cron / webhook)" />

      <div className="flex justify-center">
        <Block
          tone="customer"
          icons={[<ServerIcon key="a" />, <RefreshCwIcon key="b" />]}
          title="Your sync microservice"
          subtitle="GET https://ehr.example.com/api/shifts/:doctorId"
          wide
        />
      </div>

      <Connector label="Diff against current Cal.com schedule" />

      <div className="flex justify-center">
        <Block
          tone="customer"
          icons={[<CodeIcon key="a" />]}
          title="Compute date overrides"
          subtitle="Off-duty days → { date, startTime: '00:00', endTime: '00:00' }"
          wide
        />
      </div>

      <Connector
        label="PATCH /v2/schedules/:scheduleId"
        accent="api"
      />

      <div className="flex justify-center">
        <Block
          tone="cal"
          icons={[<CalendarSyncIcon key="a" />]}
          title="Cal.com schedule"
          subtitle="Overrides applied — blocked dates roll out instantly."
          wide
        />
      </div>

      <Connector label="Bookers see updated availability" />

      <div className="flex justify-center">
        <Block
          tone="cal"
          icons={[<CalendarOffIcon key="a" />]}
          title="Booker UI"
          subtitle="Off-duty days are greyed out for patients."
          wide
        />
      </div>
    </div>
  );
}

function Block({
  icons,
  title,
  subtitle,
  tone,
  wide = false,
}: {
  icons: React.ReactNode[];
  title: string;
  subtitle: string;
  tone: Tone;
  wide?: boolean;
}) {
  const palette =
    tone === "customer"
      ? {
          ring: "ring-1 ring-primary/20",
          bg: "bg-primary/[0.04]",
          iconBg: "bg-primary/10 text-primary",
          tag: "text-primary",
          tagText: "Yours",
        }
      : tone === "cal"
        ? {
            ring: "ring-1 ring-rose-400/30 dark:ring-rose-300/20",
            bg: "bg-rose-400/[0.05] dark:bg-rose-300/[0.05]",
            iconBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
            tag: "text-rose-600 dark:text-rose-400",
            tagText: "Cal.com",
          }
        : {
            ring: "ring-1 ring-emerald-500/30 dark:ring-emerald-300/20",
            bg: "bg-emerald-500/[0.05] dark:bg-emerald-300/[0.05]",
            iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            tag: "text-emerald-600 dark:text-emerald-400",
            tagText: "3rd-party",
          };

  return (
    <div
      className={cn(
        "relative flex w-full flex-col gap-2 rounded-xl border bg-card p-4 shadow-xs/5",
        palette.ring,
        palette.bg,
        wide ? "max-w-md" : "max-w-[18rem]",
      )}
    >
      <span
        className={cn(
          "absolute -top-2 right-3 rounded-full border bg-background px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
          palette.tag,
        )}
      >
        {palette.tagText}
      </span>
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-lg px-1.5 py-1.5",
            palette.iconBg,
            "[&_svg]:size-4",
          )}
        >
          {icons}
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium leading-tight">{title}</span>
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        </div>
      </div>
    </div>
  );
}

function Connector({
  label,
  accent = "default",
}: {
  label: string;
  accent?: "default" | "api";
}) {
  const tone =
    accent === "api"
      ? "border-violet-500/40 bg-violet-500/5 text-violet-600 dark:text-violet-400"
      : "border-border bg-card text-muted-foreground";
  return (
    <div className="relative my-1 flex justify-center py-2">
      <div
        className={cn(
          "absolute left-1/2 top-0 h-full w-px -translate-x-1/2 border-l border-dashed",
          accent === "api" ? "border-violet-500/40" : "border-border",
        )}
      />
      <span
        className={cn(
          "relative inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-[11px] font-medium",
          tone,
        )}
      >
        {label}
      </span>
      <ArrowDownIcon
        className={cn(
          "absolute -bottom-1 left-1/2 size-3.5 -translate-x-1/2",
          accent === "api" ? "text-violet-500" : "text-muted-foreground",
        )}
      />
    </div>
  );
}

function SyncSnippet() {
  return (
    <div className="overflow-hidden rounded-xl border bg-code">
      <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Sync microservice
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          runs on cron — every 15 min
        </span>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
        <code className="font-mono">
          <Cmt>{`// Pull shifts from the EHR and mirror them into a Cal.com schedule`}</Cmt>
          {"\n"}
          <Kw>async function</Kw> <Fn>syncDoctorAvailability</Fn>
          <P>(</P>doctorId<P>, </P>scheduleId<P>) {`{`}</P>
          {"\n"}
          {"  "}
          <Cmt>{`// 1. Pull shifts from the EHR`}</Cmt>
          {"\n"}
          {"  "}
          <Kw>const</Kw> shifts <P>= </P>
          <Kw>await</Kw> <Fn>ehrFetch</Fn>
          <P>(</P>
          <Str>{`\`/api/shifts/\${doctorId}\``}</Str>
          <P>);</P>
          {"\n"}
          {"  "}
          <Cmt>{`// → [{ date: "2026-05-12", offDuty: true }, …]`}</Cmt>
          {"\n\n"}
          {"  "}
          <Cmt>{`// 2. Off-duty days → zero-length availability windows`}</Cmt>
          {"\n"}
          {"  "}
          <Kw>const</Kw> overrides <P>= </P>shifts
          {"\n"}
          {"    "}
          <P>.</P>
          <Fn>filter</Fn>
          <P>((s) =&gt; s.</P>offDuty<P>)</P>
          {"\n"}
          {"    "}
          <P>.</P>
          <Fn>map</Fn>
          <P>((s) =&gt; (</P>
          <P>{`{`}</P>
          {"\n"}
          {"      "}date<P>: s.</P>date<P>,</P>
          {"\n"}
          {"      "}startTime<P>: </P>
          <Str>{`"00:00"`}</Str>
          <P>,</P>
          {"\n"}
          {"      "}endTime<P>: </P>
          <Str>{`"00:00"`}</Str>
          <P>,</P>
          {"\n"}
          {"    "}
          <P>{`}`}));</P>
          {"\n\n"}
          {"  "}
          <Cmt>{`// 3. Push overrides to Cal.com — partial PATCH, only sends what changed`}</Cmt>
          {"\n"}
          {"  "}
          <Kw>await</Kw> <Fn>fetch</Fn>
          <P>(</P>
          <Str>{`\`https://api.cal.com/v2/schedules/\${scheduleId}\``}</Str>
          <P>, </P>
          <P>{`{`}</P>
          {"\n"}
          {"    "}method<P>: </P>
          <Str>{`"PATCH"`}</Str>
          <P>,</P>
          {"\n"}
          {"    "}headers<P>: </P>
          <P>{`{`}</P>
          {"\n"}
          {"      "}
          <Str>{`"Authorization"`}</Str>
          <P>: </P>
          <Str>{`\`Bearer \${CAL_API_KEY}\``}</Str>
          <P>,</P>
          {"\n"}
          {"      "}
          <Str>{`"cal-api-version"`}</Str>
          <P>: </P>
          <Str>{`"2024-06-11"`}</Str>
          <P>,</P>
          {"\n"}
          {"      "}
          <Str>{`"Content-Type"`}</Str>
          <P>: </P>
          <Str>{`"application/json"`}</Str>
          <P>,</P>
          {"\n"}
          {"    "}
          <P>{`},`}</P>
          {"\n"}
          {"    "}body<P>: </P>JSON<P>.</P>
          <Fn>stringify</Fn>
          <P>(</P>
          <P>{`{ `}</P>overrides<P> {`}`}</P>
          <P>),</P>
          {"\n"}
          {"  "}
          <P>{`});`}</P>
          {"\n"}
          <P>{`}`}</P>
        </code>
      </pre>
      <div className="border-t bg-muted/40 px-4 py-3">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          <Kbd>GET /v2/schedules/:id</Kbd> reads the current schedule so you can
          diff before writing. <Kbd>PATCH /v2/schedules/:id</Kbd> accepts a
          partial body — send just <Kbd>overrides</Kbd> to mark days off
          without touching the recurring weekly availability.
        </p>
      </div>
    </div>
  );
}

function Cmt({ children }: { children: React.ReactNode }) {
  return <span className="italic text-muted-foreground/70">{children}</span>;
}
function Kw({ children }: { children: React.ReactNode }) {
  return <span className="text-violet-600 dark:text-violet-400">{children}</span>;
}
function Fn({ children }: { children: React.ReactNode }) {
  return <span className="text-blue-600 dark:text-blue-400">{children}</span>;
}
function Str({ children }: { children: React.ReactNode }) {
  return <span className="text-emerald-600 dark:text-emerald-400">{children}</span>;
}
function P({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground">{children}</span>;
}
function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded border bg-background px-1 py-px font-mono text-[10px] text-foreground">
      {children}
    </code>
  );
}

const demo: Demo = {
  slug: "api-ehr-sync",
  name: "Sync EHR availability",
  description:
    "Mirror doctor shifts from a 3rd-party EHR into a Cal.com schedule with a small sync microservice and the schedules API.",
  category: "Concepts",
  icon: HeartPulseIcon,
  Component: EhrSyncDemo,
};

export default demo;
