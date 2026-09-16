import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { collectImageNumbers } from "../questions/images";

describe("collectImageNumbers", () => {
	it("collects unique sorted numbers", () => {
		assert.deepEqual(
			collectImageNumbers("a $$ IMAGE 3 $$ b", "$$ IMAGE 1 $$ $$ IMAGE 3 $$"),
			[1, 3],
		);
	});
});
