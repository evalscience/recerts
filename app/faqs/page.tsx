import { MotionWrapper } from "@/components/ui/motion-wrapper";
import React from "react";
import FAQCard from "./components/FAQCard";
import FAQGrid from "./components/FAQGrid";
import Title from "./components/title";

const Page = () => {
	return (
		<main className="my-12 flex w-full flex-col items-center px-8">
			<div className="flex w-full max-w-6xl flex-col">
				<div className="flex items-center justify-center">
					<Title />
				</div>
				<MotionWrapper
					type="section"
					className="mt-8"
					initial={{ opacity: 0, y: 100, filter: "blur(10px)" }}
					animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
					transition={{ duration: 0.5, delay: 0.5 }}
				>
					<FAQGrid />
				</MotionWrapper>
			</div>
		</main>
	);
};

export default Page;
