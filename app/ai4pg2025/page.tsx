import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
	title: "AI for Decision Making in Public Goods | Fast Grants Program",
	description:
		"Apply for fast grants: Up to $10,000 USD for each proposal. Call for proposals opening soon. Also seeking academic/scientific reviewers ($800 USD reward). For AI applications in public goods decision making.",
};

type Person = {
	name: string;
	affiliation?: string;
};

const sponsors = [
	{
		name: "GainForest",
		logo: "/ai4pg/gainforest.png",
		website: "https://gainforest.earth",
	},
	{
		name: "Octant",
		logo: "/ai4pg/octant.png",
		website: "https://octant.app",
	},
	{ name: "Seer One", logo: "/ai4pg/seer.png", website: "https://seer.pm" },
	{
		name: "Funding the Commons",
		logo: "/ai4pg/fundingthecommons.png",
		website: "https://fundingthecommons.io",
	},
	{
		name: "Hypercerts Foundation",
		logo: "/ai4pg/hypercerts.png",
		website: "https://hypercerts.org",
	},
	{
		name: "Recerts Journal",
		logo: "/ai4pg/recerts.png",
		website: "https://recerts.org",
	},
	{
		name: "Ethereum Foundation",
		logo: "/ai4pg/ef.png",
		website: "https://ethereum.foundation",
	},
	{
		name: "Gitcoin",
		logo: "/ai4pg/gitcoin.webp",
		website: "https://gitcoin.co",
	},
	{
		name: "Simocracy",
		logo: "/ai4pg/simocracy.png",
		website: "https://simocracy.org",
	},
	{
		name: "Protocol Labs",
		logo: "/ai4pg/protocollabs.png",
		website: "https://protocol.ai",
	},
];

const organizers: Person[] = [
	{ name: "Dr. David Dao", affiliation: "GainForest.Earth" },
	{ name: "Sejal Rekhan", affiliation: "Protocol Labs" },
	{ name: "Sarah Tariq", affiliation: "University of Zurich" },
	{ name: "Dr. Livia Kalossaka", affiliation: "HEC Paris, CDL" },
	{ name: "Dr. Maria João Sousa", affiliation: "Cornell Tech, CCAI" },
	{ name: "Prof. Lily Xu", affiliation: "Columbia" },
	{ name: "Prof. Millie Chapman", affiliation: "ETH Zurich" },
];

export default function CallForSubmissionsPage() {
	return (
		<>
			<main className="mx-auto w-full max-w-2xl px-6 py-20">
				<header className="mb-24 text-center">
					<div className="mb-8">
						<Image
							src="/ai4pg.png"
							alt="AI4PG Logo"
							width={500}
							height={125}
							className="mx-auto h-auto object-contain opacity-100"
							priority
						/>
					</div>
					<h1 className="mb-6 font-light text-4xl text-foreground tracking-tight">
						AI for Public Goods
					</h1>
					<p className="font-light text-muted-foreground text-xl">
						Up to $10,000 per proposal
					</p>
					<p className="mt-2 text-muted-foreground text-sm">
						Call for proposals opening soon
					</p>
					<div className="mt-8">
						<Link
							href="https://gainforest.notion.site/ai4pg"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center rounded-lg border border-border/50 bg-card/30 px-6 py-3 font-medium text-foreground transition-colors hover:border-border hover:bg-card/50"
						>
							More Details
						</Link>
					</div>
				</header>

				<div className="space-y-20">
					<section className="text-center">
						<p className="mb-12 text-lg text-muted-foreground leading-relaxed">
							Supporting AI research that advances public goods funding through
							improved decision-making, transparent allocation, and impact
							assessment.
						</p>

						<div className="space-y-6 text-left">
							<p className="text-muted-foreground leading-relaxed">
								Artificial Intelligence offers significant potential to enhance
								decision-making processes in public goods funding. From
								optimizing grant allocation to predicting project impact, AI
								methodologies can contribute to more effective, transparent, and
								equitable funding systems. However, developing and deploying AI
								solutions for public goods presents unique challenges that
								require interdisciplinary collaboration.
							</p>

							<p className="text-muted-foreground leading-relaxed">
								This fast grants program offers up to $10,000 USD for each
								accepted proposal to support AI research and development in
								public goods decision making. Proposals are limited to 4 pages
								and maximum 1,000 words. Our call for proposals will be opening
								soon. We're particularly interested in projects that address
								real-world challenges in funding allocation, impact assessment,
								governance, and community coordination.
							</p>

							<p className="text-muted-foreground leading-relaxed">
								The program is hosted by the Recerts Journal and supported by
								leading organizations in the public goods funding space. By
								providing this funding opportunity, we aim to accelerate the
								development of AI-powered tools that can make public goods
								funding more effective and accessible, while encouraging
								rigorous documentation and peer review through journal
								publication.
							</p>
						</div>
					</section>

					<section>
						<h2 className="mb-8 text-center font-light text-2xl text-foreground">
							Program Details
						</h2>
						<div className="grid gap-6 md:grid-cols-2">
							<div className="rounded-lg border border-border/50 bg-card/30 p-6">
								<h3 className="mb-2 font-medium text-foreground">Funding</h3>
								<p className="text-muted-foreground">
									Up to $10,000 per proposal
								</p>
							</div>
							<div className="rounded-lg border border-border/50 bg-card/30 p-6">
								<h3 className="mb-2 font-medium text-foreground">Duration</h3>
								<p className="text-muted-foreground">1-6 months</p>
							</div>
							<div className="rounded-lg border border-border/50 bg-card/30 p-6">
								<h3 className="mb-2 font-medium text-foreground">
									Application
								</h3>
								<p className="text-muted-foreground">Opening soon</p>
							</div>
							<div className="rounded-lg border border-border/50 bg-card/30 p-6">
								<h3 className="mb-2 font-medium text-foreground">Review</h3>
								<p className="text-muted-foreground">
									Rolling basis - 4 weeks after submission
								</p>
							</div>
						</div>
					</section>

					<section>
						<h2 className="mb-8 text-center font-light text-2xl text-foreground">
							Timeline
						</h2>
						<div className="rounded-lg border border-border/50 bg-card/30 p-8">
							<div className="grid gap-6 md:grid-cols-2">
								<div className="space-y-4">
									<div className="flex flex-col">
										<h3 className="mb-1 font-medium text-foreground">
											Call for Reviewers Opens
										</h3>
										<p className="text-muted-foreground">Oct 14, 2025</p>
									</div>
									<div className="flex flex-col">
										<h3 className="mb-1 font-medium text-foreground">
											Reviewer Application Deadline
										</h3>
										<p className="text-muted-foreground">Nov 14, 2025</p>
									</div>
								</div>
								<div className="space-y-4">
									<div className="flex flex-col">
										<h3 className="mb-1 font-medium text-foreground">
											Call for Proposals Opens
										</h3>
										<p className="text-muted-foreground">Nov 15, 2025</p>
									</div>
									<div className="flex flex-col">
										<h3 className="mb-1 font-medium text-foreground">
											Proposal Submission Deadline
										</h3>
										<p className="text-muted-foreground">Jan 11, 2026</p>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section>
						<h2 className="mb-6 text-center font-light text-2xl text-foreground">
							Call for Reviewers - Now Open
						</h2>
						<div className="rounded-lg border border-border/50 bg-card/30 p-8 text-center">
							<p className="mb-4 text-lg text-muted-foreground">
								Seeking academic and scientific reviewers with expertise in AI,
								machine learning, or public goods funding.
							</p>
							<p className="mb-6 font-medium text-foreground text-xl">
								$800 compensation per reviewer
							</p>
							<Link
								href="https://forms.gle/uNnC4y8EJCwcQw9J8"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-center rounded-lg border border-border/50 bg-card/30 px-6 py-3 font-medium text-foreground transition-colors hover:border-border hover:bg-card/50"
							>
								Apply as Reviewer
							</Link>
						</div>
					</section>

					<section>
						<h2 className="mb-6 text-center font-light text-2xl text-foreground">
							Research Areas
						</h2>
						<p className="mb-8 text-center text-muted-foreground">
							We invite proposals for AI applications that improve public goods
							funding decision making.
						</p>
						<div className="rounded-lg border border-border/50 bg-card/30 p-8">
							<ul className="grid gap-3 text-muted-foreground text-sm md:grid-cols-2">
								<li>AI-powered grant allocation and matching algorithms</li>
								<li>Machine learning for impact prediction and evaluation</li>
								<li>Natural language processing for proposal assessment</li>
								<li>Computer vision for verifying project outcomes</li>
								<li>Reinforcement learning for optimal funding strategies</li>
								<li>
									Predictive analytics for public goods demand forecasting
								</li>
								<li>AI-driven governance and decision support systems</li>
								<li>Automated fraud detection in funding mechanisms</li>
								<li>
									Personalized recommendation systems for grant opportunities
								</li>
								<li>
									Multi-agent systems for coordinating public goods provision
								</li>
								<li>AI for measuring and optimizing ecosystem health</li>
								<li>Blockchain and AI integration for transparent funding</li>
								<li>Ethical AI frameworks for public goods decision making</li>
								<li>Human-AI collaboration in funding allocation</li>
								<li>AI tools for community preference aggregation</li>
							</ul>
						</div>
					</section>

					<section>
						<h2 className="mb-8 text-center font-light text-lg text-muted-foreground">
							Supported by
						</h2>
						<div className="grid grid-cols-3 items-center justify-items-center gap-8 md:grid-cols-5">
							{sponsors.map((sponsor) => (
								<Link
									key={sponsor.name}
									href={sponsor.website}
									target="_blank"
									rel="noopener noreferrer"
									className="transition-opacity hover:opacity-80"
								>
									<Image
										src={sponsor.logo}
										alt={sponsor.name}
										width={120}
										height={60}
										className="h-12 w-auto object-contain"
									/>
								</Link>
							))}
						</div>
					</section>

					<section className="text-center">
						<h2 className="mb-6 font-light text-lg text-muted-foreground">
							Organized by
						</h2>
						<div className="flex flex-col items-center gap-3">
							{organizers.map((organizer) => (
								<div
									key={organizer.name}
									className="text-muted-foreground text-sm"
								>
									<span className="font-medium text-foreground">
										{organizer.name}
									</span>
									{organizer.affiliation && (
										<span className="ml-2">• {organizer.affiliation}</span>
									)}
								</div>
							))}
						</div>
					</section>
				</div>
			</main>
		</>
	);
}
