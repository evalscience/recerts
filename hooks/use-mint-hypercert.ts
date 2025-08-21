import { useHypercertClient } from "@/hooks/use-hypercerts-client";
import { useMutation } from "@tanstack/react-query";
import { usePublicClient, useWaitForTransactionReceipt } from "wagmi";

import { createAirtableRecordForHypercertId } from "@/lib/airtable";
import { constructHypercertIdFromReceipt } from "@/utils/constructHypercertIdFromReceipt";
import {
	type HypercertMetadata,
	TransferRestrictions,
} from "@hypercerts-org/sdk";
import { useEffect, useState } from "react";
import { type TransactionReceipt, parseEther } from "viem";
import type { WaitForTransactionReceiptData } from "wagmi/query";
import { useSendEmailAndUpdateGoogle } from "./use-send-email-and-update-google";

type Payload = {
	metaData: HypercertMetadata;
	contactInfo: string;
	amount: string;
};

export type HypercertMintReceiptData = {
	hypercertId: string;
	// biome-ignore lint/suspicious/noExplicitAny: any types need to be used here.
} & WaitForTransactionReceiptData<any, any>;

const useMintHypercert = () => {
	const [contactInfo, setContactInfo] = useState<string>("");
	const [metaData, setMetaData] = useState<HypercertMetadata | undefined>();
	const { client } = useHypercertClient();
	const publicClient = usePublicClient();

	if (!client) {
		throw new Error("Hypercert Client is not initialized");
	}

	if (!publicClient) {
		throw new Error("Public client is not initialized");
	}

	const {
		mutate: mintHypercert,
		data: mintData,
		status: mintStatus,
		isIdle: isMintIdle,
		isPending: isMintPending,
		isSuccess: isMintSuccess,
		isError: isMintError,
		error: mintError,
	} = useMutation({
		mutationFn: (payload: Payload) => {
			const { metaData, contactInfo, amount } = payload;
			console.log("contactInfo", contactInfo);
			console.log("amount", amount);
			setContactInfo(contactInfo);
			return client.mintClaim(
				metaData,
				100_000_000n,
				TransferRestrictions.AllowAll,
			);
		},
	});

	console.log("mintData", mintData);

	const {
		data: receiptData,
		isLoading: isReceiptLoading,
		isPending: isReceiptPending,
		isSuccess: isReceiptSuccess,
		isError: isReceiptError,
		error: receiptError,
	} = useWaitForTransactionReceipt({
		hash: mintData,
		query: {
			enabled: !!mintData,
			select: (data) => {
				const hypercertId = constructHypercertIdFromReceipt(
					data as TransactionReceipt,
					publicClient.chain.id,
				);
				return {
					...data,
					hypercertId,
				};
			},
			staleTime: Number.POSITIVE_INFINITY,
		},
	});

	// TODO: Update these values to better reflect the hook
	const {
		data: googleSheetsData,
		mutate: sendEmailAndUpdateGoogle,
		status: googleSheetsStatus,
		error: googleSheetsError,
	} = useSendEmailAndUpdateGoogle();

	useEffect(() => {
		if (receiptData?.hypercertId && contactInfo) {
			sendEmailAndUpdateGoogle({
				hypercertId: receiptData.hypercertId,
				contactInfo,
			});
			// Fire-and-forget: record in Airtable for review pipeline
			const md = (metaData ?? {}) as unknown as {
				contributors?: unknown;
				workScope?: unknown;
				external_url?: string;
				name?: string;
				description?: string;
			};
			const authors = Array.isArray(md.contributors)
				? (md.contributors as string[])
				: [];
			const topics = Array.isArray(md.workScope)
				? (md.workScope as string[])
				: [];

			createAirtableRecordForHypercertId(receiptData.hypercertId, {
				Title: md.name,
				Abstract: md.description,
				Authors: authors,
				Topics: topics,
				Link: md.external_url,
				"Article Type": undefined,
			}).catch(() => {
				// ignore errors; this should not block UX
			});
		}
	}, [
		receiptData?.hypercertId,
		contactInfo,
		sendEmailAndUpdateGoogle,
		metaData,
	]);

	return {
		mintHypercert,
		mintStatus,
		isMintIdle,
		isMintPending,
		isMintSuccess,
		isMintError,
		mintData,
		mintError,
		receiptData: receiptData as HypercertMintReceiptData | undefined,
		receiptError,
		isReceiptPending,
		isReceiptLoading,
		isReceiptSuccess,
		isReceiptError,
		googleSheetsData,
		googleSheetsStatus,
		googleSheetsError,
		metaData,
		setMetaData,
	};
};

export default useMintHypercert;
