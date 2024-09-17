import { VersionType } from "@/utils/versioning/version-type";
import { CosmicReachVersionType } from "@/games/cosmic-reach/cosmic-reach-version-type";

describe("CosmicReachVersionType", () => {
    describe("CosmicReachVersionType.toVersionType", () => {
        test("returns `VersionType.BETA` for release candidates and pre-releases", () => {
            expect(CosmicReachVersionType.toVersionType(CosmicReachVersionType.SNAPSHOT, "1.17-pre3")).toBe(VersionType.BETA);
            expect(CosmicReachVersionType.toVersionType(CosmicReachVersionType.SNAPSHOT, "1.16.5-rc1")).toBe(VersionType.BETA);
            expect(CosmicReachVersionType.toVersionType(CosmicReachVersionType.SNAPSHOT, "1.14.1 Pre-Release 1")).toBe(VersionType.BETA);
        });

        test("returns `VersionType.ALPHA` for weekly-ish snapshots", () => {
            expect(CosmicReachVersionType.toVersionType(CosmicReachVersionType.SNAPSHOT, "14w34d")).toBe(VersionType.ALPHA);
            expect(CosmicReachVersionType.toVersionType(CosmicReachVersionType.SNAPSHOT, "16w32b")).toBe(VersionType.ALPHA);
            expect(CosmicReachVersionType.toVersionType(CosmicReachVersionType.SNAPSHOT, "20w14infinite")).toBe(VersionType.ALPHA);
            expect(CosmicReachVersionType.toVersionType(CosmicReachVersionType.SNAPSHOT)).toBe(VersionType.ALPHA);
        });

        test("returns `VersionType.BETA` for `CosmicReachVersionType.OLD_BETA`", () => {
            expect(CosmicReachVersionType.toVersionType(CosmicReachVersionType.OLD_BETA)).toBe(VersionType.BETA);
        });

        test("returns `VersionType.ALPHA` for `CosmicReachVersionType.OLD_ALPHA`", () => {
            expect(CosmicReachVersionType.toVersionType(CosmicReachVersionType.OLD_ALPHA)).toBe(VersionType.ALPHA);
        });

        test("returns `VersionType.RELEASE` for `CosmicReachVersionType.RELEASE`", () => {
            expect(CosmicReachVersionType.toVersionType(CosmicReachVersionType.RELEASE)).toBe(VersionType.RELEASE);
        });
    });

    describe("parse", () => {
        test("parses all its own formatted values", () => {
            for (const value of CosmicReachVersionType.values()) {
                expect(CosmicReachVersionType.parse(CosmicReachVersionType.format(value))).toBe(value);
            }
        });

        test("parses all friendly names of its own values", () => {
            for (const value of CosmicReachVersionType.values()) {
                expect(CosmicReachVersionType.parse(CosmicReachVersionType.friendlyNameOf(value))).toBe(value);
            }
        });

        test("parses all its own formatted values in lowercase", () => {
            for (const value of CosmicReachVersionType.values()) {
                expect(CosmicReachVersionType.parse(CosmicReachVersionType.format(value).toLowerCase())).toBe(value);
            }
        });

        test("parses all its own formatted values in UPPERCASE", () => {
            for (const value of CosmicReachVersionType.values()) {
                expect(CosmicReachVersionType.parse(CosmicReachVersionType.format(value).toUpperCase())).toBe(value);
            }
        });
    });
});
