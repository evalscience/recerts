import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SUPPORTED_CHAINS } from "@/config/wagmi";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowDown,
	ArrowUp,
	Clock,
	LayoutGrid,
	List,
	Network,
	Search as SearchIcon,
	SortAsc,
	SortDesc,
} from "lucide-react";
import React from "react";

export type SortKey = "date" | "price" | "totalSales";
export type SortOption = {
	key: SortKey;
	order: "asc" | "desc";
};

const SORT_OPTIONS = [
	{ value: "date", label: "By date created" },
	{ value: "totalSales", label: "By funds raised" },
	{ value: "price", label: "By funding goal" },
];

const Search = ({
	inputState,
	sortOptionsState,
	viewState,
	chainFilterState,
}: {
	inputState: [string, React.Dispatch<React.SetStateAction<string>>];
	sortOptionsState: [
		SortOption,
		React.Dispatch<React.SetStateAction<SortOption>>,
	];
	viewState?: [
		"grid" | "table" | "graph",
		React.Dispatch<React.SetStateAction<"grid" | "table" | "graph">>,
	];
	chainFilterState?: [string, React.Dispatch<React.SetStateAction<string>>];
}) => {
	const [input, setInput] = inputState;
	const [sortOptions, setSortOptions] = sortOptionsState;
	const [view, setView] = viewState ?? ["grid", () => {}];
	const [selectedChainId, setSelectedChainId] = chainFilterState ?? [
		"all",
		() => {},
	];

	const normalizeChainLabel = (name: string) => {
		if (name === "Arbitrum") return "Arbitrum One";
		if (name === "Filecoin") return "Filecoin Mainnet";
		if (name === "Optimism") return "OP Mainnet";
		return name;
	};

	const CHAIN_OPTIONS = React.useMemo(() => {
		return [
			{ value: "all", label: "All chains" },
			...SUPPORTED_CHAINS.map((c) => ({
				value: String(c.id),
				label: normalizeChainLabel(String(c.name)),
			})),
		];
	}, [normalizeChainLabel]);

	return (
		<div className="mb-6 flex w-full scale-100 flex-col items-center justify-center px-4">
			<motion.div
				className="w-full max-w-3xl"
				initial={{ opacity: 0, filter: "blur(10px)", y: "100" }}
				animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
				transition={{
					duration: 0.5,
					delay: 0.2,
				}}
			>
				<div className="relative z-[10] w-full">
					<AnimatePresence>
						{input === "" && (
							<motion.span
								className="absolute top-1/2 left-4 text-muted-foreground"
								initial={{
									opacity: 0,
									filter: "blur(10px)",
									x: -20,
									y: "-50%",
								}}
								animate={{ opacity: 1, filter: "blur(0px)", x: 0, y: "-50%" }}
								exit={{ opacity: 0, filter: "blur(10px)", x: 20, y: "-50%" }}
								transition={{ duration: 0.3 }}
							>
								<SearchIcon className="text-lg" />
							</motion.span>
						)}
					</AnimatePresence>
					<Input
						type="text"
						placeholder="Search recerts by title or summary"
						className={cn(
							"h-12 w-full bg-background px-4 text-base shadow-lg sm:h-16 sm:text-lg",
							input === "" ? "pl-12" : "",
						)}
						value={input}
						onChange={(e) => setInput(e.target.value)}
					/>
				</div>
				<motion.div className="-mt-1 z-[5] w-full rounded-t-0 rounded-b-lg border border-border bg-background/80 p-2 pt-3">
					<div className="flex w-full flex-wrap items-center justify-between gap-2 px-2 py-1 font-sans sm:gap-3">
						<div className="flex flex-wrap items-center gap-2">
							<Combobox
								options={CHAIN_OPTIONS}
								value={selectedChainId}
								onChange={(val) => setSelectedChainId(val ?? "all")}
								placeholder="All chains"
								className="min-w-[140px] sm:min-w-[160px]"
							/>
							<Combobox
								options={SORT_OPTIONS}
								value={sortOptions.key}
								onChange={(val) => {
									setSortOptions({ ...sortOptions, key: val as SortKey });
								}}
								placeholder="Sort by"
								className="min-w-[140px] sm:min-w-[160px]"
							/>
							<div className="mt-2 flex flex-row overflow-hidden rounded-lg border border-border sm:mt-0">
								<Button
									variant={sortOptions.order === "asc" ? "secondary" : "ghost"}
									size="sm"
									onClick={() =>
										setSortOptions({ ...sortOptions, order: "asc" })
									}
									className={cn(
										"rounded-none border-b-2",
										sortOptions.order === "asc"
											? "border-primary"
											: "border-transparent",
									)}
									aria-pressed={sortOptions.order === "asc"}
								>
									<SortAsc className="h-4 w-4" />
								</Button>
								<Button
									variant={sortOptions.order === "desc" ? "secondary" : "ghost"}
									size="sm"
									onClick={() =>
										setSortOptions({ ...sortOptions, order: "desc" })
									}
									className={cn(
										"rounded-none border-b-2",
										sortOptions.order === "desc"
											? "border-primary"
											: "border-transparent",
									)}
									aria-pressed={sortOptions.order === "desc"}
								>
									<SortDesc className="h-4 w-4" />
								</Button>
							</div>
						</div>
						<div className="mt-2 flex w-full items-center justify-end gap-1 sm:mt-0 sm:w-auto sm:justify-normal">
							<Button
								variant={view === "grid" ? "secondary" : "ghost"}
								size="sm"
								onClick={() => setView("grid")}
								aria-pressed={view === "grid"}
								className="rounded-none"
							>
								<LayoutGrid className="h-4 w-4" />
							</Button>
							<Button
								variant={view === "table" ? "secondary" : "ghost"}
								size="sm"
								onClick={() => setView("table")}
								aria-pressed={view === "table"}
								className="rounded-none"
							>
								<List className="h-4 w-4" />
							</Button>
							<Button
								variant={view === "graph" ? "secondary" : "ghost"}
								size="sm"
								onClick={() => setView("graph")}
								aria-pressed={view === "graph"}
								className="rounded-none"
							>
								<Network className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default Search;
