interface SiteConfig {
  name: string;
  title: string;
  description: string;
  localeDefault: string;
  links: {
    discord: string;
    twitter: string;
    github: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "ForestBase",
  title: "By GainForest",
  description:
    "Fund impactful regenerative projects",
  localeDefault: "en",
  links: {
    discord: "https://discord.gg/reuvzTdVAU",
    twitter: "https://twitter.com/GainForestNow",
    github: "https://github.com/GainForest/hypercerts-platform.git",
  },
};

// TODO: Clean up, add icon, add to sight config?
export const externalLinks = [
  { title: "FAQs", url: "https://testnet.hypercerts.org/docs/intro" },
  { title: "Terms of Use", url: "https://hypercerts.org/terms" },
  { title: "Privacy Policy", url: "https://hypercerts.org/privacy" },
  { title: "GitHub", url: "https://github.com/hypercerts-org" },
  { title: "X (Twitter)", url: "https://twitter.com/hypercerts" },
];
