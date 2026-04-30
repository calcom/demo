import { notFound } from "next/navigation";
import { demos, getDemoBySlug } from "@/demos/registry";

export function generateStaticParams() {
  return demos.map((d) => ({ demo: d.slug }));
}

export async function generateMetadata(props: PageProps<"/[demo]">) {
  const { demo: slug } = await props.params;
  const demo = getDemoBySlug(slug);
  if (!demo) return {};
  return {
    title: `${demo.name} — Cal.com Demos`,
    description: demo.description,
  };
}

export default async function DemoPage(props: PageProps<"/[demo]">) {
  const { demo: slug } = await props.params;
  const demo = getDemoBySlug(slug);
  if (!demo) notFound();

  const { Component } = demo;
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {demo.category}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">{demo.name}</h1>
        <p className="text-sm text-muted-foreground">{demo.description}</p>
      </header>
      <Component />
    </div>
  );
}
