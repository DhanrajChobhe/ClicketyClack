import { memo } from "react";

interface WordProps {
  active: boolean;
  word: string;
  lettersTyped?: string;
}

function Word({ active, word, lettersTyped }: WordProps) {
  let typedLength = lettersTyped?.length || 0;
  let letters = word.split("");
  let letterList = letters.map((letter, index) => {
    if (index <= typedLength - 1 && lettersTyped) {
      if (lettersTyped[index] === letter) {
        return (
          <span className="text-fuchsia-950" key={word + letter + index}>
            {letter}
          </span>
        );
      } else {
        return (
          <span className="text-red-600" key={word + letter + index}>
            {letter}
          </span>
        );
      }
    } else if (index == typedLength && active) {
      return (
        <span
          className="animate-pingy text-gray-600"
          key={word + letter + index}
        >
          {letter}
        </span>
      );
    } else {
      return (
        <span className="text-gray-700/50" key={word + letter + index}>
          {letter}
        </span>
      );
    }
  });
  if (lettersTyped && typedLength > word.length) {
    let i = word.length;
    while (i < typedLength) {
      letterList.push(
        <span className="text-red-600" key={lettersTyped[i] + i}>
          {lettersTyped[i]}
        </span>
      );
      i++;
    }
  }

  return <div className="text-gray-700/50">{letterList}</div>;
}

export default memo(Word);
