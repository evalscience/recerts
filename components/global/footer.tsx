"use client";
import Logo from "@/assets/Hypercerts.svg";
import { ArrowUpRight, Menu, Newspaper, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { WalletProfile } from "./wallet-profile";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <>
      <div className="h-24 w-full md:hidden"></div>
      <footer className="fixed inset-x-0 bottom-0 items-center border-t-border border-t-[1.5px] bg-background/80 backdrop-blur-lg py-2 text-center md:static overflow-hidden">
        <MobileFooter />
        <DesktopFooter />
      </footer>
    </>
  );
};

const MobileFooter = () => {
  return (
    <nav
      aria-label="Mobile Footer Navigation"
      className="w-full px-8 pt-2 pb-4"
    >
      <ul className="flex items-center justify-between gap-1 md:hidden">
        <li>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
            passHref
          >
            <div className="jusify-center flex flex-col items-center">
              <Newspaper aria-hidden="true" focusable="false" />
              <span className="text-xs">Hypercerts</span>
            </div>
          </Link>
        </li>
        <li>
          <WalletProfile />
        </li>
        <li>
          <Drawer>
            <DrawerTrigger>
              <div className="flex flex-col items-center justify-center">
                <Menu aria-hidden="true" focusable="false" />
                <span className="text-xs">More</span>
              </div>
            </DrawerTrigger>

            <DrawerContent>
              <DrawerHeader>
                <div className="flex justify-center">
                  <Logo
                    className="h-8 w-auto"
                    alt="Hypercerts Logo"
                    width={500}
                    height={500}
                  />
                </div>
              </DrawerHeader>
              {siteConfig.footerLinks.map((link) => (
                <a
                  href={link.url}
                  key={link.title}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "link" }),
                    "justify-between py-6"
                  )}
                >
                  {link.title}
                  <ArrowUpRight
                    size={16}
                    aria-hidden="true"
                    focusable="false"
                  />
                </a>
              ))}

              <DrawerFooter>
                <DrawerClose>
                  <div className="flex w-full flex-col items-center justify-center">
                    <X aria-hidden="true" focusable="false" />
                    <span className="text-xs">Close</span>
                  </div>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </li>
      </ul>
    </nav>
  );
};

const DesktopFooter = () => {
  return (
    <div className="hidden h-32 items-center justify-between md:container md:flex relative">
      <motion.div
        className="h-[50%] w-[50%] rounded-full absolute bottom-[-50%] left-[50%] translate-x-[-50%] bg-green-500 blur-3xl"
        initial={{ opacity: 0, scale: 0.4, x: "-50%" }}
        animate={{ opacity: 0.75, scale: 1, x: "-50%" }}
        transition={{ duration: 3 }}
      />
      <div className="flex flex-col">
        <Link href={"/reports"} passHref className="flex items-center gap-2">
          <Logo
            className="h-8 w-auto"
            alt="Hypercerts Logo"
            width={500}
            height={500}
          />
        </Link>
        <p className="pt-2 font-medium text-base">By GainForest.Earth</p>
      </div>
      <ul className="flex space-x-2">
        {siteConfig.footerLinks.map(({ url, title }) => (
          <li key={title}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "link" }),
                "group flex items-center justify-between text-lg"
              )}
              aria-label={`Open ${title} in a new tab`}
            >
              {title}
              <span className="sr-only">(opens in a new tab)</span>
              <ArrowUpRight
                size={18}
                className="group-hover:-translate-y-0.5 ml-1 opacity-70 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 group-hover:opacity-100"
                aria-hidden="true"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { Footer };
