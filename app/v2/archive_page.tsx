"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { categories, lessons } from "../../data";

type Sentence = {
  en: string;
  jp: string;
};

type Lesson = {
  id: number;
  title: string;
  category: string;
  level: string;
  duration: string;
  sentences: Sentence[];
};

const categoryIcons: Record<string, string> = {
  Business: "💼",
  TOEIC: "🎧",
  Travel: "✈️",
  Sports: "🎾",
  "Hotel & Airport": "🏨",
  "Cafe & Restaurant": "☕",
  Shopping: "🛍️",
  "Weather / Small Talk": "🌤️",
  "Phone / Online Meeting": "📞",
  Hobbies: "📸",
  Work: "🧑‍💻",
  "School / Study": "📚",
  Directions: "🧭",
};

export default function Home() {
  const typedLessons = lessons as Lesson[];

  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0] ?? "Business"
  );
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [showEnglish, setShowEnglish] = useState(true);
  const [showJapanese, setShowJapanese] = useState(true);
  const [speed, setSpeed] = useState<0.75 | 1 | 1.25>(1);
  const [autoNext, setAutoNext] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakingRef = useRef(false);

  const filteredLessons = useMemo(() => {
    return typedLessons.filter((lesson) => lesson.category === selectedCategory);
  }, [typedLessons, selectedCategory]);

  const selectedLesson = useMemo(() => {
    return (
      typedLessons.find((lesson) => lesson.id === selectedLessonId) ??
      filteredLessons[0]
    );
  }, [typedLessons, filteredLessons, selectedLessonId]);

  const currentSentence = selectedLesson?.sentences[sentenceIndex];

  useEffect(() => {
    if (selectedLesson) {
      setSelectedLessonId(selectedLesson.id);
      setSentenceIndex(0);
    }
  }, [selectedCategory]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    speakingRef.current = false;
    setIsSpeaking(false);
  };

  const speakSentence = () => {
    if (!currentSentence) return;

    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(currentSentence.en);
    utterance.lang = "en-US";
    utterance.rate = speed;
    utterance.pitch = 1;

    speakingRef.current = true;
    setIsSpeaking(true);

    utterance.onend = () => {
      speakingRef.current = false;
      setIsSpeaking(false);

      if (autoNext && selectedLesson) {
        setTimeout(() => {
          setSentenceIndex((prev) =>
            prev < selectedLesson.sentences.length - 1 ? prev + 1 : prev
          );
        }, 500);
      }
    };

    utterance.onerror = () => {
      speakingRef.current = false;
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const nextSentence = () => {
    if (!selectedLesson) return;
    stopSpeech();
    setSentenceIndex((prev) =>
      prev < selectedLesson.sentences.length - 1 ? prev + 1 : 0
    );
  };

  const prevSentence = () => {
    if (!selectedLesson) return;
    stopSpeech();
    setSentenceIndex((prev) =>
      prev > 0 ? prev - 1 : selectedLesson.sentences.length - 1
    );
  };

  if (!selectedLesson || !currentSentence) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
        <p>レッスンデータが見つかりません。</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-md px-4 py-5">
        <header className="mb-5 rounded-3xl bg-gradient-to-br from-sky-500 to-blue-600 p-5 text-white shadow-lg">
          <p className="text-sm opacity-90">English Shadowing</p>
          <h1 className="mt-1 text-2xl font-bold">英会話シャドーイング</h1>
          <p className="mt-2 text-sm opacity-90">
            カテゴリを選んで、短い英文を聞いて真似しましょう。
          </p>
        </header>

        <section className="mb-5">
          <h2 className="mb-3 text-sm font-bold text-slate-700">カテゴリ</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => {
              const active = category === selectedCategory;
              const count = typedLessons.filter(
                (lesson) => lesson.category === category
              ).length;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-2xl border p-3 text-left shadow-sm transition ${
                    active
                      ? "border-sky-500 bg-sky-50 ring-2 ring-sky-200"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="text-2xl">{categoryIcons[category] ?? "📘"}</div>
                  <div className="mt-1 text-sm font-bold">{category}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    {count} lessons
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-5 rounded-3xl bg-white p-4 shadow-sm">
          <label className="mb-2 block text-sm font-bold text-slate-700">
            レッスン
          </label>
          <select
            value={selectedLesson.id}
            onChange={(e) => {
              stopSpeech();
              setSelectedLessonId(Number(e.target.value));
              setSentenceIndex(0);
            }}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
          >
            {filteredLessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.id}. {lesson.title}
              </option>
            ))}
          </select>

          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1">
              {selectedLesson.level}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              {selectedLesson.duration}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              {sentenceIndex + 1}/{selectedLesson.sentences.length}
            </span>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Current sentence</p>
              <h2 className="text-lg font-bold">{selectedLesson.title}</h2>
            </div>
            <button
              onClick={() => setAutoNext((prev) => !prev)}
              className={`rounded-full px-3 py-2 text-xs font-bold ${
                autoNext
                  ? "bg-sky-500 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              Auto {autoNext ? "ON" : "OFF"}
            </button>
          </div>

          <div className="rounded-3xl bg-slate-50 p-5">
            {showEnglish && (
              <p className="text-2xl font-bold leading-relaxed text-slate-900">
                {currentSentence.en}
              </p>
            )}

            {showJapanese && (
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                {currentSentence.jp}
              </p>
            )}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <button
              onClick={() => setSpeed(0.75)}
              className={`rounded-2xl py-3 text-sm font-bold ${
                speed === 0.75 ? "bg-sky-500 text-white" : "bg-slate-100"
              }`}
            >
              Slow
            </button>
            <button
              onClick={() => setSpeed(1)}
              className={`rounded-2xl py-3 text-sm font-bold ${
                speed === 1 ? "bg-sky-500 text-white" : "bg-slate-100"
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => setSpeed(1.25)}
              className={`rounded-2xl py-3 text-sm font-bold ${
                speed === 1.25 ? "bg-sky-500 text-white" : "bg-slate-100"
              }`}
            >
              Fast
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowEnglish((prev) => !prev)}
              className="rounded-2xl bg-slate-100 py-3 text-sm font-bold"
            >
              English {showEnglish ? "ON" : "OFF"}
            </button>
            <button
              onClick={() => setShowJapanese((prev) => !prev)}
              className="rounded-2xl bg-slate-100 py-3 text-sm font-bold"
            >
              Japanese {showJapanese ? "ON" : "OFF"}
            </button>
          </div>

          <button
            onClick={isSpeaking ? stopSpeech : speakSentence}
            className={`mt-5 w-full rounded-3xl py-4 text-lg font-bold text-white shadow-md ${
              isSpeaking ? "bg-rose-500" : "bg-sky-500"
            }`}
          >
            {isSpeaking ? "Stop" : "▶ Play"}
          </button>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={prevSentence}
              className="rounded-2xl bg-white py-3 text-sm font-bold ring-1 ring-slate-200"
            >
              ← Previous
            </button>
            <button
              onClick={nextSentence}
              className="rounded-2xl bg-white py-3 text-sm font-bold ring-1 ring-slate-200"
            >
              Next →
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}