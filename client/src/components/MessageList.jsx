import CodeBlock from "./CodeBlock.jsx";
import ColorSwatchRenderer from "./ColorSwatchRenderer.jsx";
import SourceBadge from "./SourceBadge.jsx";
import ToolIndicator from "./ToolIndicator.jsx";

function MessageItem({ message }) {
  return (
    <article className={`message message--${message.role}`}>
      <div className="message__bubble">
        {message.text ? <p>{message.text}</p> : null}
        {message.codeSnippet ? <CodeBlock snippet={message.codeSnippet} /> : null}
        {message.palette ? <ColorSwatchRenderer palette={message.palette} /> : null}
      </div>
      <ToolIndicator tools={message.toolsUsed} />
      {message.sources?.length ? (
        <div className="sources">
          {message.sources.map((source) => (
            <SourceBadge key={source} source={source} />
          ))}
        </div>
      ) : null}
    </article>
  );
}

export default function MessageList({ messages }) {
  return (
    <section className="message-list">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </section>
  );
}
