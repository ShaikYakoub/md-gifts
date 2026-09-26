import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Gift Shop",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#FAF7F4] text-[#221C1D]">{children}</div>;
}
