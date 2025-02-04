import useStateCallback from "@/hooks/useStateCallback";
import { cn } from "@/lib/utils";
import type React from "react";
import { useEffect, useRef } from "react";

// This multiplier is used to maintain precision during percentage calculations
const PRECISION_MULTIPLIER = 10n ** 30n;

const BigintSlider = ({
	max,
	min,
	value: defaultValue,
	valueSuffix,
	display,
	onChange,
	disabled = false,
	className,
}: {
	min: bigint;
	max: bigint;
	value?: bigint;
	display?: string;
	valueSuffix?: string;
	onChange?: (value: bigint) => void;
	disabled?: boolean;
	className?: string;
}) => {
	const diff = max - min;
	const [value, setValue] = useStateCallback(defaultValue ?? min);

	// Convert between percentage (0-100) and BigInt value
	const valueToPercent = (value: bigint): number => {
		// Use much higher precision for the calculation
		const percentage = ((value - min) * 100n * PRECISION_MULTIPLIER) / diff;
		return Number(percentage) / Number(PRECISION_MULTIPLIER);
	};

	const percentToValue = (percent: number): bigint => {
		// Convert percent to BigInt calculation with high precision
		const percentBig = BigInt(
			Math.round(percent * Number(PRECISION_MULTIPLIER)),
		);
		const value = (diff * percentBig) / (100n * PRECISION_MULTIPLIER) + min;
		return value;
	};

	const setValueAndEmit = (
		valueOrCallback: bigint | ((prevState: bigint) => bigint),
	) => {
		let newValue: bigint;
		setValue(
			(prev) => {
				if (typeof valueOrCallback === "function") {
					newValue = valueOrCallback(prev);
				} else {
					newValue = valueOrCallback;
				}
				return newValue;
			},
			(value) => {
				onChange?.(value);
			},
		);
	};

	const thisRef = useRef<HTMLDivElement | null>(null);
	const isDragging = useRef<boolean>(false);
	const startX = useRef<number>(0);

	const handleMove = (displacementX: number) => {
		if (!isDragging.current || !thisRef.current) return;

		const outerDiv = thisRef.current;
		const outerDivRect = outerDiv.getBoundingClientRect();

		const displacementPercentage = (displacementX / outerDivRect.width) * 100;

		setValueAndEmit((prev) => {
			const prevPercent = valueToPercent(prev);
			const newPercent = prevPercent + displacementPercentage;
			const clampedPercent = Math.min(100, Math.max(0, newPercent));
			return percentToValue(clampedPercent);
		});
	};

	const handleMouseMove = (e: MouseEvent) => {
		handleMove(e.clientX - startX.current);
		startX.current = e.clientX;
	};

	const handleTouchMove = (e: TouchEvent) => {
		handleMove(e.touches[0].clientX - startX.current);
		startX.current = e.touches[0].clientX;
		e.preventDefault();
	};

	const handleStart = (startXPos: number, isTouch: boolean) => {
		if (disabled) return;
		isDragging.current = true;
		startX.current = startXPos;

		if (isTouch) {
			document.addEventListener("touchmove", handleTouchMove);
			document.addEventListener("touchend", handleEnd);
		} else {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleEnd);
		}
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		handleStart(e.clientX, false);
	};

	const handleTouchStart = (e: React.TouchEvent) => {
		handleStart(e.touches[0].clientX, true);
	};

	const handleEnd = () => {
		isDragging.current = false;
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleEnd);
		document.removeEventListener("touchmove", handleTouchMove);
		document.removeEventListener("touchend", handleEnd);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (disabled) return;
		// Calculate step size based on the range
		const step = diff / 100n; // Using 1% of range as step
		if (e.key === "ArrowRight" || e.key === "ArrowUp") {
			setValueAndEmit((prev) => (prev + step > max ? max : prev + step));
		} else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
			setValueAndEmit((prev) => (prev - step < min ? min : prev - step));
		}
	};

	useEffect(() => {
		if (!defaultValue) return;
		if (value !== defaultValue) {
			setValue(defaultValue);
		}
	}, [defaultValue, setValue, value]);

	const formatDisplayValue = (value: bigint): string => {
		if (value >= 10000000000000000000n) {
			// For very large numbers, use scientific notation
			const exp = value.toString().length - 1;
			const base = Number(value / 10n ** BigInt(exp));
			return `${base.toFixed(2)}e${exp}`;
		}
		return value.toString();
	};

	return (
		<div
			className={cn(
				"relative h-8 w-full cursor-ew-resize select-none overflow-hidden rounded-lg border border-border aria-disabled:pointer-events-none aria-disabled:cursor-auto aria-disabled:opacity-50",
				className,
			)}
			role="slider"
			tabIndex={disabled ? -1 : 0}
			onKeyDown={handleKeyDown}
			aria-valuemin={Number(min)}
			aria-valuemax={Number(max)}
			aria-valuenow={Number(value)}
			ref={thisRef}
			onMouseDown={handleMouseDown}
			onTouchStart={handleTouchStart}
			aria-disabled={disabled}
		>
			<div
				className="h-full bg-primary"
				style={{
					width: `${valueToPercent(value)}%`,
				}}
			/>
			<span className="absolute inset-0 flex items-center justify-center text-sm">
				{display ? display : `${formatDisplayValue(value)}${valueSuffix ?? ""}`}
			</span>
		</div>
	);
};

export default BigintSlider;
