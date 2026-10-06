import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "@/app/page";

vi.mock("@/lib/server/session", () => ({ getCurrentUser: async () => null }));

describe("Startseite", () => {
  it("zeigt die Hauptüberschrift und führt zu den Lerninhalten", async () => {
    render(await Home());
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("IT verstehen.");
    expect(screen.getByRole("link", { name: /Zu den Lerninhalten/ })).toHaveAttribute("href", "/lerninhalte");
  });
});
