"use client";
import React, { useState, useEffect, memo } from "react";
import { Archivo_Narrow } from "next/font/google";
import { TESTTIME } from "@/utils/constants";

const archivo = Archivo_Narrow({
  weight: "400",
  subsets: ["latin"],
  style: "normal",
});

function Timer({ timeLeft }: { timeLeft: number }) {
  console.log("rerendering timer " + timeLeft);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime =
    minutes > 0
      ? `${minutes.toString().padStart(2, "0")} : ${seconds
          .toString()
          .padStart(2, "0")}`
      : seconds;

  let percentage = (timeLeft / TESTTIME) * 100;

  return (
    <>
      <div className={archivo.className}>{formattedTime}</div>
      <div
        className={`h-[2px] bg-red-700 self-start`}
        style={{ width: `${percentage}%` }}
      ></div>
    </>
  );
}

export default memo(Timer);
