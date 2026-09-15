import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, AlertCircle, RefreshCw, X, ExternalLink, ShieldCheck, KeyRound, Server } from 'lucide-react';
import { getSupabaseCredentials, saveSupabaseCredentials, testSupabaseConnection, isSupabaseConfigured } from '../supabaseClient';

export default function SupabaseConfigModal({ isOpen, onClose, onConfigSaved }) {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      setUrl(creds.url || '');
      setKey(creds.key || '');
      setTestResult(null);
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
    }, 400);
  };

  const handleResetToLocal = () => {
    saveSupabaseCredentials('', '');
    setUrl('');
    setKey('');
    setTestResult({ success: true, message: 'Switched to Local Offline / Demo Mode.' });
    if (onConfigSaved) onConfigSaved({ isConnected: false });
    setTimeout(onClose, 600);
  };

  const isConfigured = isSupabaseConfigured();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Supabase Backend Sync
                <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${
                  isConfigured 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {isConfigured ? '🟢 Live Backend' : '🟡 Local Mode'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">Connect to your Supabase PostgreSQL cloud database</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar text-slate-200 text-sm">
          {/* Status banner */}
          <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            isConfigured 
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200' 
              : 'bg-slate-800/60 border-slate-700/70 text-slate-300'
          }`}>
            <Server className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isConfigured ? 'text-emerald-400' : 'text-slate-400'}`} />
            <div className="text-xs leading-relaxed">
              {isConfigured ? (
                <span><strong>Connected to Supabase.</strong> Tickets, technician actions, and assets sync in real-time with your PostgreSQL tables.</span>
              ) : (
                <span><strong>Running in Local Demo Mode.</strong> Fully operational with offline mock school labs, tickets, and diagnostics. Enter your Supabase credentials below to connect to live cloud tables.</span>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                Supabase Project URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-project-id.supabase.co"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                Supabase Anon / Public API Key
              </label>
              <textarea
                rows={2}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono resize-none"
              />
            </div>
          </div>

          {/* Test results */}
          {testResult && (
            <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
              testResult.success 
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' 
                : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
            }`}>
              {testResult.success ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
              )}
              <div>{testResult.message || testResult.error || testResult.warning}</div>
            </div>
          )}

          {/* Quick Setup Guide */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-400 space-y-1.5">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              How to get these keys from Supabase:
            </div>
            <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] leading-normal text-slate-400">
              <li>Open your project at <strong className="text-slate-200">supabase.com</strong>.</li>
              <li>Go to <strong className="text-slate-200">Project Settings</strong> ➔ <strong className="text-slate-200">API</strong>.</li>
              <li>Copy the <strong className="text-slate-200">Project URL</strong> and <strong className="text-slate-200">anon public key</strong>.</li>
              <li>Ensure you executed <code className="text-blue-400 font-mono">supabase/schema.sql</code> in the SQL Editor.</li>
            </ol>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <button
            type="button"
            onClick={handleResetToLocal}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
          >
            Clear / Use Local
          </button>
          
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleTest}
              disabled={testing || !url.trim() || !key.trim()}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
              Test Ping
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
              Save & Sync
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
