"use client";
import { Badge } from "@/components/ui/badge";

import type { Hypercert } from "@/app/graphql-queries/hypercerts";
import { Fraction } from "@/app/graphql-queries/user-fractions";
import { Button } from "@/components/ui/button";
import { bigintToFormattedDate, cn } from "@/lib/utils";
import { ArrowUpRight, CalendarRange, Loader2, RotateCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function HypercertCard({ hypercert }: { hypercert: Hypercert }) {
	const { hypercertId, name, description, image } = hypercert;

	return (
		<article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border">
			<div className="relative flex h-[200px] w-full items-start justify-center overflow-hidden rounded-t-2xl bg-muted p-4">
				<Image
					// src={`/api/hypercerts/${hypercert_id}/image`}
					src={image ?? ""}
					alt={name ?? "Untitled"}
					height={200}
					width={200}
					className="h-auto w-full transition group-hover:scale-[1.05] group-hover:blur-sm group-hover:brightness-75"
				/>
				{hypercertId !== undefined && (
					<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
						<Link href={`/hypercerts/${hypercertId}`} target="_blank" passHref>
							<Button variant={"secondary"} className="gap-2">
								View Hypercert <ArrowUpRight size={20} />
							</Button>
						</Link>
					</div>
				)}
			</div>
			<section
				className="w-full flex-1 space-y-2 border-t border-t-border bg-background/90 p-4 backdrop-blur-md"
				style={{
					boxShadow: "0 -10px 10px rgba(0, 0, 0, 0.1)",
				}}
			>
				<p
					className={cn(
						"line-clamp-2 max-h-12 flex-1 text-ellipsis font-semibold",
						name ? "font-baskerville text-foreground" : "text-muted-foreground",
					)}
				>
					{name ?? "[Untitled]"}
				</p>
				<p
					className={
						"line-clamp-2 max-h-12 flex-1 text-ellipsis text-muted-foreground"
					}
				>
					{description ?? "..."}
				</p>
			</section>
		</article>
	);
}

export default HypercertCard;
