'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  barcode?: string;
  price: number;
  minStock: number;
  currentStock: number;
  companyId: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // TODO: Replace with actual API call
      const mockProducts = [
        {
          id: '1',
          name: 'Produit A',
          category: 'electronics',
          barcode: '123456789',
          price: 99.99,
          minStock: 10,
          currentStock: 25,
          companyId: '1',
        },
        // Add more mock products
      ];
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (data: Omit<Product, 'id'>) => {
    try {
      // TODO: Replace with actual API call
      const newProduct = {
        id: Math.random().toString(),
        ...data,
      };
      setProducts([...products, newProduct]);
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    try {
      // TODO: Replace with actual API call
      setProducts(products.map((p) => (p.id === id ? { ...p, ...data } : p)));
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
