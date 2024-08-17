import { Test } from "@/components/test";
import { getRandomList } from "@/utils/words";

interface TestPageParams {
  searchParams?: {
    time: number;
  };
}

export default function TestPage({ searchParams }: TestPageParams) {
  const { time } = searchParams ?? { time: 60 };
  let wordList = getRandomList(500);
  return (
    <main className="h-full flex justify-center">
      <Test wordList={wordList} testTime={time} />
    </main>
  );
}
