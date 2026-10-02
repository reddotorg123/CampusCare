import React, { useState } from 'react';
import { ArrowDownCircle, Sparkles, X, CheckCircle2, RefreshCw, ExternalLink } from 'lucide-react';
import { applyOtaUpdate } from '../services/otaService';

export function OtaUpdateModal({ otaInfo, onClose }) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!otaInfo) return null;

  const handleUpdate = async () => {
    setIsUpdating(true);
    await applyOtaUpdate(otaInfo);
  };

  const isUpToDate = !otaInfo.updateAvailable;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '380px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          border: '1px solid var(--border-mid, #e2e8f0)',
          animation: 'slideUp 0.3s ease-out'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div style={{
          background: isUpToDate 
            ? 'linear-gradient(135deg, #065f46 0%, #047857 100%)'
            : 'linear-gradient(135deg, #0f2942 0%, #1e4e79 100%)',
          padding: '20px 20px 16px 20px',
          color: '#ffffff',
          position: 'relative'
        }}>
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>

          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px'
          }}>
            {isUpToDate ? (
              <CheckCircle2 size={24} color="#a7f3d0" />
            ) : (
              <ArrowDownCircle size={24} color="#60a5fa" />
            )}
          </div>

          <div style={{ fontSize: '17px', fontWeight: '800', letterSpacing: '-0.01em' }}>
            {isUpToDate ? "You're Running the Latest Version" : 'New Update Available'}
          </div>
          <div style={{ fontSize: '11px', color: isUpToDate ? '#d1fae5' : '#93c5fd', marginTop: '2px' }}>
            {isUpToDate 
              ? `CampusCare v${otaInfo.currentVersion} (Build ${otaInfo.buildNumber || 4}) is up to date` 
              : `CampusCare v${otaInfo.latestVersion} is ready to install`}
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            background: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            marginBottom: '14px'
          }}>
            <div>
              <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Installed Version</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>v{otaInfo.currentVersion}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: isUpToDate ? '#059669' : '#2563eb', textTransform: 'uppercase', fontWeight: '700' }}>
                {isUpToDate ? 'System Status' : 'Latest Release'}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: isUpToDate ? '#059669' : '#1d4ed8' }}>
                {isUpToDate ? '✓ Latest' : `v${otaInfo.latestVersion}`}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
              {isUpToDate ? 'Active Features & Optimizations:' : "What's New in this Version:"}
            </div>
            <div style={{
              fontSize: '11.5px',
              lineHeight: '1.5',
              color: '#475569',
              background: '#f1f5f9',
              padding: '10px 12px',
              borderRadius: '8px'
            }}>
              {otaInfo.changelog || 'Google Login, interactive checklists, real-time lab system counts, and cloud sync.'}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {isUpToDate ? (
              <button
                onClick={onClose}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#059669',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <CheckCircle2 size={16} />
                <span>All Good / Close</span>
              </button>
            ) : (
              <>
                <button
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Later
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  style={{
                    flex: 2,
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--blue-600, #2563eb)',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: isUpdating ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw size={15} className="spin-animation" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      {otaInfo.isNative ? <ExternalLink size={15} /> : <Sparkles size={15} />}
                      <span>{otaInfo.isNative ? 'Download & Install' : 'Update Now'}</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
