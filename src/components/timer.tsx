"use client";
import React, { useState, useEffect } from "react";

function Timer({ timeLeft }: { timeLeft: number }) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime =
    minutes > 0
      ? `${minutes.toString().padStart(2, "0")} : ${seconds
          .toString()
          .padStart(2, "0")}`
      : seconds;

  return <div className="font-bold">{formattedTime}</div>;
}

export default Timer;
