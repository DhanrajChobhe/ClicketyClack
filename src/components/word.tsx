import { Span } from "next/dist/trace";

interface WordProps {
  active: boolean;
  word: string;
  lettersTyped?: string;
}

export function Word({ active, word, lettersTyped }: WordProps) {
  let typedLength = lettersTyped?.length || 0;
  let letters = word.split("");
  let letterList = letters.map((letter, index) => {
    if (index <= typedLength - 1 && lettersTyped) {
      if (lettersTyped[index] === letter) {
        return <span className="text-fuchsia-950">{letter}</span>;
      } else {
        return <span className="text-red-600">{letter}</span>;
      }
    } else if (index == typedLength && active) {
      return <span className="animate-pingy text-gray-600">{letter}</span>;
    } else {
      return <span className="text-gray-700/50">{letter}</span>;
    }
  });

  return <div className="text-gray-700/50">{letterList}</div>;
}
