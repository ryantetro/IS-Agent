import { useCallback, useEffect, useRef, useState } from "react";
import AccountModal, { loadDisplayName, saveDisplayName } from "./components/AccountModal.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import { useChat } from "./hooks/useChat.js";
import "./App.css";

function App() {
  const composerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [displayName, setDisplayName] = useState(() => loadDisplayName());

  const {
    sessionId,
    messages,
    isLoading,
    error,
    sendMessage,
    startNewChat,
    model,
    setModel,
    toolsEnabled,
    setToolsEnabled,
  } = useChat();

  const onSaveName = useCallback((name) => {
    saveDisplayName(name);
    setDisplayName(name);
  }, []);

  useEffect(() => {
    if (!messages.length) return;
    messagesEndRef.current?.scrollIntoView({
      behavior: isLoading ? "auto" : "smooth",
      block: "end",
    });
  }, [messages, isLoading]);

  return (
    <div className="app-container">
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <span style={{ fontWeight: 600 }}>DesignMind</span>
            <span style={{ marginLeft: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
              v0.1 · {model}
            </span>
          </div>
          <div className="topbar-right" style={{ display: 'flex', gap: '8px' }}>
            <button className="topbar-btn" onClick={() => startNewChat()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6, verticalAlign: 'text-bottom' }}>
                <path d="M12 5v14M5 12h14" />
              </svg>
              New Chat
            </button>
            <button className="topbar-btn" onClick={() => setAccountOpen(true)}>
              Settings
            </button>
          </div>
        </header>

        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          error={error}
          onSend={sendMessage}
          displayName={displayName}
          composerRef={composerRef}
          messagesEndRef={messagesEndRef}
          sessionId={sessionId}
          model={model}
          setModel={setModel}
          toolsEnabled={toolsEnabled}
          setToolsEnabled={setToolsEnabled}
        />
      </div>

      <AccountModal
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        displayName={displayName}
        onSaveName={onSaveName}
        sessionId={sessionId}
        onNewChat={startNewChat}
      />
    </div>
  );
}

export default App;
