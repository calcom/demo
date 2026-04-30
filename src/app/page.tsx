import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDemosByCategory } from "@/demos/registry";

export default function Home() {
  const groups = getDemosByCategory();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Cal.com, in every form factor.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          A growing collection of live, copy-pasteable examples showing how
          Cal.com fits into your product — from drop-in embeds to fully custom
          booking flows built on the platform API.
        </p>
      </header>

      {groups.map(({ category, demos }) => (
        <section key={category} className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold tracking-tight">{category}</h2>
            <Badge variant="secondary">{demos.length}</Badge>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {demos.map((demo) => (
              <Card
                key={demo.slug}
                render={<Link href={`/${demo.slug}`} />}
                className="group transition-colors hover:bg-accent/30"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{demo.name}</CardTitle>
                    <ArrowUpRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <CardDescription>{demo.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
