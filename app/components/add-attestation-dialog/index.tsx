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

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEthersSigner } from "@/hooks/use-ethers-signer";
import { PlusCircle, Trash2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { z } from "zod";
import AttestationProgress from "./attestation-progress";
import Sidebar from "./sidebar";

const MAX_SOURCES = 5;

const attestationSchema = z.object({
	title: z
		.string()
		.min(1, "Title is required")
		.max(50, "Title must be less than 50 characters"),
	description: z
		.string()
		.min(1, "Description is required")
		.max(500, "Description must be less than 500 characters"),
	sourceURLs: z
		.array(z.string().url("Invalid URL format"))
		.min(1, "At least one source URL is required"),
	acceptTerms: z
		.boolean()
		.refine((val) => val === true, "You must accept the terms and conditions"),
});

type AttestationFormData = z.infer<typeof attestationSchema>;

const AddAttestationDialog = ({
	hypercertId,
	trigger,
}: {
	hypercertId: string;
	trigger: React.ReactNode;
}) => {
	const [formData, setFormData] = useState<AttestationFormData>({
		title: "",
		description: "",
		sourceURLs: [""],
		acceptTerms: false,
	});
	const [errors, setErrors] = useState<
		Partial<Record<keyof AttestationFormData, string>>
	>({});

	const [attestationProgressVisible, setAttestationProgressVisible] =
		useState(false);
	const signer = useEthersSigner();

	const handleContinue = () => {
		try {
			attestationSchema.parse(formData);
			setErrors({});
			console.log("calling 1");
			setAttestationProgressVisible(true);
		} catch (error) {
			if (error instanceof z.ZodError) {
				const newErrors: Record<string, string> = {};
				for (const err of error.errors) {
					const path = err.path[0] as string;
					newErrors[path] = err.message;
				}
				setErrors(newErrors);
			}
		}
	};

	const handleSourceURLChange = (index: number, value: string) => {
		const newSourceURLs = [...formData.sourceURLs];
		newSourceURLs[index] = value;
		setFormData({ ...formData, sourceURLs: newSourceURLs });
	};

	const handleAddSource = () => {
		if (formData.sourceURLs.length < MAX_SOURCES) {
			setFormData({
				...formData,
				sourceURLs: [...formData.sourceURLs, ""],
			});
		}
	};

	const handleRemoveSource = (index: number) => {
		if (formData.sourceURLs.length > 1) {
			const newSourceURLs = formData.sourceURLs.filter((_, i) => i !== index);
			setFormData({ ...formData, sourceURLs: newSourceURLs });
		}
	};

	return (
		<Dialog
			onOpenChange={(value) => {
				console.log("Dialog onOpenChange:", value);
				if (value) {
					setAttestationProgressVisible(false);
				}
			}}
		>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="font-sans" sidebarChildren={<Sidebar />}>
				<DialogHeader>
					<DialogTitle className="font-baskerville">
						Add Attestation
					</DialogTitle>
					<DialogDescription className="font-sans text-base">
						Add an attestation to the ecocert.
					</DialogDescription>
				</DialogHeader>
				{attestationProgressVisible ? (
					<AttestationProgress
						hypercertId={hypercertId}
						values={{
							title: formData.title,
							description: formData.description,
							sourceURLs: formData.sourceURLs,
						}}
						visible={attestationProgressVisible}
						setVisible={setAttestationProgressVisible}
						signer={signer}
					/>
				) : (
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label className="font-bold">Title</Label>
							<Input
								value={formData.title}
								onChange={(e) =>
									setFormData({ ...formData, title: e.target.value })
								}
								placeholder="Impact Report"
							/>
							{errors.title && (
								<p className="text-red-500 text-sm">{errors.title}</p>
							)}
						</div>
						<div className="flex flex-col gap-2">
							<Label className="font-bold">Description</Label>
							<Textarea
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								placeholder="This attached PDF contains the impact report for the ecocert."
							/>
							{errors.description && (
								<p className="text-red-500 text-sm">{errors.description}</p>
							)}
						</div>
						<div className="flex flex-col gap-2">
							<Label className="font-bold">Sources</Label>
							{formData.sourceURLs.map((source, index) => {
								const key = `source-url-${index}`;
								return (
									<div key={key} className="flex flex-col gap-2">
										<div className="flex flex-row gap-2">
											<Input
												value={source}
												onChange={(e) =>
													handleSourceURLChange(index, e.target.value)
												}
												placeholder="https://example.com"
											/>
											<Button
												variant="outline"
												size={"sm"}
												onClick={() => handleRemoveSource(index)}
												disabled={formData.sourceURLs.length === 1}
											>
												<Trash2 size={16} />
											</Button>
										</div>
										{errors.sourceURLs &&
											index === formData.sourceURLs.length - 1 && (
												<p className="text-red-500 text-sm">
													{errors.sourceURLs}
												</p>
											)}
									</div>
								);
							})}
							<div className="flex w-full items-center justify-center">
								<Button
									variant="outline"
									type="button"
									className="gap-2 rounded-full"
									onClick={handleAddSource}
									size={"sm"}
									disabled={formData.sourceURLs.length >= MAX_SOURCES}
								>
									<PlusCircle size={16} /> Add
								</Button>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox
								id="terms"
								checked={formData.acceptTerms}
								onCheckedChange={(checked) =>
									setFormData({ ...formData, acceptTerms: checked as boolean })
								}
							/>
							<Label htmlFor="terms">I accept the terms and conditions</Label>
						</div>
						{errors.acceptTerms && (
							<p className="text-red-500 text-sm">{errors.acceptTerms}</p>
						)}
					</div>
				)}

				<DialogFooter>
					<DialogCancel>Close</DialogCancel>
					{!attestationProgressVisible && (
						<Button onClick={handleContinue} type="button">
							Continue
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AddAttestationDialog;
