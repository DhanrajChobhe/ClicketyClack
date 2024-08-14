import { Test } from "@/components/test";
import { colors } from "@/utils/colours";
import { getRandomList } from "@/utils/words";

//colours :  "bg-red-500","bg-pink-700","bg-pink-800","bg-fuchsia-950"

export default function TestPage() {
  console.log("rerendering test page!!");
  let wordList = getRandomList(500);
  return (
    <main className="h-full flex justify-center">
      <Test wordList={wordList} />
    </main>
  );
}
