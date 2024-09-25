/**
 * Represents a CRMM loader.
 */
export interface CrmmLoader {
    /**
     * The name of the loader.
     */
    name: string;

    /**
     * The project types that this loader is applicable to.
     */
    supportedProjectTypes: string[];

    /**
     * The project metadata.
     */
    metadata: {
        visibleInTagsList: boolean;
        visibleInLoadersList: boolean;
        isAFilter: boolean;
        accent?: {
            foreground: {
                light: string;
                dark: string;
            };
        };
    };
}
