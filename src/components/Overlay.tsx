import React, { useState } from "react";

type OverlayProps = {
  onSubmit: (instructions: string) => Promise<void>;
  onClose: () => void;
};

export default function Overlay({ onSubmit, onClose }: OverlayProps) {
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

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

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg border-l flex flex-col p-4 z-50">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold">🪄 GenUI Override</h2>
        <button
          onClick={onClose}
          disabled={loading}
          className="text-gray-500 hover:text-black text-lg disabled:opacity-50"
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

      <textarea
        className="border p-2 flex-1 mb-2 resize-none"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        placeholder="e.g. Make the header purple and the button rounded"
        disabled={loading}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {loading ? "Applying..." : "Submit"}
      </button>
    </div>
  );
}
