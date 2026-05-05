import {
  ArrowDownIcon,
  BellIcon,
  BuildingIcon,
  CalendarIcon,
  DoorOpenIcon,
  LayoutGridIcon,
  MapPinIcon,
  ServerIcon,
  UserIcon,
  WebhookIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Demo } from "../types";

type Tone = "customer" | "cal";

function RoomAssignmentDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border bg-card px-4 py-8 sm:px-8">
        <Flowchart />
      </div>
      <RoomBoard />
      <WebhookSnippet />
    </div>
  );
}

function Flowchart() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <div className="flex justify-center">
        <Block
          tone="cal"
          icons={[<CalendarIcon key="a" />, <UserIcon key="b" />]}
          title="Patient books a slot"
          subtitle="Cal.com booker — drop-in or custom UI."
          wide
        />
      </div>

      <Connector label="triggerEvent: BOOKING_CREATED" accent="webhook" />

      <div className="flex justify-center">
        <Block
          tone="customer"
          icons={[<WebhookIcon key="a" />, <ServerIcon key="b" />]}
          title="Your webhook handler"
          subtitle="POST /api/webhooks/cal — receives booking payload."
          wide
        />
      </div>

      <Connector label="Look up the right room" />

      <div className="flex justify-center">
        <Block
          tone="customer"
          icons={[<LayoutGridIcon key="a" />, <DoorOpenIcon key="b" />]}
          title="Internal room scheduler"
          subtitle="Picks a room from doctor, equipment, time, and current occupancy."
          wide
        />
      </div>

      <Connector
        label="PATCH /v2/bookings/:uid/location"
        accent="api"
      />

      <div className="flex justify-center">
        <Block
          tone="cal"
          icons={[<MapPinIcon key="a" />]}
          title="Cal.com booking updated"
          subtitle='location: "Room 3B — Floor 2, North wing"'
          wide
        />
      </div>

      <Connector label="Confirmation email + calendar invite refreshed" />

      <div className="flex justify-center">
        <Block
          tone="cal"
          icons={[<BellIcon key="a" />]}
          title="Patient & doctor notified"
          subtitle="Cal.com sends the room as part of its normal workflow."
          wide
        />
      </div>
    </div>
  );
}

function RoomBoard() {
  const rooms: Array<{
    name: string;
    floor: string;
    status: "free" | "in-use" | "blocked" | "assigned";
    note: string;
  }> = [
    { name: "1A", floor: "Floor 1", status: "in-use", note: "until 10:30" },
    { name: "1B", floor: "Floor 1", status: "free", note: "ready" },
    { name: "2A", floor: "Floor 2", status: "blocked", note: "cleaning" },
    {
      name: "3B",
      floor: "Floor 2",
      status: "assigned",
      note: "→ booking #abc123",
    },
    { name: "3C", floor: "Floor 2", status: "free", note: "ready" },
    { name: "4A", floor: "Floor 3", status: "in-use", note: "until 11:15" },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
        <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <BuildingIcon className="size-3.5" />
          Internal room board
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          your scheduler — not Cal.com
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3">
        {rooms.map((r) => (
          <RoomTile key={r.name} {...r} />
        ))}
      </div>
    </div>
  );
}

function RoomTile({
  name,
  floor,
  status,
  note,
}: {
  name: string;
  floor: string;
  status: "free" | "in-use" | "blocked" | "assigned";
  note: string;
}) {
  const palette = {
    free: {
      ring: "ring-1 ring-emerald-500/30",
      bg: "bg-emerald-500/[0.05]",
      dot: "bg-emerald-500",
      label: "Free",
      labelTone: "text-emerald-600 dark:text-emerald-400",
    },
    "in-use": {
      ring: "ring-1 ring-border",
      bg: "bg-muted/30",
      dot: "bg-muted-foreground/60",
      label: "In use",
      labelTone: "text-muted-foreground",
    },
    blocked: {
      ring: "ring-1 ring-amber-500/30",
      bg: "bg-amber-500/[0.05]",
      dot: "bg-amber-500",
      label: "Blocked",
      labelTone: "text-amber-600 dark:text-amber-400",
    },
    assigned: {
      ring: "ring-2 ring-primary/40",
      bg: "bg-primary/[0.06]",
      dot: "bg-primary",
      label: "Assigned",
      labelTone: "text-primary",
    },
  }[status];

  return (
    <div
      className={cn(
        "relative flex flex-col gap-1 rounded-lg border bg-card p-3",
        palette.ring,
        palette.bg,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <DoorOpenIcon className="size-3.5 text-muted-foreground" />
          <span className="text-sm font-semibold">Room {name}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className={cn("size-1.5 rounded-full", palette.dot)} />
          <span className={cn("text-[10px] font-medium", palette.labelTone)}>
            {palette.label}
          </span>
        </span>
      </div>
      <span className="text-[11px] text-muted-foreground">
        {floor} · {note}
      </span>
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
  accent?: "default" | "webhook" | "api";
}) {
  const tone =
    accent === "webhook"
      ? "border-violet-500/40 bg-violet-500/5 text-violet-600 dark:text-violet-400"
      : accent === "api"
        ? "border-violet-500/40 bg-violet-500/5 text-violet-600 dark:text-violet-400"
        : "border-border bg-card text-muted-foreground";
  const lineColor =
    accent === "default" ? "border-border" : "border-violet-500/40";
  const arrowColor =
    accent === "default" ? "text-muted-foreground" : "text-violet-500";
  return (
    <div className="relative my-1 flex justify-center py-2">
      <div
        className={cn(
          "absolute left-1/2 top-0 h-full w-px -translate-x-1/2 border-l border-dashed",
          lineColor,
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
          arrowColor,
        )}
      />
    </div>
  );
}

function WebhookSnippet() {
  return (
    <div className="overflow-hidden rounded-xl border bg-code">
      <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Room assignment webhook
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          POST /api/webhooks/cal
        </span>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
        <code className="font-mono">
          <Cmt>{`// Triggered by Cal.com whenever a patient confirms a slot`}</Cmt>
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
          <Kw>const</Kw> <P>{`{`} </P>triggerEvent<P>, </P>payload<P> {`}`} = </P>
          req<P>.</P>body<P>;</P>
          {"\n"}
          {"  "}
          <Kw>if</Kw> <P>(</P>triggerEvent !== <Str>{`"BOOKING_CREATED"`}</Str>
          <P>) </P>
          <Kw>return</Kw> res<P>.</P>
          <Fn>json</Fn>
          <P>(</P>
          <P>{`{ `}</P>ok<P>: </P>
          <Kw>true</Kw>
          <P>{` }`}</P>
          <P>);</P>
          {"\n\n"}
          {"  "}
          <Cmt>{`// 1. Run your room scheduling logic`}</Cmt>
          {"\n"}
          {"  "}
          <Kw>const</Kw> room <P>= </P>
          <Kw>await</Kw> <Fn>pickRoom</Fn>
          <P>(</P>
          <P>{`{`}</P>
          {"\n"}
          {"    "}doctorId<P>: </P>payload<P>.</P>organizer<P>.</P>id<P>,</P>
          {"\n"}
          {"    "}startTime<P>: </P>payload<P>.</P>startTime<P>,</P>
          {"\n"}
          {"    "}duration<P>: </P>payload<P>.</P>length<P>,</P>
          {"\n"}
          {"    "}equipment<P>: </P>payload<P>.</P>metadata<P>?.</P>equipment<P>,</P>
          {"\n"}
          {"  "}
          <P>{`});`}</P>
          {"\n"}
          {"  "}
          <Cmt>{`// → { name: "3B", floor: 2, building: "North wing" }`}</Cmt>
          {"\n\n"}
          {"  "}
          <Cmt>{`// 2. Push the assignment back to Cal.com`}</Cmt>
          {"\n"}
          {"  "}
          <Kw>await</Kw> <Fn>fetch</Fn>
          <P>(</P>
          <Str>
            {`\`https://api.cal.com/v2/bookings/\${payload.uid}/location\``}
          </Str>
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
          {"    "}body<P>: </P>JSON<P>.</P>
          <Fn>stringify</Fn>
          <P>(</P>
          <P>{`{`}</P>
          {"\n"}
          {"      "}location<P>: </P>
          <P>{`{`}</P>
          {"\n"}
          {"        "}type<P>: </P>
          <Str>{`"address"`}</Str>
          <P>,</P>
          {"\n"}
          {"        "}address<P>: </P>
          <Str>
            {`\`Room \${room.name} — Floor \${room.floor}, \${room.building}\``}
          </Str>
          <P>,</P>
          {"\n"}
          {"      "}
          <P>{`},`}</P>
          {"\n"}
          {"    "}
          <P>{`}),`}</P>
          {"\n"}
          {"  "}
          <P>{`});`}</P>
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
      <div className="border-t bg-muted/40 px-4 py-3">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          The same flow works for last-minute swaps — re-run the assigner on a
          cron or on a room-board change and PATCH again. Cal.com refreshes the
          calendar invite and notifies both attendees.
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

const demo: Demo = {
  slug: "api-room-assignment",
  name: "Custom room assignments",
  description:
    "Architecture pattern for assigning physical rooms to bookings — a webhook-driven service that runs your own room-scheduling logic and patches the booking location via the Cal.com API.",
  category: "Concepts",
  icon: DoorOpenIcon,
  Component: RoomAssignmentDemo,
};

export default demo;
