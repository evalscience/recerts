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
				"max-w-full animate-pulse rounded-xl bg-muted",
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
						{/* title */}
						<Skeleton className="h-12 w-2/3 md:h-16" />
						{/* authors */}
						<Skeleton className="mt-2 h-6 w-1/2" />
						{/* tags */}
						<div className="mt-2 flex flex-wrap items-center gap-2 pt-10">
							<Skeleton className="h-6 w-16" />
							<Skeleton className="h-6 w-20" />
							<Skeleton className="h-6 w-18" />
						</div>
						{/* metadata row */}
						<div className="mt-2 flex flex-col items-start gap-3 md:flex-row md:items-center">
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-6 w-24" />
							<Skeleton className="h-6 w-28" />
						</div>
					</div>
				</div>
				{/* separator */}
				<div className="hidden w-full md:mt-1 md:block">
					<Skeleton className="h-px w-full" />
				</div>
				{/* main content */}
				<section className="mt-4 flex flex-col items-start gap-4 lg:flex-row lg:gap-8">
					{/* Left Content */}
					<div className="flex w-full flex-col gap-6 lg:w-2/3">
						{/* hypercert image */}
						<div className="flex w-full items-center justify-center">
							<Skeleton className="aspect-square w-full max-w-md rounded-2xl" />
						</div>

						{/* description section */}
						<div className="space-y-4">
							<Skeleton className="h-8 w-32" />
							<div className="space-y-3">
								<Skeleton className="h-5 w-full" />
								<Skeleton className="h-5 w-full" />
								<Skeleton className="h-5 w-3/4" />
							</div>
						</div>

						{/* purchase flow section */}
						<div className="space-y-4">
							<Skeleton className="h-8 w-40" />
							<div className="rounded-xl border p-6">
								<div className="space-y-4">
									<Skeleton className="h-10 w-full" />
									<Skeleton className="h-10 w-full" />
									<Skeleton className="h-12 w-full" />
								</div>
							</div>
						</div>
					</div>

					{/* Right Content */}
					<div className="flex w-full flex-col gap-6 lg:w-1/3">
						{/* impact details */}
						<div className="space-y-4">
							<Skeleton className="h-7 w-32" />
							<Skeleton className="h-40 w-full rounded-xl" />
						</div>

						{/* verification */}
						<div className="space-y-4">
							<Skeleton className="h-7 w-28" />
							<Skeleton className="h-32 w-full rounded-xl" />
						</div>

						{/* additional info */}
						<div className="space-y-4">
							<Skeleton className="h-7 w-24" />
							<Skeleton className="h-48 w-full rounded-xl" />
						</div>
					</div>
				</section>
			</div>
		</MotionWrapper>
	);
};

export default Loading;
