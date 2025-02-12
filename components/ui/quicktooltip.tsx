"use client";
import { useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./tooltip";

const QuickTooltip = ({
	children,
	content,
	asChild = false,
	openOnClick = false,
}: {
	children: React.ReactNode;
	content: React.ReactNode;
	asChild?: boolean;
	openOnClick?: boolean;
}) => {
	const [open, setOpen] = useState(false);

	if (openOnClick) {
		return (
			<TooltipProvider>
				<Tooltip open={open} onOpenChange={setOpen}>
					<TooltipTrigger
						onClick={() => setOpen(true)}
						// onBlur={() => setOpen(false)}

						asChild={asChild}
					>
						{children}
					</TooltipTrigger>
					<TooltipContent className="text-center">{content}</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
				<TooltipContent className="text-center">{content}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default QuickTooltip;
