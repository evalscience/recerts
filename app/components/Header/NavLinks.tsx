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
	// {
	// 	type: "dynamic",
	// 	id: "my-hypercerts",
	// 	clientNode: MyHypercerts,
	// },
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
				"group rounded-full px-3 py-1.5 font-medium text-neutral-700 text-sm transition-all dark:hover:text-neutral-50 dark:text-neutral-200 hover:text-neutral-900 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
				isActive
					? "bg-neutral-100 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-50"
					: "",
				link.href === "#" ? "opacity-50 hover:opacity-50" : "",
			)}
			{...(link.openInNewTab && {
				target: "_blank",
				rel: "noopener noreferrer",
			})}
		>
			{link.id === "home" ? (
				<span className="font-semibold text-base text-neutral-900 leading-none tracking-tight dark:text-neutral-50">
					Recerts
				</span>
			) : link.showIconOnlyOnDesktop === false ? (
				<link.Icon
					size={16}
					className="text-neutral-600 dark:text-neutral-300"
				/>
			) : (
				<span className="text-neutral-700 dark:text-neutral-200">
					{link.text}
				</span>
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
				"justify-start text-left text-neutral-900 dark:text-neutral-100 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
				isActive ? "bg-beige dark:bg-neutral-700" : "",
				link.href === "#" ? "opacity-50 hover:opacity-50" : "",
			)}
			{...(link.openInNewTab && {
				target: "_blank",
				rel: "noopener noreferrer",
			})}
		>
			{link.Icon && (
				<link.Icon size={18} className="mr-2 text-muted-foreground" />
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
			<ul className="hidden gap-0.5 text-neutral-900 md:flex dark:text-neutral-100">
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
				<span className="font-semibold text-base text-neutral-900 leading-none tracking-tight dark:text-neutral-50">
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
							<DrawerTitle className="text-center font-bold text-3xl text-neutral-900 uppercase leading-none tracking-wide dark:text-neutral-100">
								Recerts
							</DrawerTitle>
						</div>
						<div className="flex w-full items-center justify-center px-4">
							<DrawerDescription className="w-[80%] text-balance text-center text-lg">
								Journal of Mechanism Design for Public Goods.
							</DrawerDescription>
						</div>
					</DrawerHeader>
					<ul className="flex flex-col gap-1 p-4 text-neutral-900 dark:text-neutral-100">
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
