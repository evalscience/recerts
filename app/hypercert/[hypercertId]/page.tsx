import PageError from "@/app/components/shared/PageError";
import Progress from "@/app/components/shared/progress";
import { FullHypercertProvider } from "@/app/contexts/full-hypercert";
import { catchError } from "@/app/utils";
import { Button } from "@/components/ui/button";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Separator } from "@/components/ui/separator";
import {
	type FullHypercert,
	fetchFullHypercertById,
} from "@/graphql/hypercerts/queries/hypercerts";
import { getChainInfo } from "@/lib/chainInfo";
import type { ApiError } from "@/types/api";
import { ArrowUpRight, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import AuthorName from "./components/AuthorName";
import CopyButton from "./components/copy-button";
import LeftContent from "./components/left-content";
import RightContent from "./components/right-content";

export default async function HypercertPage({
	params,
}: {
	params: Promise<{ hypercertId: string }>;
}) {
	const { hypercertId } = await params;
	const hypercert = await fetchFullHypercertById(hypercertId);
	const contributors = hypercert.metadata.contributors ?? [];
	const chainInfo = getChainInfo(hypercert.chainId);

	return (
		<FullHypercertProvider value={hypercert}>
			<MotionWrapper
				type="main"
				className="flex w-full flex-col items-center justify-start"
				initial={{ opacity: 0, filter: "blur(10px)" }}
				animate={{ opacity: 1, filter: "blur(0px)" }}
				transition={{ duration: 0.5 }}
			>
				<div className="flex w-full max-w-6xl flex-col gap-3 p-6 md:p-8">
					<Link href={"/"}>
						<Button variant={"link"} className="gap-2 p-0">
							<ChevronLeft size={20} /> All recerts
						</Button>
					</Link>
					<div className="flex flex-col justify-start gap-4 md:flex-row md:items-end md:justify-between">
						<div className="flex w-full flex-col items-center gap-1">
							<h1 className="text-center font-baskerville font-semibold text-3xl leading-tight md:text-5xl">
								{hypercert.metadata.name ?? "Untitled"}
							</h1>
							{contributors.length > 0 && (
								<div className="mt-2 w-full text-center text-muted-foreground">
									<div className="font-baskerville text-lg md:text-xl">
										{contributors.slice(0, 6).map((addr, idx) => (
											<React.Fragment key={addr}>
												<AuthorName address={addr as `0x${string}`} />
												{idx < Math.min(contributors.length, 6) - 1 ? (
													<span>, </span>
												) : null}
											</React.Fragment>
										))}
										{contributors.length > 6 && <span> et al.</span>}
									</div>
								</div>
							)}
							<ul className="mt-2 flex flex-wrap items-center gap-2 pt-10">
								{hypercert.metadata.work.scope.map((scope, i) => (
									<li
										key={scope.toLowerCase()}
										className="rounded-full border border-border bg-transparent px-2.5 py-0.5 text-muted-foreground text-xs uppercase tracking-wide"
									>
										{scope}
									</li>
								))}
							</ul>
							<div className="mt-2 flex flex-col items-start gap-3 text-muted-foreground text-xs md:flex-row md:items-center">
								<CopyButton text={hypercertId} />
								{chainInfo && (
									<div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-2 py-0.5">
										<Image
											src={chainInfo.logoSrc}
											alt={chainInfo.label}
											width={14}
											height={14}
										/>
										<span className="text-xs">{chainInfo.label}</span>
									</div>
								)}
								<Link
									href={`https://app.hypercerts.org/hypercerts/${hypercertId}`}
									target="_blank"
								>
									<Button variant={"link"} size={"sm"} className="gap-2 p-0">
										<span>View at app.hypercerts</span>
										<ArrowUpRight size={16} />
									</Button>
								</Link>
							</div>
						</div>
					</div>
					<div className="hidden w-full md:mt-1 md:block">
						<Separator className="bg-beige-muted-foreground/20" />
					</div>
					<section className="mt-4 flex flex-col items-start gap-4 lg:flex-row lg:gap-8">
						<LeftContent hypercert={hypercert} />
						<RightContent hypercert={hypercert} />
					</section>
				</div>
			</MotionWrapper>
		</FullHypercertProvider>
	);
}
