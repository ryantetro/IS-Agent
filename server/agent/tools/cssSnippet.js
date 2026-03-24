import { DynamicStructuredTool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { logger } from "../../logger.js";

const cssSnippetSchema = z.object({
  description: z.string().min(5),
  mode: z.enum(["css", "tailwind", "html"]).default("html"),
  constraints: z.string().default(""),
});

const cssOutputSchema = z.object({
  mode: z.enum(["css", "tailwind", "html"]),
  code: z.string().min(1),
  explanation: z.string().min(1),
});

const CLASSES_ONLY_PATTERN = /(tailwind classes?|utility classes?|classes only|class strings?|className)/i;
const COMPONENT_REQUEST_PATTERN =
  /(html|markup|component|pricing|price(?:\s+card)?|card|hero|navbar|nav(?:bar)?|modal|dialog|form|section|layout|page|screen|table|grid|testimonial|footer|header)/i;

function canUseLiveOpenAI() {
  return Boolean(process.env.OPENAI_API_KEY) && process.env.DESIGNMIND_OFFLINE_TESTS !== "1";
}

function inferComponentKind(description = "") {
  const text = String(description || "");

  if (/(pricing|subscription|plan|billing)/i.test(text)) {
    return "pricing";
  }

  if (/(navbar|navigation|header)/i.test(text)) {
    return "navbar";
  }

  if (/(login|signup|sign up|form|checkout)/i.test(text)) {
    return "form";
  }

  return "generic";
}

export function inferCssMode(description = "") {
  const text = String(description || "");
  const wantsClassesOnly = CLASSES_ONLY_PATTERN.test(text);
  const wantsComponentMarkup = COMPONENT_REQUEST_PATTERN.test(text);

  if (wantsComponentMarkup && !wantsClassesOnly) {
    return "html";
  }

  if (/tailwind/i.test(text) || wantsClassesOnly) {
    return "tailwind";
  }

  return "css";
}

function buildCssPrompt({ description, mode, constraints }) {
  return [
    "You are a focused UI and CSS snippet generator.",
    `Requested mode: ${mode}`,
    `Design request: ${description}`,
    constraints ? `Constraints: ${constraints}` : "Constraints: none",
    mode === "html"
      ? [
          "Return only the copy-pasteable component markup, not a full HTML document and not markdown fences.",
          "Use semantic HTML plus inline Tailwind utility classes for all styling.",
          "Make it look like a real component the user could paste into a project right away.",
          "Use meaningful sample content that matches the request. Never use placeholder text like 'Preview Element', 'Component Built', or lorem ipsum.",
          "If the request is for a pricing card, include a plan name, price, billing cadence, feature list, and CTA button.",
        ].join(" ")
      : mode === "tailwind"
        ? "Return Tailwind utility classes only in the code field."
        : "Return vanilla CSS only in the code field.",
    "Do not return markdown fences, or wrap the JSON in the code field.",
  ].join("\n");
}

export function formatCssSnippetOutput({ mode, code, explanation }) {
  return JSON.stringify({
    mode,
    code: String(code || "").trim(),
    explanation: String(explanation || "").trim(),
  });
}

function fallbackSnippet({ description, mode }) {
  if (mode === "html") {
    const componentKind = inferComponentKind(description);

    if (componentKind === "pricing") {
      return {
        mode,
        code: `<section class="mx-auto w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)]">
  <div class="mb-6 flex items-center justify-between">
    <div>
      <p class="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Pro</p>
      <h2 class="mt-2 text-2xl font-bold text-slate-900">Creator Studio</h2>
    </div>
    <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Most Popular</span>
  </div>

  <div class="mb-6">
    <div class="flex items-end gap-2">
      <span class="text-5xl font-black tracking-tight text-slate-900">$24</span>
      <span class="pb-2 text-sm text-slate-500">per month</span>
    </div>
    <p class="mt-3 text-sm leading-6 text-slate-600">Built for small teams shipping polished client work every week.</p>
  </div>

  <ul class="space-y-3 text-sm text-slate-700">
    <li class="flex items-start gap-3"><span class="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500"></span><span>Unlimited project boards and client share links</span></li>
    <li class="flex items-start gap-3"><span class="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500"></span><span>AI design critiques and component suggestions</span></li>
    <li class="flex items-start gap-3"><span class="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500"></span><span>Priority support with 24-hour response time</span></li>
  </ul>

  <button class="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
    Start 14-day trial
  </button>
  <p class="mt-3 text-center text-xs text-slate-500">Cancel anytime. No credit card required.</p>
</section>`,
        explanation: `HTML pricing card fallback for: ${description}`,
      };
    }

    if (componentKind === "navbar") {
      return {
        mode,
        code: `<header class="mx-auto flex w-full max-w-5xl items-center justify-between rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.35)]">
  <a href="#" class="text-lg font-black tracking-tight text-slate-900">Northstar</a>
  <nav class="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
    <a href="#" class="transition hover:text-slate-900">Product</a>
    <a href="#" class="transition hover:text-slate-900">Pricing</a>
    <a href="#" class="transition hover:text-slate-900">Resources</a>
  </nav>
  <a href="#" class="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">Book demo</a>
</header>`,
        explanation: `HTML navbar fallback for: ${description}`,
      };
    }

    return {
      mode,
      code: `<article class="mx-auto grid w-full max-w-md gap-4 rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.32)]">
  <div class="flex items-center justify-between">
    <p class="text-sm font-semibold uppercase tracking-[0.22em] text-sky-600">Featured</p>
    <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">New</span>
  </div>
  <div>
    <h2 class="text-2xl font-bold tracking-tight text-slate-900">Launch-ready component</h2>
    <p class="mt-2 text-sm leading-6 text-slate-600">A polished HTML + Tailwind block with real content, spacing, and hierarchy.</p>
  </div>
  <div class="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
    <div class="flex items-center justify-between"><span>Setup time</span><strong class="text-slate-900">5 minutes</strong></div>
    <div class="flex items-center justify-between"><span>Accessibility</span><strong class="text-slate-900">AA-minded</strong></div>
  </div>
  <button class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">Use this component</button>
</article>`,
      explanation: `HTML fallback snippet for: ${description}`,
    };
  }

  if (mode === "tailwind") {
    return {
      mode,
      code: "rounded-xl bg-red-500 px-4 py-2 text-white shadow-md transition-shadow hover:shadow-lg",
      explanation: `Tailwind fallback snippet for: ${description}`,
    };
  }

  return {
    mode,
    code: `.cta-button {\n  border: none;\n  border-radius: 0.75rem;\n  background: #ef4444;\n  color: #ffffff;\n  padding: 0.75rem 1.25rem;\n  box-shadow: 0 10px 24px rgba(239, 68, 68, 0.28);\n  transition: box-shadow 160ms ease, transform 160ms ease;\n}\n\n.cta-button:hover {\n  box-shadow: 0 14px 28px rgba(239, 68, 68, 0.32);\n  transform: translateY(-1px);\n}`,
    explanation: `Vanilla CSS fallback snippet for: ${description}`,
  };
}

function normalizeGeneratedSnippet(generated, requestedMode) {
  const parsed = cssOutputSchema.parse({
    mode: generated.mode || requestedMode,
    code: generated.code,
    explanation: generated.explanation,
  });

  if (/```/.test(parsed.code) && !parsed.code.includes("<html") && parsed.mode !== "html") {
    throw new Error("Snippet code cannot contain markdown fences.");
  }
  if (parsed.mode === "tailwind" && /</.test(parsed.code)) {
    throw new Error("Tailwind snippets must be utility classes, not HTML.");
  }
  if (parsed.mode === "css" && /<\/?[a-z]/i.test(parsed.code)) {
    throw new Error("CSS snippets must contain CSS, not HTML.");
  }

  return {
    mode: requestedMode,
    code: parsed.code.replace(/```(html|css|tailwind)?/gi, "").trim(),
    explanation: parsed.explanation.trim(),
  };
}

async function generateWithModel({ prompt, mode }) {
  const model = new ChatOpenAI({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.2,
  }).withStructuredOutput(cssOutputSchema);

  return model.invoke(prompt);
}

function toArtifact(snippet) {
  return {
    type: "css_snippet",
    mode: snippet.mode,
    code: snippet.code,
    explanation: snippet.explanation,
  };
}

export async function executeCssSnippetTool({ input, sessionId = "unknown", llmGenerate }) {
  const startedAt = Date.now();
  logger.info("tool_invocation", { tool: "css_snippet", input, sessionId });

  try {
    const normalized = cssSnippetSchema.parse(
      typeof input === "string"
        ? {
          description: input,
          mode: inferCssMode(input),
          constraints: "",
        }
        : input
    );
    const prompt = buildCssPrompt(normalized);

    let generated;
    if (llmGenerate) {
      generated = await llmGenerate({ prompt, mode: normalized.mode, constraints: normalized.constraints });
    } else if (!canUseLiveOpenAI()) {
      generated = fallbackSnippet({ description: normalized.description, mode: normalized.mode });
    } else {
      generated = await generateWithModel({ prompt, mode: normalized.mode });
    }

    const snippet = normalizeGeneratedSnippet(generated, normalized.mode);
    const artifact = {
      ...toArtifact(snippet),
      request: normalized.description,
    };
    const output = formatCssSnippetOutput(snippet);

    logger.info("tool_result", {
      tool: "css_snippet",
      input: normalized,
      output,
      durationMs: Date.now() - startedAt,
      sessionId,
    });

    return { tool: "css_snippet", input: normalized, output, artifact };
  } catch (error) {
    logger.error("tool_error", {
      tool: "css_snippet",
      input,
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startedAt,
      sessionId,
    });
    return {
      tool: "css_snippet",
      input,
      output: formatCssSnippetOutput({
        mode: input?.mode || "css",
        code: "",
        explanation: "CSS snippet generation failed.",
      }),
      artifact: null,
    };
  }
}

export function createCssSnippetLangChainTool({ sessionId = "unknown" } = {}) {
  return new DynamicStructuredTool({
    name: "css_snippet",
    description:
      "Use this tool to generate UI components, CSS styles, or Tailwind classes based on the user's design request. IMPORTANT: Use mode='html' for copy-pasteable components, cards, pricing blocks, layouts, and other full UI elements unless the user explicitly asks for classes only.",
    schema: cssSnippetSchema,
    func: async (input) => {
      const result = await executeCssSnippetTool({ input, sessionId });
      return result.output;
    },
  });
}
