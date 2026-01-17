import { Metadata } from "next";

import { apiServer } from "@/lib/api/server";
import { User } from "@/lib/types/user";
import Home from "./_components/home";

export const metadata: Metadata = {
  title: "Kevin Iansyah - Full Stack Developer & Software Engineer",
  description: "Full Stack Developer yang berspesialisasi dalam React, Next.js, TypeScript, dan Laravel. Jelajahi proyek, artikel, dan keahlian saya dalam pengembangan web.",
  keywords: ["Full Stack Developer", "Web Developer", "React", "Next.js", "Laravel", "TypeScript", "Portofolio"],
  authors: [{ name: "Kevin Iansyah" }],
  openGraph: {
    title: "Kevin Iansyah - Full Stack Developer",
    description: "Full Stack Developer yang passionate dalam membangun aplikasi web modern",
    type: "website",
    locale: "id_ID",
    url: "https://keviniansyah.site",
    siteName: "Portofolio Kevin Iansyah",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kevin Iansyah - Full Stack Developer",
    description: "Full Stack Developer yang passionate dalam membangun aplikasi web modern",
  },
};

// async function getInitialUser(): Promise<User | null> {
//   try {
//     const user = await apiServer.get<User>("/api/me");

//     return user;
//   } catch (error) {
//     console.error("Failed to fetch user:", error);

//     return null;
//   }
// }

export default async function Page() {
  return <Home />;
}
