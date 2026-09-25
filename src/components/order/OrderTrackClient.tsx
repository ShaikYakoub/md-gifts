"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  CheckCircle2,
  Search,
  ExternalLink,
} from "lucide-react";

export function OrderTrackClient() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "GF-789123";
  const [trackingId, setTrackingId] = useState(initialId);
  const [activeId, setActiveId] = useState(initialId);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      setActiveId(trackingId.trim().toUpperCase());
    }
  };

  const steps = [
    {
      title: "Order Placed",
      time: "23 Sep, 10:30 AM",
      status: "completed",
    },
    {
      title: "Processing & Design Approval",
      time: "23 Sep, 02:15 PM",
      status: "completed",
    },
    {
      title: "Shipped & Dispatched",
      time: "24 Sep, 11:00 AM",
      status: "completed",
    },
    {
      title: "Out for Delivery",
      time: "26 Sep, Expected",
      status: "current",
    },
    {
      title: "Delivered",
      time: "26 Sep, Expected",
      status: "upcoming",
    },
  ];

  return (
    <div className="pt-6 pb-28 sm:py-16 max-w-lg mx-auto px-4">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EFE4DC] mb-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#5C4F51] hover:text-[#C85250] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Shop</span>
        </Link>
        <span className="text-xs text-[#8C7D80]">Live Courier Tracking</span>
      </div>

      {/* Order Lookup Form */}
      <form onSubmit={handleLookup} className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8C7D80] absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter Order ID (e.g. GF-789123)"
            className="w-full bg-white text-sm text-[#221C1D] placeholder-[#9E9093] pl-9 pr-3 py-2.5 rounded-xl border border-[#EDE0D6] focus:border-[#C85250] outline-none"
          />
        </div>
        <button
          type="submit"
          className="bg-[#C85250] hover:bg-[#B14140] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0"
        >
          Track
        </button>
      </form>

      {/* Main Order Card */}
      <div className="bg-white rounded-2xl border border-[#EDE2DA] p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0E6DE] mb-6">
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#221C1D]">
              Order #{activeId}
            </h1>
            <p className="text-xs text-[#7A6D70] mt-0.5">Placed on 23 Sep 2026</p>
          </div>
          <span className="bg-[#FAF0EC] text-[#C85250] text-xs font-semibold px-3 py-1 rounded-full border border-[#F2DDD5]">
            In Transit
          </span>
        </div>

        {/* Vertical Timeline (matching screenshot) */}
        <div className="relative pl-6 space-y-7 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EDE0D6]">
          {steps.map((step, idx) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";

            return (
              <div key={idx} className="relative flex items-start gap-4 group">
                {/* Node icon */}
                <div
                  className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-[#C85250] text-white shadow-xs"
                      : isCurrent
                      ? "bg-white border-2 border-[#C85250] text-[#C85250]"
                      : "bg-[#F7EFEA] border-2 border-[#D8C7BC] text-[#9E9093]"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-[#C85250] animate-pulse" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8ACA4]" />
                  )}
                </div>

                <div className="flex-1">
                  <p
                    className={`text-sm font-semibold ${
                      isCompleted || isCurrent ? "text-[#221C1D]" : "text-[#7A6D70]"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-[#7A6D70] mt-0.5">{step.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Courier Section (matching screenshot) */}
        <div className="mt-8 pt-6 border-t border-[#F0E6DE]">
          <p className="text-xs text-[#7A6D70] mb-2 font-medium">Track live with Delhivery</p>
          <div className="flex items-center justify-between p-3.5 bg-[#FAF5F1] rounded-xl border border-[#EDE1D7]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#221C1D] text-white flex items-center justify-center font-black text-[10px] tracking-wider">
                DEL
              </div>
              <div>
                <p className="text-xs font-bold text-[#221C1D] tracking-wide">DELHIVERY</p>
                <p className="text-[11px] text-[#7A6D70]">AWB: 489201948201</p>
              </div>
            </div>

            <a
              href="https://www.delhivery.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#C85250] hover:bg-[#B14140] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              <span>Track</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Help Note */}
      <div className="text-center text-xs text-[#7A6D70] space-y-1">
        <p>Need help with your shipment or change of delivery address?</p>
        <p>
          Contact our WhatsApp support at{" "}
          <a
            href="https://wa.me/919876543210"
            className="text-[#C85250] font-semibold hover:underline"
          >
            +91 98765 43210
          </a>
        </p>
      </div>
    </div>
  );
}
