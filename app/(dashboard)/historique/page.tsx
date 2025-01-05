'use client';

import { Table, Card, Tag } from 'antd';

export default function HistoriquePage() {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: { date: string }, b: { date: string }) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Utilisateur',
      dataIndex: 'utilisateur',
      key: 'utilisateur',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => (
        <Tag
          color={
            action === 'création'
              ? 'green'
              : action === 'modification'
                ? 'blue'
                : action === 'suppression'
                  ? 'red'
                  : 'default'
          }
        >
          {action.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  const data = [
    {
      id: 1,
      date: '2024-03-15 14:30',
      utilisateur: 'John Doe',
      action: 'création',
      description: "Création d'une nouvelle commande #CMD-001",
    },
    {
      id: 2,
      date: '2024-03-15 15:45',
      utilisateur: 'Jane Smith',
      action: 'modification',
      description: 'Modification du stock du produit A',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Historique des Actions</h1>
      <Card>
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      </Card>
    </div>
  );
}
