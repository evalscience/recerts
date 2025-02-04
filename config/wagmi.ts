import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { cookieStorage, createStorage } from "wagmi";
import { getEcocertainUrl } from "./endpoint";
import { sepolia, celo } from "viem/chains";

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

const DEV_CHAINS = [sepolia] as const;
const PROD_CHAINS = [celo] as const;
export const SUPPORTED_CHAINS =
  process.env.NEXT_PUBLIC_DEPLOY_ENV === "production"
    ? PROD_CHAINS
    : DEV_CHAINS;

export const SUPPORTED_CHAIN =
  process.env.NEXT_PUBLIC_DEPLOY_ENV === "production" ? celo : sepolia;

const metadata = {
  name: "Ecocertain",
  description: "Fund impactful regenerative projects",
  url: getEcocertainUrl(), // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/46801808"],
};

// Create wagmiConfig
export const config = defaultWagmiConfig({
  chains: SUPPORTED_CHAINS, // required
  projectId, // required
  metadata, // required
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
