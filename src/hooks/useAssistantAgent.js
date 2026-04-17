import { useState } from 'react';

const CEREBRAS_API_KEY = import.meta.env.VITE_CEREBRAS_API_KEY;
const CEREBRAS_ENDPOINT = 'https://api.cerebras.ai/v1/chat/completions';
const MODEL = 'llama3.1-8b';

const INVENTORY_TAGS = [
  "Avant-Garde", "Layering", "Winter", "Accessories", "Minimalist",
  "Utility", "Streetwear", "Technical", "Dark-Core", "Core", "Breathable"
];

async function callCerebras(systemPrompt, userMessage) {
  const res = await fetch(CEREBRAS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CEREBRAS_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.2,
      max_tokens: 512,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Cerebras API ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

// Extract JSON from a response that might contain markdown or extra text
function extractJSON(text) {
  // Try direct parse first
  try { return JSON.parse(text); } catch {}
  // Try to find JSON in markdown code blocks
  const codeMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeMatch) {
    try { return JSON.parse(codeMatch[1].trim()); } catch {}
  }
  // Try to find a JSON object or array anywhere
  const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (jsonMatch) {
    try { return JSON.parse(jsonMatch[1]); } catch {}
  }
  return null;
}

export function useAssistantAgent() {
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [lastResponse, setLastResponse] = useState(null);

  const analyzeStyle = async (userPrompt, weatherContext = null) => {
    if (!CEREBRAS_API_KEY) {
      setError("Add VITE_CEREBRAS_API_KEY to .env.local and restart the dev server.");
      return null;
    }

    setAnalyzing(true);
    setError(null);

    const weatherInfo = weatherContext
      ? `\nUser's current weather: ${weatherContext.city}, ${weatherContext.temperature}°C, ${weatherContext.conditionText}.`
      : '';

    const systemPrompt = `You are a retail AI stylist. Given the user's request, return ONLY a JSON object with a "tags" array containing matching tags from this list:
${INVENTORY_TAGS.join(', ')}
${weatherInfo}
Return ONLY JSON like: {"tags": ["Winter", "Layering"]}
No explanation, no markdown, just the JSON object.`;

    try {
      const raw = await callCerebras(systemPrompt, userPrompt);
      console.log("Cerebras raw response:", raw);
      setLastResponse(raw);

      const parsed = extractJSON(raw);
      console.log("Parsed:", parsed);

      if (!parsed) {
        setError("AI returned an unexpected format. Check browser console.");
        setAnalyzing(false);
        return null;
      }

      // Handle multiple possible response shapes
      let matchedTags = [];
      if (Array.isArray(parsed)) {
        matchedTags = parsed;
      } else if (parsed.tags && Array.isArray(parsed.tags)) {
        matchedTags = parsed.tags;
      } else {
        // Try to find any array value in the object
        const arrVal = Object.values(parsed).find(v => Array.isArray(v));
        if (arrVal) matchedTags = arrVal;
      }

      // Filter to only valid tags (case-insensitive match)
      matchedTags = matchedTags.filter(tag =>
        INVENTORY_TAGS.some(it => it.toLowerCase() === tag.toLowerCase())
      ).map(tag =>
        INVENTORY_TAGS.find(it => it.toLowerCase() === tag.toLowerCase())
      );

      console.log("Final matched tags:", matchedTags);
      setAnalyzing(false);
      return matchedTags.length > 0 ? matchedTags : null;
    } catch (err) {
      console.error("Cerebras Error:", err);
      setError(`AI error: ${err.message}`);
      setAnalyzing(false);
      return null;
    }
  };

  const getWeatherRecommendations = async (weatherData, inventory) => {
    if (!CEREBRAS_API_KEY || !weatherData) return null;

    const productSummaries = inventory.slice(0, 20).map(p => ({
      id: p.id, name: p.name, category: p.category, weather: p.weather, price: p.price,
    }));

    const systemPrompt = `You are a weather-aware retail AI. Current weather: ${weatherData.city} — ${weatherData.temperature}°C, ${weatherData.conditionText}.
Select the TOP 4 product IDs best suited for this weather. Return ONLY JSON:
{"recommendedIds": ["api-1", "api-5"], "blurb": "short reason"}

Products: ${JSON.stringify(productSummaries)}`;

    try {
      const raw = await callCerebras(systemPrompt, "Recommend products for today's weather.");
      const parsed = extractJSON(raw);
      return parsed;
    } catch (err) {
      console.error("Weather rec error:", err);
      return null;
    }
  };

  return { analyzeStyle, getWeatherRecommendations, analyzing, error, lastResponse };
}
