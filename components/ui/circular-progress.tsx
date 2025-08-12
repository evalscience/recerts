import { cn } from "@/lib/utils";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

const CircularProgress = ({
	value,
	className,
	styles,
	text,
	textClassName,
}: {
	value: number;
	className?: string;
	styles?: React.CSSProperties;
	text?: string;
	textClassName?: string;
}) => {
	return (
		<div className="relative h-10 w-10">
			<CircularProgressbar
				className={cn("h-10 w-10", className)}
				styles={buildStyles({
					trailColor: "hsl(var(--muted))",
					pathColor: "hsl(var(--primary))",
					textColor: "hsl(var(--foreground))",
					textSize: "26px",
					...styles,
				})}
				value={value}
			/>
			{text !== undefined && (
				<div className="absolute inset-0 flex items-center justify-center">
					<span className={cn("font-medium text-[0.6rem]", textClassName)}>
						{text}
					</span>
				</div>
			)}
		</div>
	);
};

export default CircularProgress;
