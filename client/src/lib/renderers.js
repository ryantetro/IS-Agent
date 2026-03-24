function truncate(text, maxLength = 32) {
  const value = String(text || "").trim();
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

function formatHostname(url) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return hostname || "";
  } catch {
    return "";
  }
}

export function formatSourceBadgeLabel(source) {
  const title = source?.title || source || "Source";
  const hostname = formatHostname(source?.url || "");

  if (hostname) {
    return truncate(hostname, 28);
  }

  if (source?.path) {
    const parts = String(source.path).split("/");
    return truncate(parts[parts.length - 1] || source.path, 28);
  }

  return truncate(title, 28);
}

export function formatToolChipLabel(tool) {
  return String(tool || "").replaceAll("_", " ");
}
