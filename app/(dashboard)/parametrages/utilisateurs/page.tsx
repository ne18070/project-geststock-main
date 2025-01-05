'use client';

import { Table, Button, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export default function UtilisateursPage() {
  const router = useRouter();

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Rôle',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag
          color={
            role === 'admin'
              ? 'red'
              : role === 'gestionnaire'
                ? 'blue'
                : role === 'agent'
                  ? 'green'
                  : 'default'
          }
        >
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Statut',
      dataIndex: 'actif',
      key: 'actif',
      render: (actif: boolean) => (
        <Tag color={actif ? 'success' : 'error'}>
          {actif ? 'Actif' : 'Inactif'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: { id: number; nom: string; email: string; role: string; actif: boolean }) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() =>
              router.push(`/parametrages/utilisateurs/${record.id}`)
            }
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
      nom: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      actif: true,
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push('/parametrages/utilisateurs/nouveau')}
        >
          Nouvel utilisateur
        </Button>
      </div>
        <div className="overflow-x-auto">
          <Table columns={columns} dataSource={data} rowKey="id" />
        </div>
    </div>
  );
}
