import React, { useMemo, useState } from "react";

type OverlayProps = {
  onSubmit: (instructions: string) => Promise<void>;
  onClose: () => void;
};

export default function Overlay({ onSubmit, onClose }: OverlayProps) {
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [resetting, setResetting] = useState(false);
  const [resetCooldownUntil, setResetCooldownUntil] = useState<number>(0);
  const [resetMsg, setResetMsg] = useState<string>("");

  const resetDisabled = useMemo(() => {
    return resetting || loading || Date.now() < resetCooldownUntil;
  }, [resetting, loading, resetCooldownUntil]);

  const handleSubmit = async () => {
    if (!instructions.trim() || loading) return;

    setLoading(true);
    setError(false);

    try {
      await onSubmit(instructions);
      setInstructions("");
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (resetDisabled) return;

    // 1s cooldown from the moment user clicks
    setResetCooldownUntil(Date.now() + 1000);
    setResetting(true);
    setError(false);
    setResetMsg("");

    try {
      const res = await fetch("http://localhost:3001/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Reset failed");

      const data = await res.json();
      const moved = typeof data.movedCount === "number" ? data.movedCount : undefined;
      const folder = typeof data.historyDir === "string" ? data.historyDir : undefined;

      setResetMsg(
        moved === 0
          ? "No changes to reset"
          : `Reset complete`
      );

      // IMPORTANT: if your UI is already showing overrides without a full reload,
      // you may still want to refresh the page so the app re-imports/rehydrates:
      // window.location.reload();
    } catch (e) {
      setError(true);
      setResetMsg("Reset failed. Please notify the study team.");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg border-l flex flex-col p-4 z-50">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold">🪄 GenUI Override</h2>
        <button
          onClick={onClose}
          disabled={loading || resetting}
          className="text-yellow-500 hover:text-black text-lg disabled:opacity-50"
          aria-label="Close GenUI"
          title="Close"
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="mb-2 text-red-600 text-sm font-medium">
          An error occurred. Please notify the study team.
        </div>
      )}

      {resetMsg && (
        <div className="mb-2 text-yellow-400 text-xs">
          {resetMsg}
        </div>
      )}

      <textarea
        className="border p-2 flex-1 mb-2 resize-none"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        placeholder="e.g. Make the header purple and the button rounded"
        disabled={loading || resetting}
      />

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={loading || resetting}
          className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? "Applying..." : "Submit"}
        </button>

        <button
          onClick={handleReset}
          disabled={resetDisabled}
          className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
          title="Move all overrides into a timestamped history folder"
        >
          {resetting && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {resetting ? "Resetting..." : "Reset"}
        </button>
      </div>
    </div>
  );
}