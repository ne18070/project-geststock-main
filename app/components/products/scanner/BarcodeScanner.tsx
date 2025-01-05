'use client';

import { useCallback, useRef, useState } from 'react';
import { Card, Button, Input, Space, message } from 'antd';
import { BarcodeOutlined, CameraOutlined } from '@ant-design/icons';
import BarcodeScanner from '@/app/components/scanner/BarcodeScanner';
import { useRouter } from 'next/navigation';

export default function BarcodeScannerPage() {
  const [barcode, setBarcode] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const router = useRouter();

  const handleScan = useCallback((result: string) => {
    setBarcode(result);
    setIsScanning(false);
    message.success('Code-barres détecté !');
  }, []);

  const handleError = useCallback((error: Error) => {
    message.error('Erreur lors de la lecture du code-barres');
    console.error(error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Scanner de Code-barres</h1>
        <Button onClick={() => router.back()}>Retour</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Scanner">
          <div className="space-y-4">
            {isScanning ? (
              <BarcodeScanner onDetected={handleScan} onError={handleError} />
            ) : (
              <div className="flex justify-center">
                <Button
                  type="primary"
                  icon={<CameraOutlined />}
                  onClick={() => setIsScanning(true)}
                >
                  Activer la caméra
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Card title="Résultat">
          <Space direction="vertical" className="w-full">
            <Input
              prefix={<BarcodeOutlined />}
              value={barcode}
              placeholder="Code-barres détecté"
              readOnly
            />
            {barcode && (
              <Button
                type="primary"
                onClick={() => {
                  // Handle the scanned barcode
                  router.push(`/parametrages/produits?barcode=${barcode}`);
                }}
              >
                Utiliser ce code-barres
              </Button>
            )}
          </Space>
        </Card>
      </div>
    </div>
  );
}
