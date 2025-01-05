'use client';

import { Table, Button, Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export default function CommandesPage() {
  const router = useRouter();

  const columns = [
    {
      title: 'N° Commande',
      dataIndex: 'numero',
      key: 'numero',
    },
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Montant',
      dataIndex: 'montant',
      key: 'montant',
      render: (montant: number) => `${montant.toFixed(2)} Fcfa`,
    },
    {
      title: 'Statut',
      dataIndex: 'statut',
      key: 'statut',
      render: (statut: string) => (
        <Tag
          color={
            statut === 'En cours'
              ? 'processing'
              : statut === 'Validée'
                ? 'success'
                : 'default'
          }
        >
          {statut}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: { id: number; numero: string; client: string; date: string; montant: number; statut: string }) => (
        <Space>
          <Button onClick={() => router.push(`/commandes/${record.id}`)}>
            Détails
          </Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      numero: 'CMD-001',
      client: 'Client A',
      date: '2024-03-15',
      montant: 1250.5,
      statut: 'En cours',
    },
    // Add more sample data
  ];

  return (
    <div className="overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Commandes</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push('/commandes/creer')}
        >
          Nouvelle commande
        </Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  );
}
