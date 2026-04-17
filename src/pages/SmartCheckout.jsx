import { ChevronRight, Lock, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export default function SmartCheckout() {
  const { cartItems, removeFromCart, cartTotal } = useCart();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pb-32">
      <div className="mb-12 flex items-center justify-between">
        <h1 className="text-4xl font-display font-bold">Secure Transfer</h1>
        <div className="flex items-center gap-2 text-secondary font-body text-sm font-medium">
          <Lock size={16} /> End-to-End Encrypted
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Checkout Form */}
        <div className="md:col-span-7 bg-surface_container card-xl">
          <h2 className="text-xl font-display font-bold mb-6">Identity & Routing</h2>
          
          <form className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-body text-secondary uppercase tracking-widest font-bold">Neural ID (Email)</label>
              <input type="email" placeholder="stylist@synthetic.io" className="input-field" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-body text-secondary uppercase tracking-widest font-bold">First Name</label>
                <input type="text" placeholder="John" className="input-field" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-body text-secondary uppercase tracking-widest font-bold">Last Name</label>
                <input type="text" placeholder="Doe" className="input-field" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-body text-secondary uppercase tracking-widest font-bold">Delivery Coordinates</label>
              <input type="text" placeholder="Sector 4, Neo-Tokyo" className="input-field" />
            </div>

            <div className="pt-6 border-t border-white/5">
              <h2 className="text-xl font-display font-bold mb-6">Payment Matrix</h2>
              <div className="flex flex-col gap-2 relative">
                <label className="text-xs font-body text-secondary uppercase tracking-widest font-bold">Card Number</label>
                <input type="text" placeholder="•••• •••• •••• 9012" className="input-field font-mono" />
                <div className="absolute right-4 top-[30px] flex gap-2">
                  <div className="w-8 h-5 bg-surface_variant rounded shadow-inner"></div>
                  <div className="w-8 h-5 bg-surface_variant rounded shadow-inner"></div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button type="button" className="btn-primary w-full flex justify-between items-center group disabled:opacity-50 disabled:cursor-not-allowed" disabled={cartItems.length === 0}>
                <span>Authorize ${cartTotal.toFixed(2)}</span>
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-5">
          <div className="sticky top-32 card-lg">
            <h3 className="font-display font-bold text-lg mb-6 uppercase tracking-wider">Acquisition Summary</h3>
            
            {cartItems.length === 0 ? (
              <p className="text-secondary font-body py-8 text-center border border-dashed border-white/10 rounded-lg">Your vault is currently empty.</p>
            ) : (
              <div className="flex flex-col gap-6 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center group relative">
                    <div className="w-16 h-16 bg-surface_container_highest rounded-lg flex-shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-body text-sm font-bold truncate max-w-[150px]">{item.name}</p>
                      <p className="font-body text-xs text-secondary mb-1">{item.brand} x {item.quantity}</p>
                    </div>
                    <div className="font-body font-bold text-right">
                      <p>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="absolute -right-2 p-2 text-outline hover:text-[#ff6e84] bg-surface_container opacity-0 group-hover:opacity-100 transition-opacity rounded-full z-10"
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-4 pt-6 border-t border-white/5 font-body text-sm">
              <div className="flex justify-between text-secondary">
                <span>Subtotal</span>
                <span className="text-on_surface">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>Atmospheric Trans-fee</span>
                <span className="text-on_surface text-primary">COMPLIMENTARY</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end mt-6 pt-6 border-t border-white/5">
              <span className="font-display font-bold text-lg">Total</span>
              <span className="font-display font-bold text-3xl text-primary drop-shadow-md">
                ${cartTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
