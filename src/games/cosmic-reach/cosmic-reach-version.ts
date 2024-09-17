import { GameVersion } from "@/games/game-version";
import { Version, VersionType } from "@/utils/versioning";
import { CosmicReachVersionType } from "./cosmic-reach-version-type";

/**
 * Represents a Cosmic Reach version.
 */
export class CosmicReachVersion implements GameVersion {
    /**
     * The version identifier.
     */
    private readonly _id: string;

    /**
     * The parsed version information.
     */
    private readonly _version: Version;

    /**
     * The original Cosmic Reach version type.
     */
    private readonly _mcType: CosmicReachVersionType;

    /**
     * The normalized version type.
     */
    private readonly _type: VersionType;

    /**
     * The URL for the version's metadata.
     */
    private readonly _url: string;

    /**
     * The release date of the version.
     */
    private readonly _releaseDate: Date;

    /**
     * Constructs a new {@link CosmicReachVersion} instance.
     *
     * @param id - The version identifier.
     * @param version - The parsed version information.
     * @param type - The Cosmic Reach version type.
     * @param url - The URL for the version's metadata.
     * @param releaseDate - The release date of the version.
     */
    constructor(id: string, version: Version, type: CosmicReachVersionType, url: string, releaseDate: Date) {
        this._id = id;
        this._version = version;
        this._mcType = type;
        this._type = CosmicReachVersionType.toVersionType(type, String(version));
        this._url = url;
        this._releaseDate = releaseDate;
    }

    /**
     * Returns the version identifier.
     */
    get id(): string {
        return this._id;
    }

    /**
     * Returns the parsed version information.
     */
    get version(): Version {
        return this._version;
    }

    /**
     * Returns the version type.
     */
    get type(): VersionType {
        return this._type;
    }

    /**
     * Returns the URL for the version's metadata.
     */
    get url(): string {
        return this._url;
    }

    /**
     * Returns the release date of the version.
     */
    get releaseDate(): Date {
        return this._releaseDate;
    }

    /**
     * Returns `true` if the version is an alpha version.
     */
    get isAlpha(): boolean {
        return this._type === VersionType.ALPHA;
    }

    /**
     * Returns `true` if the version is a beta version.
     */
    get isBeta(): boolean {
        return this._type === VersionType.BETA;
    }

    /**
     * Returns `true` if the version is a snapshot version.
     */
    get isSnapshot(): boolean {
        return !this.isRelease;
    }

    /**
     * Returns `true` if the version is a release version.
     */
    get isRelease(): boolean {
        return this._type === VersionType.RELEASE;
    }

    /**
     * Returns `true` if the version is an old alpha version.
     */
    get isOldAlpha(): boolean {
        return this._mcType === CosmicReachVersionType.OLD_ALPHA;
    }

    /**
     * Returns `true` if the version is an old beta version.
     */
    get isOldBeta(): boolean {
        return this._mcType === CosmicReachVersionType.OLD_BETA;
    }

    /**
     * Returns the version identifier as a string.
     */
    toString(): string {
        return this._id;
    }
}

/**
 * Represents the structure of the Cosmic Reach version manifest.
 */
export interface CosmicReachVersionManifest {
    /**
     * Contains information about the latest release and snapshot versions.
     */
    latest: {
        /**
         * The latest release version identifier.
         */
        release: string;

        /**
         * The latest snapshot version identifier.
         */
        snapshot: string;
    };

    /**
     * An array of raw Cosmic Reach version manifest entries.
     */
    versions: RawCosmicReachVersionManifestEntry[];
}

/**
 * Represents the raw Cosmic Reach version manifest entry.
 */
interface RawCosmicReachVersionManifestEntry {
    /**
     * The version identifier.
     */
    id: string;

    /**
     * The version type.
     */
    type: CosmicReachVersionType;

    /**
     * The URL for the version's metadata.
     */
    url: string;

    /**
     * The time the version was added to the manifest.
     */
    time: string;

    /**
     * The release time of the version.
     */
    releaseTime: string;

    /**
     * The SHA1 hash of the version and therefore the JSON file ID.
     */
    sha1: string;

    /**
     * If `0`, the launcher warns the user about this version not being recent enough to support the latest player safety features.
     *
     * Its value is `1` otherwise.
     */
    complianceLevel: number;
}

/**
 * Represents the processed Cosmic Reach version manifest entry.
 */
export interface CosmicReachVersionManifestEntry extends RawCosmicReachVersionManifestEntry {
    /**
     * The release date of the version.
     */
    releaseDate: Date;
}

/**
 * Returns an array of Cosmic Reach version manifest entries.
 *
 * @param manifest - The Cosmic Reach version manifest.
 *
 * @returns An array of Cosmic Reach version manifest entries.
 */
export function getCosmicReachVersionManifestEntries(manifest: CosmicReachVersionManifest): CosmicReachVersionManifestEntry[] {
    return manifest.versions
        .map(x => ({ ...x, releaseDate: new Date(x.releaseTime) }))
        .sort((a, b) => b.releaseDate.valueOf() - a.releaseDate.valueOf());
}
