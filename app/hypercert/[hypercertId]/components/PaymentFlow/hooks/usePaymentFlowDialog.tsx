"use client";

import type {
	FullHypercert,
	FullHypercertWithOrder,
} from "@/app/graphql-queries/hypercerts";
import { Button } from "@/components/ui/button";
import type { ContractTransactionReceipt } from "ethers";
import { type Dispatch, type SetStateAction, useState } from "react";
import { useAccount } from "wagmi";
import AmountOptions from "../AmountOptions";
import Prerequisites from "../Prerequisites";
import TransactionProgress from "../TransactionProgress";
import useOrderInfo from "./useOrderInfo";

type PaymentFlowUIConfig = {
	title: string;
	description: string;
	content: React.ReactNode;
	nextButton?: React.ReactNode;
	setVariant?: Dispatch<
		SetStateAction<"amount-options" | "transaction-progress">
	>;
	transactionReceipt?: ContractTransactionReceipt;
};

const InvalidPaymentFlowUIConfig: PaymentFlowUIConfig = {
	title: "Unable to fund",
	description: "Something went wrong. Please try again.",
	content: (
		<span>
			An error occured, while funding this hypercert. Please try again.
		</span>
	),
};

const usePaymentFlowDialog = (
	hypercert: FullHypercert,
): PaymentFlowUIConfig => {
	const { isConnected, chainId: currentChainId } = useAccount();
	const orderInfo = useOrderInfo(hypercert);
	const { order, pricePerUnitInUSD, totalSalePriceInUSD } = orderInfo ?? {};
	const { chainId: supportedChainId } = order ?? {};
	const currentChainIdStr = currentChainId?.toString();

	const [variant, setVariant] = useState<
		"amount-options" | "transaction-progress"
	>("amount-options");
	const [amountInUSD, setAmountInUSD] = useState<number | undefined>(undefined);
	const [transactionReceipt, setTransactionReceipt] =
		useState<ContractTransactionReceipt | null>(null);

	if (
		!isConnected ||
		!supportedChainId ||
		!currentChainIdStr ||
		currentChainIdStr !== supportedChainId
	) {
		return {
			title: "Complete the prerequisites",
			description: "Complete all the prerequisites to support this hypercert.",
			content: (
				<Prerequisites
					{...{
						isConnected,
						currentChainId: currentChainIdStr,
						supportedChainId,
					}}
				/>
			),
		};
	}

	if (!order || !pricePerUnitInUSD || !totalSalePriceInUSD) {
		return InvalidPaymentFlowUIConfig;
	}

	if (variant === "amount-options") {
		return {
			title: "Choose an amount",
			description: "Choose your desired amount to fund this hypercert.",
			content: (
				<AmountOptions
					{...{
						hypercert: hypercert as FullHypercertWithOrder,
						amountInUSDState: [amountInUSD, setAmountInUSD],
						setVariant,
					}}
				/>
			),
			nextButton: (
				<Button
					disabled={
						amountInUSD === undefined ||
						amountInUSD < pricePerUnitInUSD ||
						amountInUSD > totalSalePriceInUSD
					}
					onClick={() => setVariant("transaction-progress")}
				>
					Continue
				</Button>
			),
		};
	}

	if (amountInUSD === undefined) {
		return InvalidPaymentFlowUIConfig;
	}

	if (variant === "transaction-progress") {
		return {
			title: "Transaction Status",
			description: "View the status of your transaction.",
			content: (
				<TransactionProgress
					{...{
						hypercert,
						amountInUSD,
						setVariant,
						transactionReceiptState: [
							transactionReceipt,
							setTransactionReceipt,
						],
					}}
				/>
			),
			setVariant,
			transactionReceipt: transactionReceipt ?? undefined,
		};
	}

	return InvalidPaymentFlowUIConfig;
};

export default usePaymentFlowDialog;
