"use client";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { motion } from "framer-motion";
import Image from "next/image";
import HeroTitle from "./hero-title";

const HeroSection = () => {
	return (
		<motion.section
			className="relative mx-auto flex w-full max-w-2xl flex-col items-center justify-center pt-8 pb-4 lg:pt-12 md:pt-10 sm:pt-8 lg:pb-6 md:pb-5 sm:pb-4"
			initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
			animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
			transition={{ duration: 0.6 }}
		>
			<motion.div
				className="relative mx-auto w-full max-w-sm sm:max-w-md"
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.8, delay: 0.3 }}
			>
				<CardContainer className="inter-var">
					<CardBody className="group/card relative h-auto w-auto rounded-xl border border-black/[0.1] bg-transparent p-3 dark:border-white/[0.2] dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] hover:shadow-2xl hover:shadow-emerald-500/[0.1]">
						<CardItem translateZ="100" rotateX={5} className="w-full">
							<Image
								src="/hero-images/hero.png"
								alt="Hero Image"
								width={525}
								height={350}
								className="h-[250px] w-auto rounded-xl object-cover md:h-[350px] sm:h-[300px] group-hover/card:shadow-xl"
								priority
							/>
						</CardItem>
					</CardBody>
				</CardContainer>
			</motion.div>
			<div className="hidden sm:block">
				<HeroTitle />
			</div>
		</motion.section>
	);
};

export default HeroSection;
