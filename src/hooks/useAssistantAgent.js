import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let ai = null;
try {
  if (apiKey) ai = new GoogleGenAI({ apiKey });
} catch (e) {
  console.error("GenAI Init failed:", e);
}

const INVENTORY_TAGS = [
  "Avant-Garde", "Layering", "Winter", "Accessories", "Minimalist",
  "Utility", "Streetwear", "Technical", "Dark-Core", "Core", "Breathable"
];

function extractJSON(text) {
  try { return JSON.parse(text); } catch {}
  const codeMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeMatch) {
    try { return JSON.parse(codeMatch[1].trim()); } catch {}
  }
  const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (jsonMatch) {
    try { return JSON.parse(jsonMatch[1]); } catch {}
  }
  return null;
}

export function useAssistantAgent() {
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const analyzeStyle = async (userPrompt, weatherContext = null) => {
    if (!ai) {
      setError("Add VITE_GEMINI_API_KEY to your .env.local file and restart.");
      return null;
    }

    setAnalyzing(true);
    setError(null);

    const weatherInfo = weatherContext ? `\nWeather: ${weatherContext.city}, ${weatherContext.temperature}°C, ${weatherContext.conditionText}.` : '';
    const systemInstruction = `You are a retail AI stylist. Parse the query and map to tags: [${INVENTORY_TAGS.join(', ')}]. ${weatherInfo} Respond ONLY with JSON like {"tags": ["Winter", "Minimalist"]}.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userPrompt,
        config: { systemInstruction, responseMimeType: "application/json", temperature: 0.2 }
      });
      const text = typeof response.text === 'function' ? response.text() : response.text;
      const parsed = extractJSON(text) || { tags: [] };
      let matchedTags = Array.isArray(parsed) ? parsed : (parsed.tags || []);
      
      matchedTags = matchedTags.filter(tag => INVENTORY_TAGS.some(it => it.toLowerCase() === tag.toLowerCase()))
        .map(tag => INVENTORY_TAGS.find(it => it.toLowerCase() === tag.toLowerCase()));

      setAnalyzing(false);
      return matchedTags.length > 0 ? matchedTags : null;
    } catch (err) {
      setError(`AI Error: ${err.message}`);
      setAnalyzing(false);
      return null;
    }
  };

  const getWeatherRecommendations = async (weatherData, inventory) => {
    if (!ai || !weatherData) return null;

    const products = inventory.slice(0, 20).map(p => ({ id: p.id, name: p.name, category: p.category, weather: p.weather }));
    const systemInstruction = `You are a weather retail AI. Weather: ${weatherData.city}, ${weatherData.temperature}°C, ${weatherData.conditionText}. Catalog: ${JSON.stringify(products)}. Respond ONLY with JSON: {"recommendedIds": ["id1", "id2"], "blurb": "short reason"}`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Recommend products.",
        config: { systemInstruction, responseMimeType: "application/json", temperature: 0.5 }
      });
      const text = typeof response.text === 'function' ? response.text() : response.text;
      return extractJSON(text);
    } catch (err) {
      return null;
    }
  };

  return { analyzeStyle, getWeatherRecommendations, analyzing, error };
}
