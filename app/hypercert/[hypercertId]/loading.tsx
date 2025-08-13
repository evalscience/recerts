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
			<div className="flex w-full max-w-4xl flex-col gap-3 p-6 md:p-8">
				<Link href={"/"}>
					<Button variant={"link"} className="gap-2 p-0">
						<ChevronLeft size={20} /> All recerts
					</Button>
				</Link>
				<div className="flex w-full flex-col items-start gap-8 md:flex-row md:items-end">
					<div className="flex flex-1 flex-col gap-2">
						{/* title */}
						<Skeleton className="h-9 w-2/3" />

						<div className="flex flex-wrap items-center gap-2">
							{/* tags */}
							<Skeleton className="h-8 w-20" />
							<Skeleton className="h-8 w-20" />
							<Skeleton className="h-8 w-20" />
						</div>
					</div>
					{/* progress */}
					<Skeleton className="h-28 w-full flex-initial rounded-lg md:w-auto md:flex-1" />
				</div>
				<div className="mt-8 flex w-full flex-col items-start gap-8 md:flex-row">
					<div className="flex w-full flex-initial flex-col gap-4 md:w-auto md:flex-[3]">
						<div className="flex w-full items-center justify-center">
							{/* nft */}
							<Skeleton className="aspect-square w-[75%] rounded-2xl" />
						</div>

						{/* description */}
						<Skeleton className="mt-6 h-7 w-28" />
						<div className="flex flex-col gap-2">
							<Skeleton className="h-6 w-full" />
							<Skeleton className="h-6 w-full" />
							<Skeleton className="h-6 w-full" />
							<Skeleton className="h-6 w-full" />
							<Skeleton className="h-6 w-full" />
							<Skeleton className="h-6 w-2/3" />
						</div>

						{/* sales */}
						<Skeleton className="mt-6 h-7 w-28" />
						<div className="flex flex-col gap-2">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-20 w-full" />
						</div>
					</div>
					<div className="flex w-full flex-initial flex-col gap-4 md:w-auto md:flex-[2]">
						{/* Impact Details */}
						<section className="flex w-full flex-col gap-2">
							<Skeleton className="mt-4 h-7 w-28" />
							<Skeleton className="mt-3 h-56 w-full rounded-xl" />
						</section>

						{/* Verification */}
						<section className="flex w-full flex-col gap-2">
							<Skeleton className="mt-4 h-7 w-28" />
							<Skeleton className="mt-3 h-56 w-full rounded-xl" />
						</section>

						{/* Geolocation */}
						<section className="flex w-full flex-col gap-2">
							<Skeleton className="mt-4 h-7 w-28" />
							<Skeleton className="mt-3 h-56 w-full rounded-xl" />
						</section>
					</div>
				</div>
			</div>
		</MotionWrapper>
	);
};

export default Loading;
