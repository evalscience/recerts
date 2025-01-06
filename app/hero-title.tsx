"use client";

import { motion } from "framer-motion";
import React from "react";

const HeroTitleVariants = {
	initial: {
		opacity: 0,
		y: 100,
		filter: "blur(20px)",
	},
	animate: {
		opacity: 1,
		y: 0,
		filter: "blur(0px)",
	},
};

const HeroTitle = () => {
	return (
		<h2 className="relative flex flex-col items-center gap-2 px-4 py-6 text-center font-bold text-4xl text-foreground/50 leading-none">
			<motion.div
				className="absolute top-[50%] left-[50%] aspect-square h-20 translate-x-[-50%] translate-y-[-50%] rounded-full bg-green-500 opacity-80 blur-3xl"
				initial={{ opacity: 0, scale: 0.6 }}
				animate={{ opacity: 1, scale: 1.5 }}
				transition={{ duration: 3 }}
			/>
			<motion.span
				variants={HeroTitleVariants}
				initial={"initial"}
				animate={"animate"}
				transition={{
					duration: 0.5,
				}}
			>
				Fund
			</motion.span>
			<motion.span
				variants={HeroTitleVariants}
				initial={"initial"}
				animate={"animate"}
				transition={{
					duration: 0.5,
					delay: 0.2,
				}}
				className="inline-block bg-gradient-to-b from-green-400 to-green-700 bg-clip-text font-black text-6xl text-transparent"
			>
				impactful
			</motion.span>
			<motion.span
				variants={HeroTitleVariants}
				initial={"initial"}
				animate={"animate"}
				transition={{
					duration: 0.5,
					delay: 0.4,
				}}
			>
				regenerative projects.
			</motion.span>
		</h2>
	);
};

export default HeroTitle;
