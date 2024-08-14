import { Test } from "@/components/test";
import { colors } from "@/utils/colours";
import { getRandomList } from "@/utils/words";

//colours :  "bg-red-500","bg-pink-700","bg-pink-800","bg-fuchsia-950"

export default function Home() {
  let wordList = getRandomList(60);
  return (
    <main className={`container h-screen ${colors[0]}`}>
      <Test wordList={wordList} />
    </main>
  );
}
