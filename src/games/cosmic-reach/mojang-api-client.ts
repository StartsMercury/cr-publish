import { Fetch, createFetch, throwOnError } from "@/utils/net";
import { VersionRange, parseVersion } from "@/utils/versioning";
import { $i } from "@/utils/collections";
import { CosmicReachVersion, CosmicReachVersionManifest, getCosmicReachVersionManifestEntries } from "./cosmic-reach-version";
import { getCosmicReachVersionRegExp, normalizeCosmicReachVersion, normalizeCosmicReachVersionRange } from "./cosmic-reach-version-lookup";

/**
 * The default base URL for the Mojang API.
 */
export const MOJANG_API_URL = "https://piston-meta.mojang.com/mc";

/**
 * Describes the configuration options for the Mojang API client.
 */
export interface MojangApiOptions {
    /**
     * The Fetch implementation used for making HTTP requests.
     */
    fetch?: Fetch;

    /**
     * The base URL for the Mojang API.
     *
     * Defaults to {@link MOJANG_API_URL}.
     */
    baseUrl?: string | URL;
}

/**
 * A client for interacting with the Mojang API.
 */
export class MojangApiClient {
    /**
     * The Fetch implementation used for making HTTP requests.
     */
    private readonly _fetch: Fetch;

    /**
     * A cached map of all available Cosmic Reach versions.
     */
    private _versions?: ReadonlyMap<string, CosmicReachVersion>;

    /**
     * A cached regular expression for matching Cosmic Reach version strings.
     */
    private _versionRegExp?: RegExp;

    /**
     * Creates a new {@link MojangApiClient} instance.
     *
     * @param options - The configuration options for the client.
     */
    constructor(options?: MojangApiOptions) {
        this._fetch = createFetch({
            handler: options?.fetch,
            baseUrl: options?.baseUrl || options?.fetch?.["baseUrl"] || MOJANG_API_URL,
        })
        .use(throwOnError());
    }

    /**
     * Retrieves a specific Cosmic Reach version by its ID.
     *
     * @param id - The ID of the Cosmic Reach version to retrieve.
     *
     * @returns A promise that resolves to the Cosmic Reach version, or `undefined` if not found.
     */
    async getCosmicReachVersion(id: string): Promise<CosmicReachVersion | undefined> {
        const versions = await this.getAllCosmicReachVersions();
        const version = versions.get(id);
        if (version) {
            return version;
        }

        const versionRange = await this.getCosmicReachVersions(id);
        return versionRange[0];
    }

    /**
     * Retrieves a list of Cosmic Reach versions that match the specified range.
     *
     * @param range - A version range to match.
     *
     * @returns A promise that resolves to an array of matching Cosmic Reach versions.
     */
    async getCosmicReachVersions(range: string | Iterable<string> | VersionRange): Promise<CosmicReachVersion[]> {
        const versions = await this.getAllCosmicReachVersions();
        const regex = await this.getCosmicReachVersionRegExp();
        const normalizedRange = normalizeCosmicReachVersionRange(range, versions, regex);

        return $i(versions.values()).filter(x => normalizedRange.includes(x.version)).toArray();
    }

    /**
     * Retrieves all available Cosmic Reach versions.
     *
     * @returns A promise that resolves to a map of Cosmic Reach versions keyed by their IDs.
     */
    private async getAllCosmicReachVersions(): Promise<ReadonlyMap<string, CosmicReachVersion>> {
        if (this._versions) {
            return this._versions;
        }

        const response = await this._fetch("/game/version_manifest_v2.json");
        const manifest = await response.json<CosmicReachVersionManifest>();
        const manifestEntries = getCosmicReachVersionManifestEntries(manifest);

        const versions = manifestEntries.map((entry, i, self) => {
            const normalizedVersion = normalizeCosmicReachVersion(entry.id, self, i);
            const version = parseVersion(normalizedVersion);
            return new CosmicReachVersion(entry.id, version, entry.type, entry.url, entry.releaseDate);
        });

        this._versions = new Map(versions.map(x => [x.id, x]));
        return this._versions;
    }

    /**
     * Retrieves a regular expression for matching Cosmic Reach version strings.
     *
     * @returns A promise that resolves to a `RegExp` for matching Cosmic Reach version strings.
     */
    private async getCosmicReachVersionRegExp(): Promise<RegExp> {
        if (this._versionRegExp) {
            return this._versionRegExp;
        }

        const versions = await this.getAllCosmicReachVersions();
        this._versionRegExp = getCosmicReachVersionRegExp(versions.keys());
        return this._versionRegExp;
    }
}
