import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ProductCard({ item, activeTags = [] }) {
  return (
    <Link
      to={`/product/${item.id}`}
      className="group relative block rounded-xl overflow-hidden bg-surface_container pb-6 transition-all duration-300 hover:bg-surface_container_high hover:-translate-y-1"
    >
      <div className="aspect-[3/4] overflow-hidden mb-6 relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
          {item.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className={`backdrop-blur-md text-xs font-semibold px-3 py-1.5 rounded-full border uppercase tracking-widest font-body transition-colors ${
                activeTags.includes(tag)
                  ? 'border-primary text-primary shadow-neon bg-primary/20'
                  : 'border-white/10 text-on_surface bg-surface_variant/80'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="absolute top-4 right-4 bg-primary/20 backdrop-blur-md border border-primary/50 text-primary font-bold px-3 py-1.5 rounded-full text-xs shadow-neon">
          {item.aiMatchScore}% Match
        </div>
      </div>

      <div className="px-6 flex items-end justify-between">
        <div>
          <p className="text-secondary font-body text-xs font-semibold tracking-wider uppercase mb-1">{item.brand}</p>
          <h3 className="text-lg font-display font-bold text-on_surface leading-tight">{item.name}</h3>
          <p className="text-xs font-body text-outline mt-1">{item.category}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-body font-bold text-primary">${item.price.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-6 mx-6 p-4 rounded-lg bg-surface_container_highest flex justify-between items-center group-hover:bg-primary transition-colors">
        <span className="font-body font-bold text-sm tracking-wider text-on_surface group-hover:text-on_primary">EXPLORE</span>
        <ArrowRight className="text-outline group-hover:text-on_primary transition-colors" size={20} />
      </div>
    </Link>
  );
}
