'use client';

import { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { message } from 'antd';
import { useScanner } from '@/app/hooks/useScanner';

interface BarcodeScannerProps {
  onDetected: (result: string) => void;
  onError: (error: Error) => void;
}

export default function BarcodeScanner({
  onDetected,
  onError,
}: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { startScanning, stopScanning } = useScanner();

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        if (videoRef.current) {
          await startScanning(videoRef.current, onDetected);
        }
      } catch (error) {
        // Improved error handling: log error to console and show a user-friendly message
        console.error('Scanner initialization error:', error);
        onError(error as Error);  // Call the parent's error handler
        message.error('Impossible de démarrer le scanner. Veuillez réessayer.');
      }
    };

    // Initialize scanner when component mounts
    initializeScanner();

    // Cleanup function to stop scanning when the component unmounts
    return () => {
      if (videoRef.current) {
        stopScanning(videoRef.current);
      }
    };
  }, [onDetected, onError, startScanning, stopScanning]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        className="w-full rounded-lg"
        style={{ maxHeight: '400px' }}
      />
      <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none" />
    </div>
  );
}
