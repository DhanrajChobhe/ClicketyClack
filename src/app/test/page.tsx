import { Test } from "@/components/test";
import { getRandomList } from "@/utils/words";

export default function TestPage() {
  console.log("rerendering test page!!");
  let wordList = getRandomList(500);
  return (
    <main className="h-full flex justify-center">
      <Test wordList={wordList} />
    </main>
  );
}
