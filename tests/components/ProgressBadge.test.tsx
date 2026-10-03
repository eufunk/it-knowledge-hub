import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgressBadge } from "@/components/learning/ProgressBadge";

describe("F4: ProgressBadge", () => {
  it("zeigt 0 % Fortschritt", () => {
    render(<ProgressBadge percent={0} />);
    expect(screen.getByText("0% Fortschritt")).toBeInTheDocument();
  });

  it("zeigt Zwischenstände", () => {
    render(<ProgressBadge percent={22} />);
    expect(screen.getByText("22% Fortschritt")).toBeInTheDocument();
  });

  it("zeigt bei 100 % „Abgeschlossen“ statt einer Prozentzahl", () => {
    render(<ProgressBadge percent={100} />);
    expect(screen.getByText("Abgeschlossen")).toBeInTheDocument();
    expect(screen.queryByText(/Fortschritt/)).not.toBeInTheDocument();
  });
});
