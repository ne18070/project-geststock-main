'use client';

import { useState, useEffect } from 'react';

export function useOrdersList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // TODO: Replace with actual API call
        const mockOrders = [
          {
            id: '1',
            client: 'Client A',
            products: [
              { id: '1', name: 'Produit 1', quantity: 2, unitPrice: 100 },
              { id: '2', name: 'Produit 2', quantity: 1, unitPrice: 150 },
            ],
          },
          // Add more mock orders
        ];
        setOrders(mockOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return {
    orders,
    loading,
  };
}
