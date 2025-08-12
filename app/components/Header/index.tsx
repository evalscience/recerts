import Link from "next/link";
import React from "react";
import NavLinks from "./NavLinks";
import { WalletProfile } from "./WalletProfile";

const Header = () => {
	return (
		<>
			<header className="sticky top-0 z-40 w-full border-border border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
				<div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-3 md:px-4">
					{/* Left: Primary navigation */}
					<NavLinks />

					{/* Right: Wallet */}
					<div className="flex items-center gap-2">
						<WalletProfile />
					</div>
				</div>
			</header>
		</>
	);
};

export default Header;
