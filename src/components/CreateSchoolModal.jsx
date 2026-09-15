import React, { useState } from 'react';
import { 
  X, 
  School, 
  Building2, 
  Sparkles, 
  Check, 
  Palette 
} from 'lucide-react';

export function CreateSchoolModal({
  onClose,
  onCreateSchool
}) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [campus, setCampus] = useState('Main Campus');
  const [accentColor, setAccentColor] = useState('#00bceb');
  const [initialLabName, setInitialLabName] = useState('Computer Lab 1');
  const [initialLabRoom, setInitialLabRoom] = useState('Room 101');

  const COLOR_OPTIONS = [
    { label: 'Cisco Cyan', hex: '#00bceb' },
    { label: 'Emerald Green', hex: '#10b981' },
    { label: 'Electric Purple', hex: '#8b5cf6' },
    { label: 'Rose Pink', hex: '#ec4899' },
    { label: 'Amber Gold', hex: '#f59e0b' },
    { label: 'Royal Blue', hex: '#3b82f6' }
  ];

  const handleNameChange = (val) => {
    setName(val);
    if (!code || code.length <= 4) {
      const generated = val
        .split(' ')
        .map(w => w[0])
        .join('')
        .slice(0, 4)
        .toUpperCase();
      setCode(generated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const schoolId = `sch-${Date.now().toString(36)}`;
    const labId = `lab-${schoolId}-1`;
    const finalCode = code.trim().toUpperCase() || 'SCH';

    const newLab = {
      id: labId,
      schoolId: schoolId,
      schoolName: name.trim(),
      schoolCode: finalCode,
      name: initialLabName.trim() || 'Computer Lab 1',
      code: `${finalCode}-LAB1`,
      room: initialLabRoom.trim() || 'Room 101',
      building: 'Main Block',
      layoutType: 'u_shape',
      accentColor: accentColor,
      totalPCs: 16,
      totalPrinters: 1,
      mapBounds: { width: 380, height: 520 },
      devices: [
        {
          id: `${labId}-teacher`,
          name: 'Teacher Podium',
          code: 'TEACHER-PC',
          type: 'pc',
          status: 'operational',
          ip: '192.168.10.15',
          bench: 'Podium',
          coords: { x: 190, y: 220 },
          hardware: { model: 'Instructor PC AIO', cpu: 'Intel Core i7', ram: '16 GB', os: 'Windows 11 Pro', powerState: true },
          tickets: []
        },
        {
          id: `${labId}-printer`,
          name: 'Network Printer 01',
          code: 'PRN-01',
          type: 'printer',
          status: 'operational',
          ip: '192.168.10.10',
          bench: 'Print Bay',
          coords: { x: 190, y: 55 },
          hardware: { model: 'Network LaserJet MFP', tonerLevel: 100, paperLevel: 100, paperStatus: 'Ready / Online', queueCount: 0, powerState: true },
          tickets: []
        }
      ]
    };

    // Add 8 starter workstations along perimeter
    for (let i = 1; i <= 8; i++) {
      const padNum = String(i).padStart(2, '0');
      const isLeft = i <= 4;
      newLab.devices.push({
        id: `${labId}-pc-${padNum}`,
        name: `Workstation ${padNum}`,
        code: `PC-${padNum}`,
        bench: isLeft ? `Desk-L${i}` : `Desk-R${i - 4}`,
        type: 'pc',
        status: 'operational',
        ip: `192.168.10.${20 + i}`,
        coords: isLeft 
          ? { x: 60, y: 140 + (i - 1) * 75 }
          : { x: 320, y: 140 + (i - 5) * 75 },
        hardware: { model: 'Dell OptiPlex Workstation', cpu: 'Intel Core i5', ram: '16 GB', os: 'Windows 11 Edu', powerState: true },
        tickets: []
      });
    }

    const newSchool = {
      id: schoolId,
      name: name.trim(),
      code: finalCode,
      campus: campus.trim() || 'Main Campus',
      contactPerson: 'IT Administrator',
      phone: '',
      contractTier: 'Managed IT Services',
      leadEngineer: 'Support Team',
      accentColor: accentColor,
      labs: [newLab]
    };

    onCreateSchool(newSchool, newLab);
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 250,
        background: 'rgba(5, 10, 20, 0.85)',
        backdropFilter: 'blur(8px)',
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
          maxWidth: '420px',
          background: 'var(--bg-surface)',
          borderRadius: '18px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          animation: 'slideUp 0.18s ease-out'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '14px 18px',
          background: 'var(--bg-panel)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '8px', 
              background: `${accentColor}22`,
              border: `1px solid ${accentColor}55`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accentColor
            }}>
              <School size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                Add Real School
              </h2>
              <p style={{ fontSize: '11px', color: 'var(--text-dim)', margin: 0 }}>
                Register your actual school & starting computer lab
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="icon-btn"
            style={{ width: '28px', height: '28px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '16px 18px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* School Name */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '5px' }}>
              School / Institution Name <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input 
              type="text"
              required
              placeholder="e.g. Greenwood High School"
              value={name}
              onChange={e => handleNameChange(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* School Code & Campus */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '5px' }}>
                Short Code
              </label>
              <input 
                type="text"
                maxLength={5}
                placeholder="e.g. GHS"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                style={{
                  width: '100%',
                  padding: '9px 10px',
                  borderRadius: '8px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--cisco-blue)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '5px' }}>
                Campus / Branch
              </label>
              <input 
                type="text"
                placeholder="e.g. Main Campus / South Wing"
                value={campus}
                onChange={e => setCampus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '12.5px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Theme Color Picker */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
              <Palette size={12} color="var(--text-dim)" />
              <span>Map Accent Theme</span>
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {COLOR_OPTIONS.map(c => (
                <button
                  type="button"
                  key={c.hex}
                  onClick={() => setAccentColor(c.hex)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: c.hex,
                    border: accentColor === c.hex ? '2px solid #ffffff' : '2px solid transparent',
                    boxShadow: accentColor === c.hex ? `0 0 10px ${c.hex}88` : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}
                  title={c.label}
                >
                  {accentColor === c.hex && <Check size={16} strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>

          {/* First Computer Lab Configuration */}
          <div style={{
            background: 'var(--bg-primary)',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--cisco-blue)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={13} />
              <span>First Computer Lab in this School</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10.5px', color: 'var(--text-dim)', marginBottom: '4px' }}>
                  Lab / Room Name
                </label>
                <input 
                  type="text"
                  value={initialLabName}
                  onChange={e => setInitialLabName(e.target.value)}
                  placeholder="e.g. CS Lab 1"
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '12px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10.5px', color: 'var(--text-dim)', marginBottom: '4px' }}>
                  Room Number
                </label>
                <input 
                  type="text"
                  value={initialLabRoom}
                  onChange={e => setInitialLabRoom(e.target.value)}
                  placeholder="e.g. Room 204"
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '12px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="action-btn-primary"
              style={{
                flex: 2,
                padding: '10px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={14} />
              <span>Create School & Map</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
