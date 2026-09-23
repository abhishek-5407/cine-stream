import React, { useState, useEffect } from "react";
import { Key, X, Save, CheckCircle2 } from "lucide-react";
import { getApiKey } from "../services/tmdbApi";
import { getGeminiApiKey } from "../services/geminiService";

export default function ApiKeyModal({ isOpen, onClose, onKeysSaved }) {
  const [tmdbKey, setTmdbKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTmdbKey(getApiKey());
      setGeminiKey(getGeminiApiKey());
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("cinestream_tmdb_key", tmdbKey.trim());
    localStorage.setItem("cinestream_gemini_key", geminiKey.trim());
    setSaved(true);
    setTimeout(() => {
      onKeysSaved && onKeysSaved();
      onClose();
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container mood-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="mood-title-row">
          <Key size={24} color="#e50914" />
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>API Credentials Settings</h2>
        </div>
        <p className="mood-subtitle">
          Configure your TMDB API Read Access Key or Google Gemini API Key live in session.
        </p>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--text-muted)" }}>
              TMDB API Key (v3 Key / Bearer Read Token)
            </label>
            <input
              type="password"
              className="search-input"
              style={{ borderRadius: "var(--radius-md)", paddingLeft: "1rem" }}
              placeholder="e.g. 8d39f... or Bearer eyJ..."
              value={tmdbKey}
              onChange={(e) => setTmdbKey(e.target.value)}
            />
            <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)", marginTop: "0.25rem", display: "block" }}>
              Get free key at developer.themoviedb.org (If omitted, fallback dataset is used).
            </span>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--text-muted)" }}>
              Google Gemini API Key (Optional for AI Mood Matcher)
            </label>
            <input
              type="password"
              className="search-input"
              style={{ borderRadius: "var(--radius-md)", paddingLeft: "1rem" }}
              placeholder="e.g. AIzaSy..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
            />
          </div>

          {saved && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#4ade80", fontSize: "0.9rem", marginBottom: "1rem" }}>
              <CheckCircle2 size={18} /> API keys updated successfully! Reloading stream...
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} /> Save & Apply Keys
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
