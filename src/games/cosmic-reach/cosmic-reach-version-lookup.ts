/* eslint-disable no-cond-assign */

import { asArrayLike, isIterable } from "@/utils/collections";
import { VersionRange, noneVersionRange, parseVersionRange } from "@/utils/versioning";
import { CosmicReachVersion, CosmicReachVersionManifestEntry } from "./cosmic-reach-version";
import { CosmicReachVersionType } from "./cosmic-reach-version-type";

/**
 * The regular expression pattern to match various Cosmic Reach version strings.
 */
const VERSION_PATTERN = (
    "0\\.\\d+(?:\\.\\d+)?a?(?:_\\d+)?|" +
    "\\d+\\.\\d+(?:\\.\\d+)?(?:-pre\\d+| Pre-[Rr]elease \\d+|-rc\\d+| [Rr]elease Candidate \\d+)?|" +
    "\\d+w\\d+(?:[a-z]+|~)|" +
    "[a-c]\\d\\.\\d+(?:\\.\\d+)?[a-z]?(?:_\\d+)?[a-z]?|" +
    "(Alpha|Beta) v?\\d+\\.\\d+(?:\\.\\d+)?[a-z]?(?:_\\d+)?[a-z]?|" +
    "Inf?dev (?:0\\.31 )?\\d+(?:-\\d+)?|" +
    "(?:rd|inf)-\\d+|" +
    "(?:.*[Ee]xperimental [Ss]napshot )(?:\\d+)"
);

/**
 * Regular expression for matching and validating Cosmic Reach version strings.
 */
const VERSION_REGEX = new RegExp(VERSION_PATTERN);

/**
 * Regular expression for matching and validating release Cosmic Reach versions.
 */
const RELEASE_REGEX = /\d+\.\d+(\.\d+)?/;

/**
 * Regular expression for matching and validating pre-release Cosmic Reach versions.
 */
const PRE_RELEASE_REGEX = /.+(?:-pre| Pre-[Rr]elease )(\d+)/;

/**
 * Regular expression for matching and validating release candidate Cosmic Reach versions.
 */
const RELEASE_CANDIDATE_REGEX = /.+(?:-rc| [Rr]elease Candidate )(\d+)/;

/**
 * Regular expression for matching and validating snapshot Cosmic Reach versions.
 */
const SNAPSHOT_REGEX = /(?:Snapshot )?(\d+)w0?(0|[1-9]\d*)([a-z])/;

/**
 * Regular expression for matching and validating experimental snapshot Cosmic Reach versions.
 */
const EXPERIMENTAL_REGEX = /(?:.*[Ee]xperimental [Ss]napshot )(\d+)/;

/**
 * Regular expression for matching and validating beta Cosmic Reach versions.
 */
const BETA_REGEX = /(?:b|Beta v?)1\.(\d+(\.\d+)?[a-z]?(_\d+)?[a-z]?)/;

/**
 * Regular expression for matching and validating alpha Cosmic Reach versions.
 */
const ALPHA_REGEX = /(?:a|Alpha v?)[01]\.(\d+(\.\d+)?[a-z]?(_\d+)?[a-z]?)/;

/**
 * Regular expression for matching and validating in-development Cosmic Reach versions.
 */
const INDEV_REGEX = /(?:inf-|Inf?dev )(?:0\.31 )?(\d+(-\d+)?)/;

/**
 * Represents the range of legacy Cosmic Reach versions.
 *
 * It is used to determine if a given Cosmic Reach version string is considered a legacy version or not.
 * In our case, versions less than or equal to `1.16` are considered legacy.
 */
const LEGACY_VERSION_RANGE = parseVersionRange("<=1.16");

/**
 * A map of special Cosmic Reach versions (e.g., April Fools' ones) and their normalized counterparts.
 */
const SPECIAL_VERSIONS: ReadonlyMap<string, string> = new Map([
    ["13w12~", "1.5.1-alpha.13.12.a"],
    ["2point0_red", "1.5.2-red"],
    ["2point0_purple", "1.5.2-purple"],
    ["2point0_blue", "1.5.2-blue"],
    ["15w14a", "1.8.4-alpha.15.14.a+loveandhugs"],
    ["1.RV-Pre1", "1.9.2-rv+trendy"],
    ["3D Shareware v1.34", "1.14-alpha.19.13.shareware"],
    ["1.14.3 - Combat Test", "1.14.3-rc.4.combat.1"],
    ["Combat Test 2", "1.14.5-combat.2"],
    ["Combat Test 3", "1.14.5-combat.3"],
    ["Combat Test 4", "1.15-rc.3.combat.4"],
    ["Combat Test 5", "1.15.2-rc.2.combat.5"],
    ["20w14~", "1.16-alpha.20.13.inf"],
    ["20w14infinite", "1.16-alpha.20.13.inf"],
    ["Combat Test 6", "1.16.2-beta.3.combat.6"],
    ["Combat Test 7", "1.16.3-combat.7"],
    ["1.16_combat-2", "1.16.3-combat.7.b"],
    ["1.16_combat-3", "1.16.3-combat.7.c"],
    ["1.16_combat-4", "1.16.3-combat.8"],
    ["1.16_combat-5", "1.16.3-combat.8.b"],
    ["1.16_combat-6", "1.16.3-combat.8.c"],
    ["22w13oneblockatatime", "1.19-alpha.22.13.oneblockatatime"],
    ["23w13a_or_b", "1.20-alpha.23.13.ab"],
]);

/**
 * Normalizes a given Cosmic Reach version string.
 *
 * @param version - The Cosmic Reach version string to normalize.
 * @param versions - Optional Cosmic Reach version manifest entries.
 * @param index - Optional index of the Cosmic Reach version in the manifest entries.
 *
 * @returns The normalized Cosmic Reach version string.
 */
export function normalizeCosmicReachVersion(version: string, versions?: CosmicReachVersionManifestEntry[], index?: number): string {
    const releaseVersion = versions ? findNearestReleaseCosmicReachVersion(versions, index) : version.match(RELEASE_REGEX)?.[0];
    return normalizeUnknownCosmicReachVersion(version, releaseVersion);
}

/**
 * Normalizes a Cosmic Reach version range.
 *
 * @param range - The version range to normalize.
 * @param versions - A map of Cosmic Reach versions and their corresponding ids.
 * @param versionRegex - A regular expression for matching Cosmic Reach versions.
 *
 * @returns The normalized Cosmic Reach version range.
 */
export function normalizeCosmicReachVersionRange(range: string | Iterable<string> | VersionRange, versions: ReadonlyMap<string, CosmicReachVersion>, versionRegex: RegExp): VersionRange {
    if (!isIterable(range)) {
        return range;
    }

    const ranges = typeof range === "string" ? [range] : asArrayLike(range);
    const normalizedRanges = ranges.map((r: string) => r.replaceAll(versionRegex, x => {
        const version = versions.get(x);
        if (version) {
            return String(version.version);
        }

        return normalizeCosmicReachVersion(x);
    }));

    return parseVersionRange(normalizedRanges) || noneVersionRange(normalizedRanges.join(" || "));
}

/**
 * Generates a regular expression for matching Cosmic Reach versions.
 *
 * @param versions - Optional collection of Cosmic Reach versions that should satisfy the resulting regex.
 *
 * @returns A regular expression for matching Cosmic Reach versions.
 */
export function getCosmicReachVersionRegExp(versions?: Iterable<string>): RegExp {
    if (!versions) {
        return VERSION_REGEX;
    }

    let pattern = VERSION_PATTERN;
    for (const version of versions) {
        if (version.match(VERSION_REGEX)?.[0] !== version) {
            pattern = `${version.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d")}|${pattern}`;
        }
    }
    return new RegExp(pattern, "gs");
}

/**
 * Normalizes an unknown Cosmic Reach version.
 *
 * The normalization process formats the version string to provide better compatibility with
 * FabricMC's normalization scheme. This may involve appending the release version, converting
 * snapshot, experimental, or pre-release information, or transforming old version strings.
 *
 * @param version - The Cosmic Reach version string to normalize.
 * @param releaseVersion - Optional release version string for context.
 *
 * @returns The normalized Cosmic Reach version string.
 *
 * @remarks
 *
 * Original algorithm from FabricMC:
 * https://github.com/FabricMC/fabric-loader/blob/HEAD/cosmic-reach/src/main/java/net/fabricmc/loader/impl/game/cosmic-reach/McVersionLookup.java
 */
function normalizeUnknownCosmicReachVersion(version: string, releaseVersion?: string): string {
    if (SPECIAL_VERSIONS.has(version)) {
        return SPECIAL_VERSIONS.get(version);
    }

    if (!releaseVersion || version === releaseVersion || version.substring(1).startsWith(releaseVersion)) {
        return normalizeOldCosmicReachVersion(version);
    }

    let match: RegExpMatchArray;
    if (match = version.match(EXPERIMENTAL_REGEX)) {
        return `${releaseVersion}-Experimental.${match[1]}`;
    }

    if (version.startsWith(releaseVersion)) {
        if (match = version.match(RELEASE_CANDIDATE_REGEX)) {
            const rcBuild = releaseVersion === "1.16" ? String(8 + (+match[1])) : match[1];
            version = `rc.${rcBuild}`;
        } else if (match = version.match(PRE_RELEASE_REGEX)) {
            const isLegacy = isLegacyCosmicReachVersion(releaseVersion);
            version = `${isLegacy ? "rc" : "beta"}.${match[1]}`;
        }
    } else if (match = version.match(SNAPSHOT_REGEX)) {
        version = `alpha.${match[1]}.${match[2]}.${match[3]}`;
    } else {
        version = normalizeOldCosmicReachVersion(version);
    }

    if (version.startsWith(`${releaseVersion}-`)) {
        return version;
    }

    return `${releaseVersion}-${version}`;
}

/**
 * Normalizes an old Cosmic Reach version by converting version components like alpha, beta,
 * and indev to a more standard format, as well as removing unnecessary characters and correcting
 * the separator placements.
 *
 * @param version - The old Cosmic Reach version string to normalize.
 *
 * @returns The normalized Cosmic Reach version string.
 */
function normalizeOldCosmicReachVersion(version: string): string {
    let matcher: RegExpMatchArray;
    if (matcher = version.match(BETA_REGEX)) {
        version = `1.0.0-beta.${matcher[1]}`;
    } else if (matcher = version.match(ALPHA_REGEX)) {
        version = `1.0.0-alpha.${matcher[1]}`;
    } else if (matcher = version.match(INDEV_REGEX)) {
        version = `0.31.${matcher[1]}`;
    } else if (version.startsWith("c0.")) {
        version = version.substring(1);
    } else if (version.startsWith("rd-")) {
        version = version.substring(3);
        if (version === "20090515") {
            version = "150000";
        }
        version = `0.0.0-rd.${version}`;
    }

    let normalized = "";
    let wasDigit = false;
    let wasLeadingZero = false;
    let wasSeparator = false;
    let hasHyphen = false;
    for (let i = 0; i < version.length; ++i) {
        let c = version.charAt(i);
        if (c >= "0" && c <= "9") {
            if (i > 0 && !wasDigit && !wasSeparator) {
                normalized += ".";
            } else if (wasDigit && wasLeadingZero) {
                normalized = normalized.substring(0, normalized.length - 1);
            }
            wasLeadingZero = c === "0" && (!wasDigit || wasLeadingZero);
            wasSeparator = false;
            wasDigit = true;
        } else if (c === "." || c === "-") {
            if (wasSeparator) {
                continue;
            }

            wasSeparator = true;
            wasDigit = false;
        } else if ((c < "A" || c > "Z") && (c < "a" || c > "z")) {
            if (wasSeparator) {
                continue;
            }

            c = ".";
            wasSeparator = true;
            wasDigit = false;
        } else {
            if (wasDigit) {
                normalized += hasHyphen ? "." : "-";
                hasHyphen = true;
            }
            wasSeparator = false;
            wasDigit = false;
        }

        if (c === "-") {
            hasHyphen = true;
        }
        normalized += c;
    }

    let start = 0;
    while (start < normalized.length && normalized.charAt(start) === ".") {
        ++start;
    }

    let end = normalized.length;
    while (end > start && normalized.charAt(end - 1) === ".") {
        --end;
    }

    return normalized.substring(start, end);
}

/**
 * Finds the nearest release Cosmic Reach version to a given index in the provided version manifest entries.
 *
 * This is used to determine the release version context for non-release versions (e.g., snapshots).
 *
 * @param versions - An array of Cosmic Reach version manifest entries.
 * @param index - The index of the version for which to find the nearest release version.
 *
 * @returns The nearest release Cosmic Reach version string, or `undefined` if not found.
 */
function findNearestReleaseCosmicReachVersion(versions: CosmicReachVersionManifestEntry[], index: number): string | undefined {
    if (versions[index].type === CosmicReachVersionType.RELEASE) {
        return versions[index].id;
    }

    if (versions[index].type !== CosmicReachVersionType.SNAPSHOT) {
        return undefined;
    }

    const match = versions[index].id.match(RELEASE_REGEX);
    if (match) {
        return match[0];
    }

    const snapshot = versions[index].id.match(SNAPSHOT_REGEX);
    if (snapshot) {
        const year = +snapshot[1];
        const week = +snapshot[2];

        const hardcodedSnapshotVersion = findNearestReleaseCosmicReachVersionBySnapshotDate(year, week);
        if (hardcodedSnapshotVersion) {
            return hardcodedSnapshotVersion;
        }
    }

    for (let i = index - 1; i >= 0; --i) {
        if (versions[i].type === CosmicReachVersionType.RELEASE) {
            return versions[i].id;
        }
    }

    for (let i = index + 1; i < versions.length; ++i) {
        if (versions[i].type !== CosmicReachVersionType.RELEASE) {
            continue;
        }

        const match = versions[i].id.match(/(\d+)\.(\d+)(?:\.(\d+))?/);
        if (match) {
            return `${match[1]}.${match[2]}.${(+match[3] || 0) + 1}`;
        }
    }

    return undefined;
}

/**
 * Finds the nearest release Cosmic Reach version based on the snapshot year and week.
 *
 * This function is required because the order of versions in the version manifest may not
 * always correspond to their actual release order, especially for older versions.
 * By using hardcoded release versions for specific date ranges, we can determine the nearest
 * release version more accurately for certain snapshots.
 *
 * @param year - The snapshot year.
 * @param week - The snapshot week.
 *
 * @returns The nearest release Cosmic Reach version string, or `undefined` if not found.
 *
 * @remarks
 *
 * Original algorithm from FabricMC:
 * https://github.com/FabricMC/fabric-loader/blob/HEAD/cosmic-reach/src/main/java/net/fabricmc/loader/impl/game/cosmic-reach/McVersionLookup.java#L267
 */
function findNearestReleaseCosmicReachVersionBySnapshotDate(year: number, week: number) : string | undefined {
    if (year === 23 && week >= 12) {
        return "1.20";
    }

    if (year === 20 && week >= 45 || year === 21 && week <= 20) {
        return "1.17";
    }

    if (year === 15 && week >= 31 || year === 16 && week <= 7) {
        return "1.9";
    }

    if (year === 14 && week >= 2 && week <= 34) {
        return "1.8";
    }

    if (year === 13 && week >= 47 && week <= 49) {
        return "1.7.4";
    }

    if (year === 13 && week >= 36 && week <= 43) {
        return "1.7.2";
    }

    if (year === 13 && week >= 16 && week <= 26) {
        return "1.6";
    }

    return undefined;
}

/**
 * Determines if a Cosmic Reach version is considered legacy based on its version string.
 *
 * @param version - The Cosmic Reach version string to evaluate.
 *
 * @returns `true` if the version is considered legacy; otherwise, `false`.
 */
function isLegacyCosmicReachVersion(version: string): boolean {
    return LEGACY_VERSION_RANGE.includes(version);
}
