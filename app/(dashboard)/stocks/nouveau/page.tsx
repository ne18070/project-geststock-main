'use client';

import { Button, Form, Input, InputNumber, Space, Typography } from 'antd';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

export default function NouveauProduitPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = (values: { nom: string; categorie: string; stockMin: number; stockMax: number }) => {
    console.log('Success:', values);
    router.push('/stocks');
  }
  
  return (
    <div>
      <Title level={2}>Nouveau produit</Title>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Nom du produit"
          name="nom"
          rules={[{ required: true, message: 'Veuillez entrer le nom du produit!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Catégorie"
          name="categorie"
          rules={[{ required: true, message: 'Veuillez entrer la catégorie!' }]}
        >
            <Input />
        </Form.Item>

        <Form.Item
          label="Stock minimum"
          name="stockMin"
          rules={[{ required: true, message: 'Veuillez entrer le stock minimum!' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Stock maximum"
          name="stockMax"
          rules={[{ required: true, message: 'Veuillez entrer le stock maximum!' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }}/>
        </Form.Item>


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