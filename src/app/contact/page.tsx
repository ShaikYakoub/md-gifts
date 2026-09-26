"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";
import { InfoPageLayout } from "@/components/informational/InfoPageLayout";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone && formData.message) {
      setSubmitted(true);
    }
  };

  return (
    <InfoPageLayout
      title="Contact Us"
      subtitle="We're here to help! Get in touch with us for any queries, custom requests or bulk orders."
      breadcrumbLabel="Contact Us"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards (Left Column) */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-4 bg-[#FAF5F1] rounded-2xl border border-[#EDE1D7] flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#FAF0EC] flex items-center justify-center shrink-0 text-[#C85250]">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#221C1D]">+91 98765 43210</h3>
              <p className="text-xs text-[#7A6D70] mt-0.5">Mon – Sat, 10 AM – 7 PM</p>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-xs font-semibold text-[#C85250] hover:underline"
              >
                Chat on WhatsApp →
              </a>
            </div>
          </div>

          <div className="p-4 bg-[#FAF5F1] rounded-2xl border border-[#EDE1D7] flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#FAF0EC] flex items-center justify-center shrink-0 text-[#C85250]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#221C1D]">support@giftly.in</h3>
              <p className="text-xs text-[#7A6D70] mt-0.5">We usually respond within 24 hours</p>
            </div>
          </div>

          <div className="p-4 bg-[#FAF5F1] rounded-2xl border border-[#EDE1D7] flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#FAF0EC] flex items-center justify-center shrink-0 text-[#C85250]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#221C1D]">Kadapa, Andhra Pradesh</h3>
              <p className="text-xs text-[#7A6D70] mt-0.5">India – 516001</p>
            </div>
          </div>
        </div>

        {/* Contact Form (Right Column) */}
        <div className="md:col-span-7 bg-[#FAF5F1] p-6 rounded-2xl border border-[#EDE1D7]">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#EAF7ED] text-[#1E7238] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#221C1D]">
                Message Sent Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-[#6C5E61] max-w-sm mx-auto">
                Thank you for reaching out. A Giftly design specialist will review your note and respond via WhatsApp or email shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: "", phone: "", message: "" });
                }}
                className="mt-4 px-4 py-2 bg-white text-xs font-semibold text-[#C85250] rounded-xl border border-[#C85250] hover:bg-[#FAF0EC]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-[#3C3234] mb-1">
                  Name <span className="text-[#C85250]">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full bg-white text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border border-[#EDE0D6] focus:border-[#C85250] outline-none"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-[#3C3234] mb-1">
                  Phone Number <span className="text-[#C85250]">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border border-[#EDE0D6] focus:border-[#C85250] outline-none"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-[#3C3234] mb-1">
                  Message <span className="text-[#C85250]">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you? Tell us about your custom design ideas..."
                  className="w-full bg-white text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border border-[#EDE0D6] focus:border-[#C85250] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#C85250] hover:bg-[#B14140] text-white py-3 px-6 rounded-xl font-semibold text-sm transition-transform active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </InfoPageLayout>
  );
}
