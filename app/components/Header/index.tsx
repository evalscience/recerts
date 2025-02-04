import Image from "next/image";
import Link from "next/link";
import React from "react";
import NavLinks from "./NavLinks";
import { WalletProfile } from "./WalletProfile";

const Header = () => {
	return (
		<>
			<header className="fixed top-0 right-0 left-0 z-10 flex items-center justify-center p-0 md:p-4">
				<section className="relative flex w-full max-w-7xl items-center justify-between rounded-none border border-transparent bg-background/80 p-2 shadow-lg backdrop-blur-md md:rounded-2xl md:border-border">
					<NavLinks />
					<div className="absolute inset-0 z-0 flex items-center justify-center">
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

					<div className="relative z-10 flex gap-2">
						<WalletProfile />
					</div>
				</section>
			</header>
			<div className="h-16 w-full" />
		</>
	);
};

export default Header;
