import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("Startseite", () => {
  it("zeigt die Hauptüberschrift und führt zu den Lerninhalten", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("IT verstehen.");
    expect(screen.getByRole("link", { name: /Zu den Lerninhalten/ })).toHaveAttribute("href", "/lerninhalte");
  });
});
