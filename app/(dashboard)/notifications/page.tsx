'use client';

import { List, Card, Tag, Button, Space } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: 'Stock faible',
      description: 'Le produit A est en rupture de stock',
      date: '2024-03-15 14:30',
      type: 'warning',
      read: false,
    },
    {
      id: 2,
      title: 'Nouvelle commande',
      description: 'Commande #CMD-001 créée par John Doe',
      date: '2024-03-15 15:45',
      type: 'info',
      read: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Button type="primary" icon={<CheckOutlined />}>
          Tout marquer comme lu
        </Button>
      </div>

      <Card>
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button key="read" type="link">
                  Marquer comme lu
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<BellOutlined className="text-2xl" />}
                title={
                  <Space>
                    {item.title}
                    <Tag
                      color={
                        item.type === 'warning'
                          ? 'orange'
                          : item.type === 'info'
                            ? 'blue'
                            : 'default'
                      }
                    >
                      {item.type.toUpperCase()}
                    </Tag>
                    {!item.read && <Tag color="red">NOUVEAU</Tag>}
                  </Space>
                }
                description={
                  <div>
                    <p>{item.description}</p>
                    <small className="text-gray-500">{item.date}</small>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
