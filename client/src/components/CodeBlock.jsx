import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import CSSPreviewPanel from "./CSSPreviewPanel.jsx";

export default function CodeBlock({ snippet }) {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  async function copyCode() {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const language = snippet.mode === "html" ? "html" : "css";
  const displayLabel =
    snippet.mode === "html"
      ? "HTML + Tailwind"
      : snippet.mode === "tailwind"
        ? "Tailwind Classes"
        : "CSS";

  return (
    <div className="code-block" style={{ margin: "16px 0", borderRadius: "8px", background: "#0d0d0d", color: "#f8f8f2", overflow: "hidden", border: "1px solid var(--border-color)" }}>
      <div className="code-block-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px", background: "#2d2d2d", fontSize: "12px", color: "#b4b4b4" }}>
        <span style={{ fontWeight: 600, letterSpacing: "0.05em", color: "#ececec" }}>{displayLabel}</span>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => setShowPreview((prev) => !prev)}
            style={{ display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "none", color: "#b4b4b4", cursor: "pointer", fontSize: "12px", fontWeight: 500 }}
          >
            {showPreview ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            )}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
          <button
            type="button"
            onClick={copyCode}
            style={{ display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "none", color: "#b4b4b4", cursor: "pointer", fontSize: "12px", fontWeight: 500 }}
          >
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10a37f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            )}
            {copied ? <span style={{ color: "#10a37f" }}>Copied</span> : "Copy Code"}
          </button>
        </div>
      </div>

      {!showPreview && (
        <div style={{ maxHeight: "400px", overflow: "auto" }}>
          <SyntaxHighlighter
            language={language}
            style={oneDark}
            customStyle={{ margin: 0, borderRadius: 0, background: "#0c0c0c", fontSize: "13px", lineHeight: 1.5 }}
          >
            {snippet.code}
          </SyntaxHighlighter>
        </div>
      )}

      {snippet.explanation && !showPreview && (
        <div style={{ padding: "12px 16px", color: "#a1a1aa", fontSize: "13px", background: "#18181b", borderTop: "1px solid #27272a" }}>
          {snippet.explanation}
        </div>
      )}

      {showPreview && <CSSPreviewPanel snippet={snippet} />}
    </div>
  );
}
