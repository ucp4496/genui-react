import React from "react";

type TextProps = {
  text?: string;
};

export default function Text({ text }: TextProps) {
  return <p className="text-yellow-400">{text || "Default text goes here."}</p>;
}