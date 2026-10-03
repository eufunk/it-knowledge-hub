import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";

// F9: Markdown inkl. GFM-Tabellen und Codeblöcken mit Syntax-Highlighting rendern.
// Nur für Inhalte aus dem eigenen Repository – fremde Inhalte vorher bereinigen (siehe CLAUDE.md).
export async function markdownToHtml(markdown: string): Promise<string> {
  const file = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrettyCode, { theme: "github-light", keepBackground: true })
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}
