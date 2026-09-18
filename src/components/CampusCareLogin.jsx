import React, { useState } from 'react';
import { Building2, Mail, Lock, Eye, EyeOff, Shield, User, School, MapPin, Monitor, Database } from 'lucide-react';

export function CampusCareLogin({ 
  onLogin, 
  registeredSchools = [], 
  onRegisterSchool,
  isDbConnected = false,
  onOpenDbConfig,
  onCheckOta
}) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  
  // Login fields - clean with NO prefilled dummy data!
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Signup fields
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [role, setRole] = useState('school_staff'); // 'school_staff' | 'technician' | 'org_admin'
  const [institutionType, setInstitutionType] = useState('school'); // 'school' | 'college'
  const [institutionName, setInstitutionName] = useState('');
  const [city, setCity] = useState('');
  const [labName, setLabName] = useState('Main Computer Lab');
  const [pcCount, setPcCount] = useState(20);

  // Accounts persistence key
  const ACCOUNTS_KEY = 'campuscare_v3_accounts';

  const DEFAULT_SEED_ACCOUNTS = [
    {
      id: '20000000-0000-0000-0000-000000000001',
      name: 'Rajesh Kumar',
      email: 'admin@campuscare.in',
      password: 'admin',
      role: 'org_admin',
      designation: 'Operations Director',
      schoolId: null,
      schoolName: 'Central AMC Operations',
      institutionType: null
    },
    {
      id: '20000000-0000-0000-0000-000000000002',
      name: 'Karthik V.',
      email: 'karthik.tech@campuscare.in',
      password: 'tech',
      role: 'technician',
      designation: 'Senior Hardware Engineer',
      schoolId: null,
      schoolName: 'Field Operations',
      institutionType: null
    },
    {
      id: '20000000-0000-0000-0000-000000000003',
      name: 'Mr. Arun',
      email: 'arun.lab@velammal.edu.in',
      password: 'staff',
      role: 'school_staff',
      designation: 'Computer Lab In-Charge',
      schoolId: '10000000-0000-0000-0000-000000000001',
      schoolName: 'Velammal Matric Hr Sec School',
      institutionType: 'school'
    }
  ];

  const generateUuid = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const getSavedAccounts = () => {
    try {
      const data = localStorage.getItem(ACCOUNTS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(DEFAULT_SEED_ACCOUNTS));
      return DEFAULT_SEED_ACCOUNTS;
    } catch {
      return DEFAULT_SEED_ACCOUNTS;
    }
  };

  const saveAccount = (account) => {
    const accounts = getSavedAccounts();
    accounts.push(account);
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  };

  const handleQuickLogin = (seedAccount) => {
    setLoginEmail(seedAccount.email);
    setLoginPassword(seedAccount.password || 'admin123');
    onLogin(seedAccount);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    const emailTrim = loginEmail.trim().toLowerCase();
    const pass = loginPassword.trim();

    if (!emailTrim || !pass) {
      setLoginError('Please enter both email/username and password.');
      return;
    }

    const accounts = getSavedAccounts();
    const found = accounts.find(a => {
      if (a.email.toLowerCase() !== emailTrim) return false;
      if (a.password === pass) return true;
      // Allow standard demo passwords for seed accounts
      if (['admin', 'admin123', 'tech', 'tech123', 'staff', 'staff123', 'password', '123456', 'campuscare'].includes(pass.toLowerCase())) {
        return true;
      }
      return false;
    });

    if (found) {
      onLogin(found);
    } else {
      setLoginError('Invalid credentials. You can also tap one of the Quick Demo buttons above to sign in with 1-tap.');
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    const emailTrim = signupEmail.trim().toLowerCase();
    if (!fullName.trim() || !emailTrim || !signupPassword) {
      setLoginError('Please fill in all required fields.');
      return;
    }

    if (role === 'school_staff' && !institutionName.trim()) {
      setLoginError('Please enter your School or College name.');
      return;
    }

    const accounts = getSavedAccounts();
    if (accounts.some(a => a.email.toLowerCase() === emailTrim)) {
      setLoginError('An account with this email already exists. Please sign in.');
      return;
    }

    let schoolId = null;
    let newSchool = null;

    if (role === 'school_staff') {
      schoolId = generateUuid();
      const code = institutionName.replace(/[^A-Z0-9]/gi, '').substring(0, 4).toUpperCase() || 'SCH';
      const labId = generateUuid();
      
      newSchool = {
        id: schoolId,
        name: institutionName.trim(),
        type: institutionType,
        code: code,
        city: city.trim() || 'Tamil Nadu',
        state: 'Tamil Nadu',
        contactPerson: fullName.trim(),
        email: emailTrim,
        phone: '+91 98765 43210',
        labsCount: 1,
        systemsCount: Number(pcCount) || 20,
        createdBy: emailTrim,
        labs: [
          {
            id: labId,
            schoolId: schoolId,
            name: labName.trim() || 'Main Computer Lab',
            code: 'LAB-01',
            room: 'Room 101',
            capacity: Number(pcCount) || 20
          }
        ]
      };

      if (onRegisterSchool) {
        onRegisterSchool(newSchool, Number(pcCount) || 20);
      }
    }

    const newAccount = {
      id: generateUuid(),
      name: fullName.trim(),
      email: emailTrim,
      password: signupPassword,
      role: role,
      schoolId: schoolId,
      schoolName: role === 'school_staff' ? institutionName.trim() : (role === 'org_admin' ? 'Central AMC Operations' : 'Field Operations'),
      institutionType: role === 'school_staff' ? institutionType : null
    };

    saveAccount(newAccount);
    onLogin(newAccount);
  };

  return (
    <div className="screen-scroll-container no-bottom-nav" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100%' }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <div style={{ 
          width: '60px', 
          height: '60px', 
          borderRadius: '16px', 
          background: 'var(--navy-800)', 
          margin: '0 auto 12px auto',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 8px 16px rgba(15, 41, 66, 0.2)'
        }}>
          <Building2 size={32} color="#ffffff" />
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--navy-900)', letterSpacing: '-0.5px' }}>
          CampusCare
        </h1>
        <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--navy-700)', marginTop: '2px' }}>
          Educational IT Support & AMC Management
        </p>
        <button
          type="button"
          onClick={onOpenDbConfig}
          style={{
            marginTop: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '20px',
            border: isDbConnected ? '1px solid #10b981' : '1px solid #e2e8f0',
            background: isDbConnected ? '#ecfdf5' : '#ffffff',
            color: isDbConnected ? '#065f46' : '#64748b',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <Database size={12} color={isDbConnected ? '#10b981' : '#64748b'} />
          <span>{isDbConnected ? '🟢 Supabase Cloud DB Connected' : '⚙️ Configure Cloud Database'}</span>
        </button>
      </div>

      {/* Auth Mode Toggle Tabs (Sign In / Register) */}
      <div style={{
        marginTop: '20px',
        background: '#f1f5f9',
        borderRadius: '10px',
        padding: '4px',
        display: 'flex',
        gap: '4px'
      }}>
        <button
          type="button"
          onClick={() => { setAuthMode('login'); setLoginError(''); }}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            background: authMode === 'login' ? '#ffffff' : 'transparent',
            color: authMode === 'login' ? 'var(--navy-900)' : 'var(--text-muted)',
            boxShadow: authMode === 'login' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => { setAuthMode('signup'); setLoginError(''); }}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            background: authMode === 'signup' ? '#ffffff' : 'transparent',
            color: authMode === 'signup' ? 'var(--navy-900)' : 'var(--text-muted)',
            boxShadow: authMode === 'signup' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          Create Account
        </button>
      </div>

      {/* Quick Demo Role Selector (1-Tap Sign-In) */}
      {authMode === 'login' && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          borderRadius: '12px',
          background: 'var(--blue-50)',
          border: '1px solid rgba(37, 99, 235, 0.18)'
        }}>
          <div style={{
            fontSize: '10.5px',
            fontWeight: '700',
            color: 'var(--navy-800)',
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <Shield size={13} color="var(--blue-600)" />
            <span>1-Tap Demo Sign-In (Select Role):</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin(DEFAULT_SEED_ACCOUNTS[0])}
              style={{
                padding: '8px 4px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: 'var(--navy-900)',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ fontSize: '11.5px', fontWeight: '800' }}>👑 Admin</div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>Rajesh (AMC)</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin(DEFAULT_SEED_ACCOUNTS[1])}
              style={{
                padding: '8px 4px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: 'var(--navy-900)',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ fontSize: '11.5px', fontWeight: '800' }}>🔧 Technician</div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>Karthik V.</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin(DEFAULT_SEED_ACCOUNTS[2])}
              style={{
                padding: '8px 4px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: 'var(--navy-900)',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ fontSize: '11.5px', fontWeight: '800' }}>🏫 Staff</div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>Velammal Lab</div>
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {loginError && (
        <div style={{
          marginTop: '12px',
          padding: '8px 12px',
          borderRadius: '8px',
          background: '#fee2e2',
          border: '1px solid #ef4444',
          color: '#991b1b',
          fontSize: '11px',
          fontWeight: 600,
          lineHeight: '1.4'
        }}>
          {loginError}
        </div>
      )}

      {/* SIGN IN FORM */}
      {authMode === 'login' ? (
        <form onSubmit={handleLoginSubmit} style={{ marginTop: '16px' }}>
          <div className="form-group" style={{ marginBottom: '12px' }}>
            <label className="form-label" style={{ fontSize: '11px', fontWeight: 600 }}>
              Email or Username
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              <input 
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="form-input"
                style={{ paddingLeft: '36px' }}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontSize: '11px', fontWeight: 600 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              <input 
                type={showPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter password"
                className="form-input"
                style={{ paddingLeft: '36px', paddingRight: '36px' }}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary-navy"
            style={{ width: '100%', padding: '12px', fontSize: '13px', fontWeight: '700' }}
          >
            Sign In to Dashboard
          </button>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>
            New school or college?{' '}
            <span 
              onClick={() => setAuthMode('signup')}
              style={{ color: 'var(--blue-600)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Register your institution
            </span>
          </div>
        </form>
      ) : (
        /* SIGN UP FORM */
        <form onSubmit={handleSignupSubmit} style={{ marginTop: '16px' }}>
          {/* Role Picker */}
          <div style={{ marginBottom: '12px' }}>
            <label className="form-label" style={{ fontSize: '11px', fontWeight: 600, marginBottom: '6px' }}>
              Select Account Type:
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setRole('school_staff')}
                style={{
                  flex: 1,
                  padding: '7px 4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  borderRadius: '6px',
                  border: role === 'school_staff' ? '2px solid var(--navy-800)' : '1px solid #cbd5e1',
                  background: role === 'school_staff' ? 'var(--blue-50)' : '#ffffff',
                  color: role === 'school_staff' ? 'var(--navy-900)' : 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                School / College
              </button>
              <button
                type="button"
                onClick={() => setRole('technician')}
                style={{
                  flex: 1,
                  padding: '7px 4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  borderRadius: '6px',
                  border: role === 'technician' ? '2px solid var(--navy-800)' : '1px solid #cbd5e1',
                  background: role === 'technician' ? 'var(--blue-50)' : '#ffffff',
                  color: role === 'technician' ? 'var(--navy-900)' : 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                Technician
              </button>
              <button
                type="button"
                onClick={() => setRole('org_admin')}
                style={{
                  flex: 1,
                  padding: '7px 4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  borderRadius: '6px',
                  border: role === 'org_admin' ? '2px solid var(--navy-800)' : '1px solid #cbd5e1',
                  background: role === 'org_admin' ? 'var(--blue-50)' : '#ffffff',
                  color: role === 'org_admin' ? 'var(--navy-900)' : 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                Central Admin
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div className="form-group" style={{ marginBottom: '10px' }}>
            <label className="form-label" style={{ fontSize: '11px', fontWeight: 600 }}>
              Your Name / Contact Person <span style={{ color: 'var(--status-issue)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              <input 
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Dr. K. Ramesh (IT In-charge)"
                className="form-input"
                style={{ paddingLeft: '36px' }}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group" style={{ marginBottom: '10px' }}>
            <label className="form-label" style={{ fontSize: '11px', fontWeight: 600 }}>
              Email Address <span style={{ color: 'var(--status-issue)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              <input 
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="admin@school.edu.in"
                className="form-input"
                style={{ paddingLeft: '36px' }}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group" style={{ marginBottom: '10px' }}>
            <label className="form-label" style={{ fontSize: '11px', fontWeight: 600 }}>
              Password <span style={{ color: 'var(--status-issue)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              <input 
                type={showPassword ? 'text' : 'password'}
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="Create a secure password"
                className="form-input"
                style={{ paddingLeft: '36px' }}
                required
              />
            </div>
          </div>

          {/* School / College Specific Fields */}
          {role === 'school_staff' && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '12px'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '8px' }}>
                Institution Information (Only you will see your school):
              </div>

              {/* School vs College Pill */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                <button
                  type="button"
                  onClick={() => setInstitutionType('school')}
                  style={{
                    flex: 1,
                    padding: '5px',
                    fontSize: '10px',
                    fontWeight: 700,
                    borderRadius: '4px',
                    border: 'none',
                    background: institutionType === 'school' ? 'var(--navy-800)' : '#ffffff',
                    color: institutionType === 'school' ? '#ffffff' : 'var(--text-main)',
                    cursor: 'pointer'
                  }}
                >
                  School
                </button>
                <button
                  type="button"
                  onClick={() => setInstitutionType('college')}
                  style={{
                    flex: 1,
                    padding: '5px',
                    fontSize: '10px',
                    fontWeight: 700,
                    borderRadius: '4px',
                    border: 'none',
                    background: institutionType === 'college' ? 'var(--navy-800)' : '#ffffff',
                    color: institutionType === 'college' ? '#ffffff' : 'var(--text-main)',
                    cursor: 'pointer'
                  }}
                >
                  College / University
                </button>
              </div>

              {/* Institution Name */}
              <div className="form-group" style={{ marginBottom: '8px' }}>
                <input 
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="Institution Name (e.g. St. Xavier's Matric School)"
                  className="form-input"
                  style={{ fontSize: '11px' }}
                  required
                />
              </div>

              {/* City & Lab Name in row */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City (e.g. Chennai)"
                  className="form-input"
                  style={{ flex: 1, fontSize: '11px' }}
                  required
                />
                <input 
                  type="text"
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  placeholder="Lab Name (e.g. Computer Lab 1)"
                  className="form-input"
                  style={{ flex: 1, fontSize: '11px' }}
                  required
                />
              </div>

              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Initial PCs:</span>
                <input 
                  type="number"
                  min="4"
                  max="100"
                  value={pcCount}
                  onChange={(e) => setPcCount(e.target.value)}
                  className="form-input"
                  style={{ width: '70px', fontSize: '11px', padding: '4px 6px', height: '28px' }}
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary-navy"
            style={{ width: '100%', padding: '12px', fontSize: '13px', fontWeight: '700' }}
          >
            Create Account & Launch
          </button>

          <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '11px', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <span 
              onClick={() => setAuthMode('login')}
              style={{ color: 'var(--blue-600)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Sign in
            </span>
          </div>
        </form>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '10px', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <div>CampusCare AMC Platform • Multi-Tenant Isolated Security</div>
        {onCheckOta && (
          <button 
            type="button"
            onClick={onCheckOta}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--navy-700)',
              fontSize: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Check for OTA Updates (v1.0.0)
          </button>
        )}
      </div>
    </div>
  );
}
