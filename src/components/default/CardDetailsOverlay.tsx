import { getOverrideAwareComponent } from "@/ComponentResolver";
import DefaultFieldRow from "@/components/default/FieldRow";
import DefaultSpacer from "@/components/default/Spacer";

export default function CardDetailsOverlay({ ctx }: { ctx?: any }) {
  const card = ctx?.state?.selectedCard ?? null;
  const draft = ctx?.state?.selectedCardDraft ?? null;

  const FieldRow = getOverrideAwareComponent("FieldRow", DefaultFieldRow);
  const Spacer = getOverrideAwareComponent("Spacer", DefaultSpacer);

  if (!card || !draft) return null;

  const update = (field: keyof typeof draft, value: string) => {
    ctx?.actions?.setSelectedCardDraftField?.(field, value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-[760px] rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-yellow-500">Card Details</h2>
        </div>

        <div className="space-y-5">
          <FieldRow label="Title:">
            <input
              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm"
              value={draft.title ?? ""}
              onChange={(e) => update("title", e.target.value)}
            />
          </FieldRow>

          <FieldRow label="Description:" alignTop>
            <textarea
              className="min-h-[140px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={draft.description ?? ""}
              onChange={(e) => update("description", e.target.value)}
            />
          </FieldRow>

          <FieldRow label="Keywords:">
            <input
              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm"
              value={draft.keywordsText ?? ""}
              onChange={(e) => update("keywordsText", e.target.value)}
              placeholder="design, urgent, backend"
            />
          </FieldRow>

          <FieldRow label="Priority:">
            <select
              className="h-10 w-[180px] rounded-lg border border-gray-300 px-3 text-sm"
              value={draft.priority ?? "Medium"}
              onChange={(e) => update("priority", e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </FieldRow>

          <FieldRow label="Points:">
            <input
              className="h-10 w-[180px] rounded-lg border border-gray-300 px-3 text-sm"
              value={draft.points ?? ""}
              onChange={(e) => update("points", e.target.value)}
              inputMode="numeric"
            />
          </FieldRow>
        </div>

        <Spacer h={28} />

        <div className="flex items-center justify-between">
          <button
            onClick={() => ctx?.actions?.deleteSelectedCard?.()}
            className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 hover:bg-red-100"
          >
            Delete Card
          </button>

          <button
            onClick={() => ctx?.actions?.saveSelectedCardDetails?.()}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}