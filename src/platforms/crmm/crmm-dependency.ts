import { CrmmDependencyType } from "./crmm-dependency-type";

/**
 * Represents a CRMM version dependency.
 */
export interface CrmmDependency {
    /**
     * The version id of the dependency.
     */
    id: string;

    /**
     * The project id of the dependency.
     */
    projectId: string;

    /**
     * The version id of the dependency.
     */
    versionId: string;

    /**
     * The type of dependency (e.g., required, optional).
     */
    dependencyType: CrmmDependencyType;
}
