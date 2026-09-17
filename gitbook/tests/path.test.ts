import { describe, expect, it } from "vitest";
import { normalizePath } from "../src/lib/path";

describe("normalizePath", () => {
  it("defaults to the root for empty input", () => {
    expect(normalizePath(null)).toBe("/");
    expect(normalizePath(undefined)).toBe("/");
    expect(normalizePath("")).toBe("/");
  });

  it("ensures a leading slash", () => {
    expect(normalizePath("security/https")).toBe("/security/https");
  });

  it("strips a trailing slash", () => {
    expect(normalizePath("/security/https/")).toBe("/security/https");
  });

  it("decodes percent-encoding", () => {
    expect(normalizePath("/security/digital-verification%202FA")).toBe(
      "/security/digital-verification 2FA",
    );
  });

  it("keeps the root if only a slash", () => {
    expect(normalizePath("/")).toBe("/");
  });
});