import React from "react";
import { useEnsName } from "wagmi";

const ENSName = ({
	address,
	shortenedLength = 12,
}: {
	address: `0x${string}` | undefined | null;
	shortenedLength?: number;
}) => {
	const { data: ensName } = useEnsName({
		address: address as `0x${string}` | undefined,
		chainId: 1,
	});
	return (
		<>
			{ensName ??
				(address
					? `${address.slice(0, shortenedLength)}...${address.slice(-4)}`
					: "Unknown")}
		</>
	);
};

export default ENSName;
