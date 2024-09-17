import { DependencyType } from "@/dependencies";
import { Enum, EnumOptions } from "@/utils/enum";

/**
 * Represents the types of dependencies a CRMM version can have.
 *
 * @partial
 */
enum CrmmDependencyTypeValues {
    /**
     * The dependency is required for the mod to function.
     */
    REQUIRED = "required",

    /**
     * The dependency is optional and provides additional features.
     */
    OPTIONAL = "optional",

    /**
     * The dependency is incompatible with the mod.
     */
    INCOMPATIBLE = "incompatible",

    /**
     * The dependency is embedded within the mod.
     */
    EMBEDDED = "embedded",
}

/**
 * Options for configuring the behavior of the CrmmDependencyType enum.
 *
 * @partial
 */
const CrmmDependencyTypeOptions: EnumOptions = {
    /**
     * The case should be ignored while parsing the dependency type.
     */
    ignoreCase: true,

    /**
     * Non-word characters should be ignored while parsing the dependency type.
     */
    ignoreNonWordCharacters: true,
};

/**
 * Converts a {@link CrmmDependencyType} to a {@link DependencyType}.
 *
 * @param type - The {@link CrmmDependencyType} to convert.
 *
 * @returns The corresponding {@link DependencyType}, or `undefined` if the value is invalid.
 */
function toDependencyType(type: CrmmDependencyType): DependencyType | undefined {
    switch (type) {
        case CrmmDependencyType.REQUIRED:
            return DependencyType.REQUIRED;
        case CrmmDependencyType.OPTIONAL:
            return DependencyType.OPTIONAL;
        case CrmmDependencyType.INCOMPATIBLE:
            return DependencyType.INCOMPATIBLE;
        case CrmmDependencyType.EMBEDDED:
            return DependencyType.EMBEDDED;
        default:
            return undefined;
    }
}

/**
 * Converts a {@link DependencyType} to a {@link CrmmDependencyType}.
 *
 * @param type - The {@link DependencyType} to convert.
 *
 * @returns The corresponding {@link CrmmDependencyType}, or `undefined` if the value is invalid.
 */
function fromDependencyType(type: DependencyType): CrmmDependencyType | undefined {
    switch (type) {
        case DependencyType.REQUIRED:
            return CrmmDependencyType.REQUIRED;
        case DependencyType.OPTIONAL:
        case DependencyType.RECOMMENDED:
            return CrmmDependencyType.OPTIONAL;
        case DependencyType.EMBEDDED:
            return CrmmDependencyType.EMBEDDED;
        case DependencyType.CONFLICTING:
        case DependencyType.INCOMPATIBLE:
            return CrmmDependencyType.INCOMPATIBLE;
        default:
            return undefined;
    }
}

/**
 * A collection of methods to work with CrmmDependencyType.
 *
 * @partial
 */
const CrmmDependencyTypeMethods = {
    fromDependencyType,
    toDependencyType,
};

/**
 * Represents the types of dependencies a CRMM version can have.
 */
export const CrmmDependencyType = Enum.create(
    CrmmDependencyTypeValues,
    CrmmDependencyTypeOptions,
    CrmmDependencyTypeMethods,
);

/**
 * Represents the types of dependencies a CRMM version can have.
 */
export type CrmmDependencyType = Enum<typeof CrmmDependencyTypeValues>;
