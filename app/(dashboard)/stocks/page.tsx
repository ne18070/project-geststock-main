'use client';

import { Table, Button, Space, Tag, Progress } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export default function StocksPage() {
  const router = useRouter();

  const columns = [
    {
      title: 'Produit',
      dataIndex: 'nom',
      key: 'nom',
    },
    {
      title: 'Catégorie',
      dataIndex: 'categorie',
      key: 'categorie',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (_: unknown, record: { stock: number; stockMax: number; stockMin: number }) => (
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>{record.stock} unités</div>
          <Progress
            percent={(record.stock / record.stockMax) * 100}
            status={
              record.stock < record.stockMin
                ? 'exception'
                : record.stock < record.stockMax * 0.2
                  ? 'normal'
                  : 'success'
            }
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: 'Statut',
      key: 'statut',
      render: (_: unknown, record: { stock: number; stockMax: number; stockMin: number }) => (
        <Tag
          color={
            record.stock < record.stockMin
              ? 'error'
              : record.stock < record.stockMax * 0.2
                ? 'warning'
                : 'success'
          }
        >
          {record.stock < record.stockMin
            ? 'Rupture'
            : record.stock < record.stockMax * 0.2
              ? 'Stock bas'
              : 'En stock'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: { id: number; nom: string; categorie: string; stock: number; stockMin: number; stockMax: number }) => (
        <Space>
          <Button onClick={() => router.push(`/stocks/${record.id}`)}>
            Détails
          </Button>
          <Button
            type="primary"
            onClick={() => router.push('/stocks/nouvelle-entree')}
          >
            Entrée
          </Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      nom: 'Produit A',
      categorie: 'Catégorie 1',
      stock: 150,
      stockMin: 100,
      stockMax: 1000,
    },
    // Add more sample data
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des stocks</h1>
        <Space>
          <Button onClick={() => router.push('/stocks/inventaire')}>
            Inventaire
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push('/stocks/nouveau')}
          >
            Nouveau produit
          </Button>
        </Space>
      </div>
      <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
          />
        </div>
    </div>
  );
}
