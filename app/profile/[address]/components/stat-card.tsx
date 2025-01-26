import type React from "react";

const StatCard = ({
	title,
	display,
}: {
	title: React.ReactNode;
	display: React.ReactNode;
}) => {
	return (
		<div
			className={
				"relative flex flex-1 flex-col justify-between gap-4 overflow-hidden rounded-3xl bg-beige-muted p-6"
			}
		>
			<div className="-right-4 -bottom-4 absolute h-20 w-20 rounded-full bg-beige-muted-foreground/50 blur-xl" />
			<div className={"font-bold text-primary text-sm"}>{title}</div>
			<div>
				<data className="font-bold text-4xl text-beige-muted-foreground">
					{display}
				</data>
			</div>
		</div>
	);
};

export default StatCard;
