import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { Search as SearchIcon } from "lucide-react";
import type React from "react";

const Search = ({
	inputState,
}: {
	inputState: [string, React.Dispatch<React.SetStateAction<string>>];
}) => {
	const [input, setInput] = inputState;
	return (
		<div className="mb-4 flex w-full scale-100 items-center justify-center px-4">
			<motion.div
				className="relative w-full max-w-3xl"
				initial={{ opacity: 0, filter: "blur(10px)", y: "100" }}
				animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
				transition={{
					duration: 0.5,
					delay: 0.5,
				}}
			>
				<AnimatePresence>
					{input === "" && (
						<motion.span
							className="absolute top-1/2 left-4 text-muted-foreground"
							initial={{ opacity: 0, filter: "blur(10px)", x: -20, y: "-50%" }}
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
					placeholder="Search reports by title or summary"
					className={`h-16 w-full bg-background/50 px-4 text-lg shadow-lg${
						input === "" ? "pl-12" : ""
					}`}
					value={input}
					onChange={(e) => setInput(e.target.value)}
				/>
			</motion.div>
		</div>
	);
};

export default Search;
