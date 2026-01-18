import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { cookies } from "next/headers";

import "./globals.css";
import { LanguageProvider } from "@/contexts/language-context";
import { SWRProvider } from "@/contexts/swr-context";

import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
