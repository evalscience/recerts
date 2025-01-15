import {
	FullHypercert,
	type FullHypercertWithOrder,
} from "@/app/graphql-queries/hypercerts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Slider from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import React, { type Dispatch, type SetStateAction, useEffect } from "react";
import { useState } from "react";
import useOrderInfo from "./hooks/useOrderInfo";

type QuickAmount = {
	valueInUSD: number;
	emojis: string;
};

const QuickAmounts: QuickAmount[] = [
	{
		valueInUSD: 5,
		emojis: "🌱",
	},
	{
		valueInUSD: 10,
		emojis: "🌱⭐",
	},
	{
		valueInUSD: 50,
		emojis: "🌱⭐✨",
	},
	{
		valueInUSD: 100,
		emojis: "🌱⭐✨💕",
	},
];

const QuickAmountButton = ({
	valueInUSD,
	emojis,
	disabled,
	isSelected,
	onSelect,
}: QuickAmount & {
	disabled?: boolean;
	isSelected?: boolean;
	onSelect: (value: number) => void;
}) => {
	return (
		<div className="flex flex-col items-center justify-center gap-1">
			<Button
				className={cn(
					"h-12 w-24",
					isSelected ? "border border-green-500 text-green-500" : "",
				)}
				variant={"outline"}
				disabled={disabled}
				onClick={() => {
					onSelect(valueInUSD);
				}}
			>
				${valueInUSD}
			</Button>
			<span className={cn("text-sm", disabled ? "opacity-50" : "")}>
				{emojis}
			</span>
		</div>
	);
};

const Content = ({
	minUSD,
	maxUSD,
	currentUSDState,
	currentUSDStringState,
}: {
	minUSD: number | undefined;
	maxUSD: number | undefined;
	currentUSDState: [
		number | undefined,
		Dispatch<SetStateAction<number | undefined>>,
	];
	currentUSDStringState: [string, Dispatch<SetStateAction<string>>];
}) => {
	const [currentUSD, setCurrentUSD] = currentUSDState;
	const [currentUSDString, setCurrentUSDString] = currentUSDStringState;

	if (
		minUSD === undefined ||
		maxUSD === undefined ||
		currentUSD === undefined
	) {
		return <div>Something went wrong... Please try again</div>;
	}

	const parseUSDStringInput = <T,>(
		currentUSDString: string,
		fallback?: { value: T },
	) => {
		let parsed: number;
		try {
			parsed = Number(currentUSDString);
			if (Number.isNaN(parsed)) {
				throw new Error("Invalid number");
			}
			return parsed;
		} catch (e) {
			return fallback ? fallback.value : Math.floor(currentUSD * 100) / 100;
		}
	};

	const parsedCurrentUSD = parseUSDStringInput(currentUSDString, {
		value: null,
	});
	const isInvalidCurrentUSDValueString =
		parsedCurrentUSD === null ||
		parsedCurrentUSD < minUSD ||
		parsedCurrentUSD > maxUSD;

	return (
		<div className="mb-10 flex w-full flex-col gap-8">
			<div className="w-full">
				<span className="font-bold text-sm">Choose a quick amount</span>
				<div className="mt-2 flex w-full items-center gap-2">
					{QuickAmounts.map(({ valueInUSD, emojis }) => (
						<QuickAmountButton
							valueInUSD={valueInUSD}
							emojis={emojis}
							disabled={valueInUSD > maxUSD || valueInUSD < minUSD}
							isSelected={valueInUSD === currentUSD}
							onSelect={(value) => {
								setCurrentUSD(value);
								setCurrentUSDString((Math.floor(value * 100) / 100).toFixed(2));
							}}
							key={valueInUSD}
						/>
					))}
				</div>
			</div>
			<div className="flex items-center gap-4">
				<Separator className="w-auto flex-1" />
				<span className="text-muted-foreground text-sm">OR</span>
				<Separator className="w-auto flex-1" />
			</div>
			<div className="flex items-center gap-4">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<span>USD</span>
						<Input
							type="number"
							min={minUSD}
							max={maxUSD}
							value={currentUSDString}
							onChange={(evt) => {
								setCurrentUSDString(evt.target.value);
								setCurrentUSD(parseUSDStringInput(evt.target.value));
							}}
							className={cn(
								"h-8 max-w-[120px]",
								isInvalidCurrentUSDValueString
									? "border border-destructive"
									: "",
							)}
						/>
					</div>
					<span
						className={cn(
							"text-destructive text-sm",
							isInvalidCurrentUSDValueString
								? "opacity-100"
								: "select-none opacity-0",
						)}
					>
						Invalid Value
					</span>
				</div>
				<div className="flex-1">
					<div className="flex flex-col gap-1">
						<Slider
							min={minUSD}
							max={maxUSD}
							value={currentUSD}
							onChange={(value) => {
								setCurrentUSD(value);
								setCurrentUSDString((Math.floor(value * 100) / 100).toFixed(2));
							}}
							display={" "}
						/>
						<span className="flex items-center justify-between text-muted-foreground text-sm">
							<span>{Math.floor(minUSD * 100) / 100}</span>
							<span>{Math.floor(maxUSD * 100) / 100}</span>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

const AmountOptions = ({
	hypercert,
	amountInUSDState,
}: {
	hypercert: FullHypercertWithOrder;
	amountInUSDState: [
		number | undefined,
		Dispatch<SetStateAction<number | undefined>>,
	];
	setVariant: (value: "amount-options" | "transaction-progress") => void;
}) => {
	const orderInfo = useOrderInfo(hypercert);

	// the following values are initialized by 0, in case orderInfo is null... but that will never happen
	// because the hypercert passed in the hook has the orders array for sure.
	// therefore, the initalization with 0 is just for better handling, and will never occur:
	const { totalSalePriceInUSD = 0, pricePerUnitInUSD = 0 } = orderInfo ?? {};

	const minUSD = pricePerUnitInUSD;
	const maxUSD = totalSalePriceInUSD;
	const defaultAmountInUSD = minUSD + (maxUSD - minUSD) / 2;

	const [, setAmount] = amountInUSDState;
	const [currentUSDString, setCurrentUSDString] = useState("0.00");

	// biome-ignore lint/correctness/useExhaustiveDependencies(setAmount, setCurrentUSDString): No need to update the ammount, when state setters are updated
	useEffect(() => {
		setAmount(defaultAmountInUSD);
		setCurrentUSDString(
			defaultAmountInUSD
				? (Math.floor(defaultAmountInUSD * 100) / 100).toFixed(2)
				: "0.00",
		);
	}, [defaultAmountInUSD]);
	return (
		<Content
			{...{
				minUSD,
				maxUSD,
				currentUSDState: amountInUSDState,
				currentUSDStringState: [currentUSDString, setCurrentUSDString],
			}}
		/>
	);
};

export default AmountOptions;
