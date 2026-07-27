"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
	{ href: "/provas", label: "Provas" },
	{ href: "/historico", label: "Histórico" },
] as const;

export function SiteHeader() {
	const pathname = usePathname();
	const onHome = pathname === "/";

	return (
		<header
			className={
				onHome
					? "absolute inset-x-0 top-0 z-30 border-b border-white/15 bg-transparent"
					: "border-b border-border/80 bg-surface"
			}
			data-hide-on-focus
		>
			<div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
				<Link href="/" className="group flex flex-col">
					<span
						className={
							onHome
								? "font-display text-xl font-semibold tracking-tight text-white group-hover:text-white/90 sm:text-2xl"
								: "font-display text-xl font-semibold tracking-tight text-foreground group-hover:text-accent-strong sm:text-2xl"
						}
					>
						Treino Concursos
					</span>
					<span
						className={onHome ? "text-xs text-white/70" : "text-xs text-muted"}
					>
						Treine por prova, com foco
					</span>
				</Link>

				<nav
					className="flex items-center gap-1 sm:gap-2"
					aria-label="Principal"
				>
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={
								onHome
									? "rounded-md px-3 py-2 text-sm font-medium text-white/85 hover:bg-white/10 hover:text-white"
									: "rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-accent-soft hover:text-accent-strong"
							}
						>
							{link.label}
						</Link>
					))}
				</nav>
			</div>
		</header>
	);
}
