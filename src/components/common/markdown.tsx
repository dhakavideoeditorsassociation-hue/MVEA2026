"use client";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Small, safe Markdown subset for editorial article bodies.
 *
 * Supported: `##`/`###` headings, `-` bullets, `1.` ordered lists, `>` quotes,
 * pipe tables, `![alt](src)` images, and inline **bold**, *italic*, `code` and
 * [links](url). No raw HTML is rendered, so admin input cannot inject markup.
 */

type InlineToken = { type: "text" | "strong" | "em" | "code" | "link"; value: string; href?: string };

function parseInline(input: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(input)) !== null) {
    if (match.index > lastIndex) tokens.push({ type: "text", value: input.slice(lastIndex, match.index) });
    const raw = match[0];

    if (raw.startsWith("**")) tokens.push({ type: "strong", value: raw.slice(2, -2) });
    else if (raw.startsWith("`")) tokens.push({ type: "code", value: raw.slice(1, -1) });
    else if (raw.startsWith("[")) {
      const linkMatch = raw.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) tokens.push({ type: "link", value: linkMatch[1], href: linkMatch[2] });
      else tokens.push({ type: "text", value: raw });
    } else tokens.push({ type: "em", value: raw.slice(1, -1) });

    lastIndex = match.index + raw.length;
  }

  if (lastIndex < input.length) tokens.push({ type: "text", value: input.slice(lastIndex) });
  return tokens;
}

function Inline({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((token, index) => {
        if (token.type === "strong") return <strong key={index} className="font-semibold text-foreground">{token.value}</strong>;
        if (token.type === "em") return <em key={index}>{token.value}</em>;
        if (token.type === "code")
          return (
            <code key={index} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground">
              {token.value}
            </code>
          );
        if (token.type === "link" && token.href)
          return (
            <Link key={index} href={token.href} className="font-medium text-primary underline underline-offset-2">
              {token.value}
            </Link>
          );
        return <span key={index}>{token.value}</span>;
      })}
    </>
  );
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

export function Markdown({ text, className }: { text: string; className?: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    // Standalone image
    const imageMatch = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      blocks.push(
        <figure key={index} className="my-6 overflow-hidden rounded-lg border border-border bg-muted">
          <Image
            src={imageMatch[2]}
            alt={imageMatch[1]}
            width={1200}
            height={675}
            unoptimized
            className="h-auto w-full object-cover"
          />
          {imageMatch[1] ? (
            <figcaption className="px-3 py-2 text-xs text-muted-foreground">{imageMatch[1]}</figcaption>
          ) : null}
        </figure>,
      );
      index += 1;
      continue;
    }

    // Headings
    if (/^###\s+/.test(line)) {
      blocks.push(
        <h3 key={index} className="mt-8 text-lg font-semibold text-foreground">
          <Inline text={line.replace(/^###\s+/, "")} />
        </h3>,
      );
      index += 1;
      continue;
    }
    if (/^##\s+/.test(line)) {
      blocks.push(
        <h2 key={index} className="mt-10 text-xl font-bold tracking-tight text-foreground">
          <Inline text={line.replace(/^##\s+/, "")} />
        </h2>,
      );
      index += 1;
      continue;
    }

    // Blockquote
    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push(
        <blockquote key={index} className="my-6 rounded-r-md border-l-4 border-primary/60 bg-muted/40 px-4 py-3 text-sm italic leading-relaxed text-foreground/85">
          <Inline text={quote.join(" ")} />
        </blockquote>,
      );
      continue;
    }

    // Table
    if (/^\|/.test(line.trim()) && index + 1 < lines.length && /^\|[\s:|-]+\|$/.test(lines[index + 1].trim())) {
      const header = splitRow(line);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && /^\|/.test(lines[index].trim())) {
        rows.push(splitRow(lines[index]));
        index += 1;
      }
      blocks.push(
        <div key={index} className="my-6 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-[0.7rem] uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                {header.map((cell, cellIndex) => (
                  <th key={cellIndex} className="px-3 py-2 text-left font-semibold">
                    <Inline text={cell} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-3 py-2 align-top text-foreground/90">
                      <Inline text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    // Bullet list
    if (/^-\s+/.test(line.trim())) {
      const items: string[] = [];
      while (index < lines.length && /^-\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^-\s+/, ""));
        index += 1;
      }
      blocks.push(
        <ul key={index} className="my-4 list-disc space-y-1.5 pl-5 text-base leading-relaxed text-foreground/90">
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>
              <Inline text={item} />
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line.trim())) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push(
        <ol key={index} className="my-4 list-decimal space-y-1.5 pl-5 text-base leading-relaxed text-foreground/90">
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>
              <Inline text={item} />
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    // Paragraph (gather until blank line)
    const paragraph: string[] = [];
    while (index < lines.length && lines[index].trim() && !/^(##|###|>|-\s|\d+\.\s|\|)/.test(lines[index].trim())) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(
      <p key={index} className="my-4 text-pretty text-base leading-[1.85] text-foreground/90">
        <Inline text={paragraph.join(" ")} />
      </p>,
    );
  }

  return <div className={cn("markdown-body", className)}>{blocks}</div>;
}
