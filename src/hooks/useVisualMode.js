import { useState } from "react";

export default function useVisualMode(initial) {
  // const [mode, setMode] = useState(initial);
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
      // const newHistory = [...prev];
      // newHistory.pop();
      // return newHistory;
    });
  };

  const mode = history[history.length - 1];

  return { mode, transition, back };
}

// export default function useVisualMode(initial) {
//   const [mode, setMode] = useState(initial);
//   const [history, setHistory] = useState([initial]);

//   const transition = function (newMode, replace = false) {
//     if (replace) {
//       const newMode = [...history];
//       newModes.pop();
//       newModes.push(newMode);
//       setHistory(newMode);
//       setMode(newMode);
//     } else {
//       const newModes = [...history];
//       newModes.push(newMode);
//       setHistory(newModes);
//       setMode(newMode);
//     }
//   }
//   const back = function () {
//     if (history.length === 1) {
//       setMode(history[0]);
//     } else {
//       const newModes = [...history];
//       newModes.pop();
//       setHistory(newModes);
//       setMode(newModes[newModes.length - 1]);
//     }
//   }

//   return { mode, transition, back };
// };
