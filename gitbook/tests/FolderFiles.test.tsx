import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FolderFiles from "../src/components/FolderFiles";

const files = [
  { href: "/testing/unit", label: "UnitTesten" },
  { href: "/testing/mock", label: "Mocking" },
];

describe("FolderFiles", () => {
  it("renders nothing when there are no files", () => {
    render(<FolderFiles files={[]} />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("shows the file list after clicking the see files button", async () => {
    const user = userEvent.setup();
    render(<FolderFiles files={files} />);

    expect(screen.getByText("See files (2)")).toBeInTheDocument();
    expect(screen.queryByRole("link")).toBeNull();

    await user.click(screen.getByRole("button"));

    const first = screen.getByRole("link", { name: "UnitTesten" });
    const second = screen.getByRole("link", { name: "Mocking" });
    expect(first).toHaveAttribute("href", "/testing/unit");
    expect(second).toHaveAttribute("href", "/testing/mock");
  });

  it("toggles the list closed again", async () => {
    const user = userEvent.setup();
    render(<FolderFiles files={files} />);

    const button = screen.getByRole("button");
    await user.click(button);
    expect(screen.getAllByRole("link")).toHaveLength(2);

    await user.click(button);
    expect(screen.queryByRole("link")).toBeNull();
  });
});