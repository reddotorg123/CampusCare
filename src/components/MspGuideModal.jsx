import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Building2, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sliders, 
  Eye, 
  Tv, 
  Users, 
  Sparkles,
  Zap
} from 'lucide-react';
import { ROOM_ARRANGEMENTS, INITIAL_SCHOOLS } from '../data/labData';

export function MspGuideModal({
  onClose,
  schools = INITIAL_SCHOOLS,
  currentSchoolId,
  onSelectSchool,
  onSelectLab
}) {
  // Active Chapter: 'arrangements' | 'multischool' | 'scaling' | 'roles'
  const [activeChapter, setActiveChapter] = useState('arrangements');
  const [selectedArrangementId, setSelectedArrangementId] = useState('u_shape');

  const selectedArrangement = ROOM_ARRANGEMENTS.find(r => r.id === selectedArrangementId) || ROOM_ARRANGEMENTS[0];

  // Quick switch to a demo lab that demonstrates this layout
  const handleApplyLayoutDemo = (layoutId) => {
    for (const school of schools) {
      const lab = school.labs.find(l => l.layoutType === layoutId);
      if (lab) {
        onSelectSchool(school.id);
        onSelectLab(lab.id);
        onClose();
        return;
      }
    }
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
        padding: '12px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '480px',
          height: '92vh',
          maxHeight: '750px',
          background: 'var(--bg-panel)',
          borderRadius: '20px',
          border: '1px solid var(--cisco-blue)',
          boxShadow: '0 25px 50px -12px rgba(0, 188, 235, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.22s ease-out'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'rgba(0, 188, 235, 0.15)',
                color: 'var(--cisco-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--cisco-blue)'
              }}
            >
              <BookOpen size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.2px' }}>
                Multi-School & Room Arrangements
              </h2>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Masterclass for IT Support & MSP Engineers
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="icon-btn"
            style={{ width: '32px', height: '32px' }}
            aria-label="Close Guide"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div 
          style={{
            display: 'flex',
            background: 'var(--bg-surface-active)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '4px',
            gap: '4px',
            overflowX: 'auto'
          }}
        >
          <button
            onClick={() => setActiveChapter('arrangements')}
            style={{
              flex: 1,
              padding: '8px 6px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              border: 'none',
              background: activeChapter === 'arrangements' ? 'var(--cisco-blue)' : 'transparent',
              color: activeChapter === 'arrangements' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s'
            }}
          >
            <span>🏛️ 4 Room Setups</span>
          </button>

          <button
            onClick={() => setActiveChapter('multischool')}
            style={{
              flex: 1,
              padding: '8px 6px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              border: 'none',
              background: activeChapter === 'multischool' ? 'var(--cisco-blue)' : 'transparent',
              color: activeChapter === 'multischool' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s'
            }}
          >
            <span>🏫 Client Schools</span>
          </button>

          <button
            onClick={() => setActiveChapter('scaling')}
            style={{
              flex: 1,
              padding: '8px 6px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              border: 'none',
              background: activeChapter === 'scaling' ? 'var(--cisco-blue)' : 'transparent',
              color: activeChapter === 'scaling' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s'
            }}
          >
            <span>⚡ 4 to 100 PCs</span>
          </button>

          <button
            onClick={() => setActiveChapter('roles')}
            style={{
              flex: 1,
              padding: '8px 6px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              border: 'none',
              background: activeChapter === 'roles' ? 'var(--cisco-blue)' : 'transparent',
              color: activeChapter === 'roles' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s'
            }}
          >
            <span>👥 Dual-Role</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {/* CHAPTER 1: THE 4 PHYSICAL ROOM ARRANGEMENTS */}
          {activeChapter === 'arrangements' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'rgba(0, 188, 235, 0.08)', border: '1px solid rgba(0, 188, 235, 0.25)', borderRadius: '12px', padding: '12px' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--cisco-blue)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Educational Architecture & Arrangements
                </span>
                <p style={{ fontSize: '12px', margin: '4px 0 0 0', color: 'var(--text-main)', lineHeight: '1.45' }}>
                  Schools arrange their computer labs differently depending on <strong>instructor supervision</strong>, <strong>cabling raceways</strong>, and <strong>class pedagogical goals</strong>. Tap each setup below to explore:
                </p>
              </div>

              {/* Layout Arrangement Selector Pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {ROOM_ARRANGEMENTS.map(layout => {
                  const isSelected = layout.id === selectedArrangementId;
                  return (
                    <button
                      key={layout.id}
                      onClick={() => setSelectedArrangementId(layout.id)}
                      style={{
                        padding: '10px',
                        borderRadius: '12px',
                        background: isSelected ? 'var(--bg-surface-active)' : 'var(--bg-surface)',
                        border: isSelected ? `2px solid ${layout.accentColor}` : '1px solid var(--border-subtle)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '18px' }}>{layout.icon}</span>
                        {isSelected && (
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: layout.accentColor }} />
                        )}
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: isSelected ? layout.accentColor : 'var(--text-main)' }}>
                        {layout.shortName}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: '1.2' }}>
                        {layout.tagline}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Breakdown of Selected Arrangement */}
              <div 
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: '14px',
                  border: `1px solid ${selectedArrangement.accentColor}44`,
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{selectedArrangement.icon}</span>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: selectedArrangement.accentColor }}>
                        {selectedArrangement.title}
                      </h3>
                      <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                        Best for: {selectedArrangement.bestFor}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SVG Visual Floor Plan Thumbnail */}
                <div 
                  style={{
                    height: '130px',
                    background: 'var(--bg-primary)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <svg viewBox="0 0 300 130" style={{ width: '100%', height: '100%' }}>
                    {selectedArrangementId === 'u_shape' && (
                      <g>
                        {/* Top Bay */}
                        <rect x="20" y="10" width="260" height="20" rx="4" fill="rgba(0, 188, 235, 0.12)" stroke="var(--cisco-blue)" strokeDasharray="2 2" />
                        <text x="150" y="23" textAnchor="middle" fill="var(--cisco-blue)" fontSize="8" fontWeight="bold">🖨️ PRINTER BAY & SWITCH</text>
                        {/* Left Wall Desks */}
                        <rect x="20" y="38" width="30" height="82" rx="4" fill="rgba(0, 188, 235, 0.2)" stroke="var(--cisco-blue)" />
                        <text x="35" y="82" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold">LEFT</text>
                        {/* Back Wall Desks */}
                        <rect x="58" y="98" width="184" height="22" rx="4" fill="rgba(0, 188, 235, 0.2)" stroke="var(--cisco-blue)" />
                        <text x="150" y="112" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold">BACK WALL ROW</text>
                        {/* Right Wall Desks */}
                        <rect x="250" y="38" width="30" height="82" rx="4" fill="rgba(0, 188, 235, 0.2)" stroke="var(--cisco-blue)" />
                        <text x="265" y="82" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold">RIGHT</text>
                        {/* Center Teacher View */}
                        <circle cx="150" cy="62" r="16" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" />
                        <text x="150" y="65" textAnchor="middle" fill="#10b981" fontSize="6.5" fontWeight="bold">TEACHER</text>
                        {/* 360 Sight lines */}
                        <line x1="150" y1="62" x2="45" y2="62" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
                        <line x1="150" y1="62" x2="255" y2="62" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
                        <line x1="150" y1="62" x2="150" y2="100" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
                      </g>
                    )}

                    {selectedArrangementId === 'classroom_rows' && (
                      <g>
                        {/* Front Board */}
                        <rect x="30" y="8" width="240" height="18" rx="4" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" />
                        <text x="150" y="20" textAnchor="middle" fill="#10b981" fontSize="8" fontWeight="bold">🖥️ SMART BOARD & INSTRUCTOR</text>
                        {/* Rows */}
                        {[0, 1, 2].map(r => (
                          <g key={r} transform={`translate(0, ${36 + r * 28})`}>
                            <rect x="30" y="0" width="240" height="20" rx="4" fill="rgba(255, 255, 255, 0.04)" stroke="var(--border-subtle)" />
                            <text x="42" y="13" fill="var(--text-dim)" fontSize="7" fontWeight="bold">ROW {r + 1}</text>
                            {[0, 1, 2, 3].map(c => (
                              <rect key={c} x={75 + c * 48} y="3" width="34" height="14" rx="2" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="0.8" />
                            ))}
                          </g>
                        ))}
                      </g>
                    )}

                    {selectedArrangementId === 'cluster_pods' && (
                      <g>
                        <rect x="30" y="8" width="240" height="18" rx="4" fill="rgba(236, 72, 153, 0.12)" stroke="#ec4899" />
                        <text x="150" y="20" textAnchor="middle" fill="#ec4899" fontSize="8" fontWeight="bold">🔬 3D PRINTER & MAKER STAGING</text>
                        {/* Pod 1 & 2 */}
                        <g transform="translate(85, 50)">
                          <rect x="-42" y="-18" width="84" height="36" rx="6" fill="rgba(236, 72, 153, 0.15)" stroke="#ec4899" />
                          <text x="0" y="3" textAnchor="middle" fill="#ec4899" fontSize="7" fontWeight="bold">POD 1 (4 PCs)</text>
                        </g>
                        <g transform="translate(215, 50)">
                          <rect x="-42" y="-18" width="84" height="36" rx="6" fill="rgba(236, 72, 153, 0.15)" stroke="#ec4899" />
                          <text x="0" y="3" textAnchor="middle" fill="#ec4899" fontSize="7" fontWeight="bold">POD 2 (4 PCs)</text>
                        </g>
                        {/* Pod 3 & 4 */}
                        <g transform="translate(85, 96)">
                          <rect x="-42" y="-18" width="84" height="36" rx="6" fill="rgba(236, 72, 153, 0.15)" stroke="#ec4899" />
                          <text x="0" y="3" textAnchor="middle" fill="#ec4899" fontSize="7" fontWeight="bold">POD 3 (4 PCs)</text>
                        </g>
                        <g transform="translate(215, 96)">
                          <rect x="-42" y="-18" width="84" height="36" rx="6" fill="rgba(236, 72, 153, 0.15)" stroke="#ec4899" />
                          <text x="0" y="3" textAnchor="middle" fill="#ec4899" fontSize="7" fontWeight="bold">POD 4 (4 PCs)</text>
                        </g>
                        {/* Central Aisle */}
                        <line x1="150" y1="30" x2="150" y2="120" stroke="var(--cisco-grid-accent)" strokeWidth="1" strokeDasharray="3 3" />
                      </g>
                    )}

                    {selectedArrangementId === 'dual_bank' && (
                      <g>
                        <rect x="25" y="8" width="115" height="18" rx="4" fill="rgba(139, 92, 246, 0.15)" stroke="#8b5cf6" />
                        <text x="82" y="20" textAnchor="middle" fill="#8b5cf6" fontSize="7" fontWeight="bold">TEACHER</text>
                        <rect x="160" y="8" width="115" height="18" rx="4" fill="rgba(139, 92, 246, 0.15)" stroke="#8b5cf6" />
                        <text x="217" y="20" textAnchor="middle" fill="#8b5cf6" fontSize="7" fontWeight="bold">PRINTER BAY</text>
                        {/* Left Wing Bank */}
                        <rect x="25" y="34" width="115" height="85" rx="6" fill="rgba(139, 92, 246, 0.15)" stroke="#8b5cf6" />
                        <text x="82" y="80" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">LEFT POD BANK</text>
                        {/* Center Proctors Walkway */}
                        <line x1="150" y1="30" x2="150" y2="125" stroke="var(--cisco-grid-accent)" strokeWidth="1.5" strokeDasharray="3 3" />
                        <text x="150" y="78" textAnchor="middle" fill="var(--text-dim)" fontSize="6" transform="rotate(-90 150 78)">AISLE</text>
                        {/* Right Wing Bank */}
                        <rect x="160" y="34" width="115" height="85" rx="6" fill="rgba(139, 92, 246, 0.15)" stroke="#8b5cf6" />
                        <text x="217" y="80" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">RIGHT POD BANK</text>
                      </g>
                    )}
                  </svg>
                </div>

                {/* Educational Analysis Points */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ marginTop: '2px', color: selectedArrangement.accentColor }}><Eye size={14} /></div>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)' }}>Screen Visibility & Supervision: </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{selectedArrangement.pedagogicalBenefit}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ marginTop: '2px', color: selectedArrangement.accentColor }}><Zap size={14} /></div>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)' }}>Cabling & Raceways: </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{selectedArrangement.cablingStrategy}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ marginTop: '2px', color: selectedArrangement.accentColor }}><Building2 size={14} /></div>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)' }}>Client School Example: </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{selectedArrangement.typicalSchools.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Button: Try this layout now */}
                <button
                  onClick={() => handleApplyLayoutDemo(selectedArrangement.id)}
                  className="action-btn-primary"
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '12px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginTop: '4px'
                  }}
                >
                  <span>⚡ Jump to Live School Map with this Layout</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* CHAPTER 2: MULTI-SCHOOL MSP ARCHITECTURE */}
          {activeChapter === 'multischool' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px', padding: '12px' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#10b981', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Managed Services Provider (MSP) Topology
                </span>
                <p style={{ fontSize: '12px', margin: '4px 0 0 0', color: 'var(--text-main)', lineHeight: '1.45' }}>
                  As an IT Support company, you manage contracts across <strong>multiple independent school campuses</strong>. Each school has its own custom labs, contract SLA, and designated lead field engineer.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Current Client Schools Managed ({schools.length})
                </span>

                {schools.map(sch => {
                  const isCurrent = sch.id === currentSchoolId;
                  const totalDevices = sch.labs.reduce((acc, l) => acc + l.devices.length, 0);

                  return (
                    <div
                      key={sch.id}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        background: isCurrent ? 'var(--bg-surface-active)' : 'var(--bg-surface)',
                        border: isCurrent ? `2px solid ${sch.accentColor}` : '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ 
                            padding: '3px 7px', 
                            borderRadius: '6px', 
                            fontSize: '10px', 
                            fontWeight: 800, 
                            background: `${sch.accentColor}22`, 
                            color: sch.accentColor 
                          }}>
                            {sch.code}
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                            {sch.name}
                          </span>
                        </div>
                        {isCurrent && (
                          <span className="badge badge-operational" style={{ fontSize: '9px' }}>Active School</span>
                        )}
                      </div>

                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        📍 {sch.campus} • 🛡️ {sch.contractTier}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', marginTop: '2px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                          {sch.labs.length} Labs ({totalDevices} Total Devices) • Lead: <strong>{sch.leadEngineer}</strong>
                        </span>

                        <button
                          onClick={() => {
                            onSelectSchool(sch.id);
                            onSelectLab(sch.labs[0].id);
                            onClose();
                          }}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: 600,
                            background: isCurrent ? 'var(--cisco-blue)' : 'var(--bg-surface-active)',
                            color: isCurrent ? '#fff' : 'var(--text-main)',
                            border: '1px solid var(--border-subtle)',
                            cursor: 'pointer'
                          }}
                        >
                          {isCurrent ? 'Viewing Map' : 'Switch School'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CHAPTER 3: SCALING 4 TO 100 COMPUTERS */}
          {activeChapter === 'scaling' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '12px', padding: '12px' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Dynamic Geometric Scaling Engine
                </span>
                <p style={{ fontSize: '12px', margin: '4px 0 0 0', color: 'var(--text-main)', lineHeight: '1.45' }}>
                  Schools have computer labs ranging from <strong>4 systems</strong> (faculty micro-labs or kindergarten corners) to <strong>100 systems</strong> (campus testing centers). The app handles this automatically.
                </p>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                  How the Math Works Under the Hood:
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  <div>
                    <strong style={{ color: 'var(--cisco-blue)' }}>1. Dynamic Desk Coordinate Calculation:</strong>
                    <div>Rather than hardcoding positions, coordinates are computed using parametric functions based on room width (380px) and calculated height.</div>
                  </div>

                  <div>
                    <strong style={{ color: '#10b981' }}>2. Bench & Port Tagging:</strong>
                    <div>Every workstation automatically receives a physical bench tag (`L-01`, `R1-04`, `P2-03`) and an assigned switch port (`Fa0/01` to `Fa0/24`) matching physical label printers.</div>
                  </div>

                  <div>
                    <strong style={{ color: '#ec4899' }}>3. Vector Responsive Canvas:</strong>
                    <div>For labs with 4-24 PCs, the map fits 100% inside your mobile screen with zero scrolling. For mega labs (48-100 PCs), the canvas seamlessly enables smooth vertical scrolling while maintaining crisp Packet Tracer node aesthetics.</div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main)' }}>
                  Try the Admin Lab Designer
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 10px 0' }}>
                  Switch to <strong>IT MSP Admin</strong> mode and tap the <strong>Sliders icon</strong> to design a new room, set the system count slider from 4 to 100, and choose your preferred arrangement!
                </p>
              </div>
            </div>
          )}

          {/* CHAPTER 4: DUAL-ROLE SCREENING */}
          {activeChapter === 'roles' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '12px', padding: '12px' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#8b5cf6', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Role-Based Screening & Field Operations
                </span>
                <p style={{ fontSize: '12px', margin: '4px 0 0 0', color: 'var(--text-main)', lineHeight: '1.45' }}>
                  The application adapts its tools based on who is logged in: the <strong>IT Support MSP Team</strong> or the <strong>School Client (Faculty & Admin)</strong>.
                </p>
              </div>

              {/* Role 1: IT MSP Admin / Engineer */}
              <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(0, 188, 235, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(0, 188, 235, 0.15)', color: 'var(--cisco-blue)', fontSize: '10px', fontWeight: 800 }}>
                    ROLE 1: IT MSP ADMIN / FIELD ENGINEER
                  </span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>Design school lab layouts and select physical arrangements (U-Shape, Rows, Pods, Dual-Bank).</li>
                  <li>Configure hardware specifications (CPU, RAM, OS, Storage, IP Subnets).</li>
                  <li>Inspect devices in Cisco Packet Tracer CLI terminal & toggle power simulation.</li>
                  <li>Log physical on-site visits with work summaries and attended ticket checklists.</li>
                </ul>
              </div>

              {/* Role 2: School Client Faculty */}
              <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '10px', fontWeight: 800 }}>
                    ROLE 2: SCHOOL CLIENT (FACULTY & IN-CHARGE)
                  </span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>Raise instant tickets with 1-tap presets (Paper Jam, Blue Screen, Broken Mouse).</li>
                  <li>Monitor real-time status of all computers and printers before student classes arrive.</li>
                  <li>Review engineer visit logs to see <strong>which engineer came</strong> and what tickets they repaired.</li>
                  <li>Provide faculty sign-off on resolved physical maintenance.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
            NetLab MSP Architecture v5.0
          </span>
          <button
            onClick={onClose}
            className="action-btn-primary"
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            Got It! Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
