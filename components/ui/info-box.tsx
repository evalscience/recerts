"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import type React from "react";
import { useState } from "react";

export default function InfoBox({
	children,
	variant = "success",
	className,
}: {
	children: React.ReactNode;
	variant?: "destructive" | "warning" | "success";
	className?: string;
}) {
	const [isVisible, setIsVisible] = useState(true);

	if (!isVisible) return null;

	return (
		<div className={cn("flex justify-center p-4", className)}>
			<div
				className={cn(
					"relative rounded-full border bg-opacity-60 px-3 py-1",
					variant === "success"
						? "border-green-400 bg-green-100 text-green-800"
						: variant === "warning"
						  ? "border-orange-400 bg-orange-100 text-orange-800"
						  : "border-red-400 bg-red-100 text-red-800",
				)}
			>
				<button
					type="button"
					onClick={() => setIsVisible(false)}
					className={cn(
						"-translate-y-1/2 absolute top-1/2 right-1 transform rounded-full p-0.5 transition-colors",
						variant === "success"
							? "text-green-600 hover:bg-green-200 hover:text-green-800"
							: variant === "warning"
							  ? "text-orange-600 hover:bg-orange-200 hover:text-orange-800"
							  : "text-red-600 hover:bg-red-200 hover:text-red-800",
					)}
					aria-label="Close info box"
				>
					<X size={12} />
				</button>

				<div className="flex items-center gap-2 pr-5">{children}</div>
			</div>
		</div>
	);
}
