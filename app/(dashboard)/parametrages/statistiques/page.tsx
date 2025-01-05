'use client';

import { Card, Row, Col, Statistic, Button } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ReloadOutlined } from '@ant-design/icons';

export default function StatistiquesPage() {
  const data = [
    { name: 'Jan', ventes: 4000, commandes: 2400 },
    { name: 'Fév', ventes: 3000, commandes: 1398 },
    { name: 'Mar', ventes: 2000, commandes: 9800 },
    { name: 'Avr', ventes: 2780, commandes: 3908 },
    { name: 'Mai', ventes: 1890, commandes: 4800 },
    { name: 'Jun', ventes: 2390, commandes: 3800 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Statistiques</h1>
        <Button icon={<ReloadOutlined />}>Actualiser</Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Chiffre d'affaires"
              value={134500}
              precision={2}
              suffix="Fcfa"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Commandes" value={85} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Clients actifs" value={42} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Taux de conversion" value={65} suffix="%" />
          </Card>
        </Col>
      </Row>

      <Card title="Évolution des ventes et commandes">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="ventes"
                stroke="#8884d8"
                name="Ventes"
              />
              <Line
                type="monotone"
                dataKey="commandes"
                stroke="#82ca9d"
                name="Commandes"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
