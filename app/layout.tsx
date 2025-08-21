import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { Analytics } from "@vercel/analytics/react";

import ChainSwitchProvider from "@/components/providers/ChainSwitch";
import HypercertExchangeClientProvider from "@/components/providers/HypercertExchangeClient";
import PrivyConfigProvider from "@/components/providers/Privy";
import { ModalProvider } from "@/components/ui/modal/context";
import { siteConfig } from "@/config/site";
import { EB_Garamond, Inter } from "next/font/google";
import { PriceFeedProvider } from "./PriceFeedProvider";
import FarcasterProvider from "./components/FarcasterProvider";
import Footer from "./components/Footer";
import Header from "./components/Header";

const garamond = EB_Garamond({
	variable: "--font-garamond",
	subsets: ["latin"],
	weight: ["400", "700"],
});

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

const archia = localFont({
	src: [
		{
			path: "./fonts/Archia/Regular.otf",
			weight: "400",
			style: "regular",
		},
	],
	variable: "--font-archia",
});

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: siteConfig.name,
	description: siteConfig.description,
	authors: [{ name: "GainForest", url: "https://gainforest.earth" }],
	icons: [
		{
			rel: "icon",
			url: "/favicon.ico",
		},
		{
			rel: "icon",
			url: "/favicon-dark.ico",
			media: "(prefers-color-scheme: dark)",
		},
	],
	alternates: {
		canonical: "./",
	},
	robots: {
		index: true,
		follow: true,
	},

	applicationName: siteConfig.name,
	keywords: [
		"hypercerts",
		"recerts",
		"recerts",
		"fund",
		"impactful",
		"regenerative",
		"projects",
		"forest",
		"conservation",
		"deforestation",
		"gainforest",
		"earth",
		"green",
	],
	generator: "Next.js",
	creator: "GainForest",
	publisher: "GainForest",
	referrer: "origin",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		title: siteConfig.name,
		siteName: siteConfig.name,
		description: siteConfig.description,
		type: "website",
		url: siteConfig.url,
		images: [{ url: "/opengraph-image.png", alt: siteConfig.name }],
	},
	twitter: {
		card: "summary_large_image",
		site: "@GainForestNow",
		title: siteConfig.name,
		description: siteConfig.description,
		images: [{ url: "/opengraph-image.png", alt: siteConfig.name }],
	},
	viewport: {
		width: "device-width",
		initialScale: 1,
		maximumScale: 1,
		userScalable: false,
	},
};

const frame = {
	version: "next",
	imageUrl: "https://recerts.org/farcaster/FarcasterEmbedThumbnail.png",
	button: {
		title: "Browse Recerts",
		action: {
			type: "launch_frame",
			url: "https://recerts.org",
			name: siteConfig.name,
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="stylesheet" href="https://latex.vercel.app/style.css" />
				<meta property="fc:frame" content={JSON.stringify(frame)} />
			</head>
			<body
				className={cn(
					"flex min-h-screen flex-col antialiased",
					garamond.variable,
					inter.variable,
					archia.variable,
				)}
			>
				<FarcasterProvider>
					<Analytics />
					<PrivyConfigProvider>
						<HypercertExchangeClientProvider>
							<PriceFeedProvider>
								<ModalProvider modalVariants={[]}>
									<ChainSwitchProvider>
										<Header />
										<div className="flex-1">{children}</div>
										<Footer />
									</ChainSwitchProvider>
								</ModalProvider>
							</PriceFeedProvider>
						</HypercertExchangeClientProvider>
					</PrivyConfigProvider>
				</FarcasterProvider>
			</body>
		</html>
	);
}
