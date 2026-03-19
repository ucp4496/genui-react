import { useMemo, useState } from "react";
import Renderer, { type RenderCtx, type UIComponent } from "./Render";
import type {
  BoardColumn,
  BoardState,
  CardItem,
  DraftCard,
  DraftColumn,
} from "./types/board";

import { getOverrideAwareModule } from "@/ComponentResolver";
import {
  defaultCardDraft as fallbackDefaultCardDraft,
  defaultColumnDraft as fallbackDefaultColumnDraft,
} from "@/components/default/BoardDefaults";

const boardDefaults = getOverrideAwareModule("BoardDefaults", {
  defaultCardDraft: fallbackDefaultCardDraft,
  defaultColumnDraft: fallbackDefaultColumnDraft,
});

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function parseKeywords(input: string): string[] {
  return input
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

function parsePoints(input: string): number | null {
  if (!input.trim()) return null;
  const n = Number(input);
  return Number.isFinite(n) ? n : null;
}

export default function DataEntryContainer() {
  const [board, setBoard] = useState<BoardState>({
    columns: [
      {
        id: makeId(),
        title: "To Do",
        cardIds: [],
      },
      {
        id: makeId(),
        title: "Doing",
        cardIds: [],
      },
      {
        id: makeId(),
        title: "Done",
        cardIds: [],
      },
    ],
    cardsById: {},
  });

  const [addColumnOpen, setAddColumnOpen] = useState(false);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedCardDraft, setSelectedCardDraft] = useState<DraftCard | null>(null);

  const [columnDraft, setColumnDraft] = useState<DraftColumn>(
    () => ({ ...boardDefaults.defaultColumnDraft })
  );

  const [cardDraft, setCardDraft] = useState<DraftCard>(
    () => ({ ...boardDefaults.defaultCardDraft })
  );

  const actions = useMemo(() => {
    return {
      openAddColumn: () => {
        setColumnDraft({ ...boardDefaults.defaultColumnDraft });
        setAddColumnOpen(true);
      },

      closeAddColumn: () => {
        setAddColumnOpen(false);
      },

      setColumnDraftField: (field: keyof DraftColumn, value: string) => {
        setColumnDraft((prev) => ({ ...prev, [field]: value }));
      },

      saveColumn: () => {
        const title = columnDraft.title.trim();
        if (!title) return;

        const newColumn: BoardColumn = {
          id: makeId(),
          title,
          cardIds: [],
        };

        setBoard((prev) => ({
          ...prev,
          columns: [...prev.columns, newColumn],
        }));

        setColumnDraft({ ...boardDefaults.defaultColumnDraft });
        setAddColumnOpen(false);
      },

      openAddCard: (columnId: string) => {
        setSelectedColumnId(columnId);
        setCardDraft({ ...boardDefaults.defaultCardDraft });
        setAddCardOpen(true);
      },

      closeAddCard: () => {
        setAddCardOpen(false);
        setSelectedColumnId(null);
      },

      setCardDraftField: (field: keyof DraftCard, value: string) => {
        setCardDraft((prev) => ({ ...prev, [field]: value }));
      },

      saveCard: () => {
        if (!selectedColumnId) return;

        const title = cardDraft.title.trim();
        if (!title) return;

        const newCardId = makeId();

        const newCard: CardItem = {
          id: newCardId,
          title,
          description: cardDraft.description.trim(),
          keywords: parseKeywords(cardDraft.keywordsText),
          priority: cardDraft.priority,
          points: parsePoints(cardDraft.points),
          createdAt: Date.now(),
        };

        setBoard((prev) => ({
          columns: prev.columns.map((column) =>
            column.id === selectedColumnId
              ? { ...column, cardIds: [...column.cardIds, newCardId] }
              : column
          ),
          cardsById: {
            ...prev.cardsById,
            [newCardId]: newCard,
          },
        }));

        setCardDraft({ ...boardDefaults.defaultCardDraft });
        setAddCardOpen(false);
        setSelectedColumnId(null);
      },

      openCardDetails: (cardId: string) => {
        const card = board.cardsById[cardId];
        if (!card) return;

        setSelectedCardId(cardId);
        setSelectedCardDraft({
          title: card.title ?? "",
          description: card.description ?? "",
          keywordsText: Array.isArray(card.keywords) ? card.keywords.join(", ") : "",
          priority: card.priority ?? "Medium",
          points: card.points == null ? "" : String(card.points),
        });
      },

      closeCardDetails: () => {
        setSelectedCardId(null);
        setSelectedCardDraft(null);
      },

      setSelectedCardDraftField: (
        field: keyof DraftCard,
        value: string
      ) => {
        setSelectedCardDraft((prev) => {
          if (!prev) return prev;
          return { ...prev, [field]: value };
        });
      },

      saveSelectedCardDetails: () => {
        if (!selectedCardId || !selectedCardDraft) return;

        setBoard((prev) => {
          const existing = prev.cardsById[selectedCardId];
          if (!existing) return prev;

          const updated: CardItem = {
            ...existing,
            title: selectedCardDraft.title.trim(),
            description: selectedCardDraft.description.trim(),
            keywords: parseKeywords(selectedCardDraft.keywordsText),
            priority: selectedCardDraft.priority,
            points: parsePoints(selectedCardDraft.points),
          };

          return {
            ...prev,
            cardsById: {
              ...prev.cardsById,
              [selectedCardId]: updated,
            },
          };
        });

        setSelectedCardId(null);
        setSelectedCardDraft(null);
      },

      deleteSelectedCard: () => {
        if (!selectedCardId) return;

        setBoard((prev) => {
          const nextCardsById = { ...prev.cardsById };
          delete nextCardsById[selectedCardId];

          return {
            columns: prev.columns.map((column) => ({
              ...column,
              cardIds: column.cardIds.filter((id) => id !== selectedCardId),
            })),
            cardsById: nextCardsById,
          };
        });

        setSelectedCardId(null);
        setSelectedCardDraft(null);
      },
    };
  }, [
    board,
    boardDefaults.defaultCardDraft,
    boardDefaults.defaultColumnDraft,
    cardDraft,
    columnDraft.title,
    selectedCardDraft,
    selectedCardId,
    selectedColumnId,
  ]);

  const selectedCard = selectedCardId ? board.cardsById[selectedCardId] ?? null : null;

  const state = useMemo(() => {
    return {
      board,
      addColumnOpen,
      addCardOpen,
      selectedColumnId,
      selectedCardId,
      selectedCard,
      selectedCardDraft,
      columnDraft,
      cardDraft,
    };
  }, [
    board,
    addColumnOpen,
    addCardOpen,
    selectedColumnId,
    selectedCardId,
    selectedCard,
    selectedCardDraft,
    columnDraft,
    cardDraft,
  ]);

  const ctx: RenderCtx = useMemo(() => ({ state, actions }), [state, actions]);

  const schema: UIComponent[] = [
    {
      type: "BoardShell",
      props: {},
    },
  ];

  return <Renderer schema={schema} ctx={ctx} />;
}