'use client';

import { useCallback, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

export function useScanner() {
  const codeReader = useRef(new BrowserMultiFormatReader());

  const startScanning = useCallback(
    async (
      videoElement: HTMLVideoElement,
      onDetected: (result: string) => void,
    ) => {
      try {
        // List all video input devices (cameras)
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        
        // If no video devices are found, throw an error
        if (devices.length === 0) {
          throw new Error('Aucune caméra disponible');
        }

        // Select the first video device (or choose based on your needs)
        const selectedDeviceId = devices[0].deviceId;

        // Stop any existing video streams to avoid conflicts
        const existingStream = videoElement.srcObject as MediaStream;
        if (existingStream) {
          existingStream.getTracks().forEach(track => track.stop());
        }

        // Start decoding from the selected video device
        await codeReader.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoElement,
          (result) => {
            if (result) {
              onDetected(result.getText());
            }
          },
        );
      } catch (error) {
        console.error('Error starting scanner:', error);
        throw error;
      }
    },
    [],
  );

  const stopScanning = useCallback((videoElement: HTMLVideoElement) => {
    try {
      // Stop all video tracks to clean up the stream
      const currentStream = (videoElement.srcObject as MediaStream);
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
      // Reset the codeReader instance for next use
      codeReader.current = new BrowserMultiFormatReader();
    } catch (error) {
      console.error('Error stopping scanner:', error);
    }
  }, []);

  return {
    startScanning,
    stopScanning: (videoElement: HTMLVideoElement) => stopScanning(videoElement),
  };
}
