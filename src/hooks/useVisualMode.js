import { useState } from "react";

export function useVisualMode(initial) {
  // const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  
  
  const transition = function (newMode, replace = false) {
    setHistory((prev) => {
      if (replace) {
        // const newHistory = [...prev];
        // newHistory.pop();
        // newHistory.push(newMode);
        // return newHistory;
        prev.pop();
        return [...prev, newMode];
      } else {
        return [...prev, newMode];
        // const newHistory= [...prev];
        // newHistory.push(newMode)
        // return newHistory;
      }
    });
  };

  const back = function () {
    setHistory((prev) => {
      if (history.length === 1) {
       return prev;
      } else {
      return prev.slice(0, prev.length - 1);
      // const newHistory = [...prev];
      // newHistory.pop();
      // return newHistory;
      }
    });
  };

  const mode = history[history.length - 1];

  return { mode, transition, back };
}

// export default function useVisualMode(initial) {
//   const [mode, setMode] = useState(initial);
//   const [history, setHistory] = useState([initial]);
  
  
//   const transition = function (newMode, replace = false) {
//     setMode(newMode);
//     if (replace) {
//       setHistory((prev) => [...prev.slice(0,prev.length - 1), newMode])

//     } else {
//       setHistory((prev) => [...prev, newMode]);
//       // const newHistory= [...prev];
//       // newHistory.push(newMode)
//       // return newHistory;
//       }
//     };
    
//   const back = function () {
//     // setHistory((prev) => {
//       if (history.length > 1) {
//         setHistory((prev) => [...prev.slice(0, prev.length - 1)])
//         // const newHistory = [...prev];
//         // newHistory.pop();
//         // return newHistory;
//       }
//       // });
//       setMode(history[history.length - 1]);
//     };

//   return { mode, transition, back };
// }

