import type React from "react";

const SectionWrapper = ({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) => {
	return (
		<section className="flex w-full flex-col gap-2 rounded-xl border border-border bg-background p-4">
			<h2 className="font-baskerville font-bold text-muted-foreground text-xl">
				{title}
			</h2>
			{children}
		</section>
	);
};

export default SectionWrapper;
