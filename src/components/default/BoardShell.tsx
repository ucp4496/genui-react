import { getOverrideAwareComponent } from "@/ComponentResolver";

import DefaultBoardView from "@/components/default/BoardView";
import DefaultAddColumnOverlay from "@/components/default/AddColumnOverlay";
import DefaultAddCardOverlay from "@/components/default/AddCardOverlay";
import DefaultCardDetailsOverlay from "@/components/default/CardDetailsOverlay";

export default function BoardShell({ ctx }: { ctx?: any }) {
  const addColumnOpen = ctx?.state?.addColumnOpen ?? false;
  const addCardOpen = ctx?.state?.addCardOpen ?? false;
  const selectedCard = ctx?.state?.selectedCard ?? null;

  const BoardView = getOverrideAwareComponent("BoardView", DefaultBoardView);
  const AddColumnOverlay = getOverrideAwareComponent(
    "AddColumnOverlay",
    DefaultAddColumnOverlay
  );
  const AddCardOverlay = getOverrideAwareComponent(
    "AddCardOverlay",
    DefaultAddCardOverlay
  );
  const CardDetailsOverlay = getOverrideAwareComponent(
    "CardDetailsOverlay",
    DefaultCardDetailsOverlay
  );

  return (
    <div className="min-h-screen w-screen bg-gray-100">
      <div className="mx-auto max-w-[1500px] px-6 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-yellow-400">Task Management Board</h1>
            <p className="mt-1 text-sm text-yellow-300">
              A task management board for all your tasks
            </p>
          </div>
        </div>

        <BoardView ctx={ctx} />
      </div>

      {addColumnOpen && <AddColumnOverlay ctx={ctx} />}
      {addCardOpen && <AddCardOverlay ctx={ctx} />}
      {selectedCard && <CardDetailsOverlay ctx={ctx} />}
    </div>
  );
}