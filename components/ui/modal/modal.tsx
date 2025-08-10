"use client";

import { XIcon } from "lucide-react";
import type React from "react";
import { useContext } from "react";
import { ModalModeContext } from "./context";
import {
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogPlaceholder,
	DialogTitle,
} from "./dialog";
import {
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerPlaceholder,
	DrawerTitle,
} from "./drawer";

type ModalDivProps = React.ComponentProps<"div">;

export const ModalHeader = ({ ...props }: ModalDivProps) => {
	const mode = useContext(ModalModeContext);
	return <div className="mb-2" {...props} />;
};

export const ModalTitle = ({ ...props }: ModalDivProps) => {
	const mode = useContext(ModalModeContext);
	return <h1 className="font-semibold text-lg" {...props} />;
};

export const ModalDescription = ({ ...props }: ModalDivProps) => {
	const mode = useContext(ModalModeContext);
	return <p className="text-muted-foreground text-sm" {...props} />;
};

export const ModalFooter = ({ ...props }: ModalDivProps) => {
	const mode = useContext(ModalModeContext);
	if (mode === "dialog") {
		return <DialogFooter {...props} />;
	}
	return <DrawerFooter {...props} />;
};

export const ModalContent = ({
	dismissible = true,
	...props
}: ModalDivProps & {
	dismissible?: boolean;
}) => {
	const mode = useContext(ModalModeContext);
	if (mode === "drawer") {
		return (
			<>
				{dismissible && (
					<div className="mx-auto hidden h-2 w-[100px] shrink-0 rounded-full bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
				)}
				<div
					data-modal-dismissible={dismissible ? "true" : "false"}
					{...props}
				/>
			</>
		);
	}
	return (
		<>
			{dismissible && (
				<DialogClose className="absolute top-0 right-0 rounded-xs opacity-70 ring-offset-background transition-opacity [&_svg]:pointer-events-none disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2">
					<XIcon />
					<span className="sr-only">Close</span>
				</DialogClose>
			)}
			<div data-modal-dismissible={dismissible ? "true" : "false"} {...props} />
		</>
	);
};
