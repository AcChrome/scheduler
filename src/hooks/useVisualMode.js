import { useState } from "react";

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

  const transition = function (newMode, replace = false) {
    setHistory((prev) => {
      const newHistory = [...prev];
      if (replace) {
        newHistory.pop();
      }
      newHistory.push(newMode);
      return newHistory;
    });
  };

  const back = function () {
    if (history.length === 1) {
      return;
    }
    setHistory((prev) => {
      return prev.slice(0, prev.length - 1);
    });
  };

  const mode = history[history.length - 1];

  return { mode, transition, back };
}
