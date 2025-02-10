"use client";
import { HeartHandshake, Sparkle } from "lucide-react";
import React from "react";
import { useAccount } from "wagmi";

const Header = ({
	address,
	view,
}: {
	address: string;
	view: "created" | "supported";
}) => {
	const { address: currentAddress } = useAccount();
	const isUserAddress = address === currentAddress;
	return (
		<span className="ml-4 flex items-center gap-4 font-baskerville font-bold text-3xl">
			{view === "created" ? (
				<Sparkle className="text-primary" size={36} />
			) : (
				<HeartHandshake className="text-primary" size={36} />
			)}
			<span>
				{view === "created" ? (isUserAddress ? "My" : "Created") : "Supported"}{" "}
				Hypercerts
			</span>
		</span>
	);
};

export default Header;
