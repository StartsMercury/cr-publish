import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseVersion } from "@/utils/versioning/version";
import { VersionType } from "@/utils/versioning/version-type";
import { CosmicReachVersionType } from "@/games/cosmic-reach/cosmic-reach-version-type";
import { CosmicReachVersion, CosmicReachVersionManifest, getCosmicReachVersionManifestEntries } from "@/games/cosmic-reach/cosmic-reach-version";

describe("CosmicReachVersion", () => {
    describe("constructors", () => {
        test("constructs a new CosmicReachVersion instance", () => {
            const id = "1.17";
            const version = parseVersion(id);
            const type = CosmicReachVersionType.RELEASE;
            const url = "https://piston-meta.mojang.com/v1/packages/0d9ace8a2ecfd1f4c782786f4b985a499240ff12/1.17.json";
            const date = new Date("2021-06-08T11:00:40+00:00");
            const cosmicReachVersion = new CosmicReachVersion(id, version, type, url, date);

            expect(cosmicReachVersion.id).toBe(id);
            expect(cosmicReachVersion.version).toBe(version);
            expect(cosmicReachVersion.type).toBe(VersionType.RELEASE);
            expect(cosmicReachVersion.url).toBe(url);
            expect(cosmicReachVersion.releaseDate).toBe(date);
            expect(cosmicReachVersion.isAlpha).toBe(false);
            expect(cosmicReachVersion.isBeta).toBe(false);
            expect(cosmicReachVersion.isSnapshot).toBe(false);
            expect(cosmicReachVersion.isRelease).toBe(true);
            expect(cosmicReachVersion.isOldAlpha).toBe(false);
            expect(cosmicReachVersion.isOldBeta).toBe(false);
        });
    });

    describe("isRelease", () => {
        test("returns true for releases", () => {
            const cosmicReachVersion = new CosmicReachVersion("1.17", parseVersion("1.17"), CosmicReachVersionType.RELEASE, "", new Date());
            expect(cosmicReachVersion.isRelease).toBe(true);
        });

        test("returns false for snapshots", () => {
            const cosmicReachVersion = new CosmicReachVersion("1.17-rc1", parseVersion("1.17-rc.1"), CosmicReachVersionType.SNAPSHOT, "", new Date());
            expect(cosmicReachVersion.isRelease).toBe(false);
        });
    });

    describe("isSnapshot", () => {
        test("returns true for snapshots", () => {
            const cosmicReachVersion = new CosmicReachVersion("1.17-rc1", parseVersion("1.17-rc.1"), CosmicReachVersionType.SNAPSHOT, "", new Date());
            expect(cosmicReachVersion.isSnapshot).toBe(true);
        });

        test("returns false for releases", () => {
            const cosmicReachVersion = new CosmicReachVersion("1.17", parseVersion("1.17"), CosmicReachVersionType.RELEASE, "", new Date());
            expect(cosmicReachVersion.isSnapshot).toBe(false);
        });
    });

    describe("isOldAlpha", () => {
        test("returns true for old alpha versions", () => {
            const cosmicReachVersion = new CosmicReachVersion("a1.0.4", parseVersion("1.0.0-alpha.0.4"), CosmicReachVersionType.OLD_ALPHA, "", new Date());
            expect(cosmicReachVersion.isOldAlpha).toBe(true);
        });

        test("returns false for modern versions", () => {
            const cosmicReachVersion = new CosmicReachVersion("1.17", parseVersion("1.17"), CosmicReachVersionType.RELEASE, "", new Date());
            expect(cosmicReachVersion.isOldAlpha).toBe(false);
        });
    });

    describe("isOldBeta", () => {
        test("returns true for old beta versions", () => {
            const cosmicReachVersion = new CosmicReachVersion("b1.5_01", parseVersion("1.0.0-beta.5.1"), CosmicReachVersionType.OLD_BETA, "", new Date());
            expect(cosmicReachVersion.isOldBeta).toBe(true);
        });

        test("returns false for modern versions", () => {
            const cosmicReachVersion = new CosmicReachVersion("1.17", parseVersion("1.17"), CosmicReachVersionType.RELEASE, "", new Date());
            expect(cosmicReachVersion.isOldBeta).toBe(false);
        });
    });

    describe("toString", () => {
        test("returns the version identifier", () => {
            const cosmicReachVersion = new CosmicReachVersion("1.17-rc1", parseVersion("1.17-rc.1"), CosmicReachVersionType.SNAPSHOT, "", new Date());
            expect(cosmicReachVersion.toString()).toBe("1.17-rc1");
        });
    });
});

describe("getCosmicReachVersionManifestEntries", () => {
    const manifest : CosmicReachVersionManifest = JSON.parse(
        readFileSync(resolve(__dirname, "../../../content/mojang/version_manifest_v2.json"), "utf8")
    );

    test("returns correct number of entries", () => {
        const entries = getCosmicReachVersionManifestEntries(manifest);

        expect(entries.length).toBe(manifest.versions.length);
    });

    test("entries have correct releaseDate property", () => {
        const entries = getCosmicReachVersionManifestEntries(manifest);

        for (const entry of entries) {
            expect(entry.releaseDate).toEqual(new Date(entry.releaseTime));
        }
    });

    test("entries are sorted by releaseDate in descending order", () => {
        const entries = getCosmicReachVersionManifestEntries(manifest);

        for (let i = 0; i < entries.length - 1; i++) {
            expect(entries[i].releaseDate.valueOf()).toBeGreaterThanOrEqual(entries[i + 1].releaseDate.valueOf());
        }
    });
});
