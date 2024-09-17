import { GameVersionProvider } from "@/games/game-version-provider";
import { MojangApiClient } from "./mojang-api-client";

/**
 * A {@link GameVersionProvider} implementation that uses the Mojang API client to fetch Cosmic Reach versions.
 */
export const COSMIC_REACH_VERSION_PROVIDER: GameVersionProvider = MojangApiClient.prototype.getCosmicReachVersions.bind(new MojangApiClient());
