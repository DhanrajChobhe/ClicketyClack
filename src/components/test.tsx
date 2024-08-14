"use client";
import { useEffect, useRef, useState } from "react";
import Timer from "./timer";
import Word from "./word";
import { TESTTIME } from "@/utils/constants";
import { Fredoka } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";

const fredoka = Fredoka({ weight: "400", style: "normal", subsets: ["latin"] });
//"h-auto text-3xl flex gap-2 flex-wrap"

interface TestProps {
  wordList: string[];
}

export function Test({ wordList }: TestProps) {
  const wordlistRef = useRef<string[]>(wordList);
  const [WORDS, setWORDS] = useState(wordlistRef.current.slice(0, 50));
  const [activeWord, setActiveWord] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TESTTIME);
  const [timeUp, setTimeUp] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [typedLetters, setTypedLetters] = useState(
    new Array<string>(wordList.length).fill("")
  );
  const [startTime, setStartTime] = useState<number | null>(null);
  const [grossWpm, setGrossWpm] = useState<number | null>(null);
  const [netWpm, setNetWpm] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [incorrectCharacters, setIncorrectCharacters] = useState<number | null>(
    null
  );
  const [correctCharacters, setCorrectCharacters] = useState<number | null>(
    null
  );
  const [totalCharacters, setTotalCharacters] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (/^[a-z\s]$/.test(event.key)) {
      if (inputValue && event.key === " ") {
        setActiveWord((aw) => aw + 1);
        if (WORDS.length - 5 === activeWord && activeWord !== 0) {
          setWORDS((prevWORDS) =>
            wordlistRef.current.slice(0, prevWORDS.length + 10)
          );
        }
        setTypedLetters((prevTypedLetters) => {
          prevTypedLetters[activeWord] = inputValue;
          return prevTypedLetters;
        });
        setInputValue("");
        event.preventDefault();
      } else if (!inputValue && event.key === " ") {
        event.preventDefault();
      }
      if (!timerRef.current && event.key !== " ") {
        setStartTime(Date.now());
      }
    } else if (
      event.key === "Backspace" &&
      inputValue === "" &&
      activeWord !== 0
    ) {
      setActiveWord((aw) => aw - 1);
      setInputValue(typedLetters[activeWord - 1]);
      setTypedLetters((prevTypedLetters) => {
        prevTypedLetters[activeWord] = "";
        return prevTypedLetters;
      });
      event.preventDefault();
    }
  };
  const handleFocus = (event: React.MouseEvent) => {
    inputRef.current?.focus();
  };

  let wordRenderList = WORDS.map((word, index) => {
    const currentTypedLetters = typedLetters[index];

    if (index == activeWord) {
      return (
        <Word active={true} word={word} lettersTyped={inputValue} key={index} />
      );
    } else if (index < activeWord) {
      return (
        <Word
          active={false}
          word={word}
          lettersTyped={currentTypedLetters}
          key={index}
        />
      );
    } else if (index > activeWord) {
      return <Word active={false} word={word} key={index} />;
    }
  });

  useEffect(() => {
    if (startTime) {
      timerRef.current = setInterval(() => {
        if (timeLeft > 0) {
          setTimeLeft((prevTime) => prevTime - 1);
        } else {
          setTimeUp(true);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [startTime, timeLeft]);

  useEffect(() => {
    if (timeUp) {
      const endTime = Date.now();
      const totalTimeInSeconds = (endTime - startTime!) / 1000;
      const totalCharacters =
        typedLetters.reduce((acc, curr) => acc + curr.length, 0) +
        typedLetters.filter((letter) => letter !== "").length;

      let correctCharacters = 0;
      let incorrectCharacters = 0;
      for (let i = 0; i < typedLetters.length; i++) {
        if (typedLetters[i] === WORDS[i]) {
          correctCharacters += typedLetters[i].length + 1;
        } else {
          for (let j = 0; j < typedLetters[i].length; j++) {
            if (typedLetters[i][j] != WORDS[i][j]) {
              incorrectCharacters++;
            } else if (typedLetters[i][j] == WORDS[i][j]) {
              correctCharacters++;
            } else {
              incorrectCharacters++;
            }
          }
        }
      }

      const grossWpm = Math.round(
        totalCharacters / (5 * (totalTimeInSeconds / 60))
      );

      const netWpm = Math.round(
        correctCharacters / (5 * (totalTimeInSeconds / 60))
      );
      const accuracy = Math.round((correctCharacters / totalCharacters) * 100);

      setGrossWpm(grossWpm);
      setNetWpm(netWpm);
      setAccuracy(accuracy);
      setIncorrectCharacters(incorrectCharacters);
      setCorrectCharacters(correctCharacters);
      setTotalCharacters(totalCharacters);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeUp, startTime]);

  return (
    <div className="flex h-full lg:w-[70%] w-[90%] justify-center items-center flex-col text-8xl text-gray-700/30">
      {timeUp ? (
        <div className="text-2xl text-fuchsia-950">
          <p>Time's up!</p>
          <p>Raw WPM: {grossWpm}</p>
          <p>WPM: {netWpm}</p>
          <p>Accuracy: {accuracy}%</p>
          <p>
            Characters: {incorrectCharacters} | {correctCharacters} |{" "}
            {totalCharacters}
          </p>
        </div>
      ) : (
        <>
          <Timer timeLeft={timeLeft} />
          <div
            className="bg-red-300 border-zinc-950 h-full"
            onClick={handleFocus}
          >
            <div className=" p-10">
              <div
                className={`h-auto text-3xl flex gap-2 flex-wrap ${fredoka.className}`}
              >
                {wordRenderList}
              </div>
            </div>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="text-base p-2 opacity-0"
          />
          {/* <p className="text-base">Input value: {inputValue}</p> */}
        </>
      )}
    </div>
  );
}
