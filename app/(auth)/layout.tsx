import { DarkModeToggle } from "@/components/DarkModeToggle";
import Image from "next/image";
import logo from "@/assets/fitizen-logo.svg";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-row absolute top-8 px-8 justify-between w-full lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[1536px]">
        <div className="flex md:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Fitizen</span>
            <Image
              unoptimized
              className="h-12 w-auto rounded-full"
              src={logo}
              alt="Fitizen Logo"
            />
          </a>
          <div className="ml-2 self-center font-bold text-lg">Fitizen</div>
        </div>
        <DarkModeToggle />
      </div>
      {children}
    </div>
  );
} 