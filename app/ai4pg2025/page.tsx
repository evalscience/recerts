import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
	title: "AI for Decision Making in Public Goods | Fast Grants Program",
	description:
		"Apply for fast grants: $5,000 USD upon acceptance + up to $5,000 USD retroactively after publication in Recerts Journal. For AI applications in public goods decision making.",
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
		website: "https://octant.build",
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
];

const organizers: Person[] = [
	{ name: "David Dao", affiliation: "GainForest.Earth" },
	{ name: "Sejal Rekhan", affiliation: "Protocol Labs" },
];

function avatarFor(name: string): string {
	const encoded = encodeURIComponent(name);
	return `https://api.dicebear.com/7.x/notionists/png?seed=${encoded}`;
}

function PersonRow({ name, affiliation }: Person) {
	return (
		<div className="flex items-center gap-4 py-3">
			<Image
				src={avatarFor(name)}
				alt={name}
				width={48}
				height={48}
				className="h-12 w-12 rounded-full ring-1 ring-black/10 dark:ring-white/20"
			/>
			<div className="flex flex-col leading-tight">
				<span className="font-medium text-foreground">{name}</span>
				{affiliation ? (
					<span className="text-muted-foreground text-sm">{affiliation}</span>
				) : null}
			</div>
		</div>
	);
}

function SponsorCard({
	name,
	logo,
	website,
}: { name: string; logo: string; website: string }) {
	return (
		<Link
			href={website}
			target="_blank"
			rel="noopener noreferrer"
			className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-6 transition-colors hover:bg-muted/50"
		>
			<Image
				src={logo}
				alt={name}
				width={120}
				height={60}
				className="h-auto max-h-12 w-auto max-w-full object-contain"
			/>
			<span className="mt-3 text-center font-medium text-foreground text-sm">
				{name}
			</span>
		</Link>
	);
}

export default function CallForSubmissionsPage() {
	return (
		<>
			<div className="mb-10 w-full">
				<Image
					src="/ai4pg.png"
					alt="AI4PG Logo"
					width={1200}
					height={300}
					className="h-auto w-full object-contain dark:invert"
					priority
				/>
			</div>
			<main className="mx-auto w-full max-w-4xl px-6 py-10 md:py-14">
				<header className="mb-10 flex flex-col gap-4">
					<h1 className="text-balance text-center font-bold text-3xl text-foreground md:text-4xl">
						Fast Grants Program: AI for Decision Making in Public Goods
					</h1>
					<p className="mx-auto max-w-3xl text-center text-lg text-muted-foreground">
						$5,000 USD upon acceptance + up to $5,000 USD retroactively after
						publication in Recerts Journal
					</p>
				</header>

				<div className="prose prose-neutral dark:prose-invert mx-auto max-w-none prose-headings:text-foreground prose-li:text-muted-foreground prose-p:text-muted-foreground prose-strong:text-foreground">
					<h2>About the Program</h2>
					<p>
						Artificial Intelligence has the potential to revolutionize how we
						make decisions about public goods funding. From optimizing grant
						allocation to predicting project impact, AI can help create more
						effective, transparent, and equitable funding systems. However,
						developing and deploying AI solutions for public goods presents
						unique challenges that require interdisciplinary collaboration.
					</p>

					<p>
						This fast grants program offers a two-stage funding model: $5,000
						USD upfront for accepted proposals to support initial development,
						plus up to $5,000 USD retroactively for projects that successfully
						publish their results in the Recerts Journal. We're particularly
						interested in projects that address real-world challenges in funding
						allocation, impact assessment, governance, and community
						coordination.
					</p>

					<p>
						The program is hosted by the Recerts Journal and supported by
						leading organizations in the public goods funding space. By
						providing this structured funding approach, we aim to accelerate the
						development of AI-powered tools that can make public goods funding
						more effective and accessible, while encouraging rigorous
						documentation and peer review through journal publication.
					</p>

					<h2>About Recerts Journal</h2>
					<p>
						The Recerts Journal of Mechanism Design for Public Goods is a
						peer-reviewed venue for scholarship on collective funding mechanism
						design, incentive systems, and impact verification. Through this
						fast grants program, we extend our mission to actively support the
						development of innovative AI applications that can improve public
						goods funding mechanisms and decision-making processes.
					</p>

					<h2>Grant Details</h2>
					<ul>
						<li>
							<strong>Funding Structure:</strong> $5,000 USD upon project
							acceptance + up to $5,000 USD retroactively after publication in
							Recerts Journal
						</li>
						<li>
							<strong>Project Duration:</strong> 3-6 months for initial phase,
							with potential extension for journal submission
						</li>
						<li>
							<strong>Application Process:</strong> Submit proposal for initial
							$5,000 USD funding
						</li>
						<li>
							<strong>Decision Timeline:</strong> Applications reviewed within 2
							weeks
						</li>
						<li>
							<strong>Retroactive Funding:</strong> Additional funding available
							after successful publication in Recerts Journal
						</li>
					</ul>

					<h2>Call for Grant Proposals</h2>
					<p>
						We invite proposals for innovative AI applications that can improve
						decision making in public goods funding. We're particularly
						interested in projects that leverage artificial intelligence and
						machine learning to address challenges in:
					</p>

					<ul>
						<li>AI-powered grant allocation and matching algorithms</li>
						<li>Machine learning for impact prediction and evaluation</li>
						<li>Natural language processing for proposal assessment</li>
						<li>Computer vision for verifying project outcomes</li>
						<li>Reinforcement learning for optimal funding strategies</li>
						<li>Predictive analytics for public goods demand forecasting</li>
						<li>AI-driven governance and decision support systems</li>
						<li>Automated fraud detection in funding mechanisms</li>
						<li>Personalized recommendation systems for grant opportunities</li>
						<li>Multi-agent systems for coordinating public goods provision</li>
						<li>AI for measuring and optimizing ecosystem health</li>
						<li>Blockchain and AI integration for transparent funding</li>
						<li>Ethical AI frameworks for public goods decision making</li>
						<li>Human-AI collaboration in funding allocation</li>
						<li>AI tools for community preference aggregation</li>
					</ul>

					<p>
						All approaches are welcome, from theoretical AI models to practical
						implementations and experimental studies. Each proposal should
						clearly articulate the problem being addressed, the proposed AI
						solution, and the expected impact on public goods funding decision
						making. We encourage projects that plan to open-source their code
						and methodologies to maximize community benefit.
					</p>

					<p>
						Successful grantees will receive $5,000 USD upfront to support
						initial development. Projects that achieve significant results and
						publish their findings in the Recerts Journal become eligible for up
						to $5,000 USD in retroactive funding. Outstanding projects may also
						be invited to present at conferences or contribute to the journal as
						case studies.
					</p>

					<h2>Project Categories</h2>
					<p>
						We welcome proposals across different project types, from
						early-stage prototypes to more developed applications. All proposals
						must clearly demonstrate how AI can improve decision making in
						public goods contexts.
					</p>

					<h3>Prototype Development</h3>
					<p>
						Build working prototypes or proof-of-concepts for AI applications in
						public goods funding. These projects should demonstrate technical
						feasibility and include plans for testing and validation. Ideal for
						researchers and developers looking to quickly validate AI
						approaches.
					</p>

					<h3>Applied Research</h3>
					<p>
						Conduct empirical studies or develop new methodologies that apply AI
						to real public goods funding challenges. This includes analyzing
						existing datasets, developing new algorithms, or creating evaluation
						frameworks for AI-assisted decision making.
					</p>

					<h3>Tool Building</h3>
					<p>
						Create practical tools, libraries, or platforms that other projects
						and organizations can use to improve their decision making
						processes. These should be designed for real-world deployment and
						include clear documentation and use cases.
					</p>

					<h3>Integration Projects</h3>
					<p>
						Combine existing AI technologies with public goods funding
						mechanisms in novel ways. This includes adapting proven AI
						techniques to funding contexts or integrating multiple AI approaches
						to solve complex decision making problems.
					</p>

					<h2>Proposal Guidelines</h2>
					<ul>
						<li>
							<strong>Clear Problem Statement:</strong> Clearly define the
							public goods decision making challenge your AI solution addresses
							and why current approaches are insufficient.
						</li>
						<li>
							<strong>Technical Approach:</strong> Explain your proposed AI
							methodology, including algorithms, data sources, and
							implementation strategy.
						</li>
						<li>
							<strong>Impact Assessment:</strong> Describe how your project will
							measure success and what specific improvements in decision making
							you expect to achieve.
						</li>
						<li>
							<strong>Feasibility & Timeline:</strong> Provide a realistic
							project plan with milestones, deliverables, and a clear timeline
							for completion.
						</li>
						<li>
							<strong>Budget Justification:</strong> Explain how the requested
							funds will be used and why this amount is necessary for project
							success.
						</li>
						<li>
							<strong>Open Source Commitment:</strong> Outline your plans for
							sharing code, data, and learnings with the broader community.
						</li>
					</ul>

					<h2>Measuring Success</h2>
					<p>
						AI solutions for public goods decision making should demonstrate
						clear pathways to impact. Consider how your project will be
						evaluated and what success looks like. Key considerations include:
					</p>
					<ul>
						<li>
							Define specific, measurable outcomes for your AI application
						</li>
						<li>
							Identify the stakeholders who will benefit from improved decision
							making
						</li>
						<li>
							Plan for rigorous evaluation of your AI system's performance
						</li>
						<li>Consider both quantitative metrics and qualitative impacts</li>
						<li>
							Address potential unintended consequences and mitigation
							strategies
						</li>
					</ul>

					<h2>Support & Resources</h2>
					<p>
						We provide various forms of support to help grantees succeed in
						developing AI solutions for public goods decision making. This
						includes access to:
					</p>
					<ul>
						<li>Technical mentorship from AI and public goods experts</li>
						<li>Connections to relevant datasets and research communities</li>
						<li>Opportunities to present work at conferences and workshops</li>
						<li>Platform to share learnings and collaborate with peers</li>
						<li>Potential for follow-on funding for successful projects</li>
					</ul>
					<p>
						Our network of mentors includes researchers and practitioners with
						expertise in AI, mechanism design, public goods funding, and related
						fields. We encourage applicants to reach out for guidance during
						proposal development. Mentors can also provide guidance on preparing
						work for journal submission to access retroactive funding.
					</p>

					<section className="mt-16">
						<h2>Sponsors & Partners</h2>
						<div className="not-prose grid grid-cols-2 gap-4 md:grid-cols-6 sm:grid-cols-3">
							{sponsors.map((sponsor) => (
								<SponsorCard
									key={sponsor.name}
									name={sponsor.name}
									logo={sponsor.logo}
									website={sponsor.website}
								/>
							))}
						</div>
					</section>

					<section className="mt-16">
						<h2>Organizers</h2>
						<div className="not-prose grid grid-cols-1 gap-x-8 gap-y-1 md:grid-cols-2 sm:grid-cols-2">
							{organizers.map((organizer) => (
								<PersonRow key={organizer.name} {...organizer} />
							))}
						</div>
					</section>
				</div>
			</main>
		</>
	);
}
