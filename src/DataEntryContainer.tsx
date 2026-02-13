import { useMemo, useState } from "react";
import Renderer, { type RenderCtx, type UIComponent } from "./Render";
import { experimentConfig } from "./data/experimentConfig";
import type { DraftRecord, RecordItem } from "./types/records";

import { getOverrideAwareModule } from "@/ComponentResolver";
import { draftDefaults as defaultDraftDefaults } from "@/components/default/DraftDefaults";

const draftDefaults = getOverrideAwareModule("DraftDefaults", defaultDraftDefaults);


function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function makeDraft(nextIndex: number): DraftRecord {
  return {
    ...draftDefaults,
    name: "",
  };
}

function isCorrect(r: RecordItem): boolean {
  return (
    r.checked === experimentConfig.required.checked &&
    r.category === experimentConfig.required.category &&
    r.priority === experimentConfig.required.priority &&
    r.notes.trim() === experimentConfig.required.notesExact.trim()
  );
}

export default function DataEntryContainer() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [overlayOpen, setOverlayOpen] = useState(false);

  const nextIndex = records.length + 1;

  const [draft, setDraft] = useState<DraftRecord>(() => makeDraft(nextIndex));

  // Keep draft title synced if they add records without opening overlay (simple safety)
  // (We only update name if it's still the old computed value.)
  const computedName = `${experimentConfig.titlePrefix}${nextIndex}`;
  if (!overlayOpen && draft.name !== computedName && draft.name.startsWith(experimentConfig.titlePrefix)) {
    // don't aggressively overwrite; leave it alone if user changed it
  }

  const actions = useMemo(() => {
    return {
      openAddEntry: () => {
        setDraft(makeDraft(records.length + 1));
        setOverlayOpen(true);
      },
      closeAddEntry: () => setOverlayOpen(false),

      setDraftField: (field: keyof DraftRecord, value: any) => {
        setDraft((prev) => ({ ...prev, [field]: value }));
      },

      pasteRequiredNote: () => {
        setDraft((prev) => ({ ...prev, notes: experimentConfig.required.notesExact }));
      },

      setRequiredDefaults: () => {
        // This is a "GenUI macro" candidate later (button could do this)
        setDraft((prev) => ({
          ...prev,
          checked: experimentConfig.required.checked,
          category: experimentConfig.required.category,
          priority: experimentConfig.required.priority,
        }));
      },

      saveDraft: () => {
        const newRecord: RecordItem = {
          id: makeId(),
          createdAt: Date.now(),
          ...draft,
        };

        setRecords((prev) => [...prev, newRecord]);
        setOverlayOpen(false);
      },

      resetAll: () => {
        setRecords([]);
        setOverlayOpen(false);
        setDraft(makeDraft(1));
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, records.length]);

  const state = useMemo(() => {
    return {
      records,
      overlayOpen,
      draft,
      nextIndex,
      config: experimentConfig,
      correctness: {
        total: records.length,
        correctCount: records.filter(isCorrect).length,
        allCorrect: records.length > 0 && records.every(isCorrect),
      },
    };
  }, [records, overlayOpen, draft, nextIndex]);

  const ctx: RenderCtx = useMemo(() => ({ state, actions }), [state, actions]);

  const schema: UIComponent[] = [
    {
      type: "DataEntryShell",
      props: {},
    },
  ];

  return <Renderer schema={schema} ctx={ctx} />;
}
