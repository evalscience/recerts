import React from "react";
import { useEnsName } from "wagmi";

const ENSName = ({
	address,
}: {
	address: `0x${string}` | undefined | null;
}) => {
	const { data: ensName } = useEnsName({
		address: address as `0x${string}` | undefined,
		chainId: 1,
	});
	return <>{ensName ?? address}</>;
};

export default ENSName;
