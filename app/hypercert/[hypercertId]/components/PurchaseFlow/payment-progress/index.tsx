import ErrorModalBody from "@/components/modals/error-body";
import { useHypercertExchangeClient } from "@/components/providers/HypercertExchangeClient";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/ui/modal/context";
import {
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from "@/components/ui/modal/modal";
import { SUPPORTED_CHAINS } from "@/config/wagmi";
import type { FullHypercert } from "@/graphql/hypercerts/queries/hypercerts";
import useAccount from "@/hooks/use-account";
import { cn } from "@/lib/utils";
import type {
	Currency,
	HypercertExchangeClient,
} from "@hypercerts-org/marketplace-sdk";
import { useLogin } from "@privy-io/react-auth";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { motion } from "framer-motion";
import { CircleAlert, RefreshCcw } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import usePurchaseFlowStore from "../store";
import usePaymentProgressStore, { PAYMENT_PROGRESS_STEPS } from "./store";

const PaymentProgressModalWrapper = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return (
		<ModalContent dismissible={false} className="font-sans">
			<ModalHeader>
				<ModalTitle>Purchase Recert</ModalTitle>
				<ModalDescription>Track the progress of your purchase</ModalDescription>
			</ModalHeader>
			{children}
		</ModalContent>
	);
};

const Paymentprogress = () => {
	const { popModal, hide } = useModal();

	const hypercert = usePurchaseFlowStore((state) => state.hypercert);
	const selectedOrder = usePurchaseFlowStore((state) => state.selectedOrder);
	const currency = usePurchaseFlowStore((state) => state.currency);
	const currentAmountSelectionTab = usePurchaseFlowStore(
		(state) => state.amountSelectionCurrentTab,
	);
	const amountSelectedInUnits = usePurchaseFlowStore(
		(state) => state.amountSelectedInUnits,
	);
	const hypercertExchangeClient = useHypercertExchangeClient();
	const { login } = useLogin();
	const { address } = useAccount();

	if (
		hypercert === null ||
		selectedOrder === null ||
		currency === null ||
		amountSelectedInUnits[currentAmountSelectionTab] === null
	) {
		return (
			<PaymentProgressModalWrapper>
				<ErrorModalBody ctaAction={() => popModal()} ctaText="Go back" />
				<ModalFooter>
					<Button variant={"secondary"} onClick={() => hide()}>
						Cancel
					</Button>
				</ModalFooter>
			</PaymentProgressModalWrapper>
		);
	}

	if (hypercertExchangeClient === undefined || address === undefined) {
		return (
			<PaymentProgressModalWrapper>
				<ErrorModalBody
					errorMessage="Wallet not connected"
					errorDescription="Please connect your wallet to continue"
					ctaAction={() => login()}
					ctaText="Connect Wallet"
				/>
			</PaymentProgressModalWrapper>
		);
	}

	return (
		<PaymentProgressModalWrapper>
			<PaymentProgressBody
				hypercert={hypercert}
				selectedOrder={selectedOrder}
				userAddress={address}
				unitsToPurchase={amountSelectedInUnits[currentAmountSelectionTab]}
				hypercertExchangeClient={hypercertExchangeClient}
			/>
		</PaymentProgressModalWrapper>
	);
};

const PaymentProgressBody = ({
	hypercert,
	selectedOrder,
	userAddress,
	unitsToPurchase,
	hypercertExchangeClient,
}: {
	hypercert: FullHypercert;
	selectedOrder: FullHypercert["orders"][number];
	userAddress: string;
	unitsToPurchase: bigint;
	hypercertExchangeClient: HypercertExchangeClient;
}) => {
	const { status, errorState, currentStepIndex, start, reset } =
		usePaymentProgressStore();

	const { hide, popModal, clear } = useModal();

	const handleStart = useCallback(() => {
		// Use the wallet's current chain id for tipping
		const chainId = hypercertExchangeClient.chainId ?? undefined;
		start(
			hypercertExchangeClient,
			hypercert.hypercertId,
			selectedOrder.id,
			userAddress,
			unitsToPurchase,
			chainId as number,
		);
	}, [
		start,
		hypercertExchangeClient,
		hypercert.hypercertId,
		selectedOrder.id,
		userAddress,
		unitsToPurchase,
	]);

	const handleBack = useCallback(() => {
		if (status === "success") {
			reset();
		}
		popModal();
	}, [status, reset, popModal]);

	useEffect(() => {
		if (currentStepIndex !== 0 || status !== "pending") return;
		handleStart();
	}, [currentStepIndex, status, handleStart]);

	return (
		<>
			<div className="flex items-center">
				<motion.div
					className={cn("flex aspect-square items-center justify-center")}
					animate={{
						width: currentStepIndex === 0 ? "4rem" : "0rem",
						filter: "blur(4px) saturate(0)",
						opacity: 0.5,
						scale: 0.5,
					}}
					transition={{
						duration: 0.5,
						ease: "easeInOut",
					}}
				/>

				{PAYMENT_PROGRESS_STEPS.map((step, index) => {
					const stepDiff = Math.abs(index - currentStepIndex);

					return (
						<motion.div
							className={cn(
								"flex aspect-square items-center justify-center",
								stepDiff === 0 && "flex-1",
							)}
							animate={{
								width: stepDiff <= 1 ? "4rem" : "0rem",
								filter:
									stepDiff === 0
										? "blur(0px) saturate(1)"
										: "blur(4px) saturate(0)",
								opacity: stepDiff === 0 ? 1 : stepDiff === 1 ? 0.5 : 0,
								scale: stepDiff === 0 ? 1.2 : stepDiff === 1 ? 0.5 : 0,
							}}
							transition={{
								duration: 0.5,
								ease: "easeInOut",
							}}
							key={step.index}
						>
							{index === currentStepIndex && (
								<div
									className={cn(
										"absolute inset-10 rounded-full blur-xl",
										status === "error"
											? "bg-red-500/50"
											: "animate-pulse bg-green-500/50",
									)}
								/>
							)}
							{status === "error" ? (
								<CircleAlert className="z-10 size-16 text-red-500" />
							) : (
								<step.Icon className={cn("z-10 size-16 text-green-500")} />
							)}
						</motion.div>
					);
				})}
				<motion.div
					className={cn("flex aspect-square items-center justify-center")}
					animate={{
						width:
							currentStepIndex === PAYMENT_PROGRESS_STEPS.length - 1
								? "4rem"
								: "0rem",
						filter: "blur(4px) saturate(0)",
						opacity: 0.5,
						scale: 0.5,
					}}
					transition={{
						duration: 0.5,
						ease: "easeInOut",
					}}
				/>
			</div>
			{status === "error" ? (
				<div className="flex flex-col items-center">
					<span className="text-balance text-center font-bold text-destructive text-lg">
						{errorState?.title}
					</span>
					<span className="text-balance text-center text-muted-foreground">
						{errorState?.description}
					</span>
					<Button
						size={"sm"}
						variant={"outline"}
						className="mt-2 gap-2"
						onClick={handleStart}
					>
						<RefreshCcw className="size-4" /> Retry
					</Button>
				</div>
			) : (
				<div className="flex flex-col items-center">
					<span className="text-balance text-center font-bold text-lg text-primary">
						{PAYMENT_PROGRESS_STEPS[currentStepIndex].title}
					</span>
					<span className="text-balance text-center text-muted-foreground">
						{(() => {
							const step = PAYMENT_PROGRESS_STEPS[currentStepIndex];
							if (
								step.index === 6 &&
								hypercertExchangeClient &&
								typeof hypercertExchangeClient.chainId === "number"
							) {
								const nativeSymbol =
									SUPPORTED_CHAINS.find(
										(c) => c.id === hypercertExchangeClient.chainId,
									)?.nativeCurrency.symbol ??
									SUPPORTED_CHAINS[0].nativeCurrency.symbol;
								return step.description.replace("(native token)", nativeSymbol);
							}
							return step.description;
						})()}
					</span>
				</div>
			)}
			<ModalFooter>
				{status !== "pending" && (
					<Button variant={"secondary"} onClick={() => handleBack()}>
						Go Back
					</Button>
				)}
				<Button
					variant={"secondary"}
					onClick={() => {
						hide();
						if (status === "success") {
							clear();
						}
					}}
				>
					{status === "pending" ? "Continue in background" : "Close"}
				</Button>
			</ModalFooter>
		</>
	);
};

export default Paymentprogress;
