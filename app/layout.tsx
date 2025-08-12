import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { Analytics } from "@vercel/analytics/react";
import { cookieToInitialState } from "wagmi";

import HypercertExchangeClientProvider from "@/components/providers/HypercertExchangeClientProvider";
import { ModalProvider } from "@/components/ui/modal/context";
import { siteConfig } from "@/config/site";
import { config } from "@/config/wagmi";
import { WagmiContextProvider } from "@/contexts/wagmi";
import { EB_Garamond, Inter } from "next/font/google";
import { headers } from "next/headers";
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
	authors: [{ name: "GainForest", url: "https://Eval.Science" }],
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
					<WagmiContextProvider>
						<HypercertExchangeClientProvider>
							<PriceFeedProvider>
								<ModalProvider modalVariants={[]}>
									<Header />
									<main className="flex-1">
										<article className="mx-auto w-full max-w-6xl px-6 py-10 md:py-14">
											{children}
										</article>
									</main>
									<Footer />
								</ModalProvider>
							</PriceFeedProvider>
						</HypercertExchangeClientProvider>
					</WagmiContextProvider>
				</FarcasterProvider>
			</body>
		</html>
	);
}
