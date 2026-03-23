import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({ snippet }) {
  const [copied, setCopied] = useState(false);
  async function copyCode() {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  const language = snippet.mode === "tailwind" ? "css" : "css";
  return (
    <div className="code-block">
      <div className="code-block__header">
        <span>{snippet.mode.toUpperCase()}</span>
        <button type="button" onClick={copyCode}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter language={language} style={oneLight} customStyle={{ margin: 0, borderRadius: 12 }}>
        {snippet.code}
      </SyntaxHighlighter>
      {snippet.explanation ? <p className="code-block__explain">{snippet.explanation}</p> : null}
    </div>
  );
}
