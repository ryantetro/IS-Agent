import { useEffect, useState } from "react";

const STORAGE_KEY = "designmind_display_name";

export function loadDisplayName() {
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function saveDisplayName(name) {
  try {
    const trimmed = name.trim();
    if (trimmed) {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* ignore */
  }
}

export default function AccountModal({
  open,
  onClose,
  displayName,
  onSaveName,
  sessionId,
  onNewChat,
}) {
  const [nameDraft, setNameDraft] = useState(displayName);

  useEffect(() => {
    if (open) setNameDraft(displayName);
  }, [open, displayName]);

  if (!open) return null;

  function handleSave() {
    onSaveName(nameDraft.trim());
    onClose();
  }

  function handleNewChat() {
    onNewChat();
    onClose();
  }

  async function copySession() {
    try {
      await navigator.clipboard.writeText(sessionId);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="okara-modal-root" role="dialog" aria-modal="true" aria-labelledby="account-modal-title">
      <button type="button" className="okara-modal-backdrop" aria-label="Close" onClick={onClose} />
      <div className="okara-modal">
        <h2 id="account-modal-title" className="okara-modal__title">
          Account
        </h2>
        <p className="okara-modal__hint">Runs against your local server — no cloud auth yet.</p>

        <label className="okara-modal__label" htmlFor="display-name">
          Display name
        </label>
        <input
          id="display-name"
          className="okara-modal__input"
          value={nameDraft}
          onChange={(e) => setNameDraft(e.target.value)}
          placeholder="What should we call you?"
          autoComplete="nickname"
        />

        <div className="okara-modal__session">
          <span className="okara-modal__label">Session ID</span>
          <code className="okara-modal__code" title={sessionId}>
            {sessionId}
          </code>
          <button type="button" className="okara-modal__linkish" onClick={copySession}>
            Copy
          </button>
        </div>

        <div className="okara-modal__actions">
          <button type="button" className="okara-btn okara-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="okara-btn okara-btn--solid" onClick={handleSave}>
            Save
          </button>
        </div>
        <button type="button" className="okara-modal__newchat" onClick={handleNewChat}>
          Start fresh chat
        </button>
      </div>
    </div>
  );
}
