import Link from "next/link";

import { siteConfig } from "@/config/site";

const Footer = () => {
	return (
		<footer className="w-full border-t bg-background">
			<div className="mx-auto flex w-full max-w-5xl flex-col items-start justify-between gap-4 px-6 py-6 sm:flex-row sm:items-center sm:gap-6">
				<div className="flex flex-col gap-1">
					<span className="font-medium text-sm tracking-tight">
						{siteConfig.name}
					</span>
					<span className="text-muted-foreground text-xs">
						{siteConfig.title} · {new Date().getFullYear()}
					</span>
				</div>
				<nav aria-label="Footer" className="w-full sm:w-auto">
					<ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-xs">
						{siteConfig.footerLinks.map(({ title, url, openInNewTab }) => (
							<li key={title}>
								<a
									href={url}
									target={openInNewTab ? "_blank" : "_self"}
									rel={openInNewTab ? "noopener noreferrer" : undefined}
									className="hover:underline"
								>
									{title}
								</a>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</footer>
	);
};

export default Footer;
