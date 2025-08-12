"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import {
	ArrowUpRight,
	BadgePlus,
	Home,
	type LucideProps,
	Menu,
	MessageCircleQuestion,
	Sparkle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, {
	AnchorHTMLAttributes,
	type FC,
	ReactNode,
	Suspense,
	SVGProps,
	useCallback,
} from "react";
import { type ClientLink, MyHypercerts } from "./dynamic-links";

export type NavLinkConfig<T extends "static" | "dynamic"> = {
	id: string;
	showIconOnlyOnDesktop?: boolean;
	openInNewTab?: boolean;
	pathCheck?:
		| {
				equals: string;
		  }
		| {
				startsWith: string;
		  };
} & (T extends "static"
	? {
			type: "static";
			href: string;
			text: string;
			Icon: FC<LucideProps>;
			clientNode?: never;
	  }
	: {
			type: "dynamic";
			href?: never;
			text?: never;
			Icon?: never;
			clientNode: ClientLink;
	  });

const navLinks: NavLinkConfig<"dynamic" | "static">[] = [
	{
		type: "static",
		id: "home",
		href: "/",
		text: "Home",
		showIconOnlyOnDesktop: false,
		Icon: Home,
		pathCheck: {
			equals: "/",
		},
	},
	{
		type: "dynamic",
		id: "my-hypercerts",
		clientNode: MyHypercerts,
	},
	{
		type: "static",
		id: "submit",
		href: "/submit",
		text: "Submit",
		Icon: BadgePlus,
		pathCheck: {
			equals: "/submit",
		},
	},
	{
		type: "static",
		id: "about",
		href: "/about",
		text: "About",
		Icon: Sparkle,
		pathCheck: {
			equals: "/about",
		},
	},
	{
		type: "static",
		id: "faqs",
		href: "/faqs",
		text: "FAQs",
		Icon: MessageCircleQuestion,
		pathCheck: {
			startsWith: "/faqs",
		},
	},
];

export const DesktopNavLink = ({
	link,
	isActive,
}: {
	link: NavLinkConfig<"static">;
	isActive: boolean;
}) => {
	return (
		<Link
			href={link.href}
			className={cn(
				buttonVariants({ variant: "ghost" }),
				"group rounded-md font-medium focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
				isActive ? "bg-muted" : "",
				link.href === "#" ? "opacity-50 hover:opacity-50" : "",
			)}
			{...(link.openInNewTab && {
				target: "_blank",
				rel: "noopener noreferrer",
			})}
		>
			{link.id === "home" ? (
				<div className="flex items-center gap-2">
					<Image
						src="/assets/media/images/logo.svg"
						alt="Recerts"
						width={100}
						height={100}
						className="h-5 w-5"
					/>
					<span className="font-baskerville text-base text-black leading-none">
						Recerts
					</span>
				</div>
			) : link.showIconOnlyOnDesktop === false ? (
				<link.Icon size={18} />
			) : (
				link.text
			)}
			{link.openInNewTab && (
				<ArrowUpRight
					size={18}
					className="group-hover:-translate-y-0.5 ml-1 opacity-70 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 group-hover:opacity-100"
					aria-hidden="true"
				/>
			)}
		</Link>
	);
};

export const PhoneNavLink = ({
	link,
	isActive,
}: {
	link: NavLinkConfig<"static">;
	isActive: boolean;
}) => {
	return (
		<Link
			href={link.href}
			className={cn(
				buttonVariants({ variant: "ghost" }),
				"justify-start text-left text-black focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
				isActive ? "bg-beige" : "",
				link.href === "#" ? "opacity-50 hover:opacity-50" : "",
			)}
			{...(link.openInNewTab && {
				target: "_blank",
				rel: "noopener noreferrer",
			})}
		>
			{link.id === "home" ? (
				<Image
					src="/assets/media/images/logo.svg"
					alt="Recerts"
					width={20}
					height={20}
					className="mr-2 h-5 w-5"
				/>
			) : (
				link.Icon && (
					<link.Icon size={18} className="mr-2 text-muted-foreground" />
				)
			)}
			{link.text}
			{link.openInNewTab && (
				<ArrowUpRight
					size={18}
					className="group-hover:-translate-y-0.5 ml-1 opacity-70 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 group-hover:opacity-100"
					aria-hidden="true"
				/>
			)}
		</Link>
	);
};

const NavLinks = () => {
	const pathname = usePathname();

	const getIsActive = useCallback(
		(link: NavLinkConfig<"dynamic" | "static">) => {
			if (link.pathCheck) {
				if ("equals" in link.pathCheck) {
					return pathname === link.pathCheck.equals;
				}
				if ("startsWith" in link.pathCheck) {
					return pathname.startsWith(link.pathCheck.startsWith);
				}
			}
			return false;
		},
		[pathname],
	);

	return (
		<div className="relative z-10 flex items-center gap-2">
			{/* On Large Devices: */}
			<ul className="hidden gap-0.5 text-black md:flex">
				{navLinks.map((link) => {
					const isActive = getIsActive(link);
					if (link.type === "dynamic") {
						return (
							<Suspense key={link.id}>
								<link.clientNode.Desktop />
							</Suspense>
						);
					}
					return (
						<DesktopNavLink key={link.href} link={link} isActive={isActive} />
					);
				})}
			</ul>

			{/* On Small Devices: */}
			<Link
				href="/"
				className="flex items-center gap-2 md:hidden focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
			>
				<Image
					src="/assets/media/images/logo.svg"
					alt="Recerts"
					width={20}
					height={20}
					className="h-5 w-5"
				/>
				<span className="font-baskerville text-base text-black leading-none">
					Recerts
				</span>
			</Link>
			<Drawer>
				<DrawerTrigger asChild>
					<Button
						variant="ghost"
						className="flex items-center gap-2 md:hidden focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
					>
						<Menu />
					</Button>
				</DrawerTrigger>
				<DrawerContent>
					<div className="hidden" />
					<DrawerHeader>
						<div className="flex flex-col items-center justify-center gap-2 px-4">
							<Image
								src="/assets/media/images/logo.svg"
								className="h-14 w-auto"
								alt="Recerts"
								width={500}
								height={500}
							/>
							<DrawerTitle className="text-center font-baskerville font-bold text-2xl text-black leading-none">
								Recerts
							</DrawerTitle>
						</div>
						<div className="flex w-full items-center justify-center px-4">
							<DrawerDescription className="w-[80%] text-balance text-center font-baskerville text-lg">
								Journal of Decentralized Funding Research.
							</DrawerDescription>
						</div>
					</DrawerHeader>
					<ul className="flex flex-col gap-1 p-4 text-black">
						{navLinks.map((link) => {
							const isActive = getIsActive(link);
							if (link.type === "dynamic") {
								return (
									<Suspense key={link.id}>
										<link.clientNode.Mobile />
									</Suspense>
								);
							}
							return (
								<PhoneNavLink key={link.href} link={link} isActive={isActive} />
							);
						})}
					</ul>
				</DrawerContent>
			</Drawer>
		</div>
	);
};

export default NavLinks;
