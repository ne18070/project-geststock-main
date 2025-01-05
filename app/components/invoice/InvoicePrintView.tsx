'use client';

import { Table } from 'antd';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Product {
  id: number;
  nom: string;
  quantite: number;
  prixUnitaire: number;
  total: number;
}

interface InvoiceData {
  number: string;
  date: string;
  client: string;
  orderNumber: string;
  products: Product[];
  total: number;
}

interface Props {
  invoiceId: string;
  data: InvoiceData;
}

export default function InvoicePrintView({ invoiceId, data }: Props) {
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
    <div className="p-8 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">FACTURE</h1>
        <p className="text-gray-600">#{invoiceId}</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Informations</h2>
          <div className="space-y-1">
            <p>
              <strong>Date:</strong>{' '}
              {format(new Date(data.date), 'dd MMMM yyyy', { locale: fr })}
            </p>
            <p>
              <strong>N° Commande:</strong> {data.orderNumber}
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Client</h2>
          <div className="space-y-1">
            <p>{data.client}</p>
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data.products}
        pagination={false}
        rowKey="id"
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

      <style jsx global>{`
        @media print {
          .ant-modal-wrap {
            display: none !important;
          }
          body * {
            visibility: hidden;
          }
          #print-content,
          #print-content * {
            visibility: visible;
          }
          #print-content {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
}
