"use client";

import React from "react";

const Title = () => {
	return (
		<div className="flex flex-col items-center gap-2 py-6">
			<h2 className="text-center font-baskerville font-bold text-4xl text-foreground tracking-tight">
				FAQ
			</h2>
			<p className="text-center text-base text-muted-foreground">
				Simple answers to common questions.
			</p>
		</div>
	);
};

export default Title;
