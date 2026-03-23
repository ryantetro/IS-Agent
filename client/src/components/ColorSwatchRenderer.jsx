export default function ColorSwatchRenderer({ palette }) {
  return (
    <section className="palette-card">
      <h4>{palette.title}</h4>
      <div className="palette-grid">
        {palette.colors.map((color) => (
          <div className="palette-item" key={`${color.label}-${color.hex}`}>
            <div className="palette-chip" style={{ backgroundColor: color.hex }} />
            <div className="palette-meta">
              <strong>{color.label}</strong>
              <span>{color.hex.toUpperCase()}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
