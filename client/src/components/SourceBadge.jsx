import { formatSourceBadgeLabel } from "../lib/renderers.js";

export default function SourceBadge({ source }) {
  const label = formatSourceBadgeLabel(source);
  const detail = source?.path || source?.url || "";
  const href = source?.url || "";
  const tooltip = [source?.title, source?.snippet || detail].filter(Boolean).join("\n\n");

  if (href) {
    return (
      <a
        className="source-badge source-badge--link"
        href={href}
        target="_blank"
        rel="noreferrer"
        title={tooltip}
      >
        <span className="source-badge__label">{label}</span>
      </a>
    );
  }

  return (
    <span className="source-badge" title={tooltip}>
      <span className="source-badge__label">{label}</span>
    </span>
  );
}
