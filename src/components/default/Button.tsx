import React from "react";

type ButtonProps = {
  text?: string;
  onClick?: () => void;

  // Macro/Action support
  action?: string;
  args?: any[];

  ctx?: any;
};

export default function Button({ text, onClick, action, args, ctx }: ButtonProps) {
  const handleClick = () => {
    if (onClick) return onClick();

    if (action && ctx?.actions?.[action]) {
      return ctx.actions[action](...(args ?? []));
    }

    console.warn("Button clicked but no handler/action found", { action });
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {text || "Default Button"}
    </button>
  );
}
