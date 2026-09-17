import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import SidebarNav from "../src/components/SidebarNav";
import type { LeanNode } from "../src/lib/pages";

const tree: LeanNode = {
  path: "/",
  label: "Home",
  files: [{ filename: "index.md" }],
  children: [
    {
      path: "/security",
      label: "Security",
      files: [{ filename: "index.md" }, { filename: "HTTPS.md" }],
      children: [
        {
          path: "/security/authorization",
          label: "authorization",
          files: [{ filename: "index.md" }, { filename: "jwt.md" }],
          children: [],
        },
      ],
    },
    {
      path: "/cloudsystems",
      label: "cloudsystems",
      files: [{ filename: "index.md" }],
      children: [],
    },
  ],
};

describe("SidebarNav", () => {
  it("renders the Home entry and folders", () => {
    render(<SidebarNav currentPath="/" tree={tree} />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Security" })).toHaveAttribute(
      "href",
      "/security",
    );
  });

  it("renders the files of an open folder", () => {
    render(<SidebarNav currentPath="/security" tree={tree} />);
    expect(screen.getByRole("link", { name: "HTTPS" })).toHaveAttribute(
      "href",
      "/security/https",
    );
    expect(screen.getByRole("link", { name: "jwt" })).toHaveAttribute(
      "href",
      "/security/authorization/jwt",
    );
  });

  it("marks the current page as active", () => {
    render(<SidebarNav currentPath="/security/https" tree={tree} />);
    const active = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("data-active") === "true");
    expect(active).toHaveLength(1);
    expect(active[0]).toHaveTextContent("HTTPS");
  });
});