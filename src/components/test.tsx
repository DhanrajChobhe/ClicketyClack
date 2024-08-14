"use client";
import { useEffect, useRef, useState } from "react";
import Timer from "./timer";
import { Word } from "./word";
import { TESTTIME } from "@/utils/constants";

interface TestProps {
  wordList: string[];
}

export function Test({ wordList }: TestProps) {
  const WORDS = wordList;
  const [activeWord, setActiveWord] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TESTTIME);
  const [timeUp, setTimeUp] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [typedLetters, setTypedLetters] = useState(
    new Array<string>(WORDS.length).fill("")
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
      if (event.key === " ") {
        setActiveWord((aw) => aw + 1);
        setTypedLetters((prevTypedLetters) => {
          prevTypedLetters[activeWord] = inputValue;
          return prevTypedLetters;
        });
        setInputValue("");
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
    console.log(event);
    inputRef.current?.focus();
  };

  let wordRenderList = WORDS.map((word, index) => {
    const currentTypedLetters = typedLetters[index];

    if (index == activeWord) {
      return <Word active={true} word={word} lettersTyped={inputValue} />;
    } else if (index < activeWord) {
      return (
        <Word active={false} word={word} lettersTyped={currentTypedLetters} />
      );
    } else if (index > activeWord) {
      return <Word active={false} word={word} />;
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
    <div className="flex h-full w-full justify-center items-center text-8xl text-fuchsia-950">
      {timeUp ? (
        <div className="text-2xl">
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
        <div className="flex w-full justify-center items-center flex-col bg-pink-200/30 ">
          <Timer timeLeft={timeLeft} />
          <div
            className="bg-red-300 border-zinc-950 h-96 w-[90%] "
            onClick={handleFocus}
          >
            <div className="h-[90%] overflow-hidden p-10">
              <div className="h-auto text-3xl flex gap-2 flex-wrap">
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
        </div>
      )}
    </div>
  );
}
