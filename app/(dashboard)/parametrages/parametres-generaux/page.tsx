"use client";

import { Card, Form, Select, Switch, Button, Divider, InputNumber } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { api, getCompanyId } from "@/app/hooks/useApi";
import { useEffect } from "react";

async function getData() {
  const companyId = await getCompanyId();
  const data: { key: string; value: string }[] = await api.get(
    `/settings/company/${companyId}`,
    { useToken: true }
  );
  console.log(data);
  if (!data) {
    throw new Error("Failed to fetch data");
  }

  // Transform the array into an object with key-value pairs
  const formValues = data.reduce(
    (
      acc: Record<string, string | boolean | number>,
      setting: { key: string; value: string }
    ) => {
      // Convert string "true"/"false" to boolean for switch components
      if (
        setting.key === "notificationsEmail" ||
        setting.key === "notificationsSMS"
      ) {
        acc[setting.key] = setting.value === "true";
      }
      // Convert string numbers to numbers for number inputs
      else if (setting.key === "tva" || setting.key === "delaiPaiement") {
        acc[setting.key] = Number(setting.value);
      } else {
        acc[setting.key] = setting.value;
      }
      return acc;
    },
    {}
  );

  return formValues;
}

export default function ParametresGenerauxPage() {
  const [form] = Form.useForm();

  useEffect(() => {
    getData()
      .then((formValues) => {
        form.setFieldsValue(formValues);
      })
      .catch((error) => {
        console.error("Error loading settings:", error);
      });
  }, [form]);

  const handleSubmit = (values: Record<string, unknown>) => {
    console.log("Form values:", values);
    // Add your form submission logic here
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Paramètres Généraux</h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          devise: "EUR",
          langue: "fr",
          tva: 18,
          delaiPaiement: 15,
          notificationsEmail: true,
          notificationsSMS: false,
        }}
      >
        <Card title="Paramètres de base">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="devise"
              label="Devise"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: "XOF", label: "Franc (Fcfa)" },
                  { value: "EUR", label: "Euro (€)" },
                  { value: "USD", label: "Dollar ($)" },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="langue"
              label="Langue par défaut"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: "fr", label: "Français" },
                  { value: "en", label: "English" },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="tva"
              label="Taux de TVA (%)"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} max={100} className="w-full" />
            </Form.Item>

            <Form.Item
              name="delaiPaiement"
              label="Délai de paiement (jours)"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </div>
        </Card>

        <Card title="Notifications" className="mt-6">
          <div className="space-y-4">
            <Form.Item name="notificationsEmail" valuePropName="checked">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Notifications par email</div>
                  <div className="text-sm text-gray-500">
                    Recevoir les notifications par email
                  </div>
                </div>
                <Switch />
              </div>
            </Form.Item>

            <Divider />

            <Form.Item name="notificationsSMS" valuePropName="checked">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Notifications par SMS</div>
                  <div className="text-sm text-gray-500">
                    Recevoir les notifications par SMS
                  </div>
                </div>
                <Switch />
              </div>
            </Form.Item>
          </div>
        </Card>

        <div className="flex justify-end mt-6">
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
            Enregistrer les modifications
          </Button>
        </div>
      </Form>
    </div>
  );
}
