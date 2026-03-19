import { getOverrideAwareComponent } from "@/ComponentResolver";
import DefaultFieldRow from "@/components/default/FieldRow";
import DefaultSpacer from "@/components/default/Spacer";

export default function AddColumnOverlay({ ctx }: { ctx?: any }) {
  const draft = ctx?.state?.columnDraft ?? { title: "" };

  const FieldRow = getOverrideAwareComponent("FieldRow", DefaultFieldRow);
  const Spacer = getOverrideAwareComponent("Spacer", DefaultSpacer);

  const setField = (field: string, value: string) =>
    ctx?.actions?.setColumnDraftField?.(field, value);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-[500px] rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-yellow-500">Add Column</h2>
        </div>

        <Spacer h={8} />

        <FieldRow label="Title:">
          <input
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm"
            value={draft.title ?? ""}
            onChange={(e) => setField("title", e.target.value)}
            placeholder="e.g. Backlog"
          />
        </FieldRow>

        <Spacer h={24} />

        <div className="flex justify-end gap-3">
          <button
            onClick={() => ctx?.actions?.closeAddColumn?.()}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-yellow-400 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={() => ctx?.actions?.saveColumn?.()}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-yellow-500 hover:bg-yellow-400"
          >
            Save Column
          </button>
        </div>
      </div>
    </div>
  );
}