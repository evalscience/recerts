export const debugLog = (...args: unknown[]) => {
	if (process.env.NODE_ENV === "development") {
		console.log("[DEBUG]", ...args);
	}
};
