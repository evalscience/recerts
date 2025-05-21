import type React from "react";

const SectionWrapper = ({
	title,
	titleRight,
	children,
}: {
	title: string;
	titleRight?: React.ReactNode;
	children: React.ReactNode;
}) => {
	return (
		<section className="flex w-full flex-col gap-2 rounded-xl border border-border bg-background p-4">
			<div className="flex items-center justify-between">
				<h2 className="font-baskerville font-bold text-muted-foreground text-xl">
					{title}
				</h2>
				{titleRight}
			</div>
			{children}
		</section>
	);
};

export default SectionWrapper;
