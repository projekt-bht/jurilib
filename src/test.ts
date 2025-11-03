import React from "react";
export default function Example() {
  let x: number;
  x = 2;
  const y = 24;
  if (x === y) x = y;
  const log = function () {
    console.log("debug");
  };
  x && log();
  const t = "200";

  const u = "hier eine neue Vairable";
}
