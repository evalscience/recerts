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
} => {
	const { address, isConnected } = useAccount();
	const pathname = usePathname();
	const params = useSearchParams();

	const hrefPath = `/profile/${address}`;
	const hrefSuffix = "?view=created";
	const config = {
		type: "static" as const,
		id: "my-hypercerts",
		href: isConnected ? hrefPath + hrefSuffix : "#",
		text: "My Hypercerts",
		Icon: Sparkle,
	};

	const isActive = isConnected
		? pathname === hrefPath && hrefSuffix === `?view=${params.get("view")}`
		: false;

	return { config, isActive };
};

export const MyHypercerts: ClientLink = {
	Desktop: () => {
		const data = useMyHypercertsLink();

		return <DesktopNavLink link={data.config} isActive={data.isActive} />;
	},
	Mobile: () => {
		const data = useMyHypercertsLink();
		return <PhoneNavLink link={data.config} isActive={data.isActive} />;
	},
};
