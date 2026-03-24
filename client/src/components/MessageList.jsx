import CodeBlock from "./CodeBlock.jsx";
import ColorSwatchRenderer from "./ColorSwatchRenderer.jsx";
import MessageContent from "./MessageContent.jsx";
import SourceBadge from "./SourceBadge.jsx";
import ToolIndicator from "./ToolIndicator.jsx";

function MessageItem({ message }) {
  const isPending =
    message.role === "assistant" &&
    !message.codeSnippet &&
    !message.palette &&
    (/^Thinking\.\.\.$/.test(message.text || "") || /^Using /i.test(message.text || ""));

  return (
    <div className={`message message-${message.role}`}>
      {message.role === "assistant" && (
        <div className="avatar">
          {isPending ? (
            <span className="cursor-blink" style={{ width: 8, height: 8, background: '#fff' }}></span>
          ) : (
            "D"
          )}
        </div>
      )}

      <div className="message-bubble">
        {isPending ? (
          <div className="thinking-container">
            <span className="cursor-blink"></span>
            <span>{message.text || "Thinking..."}</span>
          </div>
        ) : (
          <>
            {message.text && <MessageContent text={message.text} />}
            {message.codeSnippet && <CodeBlock snippet={message.codeSnippet} />}
            {message.palette && <ColorSwatchRenderer palette={message.palette} />}
          </>
        )}

        <ToolIndicator tools={message.toolsUsed} />

        {message.sources?.length ? (
          <div className="sources" style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {message.sources.map((source) => (
              <SourceBadge key={`${source.title}-${source.path || source.url || ""}`} source={source} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function MessageList({ messages, scrollAnchorRef }) {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      {scrollAnchorRef && <div ref={scrollAnchorRef} style={{ height: 1 }} aria-hidden />}
    </div>
  );
}
