'use client';

import { Descriptions } from 'antd';
import { useInvoiceCalculation } from '@/app/hooks/useInvoiceCalculation';
import { formatCurrency } from '@/app/lib/utils';

interface Product {
  id: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
}

interface InvoiceSummaryProps {
  products: Product[];
}

export default function InvoiceSummary({ products }: InvoiceSummaryProps) {
  const { calculateTotals } = useInvoiceCalculation();
  const { subtotal, discount, total } = calculateTotals(products);

  return (
    <Descriptions column={1}>
      <Descriptions.Item label="Sous-total">
        {formatCurrency(subtotal)}
      </Descriptions.Item>
      {discount > 0 && (
        <Descriptions.Item label="Remises">
          -{formatCurrency(discount)}
        </Descriptions.Item>
      )}
      <Descriptions.Item label="Total">
        <span className="text-lg font-bold">{formatCurrency(total)}</span>
      </Descriptions.Item>
    </Descriptions>
  );
}
