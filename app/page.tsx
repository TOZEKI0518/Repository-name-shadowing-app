"use client";

import { useEffect, useRef, useState } from "react";
import { lessons } from "../data/lessons";

const tutorialSteps = [
  {
    title: "まずは音声を聞こう",
    text: "下の ▶ ボタンを押すと、今の英文を読み上げます。",
  },
  {
    title: "英文と日本語を表示しよう",
    text: "English / Japanese の Show・表示ボタンで内容を確認できます。",
  },
  {
    title: "連続再生で10分練習",
    text: "連続ボタンを押すと、1レッスンを自動で練習できます。完了するとストリークが記録されます。",
  },
];

export default function Home() {
  const [lessonIndex, setLessonIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [repeatCount, setRepeatCount] = useState(1);
  const [showEnglish, setShowEnglish] = useState(false);
  const [showJapanese, setShowJapanese] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showPremium, setShowPremium] = useState(false);

  const [streak, setStreak] = useState(0);
  const [lastStudyDate, setLastStudyDate] = useState<string | null>(null);

  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);

  const lesson = lessons[lessonIndex];
  const current = lesson.sentences[index];

  useEffect(() => {
    const savedStreak = localStorage.getItem("streak");
    const savedDate = localStorage.getItem("lastStudyDate");

    const savedLessonIndex = localStorage.getItem("lessonIndex");
    const savedSentenceIndex = localStorage.getItem("sentenceIndex");
    const savedSpeed = localStorage.getItem("speed");
    const savedRepeatCount = localStorage.getItem("repeatCount");
    const savedShowEnglish = localStorage.getItem("showEnglish");
    const savedShowJapanese = localStorage.getItem("showJapanese");

    const tutorialSeen = localStorage.getItem("tutorialSeen");

    if (savedStreak) setStreak(Number(savedStreak));
    if (savedDate) setLastStudyDate(savedDate);

    if (savedLessonIndex) {
      const value = Number(savedLessonIndex);
      if (!Number.isNaN(value) && lessons[value]) {
        setLessonIndex(value);
      }
    }

    if (savedSentenceIndex) {
      const value = Number(savedSentenceIndex);
      if (!Number.isNaN(value)) {
        setIndex(value);
      }
    }

    if (savedSpeed) setSpeed(Number(savedSpeed));
    if (savedRepeatCount) setRepeatCount(Number(savedRepeatCount));
    if (savedShowEnglish) setShowEnglish(savedShowEnglish === "true");
    if (savedShowJapanese) setShowJapanese(savedShowJapanese === "true");

    if (!tutorialSeen) {
      setShowTutorial(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lessonIndex", String(lessonIndex));
    localStorage.setItem("sentenceIndex", String(index));
    localStorage.setItem("speed", String(speed));
    localStorage.setItem("repeatCount", String(repeatCount));
    localStorage.setItem("showEnglish", String(showEnglish));
    localStorage.setItem("showJapanese", String(showJapanese));
  }, [lessonIndex, index, speed, repeatCount, showEnglish, showJapanese]);

  useEffect(() => {
    cardRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [index, lessonIndex]);

  const getToday = () => {
    return new Date().toISOString().split("T")[0];
  };

  const getYesterday = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split("T")[0];
  };

  const completeTodayStudy = () => {
    const today = getToday();
    const yesterday = getYesterday();

    if (lastStudyDate === today) return;

    let newStreak = 1;

    if (lastStudyDate === yesterday) {
      newStreak = streak + 1;
    }

    setStreak(newStreak);
    setLastStudyDate(today);

    localStorage.setItem("streak", String(newStreak));
    localStorage.setItem("lastStudyDate", today);
  };

  const speakOnce = (targetIndex: number, onFinish?: () => void) => {
    const sentence = lesson.sentences[targetIndex];

    const utterance = new SpeechSynthesisUtterance(sentence.en);
    utterance.lang = "en-US";
    utterance.rate = speed;
    utterance.pitch = 1;
    utterance.volume = 1;

    setPlayingIndex(targetIndex);

    utterance.onend = () => {
      setPlayingIndex(null);
      onFinish?.();
    };

    speechSynthesis.speak(utterance);
  };

  const playCurrent = () => {
    speechSynthesis.cancel();
    setAutoPlay(false);

    let played = 0;

    const playLoop = () => {
      if (played >= repeatCount) return;

      played += 1;

      speakOnce(index, () => {
        if (played < repeatCount) {
          setTimeout(playLoop, 900);
        }
      });
    };

    playLoop();
  };

  const startAutoPlay = () => {
    speechSynthesis.cancel();
    setAutoPlay(true);

    const playSentenceRepeatedly = (
      targetIndex: number,
      count: number,
      onComplete: () => void
    ) => {
      let played = 0;

      const playLoop = () => {
        if (played >= count) {
          onComplete();
          return;
        }

        played += 1;

        speakOnce(targetIndex, () => {
          if (played < count) {
            setTimeout(playLoop, 900);
          } else {
            onComplete();
          }
        });
      };

      playLoop();
    };

    const playSequence = (targetIndex: number) => {
      playSentenceRepeatedly(targetIndex, repeatCount, () => {
        if (targetIndex < lesson.sentences.length - 1) {
          const nextIndex = targetIndex + 1;

          setTimeout(() => {
            setIndex(nextIndex);
            playSequence(nextIndex);
          }, 1500);
        } else {
          completeTodayStudy();
          setIndex(0);
          setAutoPlay(false);
        }
      });
    };

    playSequence(index);
  };

  const stopAudio = () => {
    speechSynthesis.cancel();
    setAutoPlay(false);
    setPlayingIndex(null);
  };

  const movePrev = () => {
    stopAudio();
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  const moveNext = () => {
    stopAudio();
    setIndex((prev) => Math.min(prev + 1, lesson.sentences.length - 1));
  };

  const changeLesson = (newLessonIndex: number) => {
    stopAudio();
    setLessonIndex(newLessonIndex);
    setIndex(0);
    setShowEnglish(false);
    setShowJapanese(false);
  };

  const resetProgress = () => {
    stopAudio();
    setLessonIndex(0);
    setIndex(0);
    setSpeed(1);
    setRepeatCount(1);
    setShowEnglish(false);
    setShowJapanese(false);

    localStorage.removeItem("lessonIndex");
    localStorage.removeItem("sentenceIndex");
    localStorage.removeItem("speed");
    localStorage.removeItem("repeatCount");
    localStorage.removeItem("showEnglish");
    localStorage.removeItem("showJapanese");
  };

  const finishTutorial = () => {
    localStorage.setItem("tutorialSeen", "true");
    setShowTutorial(false);
    setTutorialStep(0);
  };

  const progress = Math.round(((index + 1) / lesson.sentences.length) * 100);
  const todayDone = lastStudyDate === getToday();
  const tutorial = tutorialSteps[tutorialStep];

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50 text-gray-800">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-36 pt-5">
        <header className="mb-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-sky-500">
                English Shadowing
              </p>
              <h1 className="text-2xl font-black tracking-tight">
                {lesson.title}
              </h1>
              <p className="mt-1 text-xs text-gray-400">
                {lesson.category} ・ {lesson.duration}
              </p>
            </div>

            <div className="rounded-2xl bg-white px-3 py-2 text-right shadow-sm">
              <p className="text-xs text-gray-400">Level</p>
              <p className="text-sm font-bold text-emerald-500">
                {lesson.level}
              </p>
            </div>
          </div>

          <div className="mb-3 rounded-2xl bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Streak</p>
                <p className="text-lg font-black text-orange-500">
                  🔥 {streak} 日連続
                </p>
              </div>

              <div
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  todayDone
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {todayDone ? "今日完了" : "未完了"}
              </div>
            </div>
          </div>

          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {lessons.map((item, i) => {
              const isLocked = i >= 3;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (isLocked) {
                      setShowPremium(true);
                      return;
                    }

                    changeLesson(i);
                  }}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
                    lessonIndex === i
                      ? "bg-sky-500 text-white"
                      : isLocked
                      ? "bg-gray-100 text-gray-400"
                      : "bg-white text-gray-500 shadow-sm"
                  }`}
                >
                  {isLocked ? "🔒 " : ""}
                  {item.title}
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <div className="mb-2 flex justify-between text-xs text-gray-400">
              <span>
                Sentence {index + 1} / {lesson.sentences.length}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-sky-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <button
            onClick={resetProgress}
            className="mt-3 w-full rounded-2xl bg-white py-2 text-xs font-bold text-gray-400 shadow-sm"
          >
            進捗をリセット
          </button>
        </header>

        <section ref={cardRef} className="space-y-4">
          <div
            className={`rounded-3xl p-5 shadow-lg transition-all ${
              playingIndex === index
                ? "bg-sky-50 ring-2 ring-sky-400"
                : "bg-white"
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-bold text-sky-600">
                English
              </span>
              <button
                onClick={() => setShowEnglish(!showEnglish)}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-500"
              >
                {showEnglish ? "Hide" : "Show"}
              </button>
            </div>

            {showEnglish ? (
              <p className="text-xl font-bold leading-relaxed text-gray-900">
                {current.en}
              </p>
            ) : (
              <p className="rounded-2xl bg-gray-50 p-4 text-center text-gray-400">
                英文を隠しています
              </p>
            )}
          </div>

          <div
            className={`rounded-3xl p-5 shadow-lg transition-all ${
              playingIndex === index
                ? "bg-emerald-50 ring-2 ring-emerald-400"
                : "bg-white"
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-600">
                Japanese
              </span>
              <button
                onClick={() => setShowJapanese(!showJapanese)}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-500"
              >
                {showJapanese ? "非表示" : "表示"}
              </button>
            </div>

            {showJapanese ? (
              <p className="text-base leading-relaxed text-gray-700">
                {current.jp}
              </p>
            ) : (
              <p className="rounded-2xl bg-gray-50 p-4 text-center text-gray-400">
                日本語訳を隠しています
              </p>
            )}
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t bg-white/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto max-w-md">
          <div className="mb-3 flex justify-center gap-2">
            {[0.75, 1, 1.25].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`rounded-full px-4 py-1 text-sm font-bold ${
                  speed === s
                    ? "bg-sky-500 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <div className="mb-3 flex justify-center gap-2">
            {[1, 3, 5].map((count) => (
              <button
                key={count}
                onClick={() => setRepeatCount(count)}
                className={`rounded-full px-4 py-1 text-sm font-bold ${
                  repeatCount === count
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {count}回
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={movePrev}
              className="h-12 flex-1 rounded-2xl bg-gray-100 font-bold text-gray-600"
            >
              ← 前
            </button>

            <button
              onClick={playCurrent}
              className="h-14 w-14 rounded-full bg-sky-500 text-2xl text-white shadow-lg"
            >
              ▶
            </button>

            <button
              onClick={autoPlay ? stopAudio : startAutoPlay}
              className={`h-12 flex-1 rounded-2xl font-bold ${
                autoPlay ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
              }`}
            >
              {autoPlay ? "停止" : "連続"}
            </button>

            <button
              onClick={moveNext}
              className="h-12 flex-1 rounded-2xl bg-gray-100 font-bold text-gray-600"
            >
              次 →
            </button>
          </div>
        </div>
      </div>

      {showTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-2xl">
              🎧
            </div>

            <p className="mb-2 text-xs font-bold text-sky-500">
              STEP {tutorialStep + 1} / {tutorialSteps.length}
            </p>

            <h2 className="mb-3 text-2xl font-black">{tutorial.title}</h2>

            <p className="mb-5 text-sm leading-relaxed text-gray-600">
              {tutorial.text}
            </p>

            <div className="mb-5 flex justify-center gap-2">
              {tutorialSteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    tutorialStep === i ? "bg-sky-500" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            <button
              className="mb-3 w-full rounded-2xl bg-sky-500 py-3 font-bold text-white shadow-lg"
              onClick={() => {
                if (tutorialStep < tutorialSteps.length - 1) {
                  setTutorialStep((prev) => prev + 1);
                } else {
                  finishTutorial();
                }
              }}
            >
              {tutorialStep < tutorialSteps.length - 1 ? "次へ" : "始める"}
            </button>

            <button
              className="text-sm font-semibold text-gray-400"
              onClick={finishTutorial}
            >
              スキップ
            </button>
          </div>
        </div>
      )}

      {showPremium && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-2xl">
              🔒
            </div>

            <h2 className="mb-2 text-2xl font-black">プレミアムプラン</h2>

            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              すべてのTOEIC・日常会話シャドウイング教材を解放して、
              毎日10分の英語学習を続けましょう。
            </p>

            <div className="mb-5 rounded-2xl bg-gray-50 p-4 text-left text-sm text-gray-700">
              <p>✅ 全レッスン解放</p>
              <p>✅ 日常会話 / TOEIC Part 3 / Part 4 対応</p>
              <p>✅ 1回 / 3回 / 5回リピート</p>
              <p>✅ 連続再生モード</p>
              <p>✅ 学習ストリーク記録</p>
              <p>✅ 続きから再開</p>
            </div>

            <p className="mb-4 text-lg font-black text-gray-900">
              月額 200円
            </p>

            <button
              className="mb-3 w-full rounded-2xl bg-sky-500 py-3 font-bold text-white shadow-lg"
              onClick={() => alert("※決済機能はこれから実装します")}
            >
              今すぐ始める
            </button>

            <button
              className="text-sm font-semibold text-gray-400"
              onClick={() => setShowPremium(false)}
            >
              あとで
            </button>
          </div>
        </div>
      )}
    </main>
  );
}