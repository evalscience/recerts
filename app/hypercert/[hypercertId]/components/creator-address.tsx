"use client";
import EthAddress from "@/components/eth-address";
import React, { useEffect } from "react";
import { useEnsName } from "wagmi";

const CreatorAddress = ({
	address,
	className,
}: {
	address: string;
	className?: string;
}) => {
	const [mounted, setMounted] = React.useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);
	if (!mounted) return address;
	return <EthAddress className={className} address={address} />;
};

export default CreatorAddress;
