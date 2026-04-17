import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DiscoveryFeed from './pages/DiscoveryFeed';
import ProductPage from './pages/ProductPage';
import SmartCheckout from './pages/SmartCheckout';
import ManageInventory from './pages/ManageInventory';
import Archive from './pages/Archive';
import { CartProvider } from './contexts/CartContext';
import { InventoryProvider } from './contexts/InventoryContext';

function App() {
  return (
    <InventoryProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-surface text-on_surface selection:bg-primary/30">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<DiscoveryFeed />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/checkout" element={<SmartCheckout />} />
              <Route path="/manage" element={<ManageInventory />} />
              <Route path="/archive" element={<Archive />} />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </InventoryProvider>
  );
}

export default App;
