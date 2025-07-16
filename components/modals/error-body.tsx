import { CircleAlert } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const ErrorModalBody = ({
	errorMessage,
	errorDescription,
	ctaText,
	ctaAction,
}: {
	errorMessage?: string;
	errorDescription?: string;
	ctaText: string;
	ctaAction: () => void;
}) => {
	return (
		<div className="my-6 flex flex-col items-center rounded-xl bg-muted/50 p-4">
			<CircleAlert className="text-destructive opacity-50" />
			<span className="text-balance text-center font-bold text-destructive">
				{errorMessage || "Something is wrong."}
			</span>
			<span className="text-balance text-center text-muted-foreground text-sm">
				{errorDescription || "We detected an unexpected error in the flow."}
			</span>
			<Button
				size={"sm"}
				variant={"outline"}
				className="mt-4 rounded-full"
				onClick={ctaAction}
			>
				{ctaText}
			</Button>
		</div>
	);
};

export default ErrorModalBody;
