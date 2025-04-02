"use client";

import AddAttestationDialog from "@/app/components/add-attestation-dialog";
import useFullHypercert from "@/app/contexts/full-hypercert";
import { Button } from "@/components/ui/button";
import UserChip from "@/components/user-chip";
import { EAS_CONFIGS } from "@/config/eas";
import { PlusCircle } from "lucide-react";
import React from "react";
import SectionWrapper from "../SectionWrapper";

const Attestations = () => {
	const hypercert = useFullHypercert();
	const attestations = hypercert.attestations;
	const validAttestations = attestations.filter((attestation) =>
		Boolean(
			EAS_CONFIGS.find((eas) => eas.schemaUID === attestation.schema_uid),
		),
	);

	console.log(attestations);

	return (
		<SectionWrapper title="Attestations">
			{validAttestations.length === 0 ? (
				<div className="flex flex-col items-center justify-center gap-2 rounded-md bg-muted p-4 font-sans">
					<p className="text-muted-foreground text-sm">No attestations found</p>
					<AddAttestationDialog
						trigger={
							<Button variant="outline" className="gap-2" size={"sm"}>
								<PlusCircle size={16} />
								Add Attestation
							</Button>
						}
						hypercertId={hypercert.hypercertId}
					/>
				</div>
			) : (
				validAttestations.map((attestation) => (
					<div
						className="flex flex-col rounded-lg bg-accent p-4"
						key={attestation.uid}
					>
						<b>{attestation.easSchema?.schema}</b>
						<UserChip
							address={attestation.attester as `0x${string}`}
							showCopyButton="never"
						/>
					</div>
				))
			)}
		</SectionWrapper>
	);
};

export default Attestations;
