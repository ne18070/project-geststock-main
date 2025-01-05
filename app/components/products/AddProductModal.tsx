'use client';

import { Modal, Form, Input, InputNumber, Select } from 'antd';
import { useCompany } from '@/app/hooks/useCompany';

interface ProductFormData {
  name: string;
  category: string;
  price: number;
  minStock: number;
  currentStock: number;
  companyId: string;
}

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: ProductFormData) => Promise<void>;
}

export default function AddProductModal({
  open,
  onClose,
  onAdd,
}: AddProductModalProps) {
  const [form] = Form.useForm();
  const { companies } = useCompany();

  const handleSubmit = async (values: ProductFormData) => {
    await onAdd(values);
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Nouveau produit"
      open={open}
      onCancel={onClose}
      onOk={form.submit}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Nom du produit"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="category"
          label="Catégorie"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { value: 'electronics', label: 'Électronique' },
              { value: 'clothing', label: 'Vêtements' },
              { value: 'food', label: 'Alimentation' },
            ]}
          />
        </Form.Item>

        <Form.Item name="price" label="Prix" rules={[{ required: true }]}>
          <InputNumber
            min={0}
            precision={2}
            style={{ width: '100%' }}
            addonAfter="Fcfa"
          />
        </Form.Item>

        <Form.Item
          name="minStock"
          label="Stock minimum"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="currentStock"
          label="Stock initial"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="companyId"
          label="Compagnie"
          rules={[{ required: true }]}
        >
          <Select
            options={companies.map((company) => ({
              value: company.id,
              label: company.name,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
