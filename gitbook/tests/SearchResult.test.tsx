import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import SearchResult from "../src/components/SearchResult";
import { Dialog } from "../src/components/ui/dialog";
import type { DocNode } from "../src/types";

const tree: DocNode = {
  path: "/",
  files: [{ filename: "index.md", content: "# Home\nWelcome to the docs" }],
  children: [
    {
      path: "/security",
      files: [
        { filename: "index.md", content: "# Security\nOverview" },
        { filename: "Moq.md", content: "# Moq\nMocking framework for tests" },
      ],
      children: [],
    },
    {
      path: "/cloudsystems",
      files: [{ filename: "Docker Compose.md", content: "# Docker Compose\nMulti-container apps" }],
      children: [],
    },
  ],
};

const renderInDialog = (query: string) =>
  render(
    <Dialog open>
      <SearchResult query={query} data={tree} />
    </Dialog>,
  );

describe("SearchResult", () => {
  it("matches on file names", () => {
    renderInDialog("moq");
    const link = screen.getByRole("link", { name: /Moq/i });
    expect(link).toHaveAttribute("href", "/security/moq");
  });

  it("matches on content text", () => {
    renderInDialog("multi-container");
    const link = screen.getByRole("link", { name: /Docker Compose/i });
    expect(link).toHaveAttribute("href", "/cloudsystems/docker-compose");
  });

  it("links folder indexes to their folder route", () => {
    renderInDialog("Overview");
    const link = screen.getByRole("link", { name: /Security/i });
    expect(link).toHaveAttribute("href", "/security");
  });

  it("shows nothing when there are no matches", () => {
    renderInDialog("nothing-matches-this");
    expect(screen.queryByRole("link")).toBeNull();
  });
});