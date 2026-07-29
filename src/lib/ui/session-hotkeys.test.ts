import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	isEditableHotkeyTarget,
	resolveSessionHotkey,
} from "./session-hotkeys";

describe("resolveSessionHotkey", () => {
	it("maps letter keys before reveal", () => {
		assert.equal(
			resolveSessionHotkey({ key: "B", target: null, revealed: false }),
			"select-b",
		);
	});

	it("ignores letters after reveal", () => {
		assert.equal(
			resolveSessionHotkey({ key: "a", target: null, revealed: true }),
			null,
		);
	});

	it("maps enter to conferir", () => {
		assert.equal(
			resolveSessionHotkey({ key: "Enter", target: null, revealed: false }),
			"conferir",
		);
	});

	it("maps arrows", () => {
		assert.equal(
			resolveSessionHotkey({
				key: "ArrowLeft",
				target: null,
				revealed: false,
			}),
			"prev",
		);
		assert.equal(
			resolveSessionHotkey({
				key: "ArrowRight",
				target: null,
				revealed: true,
			}),
			"next",
		);
	});
});

describe("isEditableHotkeyTarget", () => {
	it("detects select elements", () => {
		const select = { tagName: "SELECT", isContentEditable: false };
		assert.equal(
			isEditableHotkeyTarget(select as unknown as EventTarget),
			true,
		);
	});
});
