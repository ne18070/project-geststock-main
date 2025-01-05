'use client';

import { Table, Button, Space, InputNumber, Typography, Form } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const { Title } = Typography;

interface StockItem {
  id: number;
  nom: string;
  categorie: string;
  stock: number;
    stockMin: number;
    stockMax: number;
}

const stockData: StockItem[] = [
  { id: 1, nom: 'Produit A', categorie: 'Catégorie 1', stock: 150,  stockMin: 100, stockMax: 1000,},
    { id: 2, nom: 'Produit B', categorie: 'Catégorie 2', stock: 50,  stockMin: 50, stockMax: 500,},
    { id: 3, nom: 'Produit C', categorie: 'Catégorie 1', stock: 200, stockMin: 100, stockMax: 1000,},
    { id: 4, nom: 'Produit D', categorie: 'Catégorie 3', stock: 10,  stockMin: 20, stockMax: 100,},
  // Add more sample data
];

export default function InventairePage() {
  const router = useRouter();
    const [form] = Form.useForm()
    const [data, setData] = useState<StockItem[]>(stockData);
    const [editingRow, setEditingRow] = useState<number | null>(null);

    const handleEdit = (record: StockItem) => {
        form.setFieldsValue({
           [record.id]: record.stock
        });
        setEditingRow(record.id)
    }

    const cancelEdit = () => {
        setEditingRow(null)
        form.resetFields()
    }
    const handleSave = async (record: StockItem) => {
        try {
            const values = await form.validateFields([record.id.toString()])
            const updatedData = data.map(item => item.id === record.id ? {...item, stock: values[record.id]} : item);
            setData(updatedData)
            setEditingRow(null)
        } catch (errorInfo) {
           console.log("Failed", errorInfo)
        }
    };

  const columns = [
    {
      title: 'Produit',
      dataIndex: 'nom',
      key: 'nom',
    },
      {
          title: 'Catégorie',
          dataIndex: 'categorie',
          key: 'categorie',
      },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (_: unknown, record: StockItem) => {
        if(editingRow === record.id){
          return  <Form.Item name={record.id.toString()}>
                 <InputNumber min={0} style={{ width: '100%' }} />
             </Form.Item>
        }
        return record.stock;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: StockItem) => (
        <Space>
            { editingRow === record.id ? (
                <Space>
                    <Button type="primary" onClick={() => handleSave(record)}>
                        Sauvegarder
                    </Button>
                    <Button onClick={cancelEdit}>
                        Annuler
                    </Button>
                </Space>
                )
              : (
                <Button onClick={() => handleEdit(record)}>
                    Modifier
                </Button>
            )}

        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Inventaire</Title>
        <Form form={form}>
            <Table
            columns={columns}
            dataSource={data}
                rowKey="id"
          />
        </Form>
      <Space style={{ marginTop: '20px' }}>
          <Button onClick={() => router.back()}>Retour</Button>
      </Space>
    </div>
  );
}