import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  KeyRound, 
  Server, 
  Flame, 
  Sparkles,
  Layers
} from 'lucide-react';
import { 
  getSupabaseCredentials, 
  saveSupabaseCredentials, 
  testSupabaseConnection, 
  isSupabaseConfigured,
  getSupabaseClient
} from '../supabaseClient';

export default function SupabaseConfigModal({ isOpen, onClose, onConfigSaved }) {
  const [activeTab, setActiveTab] = useState('supabase'); // 'supabase' | 'firebase'
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      setUrl(creds.url || '');
      setKey(creds.key || '');
      setTestResult(null);
      setVerifyResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection(url, key);
    setTestResult(res);
    setTesting(false);
  };

  const handleSave = async () => {
    setSaving(true);
    saveSupabaseCredentials(url, key);
    setTimeout(() => {
      setSaving(false);
      if (onConfigSaved) onConfigSaved({ isConnected: isSupabaseConfigured() });
      onClose();
    }, 300);
  };

  const handleVerifyTables = async () => {
    setVerifying(true);
    setVerifyResult(null);
    saveSupabaseCredentials(url, key);

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setVerifyResult({ success: false, error: 'Supabase client not initialized.' });
        setVerifying(false);
        return;
      }

      const { data: schools, error: sErr } = await supabase.from('schools').select('id').limit(1);
      const { data: tickets, error: tErr } = await supabase.from('tickets').select('id').limit(1);

      if (sErr || tErr) {
        const msg = (sErr?.message || '') + ' ' + (tErr?.message || '');
        setVerifyResult({ 
          success: false, 
          error: `Table check: ${msg}. If RLS policy error, run supabase/enable_direct_access.sql in Supabase SQL Editor.` 
        });
      } else {
        setVerifyResult({
          success: true,
          message: `Live Supabase tables operational! Found ${schools?.length || 0} schools and ${tickets?.length || 0} tickets.`
        });
        if (onConfigSaved) onConfigSaved({ isConnected: true, reloaded: true });
      }
    } catch (err) {
      setVerifyResult({ success: false, error: err.message });
    }
    setVerifying(false);
  };

  const handleResetToLocal = () => {
    saveSupabaseCredentials('', '');
    setUrl('');
    setKey('');
    setTestResult({ success: true, message: 'Switched to Local Offline Mode. Data will save in browser cache.' });
    if (onConfigSaved) onConfigSaved({ isConnected: false });
    setTimeout(onClose, 600);
  };

  const isConfigured = isSupabaseConfigured();

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '480px',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 35px -5px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e2e8f0',
          background: 'var(--navy-900)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(0, 188, 235, 0.2)',
              border: '1px solid rgba(0, 188, 235, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00bceb'
            }}>
              <Database size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: '800' }}>
                  Database Sync Settings
                </span>
                <span style={{
                  fontSize: '9.5px',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '12px',
                  background: isConfigured ? '#ecfdf5' : '#fffbeb',
                  color: isConfigured ? '#047857' : '#b45309',
                  border: isConfigured ? '1px solid #a7f3d0' : '1px solid #fde68a'
                }}>
                  {isConfigured ? '🟢 Live Connected' : '🟡 Local Mode'}
                </span>
              </div>
              <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                Connect PostgreSQL (Supabase) or view Firebase guide
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Selection (Supabase vs Firebase) */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc',
          padding: '4px 16px',
          gap: '8px'
        }}>
          <button
            onClick={() => setActiveTab('supabase')}
            style={{
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              borderBottom: activeTab === 'supabase' ? '2px solid #00bceb' : '2px solid transparent',
              background: 'transparent',
              color: activeTab === 'supabase' ? 'var(--navy-900)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Database size={14} color="#00bceb" />
            <span>Supabase (PostgreSQL)</span>
            <span style={{ fontSize: '9px', background: '#e0f2fe', color: '#0369a1', padding: '1px 5px', borderRadius: '4px' }}>
              Native
            </span>
          </button>

          <button
            onClick={() => setActiveTab('firebase')}
            style={{
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              borderBottom: activeTab === 'firebase' ? '2px solid #f59e0b' : '2px solid transparent',
              background: 'transparent',
              color: activeTab === 'firebase' ? 'var(--navy-900)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Flame size={14} color="#f59e0b" />
            <span>Firebase</span>
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeTab === 'supabase' ? (
            <>
              {/* Status Banner */}
              <div style={{
                padding: '12px 14px',
                borderRadius: '10px',
                border: isConfigured ? '1px solid #a7f3d0' : '1px solid #cbd5e1',
                background: isConfigured ? '#ecfdf5' : '#f8fafc',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <Server size={18} color={isConfigured ? '#059669' : '#64748b'} style={{ marginTop: '2px', flexShrink: 0 }} />
                <div style={{ fontSize: '11.5px', lineHeight: '1.45', color: isConfigured ? '#065f46' : '#334155' }}>
                  {isConfigured ? (
                    <div>
                      <strong>Connected to Live Cloud Database!</strong>
                      <div>Tickets, technicians, lab computers, and layouts sync in real time.</div>
                    </div>
                  ) : (
                    <div>
                      <strong>Running in Local Offline Mode.</strong>
                      <div>Data is currently stored in your browser's LocalStorage. Enter your Supabase credentials below to connect to live cloud tables.</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Input Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '5px' }}>
                    Supabase Project URL
                  </label>
                  <input 
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12.5px',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '5px' }}>
                    Supabase Public Anon Key
                  </label>
                  <textarea 
                    rows={2}
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '11.5px',
                      fontFamily: 'monospace',
                      resize: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Test & Seed Messages */}
              {testResult && (
                <div style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '11.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: testResult.success ? '#ecfdf5' : '#fef2f2',
                  border: testResult.success ? '1px solid #10b981' : '1px solid #ef4444',
                  color: testResult.success ? '#065f46' : '#991b1b'
                }}>
                  {testResult.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  <span>{testResult.message || testResult.warning || testResult.error}</span>
                </div>
              )}

              {verifyResult && (
                <div style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '11.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: verifyResult.success ? '#ecfdf5' : '#fef2f2',
                  border: verifyResult.success ? '1px solid #10b981' : '1px solid #ef4444',
                  color: verifyResult.success ? '#065f46' : '#991b1b'
                }}>
                  {verifyResult.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  <span>{verifyResult.message || verifyResult.error}</span>
                </div>
              )}

              {/* Setup Helper Accordion */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid #e2e8f0',
                fontSize: '11px',
                color: '#475569'
              }}>
                <div style={{ fontWeight: 700, color: 'var(--navy-900)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ShieldCheck size={14} color="#00bceb" />
                  <span>How to connect your free Supabase DB in 2 minutes:</span>
                </div>
                <ol style={{ paddingLeft: '16px', lineHeight: '1.6' }}>
                  <li>Go to <strong>supabase.com</strong> and create a free project.</li>
                  <li>In Supabase Dashboard, open <strong>Project Settings ➔ API</strong> and copy your URL & Anon Key.</li>
                  <li>Open the <strong>SQL Editor</strong> in Supabase and run the provided schema at <code style={{ color: '#0284c7' }}>supabase/schema.sql</code> and <code style={{ color: '#0284c7' }}>supabase/enable_direct_access.sql</code>.</li>
                  <li>Paste the keys here and click <strong>"Verify Live Tables"</strong>, then <strong>"Save & Sync"</strong>!</li>
                </ol>
              </div>
            </>
          ) : (
            /* Firebase Tab Guide */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                padding: '12px',
                background: '#fffbeb',
                borderRadius: '10px',
                border: '1px solid #fde68a',
                color: '#92400e',
                fontSize: '11.5px',
                lineHeight: '1.5'
              }}>
                <strong>Firebase Architecture Notice:</strong>
                <div>This application was specifically architected with PostgreSQL relational schemas (<code style={{ color: '#0369a1' }}>supabase/schema.sql</code>) for institutional hierarchy (Organizations ➔ Schools ➔ Labs ➔ Workstations ➔ Tickets).</div>
              </div>

              <div style={{ fontSize: '12px', color: '#334155', lineHeight: '1.5' }}>
                <p style={{ marginBottom: '8px' }}>
                  <strong>Why Supabase is recommended for CampusCare:</strong>
                </p>
                <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>
                    <strong>Pre-built SQL Schema:</strong> The repository includes full PostgreSQL tables, enums, triggers, and seed data under the <code style={{ color: '#0284c7' }}>supabase/</code> folder.
                  </li>
                  <li>
                    <strong>Native C++ / Qt6 Client Support:</strong> The included <code style={{ color: '#0284c7' }}>qt-client/</code> desktop app directly speaks to Supabase PostgREST endpoints.
                  </li>
                  <li>
                    <strong>Instant Realtime:</strong> Live WebSocket synchronization works out of the box with zero cloud functions.
                  </li>
                </ul>
              </div>

              <div style={{
                padding: '10px 12px',
                borderRadius: '8px',
                background: '#f1f5f9',
                fontSize: '11px',
                color: '#64748b'
              }}>
                💡 If you need to connect to Firebase Firestore instead, you can export your Firestore config object to <code style={{ color: '#0284c7' }}>src/firebaseClient.js</code>. We recommend using the provided Supabase backend for instant zero-configuration setup!
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid #e2e8f0',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}>
          <button 
            type="button"
            onClick={handleResetToLocal}
            style={{
              fontSize: '11.5px',
              color: '#ef4444',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Clear / Offline Mode
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {activeTab === 'supabase' && (
              <>
                <button
                  type="button"
                  onClick={handleTest}
                  disabled={testing || !url.trim() || !key.trim()}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#e2e8f0',
                    border: 'none',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: testing ? 'not-allowed' : 'pointer',
                    color: 'var(--navy-900)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    opacity: (!url.trim() || !key.trim()) ? 0.6 : 1
                  }}
                >
                  {testing && <RefreshCw size={12} className="animate-spin" />}
                  <span>Test Ping</span>
                </button>

                <button
                  type="button"
                  onClick={handleVerifyTables}
                  disabled={verifying || !url.trim() || !key.trim()}
                  title="Verify newly created Supabase tables without inserting fake data"
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: verifying ? 'not-allowed' : 'pointer',
                    color: '#15803d',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    opacity: (!url.trim() || !key.trim()) ? 0.6 : 1
                  }}
                >
                  {verifying ? <RefreshCw size={12} className="animate-spin" /> : <ShieldCheck size={12} />}
                  <span>Verify Live Tables</span>
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'var(--navy-800)',
                    border: 'none',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {saving ? <RefreshCw size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                  <span>Save & Sync</span>
                </button>
              </>
            )}

            {activeTab === 'firebase' && (
              <button
                type="button"
                onClick={() => setActiveTab('supabase')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: 'var(--navy-800)',
                  border: 'none',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: '#ffffff'
                }}
              >
                Switch to Supabase Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
