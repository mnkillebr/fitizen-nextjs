import { DarkModeToggle } from "@/components/DarkModeToggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>
      {children}
    </div>
  );
} 