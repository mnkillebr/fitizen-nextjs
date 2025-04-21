import Image from "next/image";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import FooterSection from "@/components/FooterSection";
import { Menu } from "lucide-react";
import { ChevronRight } from "@/assets/icons";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import Link from "next/link";
import clsx from "clsx";
import logo from "@/assets/fitizen-logo.svg";
import { existingSession } from "@/app/lib/dal";

export default async function Home() {
  const session = await existingSession();

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen pt-8 px-8 gap-16 font-[family-name:var(--font-geist-sans)]">
      <header className="absolute lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[1536px] justify-between w-full top-0 z-50 dark:bg-background px-8 lg:px-4">
        <nav className="flex items-center justify-between pt-6 md:pt-8" aria-label="Global">
          <div className="flex md:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Fitizen</span>
              <Image
                unoptimized
                className="h-12 w-auto rounded-full"
                src={logo}
                alt=""
              />
            </a>
            <div className="ml-2 self-center font-bold text-lg">Fitizen</div>
          </div>
          <div className="flex md:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-muted-foreground"
              // onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden md:flex md:flex-1 md:justify-end gap-4">
            <DarkModeToggle />
            <Link
              href={session ? "/dashboard" : "/login"}
              className={clsx(
                "flex items-center text-foreground dark:text-background bg-primary",
                "py-2 pl-3 pr-2 rounded-md hover:bg-primary/90 shadow",
                "text-sm"
              )}
            >
              <div>{session ? "Dashboard" : "Log In"}</div>
              <ChevronRight className="h-4 w-4"/>
            </Link>
          </div>
        </nav>

      </header>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
        <FooterSection />
      </main>
    </div>
  );
}
