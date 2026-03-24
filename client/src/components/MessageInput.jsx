import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

const TEXT_MIME = /^(text\/|application\/(json|javascript|xml)|image\/svg)/i;
const MAX_ATTACH_BYTES = 120_000;
const MIN_TEXTAREA_HEIGHT = 24;
const MAX_TEXTAREA_HEIGHT = 200;

export default forwardRef(function MessageInput(
  { onSend, isLoading, model, onModelChange, toolsEnabled, onToolsToggle },
  ref
) {
  const [value, setValue] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [attachError, setAttachError] = useState("");
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const resizeTextarea = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const nextHeight = Math.min(Math.max(textarea.scrollHeight, MIN_TEXTAREA_HEIGHT), MAX_TEXTAREA_HEIGHT);
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > MAX_TEXTAREA_HEIGHT ? "auto" : "hidden";
  }, []);

  const insertText = useCallback((text) => {
    setValue((prev) => (prev ? `${prev}\n\n${text}` : text));
    requestAnimationFrame(() => {
      resizeTextarea();
      textareaRef.current?.focus();
    });
  }, [resizeTextarea]);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => textareaRef.current?.focus(),
      insertText,
      openFilePicker: () => fileInputRef.current?.click(),
    }),
    [insertText]
  );

  useEffect(() => {
    resizeTextarea();
  }, [value, resizeTextarea]);

  async function submit(event) {
    if (event) event.preventDefault();
    if (!value.trim() && !attachment) return;
    if (isLoading) return;

    let sending = value.trim();
    if (attachment?.text) {
      sending = `[Attached: ${attachment.name}]\n${attachment.text}\n\n---\n\n${sending}`;
    }
    setValue("");
    setAttachment(null);
    setAttachError("");
    requestAnimationFrame(resizeTextarea);
    await onSend(sending);
  }

  function onTextareaKeyDown(event) {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }
    event.preventDefault();
    submit();
  }

  function onFileChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    setAttachError("");
    if (!file) return;

    if (file.size > MAX_ATTACH_BYTES) {
      setAttachError(`File too large (max ${Math.round(MAX_ATTACH_BYTES / 1024)} KB).`);
      return;
    }

    if (!TEXT_MIME.test(file.type) && !/\.(txt|md|json|csv|svg|css|jsx?|tsx?)$/i.test(file.name)) {
      setAttachError("Attach a text-based file (.txt, .md, .json, code, .svg).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setAttachment({ name: file.name, text });
      textareaRef.current?.focus();
    };
    reader.onerror = () => setAttachError("Could not read that file.");
    reader.readAsText(file);
  }

  return (
    <form className="composer" onSubmit={submit}>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        accept=".txt,.md,.json,.csv,.svg,.css,.js,.jsx,.ts,.tsx,text/*,application/json,image/svg+xml"
        onChange={onFileChange}
      />

      {attachment && (
        <div className="attachment-chip">
          <span>📎 {attachment.name}</span>
          <button type="button" onClick={() => setAttachment(null)}>×</button>
        </div>
      )}

      {attachError && <div style={{ position: 'absolute', top: -30, color: 'red', fontSize: 12 }}>{attachError}</div>}

      <button
        type="button"
        className="btn-icon"
        onClick={() => fileInputRef.current?.click()}
        title="Attach file"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
        </svg>
      </button>

      <textarea
        ref={textareaRef}
        className="composer-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onTextareaKeyDown}
        placeholder="Message DesignMind..."
        rows={1}
        disabled={isLoading}
      />

      <div className="composer-actions">
        {/* Model Tools Toggle */}
        <button
          type="button"
          className="btn-icon"
          style={{ color: toolsEnabled ? 'var(--accent-color)' : 'var(--text-secondary)' }}
          onClick={() => onToolsToggle(!toolsEnabled)}
          title={toolsEnabled ? "Tools: ON" : "Tools: OFF"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
          </svg>
        </button>

        <button
          type="submit"
          className="btn-send"
          disabled={isLoading || (!value.trim() && !attachment)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      </div>
    </form>
  );
});
