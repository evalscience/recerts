"use client";

import React from "react";
import NavLinks from "./NavLinks";
import { WalletProfile } from "./WalletProfile";

const Header = () => {
	return (
		<header className="sticky top-0 z-50 w-full border-neutral-200/60 border-b bg-white/80 backdrop-blur-md dark:border-neutral-800/60 dark:bg-neutral-900/80 dark:supports-[backdrop-filter]:bg-neutral-900/90 supports-[backdrop-filter]:bg-white/90">
			<div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
				<NavLinks />

				<div className="flex items-center gap-3">
					<WalletProfile />
				</div>
			</div>
		</header>
	);
};

export default Header;
