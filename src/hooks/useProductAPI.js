import { useState, useCallback } from 'react';

const API_BASE = 'https://dummyjson.com/products';

// Map DummyJSON categories to our weather/style system
const CATEGORY_WEATHER_MAP = {
  'tops': ['warm', 'clear', 'clouds'],
  'womens-dresses': ['warm', 'clear'],
  'mens-shirts': ['warm', 'clear', 'clouds'],
  'womens-bags': ['clear', 'clouds', 'rain'],
  'womens-shoes': ['clear', 'clouds'],
  'mens-shoes': ['clear', 'clouds'],
  'womens-jewellery': ['clear', 'clouds', 'warm'],
  'mens-watches': ['clear', 'clouds', 'cold', 'warm'],
  'womens-watches': ['clear', 'clouds', 'cold', 'warm'],
  'sunglasses': ['clear', 'warm', 'hot'],
  'beauty': ['clear', 'warm'],
  'fragrances': ['clear', 'warm', 'clouds'],
  'skin-care': ['clear', 'warm', 'hot'],
  'furniture': ['clear', 'clouds'],
  'home-decoration': ['clear', 'clouds'],
  'groceries': ['clear', 'clouds', 'rain', 'cold'],
  'kitchen-accessories': ['clear', 'clouds'],
  'laptops': ['clear', 'clouds', 'rain', 'cold'],
  'smartphones': ['clear', 'clouds', 'rain', 'cold', 'warm'],
  'tablets': ['clear', 'clouds', 'rain', 'cold'],
  'mobile-accessories': ['clear', 'clouds'],
  'sports-accessories': ['clear', 'warm', 'hot'],
  'vehicle': ['clear', 'clouds'],
  'motorcycle': ['clear', 'warm'],
};

const CATEGORY_TAGS_MAP = {
  'tops': ['Core', 'Breathable'],
  'womens-dresses': ['Avant-Garde', 'Core'],
  'mens-shirts': ['Minimalist', 'Core'],
  'womens-bags': ['Accessories', 'Utility'],
  'womens-shoes': ['Accessories', 'Core'],
  'mens-shoes': ['Streetwear', 'Core'],
  'womens-jewellery': ['Accessories', 'Minimalist'],
  'mens-watches': ['Accessories', 'Technical'],
  'womens-watches': ['Accessories', 'Minimalist'],
  'sunglasses': ['Accessories', 'Minimalist'],
  'beauty': ['Core', 'Minimalist'],
  'fragrances': ['Minimalist', 'Core'],
  'skin-care': ['Core', 'Minimalist'],
  'furniture': ['Utility', 'Core'],
  'home-decoration': ['Avant-Garde', 'Minimalist'],
  'groceries': ['Utility', 'Core'],
  'kitchen-accessories': ['Utility', 'Core'],
  'laptops': ['Technical', 'Utility'],
  'smartphones': ['Technical', 'Utility'],
  'tablets': ['Technical', 'Utility'],
  'mobile-accessories': ['Technical', 'Accessories'],
  'sports-accessories': ['Technical', 'Breathable'],
  'vehicle': ['Technical', 'Utility'],
  'motorcycle': ['Technical', 'Dark-Core'],
};

const DISPLAY_CATEGORY_MAP = {
  'tops': 'Tops',
  'womens-dresses': 'Dresses',
  'mens-shirts': 'Shirts',
  'womens-bags': 'Bags',
  'womens-shoes': 'Footwear',
  'mens-shoes': 'Footwear',
  'womens-jewellery': 'Jewellery',
  'mens-watches': 'Watches',
  'womens-watches': 'Watches',
  'sunglasses': 'Eyewear',
  'beauty': 'Beauty',
  'fragrances': 'Fragrances',
  'skin-care': 'Skin Care',
  'furniture': 'Furniture',
  'home-decoration': 'Home Decor',
  'groceries': 'Groceries',
  'kitchen-accessories': 'Kitchen',
  'laptops': 'Electronics',
  'smartphones': 'Electronics',
  'tablets': 'Electronics',
  'mobile-accessories': 'Electronics',
  'sports-accessories': 'Sports',
  'vehicle': 'Vehicles',
  'motorcycle': 'Vehicles',
};

function transformProduct(apiProduct) {
  const cat = apiProduct.category || '';
  return {
    id: `api-${apiProduct.id}`,
    name: apiProduct.title,
    brand: apiProduct.brand || 'Unknown',
    price: apiProduct.price,
    category: DISPLAY_CATEGORY_MAP[cat] || cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    image: apiProduct.thumbnail || apiProduct.images?.[0] || '',
    images: apiProduct.images || [],
    tags: CATEGORY_TAGS_MAP[cat] || ['Core'],
    weather: CATEGORY_WEATHER_MAP[cat] || ['clear', 'clouds'],
    aiMatchScore: Math.floor((apiProduct.rating || 3) * 20),
    description: apiProduct.description || '',
    stock: apiProduct.stock ?? 0,
    rating: apiProduct.rating || 0,
    discountPercentage: apiProduct.discountPercentage || 0,
    returnPolicy: apiProduct.returnPolicy || '',
    reviews: apiProduct.reviews || [],
    source: 'api',
  };
}

export function useProductAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllProducts = useCallback(async (limit = 50) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}?limit=${limit}&select=id,title,description,price,discountPercentage,rating,stock,brand,category,thumbnail,images,tags,reviews,returnPolicy`);
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();
      setLoading(false);
      return data.products.map(transformProduct);
    } catch (err) {
      console.error('Product API Error:', err);
      setError('Failed to fetch live product data. Falling back to local catalog.');
      setLoading(false);
      return null;
    }
  }, []);

  const searchProducts = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&limit=30`);
      if (!res.ok) throw new Error(`Search API Error: ${res.status}`);
      const data = await res.json();
      setLoading(false);
      return data.products.map(transformProduct);
    } catch (err) {
      console.error('Search API Error:', err);
      setError('Search failed.');
      setLoading(false);
      return null;
    }
  }, []);

  const fetchByCategory = useCallback(async (category) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/category/${encodeURIComponent(category)}`);
      if (!res.ok) throw new Error(`Category API Error: ${res.status}`);
      const data = await res.json();
      setLoading(false);
      return data.products.map(transformProduct);
    } catch (err) {
      console.error('Category API Error:', err);
      setError('Category fetch failed.');
      setLoading(false);
      return null;
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/category-list`);
      if (!res.ok) throw new Error('Categories fetch failed');
      return await res.json();
    } catch {
      return [];
    }
  }, []);

  return { fetchAllProducts, searchProducts, fetchByCategory, fetchCategories, loading, error };
}
