import { FileInfo } from "@/utils/io/file-info";
import { VersionType } from "@/utils/versioning/version-type";
import { CrmmVersionInit, packCrmmVersionInit } from "@/platforms/crmm/crmm-version";
import { CrmmDependencyType } from "@/platforms/crmm";

describe("packCrmmVersionInit", () => {
    test("packs a CrmmVersionInit object and resolves default values", () => {
        const version = {
            project_id: "QQQQQQQQ",
            version_number: "1.0.0",
        } as CrmmVersionInit;

        const expected = {
            data: {
                project_id: "QQQQQQQQ",
                version_number: "1.0.0",
                name: "1.0.0",
                version_type: VersionType.RELEASE,
                featured: true,
                dependencies: [],
                game_versions: [],
                loaders: [],
                primary_file: undefined,
                file_parts: [],
            },
        };

        expect(packCrmmVersionInit(version)).toEqual(expected);
    });

    test("packs a CrmmVersionInit object", () => {
        const version = {
            project_id: "QQQQQQQQ",
            version_number: "1.0.0",
            name: "Version 1.0.0",
            version_type: VersionType.ALPHA,
            featured: false,
            dependencies: [{ project_id: "fabric-api", dependency_type: CrmmDependencyType.REQUIRED }],
            game_versions: ["1.16", "1.17"],
            loaders: ["loader1", "loader2"],
            files: ["file1", "file2"],
        } as CrmmVersionInit;

        const expected = {
            data: {
                project_id: "QQQQQQQQ",
                version_number: "1.0.0",
                name: "Version 1.0.0",
                version_type: VersionType.ALPHA,
                featured: false,
                dependencies: [{ project_id: "fabric-api", dependency_type: CrmmDependencyType.REQUIRED }],
                game_versions: ["1.16", "1.17"],
                loaders: ["loader1", "loader2"],
                primary_file: "_0",
                file_parts: ["_0", "_1"],
            },

            _0: FileInfo.of("file1"),
            _1: FileInfo.of("file2"),
        };

        expect(packCrmmVersionInit(version)).toEqual(expected);
    });
});
