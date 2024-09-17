import { COSMIC_REACH_VERSION_PROVIDER } from "@/games/cosmic-reach/cosmic-reach-version-provider";

describe("COSMIC_REACH_VERSION_PROVIDER", () => {
    test("is callable", () => {
        expect(typeof COSMIC_REACH_VERSION_PROVIDER).toBe("function");
    });
});
