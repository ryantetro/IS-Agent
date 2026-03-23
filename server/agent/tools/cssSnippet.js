export function cssSnippetTool(prompt) {
  return {
    tool: "css_snippet",
    input: prompt,
    output: {
      code: "",
      explanation: "not_implemented",
    },
  };
}
