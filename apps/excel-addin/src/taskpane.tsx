import React from "react";
import { createRoot } from "react-dom/client";
import { TaskPane } from "./components/TaskPane";

Office.onReady(() => {
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <TaskPane />
    </React.StrictMode>
  );
});
