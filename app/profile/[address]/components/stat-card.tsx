import type React from "react";

const StatCard = ({
	title,
	count,
	icon,
}: {
	title: React.ReactNode;
	count: number;
	icon?: React.ReactNode;
}) => {
	return (
		<div
			className={
				"relative flex flex-1 flex-col gap-4 overflow-hidden rounded-3xl bg-accent p-6"
			}
		>
			<div className="-bottom-4 -right-4 -rotate-45 absolute text-primary/50">
				{icon}
			</div>
			<div className={"font-bold text-muted-foreground text-sm"}>{title}</div>
			<div>
				<data className="font-bold text-4xl">{count}</data>
			</div>
		</div>
	);
};

export default StatCard;
