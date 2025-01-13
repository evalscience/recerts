"use client";
import type {
	FullHypercert,
	FullHypercertOrders,
} from "@/app/graphql-queries/hypercerts";
import React from "react";

type Order = FullHypercertOrders[number];

const useOrderInfo = (
	hypercert: FullHypercert,
): {
	order: Order;
	totalSalePriceInUSD: number;
	pricePerUnitInUSD: number;
	unitsPerUSD: number;
} | null => {
	const { orders, unitsForSale, totalUnits } = hypercert;
	const firstOrder = orders?.[0];

	if (!firstOrder) {
		return null;
	}

	const { pricePerPercentInUSD } = firstOrder;

	const percentagePerUnit = 100 / Number(totalUnits);
	const pricePerUnitInUSD = percentagePerUnit * pricePerPercentInUSD;
	const totalSalePriceInUSD = pricePerUnitInUSD * Number(unitsForSale);
	const unitsPerUSD = 1 / pricePerUnitInUSD;

	return {
		order: firstOrder,
		totalSalePriceInUSD,
		pricePerUnitInUSD,
		unitsPerUSD,
	};
};

export default useOrderInfo;
