import AppFooter from "@/components/home/app-footer";
import AppHeader from "@/components/home/app-header";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AppHeader />
      <main className="-mt-16">{children}</main>
      <AppFooter />
    </div>
  );
}
