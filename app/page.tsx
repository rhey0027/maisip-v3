"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { listWords, ListWords } from "./def/listWords";
import Link from "next/link";

export default function HangmanGame() {
  // 1. ALL HOOKS MUST BE AT THE VERY TOP
  const [game] = useState<ListWords>(
    () => listWords[Math.floor(Math.random() * listWords.length)],
  );
  const [guessed, setGuessed] = useState<string[]>([]);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [isAnimating, setIsAnimating] = useState(false);

  // 3. SAFE CALCULATIONS
  // We use fallbacks so 'word' is never undefined
  const word = game.word.toUpperCase();
  const mistakes = guessed.filter((l) => !word.includes(l)).length;

  // 4. WIN/LOSS MONITOR - FIXED
  useEffect(() => {
    if (!word) return;

    const isWon = word.split("").every((l) => guessed.includes(l));

    // Only update status if it's different from current and game is still playing
    if (isWon) {
      setStatus("won");
    } else if (mistakes >= 6) {
      setStatus("lost");
    }
  }, [guessed, word, mistakes, status]); // REMOVED 'status' from dependencies

  // 5. INPUT HANDLER
  const handleGuess = (letter: string) => {
    if (status !== "playing" || guessed.includes(letter)) return;

    setGuessed((prev) => [...prev, letter]);

    if (!word.includes(letter)) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex flex-col items-center justify-center p-4 font-sans">
      {/* Visual Header */}
      <div
        className={`flex flex-col items-center mb-6 ${isAnimating ? "animate-shake" : ""}`}
      >
        <div className="relative w-48 h-48 mb-4">
          <Image
            src={`/hangman-${mistakes}.svg`}
            alt="Hangman"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-wider">
          MAISIP
        </h1>
        <p className="text-gray-900 tracking-wider text-md">
          let&quot;s try this game if you still got it!
        </p>
        <p className="text-[10px] text-slate-400">
          ver.2.0 | RYU fullstack dev
        </p>
      </div>

      <div className="w-full max-w-xl bg-[#DDEBFA] rounded-2rem p-8 shadow-inner border-t-2 border-white/50">
        {/* Word Display (UL/LI) */}
        <ul className="flex flex-wrap justify-center gap-2 mb-8">
          {word.split("").map((char, i) => {
            const isRevealed = guessed.includes(char);
            return (
              <li
                key={i}
                className={`w-12 h-14 sm:w-12 sm:h-14 rounded-md flex items-center justify-center text-3xl font-black transition-all duration-300
                  ${
                    isRevealed
                      ? "bg-transparent text-[#FF782C]"
                      : "bg-[#FF782C] text-transparent shadow-md"
                  }`}
              >
                {isRevealed ? char : ""}
              </li>
            );
          })}
        </ul>
        {/* Hint */}
        <p className="text-center text-[#1E40AF] font-bold mb-6 italic px-4">
          Word Hint:{" "}
          <span className="font-medium text-slate-600">{game.hint}</span>
        </p>
        {/* Lives Counter: Starts at 0 */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-200/50 px-6 py-2 rounded-full flex items-center gap-3">
            <span className="font-bold text-slate-700 text-xs">
              Player Lives:
            </span>
            <span className="bg-red-600 text-white px-3 py-1 rounded-md font-black shadow-sm">
              {mistakes} / 6
            </span>
          </div>
        </div>

        {/* Keyboard */}
        <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5">
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => (
            <button
              key={l}
              disabled={guessed.includes(l) || status !== "playing"}
              onClick={() => handleGuess(l)}
              className={`h-10 rounded-md font-semibold transition-all text-sm cursor-pointer
                ${
                  guessed.includes(l)
                    ? "bg-slate-300 text-red-300 cursor-not-allowed scale-95"
                    : "bg-[#1E293B] text-white hover:bg-slate-700 shadow-md"
                }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Result Modal */}
      {status !== "playing" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] p-10 text-center shadow-2xl max-w-xs w-full">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <Image
                src={status === "won" ? "/victory.gif" : "/lost.gif"}
                alt="Result"
                fill
                className="object-contain"
              />
            </div>
            <h2
              className={`text-2xl font-black mb-2 ${status === "won" ? "text-emerald-600" : "text-red-600"}`}
            >
              {status === "won" ? "CHAMBARUL!" : "BRAINLESS:-)"}
            </h2>
            <p className="text-slate-500 mb-6 text-sm">
              The word was{" "}
              <span className="block text-xl font-black text-slate-800 tracking-wider">
                {word}
              </span>
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[#FF782C] text-white font-black py-4 rounded-2xl shadow-md cursor-pointer tracking-wide"
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}
      <Link
        href="https://hiddenbrooke.vercel.app"
        className="text-blue-300 font-light cursor-pointer underline hover:text-blue-500 transition-all duration-150 ease-in-out"
      >
        back to hiddenbrooke resort
      </Link>
    </div>
  );
}
