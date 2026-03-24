import { buildPreviewDocument } from "../lib/componentPreview.js";

export default function CSSPreviewPanel({ snippet }) {
  const { srcDoc, minHeight } = buildPreviewDocument(snippet);

  return (
    <div className="css-preview" style={{ borderTop: "1px solid var(--border-color)", padding: "16px", background: "var(--bg-secondary)" }}>
      <iframe
        title="UI Preview"
        srcDoc={srcDoc}
        sandbox="allow-scripts allow-same-origin"
        style={{ width: "100%", minHeight: `${minHeight}px`, border: "1px solid var(--border-color)", borderRadius: "12px", background: "#fff" }}
      />
    </div>
  );
}
