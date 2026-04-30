"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AtomIcon,
  CodeXmlIcon,
  MousePointerClickIcon,
  WorkflowIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { Demo, DemoCategory } from "@/demos/types";
import { getDemosByCategory } from "@/demos/registry";

const CATEGORY_ICON: Record<DemoCategory, React.ComponentType> = {
  Embeds: MousePointerClickIcon,
  Platform: AtomIcon,
  API: CodeXmlIcon,
  Concepts: WorkflowIcon,
};

function DemoMenuItem({ demo, active }: { demo: Demo; active: boolean }) {
  const Icon = demo.icon;
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        data-active={active || undefined}
        render={<Link href={`/${demo.slug}`} />}
      >
        <Icon />
        <span>{demo.name}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const groups = getDemosByCategory();

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <Link href="/" aria-label="Cal.com" className="px-2 py-[9.5px]">
          <Image
            src="/cal-logo.svg"
            alt="Cal.com"
            width={90}
            height={22}
            priority
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {groups.map(({ category, demos }) => {
          const CategoryIcon = CATEGORY_ICON[category];
          return (
            <SidebarGroup key={category}>
              <SidebarGroupLabel className="gap-2">
                {CategoryIcon ? <CategoryIcon /> : null}
                {category}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {demos.map((demo) => (
                    <DemoMenuItem
                      key={demo.slug}
                      demo={demo}
                      active={pathname === `/${demo.slug}`}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarFooter>
        <p className="px-2 text-[10px] text-muted-foreground">Copyright © 2026 Cal.com, Inc.<br />All rights reserved.</p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
