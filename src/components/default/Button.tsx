import React from "react";

type ButtonProps = {
  text?: string;
  onClick?: () => void;
  action?: string;
  args?: any[];
  ctx?: any;
  className?: string;
};

export default function Button({
  text,
  onClick,
  action,
  args,
  ctx,
  className,
}: ButtonProps) {
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
      className={
        className ??
        "rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      }
    >
      {text || "Default Button"}
    </button>
  );
}