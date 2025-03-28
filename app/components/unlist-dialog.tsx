"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useHypercertExchangeClient } from "@/hooks/use-hypercert-exchange-client";
import { useQuery } from "@tanstack/react-query";
import { CircleAlert, CircleCheck, Loader2 } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { fetchHypercertById } from "../graphql-queries/hypercerts";
import { catchError } from "../utils";

const StatusBox = ({
	variant,
	text,
	cta,
}: {
	variant: "loading" | "error" | "success";
	text: React.ReactNode;
	cta?: React.ReactNode;
}) => {
	return (
		<div className="flex h-20 w-full flex-col items-center justify-center gap-2 rounded-lg bg-muted p-2 text-muted-foreground">
			{variant === "loading" && <Loader2 className="animate-spin" />}
			{variant === "error" && <CircleAlert size={28} className="opacity-50" />}
			{variant === "success" && (
				<CircleCheck size={28} className="opacity-50" />
			)}
			<span>{text}</span>
			{cta}
		</div>
	);
};

const UnlistDialog = ({
	children,
	hypercertId,
}: {
	children: React.ReactNode;
	hypercertId: string;
}) => {
	const { address, isConnected } = useAccount();
	const { client: hcExchangeClient } = useHypercertExchangeClient();
	const {
		data: hypercert,
		isFetching: hypercertLoading,

		error: hypercertError,
		refetch: refetchHypercert,
	} = useQuery({
		queryKey: [`unlist-dialog-for-${hypercertId}`, hypercertId],
		queryFn: () => fetchHypercertById(hypercertId),
	});

	const [progressStatus, setProgressStatus] = useState<string>(
		"Preparing to unlist...",
	);
	const [isUnlisting, setIsUnlisting] = useState<boolean>(false);
	const [isUnlisted, setIsUnlisted] = useState<boolean>(false);
	const [unlistError, setUnlistError] = useState<string | null>(null);

	const unlistHypercert = useCallback(async () => {
		setProgressStatus("Preparing to unlist...");
		if (!hypercert)
			throw new Error("Error gathering information about the ecocert.");
		if (!hypercert.orderNonce)
			throw new Error("This ecocert is not yet listed on marketplace.");
		if (!isConnected || !address)
			throw new Error("Please connect your wallet to authorize this action.");
		if (address.toLowerCase() !== hypercert.creatorAddress.toLowerCase())
			throw new Error("You are not authorized for this action.");
		if (!hcExchangeClient)
			throw new Error("Something went wrong. Please try again...");

		setProgressStatus("Please sign the transaction when prompted...");
		const [transactionError, transaction] = await catchError(
			hcExchangeClient.cancelOrders([hypercert.orderNonce]).call(),
		);
		if (transactionError) throw new Error("The transaction was rejected.");
		if (!transaction)
			throw new Error("Something went wrong. Please try again...");

		setProgressStatus("Please wait while the transaction is confirmed...");
		const [receiptError, receipt] = await catchError(transaction.wait());
		if (receiptError)
			throw new Error("Something went wrong. Please try again...");
		if (!receipt || !receipt.status)
			throw new Error("The transaction failed. Please try again...");
	}, [hcExchangeClient, hypercert, isConnected, address]);

	const handleUnlist = async () => {
		if (isUnlisting) return;
		setIsUnlisting(true);
		setUnlistError(null);
		const [unlistError] = await catchError(unlistHypercert());
		if (unlistError) {
			setProgressStatus(unlistError.message);
			setUnlistError(unlistError.message);
		} else {
			setIsUnlisted(true);
		}
		setIsUnlisting(false);
	};

	const resetDialog = () => {
		refetchHypercert();
		setIsUnlisted(false);
		setUnlistError(null);
		setProgressStatus("Preparing to unlist...");
	};

	return (
		<Dialog
			onOpenChange={(open) => {
				if (open) resetDialog();
			}}
		>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="font-sans">
				<DialogHeader>
					<DialogTitle>Unlist Ecocert</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					Remove this Ecocert from the marketplace.
				</DialogDescription>
				{hypercertLoading ? (
					<StatusBox variant="loading" text="Loading Ecocert info..." />
				) : hypercertError ? (
					<StatusBox
						variant="error"
						text="Unable to get ecocert info... Please retry."
						cta={
							<Button variant="outline" onClick={() => refetchHypercert()}>
								Retry
							</Button>
						}
					/>
				) : hypercert ? (
					!isConnected ? (
						<StatusBox
							variant="error"
							text="Please connect your wallet to authorize this action."
						/>
					) : address?.toLowerCase() !==
					  hypercert.creatorAddress.toLowerCase() ? (
						<StatusBox
							variant="error"
							text="You are not authorized for this action."
						/>
					) : isUnlisted ? (
						<StatusBox
							variant="success"
							text="The Ecocert has been unlisted successfully."
						/>
					) : isUnlisting ? (
						<StatusBox variant="loading" text={progressStatus} />
					) : unlistError ? (
						<StatusBox variant="error" text={unlistError} />
					) : (
						<div className="flex flex-col gap-2">
							<span>
								After this action, the Ecocert,{" "}
								<b>{hypercert?.name ?? "Untitled"}</b> would no longer be able
								to get donations.
							</span>
							<span>This action is irreversible.</span>
						</div>
					)
				) : (
					<StatusBox
						variant="error"
						text="Something went wrong... Please retry."
					/>
				)}
				<DialogFooter>
					<DialogClose asChild>
						{isUnlisting && <Button variant="outline">Cancel</Button>}
					</DialogClose>
					{!hypercertLoading &&
						!hypercertError &&
						hypercert &&
						isConnected &&
						address?.toLowerCase() === hypercert.creatorAddress.toLowerCase() &&
						!isUnlisted && (
							<Button
								variant="destructive"
								onClick={handleUnlist}
								disabled={isUnlisting || isUnlisted}
							>
								Unlist
							</Button>
						)}
					{isUnlisted && (
						<DialogClose asChild>
							<Button>Close</Button>
						</DialogClose>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default UnlistDialog;
