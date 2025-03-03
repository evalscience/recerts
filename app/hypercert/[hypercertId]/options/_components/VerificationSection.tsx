import { Button } from "@/components/ui/button";
import { EvervaultCard } from "@/components/ui/evervault-card";
import {
	BadgeCheck,
	CircleAlert,
	HandCoins,
	Plus,
	ShieldAlert,
	ShieldCheck,
} from "lucide-react";
import React from "react";

const VerificationSection = () => {
	return (
		<div className="mt-4 flex gap-4">
			<div className="relative flex h-[200px] flex-1 items-center justify-center rounded-2xl bg-muted-foreground/10">
				<EvervaultCard
					className="h-full w-full"
					gradientClassName="bg-gradient-to-r from-red-100 to-red-300"
				>
					<div className="flex w-full flex-col items-center gap-2">
						<ShieldAlert className="text-destructive" size={40} />
						<span className="font-bold text-2xl">Not verified</span>
						<span>This ecocert is not yet verified by Gainforest.</span>
					</div>
				</EvervaultCard>
			</div>
			<div className="relative flex h-[200px] flex-1 items-center justify-center rounded-2xl bg-muted-foreground/10">
				<div className="flex flex-col items-center justify-center gap-2">
					<HandCoins
						size={40}
						className="text-beige-muted-foreground opacity-50"
					/>
					<div className="flex flex-col items-center justify-center gap-2 px-4">
						<span className="text-balance text-center">
							Get this ecocert verified by Gainforest, and have a verified
							impact.
						</span>
						<Button size={"sm"} className="gap-2">
							<ShieldCheck size={16} />
							Apply for verification
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VerificationSection;
