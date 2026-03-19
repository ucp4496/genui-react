import { getOverrideAwareComponent } from "@/ComponentResolver";
import DefaultFieldRow from "@/components/default/FieldRow";
import DefaultSpacer from "@/components/default/Spacer";

export default function AddCardOverlay({ ctx }: { ctx?: any }) {
  const draft = ctx?.state?.cardDraft ?? {};
  const selectedColumnId = ctx?.state?.selectedColumnId ?? null;
  const columns = ctx?.state?.board?.columns ?? [];
  const selectedColumn = columns.find((c: any) => c.id === selectedColumnId);

  const FieldRow = getOverrideAwareComponent("FieldRow", DefaultFieldRow);
  const Spacer = getOverrideAwareComponent("Spacer", DefaultSpacer);

  const setField = (field: string, value: string) =>
    ctx?.actions?.setCardDraftField?.(field, value);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-[700px] h-[500px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-yellow-400">Add Card</h2>
        </div>

        <p className="text-sm text-yellow-300">
          Adding to: <span className="font-medium text-yellow-300">{selectedColumn?.title ?? "Unknown column"}</span>
        </p>

        <Spacer h={60} />

        <div className="space-y-5">
          <FieldRow label="Title:">
            <input
              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm"
              value={draft.title ?? ""}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="Card title"
            />
          </FieldRow>

          <Spacer h={20} />

          <FieldRow label="Description:" alignTop>
            <textarea
              className="min-h-[120px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={draft.description ?? ""}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Describe this task or item..."
            />
          </FieldRow>

          <Spacer h={40} />

          <FieldRow label="Keywords:">
            <input
              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm"
              value={draft.keywordsText ?? ""}
              onChange={(e) => setField("keywordsText", e.target.value)}
              placeholder="design, urgent, backend"
            />
          </FieldRow>

          <Spacer h={20} />

          <FieldRow label="Priority:">
            <select
              className="h-10 w-[180px] rounded-lg border border-gray-300 px-3 text-sm"
              value={draft.priority ?? "Medium"}
              onChange={(e) => setField("priority", e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </FieldRow>

          <Spacer h={2} />

          <FieldRow label="Points:">
            <input
              className="h-10 w-[180px] rounded-lg border border-gray-300 px-3 text-sm"
              value={draft.points ?? ""}
              onChange={(e) => setField("points", e.target.value)}
              placeholder="e.g. 3"
              inputMode="numeric"
            />
          </FieldRow>
        </div>

        <Spacer h={28} />

        <div className="flex justify-end gap-3">
          <button
            onClick={() => ctx?.actions?.closeAddCard?.()}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-yellow-100 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={() => ctx?.actions?.saveCard?.()}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-yellow-500 hover:bg-yellow-400"
          >
            Save Card
          </button>
        </div>
      </div>
    </div>
  );
}