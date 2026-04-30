import { NextResponse } from "next/server";
import {
  CAL_API_URL,
  CAL_API_VERSION,
  CAL_EVENT_TYPE_ID,
} from "@/demos/api-slots/cal-config";

export async function GET(request: Request) {
  const apiKey = process.env.CAL_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "CAL_API_KEY is not set" },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const timeZone = searchParams.get("timeZone") ?? "UTC";

  if (!start || !end) {
    return NextResponse.json(
      { error: "Missing 'start' or 'end' query parameter" },
      { status: 400 },
    );
  }

  const params = new URLSearchParams({
    eventTypeId: String(CAL_EVENT_TYPE_ID),
    start,
    end,
    timeZone,
  });

  const upstream = await fetch(`${CAL_API_URL}?${params.toString()}`, {
    headers: {
      "cal-api-version": CAL_API_VERSION,
      Authorization: `Bearer ${apiKey}`,
    },
    cache: "no-store",
  });

  const body = await upstream.json();
  return NextResponse.json(body, { status: upstream.status });
}
