"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { InfoPageLayout } from "@/components/informational/InfoPageLayout";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { GmailLogo } from "@/components/ui/GmailLogo";
import { InstagramLogo } from "@/components/ui/InstagramLogo";
import { GoogleCallLogo } from "@/components/ui/GoogleCallLogo";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_CONFIG } from "@/lib/siteConfig";

export default function ContactPage() {
  const whatsappUrl = getGeneralWhatsAppUrl();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<{ name?: string; phone?: string; message?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { name?: string; phone?: string; message?: string } = {};
    if (!formData.name.trim()) {
      errs.name = "Please enter your name";
    }
    if (!formData.phone.trim()) {
      errs.phone = "Please enter your phone or WhatsApp number";
    }
    if (!formData.message.trim()) {
      errs.message = "Please write a short message or inquiry";
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      if (errs.name) document.getElementById("name")?.focus();
      else if (errs.phone) document.getElementById("phone")?.focus();
      else if (errs.message) document.getElementById("message")?.focus();
      return;
    }

    setSubmitted(true);
  };

  return (
    <InfoPageLayout
      title="Contact Us"
      subtitle="We're here to help! Get in touch with MD Gifts for custom frames, engravings, gifts or bulk orders."
      breadcrumbLabel="Contact Us"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Info & Channels (Left Column) */}
        <div className="md:col-span-5 space-y-4">
          {/* Quick Connect & Support Channels */}
          <div className="p-4 bg-[#FAF5F1] rounded-2xl border border-[#EDE1D7]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A7B7E] mb-3">
              Direct Channels
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 h-10 px-3 py-2 rounded-xl bg-white border border-[#E8DDD4] text-[#3C3234] hover:text-[#0194A3] hover:border-[#0194A3] hover:bg-[#E6F7F9] transition-all shadow-2xs font-medium text-xs sm:text-sm cursor-pointer"
                aria-label="Chat with MD Gifts on WhatsApp"
              >
                <WhatsAppLogo className="w-4.5 h-4.5 shrink-0" />
                <span>WhatsApp</span>
              </a>

              {/* Gmail */}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="group inline-flex items-center justify-center gap-2 h-10 px-3 py-2 rounded-xl bg-white border border-[#E8DDD4] text-[#3C3234] hover:text-[#EC0B12] hover:border-[#EC0B12] hover:bg-[#FEF2F2] transition-all shadow-2xs font-medium text-xs sm:text-sm cursor-pointer"
                aria-label={`Email ${SITE_CONFIG.email} via Gmail`}
              >
                <GmailLogo className="w-4.5 h-4.5 shrink-0" />
                <span>Gmail</span>
              </a>

              {/* Direct Call */}
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="group inline-flex items-center justify-center gap-2 h-10 px-3 py-2 rounded-xl bg-white border border-[#E8DDD4] text-[#3C3234] hover:text-[#EC0B12] hover:border-[#EC0B12] hover:bg-[#FEF2F2] transition-all shadow-2xs font-medium text-xs sm:text-sm cursor-pointer"
                aria-label={`Call ${SITE_CONFIG.phoneDisplay}`}
              >
                <GoogleCallLogo className="w-4.5 h-4.5 shrink-0" />
                <span>Call Us</span>
              </a>

              {/* Instagram */}
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 h-10 px-3 py-2 rounded-xl bg-white border border-[#E8DDD4] text-[#3C3234] hover:text-[#0194A3] hover:border-[#0194A3] hover:bg-[#E6F7F9] transition-all shadow-2xs font-medium text-xs sm:text-sm cursor-pointer"
                aria-label="Follow MD Gifts on Instagram"
              >
                <InstagramLogo className="w-4.5 h-4.5 shrink-0" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Phone Card */}
          <div className="p-4 bg-[#FAF5F1] rounded-2xl border border-[#EDE1D7] flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#FEF2F2] flex items-center justify-center shrink-0 text-[#EC0B12]">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A7B7E]">Phone & WhatsApp</p>
              <h3 className="font-semibold text-sm text-[#221C1D] mt-0.5">
                <a href={`tel:${SITE_CONFIG.phone}`} className="hover:text-[#EC0B12] transition-colors">
                  {SITE_CONFIG.phoneDisplay}
                </a>
              </h3>
              <p className="text-xs text-[#7A6D70] mt-0.5">Mon – Sat, 9:30 AM – 8:30 PM</p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-xs font-semibold text-[#0194A3] hover:underline"
              >
                Instant Order on WhatsApp →
              </a>
            </div>
          </div>

          {/* Email Card */}
          <div className="p-4 bg-[#FAF5F1] rounded-2xl border border-[#EDE1D7] flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#E6F7F9] flex items-center justify-center shrink-0 text-[#0194A3]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A7B7E]">Official Email</p>
              <h3 className="font-semibold text-sm text-[#221C1D] mt-0.5">
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-[#0194A3] transition-colors">
                  {SITE_CONFIG.email}
                </a>
              </h3>
              <p className="text-xs text-[#7A6D70] mt-0.5">Custom inquiries & photo submissions</p>
            </div>
          </div>

          {/* Full Official Store Address Card */}
          <div className="p-4 bg-[#FAF5F1] rounded-2xl border border-[#EDE1D7] flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#FEF2F2] flex items-center justify-center shrink-0 text-[#EC0B12]">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A7B7E]">Workshop & Store Address</p>
              <h3 className="font-semibold text-sm text-[#221C1D]">
                {SITE_CONFIG.fullName}
              </h3>
              <div className="text-xs text-[#5C4F51] space-y-0.5 pt-0.5 leading-relaxed">
                <p><span className="font-medium text-[#221C1D]">Building/Flat:</span> {SITE_CONFIG.address.building}</p>
                <p><span className="font-medium text-[#221C1D]">Street/Road:</span> {SITE_CONFIG.address.street}</p>
                <p><span className="font-medium text-[#221C1D]">City:</span> {SITE_CONFIG.address.city}</p>
                <p><span className="font-medium text-[#221C1D]">District:</span> {SITE_CONFIG.address.district}</p>
                <p><span className="font-medium text-[#221C1D]">State:</span> {SITE_CONFIG.address.state} — PIN: {SITE_CONFIG.address.pincode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (Right Column) */}
        <div className="md:col-span-7 bg-[#FAF5F1] p-6 rounded-2xl border border-[#EDE1D7]">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#E6F7F9] text-[#0194A3] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#221C1D]">
                Message Sent Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-[#6C5E61] max-w-sm mx-auto">
                Thank you for reaching out. An MD Gifts design specialist will review your note and respond via WhatsApp or email shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: "", phone: "", message: "" });
                }}
                className="mt-4 px-4 py-2 bg-white text-xs font-semibold text-[#EC0B12] rounded-xl border border-[#EC0B12] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-[#3C3234] mb-1">
                  Name <span className="text-[#EC0B12]">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  placeholder="Enter your name"
                  className={`w-full bg-white text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border outline-none transition-all shadow-2xs ${
                    errors.name ? "border-[#EC0B12] ring-2 ring-[#EC0B12]/20 bg-[#FFF5F5]" : "border-[#EDE0D6] focus:border-[#EC0B12]"
                  }`}
                />
                {errors.name && (
                  <div className="animate-fade-in relative mt-2 inline-flex items-center gap-1.5 bg-[#EC0B12] text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-md">
                    <div className="absolute -top-1 left-4 w-2 h-2 bg-[#EC0B12] rotate-45" />
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-white" />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-[#3C3234] mb-1">
                  Phone / WhatsApp <span className="text-[#EC0B12]">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                  }}
                  placeholder="e.g. 7095253709"
                  className={`w-full bg-white text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border outline-none transition-all shadow-2xs ${
                    errors.phone ? "border-[#EC0B12] ring-2 ring-[#EC0B12]/20 bg-[#FFF5F5]" : "border-[#EDE0D6] focus:border-[#EC0B12]"
                  }`}
                />
                {errors.phone && (
                  <div className="animate-fade-in relative mt-2 inline-flex items-center gap-1.5 bg-[#EC0B12] text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-md">
                    <div className="absolute -top-1 left-4 w-2 h-2 bg-[#EC0B12] rotate-45" />
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-white" />
                    <span>{errors.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-[#3C3234] mb-1">
                  Message & Customization Query <span className="text-[#EC0B12]">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: undefined });
                  }}
                  placeholder="Tell us about the photo frame, mug, acrylic plaque, or custom gift you would like to create..."
                  className={`w-full bg-white text-sm text-[#221C1D] placeholder-[#9E9093] px-3.5 py-2.5 rounded-xl border outline-none transition-all shadow-2xs ${
                    errors.message ? "border-[#EC0B12] ring-2 ring-[#EC0B12]/20 bg-[#FFF5F5]" : "border-[#EDE0D6] focus:border-[#EC0B12]"
                  }`}
                />
                {errors.message && (
                  <div className="animate-fade-in relative mt-2 inline-flex items-center gap-1.5 bg-[#EC0B12] text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-md">
                    <div className="absolute -top-1 left-4 w-2 h-2 bg-[#EC0B12] rotate-45" />
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-white" />
                    <span>{errors.message}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#EC0B12] hover:bg-[#D0080E] text-white py-3 px-6 rounded-xl font-semibold text-sm transition-transform active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
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
