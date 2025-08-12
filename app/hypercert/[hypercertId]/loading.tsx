import { Button } from "@/components/ui/button";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const Skeleton = ({
	className,
	delayInMs = 0,
}: {
	className?: string;
	delayInMs?: number;
}) => {
	return (
		<div
			className={cn(
				"max-w-full animate-pulse rounded-xl bg-beige-muted",
				className ?? "",
			)}
			style={{
				animationDelay: `${delayInMs}ms`,
			}}
		/>
	);
};

const Loading = () => {
	return (
		<MotionWrapper
			type="div"
			className="flex w-full flex-col items-center"
			initial={{
				opacity: 0,
				y: 100,
				filter: "blur(10px)",
			}}
			animate={{
				opacity: 1,
				y: 0,
				filter: "blur(0px)",
			}}
		>
			<div className="flex w-full max-w-6xl flex-col gap-2 p-8">
				<Link href={"/"}>
					<Button variant={"link"} className="gap-2 p-0">
						<ChevronLeft size={20} /> View all recerts
					</Button>
				</Link>
				<div className="flex w-full flex-col items-start gap-12 md:flex-row md:items-center">
					<div className="flex flex-1 flex-col gap-2">
						{/* title */}
						<Skeleton className="h-12 w-1/2" />

						<div className="flex flex-wrap items-center gap-2">
							{/* tags */}
							<Skeleton className="h-8 w-20" />
							<Skeleton className="h-8 w-20" />
							<Skeleton className="h-8 w-20" />
						</div>
					</div>
					{/* progress */}
					<Skeleton className="h-40 w-full flex-initial md:w-auto md:flex-1" />
				</div>
				<div className="mt-12 flex w-full flex-col items-start gap-8 md:flex-row">
					<div className="flex w-full flex-initial flex-col gap-4 md:w-auto md:flex-[3]">
						<div className="flex w-full items-center justify-center">
							{/* nft */}
							<Skeleton className="aspect-square w-[80%]" />
						</div>

						{/* description */}
						<Skeleton className="mt-6 h-8 w-32" />
						<div className="flex flex-col gap-2">
							<Skeleton className="h-8 w-full" />
							<Skeleton className="h-8 w-full" />
							<Skeleton className="h-8 w-full" />
							<Skeleton className="h-8 w-full" />
							<Skeleton className="h-8 w-full" />
							<Skeleton className="h-8 w-1/2" />
						</div>

						{/* sales */}
						<Skeleton className="mt-6 h-8 w-32" />
						<div className="flex flex-col gap-2">
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-24 w-full" />
						</div>
					</div>
					<div className="flex w-full flex-initial flex-col gap-4 md:w-auto md:flex-[2]">
						{/* Impact Details */}
						<section className="flex w-full flex-col gap-2">
							<Skeleton className="mt-4 h-8 w-32" />
							<Skeleton className="mt-4 h-60 w-full" />
						</section>

						{/* Verification */}
						<section className="flex w-full flex-col gap-2">
							<Skeleton className="mt-4 h-8 w-32" />
							<Skeleton className="mt-4 h-60 w-full" />
						</section>

						{/* Geolocation */}
						<section className="flex w-full flex-col gap-2">
							<Skeleton className="mt-4 h-8 w-32" />
							<Skeleton className="mt-4 h-60 w-full" />
						</section>
					</div>
				</div>
			</div>
		</MotionWrapper>
	);
};

export default Loading;
