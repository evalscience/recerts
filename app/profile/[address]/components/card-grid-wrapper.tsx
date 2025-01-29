import type React from "react";

const CardGridWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
			{children}
		</div>
	);
};

export default CardGridWrapper;
