import axios from "axios";

/**
 * Get Gemini API Key from localStorage or environment
 */
export function getGeminiApiKey() {
  const localKey = localStorage.getItem("cinestream_gemini_key");
  if (localKey && localKey.trim()) {
    return localKey.trim();
  }
  return import.meta.env.VITE_GEMINI_API_KEY || "";
}

/**
 * Intelligent client-side heuristic backup when Gemini API key is unconfigured
 */
const MOOD_HEURISTIC_MAP = [
  { keywords: ["action", "thrill", "fight", "explosive", "adrenaline"], title: "Gladiator II" },
  { keywords: ["sad", "cry", "emotional", "heartbreak", "tear"], title: "Interstellar" },
  { keywords: ["happy", "feel good", "joy", "laugh", "fun", "cheer"], title: "The Wild Robot" },
  { keywords: ["scary", "horror", "creepy", "spooky", "dark", "fear"], title: "Terrifier 3" },
  { keywords: ["sci-fi", "space", "future", "alien", "robot", "mind"], title: "Sonic the Hedgehog 3" },
  { keywords: ["romance", "love", "date", "relationship", "heart"], title: "The Notebook" },
  { keywords: ["animation", "cartoon", "family", "kids"], title: "Inside Out 2" }
];

/**
 * Formulate prompt and query Gemini REST API for a single movie recommendation based on mood
 * 
 * Prompt Protocol specified by Sprint 8 guidelines:
 * "Suggest ONE movie based on this mood: [User String]. Return ONLY the movie title as a plaintext string."
 */
export async function matchMoodToMovie(userMoodString) {
  if (!userMoodString || !userMoodString.trim()) {
    throw new Error("Please enter how you are feeling or what mood you want to match!");
  }

  const sanitizedInput = userMoodString.trim();
  const apiKey = getGeminiApiKey();

  // If Gemini API key is present, query Google Gemini REST API v1beta
  if (apiKey) {
    try {
      const prompt = `Suggest ONE movie based on this mood: ${sanitizedInput}. Return ONLY the movie title as a plaintext string. Do not include quotes, markdown formatting, or any extra text.`;

      // Use gemini-3.6-flash / gemini-flash-latest
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const candidateText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (candidateText && candidateText.trim()) {
        // Clean up quotes, newlines, and trailing periods
        const cleanedTitle = candidateText
          .replace(/["'**_`]/g, "")
          .replace(/^Title:\s*/i, "")
          .trim();
        return cleanedTitle;
      }
    } catch (err) {
      console.warn("Gemini API direct call failed, falling back to smart mood parser:", err);
    }
  }

  // Fallback intelligent client-side mood matcher
  const lower = sanitizedInput.toLowerCase();
  for (const item of MOOD_HEURISTIC_MAP) {
    if (item.keywords.some(k => lower.includes(k))) {
      return item.title;
    }
  }

  // Generic fallback movie title
  return "Inception";
}
