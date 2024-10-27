import Image from "next/image";

import noReportsImage from "@/assets/history-bg.svg";

import { ReportsView } from "@/components/reports/reports-view";
import { siteConfig } from "@/config/site";
import { FilterProvider } from "@/contexts/filter";
import type { Hypercert } from "@/types";
import { fetchHypercerts } from "@/utils/supabase/hypercerts";

export const fetchCache = "force-no-store";

export default async function ReportsPage() {
	const { data, error } = await fetchHypercerts();
	console.log("Hypercerts data:", data);
	console.log("Hypercerts error:", error);

	return (
		<main className="flex flex-col gap-4 pb-[64px] md:pb-0">
			<section className="flex flex-col items-center gap-4 p-4 md:p-8">
				<header className="relative flex h-[420px] w-full max-w-screen-xl flex-col justify-end gap-4 overflow-hidden rounded-3xl p-4 text-vd-beige-100 2xl:h-[520px] min-[2560px]:h-[720px] min-[2560px]:max-w-screen-2xl 2xl:p-16 md:p-8">
					<Image
						className="-z-10 bg-center object-cover filter"
						src={"/HeroCover.png"}
						alt="Hero Image"
						sizes="(min-width: 2560px) 1536px, (min-width: 1400px) 1280px, 93.7vw"
						fill
						priority
					/>
				</header>
				<h2 className="max-w-screen-md self-center py-6 text-left font-semibold text-2xl text-black 2xl:max-w-screen-lg 2xl:text-4xl">
					{siteConfig.description}
				</h2>
				{/* <VoicedeckStats
					numOfContributors={numOfContributors}
					reports={uniqueReports}
				/> */}
			</section>

			{data?.length ? (
				<FilterProvider>
					{/* TODO: Types return from API have a lot of nulls, need to figure out how to handle that */}
					<ReportsView hypercerts={data as Hypercert[]} />
				</FilterProvider>
			) : (
				<section className="flex w-full flex-col items-center gap-4 pt-6 pb-24 md:pb-6">
					<div className="relative h-20 w-full md:h-40">
						<Image fill src={noReportsImage} alt="circular pattern" />
					</div>
					<div className="text-center font-bold text-vd-beige-600 text-xl">
						<p>Sorry, something went wrong.</p>
						<p>Reports cannot be displayed right now.</p>
					</div>
				</section>
			)}
		</main>
	);
}
