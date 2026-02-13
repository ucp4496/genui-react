import React from "react";

type HeaderProps = {
  text?: string;
};

export default function Header({ text }: HeaderProps) {
  return (
    <h1 className="text-2xl font-bold">
      {text || "Default Header"}
    </h1>
  );
}
