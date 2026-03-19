import { getOverrideAwareComponent } from "@/ComponentResolver";
import DefaultBoardColumn from "@/components/default/BoardColumn";

export default function BoardView({ ctx }: { ctx?: any }) {
  const columns = ctx?.state?.board?.columns ?? [];
  const BoardColumn = getOverrideAwareComponent("BoardColumn", DefaultBoardColumn);

  return (
    <div className="flex items-start gap-4 overflow-x-auto pb-4">
      {columns.map((column: any) => (
        <BoardColumn key={column.id} column={column} ctx={ctx} />
      ))}

      <button
        onClick={() => ctx?.actions?.openAddColumn?.()}
        className="min-w-[280px] rounded-xl border border-dashed border-gray-300 bg-white/70 p-4 text-left text-sm text-yellow-300 shadow-sm hover:bg-white"
      >
        + Add another column
      </button>
    </div>
  );
}