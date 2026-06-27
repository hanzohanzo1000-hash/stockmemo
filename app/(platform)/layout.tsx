import type { Metadata } from "next";
import { PlatformHeader } from "@/components/platform/platform-header";
import { ja } from "@/lib/i18n/ja";

export const metadata: Metadata = {
  title: ja.platform.metadata.title,
  robots: {
    index: false,
    follow: false,
  },
  description: ja.platform.metadata.description,
};

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full bg-black text-white">
      <PlatformHeader />
      <main>{children}</main>
    </div>
  );
}
