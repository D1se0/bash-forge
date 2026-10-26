import { marked } from "marked";

export function markdownToHtml(md: string): string {
  return marked.parse(md, { breaks: true, async: false }) as string;
}
