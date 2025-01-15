import useStateCallback from "@/hooks/useStateCallback";
import { cn } from "@/lib/utils";
import type React from "react";
import { useEffect, useRef, useState } from "react";

const Slider = ({
	max,
	min,
	value: defaultValue,
	valueSuffix,
	display,
	onChange,
	disabled = false,
	className,
}: {
	min: number;
	max: number;
	value?: number;
	decimalPlaces?: number;
	display?: string;
	valueSuffix?: string;
	onChange?: (value: number) => void;
	disabled?: boolean;
	className?: string;
}) => {
	const diff = max - min;
	const [value, setValue] = useStateCallback(defaultValue ?? min);
	const setValueAndEmit = (
		valueOrCallback: number | ((prevState: number) => number),
	) => {
		let newValue: number;
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
	const valueToPercent = (value: number) => ((value - min) * 100) / diff;
	const percentToValue = (percent: number) => (percent / 100) * diff + min;

	const thisRef = useRef<HTMLDivElement | null>(null);
	const isDragging = useRef<boolean>(false); // Tracks whether the user is dragging
	const startX = useRef<number>(0); // Tracks where the drag started

	const handleMove = (displacementX: number) => {
		if (!isDragging.current || !thisRef.current) return;

		const outerDiv = thisRef.current;
		const outerDivRect = outerDiv.getBoundingClientRect();

		// Calculate the percentage change based on displacement relative to the outer div width
		const displacementPercentage = (displacementX / outerDivRect.width) * 100;

		// Update the percentage state based on displacement
		setValueAndEmit((prev) => {
			const prevPercent = valueToPercent(prev);
			const newPercent = prevPercent + displacementPercentage;
			return percentToValue(Math.min(100, Math.max(0, newPercent)));
		});
	};

	// Mouse and Touch Handlers
	const handleMouseMove = (e: MouseEvent) => {
		handleMove(e.clientX - startX.current);
		startX.current = e.clientX;
	};

	const handleTouchMove = (e: TouchEvent) => {
		handleMove(e.touches[0].clientX - startX.current);
		startX.current = e.touches[0].clientX;
		e.preventDefault(); // Prevent scrolling while interacting with the slider
	};

	const handleStart = (startXPos: number, isTouch: boolean) => {
		if (disabled) return;
		isDragging.current = true;
		startX.current = startXPos; // Store the initial position (clientX for mouse or touch)

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
		// Adjust the percentage with arrow keys
		if (e.key === "ArrowRight" || e.key === "ArrowUp") {
			setValueAndEmit((prev) => Math.min(max, prev + 1));
		} else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
			setValueAndEmit((prev) => Math.max(min, prev - 1));
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies(setValue, value): We don't want to update the value, when state setters or the value itself are updated
	useEffect(() => {
		if (!defaultValue) return;
		if (value !== defaultValue) {
			setValue(defaultValue);
		}
	}, [defaultValue]);

	return (
		<div
			className={cn(
				"relative h-8 w-full cursor-ew-resize select-none overflow-hidden rounded-lg border border-border aria-disabled:pointer-events-none aria-disabled:cursor-auto aria-disabled:opacity-50",
				className,
			)}
			role="slider"
			tabIndex={disabled ? -1 : 0}
			onKeyDown={handleKeyDown}
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuenow={value}
			ref={thisRef}
			onMouseDown={handleMouseDown}
			onTouchStart={handleTouchStart} // Add touchstart event
			aria-disabled={disabled}
		>
			<div
				className="h-full bg-primary"
				style={{
					width: `${valueToPercent(value)}%`,
				}}
			/>
			<span className="absolute inset-0 flex items-center justify-center text-sm">
				{display ? display : `${value.toFixed(0)}${valueSuffix ?? ""}`}
			</span>
		</div>
	);
};

export default Slider;
