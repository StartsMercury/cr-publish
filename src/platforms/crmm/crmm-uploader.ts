import { CrmmUploadReport as UploadReport, CrmmUploadRequest as UploadRequest } from "@/action";
import { Dependency } from "@/dependencies";
import { GenericPlatformUploader, GenericPlatformUploaderOptions } from "@/platforms/generic-platform-uploader";
import { PlatformType } from "@/platforms/platform-type";
import { $i } from "@/utils/collections";
import { IGNORE_CASE_AND_NON_WORD_CHARACTERS_EQUALITY_COMPARER } from "@/utils/comparison";
import { ArgumentError } from "@/utils/errors";
import { CrmmApiClient } from "./crmm-api-client";
import { CrmmDependency } from "./crmm-dependency";
import { CrmmDependencyType } from "./crmm-dependency-type";
import { CrmmProject } from "./crmm-project";
import { CrmmUnfeatureMode } from "./crmm-unfeature-mode";
import { CrmmVersion } from "./crmm-version";

/**
 * Configuration options for the uploader, tailored for use with CRMM.
 */
export type CrmmUploaderOptions = GenericPlatformUploaderOptions;

/**
 * Defines the structure for an upload request, adapted for use with CRMM.
 */
export type CrmmUploadRequest = UploadRequest;

/**
 * Specifies the structure of the report generated after a successful upload to CRMM.
 */
export type CrmmUploadReport = UploadReport;

/**
 * Implements the uploader for CRMM.
 */
export class CrmmUploader extends GenericPlatformUploader<CrmmUploaderOptions, CrmmUploadRequest, CrmmUploadReport> {
    /**
     * Constructs a new {@link CrmmUploader} instance.
     *
     * @param options - The options to use for the uploader.
     */
    constructor(options?: CrmmUploaderOptions) {
        super(options);
    }

    /**
     * @inheritdoc
     */
    get platform(): PlatformType {
        return PlatformType.CRMM;
    }

    /**
     * @inheritdoc
     */
    protected async uploadCore(request: CrmmUploadRequest): Promise<CrmmUploadReport> {
        ArgumentError.throwIfNullOrEmpty(request.id, "request.id", "A project ID is required to upload files to CRMM.");
        ArgumentError.throwIfNullOrEmpty(request.version, "request.version", "A version number is required to upload files to CRMM.");
        ArgumentError.throwIfNullOrEmpty(request.loaders, "request.loaders", "At least one loader should be specified to upload files to CRMM.");
        ArgumentError.throwIfNullOrEmpty(request.gameVersions, "request.gameVersions", "At least one game version should be specified to upload files to CRMM.");

        const api = new CrmmApiClient({ token: request.token.unwrap(), fetch: this._fetch });
        const unfeatureMode = request.unfeatureMode ?? (request.featured ? CrmmUnfeatureMode.SUBSET : CrmmUnfeatureMode.NONE);

        const project = await this.getProject(request.id, api);
        const version = await this.createVersion(request, project, api);
        // await this.unfeaturePreviousVersions(version, unfeatureMode, api);
        this.unfeaturePreviousVersions(version, unfeatureMode);

        return {
            id: project.id,
            version: version.id,
            url: `https://crmm.tech/${project.type}/${project.slug}/version/${version.versionNumber}`,
            files: version.files.map(x => ({ id: x.sha1_hash, name: x.name, url: x.url })),
        };
    }

    /**
     * Fetches the project details from CRMM.
     *
     * @param idOrSlug - The identifier or slug of the project.
     * @param api - The API client instance to use for the request.
     *
     * @returns The fetched project details.
     */
    private async getProject(idOrSlug: string, api: CrmmApiClient): Promise<CrmmProject> {
        const project = await api.getProject(idOrSlug);
        if (project) {
            return project;
        }

        // If the project was not found, it could imply that it is not publicly
        // visible (e.g., it hasn't been reviewed yet), and the token we have lacks
        // the `Read projects` permission.
        //
        // Regardless, if the user provided us with a project ID, that's all we need
        // to attempt publishing their assets. Although the upload report may be imprecise
        // with this placeholder data, it's still preferable to not uploading anything at all.
        return {
            id: idOrSlug,
            slug: idOrSlug,
            project_type: "mod",
        } as unknown as CrmmProject;
    }

    /**
     * Creates a new version of the project on CRMM.
     *
     * @param request - The upload request containing information about the new version.
     * @param project - The project for which the new version is created.
     * @param api - The API client instance to use for the upload request.
     *
     * @returns The details of the newly created version.
     */
    private async createVersion(request: CrmmUploadRequest, project: CrmmProject, api: CrmmApiClient): Promise<CrmmVersion> {
        const gameVersions = await this.convertToCrmmGameVersionNames(request.gameVersions, api);
        const loaders = await this.convertToCrmmLoaderNames(request.loaders, project, api);
        const dependencies = await this.convertToCrmmDependencies(request.dependencies, api);

        return await api.createVersion({
            title: request.name,
            versionNumber: request.version,
            changelog: request.changelog,
            dependencies,
            gameVersions,
            releaseChannel: request.versionType,
            loaders,
            featured: request.featured,
            primaryFile: request.primaryFile,
            files: request.files,
        });
    }

    /**
     * Converts the dependencies to CRMM-specific format.
     *
     * @param dependencies - The list of dependencies to convert.
     * @param api - The API client instance to use for retrieving data.
     *
     * @returns An array of converted dependencies.
     */
    private async convertToCrmmDependencies(dependencies: Dependency[], api: CrmmApiClient): Promise<CrmmDependency[]> {
        const simpleDependencies = this.convertToSimpleDependencies(dependencies, CrmmDependencyType.fromDependencyType);
        const crmmDependencies = await Promise.all(simpleDependencies.map(async ([id, type]) => ({
            projectId: await api.getProjectId(id).catch(() => undefined as string),
            dependencyType: type,
        } as unknown as CrmmDependency)));
        const uniqueCrmmDependencies = crmmDependencies
            .filter(x => x.projectId && x.dependencyType)
            .filter((x, i, self) => i === self.findIndex(y => x.projectId === y.projectId));

        return uniqueCrmmDependencies;
    }

    /**
     * Converts loader names to CRMM-specific format.
     *
     * @param loaders - The list of loaders to convert.
     * @param project - The project for which the loaders are used.
     * @param api - The API client instance to use for retrieving data.
     *
     * @returns An array of converted loader names.
     */
    private async convertToCrmmLoaderNames(loaders: string[], project: CrmmProject, api: CrmmApiClient): Promise<string[]> {
        if (!loaders?.length) {
            return [];
        }

        const crmmLoaders = await api.getLoaders();
        return $i(loaders)
            .map(x => crmmLoaders.find(y => IGNORE_CASE_AND_NON_WORD_CHARACTERS_EQUALITY_COMPARER(x, y.name)))
            .filter(x => x)

            // `project.id === project.slug` is only true when we use placeholder data,
            // which means that we couldn't get the actual project information.
            // Therefore, we cannot rely on `project_type` to filter out invalid loaders.
            // So, let's just hope the user, who didn't provide us with a token with
            // all the required permissions, knows what they are doing.
            .filter(x => project.id === project.slug || project.type.every(x.supportedProjectTypes.includes))

            .map(x => x.name)
            .toArray();
    }

    /**
     * Converts game version names to CRMM-specific format.
     *
     * @param gameVersions - The list of game versions to convert.
     * @param api - The API client instance to use for retrieving data.
     *
     * @returns An array of converted game version names.
     */
    private async convertToCrmmGameVersionNames(gameVersions: string[], api: CrmmApiClient): Promise<string[]> {
        if (!gameVersions?.length) {
            return [];
        }

        const crmmGameVersions = await api.getGameVersions();
        return $i(gameVersions)
            .map(x => crmmGameVersions.find(y => IGNORE_CASE_AND_NON_WORD_CHARACTERS_EQUALITY_COMPARER(x, y.value))?.value)
            .filter(x => x)
            .toArray();
    }

    /**
     * Unfeatures previous versions of the project on CRMM.
     *
     * @param version - The new version after which the previous ones should be unfeatured.
     * @param unfeatureMode - The mode to determine which versions should be unfeatured.
     * @param api - The API client instance to use for the unfeaturing request.
     */
    // private async unfeaturePreviousVersions(version: CrmmVersion, unfeatureMode: CrmmUnfeatureMode, api: CrmmApiClient): Promise<void> {
    private unfeaturePreviousVersions(version: CrmmVersion, unfeatureMode: CrmmUnfeatureMode): Promise<void> {
        if (unfeatureMode === CrmmUnfeatureMode.NONE) {
            return;
        }

        this._logger.info("⚠️ Unfeaturing is currently not possible.");
        // this._logger.info("🔽 Initiating unfeaturing of older CRMM project versions");
        // const result = await api.unfeaturePreviousProjectVersions(version, unfeatureMode);
        // const unfeaturedVersions = Object.entries(result).filter(([, success]) => success).map(([version]) => version);
        // const nonUnfeaturedVersions = Object.entries(result).filter(([, success]) => !success).map(([version]) => version);
        // if (unfeaturedVersions.length) {
        //     this._logger.info(`🟢 Successfully unfeatured ${unfeaturedVersions.join(", ")}`);
        // }
        // if (nonUnfeaturedVersions.length) {
        //     this._logger.info(`⚠️ Failed to unfeature ${nonUnfeaturedVersions.join(", ")}. Please, double-check your token`);
        // }
    }
}
