"use client";

import { PrivyProvider as PrivyAuth } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

interface PrivyProviderProps {
	children: ReactNode;
}

export function PrivyProvider({ children }: PrivyProviderProps) {
	const [queryClient] = useState(() => new QueryClient());

	const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
	if (!appId) {
		throw new Error(
			"NEXT_PUBLIC_PRIVY_APP_ID environment variable is required",
		);
	}

	return (
		<PrivyAuth
			appId={appId}
			config={{
				loginMethods: ["email", "wallet", "google"],
				appearance: {
					theme: "light",
					accentColor: "#676FFF",
					logo: "https://recerts.org/favicon.ico",
				},
				embeddedWallets: {
					createOnLogin: "users-without-wallets",
					requireUserPasswordOnCreate: true,
				},
			}}
		>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</PrivyAuth>
	);
}
