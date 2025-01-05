'use client';

import { Table, Switch, Card, Alert } from 'antd';
import { useState } from 'react';

export default function RolesPermissionsPage() {
  const [permissions, setPermissions] = useState<
    Record<string, Record<string, boolean>>
  >({
    admin: {
      create_order: true,
      edit_order: true,
      delete_order: true,
      manage_users: true,
      manage_settings: true,
    },
    gestionnaire: {
      create_order: true,
      edit_order: true,
      delete_order: false,
      manage_users: false,
      manage_settings: false,
    },
    agent: {
      create_order: true,
      edit_order: false,
      delete_order: false,
      manage_users: false,
      manage_settings: false,
    },
  });

  const handlePermissionChange = (
    role: string,
    permission: string,
    checked: boolean,
  ) => {
    setPermissions({
      ...permissions,
      [role]: {
        ...permissions[role],
        [permission]: checked,
      },
    });
  };

  const columns = [
    {
      title: 'Permission',
      dataIndex: 'permission',
      key: 'permission',
    },
    {
      title: 'Admin',
      key: 'admin',
      render: (_: unknown, record: { key: string }) => (
        <Switch
          checked={permissions.admin[record.key]}
          onChange={(checked) =>
            handlePermissionChange('admin', record.key, checked)
          }
          disabled
        />
      ),
    },
    {
      title: 'Gestionnaire',
      key: 'gestionnaire',
      render: (_: unknown, record: { key: string }) => (
        <Switch
          checked={permissions.gestionnaire[record.key]}
          onChange={(checked) =>
            handlePermissionChange('gestionnaire', record.key, checked)
          }
        />
      ),
    },
    {
      title: 'Agent',
      key: 'agent',
      render: (_: unknown, record: { key: string }) => (
        <Switch
          checked={permissions.agent[record.key]}
          onChange={(checked) =>
            handlePermissionChange('agent', record.key, checked)
          }
        />
      ),
    },
  ];

  const data = [
    { key: 'create_order', permission: 'Créer une commande' },
    { key: 'edit_order', permission: 'Modifier une commande' },
    { key: 'delete_order', permission: 'Supprimer une commande' },
    { key: 'manage_users', permission: 'Gérer les utilisateurs' },
    { key: 'manage_settings', permission: 'Gérer les paramètres' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Rôles et Permissions</h1>
      </div>

      <Alert
        message="Information"
        description="Les permissions de l'administrateur ne peuvent pas être modifiées pour des raisons de sécurité."
        type="info"
        showIcon
        className="mb-6"
      />

      <Card>
        <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey="key"
        />
        </div>
      </Card>
    </div>
  );
}
