import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  Camera, 
  Flashlight, 
  CheckCircle2, 
  Search,
  Monitor,
  Printer
} from 'lucide-react';

export function QrScannerModal({
  labs,
  onClose,
  onDeviceScanned
}) {
  const [torchOn, setTorchOn] = useState(false);
  const [manualCode, setManualCode] = useState('');

  const sampleTags = [
    { code: 'PC-L1-04', name: 'CS Lab 1 - Bench 04 Workstation', labId: 'lab-cs-1', type: 'pc' },
    { code: 'PRN-LAB1-01', name: 'HP LaserJet Pro M404n', labId: 'lab-cs-1', type: 'printer' },
    { code: 'PC-L1-12', name: 'CS Lab 1 - Bench 12 Workstation', labId: 'lab-cs-1', type: 'pc' },
    { code: 'PLOTTER-CANON', name: 'Canon imagePROGRAF Wide Plotter', labId: 'lab-cad-2', type: 'printer' },
    { code: 'MFP-LIB-MAIN', name: 'Kyocera Heavy Duty MFP', labId: 'lab-lib-3', type: 'printer' }
  ];

  const handleScanSample = (tag) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([30, 50, 30]);
    }
    // Find device in labs
    const lab = labs.find(l => l.id === tag.labId);
    if (lab) {
      const dev = lab.devices.find(d => d.code === tag.code);
      if (dev) {
        onDeviceScanned(dev, lab);
        onClose();
      }
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    for (const lab of labs) {
      const dev = lab.devices.find(d => 
        d.code.toLowerCase() === manualCode.trim().toLowerCase() ||
        d.id.toLowerCase() === manualCode.trim().toLowerCase()
      );
      if (dev) {
        onDeviceScanned(dev, lab);
        onClose();
        return;
      }
    }
    alert(`No device found with asset tag "${manualCode}". Try PC-L1-04 or PRN-LAB1-01.`);
  };

  return (
    <div className="modal-fullscreen-sheet" style={{ background: '#020617' }}>
      {/* Header */}
      <div className="modal-header" style={{ background: '#090d16' }}>
        <div className="modal-title">
          <QrCode size={20} style={{ color: 'var(--cisco-blue)' }} />
          <span>Asset Tag QR Scanner</span>
        </div>

        <button className="icon-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
      </div>

      <div className="modal-content-scroll" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '10px' }}>
          Align camera with the QR code on the computer chassis or printer top panel.
        </div>

        {/* Camera Viewfinder Box with Scanning Laser */}
        <div className="qr-scanner-frame" style={{ background: torchOn ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.5)' }}>
          <div className="qr-laser-line" />
          <QrCode size={110} style={{ color: 'rgba(255,255,255,0.15)' }} />

          {/* Corner Viewfinder Marks */}
          <div style={{ position: 'absolute', top: 12, left: 12, width: 24, height: 24, borderTop: '3px solid #00bceb', borderLeft: '3px solid #00bceb' }} />
          <div style={{ position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderTop: '3px solid #00bceb', borderRight: '3px solid #00bceb' }} />
          <div style={{ position: 'absolute', bottom: 12, left: 12, width: 24, height: 24, borderBottom: '3px solid #00bceb', borderLeft: '3px solid #00bceb' }} />
          <div style={{ position: 'absolute', bottom: 12, right: 12, width: 24, height: 24, borderBottom: '3px solid #00bceb', borderRight: '3px solid #00bceb' }} />
        </div>

        {/* Torch Button */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          <button
            className="icon-btn"
            style={{ width: '44px', height: '44px', borderRadius: '50%', color: torchOn ? '#f59e0b' : '#94a3b8' }}
            onClick={() => setTorchOn(!torchOn)}
            title="Toggle Flashlight"
          >
            <Flashlight size={20} />
          </button>
        </div>

        {/* Simulated Field Barcode Stickers */}
        <div style={{ textAlign: 'left', maxWidth: '360px', margin: '0 auto 20px auto' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--cisco-blue)', marginBottom: '8px', textTransform: 'uppercase' }}>
            Simulate Scanning Lab Bench Asset Tag:
          </div>

          <div style={{ display: 'grid', gap: '8px' }}>
            {sampleTags.map(tag => (
              <button
                key={tag.code}
                onClick={() => handleScanSample(tag)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {tag.type === 'printer' ? <Printer size={18} style={{ color: 'var(--cisco-blue)' }} /> : <Monitor size={18} style={{ color: 'var(--cisco-blue)' }} />}
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '13px', color: '#f8fafc' }}>
                      {tag.code}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{tag.name}</div>
                  </div>
                </div>

                <span className="badge badge-operational" style={{ fontSize: '10px' }}>
                  Tap Scan
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Asset Code Input */}
        <form onSubmit={handleManualSubmit} style={{ maxWidth: '360px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Or type asset tag (e.g. PC-L1-04)..."
              value={manualCode}
              onChange={e => setManualCode(e.target.value)}
              style={{ flex: 1, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}
            />
            <button type="submit" className="action-btn-primary" style={{ padding: '0 16px' }}>
              Look up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
