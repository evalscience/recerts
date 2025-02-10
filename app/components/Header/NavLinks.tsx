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
	SVGProps,
	useCallback,
} from "react";

type NavLinkConfig = {
	href: string;
	text: string;
	showIconOnlyOnDesktop?: boolean;
	openInNewTab?: boolean;
	Icon: FC<LucideProps>;
	pathCheck?:
		| {
				equals: string;
		  }
		| {
				startsWith: string;
		  };
};

const navLinks: NavLinkConfig[] = [
	{
		href: "/",
		text: "Home",
		showIconOnlyOnDesktop: false,
		Icon: Home,
		pathCheck: {
			equals: "/",
		},
	},
	{
		href: "/submit",
		text: "Submit",
		Icon: BadgePlus,
		pathCheck: {
			equals: "/submit",
		},
	},
	{
		href: "/",
		text: "My Ecocerts",
		Icon: Sparkle,
		pathCheck: {
			equals: "/",
		},
	},
	{
		href: "/faqs",
		text: "FAQs",
		Icon: MessageCircleQuestion,
		pathCheck: {
			startsWith: "/faqs",
		},
	},
];

const DesktopNavLink = ({
	link,
	isActive,
}: {
	link: NavLinkConfig;
	isActive: boolean;
}) => {
	return (
		<Link
			href={link.href}
			className={cn(
				buttonVariants({ variant: "ghost" }),
				"group rounded-md font-semibold",
				isActive ? "bg-beige" : "",
			)}
			{...(link.openInNewTab && {
				target: "_blank",
				rel: "noopener noreferrer",
			})}
		>
			{link.showIconOnlyOnDesktop === false ? (
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

const PhoneNavLink = ({
	link,
	isActive,
}: {
	link: NavLinkConfig;
	isActive: boolean;
}) => {
	return (
		<Link
			href={link.href}
			className={cn(
				buttonVariants({ variant: "ghost" }),
				"",
				isActive ? "bg-beige" : "",
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
		(link: NavLinkConfig) => {
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
		<div className="relative z-10">
			{/* On Large Devices: */}
			<ul className="hidden gap-0.5 md:flex">
				{navLinks.map((link) => {
					const isActive = getIsActive(link);
					return (
						<DesktopNavLink key={link.href} link={link} isActive={isActive} />
					);
				})}
			</ul>

			{/* On Small Devices: */}
			<Drawer>
				<DrawerTrigger asChild>
					<Button variant="ghost" className="flex items-center gap-2 md:hidden">
						<Menu />
					</Button>
				</DrawerTrigger>
				<DrawerContent>
					<div className="-top-4 absolute left-[50%] h-24 w-24 translate-x-[-50%] rounded-full bg-primary/20 blur-xl" />
					<DrawerHeader>
						<div className="flex flex-col items-center justify-center gap-2 px-4">
							<Image
								src="/assets/media/images/logo.svg"
								className="h-14 w-auto"
								alt="Gainforest"
								width={500}
								height={500}
							/>
							<DrawerTitle className="text-center font-baskerville font-bold text-2xl">
								Ecocertain
							</DrawerTitle>
						</div>
						<div className="flex w-full items-center justify-center px-4">
							<DrawerDescription className="w-[80%] text-balance text-center font-baskerville text-lg">
								Fund impactful regenerative projects.
							</DrawerDescription>
						</div>
					</DrawerHeader>
					<ul className="flex flex-col gap-1 p-4">
						{navLinks.map((link) => {
							const isActive = getIsActive(link);
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
