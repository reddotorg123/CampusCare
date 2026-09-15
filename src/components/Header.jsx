import React, { useState } from 'react';
import { 
  Layers, 
  ChevronDown, 
  Sun, 
  Moon, 
  AlertCircle, 
  CheckCircle2, 
  Sliders, 
  UserCheck, 
  Shield, 
  Building2,
  BookOpen,
  School,
  Sparkles,
  Hammer,
  Plus
} from 'lucide-react';
import { ROOM_ARRANGEMENTS } from '../data/labData';

export function Header({ 
  schools = [],
  currentSchoolId,
  onSelectSchool,
  labs, 
  currentLabId, 
  onSelectLab, 
  theme, 
  onToggleTheme, 
  tickets,
  currentRole, // 'admin' | 'school'
  onToggleRole,
  onOpenDesigner,
  onOpenVisits,
  onOpenGuide,
  onOpenCreateMap,
  onOpenCreateSchool,
  onDeleteSchool,
  isBuilderMode = false,
  onToggleBuilderMode
}) {
  const [schoolDropdownOpen, setSchoolDropdownOpen] = useState(false);
  const [labDropdownOpen, setLabDropdownOpen] = useState(false);

  const currentSchool = schools.find(s => s.id === currentSchoolId) || schools[0] || {
    id: 'sch-main',
    name: 'School Campus',
    code: 'SCH',
    accentColor: '#00bceb'
  };

  const currentLab = labs.find(l => l.id === currentLabId) || labs[0] || {
    name: 'Computer Lab',
    room: 'Room 101',
    devices: [],
    layoutType: 'u_shape'
  };

  const activeTicketsCount = tickets.filter(
    t => t.labId === currentLabId && t.status !== 'resolved'
  ).length;

  const currentArrangement = ROOM_ARRANGEMENTS.find(r => r.id === currentLab.layoutType) || ROOM_ARRANGEMENTS[0];
  const isAdmin = currentRole === 'admin';

  // Labs filtered for current school
  const currentSchoolLabs = labs.filter(l => l.schoolId === currentSchool.id || !l.schoolId);

  return (
    <header className="app-header">
      {/* ROW 1: School Identity & Global Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '6px' }}>
        {/* Left: Brand Icon + School Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
          <div 
            className="cisco-logo-mark" 
            title="NetLab Managed IT Services"
            style={{ width: '28px', height: '28px', borderRadius: '8px' }}
          >
            <Layers size={16} />
          </div>

          <button 
            onClick={() => {
              setSchoolDropdownOpen(!schoolDropdownOpen);
              setLabDropdownOpen(false);
            }}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              padding: '3px 8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              textAlign: 'left',
              minWidth: 0,
              maxWidth: '180px'
            }}
            aria-label="Select Client School"
          >
            <span 
              style={{
                fontSize: '9.5px',
                fontWeight: 800,
                padding: '1px 5px',
                borderRadius: '4px',
                background: `${currentSchool.accentColor || '#00bceb'}22`,
                color: currentSchool.accentColor || '#00bceb',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {currentSchool.code || 'SCH'}
            </span>
            <span 
              style={{
                fontSize: '11.5px',
                fontWeight: 700,
                color: 'var(--text-main)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {currentSchool.name}
            </span>
            <ChevronDown size={12} color="var(--text-dim)" style={{ transform: schoolDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
          </button>
        </div>

        {/* Right: Teach Me + Admin Toggle + Theme */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
          {/* "TEACH ME" Guide Button */}
          <button
            onClick={onOpenGuide}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '14px',
              fontSize: '10.5px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, rgba(0, 188, 235, 0.2), rgba(16, 185, 129, 0.2))',
              color: '#00bceb',
              border: '1px solid rgba(0, 188, 235, 0.4)',
              boxShadow: '0 0 10px rgba(0, 188, 235, 0.2)',
              cursor: 'pointer'
            }}
            title="Open Room Arrangements & Multi-School Masterclass"
          >
            <BookOpen size={12} />
            <span>🎓 Teach Me</span>
          </button>

          {/* Dual-Role Switcher */}
          <button
            onClick={onToggleRole}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 7px',
              borderRadius: '14px',
              fontSize: '10px',
              fontWeight: 700,
              background: isAdmin ? 'rgba(0, 188, 235, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: isAdmin ? 'var(--cisco-blue)' : '#10b981',
              border: isAdmin ? '1px solid var(--cisco-blue)' : '1px solid #10b981',
              cursor: 'pointer'
            }}
            title={isAdmin ? 'Switch to School Client View' : 'Switch to IT Support Admin View'}
          >
            {isAdmin ? <Shield size={11} /> : <Building2 size={11} />}
            <span>{isAdmin ? 'Admin' : 'School'}</span>
          </button>

          {/* Theme Toggle */}
          <button 
            className="icon-btn" 
            onClick={onToggleTheme} 
            title={theme === 'dark' ? 'Classic Light' : 'Dark Blueprint'}
            aria-label="Toggle Theme"
            style={{ width: '28px', height: '28px' }}
          >
            {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
          </button>
        </div>
      </div>

      {/* ROW 2: Room Selection & Physical Arrangement Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '6px' }}>
        {/* Left: Lab Room Selector + Arrangement Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1 }}>
          <button 
            onClick={() => {
              setLabDropdownOpen(!labDropdownOpen);
              setSchoolDropdownOpen(false);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '2px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              textAlign: 'left',
              minWidth: 0
            }}
            aria-label="Select Lab"
          >
            <span 
              style={{
                fontSize: '12.5px',
                fontWeight: 800,
                color: 'var(--text-main)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '135px'
              }}
            >
              {currentLab.name}
            </span>
            <ChevronDown size={12} color="var(--cisco-blue)" style={{ transform: labDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
          </button>

          {/* Room Arrangement Tag */}
          <span 
            style={{
              fontSize: '9.5px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '6px',
              background: `${currentArrangement?.accentColor || '#00bceb'}18`,
              color: currentArrangement?.accentColor || 'var(--cisco-blue)',
              border: `1px solid ${currentArrangement?.accentColor || '#00bceb'}44`,
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              flexShrink: 0
            }}
          >
            <span>{currentArrangement?.icon}</span>
            <span>{currentArrangement?.shortName}</span>
          </span>
        </div>

        {/* Right: Room Actions (Builder Mode + Designer + Visits + Status) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
          {/* Admin: Builder Mode Drag & Drop Quick Toggle */}
          {isAdmin && (
            <button 
              onClick={onToggleBuilderMode}
              style={{
                padding: '3px 8px',
                borderRadius: '8px',
                fontSize: '10px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                background: isBuilderMode ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--bg-surface)',
                color: isBuilderMode ? '#ffffff' : 'var(--cisco-blue)',
                border: isBuilderMode ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                boxShadow: isBuilderMode ? '0 0 8px rgba(16, 185, 129, 0.35)' : 'none',
                cursor: 'pointer'
              }}
              title="Drag and drop desks to customize positions"
            >
              <Hammer size={11} />
              <span>{isBuilderMode ? 'Done' : 'Edit Map'}</span>
            </button>
          )}

          {/* Admin: Auto-Layout Designer */}
          {isAdmin && (
            <button 
              className="icon-btn"
              onClick={onOpenDesigner}
              title="Configure Room Layout (4-100 PCs)"
              aria-label="Design Lab Layout"
              style={{ color: 'var(--cisco-blue)', width: '28px', height: '28px' }}
            >
              <Sliders size={14} />
            </button>
          )}

          {/* Both: Engineer Visits Log */}
          <button
            className="icon-btn"
            onClick={onOpenVisits}
            title="View On-site Engineer Visits & Sign-offs"
            aria-label="Engineer Visits"
            style={{ width: '28px', height: '28px' }}
          >
            <UserCheck size={14} />
          </button>

          {/* Active Health / Issue Badge */}
          {activeTicketsCount > 0 ? (
            <span className="badge badge-critical" style={{ fontSize: '9px', padding: '2px 6px' }}>
              {activeTicketsCount} Issue{activeTicketsCount > 1 ? 's' : ''}
            </span>
          ) : (
            <span className="badge badge-operational" style={{ fontSize: '9px', padding: '2px 6px' }}>
              ✓ OK
            </span>
          )}
        </div>
      </div>

      {/* 1. SCHOOL SELECTOR MODAL / DROPDOWN */}
      {schoolDropdownOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '85px'
          }}
          onClick={() => setSchoolDropdownOpen(false)}
        >
          <div 
            style={{
              width: '92%',
              maxWidth: '380px',
              background: 'var(--bg-surface)',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              animation: 'slideUp 0.18s ease-out'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <School size={14} color="var(--cisco-blue)" />
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--cisco-blue)' }}>
                  Switch Client School
                </span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{schools.length} Schools</span>
            </div>

            <div style={{ padding: '8px' }}>
              {schools.map(school => {
                const isSelected = school.id === currentSchool.id;
                const schoolTickets = tickets.filter(t => t.schoolId === school.id && t.status !== 'resolved').length;

                return (
                  <button
                    key={school.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSchool(school.id);
                      setSchoolDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      marginBottom: '6px',
                      background: isSelected ? 'var(--bg-surface-active)' : 'transparent',
                      border: isSelected ? `1.5px solid ${school.accentColor}` : '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ 
                          padding: '1px 5px', 
                          borderRadius: '4px', 
                          fontSize: '9px', 
                          fontWeight: 800, 
                          background: `${school.accentColor}22`, 
                          color: school.accentColor 
                        }}>
                          {school.code}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: '13px', color: isSelected ? school.accentColor : 'var(--text-main)' }}>
                          {school.name}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {school.campus} • {school.labs.length} Labs
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '1px' }}>
                        Lead: {school.leadEngineer} • {school.contractTier.split('(')[0]}
                      </div>
                    </div>

                    {schoolTickets > 0 ? (
                      <span className="badge badge-critical" style={{ fontSize: '9px' }}>
                        {schoolTickets} issue{schoolTickets > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="badge badge-operational" style={{ fontSize: '9px' }}>
                        ✓ Healthy
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {isAdmin && (
              <div style={{ padding: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  className="action-btn-primary"
                  style={{ width: '100%', fontSize: '12px', padding: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  onClick={() => {
                    setSchoolDropdownOpen(false);
                    if (onOpenCreateSchool) onOpenCreateSchool();
                  }}
                >
                  <Plus size={14} />
                  <span>+ Add New School</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. LAB SELECTOR MODAL / DROPDOWN */}
      {labDropdownOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '85px'
          }}
          onClick={() => setLabDropdownOpen(false)}
        >
          <div 
            style={{
              width: '92%',
              maxWidth: '380px',
              background: 'var(--bg-surface)',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              animation: 'slideUp 0.18s ease-out'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--cisco-blue)' }}>
                  {currentSchool.name} Labs
                </span>
                <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Choose a room to view its live floor arrangement</div>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{currentSchoolLabs.length} Rooms</span>
            </div>

            <div style={{ padding: '8px' }}>
              {currentSchoolLabs.map(lab => {
                const labTickets = tickets.filter(t => t.labId === lab.id && t.status !== 'resolved').length;
                const isSelected = lab.id === currentLabId;
                const arrangement = ROOM_ARRANGEMENTS.find(r => r.id === lab.layoutType) || ROOM_ARRANGEMENTS[0];

                return (
                  <button
                    key={lab.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLab(lab.id);
                      setLabDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      marginBottom: '6px',
                      background: isSelected ? 'var(--bg-surface-active)' : 'transparent',
                      border: isSelected ? '1px solid var(--cisco-blue)' : '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 700, fontSize: '13px', color: isSelected ? 'var(--cisco-blue)' : 'var(--text-main)' }}>
                          {lab.name}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <span>{lab.room}</span>
                        <span>•</span>
                        <span style={{ 
                          fontSize: '9.5px', 
                          fontWeight: 700, 
                          color: arrangement?.accentColor || 'var(--cisco-blue)' 
                        }}>
                          {arrangement?.icon} {arrangement?.shortName}
                        </span>
                        <span>•</span>
                        <span>{lab.devices.length} Devices</span>
                      </div>
                    </div>

                    {labTickets > 0 ? (
                      <span className="badge badge-critical" style={{ fontSize: '9px' }}>
                        {labTickets} issue{labTickets > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="badge badge-operational" style={{ fontSize: '9px' }}>
                        ✓ Healthy
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {isAdmin && (
              <div style={{ padding: '8px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {/* 1. Create Custom Map */}
                <button
                  className="action-btn-primary"
                  style={{ width: '100%', fontSize: '12px', padding: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  onClick={() => {
                    setLabDropdownOpen(false);
                    if (onOpenCreateMap) onOpenCreateMap();
                  }}
                >
                  <Plus size={14} />
                  <span>+ Create Custom School Map</span>
                </button>

                {/* 2. Configure / Template Designer */}
                <button
                  style={{
                    width: '100%',
                    fontSize: '11.5px',
                    padding: '8px',
                    borderRadius: '8px',
                    background: 'var(--bg-surface-active)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setLabDropdownOpen(false);
                    onOpenDesigner();
                  }}
                >
                  <Sliders size={13} />
                  <span>Auto-Layout Designer (4-100 PCs)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
