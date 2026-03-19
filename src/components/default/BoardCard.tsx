export default function BoardCard({
  card,
  onClick,
}: {
  card: any;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-gray-200 bg-white p-3 text-left shadow-sm transition hover:shadow-md"
    >
      <div className="text-sm font-semibold text-yellow-500">
        {card?.title || "Untitled card"}
      </div>

      {!!card?.description && (
        <div className="mt-2 line-clamp-3 text-xs text-yellow-300">
          {card.description}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-gray-100 px-2 py-1 text-[11px] text-yellow-400">
          Priority: {card?.priority ?? "Medium"}
        </span>

        <span className="rounded-full bg-gray-100 px-2 py-1 text-[11px] text-yellow-400">
          Points: {card?.points ?? "—"}
        </span>

        {Array.isArray(card?.keywords) && card.keywords.length > 0 && (
          <span className="rounded-full bg-gray-100 px-2 py-1 text-[11px] text-yellow-400">
            {card.keywords.length} keyword{card.keywords.length === 1 ? "" : "s"}
          </span>
        )}
      </div>
    </button>
  );
}