"use client";

import { motion } from "framer-motion";
import HeroTitle from "./hero-title";

const HeroSection = () => {
	return (
		<motion.section
			className="relative mx-auto flex w-full max-w-5xl items-center justify-center pt-16 pb-8 lg:py-20 md:py-16 sm:pt-20 sm:pb-12"
			initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
			animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
			transition={{ duration: 0.6 }}
		>
			<HeroTitle />
		</motion.section>
	);
};

export default HeroSection;
