'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Layout, Row, Col, Card, Statistic, Table, Alert, Select, Spin, message  } from 'antd';
import {
    ShoppingCartOutlined,
    UserOutlined,
    BoxPlotOutlined,
    FileTextOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const { Content } = Layout;
const { Option } = Select;

// Mock function pour obtenir les données (à remplacer par votre API)
interface SalesData {
  day: string;
  sales: number;
}

interface StockData {
  product: string;
  stock: number;
}

interface RecentOrder {
  key: number;
  id: number;
  date: string;
  client: string;
  total: number;
}

interface LowStockProduct {
  key: number;
  product: string;
}

async function fetchData(filter: string): Promise<DashboardData | null> {
  try {
    // Simulation d'une requête API (remplacez par votre appel réel)
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Retour des données mock
    return {
      ordersCount: Math.floor(Math.random() * 20) + 10,
      activeClients: Math.floor(Math.random() * 100) + 50,
      productsInStock: Math.floor(Math.random() * 300) + 100,
      monthlyInvoices: Math.floor(Math.random() * 50) + 20,
      salesData: Array.from({ length: 7 }, (_, i) => ({
        day: `J${i + 1}`,
        sales: Math.floor(Math.random() * 200) + 50,
      })),
      stockData: Array.from({ length: 5 }, (_, i) => ({
        product: `Produit ${i + 1}`,
        stock: Math.floor(Math.random() * 100),
      })),
      recentOrders: Array.from({ length: 5 }, (_, i) => ({
        key: i,
        id: 1000 + i,
        date: `2024-03-${10 + i}`,
        client: `Client ${i + 1}`,
        total: Math.floor(Math.random() * 500) + 100,
      })),
      lowStockProducts: Array.from({ length: Math.floor(Math.random() * 3) }, (_, i) => ({
        key: i,
        product: `Produit ${Math.floor(Math.random() * 10) + 1}`,
      })),
    };
  } catch (error) {
    message.error('Erreur lors du chargement des données');
    console.error('Erreur lors du chargement des données', error);
    return null;
  }
}
interface DashboardData {
  ordersCount: number;
  activeClients: number;
  productsInStock: number;
  monthlyInvoices: number;
  salesData: { day: string; sales: number }[];
  stockData: { product: string; stock: number }[];
  recentOrders: { key: number; id: number; date: string; client: string; total: number }[];
  lowStockProducts: { key: number; product: string }[];
}

export default function HomePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [selectedFilter, setSelectedFilter] = useState('all');

    useEffect(() => {
       if (status === 'unauthenticated') {
          router.push('/login');
       }
     }, [status, router]);

    useEffect(() => {
        const loadData = async () => {
          setLoading(true);
             const data = await fetchData(selectedFilter);
             if(data){
                setDashboardData(data);
             }
             setLoading(false);
        };
        loadData();
    }, [selectedFilter]);


    if (status === 'loading') {
      return <div>Loading...</div>;
    }

    const handleFilterChange = (value: string) => {
      setSelectedFilter(value);
    };

    const columns = [
      { title: 'ID Commande', dataIndex: 'id', key: 'id' },
     { title: 'Date', dataIndex: 'date', key: 'date' },
     { title: 'Client', dataIndex: 'client', key: 'client' },
     { title: 'Total', dataIndex: 'total', key: 'total' },
    ];


    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <Spin size="large"/>
        </div>
    }

    if (!dashboardData) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>
           <p>Impossible de charger les données du tableau de bord.</p>
        </div>
    }



  return (
        <div className="site-layout-content">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold ">Tableau de bord</h1>
               <Select
                defaultValue="all"
                style={{ width: 120 }}
                onChange={handleFilterChange}
              >
                <Option value="all">Tous</Option>
                <Option value="last_month">Mois dernier</Option>
               <Option value="last_week">Semaine dernière</Option>
              </Select>
            </div>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                    <Statistic
                      title="Commandes en cours"
                        value={dashboardData.ordersCount}
                      prefix={<ShoppingCartOutlined />}
                    />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                  <Card>
                       <Statistic
                          title="Clients actifs"
                          value={dashboardData.activeClients}
                         prefix={<UserOutlined />}
                      />
                   </Card>
                </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                    <Statistic
                        title="Produits en stock"
                        value={dashboardData.productsInStock}
                         prefix={<BoxPlotOutlined />}
                      />
                    </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                   <Card>
                       <Statistic
                           title="Factures du mois"
                            value={dashboardData.monthlyInvoices}
                           prefix={<FileTextOutlined />}
                         />
                     </Card>
               </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
              <Col xs={24} lg={12}>
                    <Card title="Ventes des 7 derniers jours">
                      <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={dashboardData.salesData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="day" />
                              <YAxis />
                               <Tooltip />
                            <Bar dataKey="sales" fill="#8884d8" />
                         </BarChart>
                      </ResponsiveContainer>
                   </Card>
              </Col>
              <Col xs={24} lg={12}>
                  <Card title="Répartition du stock">
                     <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={dashboardData.stockData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="product" />
                              <YAxis />
                               <Tooltip />
                               <Bar dataKey="stock" fill="#82ca9d" />
                         </BarChart>
                     </ResponsiveContainer>
                   </Card>
                </Col>
              </Row>
            <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                 <Col xs={24}>
                     <Card title="Dernières Commandes">
                        <div className="overflow-y-auto">
                       <Table columns={columns} dataSource={dashboardData.recentOrders} />
                        </div>
                    </Card>
                 </Col>
           </Row>
             {dashboardData.lowStockProducts.length > 0 && (
              <Alert
                   message="Alertes de stock bas"
                    type="warning"
                    description={
                        <div>
                           <p>Les produits suivants sont en stock bas:</p>
                             <ul>
                                 {dashboardData.lowStockProducts.map((item) => (
                                      <li key={item.key}>{item.product}</li>
                                   ))}
                            </ul>
                        </div>
                   }
                    icon={<WarningOutlined />}
                   style={{ marginTop: '20px' }}
               />
           )}
      </div>
   );
}