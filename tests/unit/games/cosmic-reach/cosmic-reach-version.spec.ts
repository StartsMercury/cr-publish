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
            const cosmic-reachVersion = new CosmicReachVersion(id, version, type, url, date);

            expect(cosmic-reachVersion.id).toBe(id);
            expect(cosmic-reachVersion.version).toBe(version);
            expect(cosmic-reachVersion.type).toBe(VersionType.RELEASE);
            expect(cosmic-reachVersion.url).toBe(url);
            expect(cosmic-reachVersion.releaseDate).toBe(date);
            expect(cosmic-reachVersion.isAlpha).toBe(false);
            expect(cosmic-reachVersion.isBeta).toBe(false);
            expect(cosmic-reachVersion.isSnapshot).toBe(false);
            expect(cosmic-reachVersion.isRelease).toBe(true);
            expect(cosmic-reachVersion.isOldAlpha).toBe(false);
            expect(cosmic-reachVersion.isOldBeta).toBe(false);
        });
    });

    describe("isRelease", () => {
        test("returns true for releases", () => {
            const cosmic-reachVersion = new CosmicReachVersion("1.17", parseVersion("1.17"), CosmicReachVersionType.RELEASE, "", new Date());
            expect(cosmic-reachVersion.isRelease).toBe(true);
        });

        test("returns false for snapshots", () => {
            const cosmic-reachVersion = new CosmicReachVersion("1.17-rc1", parseVersion("1.17-rc.1"), CosmicReachVersionType.SNAPSHOT, "", new Date());
            expect(cosmic-reachVersion.isRelease).toBe(false);
        });
    });

    describe("isSnapshot", () => {
        test("returns true for snapshots", () => {
            const cosmic-reachVersion = new CosmicReachVersion("1.17-rc1", parseVersion("1.17-rc.1"), CosmicReachVersionType.SNAPSHOT, "", new Date());
            expect(cosmic-reachVersion.isSnapshot).toBe(true);
        });

        test("returns false for releases", () => {
            const cosmic-reachVersion = new CosmicReachVersion("1.17", parseVersion("1.17"), CosmicReachVersionType.RELEASE, "", new Date());
            expect(cosmic-reachVersion.isSnapshot).toBe(false);
        });
    });

    describe("isOldAlpha", () => {
        test("returns true for old alpha versions", () => {
            const cosmic-reachVersion = new CosmicReachVersion("a1.0.4", parseVersion("1.0.0-alpha.0.4"), CosmicReachVersionType.OLD_ALPHA, "", new Date());
            expect(cosmic-reachVersion.isOldAlpha).toBe(true);
        });

        test("returns false for modern versions", () => {
            const cosmic-reachVersion = new CosmicReachVersion("1.17", parseVersion("1.17"), CosmicReachVersionType.RELEASE, "", new Date());
            expect(cosmic-reachVersion.isOldAlpha).toBe(false);
        });
    });

    describe("isOldBeta", () => {
        test("returns true for old beta versions", () => {
            const cosmic-reachVersion = new CosmicReachVersion("b1.5_01", parseVersion("1.0.0-beta.5.1"), CosmicReachVersionType.OLD_BETA, "", new Date());
            expect(cosmic-reachVersion.isOldBeta).toBe(true);
        });

        test("returns false for modern versions", () => {
            const cosmic-reachVersion = new CosmicReachVersion("1.17", parseVersion("1.17"), CosmicReachVersionType.RELEASE, "", new Date());
            expect(cosmic-reachVersion.isOldBeta).toBe(false);
        });
    });

    describe("toString", () => {
        test("returns the version identifier", () => {
            const cosmic-reachVersion = new CosmicReachVersion("1.17-rc1", parseVersion("1.17-rc.1"), CosmicReachVersionType.SNAPSHOT, "", new Date());
            expect(cosmic-reachVersion.toString()).toBe("1.17-rc1");
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
