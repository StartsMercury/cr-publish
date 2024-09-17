import { VersionType } from "@/utils/versioning";
import { Enum, EnumOptions } from "@/utils/enum";

/**
 * Represents Cosmic Reach version types.
 *
 * @partial
 */
enum CosmicReachVersionTypeValues {
    /**
     * Represents the release version type of Cosmic Reach.
     */
    RELEASE = "release",

    /**
     * Represents the snapshot version type of Cosmic Reach.
     */
    SNAPSHOT = "snapshot",

    /**
     * Represents the old beta version type of Cosmic Reach.
     */
    OLD_BETA = "old_beta",

    /**
     * Represents the old alpha version type of Cosmic Reach.
     */
    OLD_ALPHA = "old_alpha",
}

/**
 * Options for configuring the behavior of the CosmicReachVersionType enum.
 *
 * @partial
 */
const CosmicReachVersionTypeOptions: EnumOptions = {
    /**
     * The case should be ignored while parsing the version type.
     */
    ignoreCase: true,

    /**
     * Non-word characters should be ignored while parsing the version type.
     */
    ignoreNonWordCharacters: true,
};

/**
 * Converts a `CosmicReachVersionType` value to a corresponding `VersionType` value.
 *
 * @param type - The Cosmic Reach version type to convert.
 * @param version - The Cosmic Reach version string, used for additional checks when the type is `Snapshot`.
 *
 * @returns The corresponding `VersionType` value.
 */
function toVersionType(type: CosmicReachVersionType, version?: string): VersionType {
    switch (type) {
        case CosmicReachVersionType.SNAPSHOT:
            return version?.match(/-pre|-rc|-beta|Pre-[Rr]elease|[Rr]elease Candidate/)
                ? VersionType.BETA
                : VersionType.ALPHA;

        case CosmicReachVersionType.OLD_BETA:
            return VersionType.BETA;

        case CosmicReachVersionType.OLD_ALPHA:
            return VersionType.ALPHA;

        default:
            return VersionType.RELEASE;
    }
}

/**
 * A collection of methods to work with CosmicReachVersionType.
 *
 * @partial
 */
const CosmicReachVersionTypeMethods = {
    toVersionType,
};

/**
 * Represents Cosmic Reach version types.
 */
export const CosmicReachVersionType = Enum.create(
    CosmicReachVersionTypeValues,
    CosmicReachVersionTypeOptions,
    CosmicReachVersionTypeMethods,
);

/**
 * Represents Cosmic Reach version types.
 */
export type CosmicReachVersionType = Enum<typeof CosmicReachVersionTypeValues>;
