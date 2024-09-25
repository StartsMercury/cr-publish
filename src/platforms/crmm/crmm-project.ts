/**
 * Represents a CRMM project.
 */
export interface CrmmProject {
    /**
     * The unique identifier of the project.
     */
    id: string;

    /**
     * The unique identifier of the team associated with the project.
     */
    teamId: string;

    /**
     * The unique identifier of the organization associated with the project.
     */
    orgId: string | null;

    /**
     * The title of the project.
     */
    name: string;

    /**
     * A URL-friendly string that represents the project.
     */
    slug: string;

    /**
     * A URL pointing to the project's icon.
     */
    icon: string | null;

    /**
     * A short description of the project.
     */
    summary: string;

    /**
     * A detailed description of the project.
     */
    description: string | null;

    /**
     * The type of the project.
     */
    type: ("mod" | "modpack" | "shader" | "resourcepack" | "datamod" | "plugin")[];

    /**
     * An array of categories the project belongs to.
     */
    categories: string[];

    /**
     * An array of featured categories the project belongs to.
     */
    featured_categories: string[];

    /**
     * The unique identifier of the license.
     */
    licenseId: string | null;

    /**
     * The full name of the license.
     */
    licenseName: string | null;

    /**
     * The URL of the license's official website.
     */
    licenseUrl: string | null;

    /**
     * A string representing the date when the project was published.
     */
    datePublished: string;

    /**
     * A string representing the date when the project was last updated.
     */
    dateUpdated: string;

    /**
     * The current status of the project.
     */
    status: "draft" | "scheduled" | "published" | "unknown";

    /**
     * The visibility of the project.
     */
    visibility: "listed" | "private" | "unlisted" | "archived"

    /**
     * The number of downloads for the project.
     */
    downloads: number;

    /**
     * The number of followers for the project.
     */
    followers: number;

    /**
     * A URL pointing to the project's issue tracker.
     */
    issuesTrackerUrl: string;

    /**
     * A URL pointing to the project's source code repository.
     */
    projectSourceUrl: string;

    /**
     * A URL pointing to the project's wiki.
     */
    projectWikiUrl: string;

    /**
     * A URL pointing to the project's Discord server.
     */
    discordInviteUrl: string;

    /**
     * Indicates if the client-side is required or optional.
     */
    clientSide: "required" | "optional" | "unsupported";

    /**
     * Indicates if the server-side is required or optional.
     */
    serverSide: "required" | "optional" | "unsupported";

    /**
     * An array of loaders supported by the project.
     */
    loaders: string[];

    /**
     * An array of game versions the project supports.
     */
    gameVersions: string[];

    /**
     * An array of images in the project's gallery.
     */
    gallery: {
        /**
         * The unique identifier of the image.
         */
        id: string;

        /**
         * The title of the image.
         */
        name: string;

        /**
         * A description of the image.
         */
        description: string | null;

        /**
         * The URL of the image.
         */
        image: string;

        /**
         * Indicates if the image is featured.
         */
        featured: boolean;

        /**
         * A string representing the date when the image was created.
         */
        dateCreated: string;

        /**
         * An integer representing the order of the image in the gallery.
         */
        orderIndex: number;
    }[];

    /**
     * The members of the project.
     */
    members: {
        /**
         * The unique identifier of the project member.
         */
        id: string;

        /**
         * The user identifier of the project member.
         */
        userId: string;

        /**
         * The team identifier of the project member.
         */
        teamId: string;

        /**
         * The name of the project member.
         */
        userName: string;

        /**
         * The avatar URL of the project member.
         */
        avatarUrl: string;

        /**
         * The role of the project member.
         */
        role: string;

        /**
         * Is this project member an owner.
         */
        isOwner: boolean;

        /**
         * Is the project member "accepted".
         */
        accepted: boolean;

        /**
         * The project permissions of the project member.
         */
        permissions: string[];

        /**
         * The organisation permissions of the project member.
         */
        organisationPermissions: string[];
    }[];

    /**
     * The organisation object.
     */
    organization: {
        /**
         * The unique identifier of the organization.
         */
        id: string;

        /**
         * The name of the organization.
         */
        name: string;

        /**
         * A URL-friendly string that represents the organisation.
         */
        slug: string;

        /**
         * The description of the organisation.
         */
        description: string | null;

        /**
         * The icon URL of the organisation.
         */
        icon: string | null;

        /**
         * An empty list containing the members in the organisation.
         */
        members: [];
    } | null;

    /**
     * An array of donation URLs for the project.
     */
    donation_urls: {
        /**
         * The unique identifier of the donation platform.
         */
        id: string;

        /**
         * The name of the donation platform.
         */
        platform: string;

        /**
         * The URL of the donation page for the project.
         */
        url: string;
    }[];

    /**
     * An integer representing the color of the project.
     */
    color: number;

    /**
     * A URL pointing to the project's body.
     */
    body_url?: string;

    /**
     * A message from the moderator related to the project.
     */
    moderator_message?: string;

    /**
     * A string representing the date when the project was approved.
     */
    approved: string;

    /**
     * An array of unique identifiers of the project's versions.
     */
    versions: string[];
}

/**
 * Options needed to update a CRMM Project.
 */
export interface CrmmProjectPatch {
    /**
     * A URL pointing to the project's icon.
     */
    icon: string;

    /**
     * The title of the project.
     */
    name: string;

    /**
     * A URL-friendly string that represents the project.
     */
    slug: string;

    /**
     * The type of project.
     */
    type: string;

    /**
     * The visibility of the project.
     */
    visibility: "listed" | "private" | "unlisted" | "archived"

    /**
     * Indicates if the client-side is required or optional.
     */
    clientSide: "required" | "optional" | "unsupported";

    /**
     * Indicates if the server-side is required or optional.
     */
    serverSide: "required" | "optional" | "unsupported";

    /**
     * A short description of the project.
     */
    summary: string;
}
