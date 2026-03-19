import { getOverrideAwareComponent } from "@/ComponentResolver";
import DefaultBoardCard from "@/components/default/BoardCard";

export default function BoardColumn({
  column,
  ctx,
}: {
  column: any;
  ctx?: any;
}) {
  const cardsById = ctx?.state?.board?.cardsById ?? {};
  const BoardCard = getOverrideAwareComponent("BoardCard", DefaultBoardCard);

  const cards = (column?.cardIds ?? [])
    .map((id: string) => cardsById[id])
    .filter(Boolean);

  return (
    <div className="min-w-[280px] max-w-[280px] rounded-2xl bg-green-100 p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-yellow-500">{column?.title ?? "Untitled"}</div>
        <div className="rounded-full bg-gray-300 px-2 py-1 text-[11px] text-yellow-400">
          {cards.length}
        </div>
      </div>

      <div className="space-y-3">
        {cards.map((card: any) => (
          <BoardCard
            key={card.id}
            card={card}
            onClick={() => ctx?.actions?.openCardDetails?.(card.id)}
          />
        ))}

        <button
          onClick={() => ctx?.actions?.openAddCard?.(column.id)}
          className="w-full rounded-xl border border-dashed border-gray-400 bg-white/60 px-3 py-3 text-left text-sm text-yellow-300 hover:bg-white"
        >
          + Add card
        </button>
      </div>
    </div>
  );
}