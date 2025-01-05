'use client';

import { Button, Form, InputNumber, Select, Space, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
const { Title } = Typography;
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';

interface StockItem {
    id: number;
    nom: string;
    categorie: string;
    stock: number;
    stockMin: number;
    stockMax: number;
}


const stockData: StockItem[] = [
    {
        id: 1,
        nom: 'Produit A',
        categorie: 'Catégorie 1',
        stock: 150,
        stockMin: 100,
        stockMax: 1000,
    },
    // Add more sample data
];


export default function NouvelleEntreePage() {
  const router = useRouter();
  const [form] = Form.useForm();
    const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);

    const handleSelect = (value: number | undefined) => {
      const foundItem = stockData.find(item => item.id === value);
        setSelectedItem(foundItem || null)
      form.setFieldsValue({
        stock: foundItem?.stock
      })
    }

  const onFinish = (values: { produit: number; quantite: number }) => {
    console.log('Success:', values);
    router.push('/stocks');
  };
  
  const onFinishFailed = (errorInfo: ValidateErrorEntity<{ produit: number; quantite: number }>) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div>
      <Title level={2}>Nouvelle entrée de stock</Title>
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Produit"
            name="produit"
            rules={[{ required: true, message: 'Veuillez sélectionner un produit!' }]}
          >
            <Select
                showSearch
                placeholder="Sélectionner un produit"
                optionFilterProp="children"
                filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={stockData.map(item => ({
                    label: item.nom,
                    value: item.id
                }))}
                onChange={handleSelect}
            />
          </Form.Item>

          <Form.Item
            label="Quantité"
            name="quantite"
            rules={[{ required: true, message: 'Veuillez entrer une quantité!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          {
              selectedItem &&
              <Form.Item
                label="Stock actuel"
                name="stock"
                >
                <InputNumber  style={{ width: '100%' }}  disabled/>
              </Form.Item>
          }

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Space>
            <Button onClick={() => router.back()}>
                  Retour
                </Button>
              <Button type="primary" htmlType="submit">
                Enregistrer
              </Button>
            </Space>
          </Form.Item>
        </Form>
    </div>
  );
}