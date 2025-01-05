'use client';

import { Table, Button, Space, Tag, Steps } from 'antd';
import { CarOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export default function LivraisonsPage() {
  const router = useRouter();

  const columns = [
    {
      title: 'N° Livraison',
      dataIndex: 'numero',
      key: 'numero',
    },
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
    },
    {
      title: 'Date prévue',
      dataIndex: 'datePrevue',
      key: 'datePrevue',
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
              : statut === 'Livrée'
                ? 'success'
                : 'default'
          }
        >
          {statut}
        </Tag>
      ),
    },
    {
      title: 'Progression',
      key: 'progression',
      render: (_: any, record: any) => (
        <Steps
          size="small"
          current={record.etape}
          items={[
            { title: 'Préparation' },
            { title: 'En route' },
            { title: 'Livrée' },
          ]}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<CarOutlined />}
            onClick={() => router.push(`/livraisons/${record.id}`)}
          >
            Détails
          </Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      numero: 'LIV-001',
      client: 'Client A',
      datePrevue: '2024-03-16',
      statut: 'En cours',
      etape: 1,
    },
    {
      id: 2,
      numero: 'LIV-002',
      client: 'Client B',
      datePrevue: '2024-03-18',
      statut: 'Livrée',
      etape: 2,
    },
        {
            id: 3,
            numero: 'LIV-003',
            client: 'Client C',
            datePrevue: '2024-03-18',
            statut: 'En cours',
            etape: 0,
        },
        {
            id: 4,
            numero: 'LIV-004',
            client: 'Client D',
            datePrevue: '2024-03-19',
            statut: 'Livrée',
            etape: 3,
        },
        {
            id: 5,
            numero: 'LIV-005',
            client: 'Client E',
            datePrevue: '2024-03-20',
            statut: 'En cours',
            etape: 1,
        },
         {
            id: 6,
            numero: 'LIV-006',
            client: 'Client F',
            datePrevue: '2024-03-21',
            statut: 'En cours',
            etape: 1,
        },
        {
            id: 7,
            numero: 'LIV-007',
            client: 'Client G',
            datePrevue: '2024-03-22',
            statut: 'Livrée',
            etape: 3,
        }
      ,
       {
            id: 8,
            numero: 'LIV-008',
            client: 'Client H',
            datePrevue: '2024-03-23',
            statut: 'En cours',
            etape: 2,
        },
        {
             id: 9,
             numero: 'LIV-009',
             client: 'Client I',
             datePrevue: '2024-03-24',
             statut: 'Livrée',
             etape: 3,
        }
        ,
        {
            id: 10,
            numero: 'LIV-010',
            client: 'Client J',
            datePrevue: '2024-03-25',
            statut: 'En cours',
            etape: 1,
        },
      // Add more sample data
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Livraisons</h1>
        <Button
          type="primary"
          icon={<CarOutlined />}
          onClick={() => router.push('/livraisons/creer')}
        >
          Nouvelle livraison
        </Button>
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        <Table columns={columns} dataSource={data} rowKey="id" pagination={false} />
      </div>
    </div>
  );
}