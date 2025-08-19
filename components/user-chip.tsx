"use client";
import useCopy from "@/hooks/use-copy";
import { cn } from "@/lib/utils";
import { truncateEthereumAddress } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import Link from "next/link";
import React, {
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useEnsName } from "wagmi";
import EthAvatar from "./ui/eth-avatar";

const UserChip = ({
	address,
	avatarSize = 22,
	showAvatar = true,
	showCopyButton = "always",
	className,
	avatarAndLabelGap = 6,
	ellipsisLocation = "middle",
}: {
	address: `0x${string}`;
	className?: string;
	avatarSize?: number;
	showAvatar?: boolean;
	showCopyButton?: "always" | "hover" | "never";
	avatarAndLabelGap?: number;
	ellipsisLocation?: "end" | "middle";
}) => {
	const { copy, isCopied } = useCopy();
	const { data: ensName } = useEnsName({
		address,
		chainId: 1,
	});

	const formattedEnsName = useMemo(() => {
		if (!ensName) return undefined;
		const dotIndex = ensName.indexOf(".");
		const base = dotIndex >= 0 ? ensName.slice(0, dotIndex) : ensName;
		const normalized = base.replace(/[._-]+/g, " ").trim();
		const titleCased = normalized
			.split(/\s+/)
			.filter(Boolean)
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
			.join(" ");
		return titleCased;
	}, [ensName]);

	// Refs for measuring font size and input width
	const inputRef = useRef<HTMLInputElement>(null);
	const [middleEllipsis, setMiddleEllipsis] = useState<string>("");

	// Helper to compute middle ellipsis string
	const computeMiddleEllipsis = useCallback((value: string) => {
		if (!inputRef.current) return value;
		const input = inputRef.current;
		const style = window.getComputedStyle(input);
		const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		if (!ctx) return value;
		ctx.font = font;
		const inputWidth = input.offsetWidth;
		const fullWidth = ctx.measureText(value).width;

		if (fullWidth <= inputWidth) return value;

		const minChars = 4;
		let left = minChars + 2; // 0x + 4
		const right = minChars;
		let bestFit = value;
		let bestLeft = left;
		let bestRight = right;
		let foundFit = false;

		while (left + right < value.length) {
			const leftStr = value.slice(0, left);
			const rightStr = value.slice(-right);
			const testStr = `${leftStr}...${rightStr}`;
			const testWidth = ctx.measureText(testStr).width;
			if (testWidth <= inputWidth) {
				bestFit = testStr;
				bestLeft = left;
				bestRight = right;
				foundFit = true;
				left++; // try to show more left chars
			} else {
				break; // stop at the last fit
			}
		}
		// If only one char between, show the char, not ...
		if (left + right >= value.length - 1) return value;

		if (foundFit) {
			// Try to split visible chars as evenly as possible
			const totalVisible = bestLeft + bestRight;
			if (totalVisible > minChars * 2 + 2) {
				const splitLeft = Math.ceil(totalVisible / 2);
				const splitRight = Math.floor(totalVisible / 2);
				// Ensure we don't exceed string bounds
				if (splitLeft + splitRight < value.length) {
					const leftStr = value.slice(0, splitLeft);
					const rightStr = value.slice(-splitRight);
					const testStr = `${leftStr}...${rightStr}`;
					const testWidth = ctx.measureText(testStr).width;
					if (testWidth <= inputWidth) {
						return testStr;
					}
				}
			}
			return bestFit;
		}
		// If no best fit, fallback to end ellipsis
		return truncateEthereumAddress(value as `0x${string}`);
	}, []);

	// Title-case fallback for address (e.g., if using ENS-like words without ENS resolution)
	const prettify = useCallback((value: string) => {
		return value
			.split(/\s+/)
			.filter(Boolean)
			.map((w) =>
				w.length ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w,
			)
			.join(" ");
	}, []);

	// Stable updater for ellipsis recomputation
	const updateMiddleEllipsis = useCallback(() => {
		const raw = formattedEnsName ?? ensName ?? address;
		const value = typeof raw === "string" ? prettify(raw) : raw;
		const computed = computeMiddleEllipsis(value);
		setMiddleEllipsis(computed);
	}, [formattedEnsName, ensName, address, prettify, computeMiddleEllipsis]);

	// Effect to update ellipsis on resize or value change
	useLayoutEffect(() => {
		if (ellipsisLocation !== "middle") return;
		updateMiddleEllipsis();
		if (!inputRef.current) return;
		const ro = new window.ResizeObserver(updateMiddleEllipsis);
		ro.observe(inputRef.current);
		return () => ro.disconnect();
	}, [ellipsisLocation, updateMiddleEllipsis]);

	const baseLabel = formattedEnsName ?? ensName ?? address;
	const prettyBaseLabel =
		typeof baseLabel === "string" ? prettify(baseLabel) : baseLabel;
	const displayValue =
		ellipsisLocation === "middle"
			? middleEllipsis || prettyBaseLabel
			: prettyBaseLabel;

	return (
		<li
			className={cn(
				"group/user-chip inline-flex items-center justify-between gap-1.5 rounded-full border border-transparent bg-muted/80 p-2 text-sm hover:border-border hover:bg-muted",
				className,
			)}
		>
			<div
				className="flex flex-1 items-center justify-center"
				style={{ gap: `${avatarAndLabelGap}px` }}
			>
				{showAvatar && (
					<div
						className="relative"
						style={{ height: `${avatarSize}px`, width: `${avatarSize}px` }}
					>
						<EthAvatar address={address} size={avatarSize} />
					</div>
				)}
				<Link
					href={`/profile/${address}`}
					style={{ flex: 1, minWidth: 0 }}
					className="group/user-chip-link focus:outline-none"
					tabIndex={0}
				>
					<input
						ref={inputRef}
						className={cn(
							"min-w-0 flex-1 cursor-pointer border-none bg-transparent outline-none focus:outline-none focus:ring-0",
							ellipsisLocation === "end" ? "truncate" : "",
							"group-focus/user-chip-link:text-primary group-hover/user-chip-link:text-primary group-focus/user-chip-link:underline group-hover/user-chip-link:underline",
						)}
						value={displayValue}
						size={ellipsisLocation === "middle" ? 16 : 12}
						readOnly
						disabled
						style={{
							pointerEvents: "none",
							width: "100%",
							background: "transparent",
						}}
					/>
				</Link>
			</div>
			{showCopyButton !== "never" && (
				<button
					type="button"
					className={cn(
						showCopyButton === "hover" ? "opacity-0" : "opacity-50",
						"flex shrink-0 items-center justify-center rounded-full p-0 focus:opacity-100 group-hover/user-chip:opacity-100",
					)}
					style={{
						height: `${avatarSize}px`,
						width: `${avatarSize}px`,
					}}
					onClick={() => {
						copy(address);
					}}
				>
					{isCopied ? (
						<Check size={avatarSize / 1.75} />
					) : (
						<Copy size={avatarSize / 1.75} />
					)}
				</button>
			)}
		</li>
	);
};

export default UserChip;
