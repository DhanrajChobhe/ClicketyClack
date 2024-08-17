"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ScrollingWords from "@/components/scrollingWords";

const timeButtonClasses = "p-2 hover:text-pink-700 hover:font-bold";
const selectedTimeButtonClass = "p-2 text-white bg-pink-700 font-bold rounded";

export default function Home() {
  const timeConfig = [15, 30, 60, 120];
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState(null);

  const handleStartTest = () => {
    if (selectedTime) {
      router.push(`/test?time=${selectedTime}`);
    } else {
      alert("Please select a time before starting the test.");
    }
  };

  const handleTimeSelect = (time: any) => {
    setSelectedTime(time);
  };

  return (
    <main className="h-full w-full flex justify-center items-center">
      <section className="w-full flex flex-col justify-center items-center gap-4">
        <header className="h-14 border rounded border-black mt-10 flex items-center p-2">
          <h2 className="mx-3 text-pink-700 text-lg font-semibold">Time</h2>
          <div className="h-full w-[2px] bg-black mx-3 rounded"></div>
          <nav className="mx-3">
            {timeConfig.map((time) => (
              <button
                key={"testtime" + time}
                className={
                  selectedTime === time
                    ? selectedTimeButtonClass
                    : timeButtonClasses
                }
                onClick={() => handleTimeSelect(time)}
              >
                {time}
              </button>
            ))}
          </nav>
        </header>

        <button
          className="p-3 mb-24 border border-black hover:bg-pink-700 hover:border-pink-700 hover:text-white"
          onClick={handleStartTest}
        >
          START TEST
        </button>
        <ScrollingWords />
      </section>
    </main>
  );
}
