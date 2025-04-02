import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Search as SearchIcon } from "lucide-react";
import type React from "react";

export type SortOption = {
	key: "date";
	order: "asc" | "desc";
};

const Search = ({
	inputState,
	sortOptionsState,
}: {
	inputState: [string, React.Dispatch<React.SetStateAction<string>>];
	sortOptionsState: [
		SortOption | null,
		React.Dispatch<React.SetStateAction<SortOption | null>>,
	];
}) => {
	const [input, setInput] = inputState;
	const [sortOptions, setSortOptions] = sortOptionsState;
	return (
		<div className="mb-4 flex w-full scale-100 flex-col items-center justify-center px-4">
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
						placeholder="Search ecocerts by title or summary"
						className={cn(
							"h-16 w-full bg-background px-4 text-lg shadow-lg",
							input === "" ? "pl-12" : "",
						)}
						value={input}
						onChange={(e) => setInput(e.target.value)}
					/>
				</div>
				<motion.div className="-mt-2 z-[5] w-full rounded-t-0 rounded-b-lg border border-border bg-background/80 p-1 pt-3">
					<div className="flex items-center gap-2 px-2 py-1 font-sans">
						<Label
							className="text-muted-foreground"
							htmlFor="latest-ecocerts-switch"
						>
							Order by latest ecocerts first
						</Label>
						<Switch
							className="scale-90"
							id="latest-ecocerts-switch"
							checked={Boolean(
								sortOptions &&
									sortOptions.key === "date" &&
									sortOptions.order === "desc",
							)}
							onCheckedChange={(checked) => {
								if (checked) {
									setSortOptions({ key: "date", order: "desc" });
								} else {
									setSortOptions(null);
								}
							}}
						/>
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default Search;
