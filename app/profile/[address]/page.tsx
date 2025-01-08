import request from "graphql-request";
import { HeartHandshakeIcon, Settings2, Star } from "lucide-react";
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
import type { ApiError } from "@/types/api";
import History from "./components/history";
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
				title="We couldn't load your data."
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
				title="We couldn't load your data."
				body="Please try refreshing the page or check the URL."
			/>
		);
	}

	const { hypercerts } = userHypercerts;
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
			className="mx-auto mb-6 grid max-w-6xl auto-rows-auto grid-cols-1 gap-4 p-4 pb-16 text-vd-blue-900 md:max-w-[1200px] md:grid-cols-3 md:px-6 xl:px-0 md:py-8 md:pb-0"
			initial={{ opacity: 0, filter: "blur(10px)" }}
			animate={{ opacity: 1, filter: "blur(0px)" }}
			transition={{ duration: 0.5 }}
		>
			<header className="my-4 flex justify-between md:col-span-3">
				<h1 className="font-semibold text-xl md:text-3xl">My Hypercerts</h1>
				<Link
					href={`/profile/${address}/settings`}
					className={cn(buttonVariants({ variant: "link" }))}
				>
					Settings
					<Settings2 className="mt-1 ml-2 h-4 w-4" />
				</Link>
			</header>

			{/* // TODO: Move to separate component */}
			<section className="flex flex-col gap-4 md:col-span-2">
				<div className="flex flex-col gap-4 md:flex-row">
					<StatCard
						title={"Hypercerts created"}
						count={hypercerts.length}
						icon={<Star size={80} />}
					/>
					<StatCard
						title={"Contributions"}
						count={validFractionsCount}
						icon={<HeartHandshakeIcon size={80} />}
					/>
				</div>
			</section>
			{/* <Summary
				totalAmount={totalAmount}
				reportCount={reportCount}
				categoryCounts={categoryCounts}
			/> */}
			<SideBar />
			{/* <History history={history} /> */}
			{/* // TODO: Fix type error */}
			<History
				hypercerts={hypercerts}
				fractions={validFractions as Fraction[]}
			/>
		</MotionWrapper>
	);
}
