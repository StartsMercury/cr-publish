import { DependencyType } from "@/dependencies/dependency-type";
import { CrmmDependencyType } from "@/platforms/crmm/crmm-dependency-type";

describe("CrmmDependencyType", () => {
    describe("parse", () => {
        test("parses all its own formatted values", () => {
            for (const value of CrmmDependencyType.values()) {
                expect(CrmmDependencyType.parse(CrmmDependencyType.format(value))).toBe(value);
            }
        });

        test("parses all friendly names of its own values", () => {
            for (const value of CrmmDependencyType.values()) {
                expect(CrmmDependencyType.parse(CrmmDependencyType.friendlyNameOf(value))).toBe(value);
            }
        });

        test("parses all its own formatted values in lowercase", () => {
            for (const value of CrmmDependencyType.values()) {
                expect(CrmmDependencyType.parse(CrmmDependencyType.format(value).toLowerCase())).toBe(value);
            }
        });

        test("parses all its own formatted values in UPPERCASE", () => {
            for (const value of CrmmDependencyType.values()) {
                expect(CrmmDependencyType.parse(CrmmDependencyType.format(value).toUpperCase())).toBe(value);
            }
        });
    });

    describe("fromDependencyType", () => {
        test("returns `CrmmDependencyType.REQUIRED` for `DependencyType.REQUIRED`", () => {
            expect(CrmmDependencyType.fromDependencyType(DependencyType.REQUIRED)).toBe(CrmmDependencyType.REQUIRED);
        });

        test("returns `CrmmDependencyType.OPTIONAL` for `DependencyType.RECOMMENDED`", () => {
            expect(CrmmDependencyType.fromDependencyType(DependencyType.RECOMMENDED)).toBe(CrmmDependencyType.OPTIONAL);
        });

        test("returns `CrmmDependencyType.EMBEDDED` for `DependencyType.EMBEDDED`", () => {
            expect(CrmmDependencyType.fromDependencyType(DependencyType.EMBEDDED)).toBe(CrmmDependencyType.EMBEDDED);
        });

        test("returns `CrmmDependencyType.OPTIONAL` for `DependencyType.OPTIONAL`", () => {
            expect(CrmmDependencyType.fromDependencyType(DependencyType.OPTIONAL)).toBe(CrmmDependencyType.OPTIONAL);
        });

        test("returns `CrmmDependencyType.INCOMPATIBLE` for `DependencyType.CONFLICTING`", () => {
            expect(CrmmDependencyType.fromDependencyType(DependencyType.CONFLICTING)).toBe(CrmmDependencyType.INCOMPATIBLE);
        });

        test("returns `CrmmDependencyType.INCOMPATIBLE` for `DependencyType.INCOMPATIBLE`", () => {
            expect(CrmmDependencyType.fromDependencyType(DependencyType.INCOMPATIBLE)).toBe(CrmmDependencyType.INCOMPATIBLE);
        });

        test("returns undefined for invalid DependencyType values", () => {
            expect(CrmmDependencyType.fromDependencyType(undefined)).toBeUndefined();
            expect(CrmmDependencyType.fromDependencyType("invalid value" as DependencyType)).toBeUndefined();
        });
    });

    describe("toDependencyType", () => {
        test("returns `DependencyType.REQUIRED` for `CrmmDependencyType.REQUIRED`", () => {
            expect(CrmmDependencyType.toDependencyType(CrmmDependencyType.REQUIRED)).toBe(DependencyType.REQUIRED);
        });

        test("returns `DependencyType.OPTIONAL` for `CrmmDependencyType.OPTIONAL`", () => {
            expect(CrmmDependencyType.toDependencyType(CrmmDependencyType.OPTIONAL)).toBe(DependencyType.OPTIONAL);
        });

        test("returns `DependencyType.INCOMPATIBLE` for `CrmmDependencyType.INCOMPATIBLE`", () => {
            expect(CrmmDependencyType.toDependencyType(CrmmDependencyType.INCOMPATIBLE)).toBe(DependencyType.INCOMPATIBLE);
        });

        test("returns `DependencyType.EMBEDDED` for `CrmmDependencyType.EMBEDDED`", () => {
            expect(CrmmDependencyType.toDependencyType(CrmmDependencyType.EMBEDDED)).toBe(DependencyType.EMBEDDED);
        });

        test("returns undefined for invalid CrmmDependencyType values", () => {
            expect(CrmmDependencyType.toDependencyType(undefined)).toBeUndefined();
            expect(CrmmDependencyType.toDependencyType("invalid value" as CrmmDependencyType)).toBeUndefined();
        });
    });
});
