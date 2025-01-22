import {
	ArrowUpRight,
	ArrowUpRightFromSquare,
	HeartHandshakeIcon,
	Settings2,
	Star,
} from "lucide-react";
import Link from "next/link";
import type { Address } from "viem";

import { cn, isNotNull } from "@/lib/utils";

import PageError from "@/app/components/shared/PageError";
import {
	type Fraction,
	type OwnedFractions,
	fetchFractionsByOwnerId,
} from "@/app/graphql-queries/user-fractions";
import {
	type UserHypercerts,
	fetchHypercertsByUserId,
} from "@/app/graphql-queries/user-hypercerts";
import { SideBar } from "@/app/profile/[address]/components/sidebar";
import { catchError } from "@/app/utils";
import { buttonVariants } from "@/components/ui/button";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Separator } from "@/components/ui/separator";
import type { ApiError } from "@/types/api";
import Content from "./components/content";
import FractionsGrid from "./components/fractions-grid";
import ProfileCard from "./components/profile-card";
import StatCard from "./components/stat-card";

export default async function ProfilePage({
	params: { address },
}: {
	params: { address: Address };
}) {
	// const DUMMY_ADDRESS = "0x223c656ed35bfb7a8e358140ca1e2077be090b2e";
	const [hypercertsError, userHypercerts] = await catchError<
		UserHypercerts,
		ApiError
	>(fetchHypercertsByUserId(address));
	if (hypercertsError) {
		return (
			<PageError
				title="We couldn't load the user data."
				body="Please try refreshing the page or check the URL."
			/>
		);
	}

	const [fractionsError, ownedFractions] = await catchError<
		OwnedFractions,
		ApiError
	>(fetchFractionsByOwnerId(address));
	if (fractionsError) {
		return (
			<PageError
				title="We couldn't load the user data."
				body="Please try refreshing the page or check the URL."
			/>
		);
	}

	const { hypercerts } = userHypercerts;
	const hypercertIdSet = new Set<string>();
	const validHypercerts = hypercerts.filter((hypercert) => {
		if (hypercert.hypercertId === undefined) return false;
		if (hypercertIdSet.has(hypercert.hypercertId)) return false;
		if (hypercert.name === undefined) return false;
		hypercertIdSet.add(hypercert.hypercertId);
		return true;
	});
	const validHypercertsCount = validHypercerts.length;

	const { fractions } = ownedFractions;
	const validFractions = fractions.filter((fraction) => {
		if (fraction.fractionId === undefined) return false;
		const noWork = Object.keys(fraction.work).every(
			(key) => fraction.work[key as keyof Fraction["work"]] === undefined,
		);
		if (fraction.contributors === undefined && noWork) return false;
		return true;
	});
	const validFractionsCount = validFractions.length;

	return (
		<MotionWrapper
			type="main"
			className="mx-auto flex max-w-6xl flex-col items-start gap-8 p-10 md:flex-row"
			initial={{ opacity: 0, filter: "blur(10px)" }}
			animate={{ opacity: 1, filter: "blur(0px)" }}
			transition={{ duration: 0.5 }}
		>
			<div className="flex w-full max-w-full flex-col gap-4 md:max-w-[300px]">
				<ProfileCard
					address={address}
					stats={{
						hypercertsCreated: validHypercertsCount,
						fractionsCreated: validFractionsCount,
					}}
				/>
				{validHypercertsCount > 0 && (
					<div className="relative w-full rounded-2xl bg-beige-muted p-4">
						<span className="flex items-center gap-2 font-baskerville text-xl">
							<Star size={20} className="text-beige-muted-foreground" />
							Creator
						</span>
						<Separator className="my-2 bg-beige-muted-foreground/40" />
						<span className="text-beige-muted-foreground text-sm">
							Created {validHypercertsCount} hypercerts so far...
						</span>
						<ul className="mt-2 flex w-full flex-col gap-1">
							{validHypercerts.map((hypercert) => {
								return (
									<Link
										href={`/hypercert/${hypercert.hypercertId}`}
										key={hypercert.hypercertId}
										target="_blank"
									>
										<li className="flex items-center justify-between gap-2 rounded-xl bg-black/10 p-2 px-4 hover:bg-black/15">
											<span className="max-w-[75%] truncate">
												{hypercert.name}
											</span>
											<ArrowUpRightFromSquare size={16} />
										</li>
									</Link>
								);
							})}
						</ul>
					</div>
				)}
			</div>
			<Content fractions={validFractions} />
		</MotionWrapper>
	);
}
