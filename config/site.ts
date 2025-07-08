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
  name: "Ecocertain",
  title: "By GainForest.Earth",
  description:
    "Ecocertain is a marketplace that uses blockchain to showcase verified conservation efforts through digital certificates called ecocerts.",
  localeDefault: "en",
  url: "https://ecocertain.xyz",
  links: {
    discord: "https://discord.gg/reuvzTdVAU",
    twitter: "https://twitter.com/GainForestNow",
    github: "https://github.com/GainForest/hypercerts-platform.git",
  },
  footerLinks: [
    {
      title: "GitHub",
      url: "https://github.com/GainForest/hypercerts-platform.git",
      icon: CustomIcons.gitHub,
      openInNewTab: true,
    },
    {
      title: "Twitter",
      url: "https://twitter.com/GainForestNow",
      icon: CustomIcons.twitter,
      openInNewTab: true,
    },
    {
      title: "Changelog",
      url: "/changelog",
      openInNewTab: false,
    },
    {
      title: "Impact Report",
      url: "https://www.canva.com/design/DAGNpwdK0jo/QkBOQ1gfl0gy8jDTBAo10g/view?utm_content=DAGNpwdK0jo&utm_campaign=designshare&utm_medium=link&utm_source=editor",
      openInNewTab: true,
    },
  ],
};
