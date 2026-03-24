function renderInline(text, keyPrefix) {
  const parts = [];
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let lastIndex = 0;
  let matchIndex = 0;

  for (const match of text.matchAll(pattern)) {
    const token = match[0];
    const start = match.index ?? 0;

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    if (token.startsWith("**")) {
      parts.push(
        <strong key={`${keyPrefix}-strong-${matchIndex}`}>{token.slice(2, -2)}</strong>
      );
    } else {
      parts.push(<code key={`${keyPrefix}-code-${matchIndex}`}>{token.slice(1, -1)}</code>);
    }

    lastIndex = start + token.length;
    matchIndex += 1;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function parseBlocks(text) {
  const lines = String(text || "").replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    if (/^#{1,3}\s+/.test(line)) {
      const level = Math.min(line.match(/^#+/)?.[0]?.length || 1, 3);
      blocks.push({
        type: "heading",
        level,
        text: line.replace(/^#{1,3}\s+/, ""),
      });
      index += 1;
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "ordered-list", items });
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "unordered-list", items });
      continue;
    }

    const paragraphLines = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^#{1,3}\s+/.test(lines[index].trim()) &&
      !/^\d+\.\s+/.test(lines[index].trim()) &&
      !/^[-*]\s+/.test(lines[index].trim())
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    blocks.push({
      type: "paragraph",
      text: paragraphLines.join(" "),
    });
  }

  return blocks;
}

export default function MessageContent({ text }) {
  const blocks = parseBlocks(text);

  return (
    <div className="message-content">
      {blocks.map((block, index) => {
        const key = `block-${index}`;

        if (block.type === "heading") {
          const HeadingTag = `h${block.level}`;
          return (
            <HeadingTag className="message-content__heading" key={key}>
              {renderInline(block.text, key)}
            </HeadingTag>
          );
        }

        if (block.type === "ordered-list") {
          return (
            <ol className="message-content__list message-content__list--ordered" key={key}>
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>{renderInline(item, `${key}-${itemIndex}`)}</li>
              ))}
            </ol>
          );
        }

        if (block.type === "unordered-list") {
          return (
            <ul className="message-content__list" key={key}>
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>{renderInline(item, `${key}-${itemIndex}`)}</li>
              ))}
            </ul>
          );
        }

        return (
          <p className="message-content__paragraph" key={key}>
            {renderInline(block.text, key)}
          </p>
        );
      })}
    </div>
  );
}
