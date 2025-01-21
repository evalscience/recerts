"use client";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import * as React from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Dialog = AlertDialogPrimitive.Root;

const DialogTrigger = AlertDialogPrimitive.Trigger;

const DialogPortal = AlertDialogPrimitive.Portal;

const DialogOverlay = React.forwardRef<
	React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Overlay
		className={cn(
			"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-20 bg-black/80 data-[state=closed]:animate-out data-[state=open]:animate-in",
			className,
		)}
		{...props}
		ref={ref}
	/>
));
DialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
	React.ElementRef<typeof AlertDialogPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> & {
		sidebarChildren: React.ReactNode;
		sidebarClassName?: string;
	}
>(
	(
		{ className, sidebarChildren, sidebarClassName, children, ...props },
		ref,
	) => (
		<DialogPortal>
			<DialogOverlay />
			<AlertDialogPrimitive.Content
				ref={ref}
				className={cn(
					"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-20 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] grid-cols-[1fr_2fr] overflow-hidden border border-stone-200 bg-white shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in sm:rounded-lg dark:border-stone-800 dark:bg-stone-950",
					className,
				)}
				onEscapeKeyDown={(e) => {
					e.preventDefault();
				}}
				{...props}
			>
				<div className="relative min-h-[300px] overflow-hidden bg-beige">
					<div className="absolute right-0 bottom-[-50%] left-0 aspect-square w-full rounded-full bg-beige-muted-foreground/50 blur-xl" />
					<div className={cn("absolute inset-0", sidebarClassName)}>
						{sidebarChildren}
					</div>
				</div>
				<div className="flex w-full flex-col gap-4 p-6">{children}</div>
				{/* <AlertDialogPrimitive.Cancel className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-white transition-opacity disabled:pointer-events-none dark:data-[state=open]:bg-stone-800 data-[state=open]:bg-stone-100 dark:data-[state=open]:text-stone-400 data-[state=open]:text-stone-500 hover:opacity-100 focus:outline-none dark:focus:ring-stone-300 focus:ring-2 focus:ring-stone-950 dark:ring-offset-stone-950 focus:ring-offset-2">
					<X className="h-4 w-4" />
					<span className="sr-only">Close</span>
				</AlertDialogPrimitive.Cancel> */}
			</AlertDialogPrimitive.Content>
		</DialogPortal>
	),
);
DialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const DialogHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"flex flex-col space-y-1.5 text-center sm:text-left",
			className,
		)}
		{...props}
	/>
);
DialogHeader.displayName = "AlertDialogHeader";

const DialogFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
			className,
		)}
		{...props}
	/>
);
DialogFooter.displayName = "AlertDialogFooter";

const DialogTitle = React.forwardRef<
	React.ElementRef<typeof AlertDialogPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Title
		ref={ref}
		className={cn(
			"font-semibold text-lg leading-none tracking-tight",
			className,
		)}
		{...props}
	/>
));
DialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
	React.ElementRef<typeof AlertDialogPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Description
		ref={ref}
		className={cn("text-muted-foreground text-sm", className)}
		{...props}
	/>
));
DialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

const DialogAction = React.forwardRef<
	React.ElementRef<typeof AlertDialogPrimitive.Action>,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Action
		ref={ref}
		className={cn(buttonVariants(), className)}
		{...props}
	/>
));
DialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const DialogCancel = React.forwardRef<
	React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Cancel
		ref={ref}
		className={cn(
			buttonVariants({ variant: "outline" }),
			"mt-2 sm:mt-0",
			className,
		)}
		{...props}
	/>
));
DialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
	Dialog,
	DialogPortal,
	DialogOverlay,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
	DialogAction,
	DialogCancel,
};
