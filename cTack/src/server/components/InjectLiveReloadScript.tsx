import { ReactElement } from "react";

export default function InjectLiveReloadScript(
  component: () => ReactElement
): () => ReactElement {
  return () => (
    <>
      {component()}
      <script
        dangerouslySetInnerHTML={{
          __html: `
      (function () {
          const socket = new WebSocket("ws://localhost:3001");
          socket.onmessage = function (msg) {
            if (msg.data === "reload") {
              console.log("Reloading page...");
              window.location.reload();
            }
          };
          socket.onclose = function () {
            console.log("Live reload disconnected. Attempting to reconnect...");
            setTimeout(() => window.location.reload(), 1000);
          };
        })();
        `,
        }}
      ></script>
    </>
  );
}
