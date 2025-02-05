import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { cookieStorage, createStorage } from "wagmi";
import { getEcocertainUrl } from "./endpoint";
import { sepolia, celo } from "viem/chains";
import { symbol } from "zod";

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

const DEV_CHAINS = [sepolia] as const;
const PROD_CHAINS = [celo] as const;
export const SUPPORTED_CHAINS =
  process.env.NEXT_PUBLIC_DEPLOY_ENV === "production"
    ? PROD_CHAINS
    : DEV_CHAINS;

type TokensConfig = Record<number, Array<{ symbol: string; address: string }>>;
const normalizeTokensConfig = (config: TokensConfig): TokensConfig => {
  return Object.fromEntries(
    Object.entries(config).map(([chainId, tokens]) => {
      return [
        chainId,
        tokens.map((token) => ({
          ...token,
          address: token.address.toLowerCase(),
        })),
      ];
    })
  );
};

export const TOKENS_CONFIG: TokensConfig = normalizeTokensConfig({
  [sepolia.id]: [
    {
      symbol: "LINK",
      address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    },
  ],
  [celo.id]: [
    {
      symbol: "CELO",
      address: "0x471EcE3750Da237f93B8E339c536989b8978a438",
    },
    {
      symbol: "cUSD",
      address: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
    },
    {
      symbol: "USDT",
      address: "0xb020D981420744F6b0FedD22bB67cd37Ce18a1d5",
    },
    {
      symbol: "USDC",
      address: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
    },
  ],
});

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
