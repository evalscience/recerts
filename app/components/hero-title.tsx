"use client";

import { motion } from "framer-motion";
import React from "react";

const HeroTitleVariants = {
	initial: {
		opacity: 0,
		y: 16,
		filter: "blur(4px)",
	},
	animate: {
		opacity: 1,
		y: 0,
		filter: "blur(0px)",
	},
};

const HeroTitle = () => {
	return (
		<h2 className="absolute inset-x-0 bottom-0">
			<div className="relative flex flex-col items-center gap-2 px-4 py-4 text-center leading-tight sm:gap-3 sm:py-6">
				<motion.span
					variants={HeroTitleVariants}
					initial={"initial"}
					animate={"animate"}
					transition={{ duration: 0.5, delay: 0.25 }}
					className="text-2xl tracking-tight md:text-5xl sm:text-4xl"
				>
					Recerts
				</motion.span>

				<motion.span
					variants={HeroTitleVariants}
					initial={"initial"}
					animate={"animate"}
					transition={{ duration: 0.5, delay: 0.25 }}
					className="text-base text-muted-foreground md:text-3xl sm:text-2xl"
				>
					Journal of Decentralized Funding Research
				</motion.span>
			</div>
		</h2>
	);
};

export default HeroTitle;
