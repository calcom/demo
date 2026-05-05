import {
  ArrowDownIcon,
  CalendarCheckIcon,
  CalendarXIcon,
  CheckIcon,
  MessageSquareIcon,
  ServerIcon,
  SmartphoneIcon,
  UserIcon,
  WebhookIcon,
  XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Demo } from "../types";

type Tone = "customer" | "cal";

function SmsConfirmationDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border bg-card px-4 py-8 sm:px-8">
        <Flowchart />
      </div>
      <SmsThreads />
      <ReplyHandlerSnippet />
    </div>
  );
}

function Flowchart() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <div className="flex justify-center">
        <Block
          tone="cal"
          icons={[<UserIcon key="a" />]}
          title="Patient books a slot"
          subtitle="Event type set to ‘Requires confirmation’."
          wide
        />
      </div>

      <Connector label="triggerEvent: BOOKING_REQUESTED" accent="webhook" />

      <div className="flex justify-center">
        <Block
          tone="customer"
          icons={[<WebhookIcon key="a" />, <ServerIcon key="b" />]}
          title="Your confirmation service"
          subtitle="POST /api/webhooks/cal — booking is pending."
          wide
        />
      </div>

      <Connector label="Send SMS via Twilio / Vonage / etc." />

      <div className="flex justify-center">
        <Block
          tone="customer"
          icons={[<MessageSquareIcon key="a" />, <SmartphoneIcon key="b" />]}
          title="Patient receives SMS"
          subtitle="‘Reply YES to confirm or NO to cancel.’"
          wide
        />
      </div>

      <Connector label="Inbound reply → POST /api/webhooks/sms" />

      <div className="flex justify-center">
        <Block
          tone="customer"
          icons={[<ServerIcon key="a" />]}
          title="Your reply handler"
          subtitle="Parse the patient’s reply, branch on YES / NO."
          wide
        />
      </div>

      <Split />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/5 px-3 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <CheckIcon className="size-3" /> YES
          </span>
          <Block
            tone="cal"
            icons={[<CalendarCheckIcon key="a" />]}
            title="Confirm the booking"
            subtitle="PATCH /v2/bookings/:uid/confirm"
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/5 px-3 py-0.5 text-[11px] font-medium text-rose-600 dark:text-rose-400">
            <XIcon className="size-3" /> NO
          </span>
          <Block
            tone="cal"
            icons={[<CalendarXIcon key="a" />]}
            title="Cancel the booking"
            subtitle="DELETE /v2/bookings/:uid"
          />
        </div>
      </div>

      <Merge />

      <Connector label="Cal.com sends the final confirmation or cancellation email" />

      <div className="flex justify-center">
        <Block
          tone="cal"
          icons={[<UserIcon key="a" />]}
          title="Patient & doctor notified"
          subtitle="Cal.com handles the final calendar invite or cancellation."
          wide
        />
      </div>
    </div>
  );
}

function SmsThreads() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <SmsThread
        outcome="confirmed"
        bubbles={[
          {
            from: "out",
            text: "Cal.com Clinic: Hi Sarah! Confirm your appointment with Dr. Lee on Tue 12 May at 10:30 am? Reply YES to confirm, NO to cancel.",
          },
          { from: "in", text: "YES" },
          { from: "out", text: "Confirmed. See you Tuesday!" },
        ]}
      />
      <SmsThread
        outcome="cancelled"
        bubbles={[
          {
            from: "out",
            text: "Cal.com Clinic: Hi Sarah! Confirm your appointment with Dr. Lee on Tue 12 May at 10:30 am? Reply YES to confirm, NO to cancel.",
          },
          { from: "in", text: "NO" },
          {
            from: "out",
            text: "No problem — your appointment has been cancelled.",
          },
        ]}
      />
    </div>
  );
}

function SmsThread({
  bubbles,
  outcome,
}: {
  bubbles: Array<{ from: "in" | "out"; text: string }>;
  outcome: "confirmed" | "cancelled";
}) {
  const accent =
    outcome === "confirmed"
      ? {
          ring: "ring-emerald-500/30",
          icon: <CheckIcon className="size-3" />,
          label: "→ PATCH /v2/bookings/:uid/confirm",
          tone: "text-emerald-600 dark:text-emerald-400",
          dot: "bg-emerald-500",
        }
      : {
          ring: "ring-rose-500/30",
          icon: <XIcon className="size-3" />,
          label: "→ DELETE /v2/bookings/:uid",
          tone: "text-rose-600 dark:text-rose-400",
          dot: "bg-rose-500",
        };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-card ring-1",
        accent.ring,
      )}
    >
      <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
        <span className="flex items-center gap-2 text-xs font-medium">
          <SmartphoneIcon className="size-3.5 text-muted-foreground" />
          <span>+1 (555) 0102 · Sarah</span>
        </span>
        <span className={cn("flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider", accent.tone)}>
          <span className={cn("size-1.5 rounded-full", accent.dot)} />
          {outcome}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-3">
        {bubbles.map((b, i) => (
          <Bubble key={i} from={b.from} text={b.text} />
        ))}
      </div>
      <div
        className={cn(
          "flex items-center justify-center gap-2 border-t bg-muted/30 px-4 py-2 font-mono text-[10px]",
          accent.tone,
        )}
      >
        {accent.icon}
        <span>{accent.label}</span>
      </div>
    </div>
  );
}

function Bubble({ from, text }: { from: "in" | "out"; text: string }) {
  if (from === "out") {
    return (
      <div className="flex justify-start">
        <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-muted px-3 py-2 text-xs text-foreground">
          {text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">
        {text}
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
          accent === "webhook" ? "border-violet-500/40" : "border-border",
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
          accent === "webhook" ? "text-violet-500" : "text-muted-foreground",
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

function ReplyHandlerSnippet() {
  return (
    <div className="overflow-hidden rounded-xl border bg-code">
      <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Inbound SMS handler
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          POST /api/webhooks/sms
        </span>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
        <code className="font-mono">
          <Cmt>{`// Twilio (or your SMS provider) hits this when the patient replies`}</Cmt>
          {"\n"}
          <Kw>app</Kw>
          <P>.</P>
          <Fn>post</Fn>
          <P>(</P>
          <Str>{`"/api/webhooks/sms"`}</Str>
          <P>, </P>
          <Kw>async</Kw> <P>(</P>req<P>, </P>res<P>) =&gt; {`{`}</P>
          {"\n"}
          {"  "}
          <Kw>const</Kw> <P>{`{`} </P>From<P>, </P>Body<P> {`}`} = </P>req
          <P>.</P>body<P>;</P>
          {"\n"}
          {"  "}
          <Kw>const</Kw> reply <P>= </P>Body<P>.</P>
          <Fn>trim</Fn>
          <P>().</P>
          <Fn>toUpperCase</Fn>
          <P>();</P>
          {"\n\n"}
          {"  "}
          <Cmt>{`// Look up the pending booking we sent this number an SMS for`}</Cmt>
          {"\n"}
          {"  "}
          <Kw>const</Kw> bookingUid <P>= </P>
          <Kw>await</Kw> <Fn>findPendingBookingFor</Fn>
          <P>(</P>From<P>);</P>
          {"\n\n"}
          {"  "}
          <Kw>if</Kw> <P>(</P>reply === <Str>{`"YES"`}</Str>
          <P>) {`{`}</P>
          {"\n"}
          {"    "}
          <Kw>await</Kw> <Fn>callCal</Fn>
          <P>(</P>
          <Str>{`"PATCH"`}</Str>
          <P>, </P>
          <Str>{`\`/v2/bookings/\${bookingUid}/confirm\``}</Str>
          <P>);</P>
          {"\n"}
          {"  "}
          <P>{`} `}</P>
          <Kw>else if</Kw> <P>(</P>reply === <Str>{`"NO"`}</Str>
          <P>) {`{`}</P>
          {"\n"}
          {"    "}
          <Kw>await</Kw> <Fn>callCal</Fn>
          <P>(</P>
          <Str>{`"DELETE"`}</Str>
          <P>, </P>
          <Str>{`\`/v2/bookings/\${bookingUid}\``}</Str>
          <P>, </P>
          <P>{`{`}</P>
          {"\n"}
          {"      "}cancellationReason<P>: </P>
          <Str>{`"Patient declined via SMS"`}</Str>
          <P>,</P>
          {"\n"}
          {"    "}
          <P>{`});`}</P>
          {"\n"}
          {"  "}
          <P>{`} `}</P>
          <Kw>else</Kw> <P>{`{`}</P>
          {"\n"}
          {"    "}
          <Fn>sendSms</Fn>
          <P>(</P>From<P>, </P>
          <Str>{`"Sorry — please reply YES or NO."`}</Str>
          <P>);</P>
          {"\n"}
          {"  "}
          <P>{`}`}</P>
          {"\n\n"}
          {"  "}res<P>.</P>
          <Fn>sendStatus</Fn>
          <P>(</P>
          <Num>200</Num>
          <P>);</P>
          {"\n"}
          <P>{`});`}</P>
          {"\n\n"}
          <Cmt>{`// Thin wrapper around the Cal.com v2 API`}</Cmt>
          {"\n"}
          <Kw>function</Kw> <Fn>callCal</Fn>
          <P>(</P>method<P>, </P>path<P>, </P>body<P>) {`{`}</P>
          {"\n"}
          {"  "}
          <Kw>return</Kw> <Fn>fetch</Fn>
          <P>(</P>
          <Str>{`\`https://api.cal.com\${path}\``}</Str>
          <P>, </P>
          <P>{`{`}</P>
          {"\n"}
          {"    "}method<P>,</P>
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
          <Str>{`"2024-08-13"`}</Str>
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
          {"    "}body<P>: </P>body <P>? </P>JSON<P>.</P>
          <Fn>stringify</Fn>
          <P>(</P>body<P>) : </P>
          <Kw>undefined</Kw>
          <P>,</P>
          {"\n"}
          {"  "}
          <P>{`});`}</P>
          {"\n"}
          <P>{`}`}</P>
        </code>
      </pre>
      <div className="border-t bg-muted/40 px-4 py-3">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Use a ‘Requires confirmation’ event type so the booking sits in a
          pending state until your service confirms it. Cal.com sends its own
          confirmation/cancellation emails — your service just decides which.
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
function Num({ children }: { children: React.ReactNode }) {
  return <span className="text-amber-600 dark:text-amber-400">{children}</span>;
}
function P({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground">{children}</span>;
}

const demo: Demo = {
  slug: "api-sms-confirmation",
  name: "SMS opt-in confirmations",
  description:
    "Confirm or cancel pending bookings with a YES/NO SMS exchange. Webhook-driven service that handles the SMS round-trip and calls the Cal.com confirm or cancel endpoint.",
  category: "Concepts",
  icon: MessageSquareIcon,
  Component: SmsConfirmationDemo,
};

export default demo;
