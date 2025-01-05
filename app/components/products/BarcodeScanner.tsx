'use client';

import { Button } from 'antd';
import { BarcodeOutlined } from '@ant-design/icons';
import { useCallback } from 'react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
}

export default function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  const handleScan = useCallback(async () => {
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      // Here you would typically:
      // 1. Show a video preview
      // 2. Use a barcode scanning library (e.g., zxing)
      // 3. Process the barcode

      // For now, we'll simulate a scan
      const mockBarcode = Math.random().toString(36).substring(7);
      onScan(mockBarcode);

      // Clean up
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }, [onScan]);

  return (
    <Button icon={<BarcodeOutlined />} onClick={handleScan}>
      Scanner
    </Button>
  );
}
