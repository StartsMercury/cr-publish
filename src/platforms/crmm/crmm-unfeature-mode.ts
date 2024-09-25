import { asArray, asArrayLike, isIterable } from "@/utils/collections";
import { Enum, EnumOptions } from "@/utils/enum";
import { VersionType } from "@/utils/versioning";
import { UnfeaturableCrmmVersion } from "./crmm-version";

/**
 * Represents the modes for unfeaturing CRMM versions.
 *
 * @partial
 */
enum CrmmUnfeatureModeValues {
    /**
     * No unfeature mode.
     */
    NONE = 0,

    /**
     * Unfeature mode for game version subset.
     */
    GAME_VERSION_SUBSET = 1,

    /**
     * Unfeature mode for version intersection.
     */
    GAME_VERSION_INTERSECTION = 2,

    /**
     * Unfeature mode for any version.
     */
    GAME_VERSION_ANY = 4,

    /**
     * Unfeature mode for version type subset.
     */
    VERSION_TYPE_SUBSET = 8,

    /**
     * Unfeature mode for version type intersection.
     */
    VERSION_TYPE_INTERSECTION = 16,

    /**
     * Unfeature mode for any version type.
     */
    VERSION_TYPE_ANY = 32,

    /**
     * Unfeature mode for loader subset.
     */
    LOADER_SUBSET = 64,

    /**
     * Unfeature mode for loader intersection.
     */
    LOADER_INTERSECTION = 128,

    /**
     * Unfeature mode for any loader.
     */
    LOADER_ANY = 256,

    /**
     * Unfeature mode for a subset of game versions, loaders, and version types.
     */
    SUBSET = GAME_VERSION_SUBSET | VERSION_TYPE_SUBSET | LOADER_SUBSET,

    /**
     * Unfeature mode for an intersection of game versions, loaders, and version types.
     */
    INTERSECTION = GAME_VERSION_INTERSECTION | VERSION_TYPE_INTERSECTION | LOADER_INTERSECTION,

    /**
     * Unfeature mode for any game version, loader, or version type.
     */
    ANY = GAME_VERSION_ANY | VERSION_TYPE_ANY | LOADER_ANY,
}

/**
 * Options for configuring the behavior of the CrmmUnfeatureMode enum.
 *
 * @partial
 */
const CrmmUnfeatureModeOptions: EnumOptions = {
    /**
     * `CrmmUnfeatureMode` is a flag-based enum.
     */
    hasFlags: true,

    /**
     * The case should be ignored while parsing the unfeature mode.
     */
    ignoreCase: true,

    /**
     * Non-word characters should be ignored while parsing the unfeature mode.
     */
    ignoreNonWordCharacters: true,
};

/**
 * Determines if the given unfeature mode is the "none" mode.
 *
 * @param mode - The unfeature mode.
 *
 * @returns `true` if the mode is "none"; otherwise, `false`.
 */
function isNone(mode: CrmmUnfeatureMode): boolean {
    return mode === CrmmUnfeatureMode.NONE;
}

/**
 * Determines if the given unfeature mode is a subset mode.
 *
 * @param mode - The unfeature mode.
 *
 * @returns `true` if the mode is a subset mode; otherwise, `false`.
 */
function isSubset(mode: CrmmUnfeatureMode): boolean {
    return (
        CrmmUnfeatureMode.hasFlag(mode, CrmmUnfeatureMode.GAME_VERSION_SUBSET) ||
        CrmmUnfeatureMode.hasFlag(mode, CrmmUnfeatureMode.VERSION_TYPE_SUBSET) ||
        CrmmUnfeatureMode.hasFlag(mode, CrmmUnfeatureMode.LOADER_SUBSET)
    );
}

/**
 * Determines if the given unfeature mode is an intersection mode.
 *
 * @param mode - The unfeature mode.
 *
 * @returns `true` if the mode is an intersection mode; otherwise, `false`.
 */
function isIntersection(mode: CrmmUnfeatureMode): boolean {
    return (
        CrmmUnfeatureMode.hasFlag(mode, CrmmUnfeatureMode.GAME_VERSION_INTERSECTION) ||
        CrmmUnfeatureMode.hasFlag(mode, CrmmUnfeatureMode.VERSION_TYPE_INTERSECTION) ||
        CrmmUnfeatureMode.hasFlag(mode, CrmmUnfeatureMode.LOADER_INTERSECTION)
    );
}

/**
 * Determines if the given unfeature mode is an "any" mode.
 *
 * @param mode - The unfeature mode.
 *
 * @returns `true` if the mode is an "any" mode; otherwise, `false`.
 */
function isAny(mode: CrmmUnfeatureMode): boolean {
    return !isSubset(mode) && !isIntersection(mode);
}

/**
 * Retrieves the version-specific unfeature mode from the composite unfeature mode.
 *
 * @param mode - The unfeature mode.
 *
 * @returns The version-specific unfeature mode.
 */
function getGameVersionMode(mode: CrmmUnfeatureMode): CrmmUnfeatureMode {
    if (CrmmUnfeatureMode.hasFlag(mode, CrmmUnfeatureMode.GAME_VERSION_SUBSET)) {
        return CrmmUnfeatureMode.GAME_VERSION_SUBSET;
    }

    if (CrmmUnfeatureMode.hasFlag(mode, CrmmUnfeatureMode.GAME_VERSION_INTERSECTION)) {
        return CrmmUnfeatureMode.GAME_VERSION_INTERSECTION;
    }

    return CrmmUnfeatureMode.GAME_VERSION_ANY;
}

/**
 * Retrieves the version type-specific unfeature mode from the given composite unfeature mode.
 *
 * @param mode - The unfeature mode.
 *
 * @returns The version type-specific unfeature mode.
 */
function getVersionTypeMode(mode: CrmmUnfeatureMode): CrmmUnfeatureMode {
    if (CrmmUnfeatureMode.hasFlag(mode, CrmmUnfeatureMode.VERSION_TYPE_SUBSET)) {
        return CrmmUnfeatureMode.VERSION_TYPE_SUBSET;
    }

    if (CrmmUnfeatureMode.hasFlag(mode, CrmmUnfeatureMode.VERSION_TYPE_INTERSECTION)) {
        return CrmmUnfeatureMode.VERSION_TYPE_INTERSECTION;
    }

    return CrmmUnfeatureMode.VERSION_TYPE_ANY;
}

/**
 * Retrieves the loader-specific unfeature mode from the given composite unfeature mode.
 *
 * @param mode - The unfeature mode.
 *
 * @returns The loader-specific unfeature mode.
 */
function getLoaderMode(mode: CrmmUnfeatureMode): CrmmUnfeatureMode {
    if (CrmmUnfeatureMode.hasFlag(mode, CrmmUnfeatureMode.LOADER_SUBSET)) {
        return CrmmUnfeatureMode.LOADER_SUBSET;
    }

    if (CrmmUnfeatureMode.hasFlag(mode, CrmmUnfeatureMode.LOADER_INTERSECTION)) {
        return CrmmUnfeatureMode.LOADER_INTERSECTION;
    }

    return CrmmUnfeatureMode.LOADER_ANY;
}

/**
 * Determines if the `previous` value satisfies the given unfeature condition.
 *
 * @param previous - The previous value.
 * @param current - The current value.
 * @param mode - The unfeature mode.
 *
 * @returns `true` if the `previous` value satisfies the given unfeature condition; otherwise, `false`.
 */
function satisfies<T>(previous: T, current: T, mode: CrmmUnfeatureMode): boolean {
    if (isAny(mode)) {
        return true;
    }

    // If the provided items are scalars, the only way the could intersect with each other
    // or one be a subset of another is for them to be strictly equal.
    // This way we cover both possibilities at the same time.
    if (!isIterable(current) || !isIterable(previous)) {
        return current === previous;
    }

    const currentArray = asArray(current);
    if (isSubset(mode)) {
        return asArrayLike(previous).every(x => currentArray.includes(x));
    }

    // isIntersection(mode) === true
    return asArrayLike(previous).some(x => currentArray.includes(x));
}

/**
 * Determines if the `previous` version should be unfeatured based on the given unfeature mode.
 *
 * @param previous - The previous version.
 * @param current - The current version.
 * @param mode - The unfeature mode.
 *
 * @returns `true` if the `previous` version should be unfeatured based on the given unfeature mode; otherwise, `false`.
 */
function shouldUnfeature(previous: UnfeaturableCrmmVersion, current: UnfeaturableCrmmVersion, mode: CrmmUnfeatureMode): boolean {
    if (previous.id === current.id) {
        return false;
    }

    const gameVersionMode = getGameVersionMode(mode);
    const versionTypeMode = getVersionTypeMode(mode);
    const loaderMode = getLoaderMode(mode);

    return (
        satisfies(previous.gameVersions || [], current.gameVersions || [], gameVersionMode) &&
        satisfies(previous.type || VersionType.RELEASE, current.type || VersionType.RELEASE, versionTypeMode) &&
        satisfies(previous.loaders || [], current.loaders || [], loaderMode)
    );
}

/**
 * A collection of methods to work with CrmmUnfeatureMode.
 *
 * @partial
 */
const CrmmUnfeatureModeMethods = {
    isNone,
    isSubset,
    isIntersection,
    isAny,
    getGameVersionMode,
    getVersionTypeMode,
    getLoaderMode,
    shouldUnfeature,
};

/**
 * Represents the modes for unfeaturing CRMM versions.
 */
export const CrmmUnfeatureMode = Enum.create(
    CrmmUnfeatureModeValues,
    CrmmUnfeatureModeOptions,
    CrmmUnfeatureModeMethods,
);

/**
 * Represents the modes for unfeaturing CRMM versions.
 */
export type CrmmUnfeatureMode = Enum<typeof CrmmUnfeatureModeValues>;
