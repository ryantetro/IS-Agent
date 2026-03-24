function escapeScriptContent(value) {
  return String(value || "").replace(/<\/script>/gi, "<\\/script>");
}

function inferPreviewKind(request = "") {
  const text = String(request || "");

  if (/(pricing|subscription|plan|billing)/i.test(text)) {
    return "pricing";
  }

  if (/(navbar|navigation|header)/i.test(text)) {
    return "navbar";
  }

  if (/(modal|dialog)/i.test(text)) {
    return "modal";
  }

  if (/(login|signup|sign up|form|checkout)/i.test(text)) {
    return "form";
  }

  if (/(button|cta)/i.test(text)) {
    return "button";
  }

  if (/(card|testimonial|profile|feature)/i.test(text)) {
    return "card";
  }

  return "generic";
}

function buildHtmlDocument(markup) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        padding: 24px;
        display: grid;
        place-items: center;
        background:
          radial-gradient(circle at top, rgba(148, 163, 184, 0.18), transparent 36%),
          linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
        font-family: "DM Sans", ui-sans-serif, system-ui, sans-serif;
        color: #0f172a;
      }
    </style>
  </head>
  <body>
    ${markup}
  </body>
</html>`;
}

function buildTailwindMarkup(classes, kind) {
  if (kind === "pricing") {
    return `<section class="${classes}">
  <div class="flex items-center justify-between">
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Pro Plan</p>
      <h2 class="mt-2 text-2xl font-bold tracking-tight">Creator Suite</h2>
    </div>
    <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Popular</span>
  </div>
  <div class="mt-6">
    <div class="flex items-end gap-2">
      <span class="text-5xl font-black tracking-tight">$24</span>
      <span class="pb-2 text-sm text-slate-500">/ month</span>
    </div>
    <p class="mt-3 text-sm leading-6 text-slate-600">For freelancers and small teams shipping polished work fast.</p>
  </div>
  <ul class="mt-6 space-y-3 text-sm text-slate-700">
    <li class="flex items-start gap-3"><span class="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500"></span><span>Unlimited projects and shareable review links</span></li>
    <li class="flex items-start gap-3"><span class="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500"></span><span>Priority support with 24-hour turnaround</span></li>
    <li class="flex items-start gap-3"><span class="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500"></span><span>Weekly AI design recommendations</span></li>
  </ul>
  <button class="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
    Start free trial
  </button>
</section>`;
  }

  if (kind === "navbar") {
    return `<header class="${classes}">
  <a href="#" class="text-lg font-black tracking-tight">Northstar</a>
  <nav class="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
    <a href="#">Product</a>
    <a href="#">Pricing</a>
    <a href="#">Docs</a>
  </nav>
  <button class="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Book demo</button>
</header>`;
  }

  if (kind === "modal") {
    return `<section class="${classes}">
  <div class="flex items-start justify-between gap-4">
    <div>
      <p class="text-sm font-semibold text-sky-600">Quick action</p>
      <h2 class="mt-1 text-2xl font-bold tracking-tight">Invite your team</h2>
    </div>
    <button class="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500">Esc</button>
  </div>
  <p class="mt-4 text-sm leading-6 text-slate-600">Send a private workspace invite and keep everyone synced on the latest deliverables.</p>
  <div class="mt-6 grid gap-3">
    <input value="alex@northstar.dev" class="rounded-2xl border border-slate-200 px-4 py-3 text-sm" readOnly />
    <div class="flex gap-3">
      <button class="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">Send invite</button>
      <button class="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">Cancel</button>
    </div>
  </div>
</section>`;
  }

  if (kind === "form") {
    return `<form class="${classes}">
  <div>
    <p class="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Welcome back</p>
    <h2 class="mt-2 text-2xl font-bold tracking-tight">Sign in to your workspace</h2>
  </div>
  <label class="mt-6 grid gap-2 text-sm font-medium text-slate-700">
    Email
    <input type="email" value="you@example.com" class="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-normal text-slate-700" readOnly />
  </label>
  <label class="mt-4 grid gap-2 text-sm font-medium text-slate-700">
    Password
    <input type="password" value="password" class="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-normal text-slate-700" readOnly />
  </label>
  <button class="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
    Continue
  </button>
</form>`;
  }

  if (kind === "button") {
    return `<div class="flex justify-center">
  <button class="${classes}">Launch campaign</button>
</div>`;
  }

  if (kind === "card") {
    return `<article class="${classes}">
  <p class="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">Featured</p>
  <h2 class="mt-3 text-2xl font-bold tracking-tight">Design system refresh</h2>
  <p class="mt-3 text-sm leading-6 text-slate-600">A reusable UI card with stronger hierarchy, better spacing, and room for a clear CTA.</p>
  <div class="mt-6 flex items-center justify-between text-sm text-slate-500">
    <span>Updated 2 hours ago</span>
    <span>8 comments</span>
  </div>
</article>`;
  }

  return `<section class="${classes}">
  <h2 class="text-2xl font-bold tracking-tight">Component Preview</h2>
  <p class="mt-3 text-sm leading-6 text-slate-600">This scaffold adapts to the request so the preview feels like a real UI block instead of a generic placeholder.</p>
</section>`;
}

function buildCssMarkup(kind) {
  if (kind === "pricing") {
    return `<article class="card">
  <div class="eyebrow-row">
    <p class="eyebrow">Pro Plan</p>
    <span class="badge">Popular</span>
  </div>
  <h2>Creator Suite</h2>
  <div class="price-row">
    <strong>$24</strong>
    <span>/ month</span>
  </div>
  <p class="supporting-copy">For freelancers and small teams shipping polished client work every week.</p>
  <ul>
    <li>Unlimited project boards</li>
    <li>Priority support</li>
    <li>Weekly AI recommendations</li>
  </ul>
  <button class="button">Start free trial</button>
</article>`;
  }

  if (kind === "navbar") {
    return `<nav class="nav">
  <strong>Northstar</strong>
  <div class="nav-links">
    <span>Product</span>
    <span>Pricing</span>
    <span>Docs</span>
  </div>
  <button class="button">Book demo</button>
</nav>`;
  }

  if (kind === "form") {
    return `<form class="card form-shell">
  <p class="eyebrow">Welcome back</p>
  <h2>Sign in</h2>
  <label>Email<input value="you@example.com" readOnly /></label>
  <label>Password<input type="password" value="password" readOnly /></label>
  <button class="button">Continue</button>
</form>`;
  }

  if (kind === "button") {
    return `<div class="button-row"><button class="button">Launch campaign</button></div>`;
  }

  return `<article class="card">
  <p class="eyebrow">Featured</p>
  <h2>Component Preview</h2>
  <p class="supporting-copy">A richer scaffold makes CSS previews feel like real UI output.</p>
</article>`;
}

export function buildPreviewDocument(snippet) {
  const mode = snippet?.mode || "css";
  const request = snippet?.request || snippet?.explanation || "";
  const code = escapeScriptContent(snippet?.code || "");
  const kind = inferPreviewKind(request);

  if (mode === "html") {
    return {
      kind,
      minHeight: kind === "pricing" ? 520 : 340,
      srcDoc: buildHtmlDocument(code),
    };
  }

  if (mode === "tailwind") {
    return {
      kind,
      minHeight: kind === "pricing" ? 520 : kind === "navbar" ? 220 : 320,
      srcDoc: buildHtmlDocument(buildTailwindMarkup(code, kind)),
    };
  }

  return {
    kind,
    minHeight: kind === "pricing" ? 520 : kind === "navbar" ? 220 : 320,
    srcDoc: `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        padding: 24px;
        display: grid;
        place-items: center;
        background:
          radial-gradient(circle at top, rgba(148, 163, 184, 0.18), transparent 36%),
          linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
        font-family: "DM Sans", ui-sans-serif, system-ui, sans-serif;
        color: #0f172a;
      }

      .card,
      .nav,
      .button-row {
        width: min(100%, 420px);
      }

      .eyebrow {
        margin: 0;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.24em;
        text-transform: uppercase;
        color: #0284c7;
      }

      .eyebrow-row,
      .price-row,
      .nav,
      .nav-links {
        display: flex;
        align-items: center;
      }

      .eyebrow-row,
      .price-row,
      .nav {
        justify-content: space-between;
      }

      .badge {
        border-radius: 999px;
        background: #ecfdf5;
        padding: 6px 12px;
        font-size: 12px;
        font-weight: 700;
        color: #047857;
      }

      .price-row {
        margin-top: 20px;
        gap: 8px;
      }

      .price-row strong {
        font-size: 48px;
        line-height: 1;
      }

      .price-row span {
        color: #64748b;
      }

      .supporting-copy {
        margin-top: 16px;
        color: #475569;
        line-height: 1.6;
      }

      ul {
        margin: 24px 0 0;
        padding-left: 20px;
        color: #334155;
      }

      li + li {
        margin-top: 10px;
      }

      .button {
        margin-top: 24px;
      }

      .nav-links {
        gap: 24px;
        color: #475569;
      }

      .form-shell {
        display: grid;
        gap: 14px;
      }

      label {
        display: grid;
        gap: 8px;
        font-size: 14px;
        font-weight: 600;
        color: #334155;
      }

      input {
        border: 1px solid #cbd5e1;
        border-radius: 16px;
        padding: 14px 16px;
        font: inherit;
      }

      ${code}
    </style>
  </head>
  <body>
    ${buildCssMarkup(kind)}
  </body>
</html>`,
  };
}
