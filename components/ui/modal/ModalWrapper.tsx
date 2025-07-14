"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ModalVariant } from "./context";

const ModalWrapper = ({
	transitionDurationInMs,
	modal,
	isActive,
	index,
	preventFocusTrap,
}: {
	transitionDurationInMs: number;
	modal: ModalVariant;
	isActive: boolean;
	index: number;
	preventFocusTrap?: boolean;
}) => {
	const [focusTrapHandleTrigger, setFocusTrapHandleTrigger] = useState(0);

	const handleFocusTrap = useCallback(() => {
		const wrapper = document.querySelector(
			"[data-current-modal]",
		) as HTMLDivElement;

		if (!isActive || !wrapper) return;
		const focusableElements = wrapper.querySelectorAll<HTMLElement>(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
		);
		const firstFocusable = focusableElements[0];
		const lastFocusable = focusableElements[focusableElements.length - 1];

		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isActive) return;
			if (e.key !== "Tab") return;

			// If shift + tab on first element, go to last
			if (e.shiftKey && document.activeElement === firstFocusable) {
				e.preventDefault();
				lastFocusable?.focus();
			}
			// If tab on last element, go to first
			else if (!e.shiftKey && document.activeElement === lastFocusable) {
				e.preventDefault();
				firstFocusable?.focus();
			}
		};

		wrapper.addEventListener("keydown", handleKeyDown);
		if (isActive) firstFocusable?.focus();

		return () => {
			wrapper.removeEventListener("keydown", handleKeyDown);
		};
	}, [isActive]);

	useEffect(() => {
		if (focusTrapHandleTrigger === 0) return;
		return handleFocusTrap();
	}, [focusTrapHandleTrigger, handleFocusTrap]);

	return (
		<AnimatePresence mode="popLayout">
			<motion.div
				onAnimationComplete={() => {
					if (preventFocusTrap) return;
					setTimeout(() => {
						setFocusTrapHandleTrigger(focusTrapHandleTrigger + 1);
					}, transitionDurationInMs);
				}}
				key={modal.id + index}
				initial={
					isActive
						? {
								opacity: 0,
								filter: "blur(10px)",
								x: index === 0 ? 0 : 300,
								scale: index === 0 ? 0.9 : 1,
						  }
						: undefined
				}
				animate={
					isActive
						? {
								opacity: 1,
								filter: "blur(0px)",
								x: 0,
								scale: 1,
						  }
						: {
								opacity: 0,
								filter: "blur(10px)",
								x: -300,
						  }
				}
				exit={
					isActive ? { opacity: 0, filter: "blur(10px)", x: 300 } : undefined
				}
				transition={{
					duration: transitionDurationInMs / 1000,
				}}
				className={
					isActive ? "" : "pointer-events-none absolute top-0 right-0 left-0"
				}
				aria-hidden={!isActive}
				tabIndex={-1}
			>
				{isActive ? (
					<div data-current-modal>{modal.content}</div>
				) : (
					modal.content
				)}
			</motion.div>
		</AnimatePresence>
	);
};

export default ModalWrapper;
