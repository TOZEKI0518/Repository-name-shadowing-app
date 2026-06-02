"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { lessons as baseLessons } from "../data";

type Screen = "home" | "study";

const categoryOrder = [
  "Daily Conversation",
  "Family",
  "Business",
  "Interview",
  "Travel",
  "Cafe & Restaurant",
  "Shopping",
  "Directions",
  "Phone / Online Meeting",
  "Weather / Small Talk",
  "Sports",
  "Hobbies",
  "Hospital",
  "School / Study",
  "Love / Dating",
];

const categoryLabels: Record<string, string> = {
  All: "すべて",
  "Daily Conversation": "日常会話",
  Family: "家族",
  Business: "ビジネス",
  Interview: "面接",
  Travel: "旅行",
  "Love / Dating": "恋愛",
  "Cafe & Restaurant": "カフェ・レストラン",
  Shopping: "買い物",
  Directions: "道案内",
  "Phone / Online Meeting": "電話・オンライン会議",
  "Weather / Small Talk": "天気・雑談",
  Sports: "スポーツ",
  Hobbies: "趣味",
  Hospital: "病院",
  "School / Study": "学校・勉強",
};

const categoryIcons: Record<string, string> = {
  All: "✨",
  "Daily Conversation": "💬",
  Family: "👨‍👩‍👧",
  Business: "💼",
  Interview: "🎤",
  Travel: "✈️",
  "Love / Dating": "❤️",
  "Cafe & Restaurant": "☕",
  Shopping: "🛍️",
  Directions: "🗺️",
  "Phone / Online Meeting": "📞",
  "Weather / Small Talk": "🌤️",
  Sports: "🎾",
  Hobbies: "🎨",
  Hospital: "🏥",
  "School / Study": "📚",
};

const tutorialSteps = [
  {
    title: "まずは音声を聞こう",
    text: "▶ ボタンを押すと、今の英文を読み上げます。",
    icon: "🎧",
  },
  {
    title: "英文と日本語を確認しよう",
    text: "Show / 表示ボタンで英文や日本語訳を確認できます。",
    icon: "📘",
  },
  {
    title: "繰り返し練習しよう",
    text: "1回・3回・5回から選んで、同じ英文を反復できます。",
    icon: "🔁",
  },
  {
    title: "レッスンを変更しよう",
    text: "ホーム画面やレッスン変更ボタンから、別のレッスンを選べます。",
    icon: "📚",
  },
];

const normalizeCategory = (category: string) => {
  if (category === "TOEIC") return "Interview";
  if (category === "Hotel & Airport") return "Travel";
  return category;
};

const normalizeLessonCategory = <T extends { category: string }>(lesson: T): T => {
  const normalizedCategory = normalizeCategory(lesson.category);
  if (normalizedCategory === lesson.category) return lesson;

  return {
    ...lesson,
    category: normalizedCategory,
  };
};

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [lessonIndex, setLessonIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [repeatCount, setRepeatCount] = useState(1);
  const [showEnglish, setShowEnglish] = useState(false);
  const [showJapanese, setShowJapanese] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const [streak, setStreak] = useState(0);
  const [lastStudyDate, setLastStudyDate] = useState<string | null>(null);

  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const autoPlayRef = useRef(false);

  const categoryList = useMemo(() => {
    return ["All", ...categoryOrder];
  }, []);

  const allLessons = useMemo(() => {
    return baseLessons
      .filter((item) => normalizeCategory(item.category) !== "Work")
      .map(normalizeLessonCategory);
  }, []);

  const lesson = allLessons[lessonIndex] ?? allLessons[0];
  const current = lesson?.sentences[index] ?? lesson?.sentences[0];

  const filteredLessons =
    selectedCategory === "All"
      ? allLessons
      : allLessons.filter((item) => item.category === selectedCategory);

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
      if (!Number.isNaN(value) && allLessons[value]) setLessonIndex(value);
    }

    if (savedSentenceIndex) {
      const value = Number(savedSentenceIndex);
      if (!Number.isNaN(value)) setIndex(value);
    }

    if (savedSpeed) setSpeed(Number(savedSpeed));
    if (savedRepeatCount) setRepeatCount(Number(savedRepeatCount));
    if (savedShowEnglish) setShowEnglish(savedShowEnglish === "true");
    if (savedShowJapanese) setShowJapanese(savedShowJapanese === "true");

    if (!tutorialSeen) setShowTutorial(true);
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
    if (!lesson) return;
    if (index > lesson.sentences.length - 1) {
      setIndex(0);
    }
  }, [lesson, index]);

  const getToday = () => new Date().toISOString().split("T")[0];

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
    if (lastStudyDate === yesterday) newStreak = streak + 1;

    setStreak(newStreak);
    setLastStudyDate(today);

    localStorage.setItem("streak", String(newStreak));
    localStorage.setItem("lastStudyDate", today);
  };

  const stopAudio = () => {
    autoPlayRef.current = false;
    speechSynthesis.cancel();
    setAutoPlay(false);
    setPlayingIndex(null);
  };

  const speakOnce = (targetIndex: number, onFinish?: () => void) => {
    if (!lesson?.sentences[targetIndex]) return;
    if (!autoPlayRef.current && autoPlay) return;

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

    utterance.onerror = () => {
      setPlayingIndex(null);
      onFinish?.();
    };

    speechSynthesis.speak(utterance);
  };

  const playCurrent = () => {
    stopAudio();

    let played = 0;

    const playLoop = () => {
      if (played >= repeatCount) return;

      played += 1;

      const sentence = lesson.sentences[index];
      const utterance = new SpeechSynthesisUtterance(sentence.en);
      utterance.lang = "en-US";
      utterance.rate = speed;
      utterance.pitch = 1;
      utterance.volume = 1;

      setPlayingIndex(index);

      utterance.onend = () => {
        setPlayingIndex(null);
        if (played < repeatCount) {
          setTimeout(playLoop, 900);
        }
      };

      utterance.onerror = () => {
        setPlayingIndex(null);
      };

      speechSynthesis.speak(utterance);
    };

    playLoop();
  };

  const startAutoPlay = () => {
    if (!lesson) return;

    speechSynthesis.cancel();
    autoPlayRef.current = true;
    setAutoPlay(true);

    const playSentenceRepeatedly = (
      targetIndex: number,
      count: number,
      onComplete: () => void
    ) => {
      let played = 0;

      const playLoop = () => {
        if (!autoPlayRef.current) return;

        if (played >= count) {
          onComplete();
          return;
        }

        played += 1;

        if (!lesson.sentences[targetIndex]) {
          autoPlayRef.current = false;
          setAutoPlay(false);
          return;
        }

        const sentence = lesson.sentences[targetIndex];

        const utterance = new SpeechSynthesisUtterance(sentence.en);
        utterance.lang = "en-US";
        utterance.rate = speed;
        utterance.pitch = 1;
        utterance.volume = 1;

        setPlayingIndex(targetIndex);

        utterance.onend = () => {
          setPlayingIndex(null);

          if (!autoPlayRef.current) return;

          if (played < count) {
            setTimeout(() => {
              if (!autoPlayRef.current) return;
              playLoop();
            }, 900);
          } else {
            onComplete();
          }
        };

        utterance.onerror = () => {
          setPlayingIndex(null);
          if (!autoPlayRef.current) return;
          onComplete();
        };

        speechSynthesis.speak(utterance);
      };

      playLoop();
    };

    const playSequence = (targetIndex: number) => {
      if (!autoPlayRef.current) return;

      playSentenceRepeatedly(targetIndex, repeatCount, () => {
        if (!autoPlayRef.current) return;

        if (targetIndex < lesson.sentences.length - 1) {
          const nextIndex = targetIndex + 1;

          setTimeout(() => {
            if (!autoPlayRef.current) return;
            setIndex(nextIndex);
            playSequence(nextIndex);
          }, 1500);
        } else {
          completeTodayStudy();
          setIndex(0);
          autoPlayRef.current = false;
          setAutoPlay(false);
        }
      });
    };

    playSequence(index);
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

    if (!allLessons[newLessonIndex]) return;

    setLessonIndex(newLessonIndex);
    setIndex(0);
    setShowEnglish(false);
    setShowJapanese(false);
    setScreen("study");
    setShowLessonModal(false);
  };

  const goToSelectedCategoryLesson = () => {
    stopAudio();

    const firstLesson = filteredLessons[0];
    if (!firstLesson) return;

    const realIndex = allLessons.findIndex((item) => item.id === firstLesson.id && item.category === firstLesson.category);
    if (realIndex < 0) return;

    setLessonIndex(realIndex);
    setIndex(0);
    setShowEnglish(false);
    setShowJapanese(false);
    setScreen("study");
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

  if (!lesson || !current) {
    return (
      <main className="min-h-screen bg-white p-6 text-gray-800">
        レッスンデータがありません。
      </main>
    );
  }

  const progress = Math.round(((index + 1) / lesson.sentences.length) * 100);
  const todayDone = lastStudyDate === getToday();
  const tutorial = tutorialSteps[tutorialStep];

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50 text-gray-800">
      {screen === "home" && (
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-24 pt-5">
          <header className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-sky-500">
                English Shadowing
              </p>
              <h1 className="text-2xl font-black tracking-tight">
                レッスン一覧
              </h1>
            </div>

            <button
              onClick={() => setShowMenu(true)}
              aria-label="メニューを開く"
              className="rounded-2xl bg-white px-4 py-2 text-3xl font-black leading-none text-gray-700 shadow-sm"
            >
              ≡
            </button>
          </header>

          <section className="mb-5 rounded-3xl bg-white px-5 py-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-black text-orange-500">
                  🔥 {streak} 日連続
                </p>
                <p className="mt-1 text-sm font-bold text-gray-400">
                  連続記録！
                </p>
              </div>

              <div
                className={`rounded-full px-4 py-2 text-sm font-black ${
                  todayDone
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {todayDone ? "今日完了" : "未完了"}
              </div>
            </div>
          </section>

          <section className="mb-5">
            <p className="mb-3 text-sm font-black text-gray-700">
              カテゴリを選択
            </p>

            <div className="grid grid-cols-4 gap-3">
              {categoryList.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-2xl p-3 text-center shadow-sm ${
                    selectedCategory === category
                      ? "bg-sky-500 text-white"
                      : "bg-white text-gray-500"
                  }`}
                >
                  <div className="mb-1 text-2xl">
                    {categoryIcons[category] || "🎧"}
                  </div>
                  <p className="truncate text-xs font-bold">
                    {categoryLabels[category] || category}
                  </p>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            {filteredLessons.length === 0 ? (
              <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
                <p className="text-3xl">📭</p>
                <p className="mt-2 font-bold text-gray-600">
                  このカテゴリのレッスンは準備中です
                </p>
              </div>
            ) : (
              filteredLessons.map((item) => {
                const realIndex = allLessons.findIndex((l) => l.id === item.id && l.category === item.category);
                const isLocked = false;

                return (
                  <button
                    key={`${item.category}-${item.id}`}
                    onClick={() => {
                      if (isLocked) {
                        setShowPremium(true);
                        return;
                      }
                      changeLesson(realIndex);
                    }}
                    className="flex w-full items-center gap-3 rounded-3xl bg-white p-3 text-left shadow-sm"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-3xl">
                      {isLocked ? "🔒" : categoryIcons[item.category] || "🎧"}
                    </div>

                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="rounded-lg bg-sky-500 px-2 py-1 text-xs font-black text-white">
                          {String(realIndex + 1).padStart(2, "0")}
                        </span>
                        <p className="font-black">{item.title}</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        {categoryLabels[item.category] || item.category} ・{" "}
                        {item.level} ・ {item.duration}
                      </p>
                    </div>

                    <span className="text-2xl text-gray-300">›</span>
                  </button>
                );
              })
            )}
          </section>

          <button
            onClick={goToSelectedCategoryLesson}
            disabled={filteredLessons.length === 0}
            className={`fixed inset-x-4 bottom-4 mx-auto max-w-md rounded-2xl py-4 font-black text-white shadow-lg ${
              filteredLessons.length === 0
                ? "bg-gray-300"
                : "bg-pink-500 active:scale-[0.98]"
            }`}
          >
            ▶ レッスン画面へ
          </button>
        </div>
      )}

      {screen === "study" && (
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-48 pt-5">
          <header className="mb-3">
            <div className="mb-2">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-black leading-tight text-sky-500">
                    {categoryLabels[lesson.category] || lesson.category}
                  </p>

                  <h1 className="truncate text-2xl font-black tracking-tight text-gray-900">
                    {lesson.title}
                  </h1>
                </div>

                <button
                  onClick={() => setShowMenu(true)}
                  aria-label="メニューを開く"
                  className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-white px-4 py-2 text-3xl font-black leading-none text-gray-700 shadow-md"
                >
                  ≡
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                stopAudio();
                setShowLessonModal(true);
              }}
              className="mb-2 flex w-full items-center justify-between rounded-3xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-left text-white shadow-lg transition active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur">
                  📖
                </div>

                <p className="text-2xl font-black">レッスンを変更</p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl font-black text-sky-500 shadow-md">
                ›
              </div>
            </button>

            <div className="rounded-3xl bg-white p-4 shadow-md">
              <div className="mb-2 flex justify-between text-sm font-bold text-gray-400">
                <span>
                  Sentence {index + 1} / {lesson.sentences.length}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-sky-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <button
              onClick={resetProgress}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-3xl bg-white py-2 text-sm font-black text-gray-400 shadow-md"
            >
              <span className="text-lg">↻</span>
              進捗をリセット
            </button>
          </header>

          <section className="space-y-3">
            <div
              className={`rounded-3xl p-3 shadow-lg transition-all ${
                playingIndex === index
                  ? "bg-sky-50 ring-2 ring-sky-400"
                  : "bg-white"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-black text-sky-600">
                  English
                </span>
                <button
                  onClick={() => setShowEnglish(!showEnglish)}
                  className="rounded-full bg-gray-100 px-4 py-2 text-sm font-black text-gray-500"
                >
                  {showEnglish ? "Hide" : "Show"}
                </button>
              </div>

              <div className="flex min-h-[40px] items-center rounded-2xl bg-gray-50 px-4 py-2">
                {showEnglish ? (
                  <p className="w-full text-lg font-bold leading-snug text-gray-900">
                    {current.en}
                  </p>
                ) : (
                  <p className="w-full text-center text-base font-bold text-gray-400">
                    英文を隠しています
                  </p>
                )}
              </div>
            </div>

            <div
              className={`rounded-3xl p-3 shadow-lg transition-all ${
                playingIndex === index
                  ? "bg-emerald-50 ring-2 ring-emerald-400"
                  : "bg-white"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-600">
                  Japanese
                </span>
                <button
                  onClick={() => setShowJapanese(!showJapanese)}
                  className="rounded-full bg-gray-100 px-4 py-2 text-sm font-black text-gray-500"
                >
                  {showJapanese ? "非表示" : "表示"}
                </button>
              </div>

              <div className="flex min-h-[40px] items-center rounded-2xl bg-gray-50 px-4 py-2">
                {showJapanese ? (
                  <p className="w-full text-base font-bold leading-snug text-gray-700">
                    {current.jp}
                  </p>
                ) : (
                  <p className="w-full text-center text-base font-bold text-gray-400">
                    日本語訳を隠しています
                  </p>
                )}
              </div>
            </div>
          </section>

          <div className="fixed inset-x-0 bottom-0 z-10 border-t bg-white/95 px-4 py-3 backdrop-blur">
            <div className="mx-auto max-w-md">
              <div className="mb-3 flex justify-center gap-2">
                {[0.75, 1, 1.25].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`rounded-full px-5 py-2 text-sm font-black ${
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
                    className={`rounded-full px-5 py-2 text-sm font-black ${
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
                  className="h-14 flex-1 rounded-2xl bg-gray-100 font-black text-gray-600"
                >
                  ← 前
                </button>

                <button
                  onClick={playCurrent}
                  className="h-16 w-16 rounded-full bg-sky-500 text-3xl text-white shadow-lg"
                >
                  ▶
                </button>

                <button
                  onClick={autoPlay ? stopAudio : startAutoPlay}
                  className={`h-14 flex-1 rounded-2xl font-black ${
                    autoPlay
                      ? "bg-red-500 text-white"
                      : "bg-emerald-500 text-white"
                  }`}
                >
                  {autoPlay ? "停止" : "連続"}
                </button>

                <button
                  onClick={moveNext}
                  className="h-14 flex-1 rounded-2xl bg-gray-100 font-black text-gray-600"
                >
                  次 →
                </button>
              </div>

              <button
                onClick={() => {
                  stopAudio();
                  setScreen("home");
                }}
                className="mt-3 w-full rounded-2xl bg-white py-4 font-black text-pink-500 shadow-md"
              >
                🏠 ホームへ戻る
              </button>
            </div>
          </div>
        </div>
      )}


      {showMenu && (
        <div className="fixed inset-0 z-50 bg-black/20" onClick={() => setShowMenu(false)}>
          <div
            className="absolute right-4 top-16 w-64 rounded-3xl bg-white p-3 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowMenu(false);
                setShowTutorial(true);
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-black text-gray-700 active:bg-gray-50"
            >
              <span className="text-xl">📘</span>
              使い方ガイド
            </button>

            <button
              onClick={() => {
                setShowMenu(false);
                setShowPremium(true);
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-black text-pink-500 active:bg-pink-50"
            >
              <span className="text-xl">👑</span>
              プレミアム会員
            </button>

            <button
              onClick={() => {
                setShowMenu(false);
                setShowTerms(true);
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-black text-gray-700 active:bg-gray-50"
            >
              <span className="text-xl">📄</span>
              利用規約
            </button>

            <button
              onClick={() => {
                setShowMenu(false);
                setShowPrivacy(true);
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-black text-gray-700 active:bg-gray-50"
            >
              <span className="text-xl">🛡️</span>
              プライバシーポリシー
            </button>
          </div>
        </div>
      )}

      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-black">利用規約</h2>
              <button
                onClick={() => setShowTerms(false)}
                className="rounded-full bg-gray-100 px-3 py-1 text-lg font-black text-gray-500"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-gray-600">
              <section>
                <h3 className="mb-1 font-black text-gray-800">1. このアプリについて</h3>
                <p>
                  English Shadowingは、英語の音声を聞きながらシャドーイング練習を行うための学習アプリです。
                  本アプリは学習補助を目的としており、特定の学習成果を保証するものではありません。
                </p>
              </section>

              <section>
                <h3 className="mb-1 font-black text-gray-800">2. 利用上の注意</h3>
                <p>
                  利用者は、本アプリを法令および公序良俗に反しない範囲で利用するものとします。
                  アプリの内容、デザイン、教材データを無断で複製、転載、再配布することは禁止します。
                </p>
              </section>

              <section>
                <h3 className="mb-1 font-black text-gray-800">3. 免責事項</h3>
                <p>
                  本アプリの利用により発生した損害、不具合、データ消失等について、開発者は故意または重大な過失がある場合を除き責任を負いません。
                  端末やブラウザの環境により、音声再生や表示が一部異なる場合があります。
                </p>
              </section>

              <section>
                <h3 className="mb-1 font-black text-gray-800">4. 内容の変更</h3>
                <p>
                  開発者は、必要に応じて本アプリの機能、教材、料金、利用規約を変更できるものとします。
                </p>
              </section>

              <section>
                <h3 className="mb-1 font-black text-gray-800">5. お問い合わせ</h3>
                <p>
                  本アプリに関するお問い合わせは、Google Playストア上に記載された連絡先よりお願いします。
                </p>
              </section>
            </div>

            <button
              onClick={() => setShowTerms(false)}
              className="mt-6 w-full rounded-2xl bg-sky-500 py-3 font-bold text-white shadow-lg"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-black">プライバシーポリシー</h2>
              <button
                onClick={() => setShowPrivacy(false)}
                className="rounded-full bg-gray-100 px-3 py-1 text-lg font-black text-gray-500"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-gray-600">
              <section>
                <h3 className="mb-1 font-black text-gray-800">1. 取得する情報</h3>
                <p>
                  本アプリは、ログイン機能を提供しておらず、氏名、メールアドレス、住所など個人を直接特定する情報をアプリ内で取得しません。
                </p>
              </section>

              <section>
                <h3 className="mb-1 font-black text-gray-800">2. 端末内に保存される情報</h3>
                <p>
                  学習中のレッスン番号、文章番号、再生速度、表示設定、連続学習日数などは、利便性向上のため利用者の端末内に保存されます。
                  これらの情報は外部サーバーへ送信されません。
                </p>
              </section>

              <section>
                <h3 className="mb-1 font-black text-gray-800">3. 音声機能について</h3>
                <p>
                  本アプリの音声読み上げは、利用者の端末またはブラウザの音声読み上げ機能を使用します。
                  読み上げ品質や利用できる音声は、端末環境により異なります。
                </p>
              </section>

              <section>
                <h3 className="mb-1 font-black text-gray-800">4. 第三者提供</h3>
                <p>
                  開発者は、法令に基づく場合を除き、利用者の個人情報を第三者へ提供しません。
                </p>
              </section>

              <section>
                <h3 className="mb-1 font-black text-gray-800">5. 改定</h3>
                <p>
                  本ポリシーは、必要に応じて変更される場合があります。重要な変更がある場合は、アプリ内またはストアページでお知らせします。
                </p>
              </section>
            </div>

            <button
              onClick={() => setShowPrivacy(false)}
              className="mt-6 w-full rounded-2xl bg-sky-500 py-3 font-bold text-white shadow-lg"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {showLessonModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="w-full max-w-md rounded-t-[2rem] bg-white p-5 shadow-2xl">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-200" />

            <h2 className="mb-4 text-center text-xl font-black">
              レッスンを変更
            </h2>

            <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
              {categoryList.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
                    selectedCategory === category
                      ? "bg-sky-500 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {categoryLabels[category] || category}
                </button>
              ))}
            </div>

            <div className="max-h-[55vh] space-y-2 overflow-y-auto">
              {filteredLessons.length === 0 ? (
                <div className="rounded-2xl bg-gray-50 p-5 text-center text-sm font-bold text-gray-400">
                  このカテゴリのレッスンは準備中です
                </div>
              ) : (
                filteredLessons.map((item) => {
                  const realIndex = allLessons.findIndex((l) => l.id === item.id && l.category === item.category);
                  const selected = realIndex === lessonIndex;
                  const isLocked = false;

                  return (
                    <button
                      key={`${item.category}-${item.id}`}
                      onClick={() => {
                        if (isLocked) {
                          setShowPremium(true);
                          return;
                        }
                        changeLesson(realIndex);
                      }}
                      className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left ${
                        selected ? "bg-sky-50" : "bg-white"
                      }`}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-xl">
                        {isLocked ? "🔒" : categoryIcons[item.category] || "🎧"}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-sky-500 px-2 py-1 text-xs font-black text-white">
                            {String(realIndex + 1).padStart(2, "0")}
                          </span>
                          <p className="font-black">{item.title}</p>
                        </div>
                        <p className="mt-1 text-xs text-gray-400">
                          {categoryLabels[item.category] || item.category} ・{" "}
                          {item.level} ・ {item.duration}
                        </p>
                      </div>

                      {selected && <div className="text-xl text-sky-500">✓</div>}
                    </button>
                  );
                })
              )}
            </div>

            <button
              onClick={() => setShowLessonModal(false)}
              className="mt-5 w-full rounded-2xl bg-gray-100 py-4 font-black text-gray-600"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {showTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-2xl">
              {tutorial.icon}
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
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pink-100 text-2xl">
              👑
            </div>

            <h2 className="mb-2 text-2xl font-black">プレミアム会員</h2>

            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              プレミアム機能は現在準備中です。公開後のアップデートで、より多くのレッスンや便利な機能を追加予定です。
            </p>

            <div className="mb-5 rounded-2xl bg-gray-50 p-4 text-left text-sm text-gray-700">
              <p className="mb-2 font-black text-gray-800">今後追加予定</p>
              <p>✅ 追加レッスン</p>
              <p>✅ 面接英会話レッスンの拡充</p>
              <p>✅ ビジネス英会話レッスンの拡充</p>
              <p>✅ 広告非表示</p>
              <p>✅ 学習を続けやすくする追加機能</p>
            </div>

            <p className="mb-4 text-xs leading-relaxed text-gray-400">
              現在、課金・決済機能は実装されていません。
            </p>

            <button
              className="w-full rounded-2xl bg-pink-500 py-3 font-bold text-white shadow-lg"
              onClick={() => setShowPremium(false)}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </main>
  );
}