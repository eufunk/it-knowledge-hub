import type { Element, ElementContent, Root } from "hast";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";

// F18: Schlüsselwort am Anfang eines Blockzitats -> Art der Hinweisbox
const CALLOUT_KINDS: Record<string, string> = {
  definition: "definition",
  tipp: "tipp",
  wichtig: "wichtig",
  achtung: "wichtig",
  hinweis: "hinweis",
  merke: "merke",
  "kurz gesagt": "merke",
};

function textOf(node: ElementContent): string {
  if (node.type === "text") return node.value;
  if (node.type === "element") return node.children.map(textOf).join("");
  return "";
}

function firstElement(node: Element): Element | undefined {
  return node.children.find((child): child is Element => child.type === "element");
}

function calloutKind(blockquote: Element): string | undefined {
  const paragraph = firstElement(blockquote);
  if (paragraph?.tagName !== "p") return undefined;
  const first = paragraph.children.find((child) => child.type !== "text" || child.value.trim() !== "");
  if (!first || first.type !== "element" || first.tagName !== "strong") return undefined;
  const label = textOf(first).replace(/:\s*$/, "").trim().toLowerCase();
  return CALLOUT_KINDS[label];
}

function rehypeCallouts() {
  const visit = (node: Root | Element) => {
    for (const child of node.children) {
      if (child.type !== "element") continue;
      if (child.tagName === "blockquote") {
        const kind = calloutKind(child);
        if (kind) child.properties = { ...child.properties, className: ["callout", `callout-${kind}`] };
      }
      visit(child);
    }
  };
  return (tree: Root) => visit(tree);
}

// F9: Markdown inkl. GFM-Tabellen, HTML (z. B. <details>) und Codeblöcken mit Syntax-Highlighting rendern.
// Nur für Inhalte aus dem eigenen Repository – fremde Inhalte vorher bereinigen (siehe CLAUDE.md).
export async function markdownToHtml(markdown: string): Promise<string> {
  const file = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeCallouts)
    .use(rehypePrettyCode, { theme: "github-light", keepBackground: true })
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}
