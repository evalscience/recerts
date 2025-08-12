import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import getPriceFeed from "@/lib/pricefeed";

import { cookieStorage, createStorage, http } from "wagmi";
import { BASE_URL } from "./endpoint";
import { filecoin, celo, optimism, base, arbitrum } from "viem/chains";
import { RAW_TOKENS_CONFIG, TokensConfig } from "./raw-tokens";

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

const DEV_CHAINS = [filecoin, celo, optimism, base, arbitrum] as const;
const PROD_CHAINS = [filecoin, celo, optimism, base, arbitrum] as const;
export const SUPPORTED_CHAINS =
  process.env.NEXT_PUBLIC_DEPLOY_ENV === "production"
    ? PROD_CHAINS
    : DEV_CHAINS;

export const getUSDPeggedValue = () => new Promise<number>((res) => res(1));
export const getUSDByCurrencyAddress = async (
  currencyAddress: `0x${string}`
): Promise<number> => {
  const { usdPrice } = await getPriceFeed(currencyAddress);
  if (usdPrice) {
    return usdPrice;
  }
  throw new Error("Failed to fetch USD price");
};

const normalizeTokensConfig = (
  config: TokensConfig<"raw">
): TokensConfig<"normalized"> => {
  return Object.fromEntries(
    Object.entries(config).map(([chainId, tokens]) => {
      return [
        chainId,
        tokens.map((token) => {
          const address = token.address as `0x${string}`;
          const isUSDPegged = token.isUSDPegged ?? true;
          return {
            ...token,
            address: token.address,
            usdPriceFetcher:
              token.usdPriceFetcher ?? isUSDPegged
                ? getUSDPeggedValue
                : () => getUSDByCurrencyAddress(address),
            isUSDPegged,
          };
        }),
      ];
    })
  );
};

export const TOKENS_CONFIG: TokensConfig<"normalized"> =
  normalizeTokensConfig(RAW_TOKENS_CONFIG);

export const currencyMap: Record<
  `0x${string}`,
  {
    symbol: string;
    chainId: number;
    usdPriceFetcher: () => Promise<number>;
  }
> = {};

for (const chainId in TOKENS_CONFIG) {
  const tokens = TOKENS_CONFIG[chainId];
  for (const token of tokens) {
    currencyMap[token.address as `0x${string}`] = {
      symbol: token.symbol,
      chainId: Number(chainId),
      usdPriceFetcher: token.usdPriceFetcher,
    };
  }
}

const metadata = {
  name: "Recerts.org",
  description: "An impact mechanism design journal",
  url: BASE_URL, // origin must match your domain & subdomain
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
  transports: {
    [filecoin.id]: http(filecoin.rpcUrls.default.http[0]!),
    [celo.id]: http(celo.rpcUrls.default.http[0]!),
    [optimism.id]: http(optimism.rpcUrls.default.http[0]!),
    [base.id]: http(base.rpcUrls.default.http[0]!),
    [arbitrum.id]: http(arbitrum.rpcUrls.default.http[0]!),
  },
});
