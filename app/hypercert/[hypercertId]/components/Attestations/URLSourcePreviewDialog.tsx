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
import QuickTooltip from "@/components/ui/quicktooltip";
import useCopy from "@/hooks/use-copy";
import {
	ArrowUpRight,
	Check,
	ChevronLeft,
	ChevronRight,
	Globe,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useState } from "react";

const URLSourcePreviewDialog = ({
	triggers,
	urls,
}: {
	triggers: React.ReactNode[];
	urls: string[];
}) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	const handleNext = () => {
		setCurrentIndex((prev) => (prev + 1) % urls.length);
	};

	const handlePrevious = () => {
		setCurrentIndex((prev) => (prev - 1 + urls.length) % urls.length);
	};

	const { copy, isCopied } = useCopy();

	return (
		<Dialog>
			{triggers.map((trigger, index) => {
				const key = `trigger-${index}-${urls[index]}`;
				return (
					<DialogTrigger
						asChild
						key={key}
						onClick={() => setCurrentIndex(index)}
					>
						{trigger}
					</DialogTrigger>
				);
			})}
			<DialogContent className="font-sans">
				<DialogHeader>
					<DialogTitle>Attachment Preview</DialogTitle>
					<DialogDescription>Preview the attachments.</DialogDescription>
				</DialogHeader>
				<div className="flex items-center justify-between gap-4">
					<Button
						variant="outline"
						className="h-8 w-8 rounded-full p-0"
						onClick={handlePrevious}
						size={"sm"}
						disabled={currentIndex === 0}
					>
						<ChevronLeft size={16} />
					</Button>
					<div className="flex flex-1 flex-col items-center gap-2">
						<div className="h-[300px] overflow-hidden rounded-lg border border-border">
							<iframe
								src={urls[currentIndex]}
								className="h-full w-full"
								title="Attachment Preview"
							/>
						</div>
						<div className="flex items-center gap-4 rounded-md border border-border px-2 py-1 text-muted-foreground text-sm">
							<span>
								Viewing <b>{currentIndex + 1}</b> of <b>{urls.length}</b>
							</span>
							<div className="h-4 w-[2px] rounded-full bg-border" />
							<QuickTooltip content={"Click to copy"}>
								<button
									className="flex items-center gap-1"
									type="button"
									onClick={() => copy(urls[currentIndex])}
								>
									{isCopied ? (
										<Check size={14} className="text-primary" />
									) : (
										<Globe size={14} className="text-primary" />
									)}
									{isCopied ? (
										<span className="text-muted-foreground text-xs">
											Copied
										</span>
									) : (
										<span>
											{urls[currentIndex].slice(0, 20)}
											{urls[currentIndex].length > 20 && "..."}
										</span>
									)}
								</button>
							</QuickTooltip>
						</div>
					</div>
					<Button
						variant="outline"
						className="h-8 w-8 rounded-full p-0"
						onClick={handleNext}
						size={"sm"}
						disabled={currentIndex === urls.length - 1}
					>
						<ChevronRight size={16} />
					</Button>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline" size={"sm"}>
							Close
						</Button>
					</DialogClose>
					<Link href={urls[currentIndex]} target="_blank">
						<Button size={"sm"}>
							Open in new tab <ArrowUpRight size={16} />
						</Button>
					</Link>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default URLSourcePreviewDialog;
