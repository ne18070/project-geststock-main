'use client';

import { useParams } from 'next/navigation';
import { Card, Descriptions, Table, Tag, Button, Space, Modal } from 'antd';
import { PrinterOutlined, DownloadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import InvoicePrintView from '@/app/components/invoice/InvoicePrintView';

export default function FactureDetailPage() {
  const { id } = useParams();
  const [printModalVisible, setPrintModalVisible] = useState(false);

  const handlePrint = () => {
    setPrintModalVisible(true);
  };

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
        <h1 className="text-2xl font-bold">Facture #{id}</h1>
        <Space>
          <Button icon={<PrinterOutlined />} onClick={handlePrint}>
            Imprimer
          </Button>
          <Button icon={<DownloadOutlined />}>Télécharger PDF</Button>
        </Space>
      </div>

      <Card title="Informations générales">
        <Descriptions column={{ xs: 1, sm: 2, md: 3 }}>
          <Descriptions.Item label="Date">15/03/2024</Descriptions.Item>
          <Descriptions.Item label="Client">Dev Mbaye</Descriptions.Item>
          <Descriptions.Item label="N° Commande">CMD-001</Descriptions.Item>
          <Descriptions.Item label="Statut">
            <Tag color="success">Payée</Tag>
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
      <Modal
        title="Aperçu avant impression"
        open={printModalVisible}
        onCancel={() => setPrintModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setPrintModalVisible(false)}>
            Annuler
          </Button>,
          <Button
            key="print"
            type="primary"
            icon={<PrinterOutlined />}
            onClick={() => window.print()}
          >
            Imprimer
          </Button>,
        ]}
        width={800}
      >
        <InvoicePrintView
          invoiceId={id as string}
          data={{
            number: id as string,
            date: '15/03/2024',
            client: 'John Doe',
            orderNumber: 'CMD-001',
            products,
            total: 149.99,
          }}
        />
      </Modal>
    </div>
  );
}
