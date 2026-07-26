import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const display = Fraunces({
	variable: "--font-fraunces",
	subsets: ["latin"],
	weight: ["500", "600", "700"],
});

const body = Source_Sans_3({
	variable: "--font-source-sans",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: {
		default: "LibreConcursos",
		template: "%s · LibreConcursos",
	},
	description:
		"Portal livre de questões de concursos: filtre, resolva e acompanhe seu histórico.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="pt-BR"
			className={`${display.variable} ${body.variable} h-full antialiased`}
		>
			<body className="flex min-h-full flex-col font-sans text-foreground">
				<SiteHeader />
				<main className="container mx-auto flex-1 px-4 py-8 sm:px-6 sm:py-10">
					{children}
				</main>
				<footer
					className="border-t border-border/70 py-6 text-center text-xs text-muted"
					data-hide-on-focus
				>
					LibreConcursos · BB Agente Comercial 2022 (Cesgranrio)
				</footer>
			</body>
		</html>
	);
}
