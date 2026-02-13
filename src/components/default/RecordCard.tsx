export default function RecordCard({
  record,
  index,
}: {
  record: any;
  index: number;
}) {
  return (
    <div className="bg-gray-200 border border-gray-300 h-[90px] flex items-center justify-center">
      <div className="text-lg font-medium text-gray-900">
        {record?.name || `Item ${index + 1}`}
      </div>
    </div>
  );
}
