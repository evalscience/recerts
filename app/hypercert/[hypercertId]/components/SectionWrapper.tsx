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
		<section className="section-wrapper flex w-full flex-col gap-1 rounded-lg border border-border/60 bg-background/40 px-3 pt-3 pb-1">
			<div className="flex items-center justify-between">
				<h2 className="mt-0 mb-0 font-baskerville font-semibold text-lg leading-tight">
					{title}
				</h2>
				{titleRight}
			</div>
			{children}
		</section>
	);
};

export default SectionWrapper;
