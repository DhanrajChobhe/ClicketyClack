"use client";
import { getRandomList } from "@/utils/words";
import { useRouter } from "next/navigation";

//colours :  "bg-red-500","bg-pink-700","bg-pink-800","bg-fuchsia-950"

export default function Home() {
  const router = useRouter();
  const handleStartTest = () => {
    router.push("/test");
  };
  return (
    <main className="h-full flex justify-center">
      <div>
        <button className="p-3 border border-black" onClick={handleStartTest}>
          START TEST
        </button>
      </div>
    </main>
  );
}
