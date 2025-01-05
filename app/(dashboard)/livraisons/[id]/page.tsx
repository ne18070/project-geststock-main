'use client';

import { useParams } from 'next/navigation';
import { Card, Descriptions, Steps, Table, Tag, Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

export default function LivraisonDetailPage() {
  const { id } = useParams();

  const products = [
    {
      id: 1,
      nom: 'Produit A',
      quantite: 5,
      status: 'pending',
    },
  ];

  const columns = [
    { title: 'Produit', dataIndex: 'nom', key: 'nom' },
    { title: 'Quantité', dataIndex: 'quantite', key: 'quantite' },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'delivered' ? 'success' : 'processing'}>
          {status === 'delivered' ? 'Livré' : 'En attente'}
        </Tag>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Livraison #{id}</h1>
        <Button type="primary" icon={<CheckOutlined />}>
          Confirmer la livraison
        </Button>
      </div>

      <Card title="Informations générales">
        <Descriptions column={{ xs: 1, sm: 2, md: 3 }}>
          <Descriptions.Item label="Date prévue">16/03/2024</Descriptions.Item>
          <Descriptions.Item label="Client">John Doe</Descriptions.Item>
          <Descriptions.Item label="Adresse">
            123 Rue Example, 75001 Paris
          </Descriptions.Item>
          <Descriptions.Item label="Statut">
            <Tag color="processing">En cours</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="N° Commande">CMD-001</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Suivi de livraison">
        <Steps
          current={1}
          items={[
            {
              title: 'Préparation',
              description: 'Commande préparée',
            },
            {
              title: 'En route',
              description: 'En cours de livraison',
            },
            {
              title: 'Livré',
              description: 'Pas encore livré',
            },
          ]}
        />
      </Card>

      <Card title="Produits à livrer">
        <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={products}
              rowKey="id"
              pagination={false}
            />
          </div>
      </Card>
    </div>
  );
}
