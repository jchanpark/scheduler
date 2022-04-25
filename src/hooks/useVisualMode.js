import { React, useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  console.log('history', history);
  
  function transition(newMode, replaceLastHistoryItemInstedOfAddingNewHistoryItem = false) {

      setMode(newMode);
    if(replaceLastHistoryItemInstedOfAddingNewHistoryItem) {
      history[history.length-1] = newMode
      setHistory([...history]);
    } else {
      setHistory([...history, newMode]);
    }
  }

  function back() {
    if(history.length > 1) {
      history.pop();
      setHistory([...history]);
      setMode(history[history.length - 1]);
    }
  }

  return { mode, transition, back, history };
}