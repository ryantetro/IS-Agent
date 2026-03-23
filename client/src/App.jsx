import ChatWindow from "./components/ChatWindow.jsx";
import { useChat } from "./hooks/useChat.js";
import "./App.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <input className="sidebar__search" placeholder="Search Chats" />
      <button className="sidebar__new" type="button">
        + New Chat
      </button>
      <nav>
        <button type="button">Library</button>
        <button type="button">Projects</button>
        <button type="button">Saved</button>
      </nav>
    </aside>
  );
}

export default function App() {
  const { messages, isLoading, error, sendMessage } = useChat();

  return (
    <div className="app-shell">
      <div className="app-card">
        <Sidebar />
        <ChatWindow messages={messages} isLoading={isLoading} error={error} onSend={sendMessage} />
      </div>
    </div>
  );
}
