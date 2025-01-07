import { ShieldCheck } from "lucide-react";
import React from "react";

const EvaluationDetails = () => {
	return (
		<div className="group overflow-hidden rounded-xl border border-border bg-background p-4">
			<div className="relative flex h-28 w-full items-center justify-center">
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="h-20 w-20 rounded-full bg-primary/30 blur-lg group-hover:animate-ping" />
				</div>
				<ShieldCheck size={60} className="text-primary" />
			</div>
			<div className="flex w-full flex-col items-center gap-1 px-8 py-4">
				<span className="text-center text-muted-foreground leading-none">
					This hypercerts and the work it represents have been verified by
				</span>
				<span className="text-center font-bold text-foreground text-xl">
					GainForest.Earth
				</span>
			</div>
		</div>
	);
};

export default EvaluationDetails;
