import { useState, useEffect } from 'react';
import { Sparkles, Loader2, X, RefreshCw, Database, Wifi } from 'lucide-react';
import { useAssistantAgent } from '../hooks/useAssistantAgent';
import { useInventory } from '../contexts/InventoryContext';
import { useWeather } from '../hooks/useWeather';
import WeatherBanner from '../components/WeatherBanner';
import ProductCard from '../components/ProductCard';

const CATEGORY_ALL = 'All';

export default function DiscoveryFeed() {
  const { inventory, allCategories, dataSource, apiLoading, refreshFromAPI } = useInventory();
  const { weather } = useWeather();
  const { analyzeStyle, analyzing, error } = useAssistantAgent();

  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [activeCategory, setActiveCategory] = useState(CATEGORY_ALL);

  // Filter based on activeTags and activeCategory
  useEffect(() => {
    let filtered = inventory;

    if (activeCategory !== CATEGORY_ALL) {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    if (activeTags.length > 0) {
      filtered = filtered.filter(item =>
        item.tags?.some(tag => activeTags.includes(tag))
      );
    }

    setItems(filtered);
  }, [activeTags, activeCategory, inventory]);

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const matchedTags = await analyzeStyle(query, weather);
    if (matchedTags && Array.isArray(matchedTags)) {
      setActiveTags(matchedTags);
    }
  };

  const clearFilter = () => {
    setActiveTags([]);
    setQuery("");
    setActiveCategory(CATEGORY_ALL);
  };

  const categories = [CATEGORY_ALL, ...allCategories];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Data Source Indicator */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {dataSource === 'api' ? (
            <span className="flex items-center gap-2 text-xs font-body text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
              <Wifi size={12} /> Live Data · {inventory.length} products
            </span>
          ) : dataSource === 'local' ? (
            <span className="flex items-center gap-2 text-xs font-body text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full">
              <Database size={12} /> Local Catalog · {inventory.length} products
            </span>
          ) : (
            <span className="flex items-center gap-2 text-xs font-body text-secondary">
              <Loader2 size={12} className="animate-spin" /> Loading catalog...
            </span>
          )}
        </div>
        <button
          onClick={refreshFromAPI}
          disabled={apiLoading}
          className="flex items-center gap-2 text-xs font-body text-secondary hover:text-primary transition-colors disabled:opacity-50"
          title="Refresh live data"
        >
          <RefreshCw size={14} className={apiLoading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Weather Banner */}
      <WeatherBanner />

      <header className="mb-10">
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight uppercase tracking-tighter text-on_surface mb-4 md:w-2/3">
          Curated for the Synthetic Atelier.
        </h1>
        <p className="font-body text-secondary text-base sm:text-lg md:w-1/2 mb-8">
          AI-powered retail intelligence analyzing {inventory.length} real-time products. Describe your vibe below — weather context included automatically.
        </p>

        {/* AI Prompt Bar */}
        <form onSubmit={handlePromptSubmit} className="relative group max-w-2xl mb-8">
          <div className={`absolute -inset-1 rounded-full opacity-0 group-focus-within:opacity-100 transition duration-1000 blur-sm ` + (analyzing ? "bg-primary animate-pulse opacity-50" : "bg-primary/30")}></div>
          <div className="relative flex items-center bg-surface_container_highest rounded-full px-4 sm:px-6 py-3 sm:py-4 border border-white/5">
            {analyzing ? (
              <Loader2 className="animate-spin text-primary mr-3 sm:mr-4 flex-shrink-0" size={22} />
            ) : (
              <Sparkles className="text-primary mr-3 sm:mr-4 group-focus-within:animate-pulse flex-shrink-0" size={22} />
            )}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. I need something technical and minimal for today's weather..."
              className="bg-transparent flex-grow outline-none text-on_surface font-body text-sm sm:text-base placeholder:text-outline caret-primary"
              disabled={analyzing}
            />
          </div>
        </form>
        {error && <p className="text-[#ff6e84] text-sm mt-2 font-body">{error}</p>}

        {/* Active Tags Display */}
        {activeTags.length > 0 && (
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <span className="text-xs text-secondary font-body uppercase tracking-widest">Active Matrix:</span>
            {activeTags.map(tag => (
              <span key={tag} className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-bold font-body uppercase border border-primary/30 shadow-neon">
                {tag}
              </span>
            ))}
            <button onClick={clearFilter} className="text-secondary hover:text-[#ff6e84] transition-colors p-1 rounded-full hover:bg-surface_container">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Category Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-body font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-primary text-on_primary shadow-neon'
                  : 'bg-surface_container_high text-secondary hover:text-on_surface border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {apiLoading && inventory.length === 0 ? (
        <div className="py-24 text-center">
          <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
          <p className="font-display text-2xl text-secondary">Fetching live product data...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-3xl sm:text-4xl text-outline_variant font-bold uppercase tracking-widest mb-4">
            No matches found.
          </p>
          <button onClick={clearFilter} className="text-primary font-body font-bold text-sm uppercase tracking-wider hover:underline">
            Reset all filters
          </button>
        </div>
      ) : (
        <>
          <p className="font-body text-xs text-outline mb-6 uppercase tracking-widest">{items.length} Product{items.length !== 1 ? 's' : ''} Found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ProductCard key={item.id} item={item} activeTags={activeTags} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
