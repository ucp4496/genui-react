export type Priority = "Low" | "Medium" | "High";

export type CardItem = {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  priority: Priority;
  points: number | null;
  createdAt: number;
};

export type BoardColumn = {
  id: string;
  title: string;
  cardIds: string[];
};

export type BoardState = {
  columns: BoardColumn[];
  cardsById: Record<string, CardItem>;
};

export type DraftCard = {
  title: string;
  description: string;
  keywordsText: string;
  priority: Priority;
  points: string;
};

export type DraftColumn = {
  title: string;
};