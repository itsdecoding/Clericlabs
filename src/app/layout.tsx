import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { ContentProvider } from "@/context/ContentContext";
import { CreateContentModal } from "@/components/modals/CreateContentModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Content OS • Clericlabs",
  description: "Internal command center and editorial production pipeline for Clericlabs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ContentProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-0 md:ml-[256px] min-w-0 transition-all pb-28 md:pb-6">
              {children}
            </div>
          </div>
          <MobileTabBar />
          <CreateContentModal />
        </ContentProvider>
      </body>
    </html>
  );
}
