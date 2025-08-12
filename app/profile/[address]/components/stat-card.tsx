import type React from "react";

const StatCard = ({
	title,
	display,
}: {
	title: React.ReactNode;
	display: React.ReactNode;
}) => {
	return (
		<div className="relative flex flex-1 flex-col justify-between gap-2 overflow-hidden rounded-xl border border-border/60 bg-background/40 p-4">
			<div className={"font-medium text-muted-foreground text-xs"}>{title}</div>
			<div>
				<data className="font-semibold text-2xl">{display}</data>
			</div>
		</div>
	);
};

export default StatCard;
