"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { buildProvasListHref } from "@/lib/provas/list-url";

interface ProvaListFiltersProps {
	areas: string[];
	current: {
		area?: string;
	};
}

export function ProvaListFilters({ areas, current }: ProvaListFiltersProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	function navigate(area: string) {
		startTransition(() => {
			router.push(buildProvasListHref(area || undefined));
		});
	}

	return (
		<div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm lg:flex-row lg:items-end">
			<label className="flex flex-1 flex-col gap-1 text-sm">
				<span className="font-medium text-muted">Área</span>
				<select
					key={current.area ?? "todas"}
					name="area"
					defaultValue={current.area ?? ""}
					disabled={isPending}
					onChange={(event) => navigate(event.target.value)}
					className="rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
				>
					<option value="">Todas</option>
					{areas.map((area) => (
						<option key={area} value={area}>
							{area}
						</option>
					))}
				</select>
			</label>

			<button
				type="button"
				disabled={isPending || !current.area}
				onClick={() => navigate("")}
				className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted hover:bg-background disabled:opacity-50"
			>
				Limpar
			</button>
		</div>
	);
}
