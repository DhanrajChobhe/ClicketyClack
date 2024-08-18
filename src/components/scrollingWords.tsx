"use client";
import React, { act, useEffect, useState } from "react";

import { WORDS } from "@/utils/words";

interface WordProps {
  word: string;
  active: boolean;
  typed: boolean;
  activeLetter?: number;
}
const typedLetter = "text-fuchsia-950";
const cursor =
  "h-[30px] w-[2px] border rounded border-black/50 bg-black/50 mr-[1px]";
const inactiveLetter = "text-gray-600";

function WORD({ word, active, typed, activeLetter }: WordProps) {
  let letterList = word.split("").map((letter, index) => {
    if (typed) {
      return (
        <span className={typedLetter} key={word + letter + index}>
          {letter}
        </span>
      );
    }
    if (active && activeLetter && index < activeLetter) {
      return (
        <span className={typedLetter} key={word + letter + index}>
          {letter}
        </span>
      );
    } else if (active && activeLetter !== undefined && index === activeLetter) {
      return (
        <React.Fragment key={`cursor-word`}>
          <div className={cursor} key={`cursor${word}${letter}${index}`}></div>
          <span className={inactiveLetter} key={word + letter + index}>
            {letter}
          </span>
        </React.Fragment>
      );
    } else {
      return (
        <span className={inactiveLetter} key={word + letter + index}>
          {letter}
        </span>
      );
    }
  });
  return (
    <div className="flex">
      {letterList}
      {activeLetter === word.length ? <div className={cursor}></div> : null}
    </div>
  );
}

function scrollingWords() {
  const [wordIndex, setWordIndex] = useState(0);
  const [wordsInView, setWordsInView] = useState(WORDS.slice(0, 10));
  const [activeWord, setActiveWord] = useState(4);
  const [activeLetter, setActiveLetter] = useState(0);

  let wordsInViewList = wordsInView.map((word, index) => {
    if (index < activeWord) {
      return (
        <WORD word={word} typed={true} active={false} key={word + index} />
      );
    } else if (index === activeWord) {
      return (
        <WORD
          word={word}
          typed={false}
          active={true}
          activeLetter={activeLetter}
          key={word + index}
        />
      );
    } else if (index > activeWord) {
      return (
        <WORD word={word} typed={false} active={false} key={word + index} />
      );
    }
  });

  useEffect(() => {
    let timer = Math.floor(Math.random() * 500 + 133);
    let intervalId = setInterval(() => {
      if (activeLetter === wordsInView[activeWord].length) {
        setActiveLetter(0);
        let wi = wordIndex + 1;
        setWordIndex(wi);
        setWordsInView(WORDS.slice(wi, wi + 10));
      } else {
        setActiveLetter(activeLetter + 1);
      }
    }, timer);
    return () => {
      clearInterval(intervalId);
    };
  }, [activeLetter]);

  return (
    <div className="h-auto w-auto text-lg bg-red-300 p-4 flex gap-2">
      {wordsInViewList}
    </div>
  );
}

export default scrollingWords;
