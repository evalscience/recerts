import { CustomIconProps, CustomIcons } from "@/components/custom-icons";
import { LucideProps } from "lucide-react";
import React from "react";

interface SiteConfig {
  name: string;
  title: string;
  description: string;
  localeDefault: string;
  url: string;
  links: {
    discord: string;
    twitter: string;
    github: string;
  };
  footerLinks: {
    title: string;
    url: string;
    icon?: React.FC<CustomIconProps>;
    openInNewTab?: boolean;
  }[];
}

export const siteConfig: SiteConfig = {
  name: "Recerts",
  title: "By Eval.Science & GainForest.Earth",
  description:
    "Recerts Journal of Decentralized Funding Research",
  localeDefault: "en",
  url: "https://recerts.org",
  links: {
    discord: "https://discord.gg/reuvzTdVAU",
    twitter: "https://twitter.com/GainForestNow",
    github: "https://github.com/GainForest/hypercerts-platform.git",
  },
  footerLinks: [
    {
      title: "GitHub",
      url: "https://github.com/evalscience/recerts.git",
      icon: CustomIcons.gitHub,
      openInNewTab: true,
    },
    {
      title: "Twitter",
      url: "https://twitter.com/evalscience",
      icon: CustomIcons.twitter,
      openInNewTab: true,
    },
    {
      title: "Changelog",
      url: "/changelog",
      openInNewTab: false,
    },
  ],
};
