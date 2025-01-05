'use client';

import { Table, Button, Space, Tag, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export default function PromotionsPage() {
  const router = useRouter();

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag
          color={
            type === 'percentage'
              ? 'blue'
              : type === 'fixed'
                ? 'green'
                : type === 'bogo'
                  ? 'purple'
                  : 'default'
          }
        >
          {type === 'percentage'
            ? 'Pourcentage'
            : type === 'fixed'
              ? 'Montant fixe'
              : type === 'bogo'
                ? 'Achetez-en 1, obtenez-en 1'
                : type}
        </Tag>
      ),
    },
    {
      title: 'Valeur',
      dataIndex: 'valeur',
      key: 'valeur',
      render: (valeur: number, record: { type: string }) =>
        record.type === 'percentage'
          ? `${valeur}%`
          : record.type === 'fixed'
            ? `${valeur}Fcfa`
            : 'N/A',
    },
    {
      title: 'Date de début',
      dataIndex: 'dateDebut',
      key: 'dateDebut',
    },
    {
      title: 'Date de fin',
      dataIndex: 'dateFin',
      key: 'dateFin',
    },
    {
      title: 'Statut',
      dataIndex: 'actif',
      key: 'actif',
      render: (actif: boolean) => (
        <Tag color={actif ? 'success' : 'error'}>
          {actif ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: { id: number; code: string; type: string; valeur: number; dateDebut: string; dateFin: string; actif: boolean }) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => router.push(`/parametrages/promotions/${record.id}`)}
          >
            Modifier
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Supprimer
          </Button>
        </Space>
      ),
    },
  ];

  const handleDelete = () => {
    // Implement delete logic
  };

  const data = [
    {
      id: 1,
      code: 'SUMMER2024',
      type: 'percentage',
      valeur: 20,
      dateDebut: '2024-06-01',
      dateFin: '2024-08-31',
      actif: true,
    },
    {
      id: 2,
      code: 'WELCOME10',
      type: 'fixed',
      valeur: 10,
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      actif: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Promotions</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push('/parametrages/promotions/nouvelle')}
        >
          Nouvelle promotion
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table columns={columns} dataSource={data} rowKey="id" />
        </div>
      </Card>
    </div>
  );
}
