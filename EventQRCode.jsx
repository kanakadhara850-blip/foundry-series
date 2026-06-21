"use client";
// src/components/EventQRCode.jsx
//
// Renders a scannable QR code pointing at the event's public URL.
// Shown in the admin dashboard so organizers can screenshot/print one
// per event for table signage / entry banners.

import { QRCodeCanvas } from "qrcode.react";

export default function EventQRCode({ slug, size = 140 }) {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "https://foundry-series.vercel.app";
  const url = `${baseUrl}/event/${slug}`;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="bg-white p-2 rounded-md">
        <QRCodeCanvas value={url} size={size} fgColor="#050505" bgColor="#ffffff" />
      </div>
      <p className="text-[10px] font-mono text-white/40 break-all text-center max-w-[160px]">
        {url}
      </p>
    </div>
  );
}
