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
        })();
        `,
        }}
      ></script>
    </>
  );
}
