"use client";
import Image from "next/image";
import Link from "next/link";

import Logo from "@/assets/Hypercerts.svg";
import { NavLinks } from "@/components/global/nav-links";
import { WalletProfile } from "@/components/global/wallet-profile";

const NavMenu = () => {
  return (
    <>
      <nav className="p-0 md:p-4 fixed top-0 left-0 right-0 z-10 flex items-center justify-center">
        <section className="border border-transparent md:border-border bg-background/80 backdrop-blur-md rounded-none md:rounded-2xl p-2 shadow-lg flex w-full max-w-7xl items-center justify-between">
          <div className="flex flex-1 items-center md:absolute md:left-[50%]">
            <Link
              className="flex w-full justify-center"
              aria-label="ZuDeck Home"
              href="/reports"
            >
              <Logo
                className="h-8 w-auto"
                alt="Hypercerts Logo"
                width={250}
                height={250}
              />
            </Link>
          </div>
          <NavLinks />

          <div className="hidden gap-2 md:flex">
            <WalletProfile />
          </div>
        </section>
      </nav>
      <div className="w-full h-16"></div>
    </>
  );
};

NavMenu.displayName = "NavMenu";

export { NavMenu };
