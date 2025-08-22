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
		<h2 className="relative">
			<div className="relative flex flex-col items-center px-4 py-2 text-center">
				<motion.span
					variants={HeroTitleVariants}
					initial={"initial"}
					animate={"animate"}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="font-light font-sans text-muted-foreground/70 text-sm uppercase tracking-widest md:text-base"
				>
					Journal of Mechanism Design for Public Goods
				</motion.span>
			</div>
		</h2>
	);
};

export default HeroTitle;
