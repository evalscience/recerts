import { motion } from "framer-motion";
import { BadgeDollarSign, DollarSign, File, Sparkle } from "lucide-react";
import React from "react";

const Sidebar = () => {
	return (
		<div
			className="relative flex h-full items-center justify-center"
			style={{
				perspective: "900px",
			}}
		>
			<motion.div
				initial={{
					opacity: 0,
					scale: 1.2,
					filter: "blur(10px)",
				}}
				animate={{
					opacity: [0, 1, 1, 1],
					scale: [1.2, 1, 1, 1],
					filter: ["blur(10px)", "blur(0px)", "blur(0px)", "blur(0px)"],
					y: [0, 0, 0, -80],
					transition: {
						duration: 4,
						times: [0, 0.5, 0.55, 1],
					},
				}}
				className="relative"
			>
				<motion.div
					className="-bottom-16 absolute h-12 w-full"
					animate={{
						opacity: [0, 1, 1, 0, 0],
						filter: [
							"blur(10px)",
							"blur(0px)",
							"blur(0px)",
							"blur(10px)",
							"blur(10px)",
						],
						scale: [1.1, 1, 1, 0.8, 1.1],
						y: [60, 1, 2, -120, 60],
					}}
					transition={{
						ease: "linear",
						duration: 6,
						times: [0, 0.1, 0.6, 0.8, 1],
						repeat: Number.POSITIVE_INFINITY,
						delay: 4,
					}}
				>
					<div className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-white/80 shadow-xl">
						<File className="h-6 w-6 text-muted-foreground opacity-50" />
					</div>
				</motion.div>
				<div className="flex h-60 w-48 scale-100 flex-col gap-3 rounded-xl border border-border bg-background p-3 shadow-xl">
					<div className="h-28 w-full rounded-lg bg-muted" />
					<div className="flex w-full flex-col gap-1">
						<div className="h-6 w-[50%] rounded-lg bg-muted" />
						<div className="h-6 w-[80%] rounded-lg bg-muted" />
						<div className="h-6 w-[33%] rounded-lg bg-muted" />
					</div>
				</div>
			</motion.div>
			<div className="absolute right-4 bottom-4 left-4 text-center font-baskerville font-bold text-beige-muted-foreground text-xl">
				Attest data
			</div>
		</div>
	);
};

export default Sidebar;
