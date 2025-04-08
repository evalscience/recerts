"use client";
import { Button } from "@/components/ui/button";

import useCopy from "@/hooks/use-copy";
import { ArrowUpRight, Check, Copy, Globe } from "lucide-react";
import Link from "next/link";

const URLSource = ({ url }: { url: string }) => {
	const { copy, isCopied } = useCopy();
	return (
		<div className="bg-background">
			<div className="flex w-full items-center justify-start gap-2 p-2">
				<div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
					<Globe className="text-primary" size={16} />
				</div>
				<div className="flex flex-1 flex-col gap-1">
					<input
						type="text"
						className="h-auto w-full truncate bg-transparent p-0 text-sm"
						value={url}
						readOnly
						disabled
					/>
					<div className="flex items-center gap-3">
						<Button
							variant={"link"}
							className="h-auto gap-1 p-0 text-muted-foreground text-xs"
							onClick={() => {
								copy(url);
							}}
						>
							{isCopied ? <Check size={12} /> : <Copy size={12} />}
							{isCopied ? "Copied" : "Copy"}
						</Button>
					</div>
				</div>
				<Link href={url} target="_blank">
					<Button variant="outline" size={"sm"}>
						<ArrowUpRight size={16} />
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default URLSource;
