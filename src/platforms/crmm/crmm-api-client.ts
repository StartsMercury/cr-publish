import { Fetch, HttpRequest, HttpResponse, createFetch, defaultResponse, simpleCache, throwOnError } from "@/utils/net";
import { CrmmProject, CrmmProjectPatch } from "./crmm-project";
import { CrmmVersion, CrmmVersionInit, CrmmVersionPatch, CrmmVersionSearchTemplate, packCrmmVersionInit, packCrmmVersionSearchTemplate } from "./crmm-version";
import { CrmmLoader } from "./crmm-loader";
import { CrmmGameVersion } from "./crmm-game-version";
import { map } from "@/utils/collections/iterable";

/**
 * The API version used for making requests to the CRMM API.
 */
const CRMM_API_VERSION = 2;

/**
 * The base URL for the CRMM API.
 */
export const CRMM_API_URL = `https://api.crmm.tech/v${CRMM_API_VERSION}` as const;

/**
 * The base URL for the staging CRMM API.
 */
export const CRMM_STAGING_API_URL = `https://staging-api.crmm.tech/v${CRMM_API_VERSION}` as const;

/**
 * Describes the configuration options for the CRMM API client.
 */
export interface CrmmApiOptions {
    /**
     * The Fetch implementation used for making HTTP requests.
     */
    fetch?: Fetch;

    /**
     * The base URL for the CRMM API.
     *
     * Defaults to {@link CRMM_API_URL}.
     */
    baseUrl?: string | URL;

    /**
     * The API token to be used for authentication with the CRMM API.
     */
    token?: string;
}

/**
 * A client for interacting with the CRMM API.
 */
export class CrmmApiClient {
    /**
     * The Fetch implementation used for making HTTP requests.
     */
    private readonly _fetch: Fetch;

    /**
     * Creates a new {@link CrmmApiClient} instance.
     *
     * @param options - The configuration options for the client.
     */
    constructor(options?: CrmmApiOptions) {
        this._fetch = createFetch({
            handler: options?.fetch,
            baseUrl: options?.baseUrl || options?.fetch?.["baseUrl"] || CRMM_API_URL,
            defaultHeaders: {
                Authorization: options?.token,
            },
        })
        .use(simpleCache())
        .use(defaultResponse({ response: r => HttpResponse.json(null, r) }))
        .use(throwOnError({ filter: x => !x.ok && x.status !== 404 }));
    }

    /**
     * Gets an array of loaders supported by CRMM.
     *
     * @returns An array of loaders supported by CRMM.
     */
    async getLoaders(): Promise<CrmmLoader[]> {
        const response = await this._fetch("/tag/loaders?cache=true");
        return (await response.json() as { loaders: CrmmLoader[] })?.loaders ?? [];
    }

    /**
     * Gets an array of game versions supported by CRMM.
     *
     * @returns An array of game versions supported by CRMM.
     */
    async getGameVersions(): Promise<CrmmGameVersion[]> {
        const response = await this._fetch("/tag/game-versions?cache=true");
        return (await response.json()) ?? [];
    }

    /**
     * Fetches a project by its id or slug.
     *
     * @param idOrSlug - The project id or slug.
     *
     * @returns The project, or `undefined` if not found.
     */
    async getProject(idOrSlug: string): Promise<CrmmProject | undefined> {
        const response = await this._fetch(`/project/${idOrSlug}`);
        return (await response.json() as { project: CrmmProject | undefined })?.project ?? undefined;
    }

    /**
     * Returns the project id for the given project.
     *
     * @param idOrSlug - The project id or slug.
     *
     * @returns The project id, or `undefined` if not found.
     */
    async getProjectId(idOrSlug: string): Promise<string | undefined> {
        const response = await this._fetch(`/project/${idOrSlug}/check`);
        return (await response.json() as CrmmProject)?.id ?? undefined;
    }

    /**
     * Fetches multiple projects by their IDs and/or slugs.
     *
     * @param idsOrSlugs - The project IDs and/or slugs.
     *
     * @returns An array of projects.
     */
    async getProjects(idsOrSlugs: Iterable<string>): Promise<CrmmProject[]> {
        // const response = await this._fetch("/projects", HttpRequest.get().with({ ids: JSON.stringify(asArray(idsOrSlugs)) }));
        // return (await response.json()) ?? [];

        // Manual implementation
        return (await Promise.allSettled(map(idsOrSlugs, this.getProject)))
            ?.map(result => (result as PromiseFulfilledResult<CrmmProject>).value)
            .filter(it => it);
    }

    /**
     * Updates an existing project.
     *
     * @param project - The project data to update.
     *
     * @returns `true` if the update was successful; otherwise, `false`.
     */
    async updateProject(project: CrmmProjectPatch): Promise<boolean> {
        const response = await this._fetch(`/project/${project.slug}`, HttpRequest.patch().json(project));
        return response.ok;
    }

    /**
     * Deletes an existing project.
     *
     * @param version - The id or slug of the project to delete.
     *
     * @returns `true` if the project was successfully deleted; otherwise, `false`.
     */
    async deleteProject(idOrSlug: string): Promise<boolean> {
        const response = await this._fetch(`/project/${idOrSlug}`, HttpRequest.delete());
        return response.ok;
    }

    /**
     * Fetches a version by its id.
     *
     * @param id - The version id.
     *
     * @returns The version, or `undefined` if not found.
     */
    async getVersion(id: string): Promise<CrmmVersion | undefined> {
        const response = await this._fetch(`/version/${id}`);
        return (await response.json() as { data: CrmmVersion | undefined })?.data ?? undefined;
    }

    /**
     * Fetches multiple versions by their IDs.
     *
     * @param ids - The version IDs.
     *
     * @returns An array of versions.
     */
    async getVersions(ids: Iterable<string>): Promise<CrmmVersion[]> {
        // const response = await this._fetch("/versions", HttpRequest.get().with({ ids: JSON.stringify(asArray(ids)) }));
        // return (await response.json() as any)?.data ?? [];

        // Manual implementation
        return (await Promise.allSettled(map(ids, this.getVersion)))
            ?.map(result => (result as PromiseFulfilledResult<CrmmVersion>).value)
            .filter(it => it);
    }

    /**
     * Creates a new version.
     *
     * @param version - The version data.
     *
     * @returns The created version.
     */
    async createVersion(version: CrmmVersionInit): Promise<CrmmVersion> {
        const form = packCrmmVersionInit(version);
        const response = await this._fetch("/version", HttpRequest.post().with(form));
        return await response.json() ?? undefined;
    }

    /**
     * Updates an existing version.
     *
     * @param version - The version data to update.
     *
     * @returns `true` if the update was successful; otherwise, `false`.
     */
    async updateVersion(version: CrmmVersionPatch): Promise<boolean> {
        const response = await this._fetch(`/version/${version.title}`, HttpRequest.patch().json(version));
        return response.ok;
    }

    /**
     * Deletes an existing version.
     *
     * @param version - The id of the version to delete.
     *
     * @returns `true` if the version was successfully deleted; otherwise, `false`.
     */
    async deleteVersion(id: string): Promise<boolean> {
        const response = await this._fetch(`/version/${id}`, HttpRequest.delete());
        return response.ok;
    }

    /**
     * Fetches the versions of a project based on the provided search template.
     *
     * @param idOrSlug - The project id or slug.
     * @param template - The search template to filter versions.
     *
     * @returns An array of versions matching the search criteria.
     */
    async getProjectVersions(idOrSlug: string, template?: CrmmVersionSearchTemplate): Promise<CrmmVersion[]> {
        const params = packCrmmVersionSearchTemplate(template);
        const response = await this._fetch(`/project/${idOrSlug}/version`, HttpRequest.get().with(params));
        return (await response.json() as { data: CrmmVersion[] })?.data ?? [];
    }

    /**
     * Unfeatures previous project versions based on the provided mode.
     *
     * @param currentVersion - The current version to use as an anchor point.
     * @param mode - The unfeaturing mode (default: `CrmmUnfeatureMode.SUBSET`).
     *
     * @returns A record containing version IDs as keys and a boolean indicating whether the unfeaturing operation was successful for each version.
     */
    // async unfeaturePreviousProjectVersions(currentVersion: UnfeaturableCrmmVersion, mode?: CrmmUnfeatureMode): Promise<Record<string, boolean>> {
    //     mode ??= CrmmUnfeatureMode.SUBSET;

    //     const previousVersions = await this.getProjectVersions(currentVersion.projectId, { featured: true });
    //     const unfeaturedVersions = { } as Record<string, boolean>;

    //     for (const previousVersion of previousVersions) {
    //         if (!CrmmUnfeatureMode.shouldUnfeature(previousVersion, currentVersion, mode)) {
    //             continue;
    //         }

    //         unfeaturedVersions[previousVersion.id] = await this.updateVersion({ id: previousVersion.id, featured: false });
    //     }

    //     return unfeaturedVersions;
    // }
}
