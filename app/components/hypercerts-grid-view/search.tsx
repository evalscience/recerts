import { Search as SearchIcon } from "lucide-react";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";

const Search = ({
  inputState,
}: {
  inputState: [string, React.Dispatch<React.SetStateAction<string>>];
}) => {
  const [input, setInput] = inputState;
  return (
    <div className="w-full flex items-center justify-center px-4 mb-4 scale-100">
      <motion.div
        className="max-w-3xl w-full relative"
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
              className="absolute left-4 top-1/2 text-muted-foreground"
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
          className={`bg-background/50 shadow-lg h-16 w-full text-lg px-4 ${
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
