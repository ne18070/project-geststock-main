'use client';

import { Table } from 'antd';
import { formatCurrency } from '@/app/lib/utils';
import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceProductListProps {
  products: Product[];
}

export default function InvoiceProductList({
  products,
}: InvoiceProductListProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

    const columns = [
        {
            title: 'Produit',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Quantité',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Prix unitaire',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            render: (price: number) => formatCurrency(price),
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (total: number) => formatCurrency(total),
        },
    ];


    const renderMobileTable = () => {
        return (
            <div className="space-y-4">
                {products.map((record) => (
                    <div key={record.id} className="border rounded p-4">
                        <div className="flex justify-between">
                            <span className="font-bold">Produit:</span>
                            <span>{record.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold">Quantité:</span>
                            <span>{record.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold">Prix unitaire:</span>
                            <span>{formatCurrency(record.unitPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold">Total:</span>
                           <span>{formatCurrency(record.total)}</span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };


  return (
    <>
          {isMobile ? (
            renderMobileTable()
          ) : (
            <div className="overflow-x-auto">
              <Table
                columns={columns}
                dataSource={products}
                rowKey="id"
                pagination={false}
              />
            </div>
          )}
    </>

  );
}