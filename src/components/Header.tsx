"use client";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Menu, X } from "lucide-react";
import { Button } from "@shared/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { assets } from "@/constants/assets";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  const t = useTranslations("Header");
  const menuItems = [
    { name: t("home"), href: "/home" },
    { name: t("aboutus"), href: "/home" },
    { name: t("services"), href: "/home" },
    { name: t("projectGallery"), href: "/home" },
    { name: t("contractorDirectory"), href: "/home" },
    { name: t("suppliers"), href: "/home" },
    { name: t("buildingMaterials"), href: "/home" },
  ];
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const active = usePathname();
  const isHome = active === "/home";
  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className={cn(
          "fixed z-50 w-full transition-all duration-300",
          isScrolled &&
            "bg-background/75 border-b border-black/5 backdrop-blur-lg",
          isHome && !isScrolled && "text-white"
        )}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div
            className={cn(
              "relative flex flex-wrap items-center justify-between gap-6  transition-all duration-200 lg:gap-0",
              isScrolled && "py-0"
            )}
          >
            <div className="flex w-full justify-between gap-6 lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Image
                  src={assets.logo}
                  alt="logo"
                  width={100}
                  height={100}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
                />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
              <div className="m-auto hidden size-fit lg:block">
                <ul className="flex gap-1">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Button asChild variant="ghost" size="sm">
                        <Link
                          href={item.href}
                          className={cn(
                            "text-base transition-all duration-200 hover:text-design-main relative hover:bg-transparent",
                            active === item.href &&
                              " font-semibold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:bg-design-main after:rounded-full after:animate-[slideIn_0.3s_ease-out]"
                          )}
                        >
                          <span>{item.name}</span>
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-background/90 text-foreground backdrop-blur-lg in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className={cn(
                          "hover:text-design-main block duration-200 transition-all py-2 px-3 rounded-lg relative",
                          active === item.href && "text-design-main"
                        )}
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button
                  asChild
                  size="sm"
                  className={cn("h-10 rounded-full px-6 text-white")}
                >
                  <Link href="/login">
                    <span>{t("login")}</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
