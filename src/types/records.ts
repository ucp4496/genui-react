export type Category = "Furniture" | "Electronics" | "Tools & Hardware" | "Perishables";
export type Priority = "Low" | "Medium" | "High";

export type RecordItem = {
  id: string;
  name: string; // "Sales Item 1"
  description: string;
  notes: string;
  checked: boolean;
  category: Category;
  priority: Priority;
  createdAt: number;
};

export type DraftRecord = Omit<RecordItem, "id" | "createdAt">;

export type ExperimentConfig = {
  titlePrefix: string;

  required: {
    checked: boolean;
    category: Category;
    priority: Priority;
    notesExact: string;
  };

  // Intentionally wrong defaults
  defaults: {
    checked: boolean;
    category: Category;
    priority: Priority;
  };
};
