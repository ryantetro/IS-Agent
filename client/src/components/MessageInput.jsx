import { useState } from "react";

export default function MessageInput({ onSend, isLoading }) {
  const [value, setValue] = useState("");

  async function submit(event) {
    event.preventDefault();
    if (!value.trim() || isLoading) return;
    const sending = value;
    setValue("");
    await onSend(sending);
  }

  return (
    <form className="composer" onSubmit={submit}>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ask me anything..."
        rows={3}
      />
      <div className="composer__actions">
        <button className="composer__ghost" type="button">
          Attach
        </button>
        <button className="composer__send" type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  );
}
