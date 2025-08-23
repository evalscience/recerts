"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, BadgeCheck, Info } from "lucide-react";
import { useState } from "react";
import { HypercertForm } from "./components/hypercert-form";

function InfoSection({
	title,
	children,
}: { title: string; children: React.ReactNode }) {
	return (
		<section className="mx-4 flex flex-col gap-4 md:mx-8">
			<h2 className="font-semibold text-2xl text-foreground leading-tight">
				{title}
			</h2>
			<div className="prose prose-slate dark:prose-invert max-w-none text-base text-foreground/90 leading-relaxed">
				{children}
			</div>
		</section>
	);
}

function SubmitPage() {
	const [step, setStep] = useState<1 | 2>(1);

	return (
		<main className="container mx-auto mt-2 flex max-w-4xl flex-col gap-8 px-6 pb-[64px] md:mt-8 md:px-8 md:pb-12">
			<header className="flex w-full flex-col gap-3 py-6">
				<h1 className="text-balance font-bold text-4xl text-foreground leading-tight md:text-5xl">
					Create & Submit a Recert
				</h1>
				<div className="mt-2">
					<span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-muted-foreground text-sm">
						{step === 1 ? "Step 1 of 2" : "Step 2 of 2"}
					</span>
				</div>
			</header>

			{step === 1 ? (
				<>
					<Card className="rounded-xl border-none bg-transparent shadow-none">
						<CardContent className="flex flex-col gap-8 p-0 md:p-0">
							<div className="mx-4 flex items-center justify-end md:mx-8">
								<Button
									variant="ghost"
									className="gap-2 px-0 text-sm"
									onClick={() => setStep(2)}
								>
									Next <ArrowRight className="h-4 w-4" />
								</Button>
							</div>
							<InfoSection title="Why Publish in Recerts Journal?">
								<ul>
									<li>
										<strong>Flexibility</strong>: Recerts encourages you to go
										beyond traditional academic forms. The goal is to best
										communicate science and serve the reader.
									</li>
									<li>
										<strong>Scholarly recognition</strong>: Recerts articles are
										peer reviewed and are intended to be citable and indexable.
									</li>
									<li>
										<strong>Neutrality</strong>: Recerts provides a neutral
										platform for multiple authors to jointly publish. This is in
										contrast to a personal website, where outside contributors
										may get less credit.
									</li>
									<li>
										<strong>Impact</strong>: Recerts articles are designed to
										reach practitioners and researchers across mechanism design,
										incentive systems, and verification.
									</li>
								</ul>
								<p className="mt-2 text-muted-foreground text-xs">
									ISSN: coming soon · DOI: coming soon
								</p>
							</InfoSection>

							<Separator className="mx-4 md:mx-8" />

							<InfoSection title="Journal Scope">
								<p>
									Recerts Journal of Mechanism Design for Public Goods (MD4PG)
									is a peer‑reviewed venue for scholarship on collective funding
									mechanism design, incentive systems, and impact verification.
									We publish theoretical and empirical work that advances open,
									transparent, and decentralized approaches to allocating
									resources for public goods and scientific research. The
									distinguishing trait of a Recerts article is the scholar
									hypercert (or recert), which is a verifiable record of your
									work that tracks and rewards scholarship over time.
								</p>
							</InfoSection>

							<Separator className="mx-4 md:mx-8" />

							<InfoSection title="Article Types">
								<p>
									Recerts Journal is open to publishing a wide range of academic
									artifacts, provided they meet our editorial standards:
								</p>
								<ul>
									<li>
										<strong>Research</strong>: Recerts publishes novel research
										results of significant interest to the community.
									</li>
									<li>
										<strong>Exposition</strong>: Recerts publishes articles
										explaining, synthesizing and reviewing existing research.
										This includes Reviews, Tutorials, Primers, and Perspective
										articles. The editorial team is especially interested in
										explorable explanations.
									</li>
									<li>
										<strong>Commentary</strong>: Recerts occasionally publishes
										non‑technical essays on topics ranging from public policy to
										meta‑discussion of science. Please discuss intentions with{" "}
										<a href="mailto:editors@recerts.org" className="underline">
											editors@recerts.org
										</a>{" "}
										prior to submission.
									</li>
									<li>
										<strong>Datasets & Benchmarks</strong>: Recerts is willing
										to publish datasets and benchmarks. Please discuss
										intentions with{" "}
										<a href="mailto:editors@recerts.org" className="underline">
											editors@recerts.org
										</a>{" "}
										prior to submission.
									</li>
									<li>
										<strong>Proposal</strong>: Proposals are early stage
										research and project ideas that outline potential research
										directions or methodologies. These submissions help
										communicate emerging concepts and seek community feedback on
										developing work.
									</li>
								</ul>
								<p className="mt-2">
									There are no word count limits for any article type. Articles
									should be whatever length best serves the reader — just be
									aware that rambling is an easy failure mode.
								</p>
							</InfoSection>

							<Separator className="mx-4 md:mx-8" />

							<InfoSection title="What Recerts Reviews For">
								<ul>
									<li>
										<strong>Advancing dialogue</strong>: All Recerts articles
										must significantly advance the research community’s
										dialogue. This could mean presenting significant novel
										results, giving a new perspective on known results, or even
										commentary on public policy.
									</li>
									<li>
										<strong>Outstanding communication</strong>: Recerts holds
										itself to an extremely high standard for communication.
									</li>
									<li>
										<strong>Scientific integrity</strong>: Articles should not
										only accurately report results, but also make sure
										high‑level description of work matches the results, and be
										transparent about any weaknesses.
									</li>
								</ul>
								<p className="mt-2">
									Recerts provides the Recerts Reviewer Worksheet to help
									evaluate articles. Reviewers and authors alike are encouraged
									to refer to this worksheet, be it for self‑evaluation or
									during the review process.
								</p>
								<p className="mt-2">
									In order for Recerts to best serve the community, and to
									create a respected space for non‑traditional contributions,
									it’s critical for Recerts to hold high publication standards.
									Unfortunately, this means many articles have to be rejected,
									including good articles that may be publishable elsewhere.
								</p>
							</InfoSection>

							<Separator className="mx-4 md:mx-8" />

							<InfoSection title="Writing a Recerts Article">
								<p className="mt-2">
									Recerts articles must be released under the Creative Commons
									Attribution license. Recerts is a primary publication and will
									not publish content which is identical or substantially
									similar to content published elsewhere.
								</p>
								<p className="mt-2">
									To submit an article, submit a recerts through the hypercert
									submission form.
								</p>
								<p className="mt-2">
									Recerts handles all reviews and editing through EAS
									attestations.{" "}
								</p>
							</InfoSection>

							<Separator className="mx-4 md:mx-8" />

							<InfoSection title="The Recerts Review Process">
								<p>
									Recerts only considers complete article submissions and
									evaluates them as is.
								</p>
								<ul>
									<li>
										<strong>Editorial Review</strong>
									</li>
									<li>
										<strong>Peer Review</strong>
									</li>
									<li>
										<strong>Post‑Publication Review</strong>
									</li>
								</ul>
								<p className="mt-2">
									Recerts has ongoing review after publication. This allows
									subject experts and people trying to build on work to raise
									issues after publication. Peer reviewers give detailed
									feedback to help articles meet Recerts’s high standards.
									Recerts does an initial assessment of whether a submission
									looks like a fit. This saves both Recerts and the authors
									energy if it doesn’t make sense.
								</p>
								<div
									className="l-middle-outset"
									style={{ marginTop: 30, marginBottom: 30 }}
								>
									<svg
										id="timeline"
										viewBox="0 0 678.3 160"
										role="img"
										aria-labelledby="timeline-title"
										style={{
											filter: "var(--timeline-filter, none)",
										}}
										className="dark:[--timeline-filter:invert(1)]"
									>
										<title id="timeline-title">
											Recerts review process timeline: submission, acceptance
											for review, and post‑publication review
										</title>
										<line
											stroke="#696969"
											strokeWidth="0.5"
											strokeMiterlimit="10"
											x1="455.9"
											y1="31.4"
											x2="455.9"
											y2="41.1"
										/>
										<line
											stroke="#696969"
											strokeWidth="0.5"
											strokeMiterlimit="10"
											x1="230.8"
											y1="31.4"
											x2="230.8"
											y2="41.1"
										/>
										<line
											stroke="#696969"
											strokeWidth="0.5"
											strokeMiterlimit="10"
											x1="8"
											y1="31.4"
											x2="8"
											y2="41.1"
										/>
										<path
											fill="#231F20"
											d="M454.7,64h2.3c1.1,0,2-0.9,2-2V42.6c0-1.1-0.9-2-2-2h-2.3c-1.1,0-2,0.9-2,2V62C452.7,63.1,453.6,64,454.7,64 z"
										/>
										<path
											fill="#231F20"
											d="M229.7,64h2.3c1.1,0,2-0.9,2-2V42.6c0-1.1-0.9-2-2-2h-2.3c-1.1,0-2,0.9-2,2V62C227.7,63.1,228.6,64,229.7,64 z"
										/>
										<path
											fill="#231F20"
											d="M6.8,64h2.3c1.1,0,2-0.9,2-2V42.6c0-1.1-0.9-2-2-2H6.8c-1.1,0-2,0.9-2,2V62C4.8,63.1,5.7,64,6.8,64z"
										/>
										<path
											fill="#0078B3"
											d="M212.9,63.6h-197c-1.1,0-2-0.9-2-2V42.9c0-1.1,0.9-2,2-2h197l11,11.3L212.9,63.6z"
										/>
										<path
											fill="#359696"
											d="M438.9,63.6h-200c-1.1,0-2-0.9-2-2V42.9c0-1.1,0.9-2,2-2h200l11,11.3L438.9,63.6z"
										/>
										<path
											fill="#379F5A"
											d="M663.9,62.9h-200c-1.1,0-2-0.9-2-2V42.2c0-1.1,0.9-2,2-2h200l11,11.3L663.9,62.9z"
										/>
										<text
											className="review-stage"
											transform="matrix(1 0 0 1 22.8571 55.5716)"
											fontFamily="'EB Garamond'"
										>
											Editorial Review
										</text>
										<text
											className="review-stage"
											transform="matrix(1 0 0 1 245.8571 55.5716)"
											fontFamily="'EB Garamond'"
										>
											Peer Review
										</text>
										<text
											className="review-stage"
											transform="matrix(1 0 0 1 469.8571 55.5716)"
											fontFamily="'EB Garamond'"
										>
											Post-Publication Review
										</text>
										<rect
											x="470.9"
											y="76.6"
											fill="none"
											width="178.7"
											height="108"
										/>
										<text transform="matrix(1 0 0 1 470.8571 84.4806)">
											<tspan
												x="0"
												y="0"
												fill="#231F20"
												fontFamily="'Inter'"
												fontSize="11px"
											>
												Recerts has ongoing review after{" "}
											</tspan>
											<tspan
												x="0"
												y="15"
												fill="#231F20"
												fontFamily="'Inter'"
												fontSize="11px"
											>
												publication. This allows subject{" "}
											</tspan>
											<tspan
												x="0"
												y="30"
												fill="#231F20"
												fontFamily="'Inter'"
												fontSize="11px"
											>
												experts and people trying to build on{" "}
											</tspan>
											<tspan
												x="0"
												y="45"
												fill="#231F20"
												fontFamily="'Inter'"
												fontSize="11px"
											>
												work to raise issues after publication.
											</tspan>
										</text>
										<rect
											x="245.9"
											y="76.6"
											fill="none"
											width="177.6"
											height="108"
										/>
										<text transform="matrix(1 0 0 1 245.8571 84.4806)">
											<tspan
												x="0"
												y="0"
												fill="#231F20"
												fontFamily="'Inter'"
												fontSize="11px"
											>
												Peer reviewers give detailed
											</tspan>
											<tspan
												x="0"
												y="15"
												fill="#231F20"
												fontFamily="'Inter'"
												fontSize="11px"
											>
												feedback to help articles meet{" "}
											</tspan>
											<tspan
												x="0"
												y="30"
												fill="#231F20"
												fontFamily="'Inter'"
												fontSize="11px"
											>
												Recert's high standards.
											</tspan>
										</text>
										<rect
											x="23.9"
											y="76.6"
											fill="none"
											width="183.3"
											height="108"
										/>
										<text transform="matrix(1 0 0 1 23.8571 84.4806)">
											<tspan
												x="0"
												y="0"
												fill="#231F20"
												fontFamily="'Inter'"
												fontSize="11px"
											>
												Recerts does an initial assessment of{" "}
											</tspan>
											<tspan
												x="0"
												y="15"
												fill="#231F20"
												fontFamily="'Inter'"
												fontSize="11px"
											>
												whether a submission looks like a fit.{" "}
											</tspan>
											<tspan
												x="0"
												y="30"
												fill="#231F20"
												fontFamily="'Inter'"
												fontSize="11px"
											>
												This saves both Recerts and the authors
											</tspan>
											<tspan
												x="0"
												y="45"
												fill="#231F20"
												fontFamily="'Inter'"
												fontSize="11px"
											>
												energy if it doesn’t make sense.
											</tspan>
										</text>
										<g>
											<rect
												x="421.9"
												y="18.9"
												fill="none"
												width="69"
												height="13.7"
											/>
											<text
												transform="matrix(1 0 0 1 426.7165 26.8139)"
												fill="#231F20"
												fontFamily="'EB Garamond'"
												fontSize="11px"
												fontWeight="700"
											>
												Publication{" "}
											</text>
										</g>
										<g>
											<rect
												x="5"
												y="18.9"
												fill="none"
												width="69"
												height="13.7"
											/>
											<text
												transform="matrix(1 0 0 1 5 26.8139)"
												fill="#231F20"
												fontFamily="'EB Garamond'"
												fontSize="11px"
												fontWeight="700"
											>
												Submission{" "}
											</text>
										</g>
										<g>
											<rect
												x="196.3"
												y="5.6"
												fill="none"
												width="69"
												height="25"
											/>
											<text transform="matrix(1 0 0 1 206.6402 13.4806)">
												<tspan
													x="-6.7"
													y="13"
													fill="#231F20"
													fontFamily="'EB Garamond'"
													fontSize="11px"
													fontWeight="700"
												>
													Accepted for Review
												</tspan>
											</text>
										</g>
										<text
											transform="matrix(1 0 0 1 246.5238 155)"
											fill="#231F20"
											fontFamily="'Inter'"
											fontSize="11px"
											fontStyle="italic"
										>
											Approximately 1–2 months
										</text>
										<text
											transform="matrix(1 0 0 1 470.8571 155)"
											fill="#231F20"
											fontFamily="'Inter'"
											fontSize="11px"
											fontStyle="italic"
										>
											Ongoing
										</text>
										<text
											transform="matrix(1 0 0 1 23.8571 155)"
											fill="#231F20"
											fontFamily="'Inter'"
											fontSize="11px"
											fontStyle="italic"
										>
											Approximately 1–2 weeks
										</text>
									</svg>
								</div>
								<p className="mt-2">
									The first two stages of review are led by an editor. The
									editor will bring in external peer reviewers based on their
									discretion as to what perspectives are needed, optimizing for
									high‑quality review and an excellent review experience for all
									parties. The amount of time these stages take is highly
									variable depending on how responsive the authors are.
								</p>
								<p className="mt-2">
									For all publications, Recerts will review for outstanding
									communication and design, in addition to scientific quality
									and integrity. Our reviewing criteria are more explicitly
									described in the Recerts Reviewer Worksheet, which will be
									used by external reviewers to evaluate a submission. We
									recommend authors also spend some time using it to
									self‑evaluate and identify areas for improvement.
								</p>
								<p className="mt-2">
									In the third stage of review, readers can raise new concerns
									through EAS attestations. The issues will be moderated by
									Recerts’s moderators. Significant issues may be displayed in
									the article margin if the author does not address them.
								</p>
								<p className="mt-2 text-muted-foreground text-xs">
									Recerts may occasionally publish editorials, commentary, and
									invited content without peer review. This content will be
									clearly marked.
								</p>
							</InfoSection>

							<Separator className="mx-4 md:mx-8" />

							<InfoSection title="Conflicts of Interest">
								<p>
									Recerts editors cannot be involved in the review process for a
									paper on which they are an author or where they are unable to
									be objective. In the event of a conflict of interest, Recerts
									editors will select a member of the research community to
									serve as a temporary “acting editor” for an article. The
									acting editor should be a member of the relevant research
									community, and at arm’s length to the authors. The use and
									identity of an acting editor will be noted in the review
									process log, and made public if the article is published.
								</p>
								<p className="mt-2">
									Impact evaluation is a small field and Recerts’s editors will
									inevitably have prior relationships with some authors. Such
									relationships must be disclosed in the review process.
								</p>
							</InfoSection>

							<Separator className="mx-4 md:mx-8" />

							<InfoSection title="Dual Submission Policy">
								<p>
									In order for Recerts to be effective in legitimizing
									non‑traditional publishing, it must be perceived as a primary
									academic publication. This means it’s important for us to
									follow typical “dual publication” norms. It’s also important
									for us to avoid the perception that Recerts is an
									“accompanying blog post” for something like an arXiv paper.
								</p>
								<p className="mt-2">
									The result is that Recerts can only consider articles that are
									substantially different from those formally published
									elsewhere, and is cautious of articles informally published
									elsewhere. Below Recerts provides guidance for particular
									cases:
								</p>
								<ul>
									<li>
										<strong>
											No Prior Publication / Low‑Profile Informal Publication
										</strong>
										: No concerns!
									</li>
									<li>
										<strong>ArXiv Paper</strong>: Recerts is happy to publish a
										paper on research that has previously been published on
										arXiv, as long as there’s a clear understanding that Recerts
										is the formal publication.
									</li>
									<li>
										<strong>Previous Workshop / Conference Papers</strong>:
										Recerts is happy to publish more developed and polished
										“journal versions” of papers. These must substantively
										advance on the previous publications, through some
										combination of improving exposition, better surfacing of
										underlying insights and ways of thinking, consolidating a
										sequence of papers, or expanding with better experiments.
									</li>
									<li>
										<strong>High‑Profile Informal Publication</strong>: Recerts
										sees this as being very similar to publication in a workshop
										or conference, and has the same expectations as above.
									</li>
								</ul>
							</InfoSection>

							<Separator className="mx-4 md:mx-8" />

							<InfoSection title="Ethics Concerns (e.g., Plagiarism, Misconduct, etc.)">
								<p>
									If you have any concern, please email{" "}
									<a href="mailto:ethics@recerts.org" className="underline">
										ethics@recerts.org
									</a>
									. You can also reach out to Recerts’s editors or steering
									committee members individually if that feels more comfortable.
								</p>
								<p className="mt-2">
									Recerts is still establishing policies and procedures. As
									issues arise, Recerts will consult with the community and give
									consideration to the policies of journals the editorial team
									respects, the recommendations of the Committee on Publication
									Ethics, community norms, and the philosophy of the Open
									Science movement.
								</p>
							</InfoSection>

							<Separator className="mx-4 md:mx-8" />

							<InfoSection title="Growing Recerts's Team">
								<p>
									Recerts uses the following evaluation process for potential
									editors:
								</p>
								<ul>
									<li>
										Write an outstanding Recerts paper, demonstrating deep
										understanding of Recerts’s mission and the technical skills
										needed to evaluate others’ work.
									</li>
									<li>
										Interviews with existing editors discussing Recerts’s
										mission and the role of editors.
									</li>
								</ul>
								<p className="mt-2">
									Being a Recerts editor means taking on ownership and
									responsibility for the success of Recerts and for publication
									decisions within your subject matter portfolio. Recerts
									editors are volunteer positions with no compensation — except
									playing a critical role in advancing a new kind of scientific
									publishing.
								</p>
							</InfoSection>

							<Separator className="mx-4 md:mx-8" />

							<InfoSection title="Growing Recerts's Scope">
								<p>
									In the long‑run, the editorial team believes Recerts should be
									open to expanding to other disciplines, with new editors
									taking on different topic portfolios.
								</p>
								<p className="mt-2">
									In considering editors for new topics, Recerts has the same
									expectations it has for all editors with two modifications:
								</p>
								<ul>
									<li>
										Although Recerts does not normally review papers outside its
										existing topic portfolio, the editorial team will make an
										exception to review papers from potential editorial
										candidates. The existing editorial team evaluates exposition
										while soliciting a third party editor to help us evaluate
										scientific merit, following Recerts’s regular review
										process. Because this type of review is especially difficult
										and expensive, Recerts will only move forward if the
										submission plausibly appears to be a very strong article.
									</li>
									<li>
										A second editor who can share responsibility for the topics
										you are taking on. This can either be an existing editor
										expanding to another topic, or someone applying along with
										you. Having a second editor is important so that editors
										have someone to talk over difficult cases with, and so that
										there isn’t a single point of failure.
									</li>
								</ul>
							</InfoSection>

							<div className="mx-4 mt-4 flex items-center justify-end md:mx-8">
								<Button
									variant="outline"
									className="gap-2 px-6 py-2.5"
									onClick={() => setStep(2)}
								>
									Start submission <ArrowRight className="h-4 w-4" />
								</Button>
							</div>
						</CardContent>
					</Card>
				</>
			) : (
				<section className="flex flex-col gap-6">
					<div className="mx-4 flex items-center justify-between md:mx-8">
						<Button
							variant="ghost"
							className="gap-2 px-0 text-sm"
							onClick={() => setStep(1)}
						>
							<ArrowLeft className="h-4 w-4" /> Back
						</Button>
					</div>
					<div className="mx-4 md:mx-8">
						<HypercertForm />
					</div>
				</section>
			)}
		</main>
	);
}

export default SubmitPage;
