import React, { useState } from 'react';
import { Building2, Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';

export function CampusCareLogin({ onLogin }) {
  const [email, setEmail] = useState('admin@campuscare.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('org_admin');

  const handleRoleSelect = (role, defaultEmail) => {
    setSelectedRole(role);
    setEmail(defaultEmail);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onLogin({
      role: selectedRole,
      email: email,
      name: selectedRole === 'org_admin' ? 'Admin (Rajesh)' : selectedRole === 'technician' ? 'Karthik V. (Technician)' : 'Mr. Arun (Lab Staff)'
    });
  };

  return (
    <div className="screen-scroll-container no-bottom-nav" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100%' }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        {/* Navy Building Emblem */}
        <div style={{ 
          width: '64px', 
          height: '64px', 
          borderRadius: '16px', 
          background: 'var(--navy-800)', 
          margin: '0 auto 16px auto',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 8px 16px rgba(15, 41, 66, 0.2)'
        }}>
          <Building2 size={36} color="#ffffff" />
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--navy-900)', letterSpacing: '-0.5px' }}>
          CampusCare
        </h1>
        <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--navy-700)', marginTop: '4px' }}>
          IT AMC & Support Management
        </p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', letterSpacing: '0.2px' }}>
          Schools &nbsp;|&nbsp; Colleges &nbsp;|&nbsp; Technicians &nbsp;|&nbsp; Together
        </p>
      </div>

      {/* Role Picker for Instant Testing */}
      <div style={{ marginTop: '20px', background: 'var(--blue-50)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(37, 99, 235, 0.15)' }}>
        <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--navy-700)', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Shield size={12} /> Select Active Role to Test:
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            type="button"
            onClick={() => handleRoleSelect('org_admin', 'admin@campuscare.in')}
            style={{
              flex: 1,
              padding: '6px 4px',
              fontSize: '11px',
              fontWeight: '600',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: selectedRole === 'org_admin' ? 'var(--navy-800)' : '#ffffff',
              color: selectedRole === 'org_admin' ? '#ffffff' : 'var(--text-main)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            Org Admin
          </button>
          <button 
            type="button"
            onClick={() => handleRoleSelect('technician', 'karthik.tech@campuscare.in')}
            style={{
              flex: 1,
              padding: '6px 4px',
              fontSize: '11px',
              fontWeight: '600',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: selectedRole === 'technician' ? 'var(--navy-800)' : '#ffffff',
              color: selectedRole === 'technician' ? '#ffffff' : 'var(--text-main)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            Technician
          </button>
          <button 
            type="button"
            onClick={() => handleRoleSelect('school_staff', 'arun.lab@velammal.edu.in')}
            style={{
              flex: 1,
              padding: '6px 4px',
              fontSize: '11px',
              fontWeight: '600',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: selectedRole === 'school_staff' ? 'var(--navy-800)' : '#ffffff',
              color: selectedRole === 'school_staff' ? '#ffffff' : 'var(--text-main)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            School Staff
          </button>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div className="form-group">
          <div style={{ position: 'relative' }}>
            <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            <input 
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email / Username"
              className="form-input"
              style={{ paddingLeft: '36px' }}
              required
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '8px' }}>
          <div style={{ position: 'relative' }}>
            <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            <input 
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="form-input"
              style={{ paddingLeft: '36px', paddingRight: '36px' }}
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '10px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <span style={{ fontSize: '11px', color: 'var(--blue-600)', fontWeight: '600', cursor: 'pointer' }}>
            Forgot password?
          </span>
        </div>

        <button type="submit" className="btn-primary-navy" style={{ padding: '14px' }}>
          Login
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '22px 0', color: 'var(--text-light)', fontSize: '11px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
          <span style={{ padding: '0 12px' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
        </div>

        {/* Social SSO Buttons */}
        <button 
          type="button"
          onClick={handleSubmit}
          className="btn-secondary-outline"
          style={{ width: '100%', marginBottom: '10px', padding: '11px' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          Continue with Google
        </button>

        <button 
          type="button"
          onClick={handleSubmit}
          className="btn-secondary-outline"
          style={{ width: '100%', padding: '11px' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <rect fill="#F25022" x="1" y="1" width="10" height="10"/>
            <rect fill="#7FBA00" x="13" y="1" width="10" height="10"/>
            <rect fill="#00A4EF" x="1" y="13" width="10" height="10"/>
            <rect fill="#FFB900" x="13" y="13" width="10" height="10"/>
          </svg>
          Continue with Microsoft
        </button>
      </form>

      {/* Footer Tagline */}
      <div style={{ textAlign: 'center', marginTop: '24px', paddingBottom: '10px' }}>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Reliable Systems. Better Learning.
        </p>
      </div>
    </div>
  );
}
