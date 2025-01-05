'use client';

import { Select, Form } from 'antd';
import { useOrdersList } from '@/app/hooks/useOrdersList';

interface OrderSelectionProps {
  onOrderSelect: (order: any) => void;
}

export default function OrderSelection({ onOrderSelect }: OrderSelectionProps) {
  const { orders, loading } = useOrdersList();

  return (
    <Form.Item
      name="orderId"
      label="Commande"
      rules={[
        { required: true, message: 'Veuillez sélectionner une commande' },
      ]}
    >
      <Select
        placeholder="Sélectionner une commande"
        loading={loading}
        onChange={(value) => {
          const selectedOrder = orders.find((order) => order.id === value);
          onOrderSelect(selectedOrder);
        }}
        options={orders.map((order) => ({
          value: order.id,
          label: `Commande #${order.id} - ${order.client}`,
        }))}
      />
    </Form.Item>
  );
}
