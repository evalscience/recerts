"use client";
import { blo } from "blo";
import { UserRound } from "lucide-react";
import React from "react";
import { useEnsAvatar, useEnsName } from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const GenericAvatar = ({
	src,
	alt,
	size = 80,
	className,
}: {
	src: string;
	alt: string;
	size?: number;
	className?: string;
}) => {
	return (
		<Avatar
			className={className}
			style={{ height: `${size}px`, width: `${size}px` }}
		>
			<AvatarImage src={src} alt={alt} />
			<AvatarFallback>
				<UserRound />
			</AvatarFallback>
		</Avatar>
	);
};

const EnsAvatar = ({
	address,
	ensName,
	size = 80,
	className,
}: {
	address: `0x${string}`;
	ensName: string | null | undefined;
	size?: number;
	className?: string;
}) => {
	const { data: ensAvatar, isLoading: ensAvatarLoading } = useEnsAvatar({
		name: ensName ?? "",
		chainId: 1,
	});

	if (!ensName || ensAvatarLoading || !ensAvatar)
		return (
			<GenericAvatar
				src={blo(address)}
				alt={address}
				size={size}
				className={className}
			/>
		);

	return (
		<GenericAvatar
			src={ensAvatar}
			alt={ensName}
			size={size}
			className={className}
		/>
	);
};

const EthAvatar = ({
	address,
	size = 80,
	className,
	showEns = true,
}: {
	address: `0x${string}`;
	size?: number;
	className?: string;
	showEns?: boolean;
}) => {
	const { data: ensName, isLoading: ensNameLoading } = useEnsName({
		address,
		chainId: 1,
	});

	return (
		<EnsAvatar
			address={address}
			ensName={showEns ? ensName : null}
			size={size}
			className={className}
		/>
	);
};

export default EthAvatar;
