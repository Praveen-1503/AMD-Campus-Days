import { useState, useEffect } from 'react';

const WEATHER_MAP = {
  'Clear': 'clear',
  'Sunny': 'clear',
  'Partly cloudy': 'clouds',
  'Cloudy': 'clouds',
  'Overcast': 'clouds',
  'Mist': 'clouds',
  'Fog': 'clouds',
  'Light rain': 'rain',
  'Moderate rain': 'rain',
  'Heavy rain': 'rain',
  'Patchy rain possible': 'rain',
  'Light drizzle': 'rain',
  'Thundery outbreaks possible': 'rain',
  'Light snow': 'snow',
  'Moderate snow': 'snow',
  'Heavy snow': 'snow',
  'Blizzard': 'snow',
  'Patchy snow possible': 'snow',
};

function mapCondition(conditionText) {
  return WEATHER_MAP[conditionText] || 'clouds';
}

function tempToFeeling(tempC) {
  if (tempC <= 5) return 'cold';
  if (tempC <= 15) return 'cold';
  if (tempC <= 25) return 'warm';
  return 'hot';
}

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchWeather(latitude, longitude) {
      try {
        const res = await fetch(`https://wttr.in/?format=j1`);
        if (!res.ok) throw new Error('Weather API unavailable');

        const data = await res.json();
        const current = data.current_condition?.[0];
        const area = data.nearest_area?.[0];

        if (!current || cancelled) return;

        const tempC = parseInt(current.temp_C, 10);
        const conditionText = current.weatherDesc?.[0]?.value || 'Clouds';
        const condition = mapCondition(conditionText);
        const feeling = tempToFeeling(tempC);
        const city = area?.areaName?.[0]?.value || 'Unknown';
        const country = area?.country?.[0]?.value || '';
        const windKmph = parseInt(current.windspeedKmph, 10);

        setWeather({
          temperature: tempC,
          condition,
          conditionText,
          feeling,
          city,
          country,
          windKmph,
          humidity: current.humidity,
          weatherTags: [...new Set([condition, feeling, windKmph > 25 ? 'wind' : null].filter(Boolean))],
        });
      } catch (err) {
        if (!cancelled) setError('Could not fetch weather data.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    // Try geolocation for more accurate results, but fallback to IP-based
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(null, null), // fallback to IP-based
        { timeout: 5000 }
      );
    } else {
      fetchWeather(null, null);
    }

    return () => { cancelled = true; };
  }, []);

  return { weather, loading, error };
}
