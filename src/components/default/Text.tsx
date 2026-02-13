import React from "react";

type TextProps = {
  text?: string;
};

export default function Text({ text }: TextProps) {
  return (
    <p className="text-gray-700">
      {text || "Default text goes here."}
    </p>
  );
}
