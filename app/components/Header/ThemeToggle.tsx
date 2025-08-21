"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button variant="ghost" size="sm" className="h-9 w-9 p-0">
				<div className="h-4 w-4" />
			</Button>
		);
	}

	return (
		<Button
			variant="ghost"
			size="sm"
			className="h-9 w-9 p-0 transition-colors dark:hover:bg-neutral-800 hover:bg-neutral-100"
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
		>
			{theme === "dark" ? (
				<Sun className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
			) : (
				<Moon className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
			)}
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
