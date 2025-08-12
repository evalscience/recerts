"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { useEnsName } from "wagmi";

const AuthorName = ({
	address,
	className,
}: {
	address: `0x${string}`;
	className?: string;
}) => {
	const { data: ensName } = useEnsName({ address, chainId: 1 });

	const display = React.useMemo(() => {
		if (!ensName) return address;
		const dotIndex = ensName.indexOf(".");
		const base = dotIndex >= 0 ? ensName.slice(0, dotIndex) : ensName;
		const normalized = base.replace(/[._-]+/g, " ").trim();
		const titleCased = normalized
			.split(/\s+/)
			.filter(Boolean)
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(" ");
		return titleCased;
	}, [ensName, address]);
	return (
		<Link
			href={`/profile/${address}`}
			className={cn(
				"whitespace-normal break-words capitalize hover:underline",
				className,
			)}
		>
			{display}
		</Link>
	);
};

export default AuthorName;
