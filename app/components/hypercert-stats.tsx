// import React, { Suspense } from "react";
// import { fetchTotalHypercertsSalesData } from "../graphql-queries/hypercerts-sales";
// import { catchError } from "../utils";

// const AnalyticsCard = ({ title, value }: { title: string; value: string }) => (
// 	<div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-slate-100 p-4">
// 		<h1 className="font-semibold text-xl">{title}</h1>
// 		<span className="font-semibold text-2xl">{value}</span>
// 	</div>
// );

// const TotalSalesCard = async ({
// 	totalSalesInUSDPromise,
// }: {
// 	totalSalesInUSDPromise: Promise<number[]>;
// }) => {
// 	const [error, totalSalesInUSD] = await catchError(totalSalesInUSDPromise);
// 	if (error) return <>Loading</>;
// 	return (
// 		<div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-slate-100 p-4">
// 			<h1 className="font-semibold text-xl">Total Sales</h1>
// 			<span className="font-semibold text-2xl">
// 				USD {totalSalesInUSD.reduce((a, b) => a + b, 0)}
// 			</span>
// 		</div>
// 	);
// };

// const HypercertAnalytics = async () => {
// 	const [error, response] = await catchError(fetchTotalHypercertsSalesData());
// 	if (error) return null;
// 	const { count, buyers, totalSalesInUSDPromise } = response;

// 	return (
// 		<div className="flex flex-wrap items-center justify-center">
// 			<AnalyticsCard
// 				title="Total Contributions"
// 				value={(count ?? 0).toString()}
// 			/>
// 			<Suspense
// 				fallback={<AnalyticsCard title="Total Sales" value={"Loading..."} />}
// 			>
// 				<TotalSalesCard totalSalesInUSDPromise={totalSalesInUSDPromise} />
// 			</Suspense>
// 			<AnalyticsCard
// 				title="No. of Contributors"
// 				value={buyers.size.toString()}
// 			/>
// 		</div>
// 	);
// };

// export default HypercertAnalytics;
