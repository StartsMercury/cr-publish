import { VersionType } from "@/utils/versioning";
import { FileInfo } from "@/utils/io";
import { CrmmDependency } from "./crmm-dependency";

/**
 * Represents a CRMM project version.
 */
export interface CrmmVersion {
    /**
     * The ID of this version.
     */
    id: string;

    /**
     * The display name of the version.
     */
    title: string;

    /**
     * The version number of the project.
     */
    versionNumber: string;

    /**
     * A textual description of the changes introduced in this version.
     */
    changelog: string | null;

    /**
     * A URL-friendly string that represents the version.
     */
    slug: string;

    /**
     * The date when this version was published.
     */
    datePublished: string;

    /**
     * Indicates if this version is featured or not.
     */
    featured: boolean;

    /**
     * The number of downloads for this version.
     */
    downloads: number;

    /**
     * The type of the version (e.g., release, beta, alpha).
     */
    releaseChannel: VersionType;

    /**
     * An array of supported game versions for this project version.
     */
    gameVersions: string[];

    /**
     * An array of supported mod loaders for this project version.
     */
    loaders: string[];

    /**
     * An array of files associated with this version.
     */
    files: CrmmVersionFile[];

    /**
     * The primary file associated with this version.
     */
    primaryFile: CrmmVersionFile;

    /**
     * The author associated with this version.
     */
    author: {
        /**
         * The ID of the version author.
         */
        id: string;

        /**
         * The username of the version author.
         */
        userName: string;

        /**
         * The name of the version author.
         */
        name: string;

        /**
         * The avatar URL of the version author.
         */
        avatarUrl: string | null;

        /**
         * The role of the version author.
         */
        role: string;
    };

    /**
     * An array of dependencies for this version, including version ID, project ID,
     * file name, and the type of dependency (e.g., required, optional).
     */
    dependencies: CrmmDependency[];
}

/**
 * Represents a CRMM project version file.
 */
export interface CrmmVersionFile {
    /**
     * The unique identifier of a version file.
     */
    id: string;

    /**
     * Is this the primary version file.
     */
    isPrimary: boolean;

    /**
     * The displayed name of the version file.
     */
    name: string;

    /**
     * The URL of the version file.
     */
    url: string;

    /**
     * The size of the file in bytes.
     */
    size: number;

    /**
     * The type of version file.
     */
    type: string;

    /**
     * SHA-1 hash of the file.
     */
    sha1_hash: string | null;

    /**
     * SHA-512 hash of the file.
     */
    sha512_hash: string | null;
}

/**
 * Options needed to create a new CRMM Version.
 */
export interface CrmmVersionInit {
    /**
     * The name of this version.
     */
    title: string;

    /**
     * The changelog for this version.
     */
    changelog: string | null;

    /**
     * The release channel for this version.
     *
     * Defaults to `"release"`.
     */
    releaseChannel?: VersionType;

    /**
     * Whether the version is featured or not.
     *
     * Defaults to `true`.
     */
    featured?: boolean;

    /**
     * The version number. Ideally will follow semantic versioning.
     */
    versionNumber: string;

    /**
     * The mod loaders that this version supports.
     */
    loaders?: string[];

    /**
     * A list of versions of Cosmic Reach that this version supports.
     */
    gameVersions?: string[];

    /**
     * A list of specific versions of projects that this version depends on.
     */
    dependencies?: CrmmDependency[];

    /**
     * The status of the version.
     */
    status?: "listed" | "archived" | "draft" | "unlisted" | "scheduled" | "unknown";

    /**
     * The requested status of the version.
     */
    requested_status?: "listed" | "archived" | "draft" | "unlisted";

    /**
     * The primary file that should be attached to the version.
     */
    primaryFile: FileInfo | string;

    /**
     * A list of files that should be attached to the version.
     */
    files?: (FileInfo | string)[];
}

/**
 * The data needed to initialize a CRMM version.
 */
interface CrmmVersionInitData extends Omit<CrmmVersionInit, "files"> {
    /**
     * The primary file of the version, if any.
     *
     * If the version has files, this should be "_0".
     */
    primary_file?: "_0";

    /**
     * An array of strings representing the names of each file part.
     *
     * If the version has no files, this should be an empty array.
     */
    file_parts: `_${number}`[];
}

/**
 * The shape of the object that should be passed to the CRMM API when creating a new version.
 */
type CrmmVersionInitForm = {
    /**
     * The data needed to initialize the CRMM version.
     */
    data: CrmmVersionInitData;
} & {
    /**
     * An array of strings representing the names of each file part.
     */
    [file_part: `_${number}`]: FileInfo;
};

/**
 * Options needed to update a CRMM Version.
 */
export interface CrmmVersionPatch {
    /**
     * The name of this version.
     */
    title: string;

    /**
     * The changelog for this version.
     */
    changelog?: string;

    /**
     * The release channel for this version.
     */
    releaseChannel?: VersionType;

    /**
     * Whether the version is featured or not.
     */
    featured?: boolean;

    /**
     * The version number. Ideally will follow semantic versioning.
     */
    versionNumber?: string;

    /**
     * The mod loaders that this version supports.
     */
    loaders?: string[];

    /**
     * A list of versions of Cosmic Reach that this version supports.
     */
    gameVersions?: string[];

    /**
     * A list of specific versions of projects that this version depends on.
     */
    dependencies?: CrmmDependency[];

    /**
     * The hash format and the hash of the new primary file.
     */
    additionalFiles?: FileInfo[];
}

/**
 * Represents a version that may be unfeatured.
 */
export interface UnfeaturableCrmmVersion {
    /**
     * The ID of this version.
     */
    id?: string;

    /**
     * A list of versions of Cosmic Reach that this version supports.
     */
    gameVersions?: string[];

    /**
     * The release channel for this version.
     */
    type?: VersionType;

    /**
     * The mod loaders that this version supports.
     */
    loaders?: string[];
}

/**
 * Describes a template for searching CRMM versions based on the specified criteria.
 */
export interface CrmmVersionSearchTemplate {
    /**
     * The mod loaders that a version may support.
     *
     * @example ["fabric", "forge"]
     */
    loaders?: string[];

    /**
     * A list of versions of Cosmic Reach that a version may support.
     *
     * @example ["1.16.5", "1.17.1"]
     */
    game_versions?: string[];

    /**
     * Whether a version should be featured or not.
     */
    featured?: boolean;
}

/**
 * Describes a template that should be passed to the CRMM API
 * for searching CRMM versions based on the specified criteria.
 */
interface CrmmVersionSearchTemplateForm {
    /**
     * A JSON array of mod loaders that a version may support.
     *
     * @example '["fabric", "forge"]'
     */
    loaders?: string;

    /**
     * A JSON array of versions of Cosmic Reach that a version may support.
     *
     * @example '["1.16.5", "1.17.1"]'
     */
    game_versions?: string;

    /**
     * Whether a version should be featured or not.
     */
    featured?: boolean;
}

/**
 * Returns the data and file information needed to create a new CRMM version.
 *
 * @param version - The options for the new version.
 *
 * @returns An object containing the data and file information for the new version.
 */
export function packCrmmVersionInit(version: CrmmVersionInit): CrmmVersionInitForm {
    const { files = [] } = version;

    const data: CrmmVersionInitData = {
        // Unpack the `version`
        ...{ ...version, files: undefined },

        // Default values
        title: version.title || version.versionNumber || files[0] && FileInfo.of(files[0]).name,
        releaseChannel: version.releaseChannel ?? VersionType.RELEASE,
        featured: version.featured ?? true,
        dependencies: version.dependencies ?? [],
        gameVersions: version.gameVersions ?? [],
        loaders: version.loaders ?? [],

        // Names of each file part
        primary_file: files.length ? "_0" : undefined,
        file_parts: files.map((_, i) => `_${i}` as const),
    };

    const form = files.reduce((form, file, i) => {
        form[`_${i}`] = FileInfo.of(file);
        return form;
    }, { data } as CrmmVersionInitForm);

    return form;
}

/**
 * Returns the search template needed to search for a CRMM version.
 *
 * @param version - The search template.
 *
 * @returns The search template needed to search for a CRMM version.
 */
export function packCrmmVersionSearchTemplate(template: CrmmVersionSearchTemplate): CrmmVersionSearchTemplateForm {
    const loaders = template?.loaders ? JSON.stringify(template.loaders) : undefined;
    const game_versions = template?.game_versions ? JSON.stringify(template.game_versions) : undefined;
    const featured = template?.featured ?? undefined;

    return { loaders, game_versions, featured };
}
