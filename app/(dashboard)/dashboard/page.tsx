import { Metadata } from "next";
import { apiServer } from "@/lib/api/server";
import { User } from "@/lib/types/user";
import Dashboard from "./_components/dashboard";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard - Kevin Iansyah",
  description: "Dashboard overview page",
};

async function getInitialUser(): Promise<User | null> {
  try {
    const user = await apiServer.get<User>("/api/me");

    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);

    return null;
  }
}

export default async function Page() {
  const initialUser = await getInitialUser();

  if (!initialUser) {
    redirect("/login");
  }

  return <Dashboard initialUser={initialUser} />;
}
