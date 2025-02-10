"use client";

import { Sparkle } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import type { FC } from "react";
import { useAccount } from "wagmi";
import { DesktopNavLink, type NavLinkConfig, PhoneNavLink } from "./NavLinks";

export type ClientLink = {
	Desktop: FC;
	Mobile: FC;
};

const useMyHypercertsLink = (): {
	config: NavLinkConfig<"static">;
	isActive: boolean;
} | null => {
	const { address, isConnected } = useAccount();
	const pathname = usePathname();
	const params = useSearchParams();
	if (!isConnected) return null;

	const hrefPath = `/profile/${address}`;
	const hrefSuffix = "?view=created";
	return {
		config: {
			type: "static",
			id: "my-hypercerts",
			href: hrefPath + hrefSuffix,
			text: "My Hypercerts",
			Icon: Sparkle,
		},
		isActive:
			pathname === hrefPath && hrefSuffix === `?view=${params.get("view")}`,
	};
};

export const MyHypercerts: ClientLink = {
	Desktop: () => {
		const data = useMyHypercertsLink();
		if (!data) return null;
		return <DesktopNavLink link={data.config} isActive={data.isActive} />;
	},
	Mobile: () => {
		const data = useMyHypercertsLink();
		if (!data) return null;
		return <PhoneNavLink link={data.config} isActive={data.isActive} />;
	},
};
