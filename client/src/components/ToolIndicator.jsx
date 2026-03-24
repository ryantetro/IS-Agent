import { formatToolChipLabel } from "../lib/renderers.js";

export default function ToolIndicator({ tools }) {
  if (!tools?.length) return null;
  return (
    <div className="tool-indicator">
      {tools.map((tool, index) => (
        <span className="tool-chip" key={`${tool}-${index}`}>
          {formatToolChipLabel(tool)}
        </span>
      ))}
    </div>
  );
}
