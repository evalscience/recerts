import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
	title: "Call for Submissions | Recerts — MD4PG",
	description:
		"Submit your research to the Journal of Mechanism Design for Public Goods. We invite papers, proposals, and tutorials on mechanism design, incentive systems, and public goods funding.",
};

export default function CallForSubmissionsPage() {
	return (
		<>
			<div className="mb-10 w-full">
				<Image
					src="/md4pg.png"
					alt="MD4PG Logo"
					width={1200}
					height={300}
					className="h-auto w-full object-contain dark:invert"
					priority
				/>
			</div>
			<main className="mx-auto w-full max-w-4xl px-6 py-10 md:py-14">
				<header className="mb-10 flex flex-col gap-4">
					<h1 className="text-balance text-center font-bold text-3xl text-foreground md:text-4xl">
						Call for Submissions
					</h1>
					<p className="mx-auto max-w-3xl text-center text-lg text-muted-foreground">
						Special Issue for Gitcoin Grants 3.0
					</p>
				</header>

				<div className="prose prose-neutral dark:prose-invert mx-auto max-w-none prose-headings:text-foreground prose-li:text-muted-foreground prose-p:text-muted-foreground prose-strong:text-foreground">
					<h2>About</h2>
					<p>
						Many researchers and practitioners in economics, computer science,
						and related fields wish to contribute to solving public goods
						funding challenges, but are unsure how to have the most impact. This
						journal highlights work that demonstrates that, while mechanism
						design is no silver bullet, it can be an invaluable tool in creating
						more effective funding systems and improving resource allocation for
						public goods.
					</p>

					<p>
						Public goods funding is a complex problem for which solutions take
						many forms, from advancing theory to deploying new mechanisms in
						practice. Many of these approaches represent high-impact
						opportunities for real-world change, and simultaneously pose
						interesting academic research problems.
					</p>

					<p>
						This journal aims to bring together those applying mechanism design
						to public goods funding challenges and facilitate cross-pollination
						between researchers in economics, computer science, and experts in
						public policy and governance.
					</p>

					<h2>About MD4PG</h2>
					<p>
						The Recerts Journal of Mechanism Design for Public Goods is a
						peer-reviewed venue for scholarship on collective funding mechanism
						design, incentive systems, and impact verification. We publish
						theoretical and empirical work that advances open, transparent, and
						decentralized approaches to allocating resources for public goods
						and scientific research.
					</p>

					<h2>Important Dates</h2>
					<ul>
						<li>
							First round submission deadline:{" "}
							<strong>October 11, 2025, 23:59 AoE</strong>
						</li>
						<li>
							Editorial review period: <strong>October 12-18, 2025</strong>
						</li>
						<li>
							Peer review period: <strong>October 19 - December 6, 2025</strong>
						</li>
						<li>
							Accept/Reject notification date:{" "}
							<strong>December 7, 2025, 23:59 AoE</strong>
						</li>
					</ul>

					<h2>Call for Submissions</h2>
					<p>
						We invite submissions of short papers, proposals, or tutorial
						notebooks using mechanism design to address problems in public goods
						funding, including but not limited to the following topics:
					</p>

					<ul>
						<li>Quadratic funding and variations</li>
						<li>Retroactive public goods funding</li>
						<li>Impact evaluation and verification mechanisms</li>
						<li>Algorithmic governance and voting systems</li>
						<li>Decentralized autonomous organizations (DAOs)</li>
						<li>Blockchain-based funding mechanisms</li>
						<li>Market mechanisms for public goods</li>
						<li>Incentive alignment in public goods provision</li>
						<li>Commons management and tragedy avoidance</li>
						<li>Open source software funding</li>
						<li>Scientific research funding mechanisms</li>
						<li>Environmental and climate public goods</li>
						<li>Digital public infrastructure</li>
						<li>Social choice theory applications</li>
						<li>Behavioral economics in public goods contexts</li>
						<li>Mechanism design for social impact</li>
					</ul>

					<p>
						All theoretical and empirical approaches are welcome, from classical
						mechanism design to experimental economics and computational
						methods. Each submission should make clear why the research has (or
						could have) a pathway to positive impacts regarding public goods
						funding. We highly encourage submissions which make their data and
						code publicly available. Accepted submissions will be invited to
						give poster presentations, of which some will be selected for
						spotlight talks.
					</p>

					<p>
						The journal does not publish proceedings, and submissions are
						non-archival. Submission to this journal does not preclude future
						publication. Previously published work may be submitted under
						certain circumstances (see the FAQ).
					</p>

					<h2>Submission Tracks</h2>
					<p>
						Recerts accepts submissions across five tracks. All submissions must
						explain why the proposed work has (or could have) positive impacts
						regarding public goods funding and mechanism design.
					</p>

					<h3>Research Track</h3>
					<p>
						Recerts publishes novel research results of significant interest to
						the community. Submissions should present original theoretical or
						empirical work that advances the field of mechanism design for
						public goods. This includes new theoretical insights, empirical
						studies, experimental results, and computational methods.
					</p>

					<h3>Exposition Track</h3>
					<p>
						Recerts publishes articles explaining, synthesizing and reviewing
						existing research. This includes Reviews, Tutorials, Primers, and
						Perspective articles. The editorial team is especially interested in
						explorable explanations that make complex mechanism design concepts
						accessible to practitioners and policymakers.
					</p>

					<h3>Commentary Track</h3>
					<p>
						Recerts occasionally publishes non‑technical essays on topics
						ranging from public policy to meta‑discussion of science and
						mechanism design. These pieces provide critical perspectives on
						current practices, future directions, or societal implications of
						public goods funding mechanisms. Please discuss intentions with{" "}
						<a
							href="mailto:editors@recerts.org"
							className="text-primary hover:underline"
						>
							editors@recerts.org
						</a>{" "}
						prior to submission.
					</p>

					<h3>Datasets & Benchmarks Track</h3>
					<p>
						Recerts is willing to publish datasets and benchmarks relevant to
						mechanism design research and public goods funding evaluation. This
						includes datasets from funding mechanisms, experimental studies, or
						real-world implementations that could benefit the research
						community. Please discuss intentions with{" "}
						<a
							href="mailto:editors@recerts.org"
							className="text-primary hover:underline"
						>
							editors@recerts.org
						</a>{" "}
						prior to submission.
					</p>

					<h3>Proposal Track</h3>
					<p>
						Proposals are early stage research and project ideas that outline
						potential research directions or methodologies. These submissions
						help communicate emerging concepts and seek community feedback on
						developing work. Proposals should provide sufficient detail to
						enable meaningful review and community engagement while
						acknowledging their preliminary nature.
					</p>

					<h2>Tips for Submissions</h2>
					<ul>
						<li>
							<strong>Be explicit:</strong> Describe how your proposed approach
							addresses public goods funding challenges, demonstrating an
							understanding of the application area.
						</li>
						<li>
							<strong>Frame your work:</strong> The specific problem and/or data
							proposed should be contextualized in terms of prior work.
						</li>
						<li>
							<strong>Address the impact:</strong> Describe the practical
							implications of your method and any relevant societal impacts or
							potential side-effects.
						</li>
						<li>
							<strong>Explain the mechanism design:</strong> Readers may not be
							familiar with the exact techniques you are using or may desire
							further detail.
						</li>
						<li>
							<strong>Justify the approach:</strong> Describe why the mechanism
							design method involved is needed, and why it is a good match for
							the problem.
						</li>
						<li>
							<strong>Avoid jargon:</strong> Ideal submissions will be
							accessible both to an economics/CS audience and to experts in
							public policy and governance.
						</li>
					</ul>

					<h2>Addressing Impact</h2>
					<p>
						Improving public goods funding requires translating ideas into
						action. Consider your target audience and try to convey why solving
						the problem at hand will be useful to practitioners, policymakers,
						and funding organizations. Outline key metrics and be clear about
						how your results compare to existing methods. Ensure that from the
						outset, you contextualize your method and its impacts in terms of
						meaningfully improving public goods funding.
					</p>

					<h2>Mentorship Program</h2>
					<p>
						We are hosting a mentorship program to facilitate exchange between
						potential submitters and experts working in mechanism design and
						public goods funding. The goal is to foster cross-disciplinary
						collaborations and increase the quality and potential impact of
						submitted work.
					</p>
					<p>
						Mentors will guide mentees during the mentorship period (October -
						December) as they prepare submissions. Examples of interactions may
						include discussing relevant related work, iterating on core ideas,
						and providing feedback on writing and presentation.
					</p>
				</div>
			</main>
		</>
	);
}
