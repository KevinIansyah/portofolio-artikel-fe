"use client";

import Heading from "@/components/dashboard/heading";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { User } from "@/lib/types/user";

interface DashboardProps {
  initialUser: User | null;
}

export default function Dashboard({ initialUser }: DashboardProps) {
  const { user, isLoading } = useAuth({ initialUser });
  const { t } = useLanguage();

  if (isLoading && !user) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <Heading title={`${t("heading.dashboard.title")}, ${user.name}`} description={t("heading.dashboard.description")} />
    </div>
  );
}
