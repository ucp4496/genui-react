import { getOverrideAwareComponent } from "@/ComponentResolver";

import DefaultRecordList from "@/components/default/RecordList";
import DefaultAddEntryOverlay from "@/components/default/AddEntryOverlay";
import DefaultSpacer from "@/components/default/Spacer";



export default function DataEntryShell({ ctx }: { ctx?: any }) {
  const records = ctx?.state?.records ?? [];
  const overlayOpen = ctx?.state?.overlayOpen ?? false;

  const RecordList = getOverrideAwareComponent("RecordList", DefaultRecordList);
  const AddEntryOverlay = getOverrideAwareComponent("AddEntryOverlay", DefaultAddEntryOverlay);
  const Spacer = getOverrideAwareComponent("Spacer", DefaultSpacer);


  // UI hell palette
  const textColor = "text-black"; // changed from yellow-400 to black
  const tiny = "text-xs";

  return (
    <div className="min-h-screen w-screen bg-white flex items-start justify-center">
      <div className="w-[760px] max-w-[92vw] mt-10">
        <div className="relative bg-white">
          <h1 className={`text-3xl font-black text-center ${textColor}`}>
            Warehouse Shipments
          </h1>

          <Spacer h={24} />

          {/* List Area */}
          <div className="flex justify-center">
            <div className="w-[560px] max-w-[92vw]">
              <RecordList ctx={ctx} />
            </div>
          </div>

          <Spacer h={18} />

          {/* Add button (bottom center) */}
          <div className="flex justify-center">
            <button
              onClick={() => ctx?.actions?.openAddEntry?.()}
              className={`bg-gray-200 px-3 py-1 shadow-sm border border-gray-300 ${tiny}`}
            >
              Add New Shipment
            </button>
          </div>

          {/* Optional tiny correctness hint (you can hide this later) */}
          <Spacer h={10} />
          <div className={`text-center ${tiny} ${textColor} opacity-60`}>
            Shipments Logged: {records.length}
          </div>
        </div>
      </div>

      {overlayOpen && <AddEntryOverlay ctx={ctx} />}
    </div>
  );
}
