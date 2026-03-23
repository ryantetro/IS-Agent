import MessageInput from "./MessageInput.jsx";
import MessageList from "./MessageList.jsx";

export default function ChatWindow({ messages, isLoading, error, onSend }) {
  const isEmpty = messages.length === 0;

  return (
    <main className="chat-main">
      <header className="chat-main__header">
        <div className="brand-dot" />
        <h1>DesignMind</h1>
      </header>

      {isEmpty ? (
        <section className="hero">
          <h2>Hey there. How can I help your design work today?</h2>
          <p>Ask for guidelines, snippets, and practical UI suggestions.</p>
        </section>
      ) : (
        <MessageList messages={messages} />
      )}

      {error ? <p className="error-banner">{error}</p> : null}
      <MessageInput onSend={onSend} isLoading={isLoading} />
    </main>
  );
}
