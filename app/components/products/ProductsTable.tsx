'use client';

import { Table, Button, Space, Tag, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatCurrency } from '@/app/lib/utils';
import { useState } from 'react';
import EditProductModal from './EditProductModal';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  minStock: number;
  currentStock: number;
  companyId: string;
}

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  onUpdate: (id: string, data: Partial<Product>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function ProductsTable({
  products,
  loading,
  onUpdate,
  onDelete,
}: ProductsTableProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const columns: ColumnsType<Product> = [
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Catégorie',
      dataIndex: 'category',
      key: 'category',
      filters: Array.from(new Set(products.map((p) => p.category))).map(
        (cat) => ({
          text: cat,
          value: cat,
        }),
      ),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Prix',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatCurrency(price),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Stock',
      dataIndex: 'currentStock',
      key: 'currentStock',
      render: (stock: number, record: Product) => (
        <Space direction="vertical" size="small">
          <span>{stock} unités</span>
          <Tag
            color={
              stock <= record.minStock
                ? 'error'
                : stock <= record.minStock * 1.5
                  ? 'warning'
                  : 'success'
            }
          >
            {stock <= record.minStock
              ? 'Stock critique'
              : stock <= record.minStock * 1.5
                ? 'Stock bas'
                : 'Stock normal'}
          </Tag>
        </Space>
      ),
      sorter: (a, b) => a.currentStock - b.currentStock,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => setEditingProduct(record)}
          >
            Modifier
          </Button>
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer ce produit ?"
            onConfirm={() => onDelete(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button danger icon={<DeleteOutlined />}>
              Supprimer
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table<Product>
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
      />
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          open={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}
