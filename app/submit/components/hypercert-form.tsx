"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as turf from "@turf/turf";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowRight,
	CalendarIcon,
	Check,
	ChevronDown,
	Eye,
	EyeOff,
	FileText,
	Info,
	Settings,
	Share2,
	Sparkles,
	Trash2,
	TriangleAlert,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn, isValidEthereumAddress } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { Dialog } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MarkdownEditor from "@/components/ui/mdx-editor";
// BASE_URL import removed (no logo/banner defaults needed)
import useMintHypercert from "@/hooks/use-mint-hypercert";
import {
	MDXEditor,
	type MDXEditorMethods,
	type MDXEditorProps,
	headingsPlugin,
	listsPlugin,
	markdownShortcutPlugin,
	quotePlugin,
	thematicBreakPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { domToPng } from "modern-screenshot";
import { CollapsibleDeploymentInfo } from "./collapsible-deployment-info";
import { DeploymentInfoBox } from "./deployment-info-box";
import HypercertCard from "./hypercert-card";
import MintingProgressDialog from "./minting-progress-dialog";

const ARTICLE_TYPE_DESCRIPTIONS = {
	Research:
		"Recerts publishes novel research results of significant interest to the community.",
	Exposition:
		"Explains, synthesizes, and reviews existing research. Includes Reviews, Tutorials, Primers, and Perspectives.",
	Commentary:
		"Non‑technical essays on topics like public policy or meta‑discussion of science. We are especially interested in charity-free narratives for public goods funding.",
	"Datasets & Benchmarks":
		"Datasets and benchmarks that support research and evaluation.",
	Proposal:
		"Proposals are early stage research and project ideas that outline potential research directions or methodologies.",
} as const;

const HypercertMintSchema = z.object({
	articleType: z.enum(
		[
			"Research",
			"Exposition",
			"Commentary",
			"Datasets & Benchmarks",
			"Proposal",
		],
		{ errorMap: () => ({ message: "Please select an article type" }) },
	),
	title: z
		.string()
		.min(1, { message: "Hypercert Name is required" })
		.max(180, { message: "Hypercert Name must be less than 180 characters" }),
	description: z
		.string()
		.min(10, {
			message: "Description is required and must be at least 10 characters",
		})
		.max(10000, {
			message: "Description must be less than 10000 characters",
		}),
	styleVariant: z.enum(["style1", "style2", "style3"]).default("style2"),
	link: z.preprocess(
		(value) => (value === "" ? undefined : value),
		z.string().url().optional(),
	),
	affiliations: z.string().optional(),
	emails: z.string().optional(),
	tags: z
		.string()
		.refine((val) => val.split(",").every((tag) => tag.trim() !== ""), {
			message:
				"Tags must must not be empty, Multiple tags must be separated by commas",
		}),
	projectDates: z
		.tuple([z.date().optional(), z.date().optional()])
		.refine((data) => {
			return Boolean(data[0] || data[1]);
		}, "Work date range is required"),
	contributors: z.string(),
	acceptTerms: z.boolean(),
	confirmContributorsPermission: z.boolean(),
	geojson: z.string().optional(),
	geojsonFile: z.any().optional(),
	areaActivity: z
		.enum(["Restoration", "Conservation", "Landscape", "Community", "Science"])
		.optional(),
});

export type MintingFormValues = z.infer<typeof HypercertMintSchema>;

const HypercertForm = () => {
	const imageRef = useRef<HTMLDivElement | null>(null);
	const [badges, setBadges] = useState<string[]>([]);
	const [geoJSONFile, setGeoJSONFile] = useState<File | null>(null);
	const [geoJSONArea, setGeoJSONArea] = useState<number | null>(null);
	// logo removed for paper layout
	const [showCopied, setShowCopied] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);
	const [isMintingProgressDialogVisible, setIsMintingProgressDialogVisible] =
		useState(false);
	const [mintingFormValues, setMintingFormValues] =
		useState<MintingFormValues>();
	const [isMobileInfoExpanded, setIsMobileInfoExpanded] = useState(false);

	// Add refs for file inputs
	const geoJSONFileInputRef = useRef<HTMLInputElement>(null);

	const form = useForm<MintingFormValues>({
		resolver: zodResolver(HypercertMintSchema),
		defaultValues: {
			articleType: undefined as unknown as MintingFormValues["articleType"],
			title: "",
			description: "",
			styleVariant: "style2",
			link: "",
			tags: "",
			projectDates: [undefined, undefined],
			// contact removed
			acceptTerms: false,
			confirmContributorsPermission: false,
			geojson: "",
			geojsonFile: undefined,
			affiliations: "",
			emails: "",
			areaActivity: undefined,
		},
		mode: "onChange",
	});

	const tags = form.watch("tags") || "";
	const selectedArticleType = form.watch("articleType");
	const geojsonValue = form.watch("geojson");
	const areaActivity = form.getValues("areaActivity");

	// Memoize the initialization function
	const initializeFormFromUrl = useCallback(() => {
		if (typeof window === "undefined") return;

		const params = new URLSearchParams(window.location.search);
		const formFields: Array<keyof MintingFormValues> = [
			"articleType",
			"title",
			"description",
			"styleVariant",
			"link",
			"tags",
			"projectDates",
			"contributors",
			// contact removed
			"acceptTerms",
			"confirmContributorsPermission",
			"geojson",
			"areaActivity",
		];

		for (const key of formFields) {
			const value = params.get(key);
			if (!value) continue;

			try {
				switch (key) {
					case "projectDates": {
						const dates = value.split(",");
						if (dates.length === 2) {
							form.setValue(key, [
								dates[0] ? new Date(dates[0]) : undefined,
								dates[1] ? new Date(dates[1]) : undefined,
							]);
						}
						break;
					}
					case "styleVariant": {
						if (["style1", "style2", "style3"].includes(value)) {
							form.setValue(
								"styleVariant",
								value as MintingFormValues["styleVariant"],
							);
						}
						break;
					}
					case "articleType": {
						if (
							[
								"Research",
								"Exposition",
								"Commentary",
								"Datasets & Benchmarks",
								"Proposal",
							].includes(value)
						) {
							form.setValue(key, value as MintingFormValues["articleType"]);
						}
						break;
					}
					case "acceptTerms":
					case "confirmContributorsPermission": {
						form.setValue(key, value === "true");
						break;
					}
					case "areaActivity": {
						if (
							[
								"Restoration",
								"Conservation",
								"Landscape",
								"Community",
								"Science",
							].includes(value)
						) {
							form.setValue(key, value as MintingFormValues["areaActivity"]);
						}
						break;
					}
					default:
						form.setValue(key, value);
				}
			} catch (error) {
				console.error(`Error setting form value for ${key}:`, error);
			}
		}

		setIsInitialized(true);
	}, [form.setValue]);

	// Use the memoized function in useEffect
	useEffect(() => {
		initializeFormFromUrl();
	}, [initializeFormFromUrl]);

	// Watch ALL form fields
	const formValues = form.watch();

	// Update URL when form values change
	useEffect(() => {
		if (!isInitialized) return;

		const params = new URLSearchParams();

		// Only add non-empty values to URL
		for (const [key, value] of Object.entries(formValues)) {
			if (value === undefined || value === null || value === "") continue;

			// Skip logo fields
			// nothing to skip for logo anymore

			if (key === "projectDates" && Array.isArray(value)) {
				const dates = value.map((date) => date?.toISOString()).filter(Boolean);
				if (dates.length) {
					params.set(key, dates.join(","));
				}
			} else if (
				key === "acceptTerms" ||
				key === "confirmContributorsPermission"
			) {
				params.set(key, String(!!value));
			} else if (key === "geojson" && !geoJSONFile) {
				// Only set geojson URL if not using file input
				params.set(key, String(value));
			} else if (key !== "geojson" && key !== "geojsonFile") {
				params.set(key, String(value));
			}
		}

		const newUrl = `${window.location.pathname}${
			params.toString() ? `?${params.toString()}` : ""
		}`;
		window.history.replaceState({}, "", newUrl);
	}, [formValues, isInitialized, geoJSONFile]);

	useEffect(() => {
		const calculateArea = async () => {
			let geoJSONData = null;

			try {
				if (geojsonValue) {
					const response = await fetch(geojsonValue);
					if (!response.ok) throw new Error("Failed to fetch GeoJSON");
					geoJSONData = await response.json();
				} else if (geoJSONFile) {
					const text = await geoJSONFile.text();
					geoJSONData = JSON.parse(text);
				}

				if (geoJSONData) {
					const area = turf.area(geoJSONData);
					const hectares = Math.round(area / 10000);
					console.log("Calculated area:", area, "Hectares:", hectares);
					setGeoJSONArea(hectares);
				} else {
					setGeoJSONArea(null);
				}
			} catch (error) {
				console.error("Error calculating area:", error);
				setGeoJSONArea(null);
			}
		};

		calculateArea();
	}, [geoJSONFile, geojsonValue]);

	useEffect(() => {
		// Derive badges from required article type + optional topics
		const topicBadges = tags
			? tags
					.split(",")
					.map((tag) => tag.trim())
					.filter((tag) => tag !== "")
			: [];
		const combined = [
			...(selectedArticleType ? [selectedArticleType] : []),
			...topicBadges,
		];
		setBadges(combined);
	}, [tags, selectedArticleType]);

	const generateImage = async () => {
		if (imageRef.current === null) return;
		if (document && "fonts" in document) {
			try {
				// ensure fonts are loaded to avoid layout shifts during capture
				type DocumentWithFonts = Document & {
					fonts?: { ready?: Promise<unknown> };
				};
				const docWithFonts = document as DocumentWithFonts;
				if (docWithFonts.fonts?.ready) {
					await docWithFonts.fonts.ready;
				}
			} catch {}
		}
		// Increase pixel density and hint preferred font format to improve crispness
		// Use a transparent background so rounded corners blend with the page bg
		return await domToPng(imageRef.current, {
			scale: Math.max(2, Math.floor(window.devicePixelRatio || 2)),
			backgroundColor: "transparent",
			font: { preferredFormat: "woff2" },
		});
	};

	const getTracePreviewUrl = (
		geojsonData: {
			features?: Array<{ geometry: { coordinates: number[][] } }>;
			geometry?: { coordinates: number[][] };
		} | null,
	) => {
		try {
			if (!geojsonData) return null;

			// Extract coordinates from GeoJSON
			const coordinates =
				geojsonData.features?.[0]?.geometry?.coordinates ||
				geojsonData.geometry?.coordinates;

			if (!coordinates) return null;

			// Encode the coordinates for the URL
			const encodedPolygon = encodeURIComponent(JSON.stringify(coordinates));
			return `https://legacy.gainforest.app/?shapefile=${encodedPolygon}&showUI=false`;
		} catch (error) {
			console.error(
				"Something went wrong while generating geojson preview:",
				error,
			);
			return null;
		}
	};

	const copyCurrentUrl = useCallback(() => {
		const url = window.location.href;
		navigator.clipboard.writeText(url).then(() => {
			setShowCopied(true);
			setTimeout(() => setShowCopied(false), 2000); // Hide after 2 seconds
		});
	}, []);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setGeoJSONFile(file);
			form.setValue("geojsonFile", file);
			form.setValue("geojson", "");
		} else if (geoJSONFile && !file) {
			// User canceled file selection dialog
			clearGeoJSONFile();
		}
	};

	const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const url = e.target.value;
		form.setValue("geojson", url);
		setGeoJSONFile(null);
		form.setValue("geojsonFile", undefined);

		if (url?.startsWith("http")) {
			try {
				const response = await fetch(url);
				if (!response.ok) {
					form.setError("geojson", {
						type: "manual",
						message: "Unable to fetch GeoJSON from URL",
					});
					return;
				}

				const data = await response.json();
				if (!data.type || !(data.features || data.geometry)) {
					form.setError("geojson", {
						type: "manual",
						message: "Invalid GeoJSON format",
					});
					return;
				}

				form.clearErrors("geojson");
			} catch (error) {
				form.setError("geojson", {
					type: "manual",
					message: "Invalid URL or unable to parse GeoJSON",
				});
			}
		}
	};

	// Create object URLs for uploaded files
	// removed logo preview effect

	// removed banner preview handler

	// removed logo handlers

	// removed banner handlers

	// Update clear functions to reset the file input element
	// removed logo clear

	// removed banner clear

	const clearGeoJSONFile = () => {
		setGeoJSONFile(null);
		form.setValue("geojsonFile", undefined);

		// Reset the file input element
		if (geoJSONFileInputRef.current) {
			geoJSONFileInputRef.current.value = "";
		}
	};

	return (
		<>
			<MintingProgressDialog
				{...{
					mintingFormValues,
					generateImage,
					badges,
					visible: isMintingProgressDialogVisible,
					setVisible: setIsMintingProgressDialogVisible,
				}}
			/>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((values) => {
						setMintingFormValues(values);
						setIsMintingProgressDialogVisible(true);
					})}
				>
					<div className="mb-10 flex flex-col-reverse gap-6 md:mb-0 md:flex-row md:gap-4">
						<Card className="relative overflow-hidden rounded-3xl bg-white/50 py-4 shadow-none">
							<div className="-top-10 -right-10 absolute h-40 w-40 rounded-full bg-primary/30 blur-2xl" />
							<div className="-bottom-10 -left-10 absolute h-40 w-40 rounded-full bg-beige-muted-foreground/30 blur-2xl" />
							<CardContent className="flex scale-100 flex-col gap-6 p-0 px-4">
								<section className="flex flex-col gap-2">
									<h2 className="font-baskerville font-bold text-2xl">
										Paper Details
									</h2>
									<div className="flex flex-col gap-4 rounded-2xl bg-background p-4">
										<FormField
											control={form.control}
											name="articleType"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Article Type</FormLabel>
													<FormControl>
														<Select
															onValueChange={field.onChange}
															value={field.value}
														>
															<SelectTrigger className="bg-inherit">
																<SelectValue placeholder="Select an article type" />
															</SelectTrigger>
															<SelectContent className="bg-background">
																<SelectItem
																	value="Research"
																	className="hover:bg-accent"
																>
																	Research
																</SelectItem>
																<SelectItem
																	value="Exposition"
																	className="hover:bg-accent"
																>
																	Exposition
																</SelectItem>
																<SelectItem
																	value="Commentary"
																	className="hover:bg-accent"
																>
																	Commentary
																</SelectItem>
																<SelectItem
																	value="Datasets & Benchmarks"
																	className="hover:bg-accent"
																>
																	Datasets &amp; Benchmarks
																</SelectItem>
																<SelectItem
																	value="Proposal"
																	className="hover:bg-accent"
																>
																	Proposal
																</SelectItem>
															</SelectContent>
														</Select>
													</FormControl>
													<FormMessage />
													{field.value && (
														<div className="mt-2 rounded-md bg-muted/50 p-3">
															<p className="text-muted-foreground text-sm">
																{ARTICLE_TYPE_DESCRIPTIONS[field.value]}
															</p>
														</div>
													)}
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="styleVariant"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Preview Style</FormLabel>
													<FormControl>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
															value={field.value}
														>
															<SelectTrigger className="bg-inherit">
																<SelectValue placeholder="Choose a style" />
															</SelectTrigger>
															<SelectContent className="bg-background">
																<SelectItem
																	value="style1"
																	className="hover:bg-accent"
																>
																	Style 1 – Classic (no bars, abstract inline)
																</SelectItem>
																<SelectItem
																	value="style2"
																	className="hover:bg-accent"
																>
																	Style 2 – Paper (black bars, centered
																	abstract)
																</SelectItem>
																<SelectItem
																	value="style3"
																	className="hover:bg-accent"
																>
																	Style 3 – Recerts (two-column abstract)
																</SelectItem>
															</SelectContent>
														</Select>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Paper Title</FormLabel>
													<FormControl>
														<Input
															placeholder="Enter the paper title"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										{/* logo removed for paper layout */}
										{/* banner field removed */}
										<FormField
											control={form.control}
											name="description"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Abstract</FormLabel>
													<FormControl>
														<MarkdownEditor
															markdown={field.value}
															onChange={field.onChange}
															className="rounded-lg border border-border bg-inherit"
															placeholder="Write a concise abstract for the paper"
															editorRef={null}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										{/* affiliations and emails removed for cleaner card */}
										<FormField
											control={form.control}
											name="link"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Link to Paper</FormLabel>
													<FormControl>
														<Input
															placeholder="https://example.org/paper"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</section>
								<section className="flex flex-col gap-2">
									<h2 className="font-baskerville font-bold text-2xl">
										Additional Details
									</h2>

									<div className="flex flex-col gap-4 rounded-2xl bg-background p-4">
										{/* area activity not relevant for paper layout, keep if needed later */}

										<FormField
											control={form.control}
											name="tags"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Topics</FormLabel>
													<FormControl>
														<Textarea
															className="bg-inherit"
															placeholder="List topics separated by commas (e.g., Climate, Remote Sensing, Field Study)"
															{...field}
														/>
													</FormControl>
													<FormMessage />
													<div className="flex flex-wrap gap-0.5">
														{badges.map((tag) => (
															<Badge key={tag} variant="secondary">
																{tag}
															</Badge>
														))}
													</div>
												</FormItem>
											)}
										/>

										<div className="flex flex-col gap-2 md:flex-row">
											<FormField
												control={form.control}
												name="projectDates"
												render={({ field }) => (
													<FormItem className="flex w-full flex-col">
														<FormLabel>Dates</FormLabel>
														<Popover>
															<PopoverTrigger asChild>
																<FormControl>
																	<Button
																		id="date"
																		variant={"outline"}
																		className={cn(
																			"w-full justify-start text-left font-normal",
																			!field.value && "text-muted-foreground",
																		)}
																	>
																		<CalendarIcon className="mr-2 h-4 w-4" />
																		{field.value[0] && field.value[1] ? (
																			<>
																				{format(field.value[0], "LLL dd, y")} -{" "}
																				{format(field.value[1], "LLL dd, y")}
																			</>
																		) : (
																			<span>Pick a date range</span>
																		)}
																	</Button>
																</FormControl>
															</PopoverTrigger>
															<PopoverContent
																className="w-auto p-0"
																align="start"
															>
																<Calendar
																	className="h-[340px]"
																	initialFocus
																	mode="range"
																	defaultMonth={field.value?.[0]}
																	selected={{
																		from: field.value?.[0],
																		to: field.value?.[1],
																	}}
																	onSelect={(range) => {
																		field.onChange([range?.from, range?.to]);
																	}}
																	numberOfMonths={2}
																/>
															</PopoverContent>
														</Popover>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<FormField
											control={form.control}
											name="contributors"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Authors</FormLabel>
													<FormControl>
														<Textarea
															className="bg-inherit"
															placeholder="Add author names separated by commas"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* GeoJSON not required for paper layout; keep component around if needed later */}
									</div>
								</section>
								<section className="flex flex-col gap-2">
									<h2 className="font-baskerville font-bold text-2xl">
										Agreement
									</h2>
									<div className="flex flex-col gap-4 rounded-2xl bg-background p-4">
										<FormField
											control={form.control}
											name="confirmContributorsPermission"
											render={({ field }) => (
												<FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2">
													<FormControl>
														<Checkbox
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
													<div className="space-y-1 leading-none">
														<FormLabel>
															I confirm that all listed authors gave permission
															to include their work in this record.
														</FormLabel>
													</div>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="acceptTerms"
											render={({ field }) => (
												<FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2">
													<FormControl>
														<Checkbox
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
													<div className="space-y-1 leading-none">
														<FormLabel>
															I agree to the{" "}
															<a
																href="https://hypercerts.org/terms/"
																target="_blank"
																rel="noopener noreferrer"
																className="text-blue-600"
															>
																Terms & Conditions
															</a>
														</FormLabel>
													</div>
												</FormItem>
											)}
										/>
									</div>
								</section>
								<div className="flex items-center justify-center">
									<div className="relative mt-2 inline-flex flex-col items-center gap-2 self-start rounded-lg border border-orange-500/50 bg-orange-100/50 px-4 py-2 md:flex-row dark:bg-orange-950/50">
										<TriangleAlert
											className="mr-2 hidden shrink-0 text-orange-600 md:block dark:text-orange-300"
											size={16}
										/>
										<div className="-top-2 -right-2 absolute flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background md:hidden">
											<TriangleAlert
												className="text-orange-600 dark:text-orange-300"
												size={18}
											/>
										</div>
										<span className="text-balance text-center text-orange-800 text-sm dark:text-orange-200">
											All information will be publicly available and can not be
											changed afterwards.
										</span>
									</div>
								</div>
								<div className="flex w-full items-center justify-end gap-2">
									<Button
										type="button"
										onClick={copyCurrentUrl}
										className="relative gap-2"
										variant="outline"
										disabled={showCopied}
									>
										{showCopied ? (
											<>
												Copied! <Check size={16} className="text-green-500" />
											</>
										) : (
											<>
												<Share2 size={16} />
												Share Form
											</>
										)}
									</Button>
									<Button type="submit" className="gap-2">
										Submit <ArrowRight size={16} />
									</Button>
								</div>
							</CardContent>
						</Card>
						<div className="flex w-full flex-col justify-center md:sticky md:top-24 md:h-fit md:w-[336px]">
							<div className="rounded-3xl rounded-b-none bg-beige-muted p-8 md:block md:bg-transparent md:p-0">
								<div className="flex w-full items-center justify-center">
									<HypercertCard
										title={form.watch("title") || undefined}
										workStartDate={form.watch("projectDates.0")}
										workEndDate={form.watch("projectDates.1")}
										badges={badges}
										displayOnly={true}
										contributors={
											form
												.watch("contributors")
												?.split(",")
												.map((v) => v.trim())
												.filter(Boolean) || []
										}
										abstract={form.watch("description") || ""}
										styleVariant={
											(form.watch(
												"styleVariant",
											) as MintingFormValues["styleVariant"]) || "style2"
										}
										ref={imageRef}
									/>
								</div>
							</div>

							{/* Mobile Collapsible Info Box */}
							<CollapsibleDeploymentInfo
								isExpanded={isMobileInfoExpanded}
								onToggle={() => setIsMobileInfoExpanded(!isMobileInfoExpanded)}
								className="md:hidden"
							/>

							{/* Desktop Info Box */}
							<div className="hidden md:mt-6 md:block">
								<DeploymentInfoBox className="w-full" />
							</div>
						</div>
					</div>
				</form>
			</Form>
		</>
	);
};

export { HypercertForm };
