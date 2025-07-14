import { DIVVI_DATA_SUFFIX } from "@/config/divvi";
import { GAINFOREST_TIP_ADDRESS, GAINFOREST_TIP_AMOUNT } from "@/config/tip";
import { tryCatch } from "@/lib/tryCatch";
import { submitReferral } from "@divvi/referral-sdk";
import type { HypercertExchangeClient } from "@hypercerts-org/marketplace-sdk";
import {
	BadgeDollarSign,
	CheckCircle,
	ChefHat,
	FileSignature,
	Flame,
	Hourglass,
	Loader2,
	type LucideProps,
} from "lucide-react";
import { createWalletClient, custom, formatEther } from "viem";
import { celo } from "viem/chains";
import { create } from "zustand";

type Step = {
	title: string;
	description: string;
	Icon: React.FC<LucideProps>;
	index: number;
};

export const PAYMENT_PROGRESS_STEPS: Step[] = [
	{
		title: "Initializing...",
		description: "Starting the payment process...",
		Icon: Flame,
		index: 0,
	},
	{
		title: "Preparing...",
		description: "Please wait while we gather some necessary information...",
		Icon: ChefHat,
		index: 1,
	},
	{
		title: "Approve spending cap...",
		description:
			"Please approve the spending cap for the transaction. This doesn't cost you anything.",
		Icon: FileSignature,
		index: 2,
	},
	{
		title: "Sign the transaction",
		description: "Waiting for you to sign the transaction...",
		Icon: BadgeDollarSign,
		index: 3,
	},
	{
		title: "Waiting for confirmation",
		description: "Please wait while the transaction is confirmed...",
		Icon: Hourglass,
		index: 4,
	},
	{
		title: "Pay the platform fee",
		description: `Please sign the platform fee transaction worth ${formatEther(
			GAINFOREST_TIP_AMOUNT,
		)} CELO...`,
		Icon: FileSignature,
		index: 5,
	},
	{
		title: "Order completed...",
		description: "Your order has been completed successfully...",
		Icon: CheckCircle,
		index: 6,
	},
];

type PaymentProgressState = {
	currentStepIndex: number;
	status: "pending" | "success" | "error";
	errorState: {
		title: string;
		description: string;
	} | null;
};

type PaymentProgressActions = {
	start: (
		hcExchangeClient: HypercertExchangeClient,
		hypercertId: string,
		orderId: string,
		address: string,
		unitsToBuy: bigint,
	) => Promise<void>;
};

const usePaymentProgressStore = create<
	PaymentProgressState & PaymentProgressActions
>((set) => {
	return {
		currentStepIndex: 0,
		status: "pending",
		errorState: null,
		start: async (
			hcExchangeClient: HypercertExchangeClient,
			hypercertId: string,
			orderId: string,
			address: string,
			unitsToBuy: bigint,
		) => {
			set({ status: "pending" });
			let errorTitle = "";
			let errorDescription = "";

			// =========== STEP 1
			set({ currentStepIndex: 1 });
			errorTitle = "Invalid Order";
			errorDescription = "The order seems to be invalid. Please try again.";
			console.log("Fetching orders...");
			const [orders, ordersFetchError] = await tryCatch(() =>
				hcExchangeClient.api.fetchOrdersByHypercertId({
					hypercertId,
				}),
			);
			console.log("Orders fetched:", orders);
			const order = orders?.data?.find((order) => order.id === orderId);
			if (ordersFetchError || !order) {
				console.log("Error fetching orders:", ordersFetchError);
				set({
					status: "error",
					errorState: { title: errorTitle, description: errorDescription },
				});
				return;
			}

			// =========== STEP 2
			console.log("Step2...");
			set({ currentStepIndex: 2 });
			errorTitle = "Approval not confirmed";
			errorDescription = "The spending cap could not be approved.";
			const totalPrice = unitsToBuy * BigInt(order.price);
			const [, approveTxError] = await tryCatch(() =>
				hcExchangeClient.approveErc20(
					order.currency as `0x${string}`,
					totalPrice,
				),
			);
			if (approveTxError) {
				set({
					status: "error",
					errorState: { title: errorTitle, description: errorDescription },
				});
				return;
			}

			// =========== STEP 3
			set({ currentStepIndex: 3 });
			errorTitle = "Transaction rejected";
			errorDescription = "The transaction was rejected.";
			const takerOrder = hcExchangeClient.createFractionalSaleTakerBid(
				order, // The order you want to buy retreived from the graphQL API
				address, // Recipient address of the taker (if none, it will use the sender)
				unitsToBuy, // Number of units to buy.
				order.price, // Price per unit, in wei. In this example, we will end up with a total price of 1000 wei.
			);
			const overrides =
				order.currency === "0x0000000000000000000000000000000000000000"
					? {
							value: totalPrice,
					  }
					: undefined;
			const [executeTx, executeTxError] = await tryCatch(() =>
				hcExchangeClient
					.executeOrder(
						order,
						takerOrder,
						order.signature,
						undefined,
						overrides,
					)
					.call(),
			);
			if (executeTxError) {
				set({
					status: "error",
					errorState: { title: errorTitle, description: errorDescription },
				});
				return;
			}

			// =========== STEP 4
			set({ currentStepIndex: 4 });
			errorTitle = "Transaction not confirmed";
			errorDescription = "The transaction could not be confirmed.";
			const [receipt, receiptError] = await tryCatch(() => executeTx.wait());
			if (receiptError || !receipt || receipt.status !== 1) {
				set({
					status: "error",
					errorState: { title: errorTitle, description: errorDescription },
				});
				return;
			}

			// =========== STEP 5
			set({ currentStepIndex: 5 });
			await tryCatch(async () => {
				const walletClient = createWalletClient({
					chain: celo,
					transport: custom(
						// biome-ignore lint/suspicious/noExplicitAny: window.ethereum has to be any
						"ethereum" in window ? (window.ethereum as any) : null,
					),
				});
				const [account] = await walletClient.getAddresses();
				const txhash = await walletClient.sendTransaction({
					account,
					to: GAINFOREST_TIP_ADDRESS,
					value: GAINFOREST_TIP_AMOUNT,
					data: `0x${DIVVI_DATA_SUFFIX}`,
				});
				// We don't wait for confirmation as per requirements
				submitReferral({
					txHash: txhash as `0x${string}`,
					chainId: celo.id,
				});
				return new Promise<boolean>((res) => res(true));
			});

			// =========== STEP 6
			set({ currentStepIndex: 6 });
			set({ status: "success" });
		},
	};
});

export default usePaymentProgressStore;
