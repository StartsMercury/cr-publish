/**
 * Represents a CRMM game version.
 */
export interface CrmmGameVersion {
    /**
     * The name of the game version.
     */
    label: string;

    /**
     * The number of the game version.
     */
    value: string;

    /**
     * The type of the game version.
     */
    releaseType: "release" | "snapshot" | "beta" | "alpha" | "pre-alpha";

    /**
     * Whether or not this is a major version, used for Featured Versions.
     */
    major: boolean;
}
