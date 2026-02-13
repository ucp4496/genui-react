import type { DraftRecord } from "@/types/records";

export const draftDefaults: DraftRecord = {
  name: "",
  description: "",
  notes: "",
  checked: false,         // or false
  category: "Furniture",
  priority: "Low",
};
