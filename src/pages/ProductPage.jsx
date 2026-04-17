import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Zap, Sparkles, ShoppingBag, CloudRain, Sun, CloudSnow, Cloud, Wind } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useInventory } from '../contexts/InventoryContext';
import { useWeather } from '../hooks/useWeather';

const WEATHER_ICONS = {
  rain: CloudRain,
  clear: Sun,
  snow: CloudSnow,
  clouds: Cloud,
  wind: Wind,
};

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { getProductById } = useInventory();
  const { weather } = useWeather();

  const product = getProductById(id);

  if (!product) {
    return (
      <div className="p-20 text-center">
        <p className="font-display text-3xl text-secondary mb-4">Product not found.</p>
        <Link to="/" className="text-primary font-body font-bold hover:underline">Back to Feed</Link>
      </div>
    );
  }

  // Check weather suitability
  const isWeatherSuitable = weather && product.weather?.some(w => weather.weatherTags?.includes(w));
  const WeatherIcon = weather ? (WEATHER_ICONS[weather.condition] || Cloud) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-32">
      <Link to="/" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors font-body text-sm font-bold tracking-widest uppercase mb-8 sm:mb-12">
        <ChevronLeft size={16} /> Back to Feed
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

        {/* Editorial Image Block */}
        <div className="lg:col-span-7 bg-surface_container_lowest rounded-xl overflow-hidden relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover min-h-[40vh] lg:min-h-[60vh]"
          />
          {/* Weather suitability badge on image */}
          {weather && (
            <div className={`absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border text-sm font-body font-bold ${
              isWeatherSuitable
                ? 'bg-green-500/20 border-green-500/50 text-green-400'
                : 'bg-orange-500/20 border-orange-500/50 text-orange-400'
            }`}>
              {WeatherIcon && <WeatherIcon size={16} />}
              {isWeatherSuitable
                ? `Perfect for today's ${weather.temperature}°C`
                : `Consider for ${product.weather?.join(', ')} weather`
              }
            </div>
          )}
        </div>

        {/* Data & Actions Block */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-secondary font-body font-bold tracking-widest uppercase text-sm">{product.brand}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-outline_variant"></span>
            <span className="text-xs font-body text-outline uppercase tracking-wider">{product.category}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold leading-tight mb-4">
            {product.name}
          </h1>

          {/* Tags */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {product.tags.map(tag => (
              <span key={tag} className="text-xs font-body uppercase tracking-wider text-outline bg-surface_container px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-8 border-b border-white/5 gap-4">
            <span className="text-3xl font-display font-medium">${product.price.toFixed(2)}</span>

            {/* Style Gauge */}
            <div className="flex items-center gap-3 bg-surface_container p-3 rounded-full border border-white/5 shadow-neon">
              <Sparkles className="text-primary flex-shrink-0" size={18} />
              <div className="flex flex-col">
                <span className="text-[10px] font-body text-secondary uppercase tracking-widest">AI Confidence</span>
                <span className="text-sm font-bold text-on_surface">{product.aiMatchScore}% Synergy</span>
              </div>
              <div className="w-10 h-10 relative rounded-full flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-full h-full absolute -rotate-90">
                  <path className="text-surface_container_highest" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-primary" strokeWidth="3" strokeDasharray={`${product.aiMatchScore}, 100`} stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <Zap size={12} className="text-primary z-10" />
              </div>
            </div>
          </div>

          <p className="text-secondary font-body leading-relaxed mb-8 text-base sm:text-lg">
            {product.description}
          </p>

          {/* Weather tags */}
          {product.weather && (
            <div className="mb-8">
              <p className="font-body text-xs uppercase tracking-widest text-outline mb-2 font-bold">Best In</p>
              <div className="flex gap-2 flex-wrap">
                {product.weather.map(w => (
                  <span key={w} className={`text-xs font-body uppercase tracking-wider px-3 py-1 rounded-full border ${
                    weather?.weatherTags?.includes(w)
                      ? 'bg-green-500/20 border-green-500/30 text-green-400'
                      : 'bg-surface_container border-white/5 text-secondary'
                  }`}>
                    {w}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button onClick={() => addToCart(product)} className="btn-primary w-full flex justify-center items-center gap-3">
              <ShoppingBag size={20} /> Add to Vault
            </button>
            <button className="btn-secondary w-full">
              Request Virtual Fitting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
