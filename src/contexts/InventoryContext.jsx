import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import localInventory from '../data/inventory.json';
import { useProductAPI } from '../hooks/useProductAPI';

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState([]);
  const [dataSource, setDataSource] = useState('loading'); // 'loading' | 'api' | 'local'
  const { fetchAllProducts, loading: apiLoading, error: apiError } = useProductAPI();

  // On mount: fetch real-time data from DummyJSON API
  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      const apiProducts = await fetchAllProducts(50);
      if (!cancelled) {
        if (apiProducts && apiProducts.length > 0) {
          // Merge: API products first, then local curated products
          setInventory([...apiProducts, ...localInventory]);
          setDataSource('api');
        } else {
          // Fallback to local inventory
          setInventory(localInventory);
          setDataSource('local');
        }
      }
    }

    loadProducts();
    return () => { cancelled = true; };
  }, []);

  const refreshFromAPI = useCallback(async () => {
    const apiProducts = await fetchAllProducts(50);
    if (apiProducts && apiProducts.length > 0) {
      // Keep manually added products (those without 'api-' prefix or 'source' field)
      const manualProducts = inventory.filter(p => p.source !== 'api' && !p.id.startsWith('api-'));
      setInventory([...apiProducts, ...manualProducts]);
      setDataSource('api');
    }
  }, [inventory, fetchAllProducts]);

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: `custom-${Date.now()}`,
      aiMatchScore: Math.floor(Math.random() * 30) + 70,
      source: 'manual',
    };
    setInventory(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const removeProduct = (productId) => {
    setInventory(prev => prev.filter(item => item.id !== productId));
  };

  const getProductById = (id) => {
    return inventory.find(item => item.id === id) || null;
  };

  const allTags = [...new Set(inventory.flatMap(item => item.tags || []))];
  const allCategories = [...new Set(inventory.map(item => item.category).filter(Boolean))];

  return (
    <InventoryContext.Provider value={{
      inventory,
      addProduct,
      removeProduct,
      getProductById,
      allTags,
      allCategories,
      dataSource,
      apiLoading,
      apiError,
      refreshFromAPI,
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
