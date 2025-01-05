'use client';

import { useState } from 'react';
import { Card, Form, Button, Space, Alert } from 'antd';
import OrderSelection from '@/app/components/invoice/OrderSelection';
import InvoiceProductList from '@/app/components/invoice/InvoiceProductList';
import InvoiceSummary from '@/app/components/invoice/InvoiceSummary';
import { useApi } from '@/app/hooks/useApi';

interface InvoiceData {
  clientId: string;
  date: string;
  dueDate: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'DRAFT' | 'PENDING' | 'PAID';
}

export default function NouvelleFacturePage() {
  const { post } = useApi();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form] = Form.useForm();
  const [selectedOrder, setSelectedOrder] = useState<{ products: { id: number; name: string; quantity: number; price: number }[] } | null>(null);

  const handleSubmit = async (values: InvoiceData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await post('/api/invoices', values);
      
      if (response.ok) {
        router.push('/factures');
        router.refresh();
      } else {
        const error = await response.json();
        setError(error.message || 'Failed to create invoice');
      }
    } catch (err) {
      setError('An error occurred while creating the invoice');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nouvelle Facture</h1>

      <Form form={form} layout="vertical" onFinish={handleSubmit} disabled={loading}>
        {error && <Alert type="error" message={error} />} 
        <Card title="Sélection de la commande" className="mb-6">
          <OrderSelection onOrderSelect={setSelectedOrder} />
        </Card>

        {selectedOrder && (
          <>
            <Card title="Produits" className="mb-6">
              <InvoiceProductList products={selectedOrder.products.map(product => ({ ...product, unitPrice: product.price, total: product.price * product.quantity }))} />
            </Card>

            <Card title="Résumé" className="mb-6">
              <InvoiceSummary products={selectedOrder.products} />
            </Card>

            <div className="flex justify-end">
              <Space>
                <Button onClick={() => form.resetFields()}>Annuler</Button>
                <Button type="primary" htmlType="submit">
                  Créer la facture
                </Button>
              </Space>
            </div>
          </>
        )}
      </Form>
    </div>
  );
}
