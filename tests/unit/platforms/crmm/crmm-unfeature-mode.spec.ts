import { UnfeaturableCrmmVersion } from "@/platforms/crmm/crmm-version";
import { CrmmUnfeatureMode } from "@/platforms/crmm/crmm-unfeature-mode";

describe("CrmmUnfeatureMode", () => {
    describe("parse", () => {
        test("parses all its own formatted values", () => {
            for (const value of CrmmUnfeatureMode.values()) {
                expect(CrmmUnfeatureMode.parse(CrmmUnfeatureMode.format(value))).toBe(value);
            }
        });

        test("parses all friendly names of its own values", () => {
            for (const value of CrmmUnfeatureMode.values()) {
                expect(CrmmUnfeatureMode.parse(CrmmUnfeatureMode.friendlyNameOf(value))).toBe(value);
            }
        });

        test("parses all its own formatted values in lowercase", () => {
            for (const value of CrmmUnfeatureMode.values()) {
                expect(CrmmUnfeatureMode.parse(CrmmUnfeatureMode.format(value).toLowerCase())).toBe(value);
            }
        });

        test("parses all its own formatted values in UPPERCASE", () => {
            for (const value of CrmmUnfeatureMode.values()) {
                expect(CrmmUnfeatureMode.parse(CrmmUnfeatureMode.format(value).toUpperCase())).toBe(value);
            }
        });
    });

    describe("isNone", () => {
        test("returns true if the mode is NONE", () => {
            expect(CrmmUnfeatureMode.isNone(CrmmUnfeatureMode.NONE)).toBe(true);
        });

        test("returns true if the mode is not NONE", () => {
            const modes = [...CrmmUnfeatureMode.values()].filter(x => x !== CrmmUnfeatureMode.NONE);

            for (const mode of modes) {
                expect(CrmmUnfeatureMode.isNone(mode)).toBe(false);
            }
        });
    });

    describe("isSubset", () => {
        test("returns true if the mode represents a subset mode", () => {
            expect(CrmmUnfeatureMode.isSubset(CrmmUnfeatureMode.LOADER_SUBSET)).toBe(true);
            expect(CrmmUnfeatureMode.isSubset(CrmmUnfeatureMode.GAME_VERSION_SUBSET)).toBe(true);
            expect(CrmmUnfeatureMode.isSubset(CrmmUnfeatureMode.VERSION_TYPE_SUBSET)).toBe(true);
            expect(CrmmUnfeatureMode.isSubset(CrmmUnfeatureMode.SUBSET)).toBe(true);
        });

        test("returns false if the mode doesn't represent a subset mode", () => {
            const modes = [...CrmmUnfeatureMode.values()]
                .filter(x => x !== CrmmUnfeatureMode.LOADER_SUBSET)
                .filter(x => x !== CrmmUnfeatureMode.GAME_VERSION_SUBSET)
                .filter(x => x !== CrmmUnfeatureMode.VERSION_TYPE_SUBSET)
                .filter(x => x !== CrmmUnfeatureMode.SUBSET);

            for (const mode of modes) {
                expect(CrmmUnfeatureMode.isSubset(mode)).toBe(false);
            }
        });
    });

    describe("isIntersection", () => {
        test("returns true if the mode represents an intersection mode", () => {
            expect(CrmmUnfeatureMode.isIntersection(CrmmUnfeatureMode.LOADER_INTERSECTION)).toBe(true);
            expect(CrmmUnfeatureMode.isIntersection(CrmmUnfeatureMode.GAME_VERSION_INTERSECTION)).toBe(true);
            expect(CrmmUnfeatureMode.isIntersection(CrmmUnfeatureMode.GAME_VERSION_INTERSECTION)).toBe(true);
            expect(CrmmUnfeatureMode.isIntersection(CrmmUnfeatureMode.INTERSECTION)).toBe(true);
        });

        test("returns false if the mode doesn't represent an intersection mode", () => {
            const modes = [...CrmmUnfeatureMode.values()]
                .filter(x => x !== CrmmUnfeatureMode.LOADER_INTERSECTION)
                .filter(x => x !== CrmmUnfeatureMode.GAME_VERSION_INTERSECTION)
                .filter(x => x !== CrmmUnfeatureMode.VERSION_TYPE_INTERSECTION)
                .filter(x => x !== CrmmUnfeatureMode.INTERSECTION);

            for (const mode of modes) {
                expect(CrmmUnfeatureMode.isIntersection(mode)).toBe(false);
            }
        });
    });

    describe("isAny", () => {
        test("returns true if the mode represents an any mode", () => {
            expect(CrmmUnfeatureMode.isAny(CrmmUnfeatureMode.NONE)).toBe(true);
            expect(CrmmUnfeatureMode.isAny(CrmmUnfeatureMode.LOADER_ANY)).toBe(true);
            expect(CrmmUnfeatureMode.isAny(CrmmUnfeatureMode.GAME_VERSION_ANY)).toBe(true);
            expect(CrmmUnfeatureMode.isAny(CrmmUnfeatureMode.VERSION_TYPE_ANY)).toBe(true);
            expect(CrmmUnfeatureMode.isAny(CrmmUnfeatureMode.ANY)).toBe(true);
        });

        test("returns false if the mode doesn't represent an any mode", () => {
            const modes = [...CrmmUnfeatureMode.values()]
                .filter(x => x !== CrmmUnfeatureMode.NONE)
                .filter(x => x !== CrmmUnfeatureMode.LOADER_ANY)
                .filter(x => x !== CrmmUnfeatureMode.GAME_VERSION_ANY)
                .filter(x => x !== CrmmUnfeatureMode.VERSION_TYPE_ANY)
                .filter(x => x !== CrmmUnfeatureMode.ANY);

            for (const mode of modes) {
                expect(CrmmUnfeatureMode.isAny(mode)).toBe(false);
            }
        });
    });

    describe("getGameVersionMode", () => {
        test("returns a game version-related mode", () => {
            expect(CrmmUnfeatureMode.getGameVersionMode(CrmmUnfeatureMode.NONE)).toBe(CrmmUnfeatureMode.GAME_VERSION_ANY);
            expect(CrmmUnfeatureMode.getGameVersionMode(CrmmUnfeatureMode.GAME_VERSION_ANY)).toBe(CrmmUnfeatureMode.GAME_VERSION_ANY);
            expect(CrmmUnfeatureMode.getGameVersionMode(CrmmUnfeatureMode.GAME_VERSION_INTERSECTION)).toBe(CrmmUnfeatureMode.GAME_VERSION_INTERSECTION);
            expect(CrmmUnfeatureMode.getGameVersionMode(CrmmUnfeatureMode.GAME_VERSION_SUBSET)).toBe(CrmmUnfeatureMode.GAME_VERSION_SUBSET);
            expect(CrmmUnfeatureMode.getGameVersionMode(CrmmUnfeatureMode.GAME_VERSION_SUBSET | CrmmUnfeatureMode.LOADER_INTERSECTION)).toBe(CrmmUnfeatureMode.GAME_VERSION_SUBSET);
            expect(CrmmUnfeatureMode.getGameVersionMode(CrmmUnfeatureMode.GAME_VERSION_SUBSET | CrmmUnfeatureMode.LOADER_INTERSECTION | CrmmUnfeatureMode.VERSION_TYPE_ANY)).toBe(CrmmUnfeatureMode.GAME_VERSION_SUBSET);
        });
    });

    describe("getVersionTypeMode", () => {
        test("returns a version type-related mode", () => {
            expect(CrmmUnfeatureMode.getVersionTypeMode(CrmmUnfeatureMode.NONE)).toBe(CrmmUnfeatureMode.VERSION_TYPE_ANY);
            expect(CrmmUnfeatureMode.getVersionTypeMode(CrmmUnfeatureMode.VERSION_TYPE_ANY)).toBe(CrmmUnfeatureMode.VERSION_TYPE_ANY);
            expect(CrmmUnfeatureMode.getVersionTypeMode(CrmmUnfeatureMode.VERSION_TYPE_INTERSECTION)).toBe(CrmmUnfeatureMode.VERSION_TYPE_INTERSECTION);
            expect(CrmmUnfeatureMode.getVersionTypeMode(CrmmUnfeatureMode.VERSION_TYPE_SUBSET)).toBe(CrmmUnfeatureMode.VERSION_TYPE_SUBSET);
            expect(CrmmUnfeatureMode.getVersionTypeMode(CrmmUnfeatureMode.VERSION_TYPE_SUBSET | CrmmUnfeatureMode.LOADER_INTERSECTION)).toBe(CrmmUnfeatureMode.VERSION_TYPE_SUBSET);
            expect(CrmmUnfeatureMode.getVersionTypeMode(CrmmUnfeatureMode.VERSION_TYPE_SUBSET | CrmmUnfeatureMode.LOADER_INTERSECTION | CrmmUnfeatureMode.GAME_VERSION_ANY)).toBe(CrmmUnfeatureMode.VERSION_TYPE_SUBSET);
        });
    });

    describe("getLoaderMode", () => {
        test("returns a loader-related mode", () => {
            expect(CrmmUnfeatureMode.getLoaderMode(CrmmUnfeatureMode.NONE)).toBe(CrmmUnfeatureMode.LOADER_ANY);
            expect(CrmmUnfeatureMode.getLoaderMode(CrmmUnfeatureMode.LOADER_ANY)).toBe(CrmmUnfeatureMode.LOADER_ANY);
            expect(CrmmUnfeatureMode.getLoaderMode(CrmmUnfeatureMode.LOADER_INTERSECTION)).toBe(CrmmUnfeatureMode.LOADER_INTERSECTION);
            expect(CrmmUnfeatureMode.getLoaderMode(CrmmUnfeatureMode.LOADER_SUBSET)).toBe(CrmmUnfeatureMode.LOADER_SUBSET);
            expect(CrmmUnfeatureMode.getLoaderMode(CrmmUnfeatureMode.LOADER_SUBSET | CrmmUnfeatureMode.GAME_VERSION_INTERSECTION)).toBe(CrmmUnfeatureMode.LOADER_SUBSET);
            expect(CrmmUnfeatureMode.getLoaderMode(CrmmUnfeatureMode.LOADER_SUBSET | CrmmUnfeatureMode.GAME_VERSION_INTERSECTION | CrmmUnfeatureMode.VERSION_TYPE_ANY)).toBe(CrmmUnfeatureMode.LOADER_SUBSET);
        });
    });

    describe("shouldUnfeature", () => {
        test("returns false if the previous version equals to the current one", () => {
            const previous = { id: "A" } as UnfeaturableCrmmVersion;
            const current = { id: "A" } as UnfeaturableCrmmVersion;
            const mode = CrmmUnfeatureMode.ANY;

            expect(CrmmUnfeatureMode.shouldUnfeature(previous, current, mode)).toBe(false);
        });

        test("always returns true (ANY)", () => {
            const previous = { id: "A", loaders: ["fabric"], game_versions: ["1.18.1"] } as UnfeaturableCrmmVersion;
            const current = { id: "B", loaders: ["neoforge", "quilt"], game_versions: ["1.18", "1.18.2"] } as UnfeaturableCrmmVersion;
            const mode = CrmmUnfeatureMode.ANY;

            expect(CrmmUnfeatureMode.shouldUnfeature(previous, current, mode)).toBe(true);
        });

        test("returns true if the previous version is a subset of the current one (SUBSET)", () => {
            const previous = { id: "A", loaders: ["fabric"], game_versions: ["1.18.1"] } as UnfeaturableCrmmVersion;
            const current = { id: "B", loaders: ["neoforge", "fabric", "quilt"], game_versions: ["1.18", "1.18.1", "1.18.2"] } as UnfeaturableCrmmVersion;
            const mode = CrmmUnfeatureMode.SUBSET;

            expect(CrmmUnfeatureMode.shouldUnfeature(previous, current, mode)).toBe(true);
        });

        test("returns false if the previous version is not a subset of the current one (SUBSET)", () => {
            const previous = { id: "A", loaders: ["fabric"], game_versions: ["1.18.1"] } as UnfeaturableCrmmVersion;
            const current = { id: "B", loaders: ["neoforge", "quilt"], game_versions: ["1.18", "1.18.1", "1.18.2"] } as UnfeaturableCrmmVersion;
            const mode = CrmmUnfeatureMode.SUBSET;

            expect(CrmmUnfeatureMode.shouldUnfeature(previous, current, mode)).toBe(false);
        });

        test("returns true if the previous version intersects with the current one (INTERSECTION)", () => {
            const previous = { id: "A", loaders: ["neoforge", "fabric", "quilt"], game_versions: ["1.18.1"] } as UnfeaturableCrmmVersion;
            const current = { id: "B", loaders: ["fabric"], game_versions: ["1.18", "1.18.1", "1.18.2"] } as UnfeaturableCrmmVersion;
            const mode = CrmmUnfeatureMode.INTERSECTION;

            expect(CrmmUnfeatureMode.shouldUnfeature(previous, current, mode)).toBe(true);
        });

        test("returns false if the previous version doesn't intersect with the current one (INTERSECTION)", () => {
            const previous = { id: "A", loaders: ["fabric"], game_versions: ["1.18.1"] } as UnfeaturableCrmmVersion;
            const current = { id: "B", loaders: ["neoforge", "quilt"], game_versions: ["1.18", "1.18.2"] } as UnfeaturableCrmmVersion;
            const mode = CrmmUnfeatureMode.INTERSECTION;

            expect(CrmmUnfeatureMode.shouldUnfeature(previous, current, mode)).toBe(false);
        });
    });
});
