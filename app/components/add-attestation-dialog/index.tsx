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
import autoAnimate from "@formkit/auto-animate";
import { Edit, Globe, Info, Pen, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useEffect, useRef, useState } from "react";
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
		.array(
			z.tuple([z.string().url("Invalid URL format"), z.string().optional()]),
		)
		.min(1, "At least one source URL is required"),
	acceptTerms: z
		.boolean()
		.refine((val) => val === true, "You must accept the terms and conditions"),
});

type AttestationFormData = z.infer<typeof attestationSchema>;

type SourceURL = [string, string | undefined];

interface AttestationProgressValues {
	title: string;
	description: string;
	sourceURLs: SourceURL[];
}

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
		sourceURLs: [["", undefined]],
		acceptTerms: false,
	});
	const [selectedSourceInputIndex, setSelectedSourceInputIndex] =
		useState<number>(0);
	const sourcesContainerRef = useRef<HTMLDivElement>(null);
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

	const handleSourceURLChange = (
		index: number,
		value: string,
		description: string | undefined,
	) => {
		const newSourceURLs = [...formData.sourceURLs] as SourceURL[];
		newSourceURLs[index] = [value, description];
		setFormData({ ...formData, sourceURLs: newSourceURLs });
	};

	const handleAddSource = () => {
		if (formData.sourceURLs.length < MAX_SOURCES) {
			setSelectedSourceInputIndex(formData.sourceURLs.length);
			setFormData({
				...formData,
				sourceURLs: [...formData.sourceURLs, ["", undefined]],
			});
		}
	};

	const handleRemoveSource = (index: number) => {
		if (formData.sourceURLs.length > 1) {
			if (index === formData.sourceURLs.length - 1) {
				setSelectedSourceInputIndex(0);
			}
			const newSourceURLs = formData.sourceURLs.filter((_, i) => i !== index);
			setFormData({ ...formData, sourceURLs: newSourceURLs });
		}
	};

	useEffect(() => {
		if (sourcesContainerRef.current) {
			autoAnimate(sourcesContainerRef.current);
		}
	}, []);

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
						Add Proof of Impact
					</DialogTitle>
					<DialogDescription className="font-sans text-base">
						Add a proof of impact to the hypercert.
					</DialogDescription>
				</DialogHeader>
				{attestationProgressVisible ? (
					<AttestationProgress
						hypercertId={hypercertId}
						values={
							{
								title: formData.title,
								description: formData.description,
								sourceURLs: formData.sourceURLs,
							} as AttestationProgressValues
						}
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
						<div className="flex flex-col gap-2" ref={sourcesContainerRef}>
							<Label className="font-bold">Sources</Label>
							{formData.sourceURLs.map(([source, description], index) => {
								const key = `source-url-${index}`;
								const isSelected = index === selectedSourceInputIndex;
								if (isSelected) {
									return (
										<div key={key} className="flex flex-col gap-2">
											<div className="flex flex-row divide-x overflow-hidden rounded-md border border-border bg-background">
												<div className="flex flex-1 flex-col divide-y">
													<div className="flex items-center">
														<label
															htmlFor={`${key}-value`}
															className="flex items-center justify-center p-2 text-muted-foreground"
														>
															<Globe size={14} />
														</label>
														<input
															className="h-full flex-1 px-2 text-sm"
															id={`${key}-value`}
															type="text"
															value={source}
															onChange={(e) =>
																handleSourceURLChange(
																	index,
																	e.target.value,
																	description || undefined,
																)
															}
															placeholder="Enter URL here"
														/>
													</div>
													<div className="flex items-center">
														<label
															htmlFor={`${key}-description`}
															className="flex items-center justify-center p-2 text-muted-foreground"
														>
															<Info size={14} />
														</label>
														<input
															className="h-full flex-1 px-2 text-sm"
															id={`${key}-description`}
															type="text"
															value={description || ""}
															onChange={(e) =>
																handleSourceURLChange(
																	index,
																	source,
																	e.target.value as string | undefined,
																)
															}
															placeholder="Describe the source (Optional)"
														/>
													</div>
												</div>
												<button
													type="button"
													className="flex h-full items-center justify-center p-2 opacity-50 disabled:cursor-not-allowed disabled:opacity-50 hover:opacity-100 disabled:saturate-0"
													onClick={() => handleRemoveSource(index)}
													disabled={formData.sourceURLs.length === 1}
												>
													<Trash2 size={16} className="text-destructive" />
												</button>
											</div>
											{errors.sourceURLs &&
												index === formData.sourceURLs.length - 1 && (
													<p className="text-red-500 text-sm">
														{errors.sourceURLs}
													</p>
												)}
										</div>
									);
								}
								return (
									<div
										key={key}
										className="flex items-center gap-2 rounded-lg border border-border p-2"
									>
										<span className="text-primary">
											<Globe size={14} />
										</span>
										<div className="flex flex-1 flex-col">
											<span className="font-bold text-sm">
												{description ?? source ?? "Untitled"}
											</span>
											{description?.trim() && (
												<span className="text-muted-foreground text-xs">
													{source}
												</span>
											)}
										</div>
										<button
											className="flex h-6 w-6 items-center justify-center rounded-full border border-border p-0"
											onClick={() => setSelectedSourceInputIndex(index)}
											type="button"
										>
											<Edit size={12} />
										</button>
										<button
											className="flex h-6 w-6 items-center justify-center rounded-full border border-border p-0 opacity-50 disabled:cursor-not-allowed disabled:opacity-50 hover:opacity-100 disabled:saturate-0"
											onClick={() => handleRemoveSource(index)}
											disabled={formData.sourceURLs.length === 1}
											type="button"
										>
											<Trash2 size={12} className="text-destructive" />
										</button>
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
							<Label htmlFor="terms">
								I accept the{" "}
								<Link
									href="https://www.hypercerts.org/terms"
									target="_blank"
									className="underline"
								>
									terms and conditions
								</Link>
								.
							</Label>
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
