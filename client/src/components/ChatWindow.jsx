import MessageInput from "./MessageInput.jsx";
import MessageList from "./MessageList.jsx";

export default function ChatWindow({
  messages,
  isLoading,
  error,
  onSend,
  displayName,
  composerRef,
  messagesEndRef,
  sessionId,
  model,
  setModel,
  toolsEnabled,
  setToolsEnabled,
}) {
  const isEmpty = messages.length === 0;

  return (
    <main className="chat-window">
      <div className="chat-center">
        {isEmpty ? (
          <div className="welcome-screen">
            <h2 className="welcome-title">
              {displayName ? `What can I help with, ${displayName}?` : "What can I help with?"}
            </h2>
          </div>
        ) : (
          <div className="message-list-wrap">
            <MessageList messages={messages} scrollAnchorRef={messagesEndRef} />
          </div>
        )}

        {error ? <p className="error-message" style={{ color: 'red', marginTop: '16px', textAlign: 'center' }}>{error}</p> : null}
      </div>

      <div className="composer-wrapper">
        <MessageInput
          ref={composerRef}
          onSend={onSend}
          isLoading={isLoading}
          model={model}
          onModelChange={setModel}
          toolsEnabled={toolsEnabled}
          onToolsToggle={setToolsEnabled}
        />
        <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
          DesignMind can make mistakes. Please verify important information.
        </div>
      </div>
    </main>
  );
}
