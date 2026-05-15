"use client";

import { useState, useEffect } from "react";
import { words } from "./data/words";

type Word = {
  nl: string;
  en: string;
};
function getRandomWord(exclude?: string) {
  const filtered = words.filter(
    (w) => w.nl !== exclude
  );

  const index = Math.floor(
    Math.random() * filtered.length
  );

  return filtered[index];
}
export default function Home() {
  const [word, setWord] = useState<Word | null>(null);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [correctCount, setCorrectCount] = useState(0);


  useEffect(() => {
    setWord(getRandomWord());
  }, []);

  function checkAnswer() {
    if (!word) return;

    if (input.toLowerCase() === word.en.toLowerCase()) {
      setFeedback("Goed!");
      setCorrectCount((prev) => prev + 1);
    } else {
      setFeedback(`Fout. Het juiste antwoord is: ${word.en}`);
    }

    setInput("");
    setWord(getRandomWord(word.nl));
  }

  if (!word) return <p>Laden...</p>;

  return (
    <div style={{ padding: 20 }}>
      <p>Goed beantwoord: {correctCount}</p>
      <h1>Vertaal dit woord:</h1>
      <h2>{word.nl}</h2>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            checkAnswer();
          }
        }}
        autoFocus
        placeholder="Typ Engelse vertaling"
        style={{
          padding: "12px",
          fontSize: "18px",
          width: "100%",
          maxWidth: "300px",
          marginTop: "12px",
        }}
      />
      <button
        onClick={checkAnswer}
        style={{
          padding: "12px 20px",
          fontSize: "18px",
          marginTop: "12px",
          cursor: "pointer",
        }}
      >
        Check
      </button>

      <p>{feedback}</p>
    </div>
  );
}