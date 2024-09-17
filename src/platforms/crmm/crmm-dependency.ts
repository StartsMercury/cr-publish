import { CrmmDependencyType } from "./crmm-dependency-type";

/**
 * Represents a CRMM version dependency.
 */
export interface CrmmDependency {
    /**
     * The version id of the dependency.
     */
    version_id?: string;

    /**
     * The project id of the dependency.
     */
    project_id?: string;

    /**
     * The file name of the dependency.
     */
    file_name?: string;

    /**
     * The type of dependency (e.g., required, optional).
     */
    dependency_type: CrmmDependencyType;
}
