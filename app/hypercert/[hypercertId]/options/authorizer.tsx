"use client";

import { useAccount } from "wagmi";

const Authorizer = ({
	children,
	address,
}: {
	children: React.ReactNode;
	address: string;
}) => {
	const {
		address: currentAddress,
		isConnected,
		isConnecting,
		isReconnecting,
	} = useAccount();

	if (isConnecting || isReconnecting) {
		return <div>Connecting...</div>;
	}

	if (!isConnected) {
		return <div>Connect your wallet to continue</div>;
	}

	if (currentAddress?.toLowerCase() !== address.toLowerCase()) {
		return <div>You are not authorized to view this page</div>;
	}

	return children;
};

export default Authorizer;
