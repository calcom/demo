import type { Metadata } from "next";
import "./globals.css";
import { Inter, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
const interHeading = Inter({ subsets: ["latin"], variable: "--font-heading" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Cal.com Demos",
  description: "See how Cal.com can be integrated into your workflow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        inter.variable,
        interHeading.variable,
        geistMono.variable,
      )}
    >
      <body className="min-h-full">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-5" />
              <span className="text-sm font-medium ml-2">Cal.com Sandbox</span>
            </header>
            <div className="flex-1 px-6 py-8 md:px-10 md:py-10">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
