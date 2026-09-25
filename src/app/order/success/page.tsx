import React, { Suspense } from "react";
import type { Metadata } from "next";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { OrderSuccessClient } from "@/components/order/OrderSuccessClient";

export const metadata: Metadata = {
  title: "Order Placed Successfully",
  description: "Thank you for shopping with Giftly. Your personalized gift order has been received.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrderSuccessPage() {
  return (
    <SiteLayout>
      <Suspense fallback={<div className="py-20 text-center text-[#7A6D70]">Loading confirmation...</div>}>
        <OrderSuccessClient />
      </Suspense>
    </SiteLayout>
  );
}
