import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CloudRain, Sun, CloudSnow, Cloud, Wind, Loader2, MapPin, Sparkles } from 'lucide-react';
import { useWeather } from '../hooks/useWeather';
import { useAssistantAgent } from '../hooks/useAssistantAgent';
import { useInventory } from '../contexts/InventoryContext';

const WEATHER_ICONS = {
  rain: CloudRain,
  clear: Sun,
  snow: CloudSnow,
  clouds: Cloud,
  wind: Wind,
};

export default function WeatherBanner() {
  const { weather, loading: weatherLoading, error: weatherError } = useWeather();
  const { getWeatherRecommendations } = useAssistantAgent();
  const { inventory } = useInventory();
  const [recommendations, setRecommendations] = useState(null);
  const [recLoading, setRecLoading] = useState(false);

  useEffect(() => {
    if (!weather || !inventory.length) return;

    let cancelled = false;

    async function fetchRecs() {
      setRecLoading(true);
      const recs = await getWeatherRecommendations(weather, inventory);
      if (!cancelled && recs) {
        setRecommendations(recs);
      }
      if (!cancelled) setRecLoading(false);
    }

    fetchRecs();
    return () => { cancelled = true; };
  }, [weather, inventory.length]);

  if (weatherLoading) {
    return (
      <div className="mb-12 p-8 rounded-xl bg-surface_container_high/60 backdrop-blur-[20px] border border-white/5 flex items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={24} />
        <span className="font-body text-secondary">Scanning atmospheric conditions...</span>
      </div>
    );
  }

  if (weatherError || !weather) {
    return null; // Graceful degradation
  }

  const WeatherIcon = WEATHER_ICONS[weather.condition] || Cloud;
  const recommendedProducts = recommendations?.recommendedIds
    ? inventory.filter(p => recommendations.recommendedIds.includes(p.id))
    : [];

  return (
    <div className="mb-12 rounded-xl bg-surface_variant/60 backdrop-blur-[20px] border border-white/5 overflow-hidden">
      {/* Weather Info Bar */}
      <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-surface_container flex items-center justify-center shadow-neon">
            <WeatherIcon className="text-primary" size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={14} className="text-primary" />
              <span className="font-body text-sm text-secondary">{weather.city}, {weather.country}</span>
            </div>
            <p className="font-display text-2xl font-bold">
              {weather.temperature}°C
              <span className="text-secondary font-body text-sm font-normal ml-3">{weather.conditionText}</span>
            </p>
          </div>
        </div>

        {recommendations?.blurb && (
          <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-full px-5 py-2.5 shadow-neon">
            <Sparkles className="text-primary flex-shrink-0" size={16} />
            <p className="font-body text-sm text-primary font-medium">{recommendations.blurb}</p>
          </div>
        )}
      </div>

      {/* Recommended Items Row */}
      {recommendedProducts.length > 0 && (
        <div className="px-6 pb-6">
          <p className="font-body text-xs uppercase tracking-widest text-secondary mb-4 font-bold">Weather-Curated For You</p>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {recommendedProducts.map(item => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="flex-shrink-0 w-48 group"
              >
                <div className="h-32 rounded-lg overflow-hidden mb-3 bg-surface_container_highest">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                </div>
                <p className="font-body text-sm font-bold text-on_surface truncate">{item.name}</p>
                <p className="font-body text-xs text-secondary">{item.brand} · ${item.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {recLoading && !recommendations && (
        <div className="px-6 pb-6 flex items-center gap-3">
          <Loader2 className="animate-spin text-primary" size={16} />
          <span className="font-body text-xs text-secondary">AI curating your weather wardrobe...</span>
        </div>
      )}
    </div>
  );
}
