"use client";

import {
	type DOMMotionComponents,
	type MotionProps,
	motion,
} from "framer-motion";
import type React from "react";

type MotionElements = keyof DOMMotionComponents;

type MotionWrapperProps<T extends MotionElements> = {
	type: T;
	children?: React.ReactNode;
} & React.ComponentProps<T> &
	MotionProps;

export function MotionWrapper<T extends MotionElements>({
	type,
	children,
	...props
}: MotionWrapperProps<T>) {
	const Component = motion[type] as React.ComponentType<unknown>;
	return <Component {...props}>{children}</Component>;
}
