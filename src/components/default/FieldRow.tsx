import React from "react";

export default function FieldRow({
  label,
  children,
  alignTop,
  labelClassName,
}: {
  label: string;
  children: React.ReactNode;
  alignTop?: boolean;
  labelClassName?: string;
}) {
  return (
    <div className={`flex gap-4 ${alignTop ? "items-start" : "items-center"}`}>
      <div className={`w-[110px] pt-1 text-sm ${labelClassName ?? "text-yellow-300"}`}>
        {label}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}