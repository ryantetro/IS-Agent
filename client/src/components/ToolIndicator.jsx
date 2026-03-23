export default function ToolIndicator({ tools }) {
  if (!tools?.length) return null;
  return (
    <div className="tool-indicator">
      {tools.map((tool) => (
        <span className="tool-chip" key={`${tool}-${Math.random()}`}>
          {tool.replaceAll("_", " ")}
        </span>
      ))}
    </div>
  );
}
