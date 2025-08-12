"use client";
import {
	Dialog,
	DialogCancel,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/modern-dialog-extended";

import type React from "react";
import { useEffect, useState } from "react";

import type { ApiError } from "@/app/utils/graphql";
import {
	type FullHypercert,
	fetchFullHypercertById,
} from "@/graphql/hypercerts/queries/hypercerts";
import ListingProgress from "./listing-progress";

import { Button } from "@/components/ui/button";
import { SUPPORTED_CHAINS } from "@/config/wagmi";
import { useHypercertExchangeClient } from "@/hooks/use-hypercert-exchange-client";
import {
	type ChainId,
	type Currency,
	type SUPPORTED_CURRENCIES,
	currenciesByNetwork,
} from "@hypercerts-org/marketplace-sdk";
import { useQuery } from "@tanstack/react-query";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import {
	ArrowRightLeft,
	CircleAlert,
	Loader2,
	RefreshCcw,
	RefreshCw,
} from "lucide-react";
import { useAccount } from "wagmi";
import PriceForm from "./price-form";
import Sidebar from "./sidebar";

const ErrorSection = ({
	title,
	description,
	cta,
}: {
	title: string;
	description: string;
	cta: React.ReactNode;
}) => {
	return (
		<div className="flex flex-col items-center justify-center rounded-lg bg-destructive/5 p-4">
			<CircleAlert size={36} className="text-destructive opacity-50" />
			<span className="font-bold font-sans text-lg">{title}</span>
			<p className="mt-1 text-balance text-center text-muted-foreground text-sm">
				{description}
			</p>
			{cta}
		</div>
	);
};

const getCurrenciesSupportedOnChainByHypercerts = (
	chainId: number | undefined,
): Array<Currency> => {
	if (!chainId) return [];
	const hypercertChainId = chainId as ChainId;
	if (hypercertChainId in currenciesByNetwork) {
		const symbolToCurrencyMap = currenciesByNetwork[hypercertChainId];
		return Object.values(symbolToCurrencyMap);
	}
	return [];
};

const CreateListingDialog = ({
	hypercertId,
	trigger,
}: {
	hypercertId: string;
	trigger: React.ReactNode;
}) => {
	const { client: hcExchangeClient } = useHypercertExchangeClient();

	const { chain: currentChain } = useAccount();
	const isCurrentChainSupported = SUPPORTED_CHAINS.find(
		(chain) => chain.id === currentChain?.id,
	);
	const { open } = useWeb3Modal();

	const {
		data: hypercert,
		isLoading: hypercertLoading,
		error: hypercertError,
		refetch: refetchHypercert,
	} = useQuery({
		queryKey: [`create-listing-dialog-hypercert-${hypercertId}`, hypercertId],
		queryFn: () => fetchFullHypercertById(hypercertId),
	});

	const [isProgressVisible, setIsProgressVisible] = useState(false);
	const [isListingComplete, setIsListingComplete] = useState(false);
	useEffect(() => {
		if (!isProgressVisible) {
			setIsListingComplete(false);
		}
	}, [isProgressVisible]);

	const [price, setPrice] = useState(1);
	const [priceValidityError, setPriceValidityError] = useState<string | null>(
		null,
	);

	const currencyOptions = getCurrenciesSupportedOnChainByHypercerts(
		currentChain?.id,
	);
	const usdgloCurrency = currencyOptions.find((c) => c.symbol === "USDGLO");
	const [selectedCurrency, setSelectedCurrency] = useState<
		Currency | undefined
	>(usdgloCurrency ? usdgloCurrency : currencyOptions[0]);

	const shouldDisplayForm =
		isCurrentChainSupported &&
		hypercert &&
		!hypercertError &&
		hypercert.orders.length === 0 &&
		!isProgressVisible;

	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent sidebarChildren={<Sidebar />}>
				<DialogHeader>
					<DialogTitle className="font-baskerville">
						List recert for sale
					</DialogTitle>
					<DialogDescription className="font-sans text-base">
						List your recert for sale on the marketplace and get donations.
					</DialogDescription>
				</DialogHeader>
				<div className="flex min-h-80 w-full flex-1 flex-col">
					{!isCurrentChainSupported ? (
						<ErrorSection
							title="This chain is not supported"
							description="Please switch to a supported chain to list your recert."
							cta={
								<Button
									onClick={() => open({ view: "Networks" })}
									size={"sm"}
									className="mt-3 gap-2"
								>
									<ArrowRightLeft size={16} />
									Switch Chain
								</Button>
							}
						/>
					) : hypercertError ? (
						<ErrorSection
							title="Unable to load information"
							description="We could not load information about this recert."
							cta={
								<Button
									onClick={() => refetchHypercert()}
									size={"sm"}
									className="mt-3 gap-2"
								>
									<RefreshCw size={16} />
									Retry
								</Button>
							}
						/>
					) : hypercert ? (
						hypercert.orders.length > 0 ? (
							<ErrorSection
								title="This recert is already listed"
								description="Please switch to a supported chain to list your recert."
								cta={null}
							/>
						) : !isProgressVisible ||
						  priceValidityError ||
						  !selectedCurrency ? (
							<PriceForm
								priceState={[price, setPrice]}
								priceValidityErrorState={[
									priceValidityError,
									setPriceValidityError,
								]}
								currencyOptions={currencyOptions}
								currencyState={[selectedCurrency, setSelectedCurrency]}
							/>
						) : (
							<ListingProgress
								values={{
									price,
									currency: selectedCurrency,
								}}
								hypercert={hypercert}
								visible={isProgressVisible}
								setVisible={setIsProgressVisible}
								hypercertExchangeClient={hcExchangeClient}
								setIsListingComplete={setIsListingComplete}
							/>
						)
					) : (
						<div className="flex h-40 flex-col items-center justify-center">
							<Loader2 className="animate-spin text-primary" size={28} />
							<span className="mt-2 text-balance text-center font-sans text-muted-foreground text-sm">
								Please wait while we gather information...
							</span>
						</div>
					)}
				</div>
				<DialogFooter>
					<DialogCancel
						onClick={() => {
							setIsProgressVisible(false);
						}}
					>
						{isListingComplete ? "Close" : "Cancel"}
					</DialogCancel>
					{shouldDisplayForm ? (
						<Button
							disabled={priceValidityError !== null}
							onClick={() => {
								setIsProgressVisible(true);
							}}
						>
							Next
						</Button>
					) : null}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CreateListingDialog;
