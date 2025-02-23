import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRCodeScannerProps {
  onScanSuccess: (ticketData: {
    ticketId: string;
    eventTitle: string;
    userName: string;
    eventDate: string;
  }) => void;
  onScanError: (error: string) => void;
}

const QRCodeScanner = ({ onScanSuccess, onScanError }: QRCodeScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Initialize scanner
    scannerRef.current = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scannerRef.current.render(
      // Success callback
      (decodedText: string) => {
        try {
          const ticketData = JSON.parse(decodedText);
          onScanSuccess(ticketData);
          setIsScanning(false);
          if (scannerRef.current) {
            scannerRef.current.clear();
          }
        } catch (error) {
          onScanError('Invalid QR code format');
        }
      },
      // Error callback
      (error: any) => {
        onScanError(error?.message || 'Failed to scan QR code');
      }
    );

    setIsScanning(true);

    // Cleanup
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [onScanSuccess, onScanError]);

  return (
    <div className="qr-scanner-container">
      <div id="qr-reader" style={{ width: '100%', maxWidth: '600px' }} />
      {isScanning && (
        <p className="text-center mt-4">
          Position the QR code within the frame to scan
        </p>
      )}
    </div>
  );
};

export default QRCodeScanner;
