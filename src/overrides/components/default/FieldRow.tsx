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
    <div className={`flex gap-6 ${alignTop ? "items-start" : "items-center"}`}>
      <div className={`w-[110px] text-xs ${labelClassName ?? "text-black"}`}>
        {label}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
