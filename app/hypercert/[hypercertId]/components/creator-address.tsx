"use client";
import EthAddress from "@/components/eth-address";
import React, { useEffect } from "react";

const CreatorAddress = ({ address }: { address: string }) => {
	const [mounted, setMounted] = React.useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);
	if (!mounted) return address;
	return <EthAddress address={address} />;
};

export default CreatorAddress;
