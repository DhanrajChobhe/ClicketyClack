import React from "react";

import { Fredoka } from "next/font/google";

const fredoka = Fredoka({ weight: "400", subsets: ["latin"] });

function Header() {
  return (
    <header className="flex justify-center w-full">
      <nav className="flex justify-center bg-red-400 lg:w-[70%] w-[90%]">
        <h1 className={fredoka.className + " text-4xl p-2"}>ClicketyClack</h1>
      </nav>
    </header>
  );
}

export default Header;
