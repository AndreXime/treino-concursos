export type SessionHotkeyAction =
	| "select-a"
	| "select-b"
	| "select-c"
	| "select-d"
	| "select-e"
	| "conferir"
	| "prev"
	| "next";

interface HotkeyTargetLike {
	tagName?: string;
	isContentEditable?: boolean;
}

export function isEditableHotkeyTarget(target: EventTarget | null): boolean {
	if (!target || typeof target !== "object") {
		return false;
	}
	const element = target as HotkeyTargetLike;
	const tag = element.tagName;
	if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
		return true;
	}
	return element.isContentEditable === true;
}

export function resolveSessionHotkey(input: {
	key: string;
	target: EventTarget | null;
	revealed: boolean;
}): SessionHotkeyAction | null {
	if (isEditableHotkeyTarget(input.target)) {
		return null;
	}

	const key = input.key.length === 1 ? input.key.toLowerCase() : input.key;

	if (!input.revealed && key >= "a" && key <= "e") {
		return `select-${key}` as SessionHotkeyAction;
	}

	if (key === "Enter" && !input.revealed) {
		return "conferir";
	}

	if (key === "ArrowLeft") {
		return "prev";
	}

	if (key === "ArrowRight") {
		return "next";
	}

	return null;
}
