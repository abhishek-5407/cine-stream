import React, { useState } from "react";
import { Sparkles, X, Loader2, ArrowRight } from "lucide-react";
import { matchMoodToMovie } from "../services/geminiService";

export default function MoodMatcherModal({ isOpen, onClose, onApplyAiMovie }) {
  const [moodInput, setMoodInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const PRESET_MOODS = [
    "I'm feeling down and need an inspiring feel-good story",
    "Craving a mind-bending sci-fi thriller with huge plot twists",
    "Late night adrenaline action movie with epic fights",
    "Romantic comedy for a cozy weekend evening"
  ];

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    if (!moodInput.trim()) {
      setError("Please describe your mood or select a preset prompt above.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      // Call Gemini AI service
      const recommendedTitle = await matchMoodToMovie(moodInput);
      setLoading(false);
      onClose();
      // Pass the recommended title to parent search engine
      onApplyAiMovie(recommendedTitle, moodInput);
    } catch (err) {
      console.error("AI Mood Matcher Error:", err);
      setError(err.message || "Failed to generate AI recommendation. Try again.");
      setLoading(false);
    }
  };

  const handlePresetClick = (presetText) => {
    setMoodInput(presetText);
    setError("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container mood-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="mood-title-row">
          <Sparkles size={26} color="#7c3aed" />
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#ffffff" }}>
            AI Mood Matcher
          </h2>
        </div>
        <p className="mood-subtitle">
          Describe how you feel or what vibe you're looking for. Gemini AI will match your mood to a movie title.
        </p>

        <div className="mood-pills-label">Quick Mood Presets:</div>
        <div className="mood-preset-grid">
          {PRESET_MOODS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              className="mood-preset-btn"
              onClick={() => handlePresetClick(preset)}
            >
              ✨ {preset}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            className="mood-textarea"
            placeholder="e.g. I am feeling nostalgic and want an 80s synthwave adventure movie..."
            value={moodInput}
            onChange={(e) => setMoodInput(e.target.value)}
            disabled={loading}
          />

          {error && (
            <p style={{ color: "#f87171", fontSize: "0.85rem", marginBottom: "1rem" }}>
              {error}
            </p>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-ai" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={18} className="spinner" /> Analyzing Mood...
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Match My Mood <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
