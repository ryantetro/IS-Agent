export default function CSSPreviewPanel({ snippet }) {
  const isTailwind = snippet.mode === "tailwind";
  const escapedCode = snippet.code.replace(/<\/script>/g, "<\\/script>");

  const srcDoc = isTailwind
    ? `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body{margin:0;background:#f8fafc;font-family:ui-sans-serif,system-ui;padding:16px} .wrap{display:flex;align-items:center;justify-content:center;min-height:120px;border:1px dashed #cbd5e1;border-radius:12px;background:white}</style>
  </head>
  <body>
    <div class="wrap"><button class="${escapedCode}">Preview Element</button></div>
  </body>
</html>`
    : `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body{margin:0;background:#f8fafc;font-family:ui-sans-serif,system-ui;padding:16px}
      .preview-root{display:flex;align-items:center;justify-content:center;min-height:120px;border:1px dashed #cbd5e1;border-radius:12px;background:white}
      ${escapedCode}
    </style>
  </head>
  <body>
    <div class="preview-root"><div class="card">Preview Element</div></div>
  </body>
</html>`;

  return (
    <div className="css-preview">
      <iframe title="CSS Preview" srcDoc={srcDoc} sandbox="allow-scripts" />
    </div>
  );
}
