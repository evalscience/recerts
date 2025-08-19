import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CombinedSale } from "../../../page";

export default function Card({ combinedSale }: { combinedSale: CombinedSale }) {
	const { totalAmountInUSD } = combinedSale;
	const {
		hypercertId,
		metadata: { name, description },
	} = combinedSale.hypercert;

	return (
		<article className="group relative flex flex-col overflow-hidden rounded-xl border border-border/60">
			<div className="flex items-center justify-center bg-background/40 px-3 py-1.5 text-center">
				<span className="mx-4 font-medium text-primary text-sm">
					${Math.floor(totalAmountInUSD * 100) / 100}
				</span>
			</div>

			<div className="relative flex h-[180px] w-full items-start justify-center overflow-hidden rounded-t-xl bg-muted/60 p-3">
				<Image
					src={`/api/hypercert-image/${hypercertId}`}
					alt={name ?? "Untitled"}
					height={200}
					width={200}
					className="h-auto w-full object-cover"
				/>
				{hypercertId !== undefined && (
					<div className="absolute top-2 right-2">
						<Link href={`/hypercert/${hypercertId}`}>
							<Button variant={"secondary"} size={"sm"} className="gap-1 px-2">
								View <ArrowRight size={14} />
							</Button>
						</Link>
					</div>
				)}
			</div>
			<section className="w-full flex-1 space-y-1 border-t border-t-border/60 bg-background/40 p-3">
				<p
					className={`line-clamp-2 max-h-12 flex-1 text-ellipsis font-baskerville font-semibold text-base leading-5${
						name ? "text-foreground" : "text-muted-foreground"
					}`}
				>
					{name ?? "[Untitled]"}
				</p>
				<p
					className={
						"line-clamp-2 max-h-12 flex-1 text-ellipsis text-muted-foreground text-sm"
					}
				>
					{description ?? "..."}
				</p>
			</section>
		</article>
	);
}
