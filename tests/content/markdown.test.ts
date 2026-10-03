// @vitest-environment node
import { describe, expect, it } from "vitest";
import { markdownToHtml } from "@/lib/content/markdown";

describe("F18: Hinweisboxen und eingeklappte Lösungen", () => {
  it("macht aus Blockzitaten mit Schlüsselwort Hinweisboxen", async () => {
    const html = await markdownToHtml(
      "> **Definition:** Automatisierung ist …\n\n> **Tipp:** Klein anfangen.\n\n> **Achtung:** Vorsicht.\n\n> **Kurz gesagt:** Fazit.",
    );
    expect(html).toContain('class="callout callout-definition"');
    expect(html).toContain('class="callout callout-tipp"');
    expect(html).toContain('class="callout callout-wichtig"');
    expect(html).toContain('class="callout callout-merke"');
  });

  it("lässt normale Blockzitate unverändert", async () => {
    const html = await markdownToHtml("> Ein Zitat ohne Schlüsselwort.");
    expect(html).toContain("<blockquote>");
    expect(html).not.toContain("callout");
  });

  it("erhält eingeklappte Musterlösungen mit Markdown darin", async () => {
    const html = await markdownToHtml(
      "<details>\n<summary>Musterlösung anzeigen</summary>\n\n**Lösung:**\n\n```bash\necho hallo\n```\n\n</details>",
    );
    expect(html).toContain("<details>");
    expect(html).toContain("<summary>Musterlösung anzeigen</summary>");
    expect(html).toContain("<strong>Lösung:</strong>");
    expect(html).toContain('data-language="bash"');
  });
});
