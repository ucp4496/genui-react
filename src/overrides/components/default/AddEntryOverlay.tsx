import { getOverrideAwareComponent } from "@/ComponentResolver";
import DefaultFieldRow from "@/components/default/FieldRow";
import DefaultSpacer from "@/components/default/Spacer";


export default function AddEntryOverlay({ ctx }: { ctx?: any }) {
  const draft = ctx?.state?.draft ?? {};
  const config = ctx?.state?.config;

  const FieldRow = getOverrideAwareComponent("FieldRow", DefaultFieldRow);
  const Spacer = getOverrideAwareComponent("Spacer", DefaultSpacer);

  const setField = (field: string, value: any) => ctx?.actions?.setDraftField?.(field, value);

  const tiny = "text-xs";
  const labelColor = "text-black";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30">
      {/* Narrow scroll container */}
      <div className="mt-8 w-[520px] max-w-[92vw] bg-gray-200 border border-gray-300 shadow-lg">
        <div className="relative">
          <div className="py-4">
            <h2 className={`text-xl font-semibold text-center ${labelColor}`}>
              Add Record
            </h2>
          </div>

          {/* Close X (optional, small) */}
          <button
            onClick={() => ctx?.actions?.closeAddEntry?.()}
            className={`absolute top-2 right-2 bg-gray-300 border border-gray-400 px-2 py-1 ${tiny}`}
          >
            X
          </button>

          {/* Scrollable hell form */}
          <div className="h-[640px] overflow-y-auto px-10 pb-10">
            <Spacer h={18} />

            <FieldRow label="Name:" labelClassName={labelColor}>
              <input
                className="w-full bg-gray-400/60 border border-gray-500 h-7 px-2 text-xs"
                value={draft.name ?? ""}
                onChange={(e) => setField("name", e.target.value)}
              />
            </FieldRow>

            <Spacer h={30} />

            <FieldRow label="Description:" labelClassName={labelColor} alignTop>
              <textarea
                className="w-full bg-gray-400/60 border border-gray-500 h-28 px-2 py-1 text-xs resize-none"
                value={draft.description ?? ""}
                onChange={(e) => setField("description", e.target.value)}
              />
            </FieldRow>

            <Spacer h={34} />

            <FieldRow label="Notes:" labelClassName={labelColor} alignTop>
              <textarea
                className="w-full bg-gray-400/60 border border-gray-500 h-44 px-2 py-1 text-xs resize-none"
                value={draft.notes ?? ""}
                onChange={(e) => setField("notes", e.target.value)}
              />
            </FieldRow>

            {/* Make them scroll to find this (evil) */}
            <Spacer h={44} />

            <FieldRow label="Checked:" labelClassName={labelColor}>
              <input
                type="checkbox"
                checked={!!draft.checked}
                onChange={(e) => setField("checked", e.target.checked)}
                className="h-4 w-4"
              />
            </FieldRow>

            <Spacer h={28} />

            <FieldRow label="Category:" labelClassName={labelColor}>
              <select
                className="w-[160px] bg-gray-400/60 border border-gray-500 h-7 px-2 text-xs"
                value={draft.category ?? config?.defaults?.category ?? "Other"}
                onChange={(e) => setField("category", e.target.value)}
              >
                <option value="Furniture">Furniture</option>
                <option value="Electronics">Electronics</option>
                <option value="Tools & Hardware">Tools & Hardware</option>
                <option value="Perishables">Perishables</option>
              </select>
            </FieldRow>

            <Spacer h={26} />

            <FieldRow label="Priority:" labelClassName={labelColor}>
              <select
                className="w-[160px] bg-gray-400/60 border border-gray-500 h-7 px-2 text-xs"
                value={draft.priority ?? config?.defaults?.priority ?? "Low"}
                onChange={(e) => setField("priority", e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </FieldRow>

            {/* Huge empty space before save, on purpose */}
            <Spacer h={72} />

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => ctx?.actions?.saveDraft?.()}
                className="bg-gray-400 border border-gray-600 px-10 py-2 text-sm"
              >
                Save
              </button>
            </div>

            <Spacer h={18} />

            {/* tiny hint text */}
            <div className={`text-center ${tiny} ${labelColor} opacity-60`}>
              Required note: “{config?.required?.notesExact}”
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
