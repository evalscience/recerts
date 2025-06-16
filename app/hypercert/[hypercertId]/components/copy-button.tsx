"use client";

import { Button } from "@/components/ui/button";
import useCopy from "@/hooks/use-copy";
import { Check, Copy } from "lucide-react";
import React from "react";

type CopyButtonProps = {
	text: string;
};

const CopyButton = ({ text }: CopyButtonProps) => {
	const truncateText = `${text.slice(0, 6)}...${text.slice(-6)}`;

	const { isCopied, copy } = useCopy();
	return (
		<Button
			variant="outline"
			size="sm"
			className="h-auto gap-2 rounded-full p-1 px-3"
			onClick={() => copy(text)}
		>
			<span className="inline">{truncateText}</span>
			{isCopied ? <Check size={12} /> : <Copy size={12} />}
		</Button>
	);
};

export default CopyButton;
