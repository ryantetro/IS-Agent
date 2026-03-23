export function streamMessage({ message, sessionId, onStart, onChunk, onComplete, onFail }) {
  return new Promise((resolve, reject) => {
    const url = `/api/stream?message=${encodeURIComponent(message)}&sessionId=${encodeURIComponent(sessionId)}`;
    const source = new EventSource(url);

    source.addEventListener("start", (event) => {
      if (onStart) onStart(JSON.parse(event.data));
    });

    source.addEventListener("chunk", (event) => {
      const payload = JSON.parse(event.data);
      if (onChunk) onChunk(payload.text || "");
    });

    source.addEventListener("complete", (event) => {
      const payload = JSON.parse(event.data);
      if (onComplete) onComplete(payload);
      source.close();
      resolve(payload);
    });

    source.addEventListener("fail", (event) => {
      const payload = JSON.parse(event.data);
      if (onFail) onFail(payload);
      source.close();
      reject(new Error(payload.message || "stream failed"));
    });

    source.onerror = () => {
      source.close();
      reject(new Error("stream connection error"));
    };
  });
}
