import { Button } from "@/components/ui/button";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";
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
			className={cn("max-w-full animate-pulse rounded-xl bg-muted", className)}
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
			className="mx-auto flex max-w-6xl flex-col items-start gap-6 p-6 md:flex-row"
			initial={{ opacity: 0, filter: "blur(10px)" }}
			animate={{ opacity: 1, filter: "blur(0px)" }}
			transition={{ duration: 0.5 }}
		>
			{/* Left Sidebar */}
			<div className="flex w-full max-w-full flex-col gap-4 md:max-w-[300px]">
				{/* Profile Card */}
				<div className="rounded-xl border bg-card p-6">
					{/* Avatar */}
					<div className="mb-4 flex items-center gap-4">
						<Skeleton className="h-16 w-16 rounded-full" />
						<div className="flex flex-col gap-2">
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-4 w-24" />
						</div>
					</div>
					{/* Profile stats */}
					<div className="space-y-3">
						<div className="flex justify-between">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-4 w-8" />
						</div>
						<div className="flex justify-between">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-8" />
						</div>
						<div className="flex justify-between">
							<Skeleton className="h-4 w-16" />
							<Skeleton className="h-4 w-8" />
						</div>
					</div>
					{/* View toggle buttons */}
					<div className="mt-4 flex gap-2">
						<Skeleton className="h-10 flex-1" />
						<Skeleton className="h-10 flex-1" />
					</div>
				</div>

				{/* Stat Cards */}
				<div className="rounded-xl border bg-card p-4">
					<Skeleton className="mb-2 h-5 w-32" />
					<Skeleton className="h-8 w-16" />
				</div>

				<div className="rounded-xl border bg-card p-4">
					<Skeleton className="mb-2 h-5 w-40" />
					<Skeleton className="h-8 w-24" />
				</div>
			</div>

			{/* Right Content */}
			<div className="w-full flex-1">
				{/* Content header */}
				<div className="mb-6">
					<Skeleton className="mb-4 h-8 w-48" />
					<div className="mb-4 flex gap-4">
						<Skeleton className="h-10 w-24" />
						<Skeleton className="h-10 w-24" />
					</div>
				</div>

				{/* Content grid */}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3 md:grid-cols-2">
					{["card-1", "card-2", "card-3", "card-4", "card-5", "card-6"].map(
						(cardId) => (
							<div
								key={cardId}
								className="overflow-hidden rounded-xl border bg-card"
							>
								<Skeleton className="h-48 w-full" />
								<div className="p-4">
									<Skeleton className="mb-2 h-6 w-full" />
									<Skeleton className="mb-3 h-4 w-3/4" />
									<div className="flex gap-2">
										<Skeleton className="h-6 w-16" />
										<Skeleton className="h-6 w-20" />
									</div>
								</div>
							</div>
						),
					)}
				</div>
			</div>
		</MotionWrapper>
	);
};

export default Loading;
