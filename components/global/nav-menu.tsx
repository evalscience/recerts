"use client";
import Image from "next/image";
import Link from "next/link";

import { NavLinks } from "@/components/global/nav-links";
import { WalletProfile } from "@/components/global/wallet-profile";

const NavMenu = () => {
	return (
		<>
			<nav className="fixed top-0 right-0 left-0 z-10 flex items-center justify-center p-0 md:p-4">
				<section className="flex w-full max-w-7xl items-center justify-between rounded-none border border-transparent bg-background/80 p-2 shadow-lg backdrop-blur-md md:rounded-2xl md:border-border">
					<NavLinks />
					<div className="flex flex-1 items-center">
						<Link
							className="flex w-full justify-center"
							aria-label="Gainforest Home"
							href="/"
						>
							<Image
								src="/assets/media/images/logo.svg"
								className="h-8 w-auto"
								alt="Gainforest"
								width={500}
								height={500}
							/>
						</Link>
					</div>

					<div className="hidden gap-2 md:flex">
						<WalletProfile />
					</div>
				</section>
			</nav>
			<div className="h-16 w-full" />
		</>
	);
};

NavMenu.displayName = "NavMenu";

export { NavMenu };
