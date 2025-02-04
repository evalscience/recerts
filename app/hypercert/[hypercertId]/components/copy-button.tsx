"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import React from "react";

type CopyButtonProps = {
	id: string;
};

const CopyButton = ({ id }: CopyButtonProps) => {
	const truncatedId = `${id.slice(0, 6)}...${id.slice(-6)}`;

	return (
		<Button
			variant="ghost"
			size="sm"
			className="h-auto gap-2 p-1 text-xs"
			onClick={() => navigator.clipboard.writeText(id)}
		>
			ID: <span className="hidden md:inline">{truncatedId}</span>
			<Copy size={12} />
		</Button>
	);
};

export default CopyButton;
