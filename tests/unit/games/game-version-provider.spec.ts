import { getGameVersionProviderByName } from "@/games/game-version-provider";

describe("getGameVersionProviderByName", () => {
    test("returns the correct provider for a given game name", () => {
        const provider = getGameVersionProviderByName("cosmic-reach");

        expect(provider).toBeDefined();
    });

    test("returns undefined for a non-existing game name", () => {
        const provider = getGameVersionProviderByName("unknown-game");

        expect(provider).toBeUndefined();
    });
});
