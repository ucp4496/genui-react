import { getOverrideAwareComponent } from "@/ComponentResolver";
import DefaultRecordCard from "@/components/default/RecordCard";
import DefaultSpacer from "@/components/default/Spacer";


export default function RecordList({ ctx }: { ctx?: any }) {
  const records = ctx?.state?.records ?? [];
  const RecordCard = getOverrideAwareComponent("RecordCard", DefaultRecordCard);
  const Spacer = getOverrideAwareComponent("Spacer", DefaultSpacer);

  return (
    <div className="w-full">
      <Spacer h={14} />
      <div className="space-y-6">
        {records.length === 0 ? (
          <div className="bg-gray-200 border border-gray-300 h-[70px] flex items-center justify-center text-xs text-yellow-400">
            No shipments logged.
          </div>
        ) : (
          records.map((r: any, idx: number) => (
            <RecordCard key={r.id ?? idx} record={r} index={idx} />
          ))
        )}
      </div>
    </div>
  );
}
