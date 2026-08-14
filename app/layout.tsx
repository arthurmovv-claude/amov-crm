import type { Metadata } from "next";
import { neueMontreal, supply } from "./fonts";
import TopNav from "@/components/TopNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "A.mov CRM",
  description: "Suivi de prospection — A.mov Editing",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${neueMontreal.variable} ${supply.variable} antialiased`}>
        <div className="min-h-screen bg-background text-foreground">
          <TopNav />
          <main className="px-6 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
