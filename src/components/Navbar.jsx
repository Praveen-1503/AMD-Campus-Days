import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles, Settings } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4">
      <div className="mx-auto max-w-7xl">
        <nav className="glass-nav rounded-full px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between border border-white/5">
          <Link to="/" className="flex items-center gap-2 group">
            <Sparkles className="text-primary group-hover:text-primary_dim transition-colors" size={22} />
            <span className="font-display font-bold text-lg sm:text-xl tracking-wide uppercase">Vibeshop</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-on_surface font-body font-medium text-sm">
            <Link to="/" className="hover:text-primary transition-colors">Feed</Link>
            <Link to="/manage" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <Settings size={14} /> Manage
            </Link>
            <Link to="/archive" className="hover:text-primary transition-colors">Archive</Link>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Mobile manage link */}
            <Link to="/manage" className="md:hidden text-on_surface hover:text-primary transition-colors">
              <Settings size={20} />
            </Link>
            <Link to="/checkout" className="relative group">
              <ShoppingBag size={22} className="group-hover:text-primary transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold text-on_primary animate-in">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
