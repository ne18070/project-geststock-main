'use client';

import { useRouter } from 'next/navigation';
import { Button, Descriptions, InputNumber, Space, Typography } from 'antd';
import { useState, use } from 'react';

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

export default function StockDetailPage({ params }: Readonly<{ params: { id: string } }>) {
  const router = useRouter();
  
  // Use React.use to unwrap the params promise
  const resolvedParams = use(params);
  const stockId = parseInt(resolvedParams.id, 10);
  
  const item = stockData.find(item => item.id === stockId);
  const [newStock, setNewStock] = useState<number | undefined>(item?.stock);

  if (!item) {
    return <div>Produit introuvable</div>
  }

  const handleStockChange = (value: number | null) => {
    if (value !== null) {
      setNewStock(value);
    }
  }


    const handleSave = () => {
        console.log("save stock", newStock)
      router.push('/stocks');
    };


  return (
    <div>
      <Title level={2}>Détails du produit</Title>
        <Descriptions bordered layout="vertical" column={2}>
          <Descriptions.Item label="Nom">{item.nom}</Descriptions.Item>
          <Descriptions.Item label="Catégorie">{item.categorie}</Descriptions.Item>
            <Descriptions.Item label="Stock actuel">
               <Space>
                   <InputNumber min={0} value={newStock} onChange={handleStockChange} /> unités
               </Space>
            </Descriptions.Item>
          <Descriptions.Item label="Stock minimum">{item.stockMin}</Descriptions.Item>
            <Descriptions.Item label="Stock maximum">{item.stockMax}</Descriptions.Item>
        </Descriptions>

        <Space style={{marginTop: '20px'}}>
          <Button onClick={() => router.back()}>Retour</Button>
          <Button type="primary" onClick={handleSave}>
            Enregistrer
          </Button>
        </Space>
    </div>
  );
}