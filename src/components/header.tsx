import React from "react";

import { Amatic_SC } from "next/font/google";

const amatic = Amatic_SC({ weight: "700", subsets: ["latin"] });

function Header() {
  return (
    <header>
      <nav>
        <span className={amatic.className + " text-4xl"}>ClicketyClack</span>
      </nav>
    </header>
  );
}

export default Header;
