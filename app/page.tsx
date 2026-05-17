"use client";

import { useEffect, useState } from "react";
import { words } from "./data/words";
import {
  initTraining,
  isCorrect,
  updateTrainingWords,
  getRandomWord,
  TrainingWord,
} from "./engine/training";

const STORAGE_KEY = "vocab-trainer-state";

type SavedState = {
  activeWords: TrainingWord[];
  mode: "nl-en" | "en-nl";
  correctAnswers: number;
  wrongAnswers: number;
};
const buttonStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #ccc",
  backgroundColor: "#f5f5f5",
  cursor: "pointer",
  fontSize: 14,
  transition: "all 0.2s ease",
};
const activeButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: "#4caf50",
  color: "white",
  border: "1px solid #4caf50",
};
function getQuestion(
  word: TrainingWord,
  mode: "nl-en" | "en-nl"
) {
  return mode === "nl-en"
    ? word.nl
    : word.en;
}

function getAnswer(
  word: TrainingWord,
  mode: "nl-en" | "en-nl"
) {
  return mode === "nl-en"
    ? word.en
    : word.nl;
}

function getModeLabel(
  mode: "nl-en" | "en-nl"
) {
  return mode === "nl-en"
    ? "NL → EN"
    : "EN → NL";
}

export default function Home() {
  const [activeWords, setActiveWords] =
    useState<TrainingWord[]>([]);

  const [word, setWord] =
    useState<TrainingWord | null>(null);

  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");

  const [mode, setMode] = useState<"nl-en" | "en-nl">(
    "nl-en"
  );
  const totalWords = words.length;
  const completedWords =
    totalWords - activeWords.length;
  const progressPercentage =
    Math.round(
      (completedWords / totalWords) * 100
    );
  const [correctAnswers, setCorrectAnswers] =
    useState(0);

  const [wrongAnswers, setWrongAnswers] =
    useState(0);

  const totalAnswers =
    correctAnswers + wrongAnswers;

  const correctPercentage =
    totalAnswers === 0
      ? 0
      : Math.round(
        (correctAnswers / totalAnswers) * 100
      );

  const [selectedSet, setSelectedSet] =
    useState<number | "all">("all");

  const filteredWords =
    selectedSet === "all"
      ? words
      : words.filter((w) => w.set === selectedSet);
  // init sessie
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed: SavedState = JSON.parse(saved);

      setActiveWords(parsed.activeWords);
      setMode(parsed.mode);
      setCorrectAnswers(
        Number(parsed.correctAnswers ?? 0)
      );
      setWrongAnswers(
        Number(parsed.wrongAnswers ?? 0)
      );

      if (parsed.activeWords.length > 0) {
        setWord(getRandomWord(parsed.activeWords));
      }

      return;
    }

    const initial = initTraining(filteredWords);

    setActiveWords(initial);
    setWord(getRandomWord(initial));
  }, []);

  useEffect(() => {
    if (activeWords.length === 0 && correctAnswers === 0 && wrongAnswers === 0)
      return;

    const data: SavedState = {
      activeWords,
      mode,
      correctAnswers: Number(correctAnswers ?? 0),
      wrongAnswers: Number(wrongAnswers ?? 0),
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );
  }, [
    activeWords,
    mode,
    correctAnswers,
    wrongAnswers,
  ]);

  useEffect(() => {
    const initial = initTraining(filteredWords);

    setActiveWords(initial);
    setWord(getRandomWord(initial));

    setCorrectAnswers(0);
    setWrongAnswers(0);
  }, [selectedSet]);

  function checkAnswer() {
    if (!word) return;

    const expectedAnswer = getAnswer(word, mode);

    const correct =
      expectedAnswer.toLowerCase() ===
      input.toLowerCase();

    const updated = updateTrainingWords(
      activeWords,
      word,
      correct
    );

    setActiveWords(updated);

    if (correct) {
      setFeedback("Goed!");
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setFeedback(
        `Fout. Vertaling van ${getQuestion(word, mode)} is: ${expectedAnswer}`
      );
      setWrongAnswers((prev) => prev + 1);
    }

    setInput("");

    if (updated.length === 0) {
      setWord(null);
      return;
    }

    setWord(getRandomWord(updated));
  }

  if (!word) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Klaar 🎉</h1>
        <p>Alle woorden beheerst.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={() => setMode("nl-en")}
          style={
            mode === "nl-en"
              ? activeButtonStyle
              : buttonStyle
          }
        >
          NL → EN
        </button>

        <button
          onClick={() => setMode("en-nl")}
          style={
            mode === "en-nl"
              ? activeButtonStyle
              : buttonStyle
          }
        >
          EN → NL
        </button>
      </div>
      <div style={{ marginBottom: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={() => setSelectedSet(1)}
          style={selectedSet === 1 ? activeButtonStyle : buttonStyle}
        >
          Woorden 1
        </button>

        <button
          onClick={() => setSelectedSet(2)}
          style={selectedSet === 2 ? activeButtonStyle : buttonStyle}
        >
          Woorden 2
        </button>

        <button
          onClick={() => setSelectedSet(3)}
          style={selectedSet === 3 ? activeButtonStyle : buttonStyle}
        >
          Woorden 3
        </button>

        <button
          onClick={() => setSelectedSet(4)}
          style={selectedSet === 3 ? activeButtonStyle : buttonStyle}
        >
          Zinnen 1
        </button>

        <button
          onClick={() => setSelectedSet(5)}
          style={selectedSet === 3 ? activeButtonStyle : buttonStyle}
        >
          Zinnen 2
        </button>

        <button
          onClick={() => setSelectedSet(6)}
          style={selectedSet === 3 ? activeButtonStyle : buttonStyle}
        >
          Zinnen 3
        </button>

        <button
          onClick={() => setSelectedSet(7)}
          style={selectedSet === 3 ? activeButtonStyle : buttonStyle}
        >
          Maanden
        </button>

        <button
          onClick={() => setSelectedSet("all")}
          style={selectedSet === "all" ? activeButtonStyle : buttonStyle}
        >
          Alles
        </button>
      </div>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 10,
        }}
      >
        Vertaal:
      </h1>

      <h2
        style={{
          fontSize: 24,
          fontWeight: 600,
          marginBottom: 20,
          color: "#190cab",
        }}
      >
        {getQuestion(word, mode)}
      </h2>

      <input
        value={input}
        onChange={(e) =>
          setInput(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            checkAnswer();
          }
        }}
        autoFocus
        placeholder="Typ vertaling"
        style={{
          padding: 12,
          fontSize: 18,
          width: "100%",
          maxWidth: 300,
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={checkAnswer}
        style={{
          marginTop: 10,
          padding: 10,
        }}
      >
        Check
      </button>

      <h2
        style={{
          fontSize: 24,
          fontWeight: 600,
          marginBottom: 10,
          marginTop: 10,
          color: "#190cab",
        }}>{feedback}</h2>

      <p>
        Over: {activeWords.length} woorden
      </p>
      <div
        style={{
          marginBottom: 20,
          padding: 12,
          border: "1px solid #ccc",
          borderRadius: 8,
        }}
      >
        {/* <p>
          Modus: {getModeLabel(mode)}
        </p>

        <p>
          Totaal: {totalWords}
        </p>

        <p>
          Voltooid: {completedWords}
        </p> */}
        <div
        // style={{
        //   marginTop: 12,
        // }}
        >
          {/* <div
            style={{
              width: "100%",
              maxWidth: 300,
              height: 20,
              backgroundColor: "#ddd",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progressPercentage}%`,
                height: "100%",
                backgroundColor: "#4caf50",
                transition: "width 0.3s",
              }}
            />
          </div>

          <p>{progressPercentage}% voltooid</p> */}
          <p>
            Goed: {correctAnswers}
          </p>

          <p>
            Fout: {wrongAnswers}
          </p>

          {/* <p>
            Score: {correctPercentage}%
          </p> */}
        </div>
        <p>
          Nog actief: {activeWords.length}
        </p>

        <p>
          Huidig woord:
          {" "}
          {word.correct} / {word.required}
        </p>
      </div>
      <button
        onClick={() => {
          localStorage.removeItem(STORAGE_KEY);

          setCorrectAnswers(0);
          setWrongAnswers(0);

          const initial = initTraining(words);
          setActiveWords(initial);
          setWord(getRandomWord(initial));
        }}
      >
        Nieuwe sessie
      </button>
    </div>
  );
}