"use client";
import { Button } from "@/components/ui/button";

import useCopy from "@/hooks/use-copy";
import { ArrowUpRight, Check, Copy, Globe } from "lucide-react";
import Link from "next/link";

const URLSource = ({
	urlSource,
}: {
	urlSource: { src: string; description?: string };
}) => {
	return (
		<div className="bg-background">
			<div className="flex w-full items-center justify-start gap-2 p-2">
				<div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
					<Globe className="text-primary" size={16} />
				</div>
				<div className="flex flex-1 flex-col">
					<input
						type="text"
						className="h-auto w-full truncate bg-transparent p-0 font-bold text-sm"
						value={urlSource.description ?? urlSource.src}
						readOnly
						disabled
					/>
					<input
						type="text"
						className="h-auto w-full truncate bg-transparent p-0 text-muted-foreground text-xs"
						value={urlSource.src}
						readOnly
						disabled
					/>
				</div>

				<Link href={urlSource.src} target="_blank">
					<Button variant="outline" size={"sm"}>
						<ArrowUpRight size={16} />
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default URLSource;
