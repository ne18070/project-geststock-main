'use client';

import { Table, Button, Space, Tag } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export default function FacturesPage() {
  const router = useRouter();

  const columns = [
    {
      title: 'N° Facture',
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
            statut === 'Payée'
              ? 'success'
              : statut === 'En attente'
                ? 'warning'
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
          <Button
            icon={<FileTextOutlined />}
            onClick={() => router.push(`/factures/${record.id}`)}
          >
            Voir
          </Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      numero: 'FAC-001',
      client: 'Client A',
      date: '2024-03-15',
      montant: 1250.5,
      statut: 'Payée',
    },
    // Add more sample data
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Factures</h1>
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
