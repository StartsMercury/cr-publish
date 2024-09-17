import { createFakeFetch } from "../../../utils/fetch-utils";
import { MOJANG_API_URL, MojangApiClient } from "@/games/cosmic-reach/mojang-api-client";

const MOJANG_FETCH = createFakeFetch({
    baseUrl: MOJANG_API_URL,

    GET: {
        "^\\/game\\/version_manifest_v2\\.json$": () => [__dirname, "../../../content/mojang/version_manifest_v2.json"],
    },
});

describe("MojangApiClient", () => {
    describe("getCosmicReachVersion", () => {
        test("returns a version with the specified id", async () => {
            const api = new MojangApiClient({ fetch: MOJANG_FETCH });

            expect(await api.getCosmicReachVersion("1.17")).toHaveProperty("id", "1.17");
            expect(await api.getCosmicReachVersion("1.16.5")).toHaveProperty("id", "1.16.5");
            expect(await api.getCosmicReachVersion("inf-20100618")).toHaveProperty("id", "inf-20100618");
            expect(await api.getCosmicReachVersion("13w26a")).toHaveProperty("id", "13w26a");
            expect(await api.getCosmicReachVersion("1.RV-Pre1")).toHaveProperty("id", "1.RV-Pre1");
            expect(await api.getCosmicReachVersion("1.14.2 Pre-Release 4")).toHaveProperty("id", "1.14.2 Pre-Release 4");
            expect(await api.getCosmicReachVersion("22w13oneblockatatime")).toHaveProperty("id", "22w13oneblockatatime");
            expect(await api.getCosmicReachVersion("23w46a")).toHaveProperty("id", "23w46a");
            expect(await api.getCosmicReachVersion("1.20.4")).toHaveProperty("id", "1.20.4");
        });

        test("returns undefined if a version with the specified id doesn't exist", async () => {
            const api = new MojangApiClient({ fetch: MOJANG_FETCH });

            expect(await api.getCosmicReachVersion("1.17.-1")).toBeUndefined();
            expect(await api.getCosmicReachVersion("1.16.6")).toBeUndefined();
            expect(await api.getCosmicReachVersion("inf-20100619")).toBeUndefined();
            expect(await api.getCosmicReachVersion("13w26d")).toBeUndefined();
            expect(await api.getCosmicReachVersion("1.RV-Pre2")).toBeUndefined();
            expect(await api.getCosmicReachVersion("1.14.2 Pre-Release 24")).toBeUndefined();
            expect(await api.getCosmicReachVersion("22w13twoblocksatatime")).toBeUndefined();
            expect(await api.getCosmicReachVersion("03w46a")).toBeUndefined();
            expect(await api.getCosmicReachVersion("Not a Cosmic Reach version")).toBeUndefined();
        });
    });

    describe("getCosmicReachVersions", () => {
        test("returns versions that satisfy the specified range", async () => {
            // ESLint doesn't allow us to use `expect` in `forEach`
            // because of the `no-loop-func` rule.
            // So, we need to copy it in a constant for ESLint to shut up.
            const $ = expect;

            const api = new MojangApiClient({ fetch: MOJANG_FETCH });

            const ranges = [
                ["1.17", 1, ["1.17"], ["1.16.5"]],
                [["1.17"], 1, ["1.17"], ["1.16.5"]],
                [">1.17 <=1.18", 27, ["1.17.1-pre1", "1.17.1", "21w44a", "1.18"], ["1.17", "1.18.1"]],
                [">1.17 <=1.18 || 1.17", 28, ["1.17", "1.17.1-pre1", "1.17.1", "21w44a", "1.18"], ["1.16.5", "1.18.1"]],
                [[">1.17 <=1.18", "1.17"], 28, ["1.17", "1.17.1-pre1", "1.17.1", "21w44a", "1.18"], ["1.16.5", "1.18.1"]],
                [["(1.17,1.18] || 1.17"], 28, ["1.17", "1.17.1-pre1", "1.17.1", "21w44a", "1.18"], ["1.16.5", "1.18.1"]],
                [["(1.17,1.18]", "1.17"], 28, ["1.17", "1.17.1-pre1", "1.17.1", "21w44a", "1.18"], ["1.16.5", "1.18.1"]],
                ["23w13a_or_b || 20w14infinite || 1.RV-Pre1 || 2.0", 3, ["23w13a_or_b", "20w14infinite", "1.RV-Pre1"], ["2.0"]],
                [["23w13a_or_b", "20w14infinite", "1.RV-Pre1", "2.0"], 3, ["23w13a_or_b", "20w14infinite", "1.RV-Pre1"], ["2.0"]],
            ] as const;

            for (const [range, length, includedVersions, excludedVersions] of ranges) {
                const versions = (await api.getCosmicReachVersions(range)).map(x => x.id);

                $(versions).toHaveLength(length);
                includedVersions.forEach((x: string) => $(versions).toContain(x));
                excludedVersions.forEach((x: string) => $(versions).not.toContain(x));
            }
        });

        test("returns an empty array if no version satisfy the specified range", async () => {
            const api = new MojangApiClient({ fetch: MOJANG_FETCH });

            expect(await api.getCosmicReachVersions(">=2.0 <3.0 || 99.0")).toHaveLength(0);
            expect(await api.getCosmicReachVersions(["[2.0,3.0)", "99.0"])).toHaveLength(0);
            expect(await api.getCosmicReachVersions("99.0")).toHaveLength(0);
            expect(await api.getCosmicReachVersions("Not a Cosmic Reach version")).toHaveLength(0);
        });
    });
});
