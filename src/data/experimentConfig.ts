import type { ExperimentConfig } from "../types/records";

export const experimentConfig: ExperimentConfig = {
  titlePrefix: "",

  required: {
    checked: true,
    category: "Perishables",
    priority: "High",
    notesExact: "This item has been reviewed and entered into the system.",
  },

  defaults: {
    checked: false,     // wrong on purpose
    category: "Furniture",  // wrong on purpose
    priority: "Low",    // wrong on purpose
  },
};
