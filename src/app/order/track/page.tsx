import React, { Suspense } from "react";
import type { Metadata } from "next";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { OrderTrackClient } from "@/components/order/OrderTrackClient";

export const metadata: Metadata = {
  title: "Track Your Order — Giftly",
  description: "Track the real-time shipping and delivery status of your handcrafted Giftly order.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrderTrackPage() {
  return (
    <SiteLayout>
      <Suspense fallback={<div className="py-20 text-center text-sm text-[#7A6D70]">Loading order tracking...</div>}>
        <OrderTrackClient />
      </Suspense>
    </SiteLayout>
  );
}
