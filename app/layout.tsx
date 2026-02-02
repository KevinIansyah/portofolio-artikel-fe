import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { cookies } from "next/headers";
import { Metadata } from "next";

import "./globals.css";
import { LanguageProvider } from "@/contexts/language-context";
import { SWRProvider } from "@/contexts/swr-context";

import { Toaster } from "sonner";
import { PersonSchema, WebsiteSchema } from "@/components/seo-schema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const language = (cookieStore.get("language")?.value as "id" | "en") ?? "id";

  return (
    <html lang={language} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PersonSchema />
        <WebsiteSchema />
        <Toaster position="top-right" richColors />

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SWRProvider>
            <LanguageProvider initialLanguage={language}>{children}</LanguageProvider>
          </SWRProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
