import type { Metadata } from "next";
import Image from "next/image";
import React from "react";

export const metadata: Metadata = {
	title: "About | Recerts — JDFR",
	description:
		"Learn about the Journal of Decentralized Funding Research (JDFR), its mission, and the people behind it.",
};

type Person = {
	name: string;
	affiliation?: string;
};

const editors: Person[] = [
	{ name: "Editor One", affiliation: "JDFR" },
	{ name: "Editor Two", affiliation: "JDFR" },
];

const steeringCommittee: Person[] = [
	{ name: "Member Alpha", affiliation: "Institute A" },
	{ name: "Member Beta", affiliation: "Institute B" },
	{ name: "Member Gamma", affiliation: "Institute C" },
	{ name: "Member Delta", affiliation: "Institute D" },
	{ name: "Member Epsilon", affiliation: "Institute E" },
	{ name: "Member Zeta", affiliation: "Institute F" },
];

function avatarFor(name: string): string {
	// Dicebear placeholder avatar (works with Next/Image remote config)
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
				className="h-12 w-12 rounded-full ring-1 ring-black/10"
			/>
			<div className="flex flex-col leading-tight">
				<span className="font-medium text-black">{name}</span>
				{affiliation ? (
					<span className="text-muted-foreground text-sm">{affiliation}</span>
				) : null}
			</div>
		</div>
	);
}

export default function AboutPage() {
	return (
		<main className="mx-auto w-full max-w-6xl px-6 py-10 md:py-14">
			<header className="mb-10 flex flex-col gap-2">
				<h1 className="text-balance text-center font-baskerville font-bold text-3xl text-black md:text-4xl">
					About Recerts
				</h1>
				<p className="mx-auto max-w-3xl text-center text-muted-foreground">
					The Recerts Journal of Decentralized Funding Research (JDFR) is a
					peer-reviewed venue for scholarship on collective funding mechanism
					design, incentive systems, and impact verification. We publish
					theoretical and empirical work that advances open, transparent, and
					decentralized approaches to allocating resources for public goods and
					scientific research.
				</p>
			</header>

			<section className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-16">
				<div className="md:col-span-1">
					<h2 className="font-baskerville font-bold text-black text-xl">
						Editors
					</h2>
					<div className="mt-4 divide-y">
						{editors.map((p) => (
							<PersonRow key={p.name} {...p} />
						))}
					</div>
				</div>

				<div className="md:col-span-2">
					<h2 className="font-baskerville font-bold text-black text-xl">
						Steering Committee
					</h2>
					<div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
						{steeringCommittee.map((p) => (
							<PersonRow key={p.name} {...p} />
						))}
					</div>
				</div>
			</section>
		</main>
	);
}
