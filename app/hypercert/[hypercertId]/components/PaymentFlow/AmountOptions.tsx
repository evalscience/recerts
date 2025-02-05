import {
	FullHypercert,
	type FullHypercertWithOrder,
} from "@/app/graphql-queries/hypercerts";
import BigintSlider from "@/components/ui/bigint-slider";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Slider from "@/components/ui/slider";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { TOKENS_CONFIG } from "@/config/wagmi";
import { cn, formatUSD } from "@/lib/utils";
import {
	ArrowRight,
	CircleAlert,
	Info,
	Loader2,
	RefreshCw,
	TriangleAlert,
} from "lucide-react";
import React, {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useEffect,
	useMemo,
} from "react";
import { useState } from "react";
import { useAccount } from "wagmi";
import useOrdersInfo, { OrderInfoConstants } from "./hooks/useOrdersInfo";
import type { OrderPreferences } from "./hooks/usePaymentFlowDialog";
import type { UserFunds } from "./hooks/useUserFunds";

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
		<div className="flex flex-1 flex-col items-center justify-center gap-1">
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

const AmountOptions = ({
	hypercert,
	orderPreferencesState,
	userFunds,
}: {
	hypercert: FullHypercertWithOrder;
	orderPreferencesState: [
		OrderPreferences | undefined,
		Dispatch<SetStateAction<OrderPreferences | undefined>>,
	];
	userFunds: UserFunds;
}) => {
	// Initializations
	const [orderPreferences, setOrderPreferences] = orderPreferencesState;
	const { chainId: currentChainId } = useAccount();
	const ordersInfo = useOrdersInfo(hypercert);
	const { unitsForSale } = hypercert;
	const defaultUnitsToBuy = unitsForSale / 2n + 1n;
	const [unitsToBuy, setUnitsToBuy] = useState(defaultUnitsToBuy);

	// Get the currencies supported by the current chain and the app:
	type OrderCurrency = {
		currency: string;
		orderId: string;
	};
	const currentChainOrdersInfo = ordersInfo.filter((info) =>
		currentChainId === undefined
			? false
			: info.data.chainId === currentChainId.toString(),
	);
	const currentChainOrderCurrencies = currentChainOrdersInfo.map((info) => ({
		currency: info.data.currency,
		orderId: info.id,
	}));
	const currenciesSupportedOnCurrentChainByApp = currentChainId
		? currentChainId in TOKENS_CONFIG
			? TOKENS_CONFIG[currentChainId]
			: []
		: [];
	const currenciesSupportedOnCurrentChainByHypercertAndApp =
		currentChainOrderCurrencies.filter(
			(currency) =>
				currenciesSupportedOnCurrentChainByApp.find(
					(token) => token.address === currency.currency,
				) !== undefined,
		);
	const defaultPreferredOrderCurrency =
		currenciesSupportedOnCurrentChainByHypercertAndApp.length > 0
			? currenciesSupportedOnCurrentChainByHypercertAndApp[0]
			: undefined;

	// State management for the preferred currency:
	const [preferredCurrency, setPreferredCurrency] = useState<
		OrderCurrency | undefined
	>(defaultPreferredOrderCurrency);
	const currentOrderInfo = preferredCurrency
		? ordersInfo.find((info) => info.id === preferredCurrency.orderId)
		: undefined;
	const preferredCurrencyConfig = currenciesSupportedOnCurrentChainByApp.find(
		(currency) => currency.address === preferredCurrency?.currency,
	);

	// Utilities for the component, and its side effects:
	const precisionMultipliedPricePerUnitInToken = useMemo(() => {
		if (!currentOrderInfo) return 0n;
		return currentOrderInfo?.pricePerUnit.inToken.precisionMultiplied;
	}, [currentOrderInfo]);

	const getCurrencyTokens = useCallback(
		(units?: bigint) => {
			const unitsForCalc = units ?? unitsToBuy;
			const multipliedTokens =
				precisionMultipliedPricePerUnitInToken * unitsForCalc;
			return Number(multipliedTokens) / OrderInfoConstants.MULTIPLIER;
		},
		[precisionMultipliedPricePerUnitInToken, unitsToBuy],
	);

	const formatTokenString = useCallback((token: number) => {
		return Math.floor(token * 10000) / 10000;
	}, []);

	const [currencyTokensString, setCurrencyTokensString] = useState(
		formatTokenString(getCurrencyTokens()).toString(),
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies(defaultUnitsToBuy, formatTokenString, getCurrencyTokens): useEffect doesn't need to run each time the mentioned dependencies change.
	useEffect(() => {
		// Reset Everything when preferred currency is changed.
		setUnitsToBuy(defaultUnitsToBuy);
		setCurrencyTokensString(
			formatTokenString(getCurrencyTokens(defaultUnitsToBuy)).toString(),
		);
	}, [preferredCurrency]);

	// biome-ignore lint/correctness/useExhaustiveDependencies(setOrderPreferences): useEffect doesn't need to run each time the mentioned dependencies change.
	useEffect(() => {
		if (preferredCurrency === undefined) {
			setOrderPreferences(undefined);
			return;
		}
		setOrderPreferences({
			orderId: preferredCurrency.orderId,
			units: unitsToBuy,
		});
	}, [unitsToBuy, preferredCurrency]);

	const isValidAmount = useMemo(() => {
		const parsed = Number(currencyTokensString);
		if (Number.isNaN(parsed)) return false;
		if (unitsToBuy < 1n || unitsToBuy > unitsForSale) return false;
		return true;
	}, [currencyTokensString, unitsToBuy, unitsForSale]);

	const hasSufficientFunds = useMemo(() => {
		if (userFunds.error) return true;
		if (userFunds.isLoading) return true;
		if (userFunds.data.raw === undefined) return true;
		if (currentOrderInfo === undefined) return true;
		return (
			userFunds.data.raw >=
			currentOrderInfo.pricePerUnit.inToken.precisionMultiplied * unitsToBuy
		);
	}, [userFunds, currentOrderInfo, unitsToBuy]);

	// If something is not right:
	if (
		currentOrderInfo === undefined ||
		preferredCurrencyConfig === undefined ||
		unitsForSale === 0n
	) {
		return (
			<div>
				Something went wrong... Please make sure that the hypercert is supported
				and try again.
			</div>
		);
	}

	const maxUSDAvailableForSale = currentOrderInfo.totalSalePrice.inUSD.number;
	const getUnitsToBuyFromUSD = (usd: number) => {
		const unitsToBuyInNumber = currentOrderInfo.units.perUSD.number * usd;
		return BigInt(unitsToBuyInNumber);
	};

	return (
		<div className="mb-10 flex w-full flex-col gap-8">
			<div className="w-full">
				<div className="mt-2 flex w-full items-center gap-2">
					{QuickAmounts.map(({ valueInUSD, emojis }) => (
						<QuickAmountButton
							valueInUSD={valueInUSD}
							emojis={emojis}
							disabled={valueInUSD > maxUSDAvailableForSale}
							isSelected={unitsToBuy === getUnitsToBuyFromUSD(valueInUSD)}
							onSelect={(value) => {
								const evaluatedUnitsToBuy = getUnitsToBuyFromUSD(value);
								setUnitsToBuy(evaluatedUnitsToBuy);
								setCurrencyTokensString(
									formatTokenString(
										getCurrencyTokens(evaluatedUnitsToBuy),
									).toString(),
								);
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
			<div className="flex w-full flex-col gap-4">
				<div className="flex items-center justify-between rounded-lg bg-muted px-4 py-2 font-sans">
					<div className="flex items-center gap-1">
						<span>Paying in</span>
						<Combobox
							options={currenciesSupportedOnCurrentChainByHypercertAndApp.map(
								(currency) => ({
									value: currency.currency,
									label: currenciesSupportedOnCurrentChainByApp.find(
										(token) => token.address === currency.currency,
									)?.symbol as string,
								}),
							)}
							placeholder="Select currency"
							searchPlaceholder="Search currency"
							emptyLabel="No supported currencies found."
							value={preferredCurrencyConfig.address}
							onChange={(value) => {
								if (value === undefined) return;
								const orderId =
									currenciesSupportedOnCurrentChainByHypercertAndApp.find(
										(currency) => currency.currency === value,
									)?.orderId;
								if (orderId === undefined) return;
								setPreferredCurrency({
									currency: value,
									orderId,
								});
							}}
						/>
					</div>
					{userFunds.isLoading ? (
						<Loader2 size={16} className="animate-spin text-primary" />
					) : userFunds.error ? (
						<span className="flex items-center justify-center font-sans text-destructive">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger className="flex items-center gap-1">
										<CircleAlert size={14} />
										<span>Balance</span>
									</TooltipTrigger>
									<TooltipContent>
										Unable to load your balance for{" "}
										<b>{preferredCurrencyConfig.symbol}</b>.
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<Button size={"sm"} variant={"ghost"} onClick={userFunds.refetch}>
								<RefreshCw size={14} />
							</Button>
						</span>
					) : (
						<span className="flex items-center justify-center font-sans text-foreground text-sm">
							{formatUSD(Number(userFunds.data.formatted))}&nbsp;
							<b>{preferredCurrencyConfig.symbol}</b>
							<Button size={"sm"} variant={"ghost"} onClick={userFunds.refetch}>
								<RefreshCw size={14} />
							</Button>
						</span>
					)}
				</div>
				<div className="flex items-center gap-4">
					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-2">
							<span>{preferredCurrencyConfig.symbol}</span>
							<Input
								type="number"
								min={getCurrencyTokens(1n)}
								max={getCurrencyTokens(unitsForSale)}
								value={currencyTokensString}
								onChange={(evt) => {
									setCurrencyTokensString(evt.target.value);
									const parsedValue = Number(evt.target.value);
									console.log({
										parsedValue: parsedValue * OrderInfoConstants.MULTIPLIER,
										ppu: currentOrderInfo.pricePerUnit.inToken
											.precisionMultiplied,
									});
									if (Number.isNaN(parsedValue)) return;
									const HALF_MULTIPLIER = OrderInfoConstants.MULTIPLIER / 2;
									setUnitsToBuy(
										(BigInt(parsedValue * HALF_MULTIPLIER) *
											currentOrderInfo.units.perToken.bigint) /
											BigInt(HALF_MULTIPLIER),
									);
								}}
								className={cn(
									"h-8 max-w-[120px]",
									isValidAmount && hasSufficientFunds
										? ""
										: "border border-destructive",
								)}
							/>
						</div>

						<span
							className={cn(
								"text-destructive text-sm",
								isValidAmount && hasSufficientFunds
									? "select-none opacity-0"
									: "opacity-100",
							)}
						>
							{hasSufficientFunds ? "Invalid Value" : "Insufficient Funds"}
						</span>
					</div>
					<div className="flex-1">
						<div className="flex flex-col gap-1">
							<BigintSlider
								min={1n}
								max={unitsForSale}
								value={unitsToBuy}
								onChange={(value) => {
									setUnitsToBuy(value);
									setCurrencyTokensString(
										formatTokenString(getCurrencyTokens(value)).toString(),
									);
								}}
								display={" "}
							/>
							<span className="flex items-center justify-between text-muted-foreground text-sm">
								<span>{formatTokenString(getCurrencyTokens(1n))}</span>
								<span>
									{formatTokenString(getCurrencyTokens(unitsForSale))}
								</span>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AmountOptions;
