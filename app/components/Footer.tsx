import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Image from "next/image";

const Footer = () => {
	return (
		<>
			<div className="h-24 w-full" />
			<footer className="relative flex items-center justify-center overflow-hidden bg-background">
				<MotionWrapper
					type="div"
					className="absolute bottom-[-50%] left-[50%] h-[50%] w-[50%] translate-x-[-50%] rounded-full bg-green-500 blur-3xl"
					initial={{ opacity: 0, scale: 0.4, x: "-50%" }}
					animate={{ opacity: 0.75, scale: 1, x: "-50%" }}
					transition={{ duration: 3 }}
				/>
				<div className="flex w-full max-w-6xl flex-col-reverse items-center justify-between p-8 sm:flex-row">
					<div className="mt-8 flex flex-col items-center sm:mt-0 sm:items-start">
						<Link href={"/"} passHref className="flex items-center gap-2">
							<Image
								src="/assets/media/images/logo.svg"
								className="h-8 w-auto"
								alt="Gainforest"
								width={500}
								height={500}
							/>
						</Link>
						<p className="pt-2 font-baskerville font-bold text-base">
							By GainForest.Earth
						</p>
					</div>
					<ul className="flex flex-col space-x-0 md:flex-row md:space-x-2">
						{siteConfig.footerLinks.map(({ url, title }) => (
							<li key={title}>
								<a
									href={url}
									target="_blank"
									rel="noopener noreferrer"
									className={cn(
										buttonVariants({ variant: "link" }),
										"group flex items-center justify-between gap-2 text-lg",
									)}
									aria-label={`Open ${title} in a new tab`}
								>
									{title}
									<span className="sr-only">(opens in a new tab)</span>
									<ArrowUpRight
										size={18}
										className="group-hover:-translate-y-0.5 ml-1 opacity-70 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 group-hover:opacity-100"
										aria-hidden="true"
									/>
								</a>
							</li>
						))}
					</ul>
				</div>
			</footer>
		</>
	);
};

export default Footer;
