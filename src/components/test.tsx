"use client";
import { useEffect, useRef, useReducer } from "react";
import Timer from "./timer";
import Word from "./word";
import { TESTTIME } from "@/utils/constants";
import { Fredoka } from "next/font/google";

const fredoka = Fredoka({ weight: "400", style: "normal", subsets: ["latin"] });
//"h-auto text-3xl flex gap-2 flex-wrap"

interface TestProps {
  wordList: string[];
}

const initialState = {
  WORDS: [],
  activeWord: 0,
  timeLeft: TESTTIME,
  timeUp: false,
  inputValue: "",
  typedLetters: [],
  startTime: null,
  stats: {
    grossWpm: null,
    netWpm: null,
    accuracy: null,
    incorrectCharacters: null,
    correctCharacters: null,
    totalCharacters: null,
  },
};

const ACTIONS = {
  UPDATE_WORDS: "UPDATE_WORDS",
  SET_ACTIVE_WORD: "SET_ACTIVE_WORD",
  DECREMENT_TIME: "DECREMENT_TIME",
  SET_TIME_UP: "SET_TIME_UP",
  UPDATE_INPUT_VALUE: "UPDATE_INPUT_VALUE",
  UPDATE_TYPED_LETTERS: "UPDATE_TYPED_LETTERS",
  SET_START_TIME: "SET_START_TIME",
  UPDATE_STATS: "UPDATE_STATS",
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case ACTIONS.UPDATE_WORDS:
      return { ...state, WORDS: action.payload };
    case ACTIONS.SET_ACTIVE_WORD:
      return { ...state, activeWord: action.payload };
    case ACTIONS.DECREMENT_TIME:
      return { ...state, timeLeft: state.timeLeft - 1 };
    case ACTIONS.SET_TIME_UP:
      return { ...state, timeUp: true };
    case ACTIONS.UPDATE_INPUT_VALUE:
      return { ...state, inputValue: action.payload };
    case ACTIONS.UPDATE_TYPED_LETTERS:
      return { ...state, typedLetters: action.payload };
    case ACTIONS.SET_START_TIME:
      return { ...state, startTime: action.payload };
    case ACTIONS.UPDATE_STATS:
      return { ...state, stats: action.payload };
    default:
      return state;
  }
};

export function Test({ wordList }: TestProps) {
  const wordlistRef = useRef<string[]>(wordList);
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    WORDS: wordlistRef.current.slice(0, 50),
  });
  const {
    WORDS,
    activeWord,
    timeLeft,
    timeUp,
    inputValue,
    typedLetters,
    startTime,
    stats,
  } = state;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: ACTIONS.UPDATE_INPUT_VALUE, payload: event.target.value });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (/^[a-z\s]$/.test(event.key)) {
      if (inputValue && event.key === " ") {
        // Advance active word if necessary
        dispatch({ type: ACTIONS.SET_ACTIVE_WORD, payload: activeWord + 1 });

        // Update typed letters for current word
        let newTypedLetters = [...typedLetters];
        newTypedLetters[activeWord] = inputValue;
        dispatch({
          type: ACTIONS.UPDATE_TYPED_LETTERS,
          payload: newTypedLetters,
        });

        // Load more words if needed
        if (WORDS.length - 5 === activeWord && activeWord !== 0) {
          dispatch({
            type: ACTIONS.UPDATE_WORDS,
            payload: wordlistRef.current.slice(0, WORDS.length + 10),
          });
        }

        // Reset input value
        dispatch({ type: ACTIONS.UPDATE_INPUT_VALUE, payload: "" });

        event.preventDefault();
      } else if (!inputValue && event.key === " ") {
        event.preventDefault();
      } else if (!timerRef.current && event.key !== " ") {
        dispatch({ type: ACTIONS.SET_START_TIME, payload: Date.now() });
      }
    } else if (
      event.key === "Backspace" &&
      inputValue === "" &&
      activeWord !== 0
    ) {
      const newTypedLetters = [...typedLetters];
      dispatch({ type: ACTIONS.SET_ACTIVE_WORD, payload: activeWord - 1 });

      dispatch({
        type: ACTIONS.UPDATE_INPUT_VALUE,
        payload: newTypedLetters[activeWord - 1],
      });

      // Handle backspace logic for previous word
      newTypedLetters[activeWord] = "";
      dispatch({
        type: ACTIONS.UPDATE_TYPED_LETTERS,
        payload: newTypedLetters,
      });
      event.preventDefault();
    }
  };

  const handleFocus = (event: React.MouseEvent) => {
    inputRef.current?.focus();
  };

  let wordRenderList = WORDS.map((word: string, index: number) => {
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
          dispatch({ type: ACTIONS.DECREMENT_TIME });
        } else {
          dispatch({ type: ACTIONS.SET_TIME_UP });
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [startTime, timeLeft, dispatch]);

  useEffect(() => {
    if (timeUp) {
      const endTime = Date.now();
      const totalTimeInSeconds = (endTime - startTime!) / 1000;
      const totalCharacters =
        typedLetters.reduce(
          (acc: number, curr: string) => acc + curr.length,
          0
        ) + typedLetters.filter((letter: string) => letter !== "").length;

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
          correctCharacters++;
        }
      }

      const grossWpm = Math.round(
        totalCharacters / (5 * (totalTimeInSeconds / 60))
      );

      const netWpm = Math.round(
        correctCharacters / (5 * (totalTimeInSeconds / 60))
      );
      const accuracy = Math.round((correctCharacters / totalCharacters) * 100);

      const calculatedStats = {
        grossWpm,
        netWpm,
        accuracy,
        incorrectCharacters,
        correctCharacters,
        totalCharacters,
      };

      dispatch({ type: ACTIONS.UPDATE_STATS, payload: calculatedStats });
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeUp, startTime, dispatch]);

  return (
    <div className="flex h-full lg:w-[70%] w-[90%] justify-center items-center flex-col text-8xl text-gray-700/30">
      {timeUp ? (
        <div className="text-2xl text-fuchsia-950">
          <p>Time's up!</p>
          <p>Raw WPM: {state.stats.grossWpm}</p>
          <p>WPM: {state.stats.netWpm}</p>
          <p>Accuracy: {state.stats.accuracy}%</p>
          <p>
            Characters: {state.stats.incorrectCharacters} |{" "}
            {state.stats.correctCharacters} | {state.stats.totalCharacters}
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
