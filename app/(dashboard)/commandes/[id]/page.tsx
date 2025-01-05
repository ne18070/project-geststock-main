'use client';

import { useParams } from 'next/navigation';
import { Card, Descriptions, Table, Tag, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

export default function CommandeDetailPage() {
  const { id } = useParams();

  const products = [
    {
      id: 1,
      nom: 'Produit A',
      quantite: 5,
      prixUnitaire: 10.99,
      total: 54.95,
    },
  ];

  const columns = [
    { title: 'Produit', dataIndex: 'nom', key: 'nom' },
    { title: 'Quantité', dataIndex: 'quantite', key: 'quantite' },
    {
      title: 'Prix unitaire',
      dataIndex: 'prixUnitaire',
      key: 'prixUnitaire',
      render: (prix: number) => `${prix.toFixed(2)} Fcfa`,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `${total.toFixed(2)} Fcfa`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Commande #{id}</h1>
        <Space>
          <Button icon={<EditOutlined />}>Modifier</Button>
          <Button danger icon={<DeleteOutlined />}>
            Supprimer
          </Button>
        </Space>
      </div>

      <Card title="Informations générales">
        <Descriptions column={{ xs: 1, sm: 2, md: 3 }}>
          <Descriptions.Item label="Date">15/03/2024</Descriptions.Item>
          <Descriptions.Item label="Client">Dev</Descriptions.Item>
          <Descriptions.Item label="Agent">Agent A</Descriptions.Item>
          <Descriptions.Item label="Statut">
            <Tag color="processing">En cours</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Total">149.99 Fcfa</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Produits">
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          pagination={false}
          summary={(pageData) => {
            const total = pageData.reduce((acc, curr) => acc + curr.total, 0);
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3}>
                  Total
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  {total.toFixed(2)} Fcfa
                </Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
      </Card>
    </div>
  );
}
