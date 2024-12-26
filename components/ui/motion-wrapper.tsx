"use client";

import { motion, DOMMotionComponents, MotionProps } from "framer-motion";
import React from "react";

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
  const Component = motion[type] as React.ComponentType<any>;
  return <Component {...props}>{children}</Component>;
}
