'use client';

import { useState } from 'react';
import { Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProductsTable from '@/app/components/products/ProductsTable';
import AddProductModal from '@/app/components/products/AddProductModal';
import { useProducts } from '@/app/hooks/useProducts';

export default function ProduitsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { products, loading, addProduct, updateProduct, deleteProduct } =
    useProducts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Produits</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Nouveau produit
        </Button>
      </div>

      <Card>
        <ProductsTable
          products={products}
          loading={loading}
          onUpdate={updateProduct}
          onDelete={deleteProduct}
        />
      </Card>

      <AddProductModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addProduct}
      />
    </div>
  );
}
