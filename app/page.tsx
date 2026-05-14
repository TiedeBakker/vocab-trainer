"use client";

import { useState, useEffect } from "react";
import { words } from "./data/words";

type Word = {
  nl: string;
  en: string;
};

function getRandomWord() {
  const index = Math.floor(Math.random() * words.length);
  return words[index];
}

export default function Home() {
  const [word, setWord] = useState<Word | null>(null);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setWord(getRandomWord());
  }, []);

  function checkAnswer() {
    if (!word) return;

    if (input.toLowerCase() === word.en.toLowerCase()) {
      setFeedback("Goed!");
    } else {
      setFeedback(`Fout. Het juiste antwoord is: ${word.en}`);
    }

    setInput("");
    setWord(getRandomWord());
  }

  if (!word) return <p>Laden...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Vertaal dit woord:</h1>
      <h2>{word.nl}</h2>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={checkAnswer}>
        Check
      </button>

      <p>{feedback}</p>
    </div>
  );
}