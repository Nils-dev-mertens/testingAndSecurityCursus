import { describe, expect, it } from "vitest";
import {
  buildLeanTree,
  buildPageList,
  filesInFolder,
  findNodeByPath,
  getPagination,
  labelForPath,
  pagePathForId,
  slugify,
} from "../src/lib/pages";
import type { DocNode } from "../src/types";

describe("slugify", () => {
  it("matches Astro route slugs", () => {
    expect(slugify("Digital Verification")).toBe("digital-verification");
    expect(slugify("AccepatieTesten")).toBe("accepatietesten");
    expect(slugify("Basic Docker commandos")).toBe("basic-docker-commandos");
    expect(slugify("HTTPS")).toBe("https");
    expect(slugify("2FA")).toBe("2fa");
  });
});

describe("pagePathForId", () => {
  it("maps the root index", () => {
    expect(pagePathForId("index")).toBe("/");
  });

  it("maps a folder index to its folder route", () => {
    expect(pagePathForId("security/index")).toBe("/security");
  });

  it("maps a file id to its route", () => {
    expect(pagePathForId("security/https")).toBe("/security/https");
    expect(pagePathForId("testing/unittesten/nunit")).toBe("/testing/unittesten/nunit");
  });
});

describe("labelForPath", () => {
  it("returns Home for the root", () => {
    expect(labelForPath("/")).toBe("Home");
  });

  it("returns the last segment", () => {
    expect(labelForPath("/security/https")).toBe("https");
  });
});

describe("buildPageList", () => {
  it("deduplicates and sorts pages", () => {
    const list = buildPageList([
      "security/https",
      "index",
      "testing/index",
      "security/index",
      "testing/uitesting/playwright",
      "cloudsystems/index",
    ]);
    expect(list.map((p) => p.href)).toEqual([
      "/",
      "/cloudsystems",
      "/security",
      "/security/https",
      "/testing",
      "/testing/uitesting/playwright",
    ]);
  });
});

describe("getPagination", () => {
  const list = [
    { href: "/a", label: "A" },
    { href: "/b", label: "B" },
    { href: "/c", label: "C" },
  ];

  it("returns nothing for an unknown path", () => {
    expect(getPagination(list, "/missing")).toEqual({});
  });

  it("returns prev/next neighbours", () => {
    expect(getPagination(list, "/b")).toEqual({
      prev: { href: "/a", label: "A" },
      next: { href: "/c", label: "C" },
    });
  });

  it("has no prev on the first page and no next on the last", () => {
    expect(getPagination(list, "/a").prev).toBeUndefined();
    expect(getPagination(list, "/c").next).toBeUndefined();
  });
});

describe("buildLeanTree", () => {
  it("builds folders, index files and child files", () => {
    const tree = buildLeanTree([
      "index",
      "security/index",
      "security/authorization/index",
      "security/authorization/jwt",
      "security/digital-verification/2FA",
    ]);

    const security = findNodeByPath(tree, "/security");
    expect(security).not.toBeNull();
    expect(security!.files.map((f) => f.filename)).toEqual(["index.md"]);

    const auth = findNodeByPath(tree, "/security/authorization")!;
    expect(auth.files.map((f) => f.filename)).toEqual(["index.md", "jwt.md"]);
  });
});

describe("findNodeByPath", () => {
  const tree = buildLeanTree(["index", "security/index", "security/https"]);

  it("finds existing nodes", () => {
    expect(findNodeByPath(tree, "/")).not.toBeNull();
    expect(findNodeByPath(tree, "/security")!.path).toBe("/security");
  });

  it("returns null for missing nodes", () => {
    expect(findNodeByPath(tree, "/security/oauth")).toBeNull();
  });
});

describe("filesInFolder", () => {
  const tree = buildLeanTree([
    "index",
    "security/index",
    "security/https",
    "security/digital-verification/index",
    "security/digital-verification/Digital Verification",
    "security/authorization/index",
  ]);

  it("lists files with slugified hrefs and original labels", () => {
    const links = filesInFolder(tree, "/security/digital-verification");
    expect(links).toEqual([
      {
        href: "/security/digital-verification/digital-verification",
        label: "Digital Verification",
      },
    ]);
  });

  it("returns an empty list for the home folder", () => {
    expect(filesInFolder(tree, "/")).toEqual([]);
  });
});

describe("tree.json shape compatibility", () => {
  it("matches the DocNode shape used by search", () => {
    const tree = buildLeanTree(["index", "security/index"]) as DocNode & {
      children: unknown[];
    };
    expect(tree.path).toBe("/");
    expect(tree.files[0].filename).toBe("index.md");
    expect(Array.isArray(tree.children)).toBe(true);
  });
});