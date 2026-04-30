import {
  AppWindowIcon,
  ArrowDownIcon,
  CodeIcon,
  CoinsIcon,
  LayoutGridIcon,
  WebhookIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Demo } from "../types";

type Tone = "customer" | "cal";

function CreditsFlowDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border bg-card px-4 py-8 sm:px-8">
        <Flowchart />
      </div>
      <WebhookSnippet />
    </div>
  );
}

function Flowchart() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <div className="flex justify-center">
        <Block
          tone="customer"
          icons={[<AppWindowIcon key="a" />, <CoinsIcon key="b" />]}
          title="Your app & credits gate"
          subtitle="User clicks ‘Book’; you check your own credits or billing logic."
          wide
        />
      </div>

      <Connector label="Sufficient credits — render the booker" />

      <Split />

      <div className="grid grid-cols-2">
        <div className="flex justify-center">
          <Block
            tone="cal"
            icons={[<LayoutGridIcon key="a" />]}
            title="Drop-in booker"
            subtitle="<Cal calLink=…/>"
          />
        </div>
        <div className="flex justify-center">
          <Block
            tone="cal"
            icons={[<CodeIcon key="a" />]}
            title="Custom booker"
            subtitle="GET /v2/slots → your UI"
          />
        </div>
      </div>

      <Merge />

      <Connector label="Booking confirmed" />

      <div className="flex justify-center">
        <Block
          tone="cal"
          icons={[<WebhookIcon key="a" />]}
          title="Cal.com webhook"
          subtitle="triggerEvent: BOOKING_CREATED"
          wide
        />
      </div>

      <Connector label="POST /api/webhooks/cal" accent="webhook" />

      <div className="flex justify-center">
        <Block
          tone="customer"
          icons={[<CoinsIcon key="a" />]}
          title="Your webhook handler"
          subtitle="Verify signature, deduct 1 credit, send a receipt."
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
      : {
          ring: "ring-1 ring-rose-400/30 dark:ring-rose-300/20",
          bg: "bg-rose-400/[0.05] dark:bg-rose-300/[0.05]",
          iconBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
          tag: "text-rose-600 dark:text-rose-400",
          tagText: "Cal.com",
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
  accent?: "default" | "webhook";
}) {
  const tone =
    accent === "webhook"
      ? "border-violet-500/40 bg-violet-500/5 text-violet-600 dark:text-violet-400"
      : "border-border bg-card text-muted-foreground";
  return (
    <div className="relative my-1 flex justify-center py-2">
      <div
        className={cn(
          "absolute left-1/2 top-0 h-full w-px -translate-x-1/2 border-l border-dashed",
          accent === "webhook"
            ? "border-violet-500/40"
            : "border-border",
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
          accent === "webhook"
            ? "text-violet-500"
            : "text-muted-foreground",
        )}
      />
    </div>
  );
}

function Split() {
  return (
    <div className="relative h-10">
      <div className="absolute left-1/2 top-0 h-1/2 -translate-x-1/2 border-l border-dashed border-border" />
      <div className="absolute left-1/4 right-1/4 top-1/2 border-t border-dashed border-border" />
      <div className="absolute left-1/4 top-1/2 h-1/2 border-l border-dashed border-border" />
      <div className="absolute right-1/4 top-1/2 h-1/2 border-l border-dashed border-border" />
    </div>
  );
}

function Merge() {
  return (
    <div className="relative h-10">
      <div className="absolute left-1/4 top-0 h-1/2 border-l border-dashed border-border" />
      <div className="absolute right-1/4 top-0 h-1/2 border-l border-dashed border-border" />
      <div className="absolute left-1/4 right-1/4 top-1/2 border-t border-dashed border-border" />
      <div className="absolute left-1/2 top-1/2 h-1/2 -translate-x-1/2 border-l border-dashed border-border" />
    </div>
  );
}

function WebhookSnippet() {
  return (
    <div className="overflow-hidden rounded-xl border bg-code">
      <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Webhook handler
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          POST /api/webhooks/cal
        </span>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
        <code className="font-mono">
          <Cmt>{`// Your billing webhook handler`}</Cmt>
          {"\n"}
          <Kw>app</Kw>
          <P>.</P>
          <Fn>post</Fn>
          <P>(</P>
          <Str>{`"/api/webhooks/cal"`}</Str>
          <P>, </P>
          <Kw>async</Kw> <P>(</P>req<P>, </P>res<P>) =&gt; {`{`}</P>
          {"\n"}
          {"  "}
          <Kw>const</Kw> <P>{`{`} </P>triggerEvent<P>, </P>payload<P> {`}`} = </P>req
          <P>.</P>body<P>;</P>
          {"\n\n"}
          {"  "}
          <Kw>if</Kw> <P>(</P>triggerEvent === <Str>{`"BOOKING_CREATED"`}</Str>
          <P>) {`{`}</P>
          {"\n"}
          {"    "}
          <Kw>await</Kw> <Fn>deductCredit</Fn>
          <P>(</P>payload<P>.</P>attendees<P>[</P>
          <Num>0</Num>
          <P>].</P>email<P>);</P>
          {"\n"}
          {"  "}
          <P>{`}`}</P>
          {"\n\n"}
          {"  "}res<P>.</P>
          <Fn>json</Fn>
          <P>(</P>
          <P>{`{ `}</P>ok<P>: </P>
          <Kw>true</Kw>
          <P>{` }`}</P>
          <P>);</P>
          {"\n"}
          <P>{`});`}</P>
        </code>
      </pre>
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
function Num({ children }: { children: React.ReactNode }) {
  return <span className="text-amber-600 dark:text-amber-400">{children}</span>;
}
function P({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground">{children}</span>;
}

const demo: Demo = {
  slug: "api-credits-flow",
  name: "Credit-based bookings",
  description:
    "Architecture pattern for gating Cal.com bookings on your own credit or billing system, then settling the charge via webhook.",
  category: "Concepts",
  icon: CoinsIcon,
  Component: CreditsFlowDemo,
};

export default demo;
