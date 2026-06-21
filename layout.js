import "./globals.css";
import AtmosphereBackground from "@/components/AtmosphereBackground";

export const metadata = {
  title: "FOUNDRY SERIES — Mission Control",
  description:
    "FOUNDRY SERIES competition portal. Scan your event QR code to access live problem statements, datasets, and submissions.",
  themeColor: "#050505",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Share Tech Mono = display/countdown digits, JetBrains Mono =
            data/code text, Inter = body copy. Loaded via Google Fonts
            CDN to keep the build simple — swap for next/font if you
            want self-hosted fonts in production. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased min-h-screen relative">
        <AtmosphereBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
