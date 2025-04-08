"use client";

import { Button } from "@/components/ui/button";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const Skeleton = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			className={cn("animate-pulse rounded-md bg-muted", className)}
			{...props}
		/>
	);
};

export default function HypercertAttestationsLoading() {
	return (
		<MotionWrapper
			type="main"
			className="flex w-full flex-col items-center justify-start"
			initial={{ opacity: 0, filter: "blur(10px)" }}
			animate={{ opacity: 1, filter: "blur(0px)" }}
			transition={{ duration: 0.5 }}
		>
			<div className="flex w-full max-w-6xl flex-col gap-2 p-8">
				<Link href="..">
					<Button variant={"link"} className="gap-2 p-0">
						<ChevronLeft size={20} /> Back to hypercert
					</Button>
				</Link>
				<div className="w-full">
					<Skeleton className="mb-8 h-9 w-96 font-baskerville text-3xl" />
					<div className="flex flex-col gap-4">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="flex flex-col gap-4 rounded-lg bg-accent p-4"
							>
								<div className="flex items-center gap-2">
									<Skeleton className="h-9 w-9 rounded-full" />
									<div className="flex flex-col gap-1">
										<Skeleton className="h-4 w-32" />
										<Skeleton className="h-3 w-24" />
									</div>
								</div>
								<div className="flex flex-col gap-2">
									<Skeleton className="h-5 w-48" />
									<Skeleton className="h-4 w-full" />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</MotionWrapper>
	);
}
