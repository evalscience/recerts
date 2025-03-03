import { Button } from "@/components/ui/button";
import { CircleAlert, Plus } from "lucide-react";
import React from "react";

const OrderSection = () => {
	return (
		<div className="mt-4 flex gap-4">
			<div className="relative flex h-[200px] flex-1 items-center justify-center rounded-2xl bg-muted-foreground/10">
				<span className="absolute top-2 left-2 font-bold font-sans text-sm">
					Sales so far
				</span>
				<span className="font-bold text-6xl text-beige-muted-foreground">
					0.00
					<span className="text-lg">USD</span>
				</span>
				<div className="absolute right-2 bottom-2 flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1 shadow-sm">
					<CircleAlert size={16} className="text-destructive opacity-50" />
					<span className="font-sans text-muted-foreground text-sm">
						There is no order yet..
					</span>
				</div>
			</div>
			<div className="relative flex h-[200px] flex-1 items-center justify-center rounded-2xl bg-muted-foreground/10">
				<span className="absolute top-2 left-2 font-bold font-sans text-sm">
					Order details
				</span>
				<div className="flex flex-col items-center justify-center gap-2">
					<CircleAlert
						size={40}
						className="text-beige-muted-foreground opacity-50"
					/>
					<div className="flex flex-col items-center justify-center gap-2 px-4">
						<span className="text-balance text-center">
							No orders found on this ecocert.
						</span>
						<Button size={"sm"} className="gap-2">
							<Plus size={16} />
							Create Order
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderSection;
