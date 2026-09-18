import React, { useState } from 'react';
import { ArrowLeft, Search, ChevronRight, School, GraduationCap, Building2 } from 'lucide-react';

export function CampusCareSchoolsList({ 
  schools = [], 
  currentUser,
  onSelectSchool, 
  onBack 
}) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'school' | 'college'
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Strictly enforce data isolation:
  // If school_staff, ONLY show their own school!
  const visibleSchools = currentUser?.role === 'school_staff'
    ? schools.filter(s => s.id === currentUser.schoolId || s.name === currentUser.schoolName)
    : schools;

  const schoolCount = visibleSchools.filter(s => s.type === 'school').length;
  const collegeCount = visibleSchools.filter(s => s.type === 'college').length;

  const filteredSchools = visibleSchools.filter(s => {
    const matchesFilter = activeFilter === 'all' || s.type === activeFilter;
    const matchesSearch = !searchQuery || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.city && s.city.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="screen-scroll-container">
      {/* Screen Header */}
      <div className="screen-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="icon-button" onClick={onBack} title="Back">
            <ArrowLeft size={20} />
          </button>
          <div>
            <span className="screen-header-title">
              {currentUser?.role === 'school_staff' ? 'My Institution' : 'Registered Institutions'}
            </span>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              {currentUser?.role === 'school_staff' ? 'Isolated Campus View' : 'Central Directory'}
            </div>
          </div>
        </div>
        <button 
          className="icon-button" 
          onClick={() => setShowSearchInput(!showSearchInput)}
          title="Search"
        >
          <Search size={18} />
        </button>
      </div>

      {/* Optional Search Bar */}
      {showSearchInput && (
        <div style={{ padding: '8px 16px 0 16px' }}>
          <input 
            type="text"
            placeholder="Search by school or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            autoFocus
            style={{ fontSize: '12px', padding: '8px 12px' }}
          />
        </div>
      )}

      {/* Filter Tabs only for Admin */}
      {currentUser?.role !== 'school_staff' && (
        <div style={{ display: 'flex', gap: '8px', padding: '12px 16px', overflowX: 'auto' }}>
          <button
            onClick={() => setActiveFilter('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              background: activeFilter === 'all' ? 'var(--navy-800)' : '#e2e8f0',
              color: activeFilter === 'all' ? '#ffffff' : 'var(--text-body)'
            }}
          >
            All ({visibleSchools.length})
          </button>

          <button
            onClick={() => setActiveFilter('school')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              background: activeFilter === 'school' ? 'var(--navy-800)' : '#e2e8f0',
              color: activeFilter === 'school' ? '#ffffff' : 'var(--text-body)'
            }}
          >
            Schools ({schoolCount})
          </button>

          <button
            onClick={() => setActiveFilter('college')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              background: activeFilter === 'college' ? 'var(--navy-800)' : '#e2e8f0',
              color: activeFilter === 'college' ? '#ffffff' : 'var(--text-body)'
            }}
          >
            Colleges ({collegeCount})
          </button>
        </div>
      )}

      {/* Institution Cards */}
      <div style={{ padding: '8px 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredSchools.length > 0 ? (
          filteredSchools.map(school => (
            <div 
              key={school.id}
              onClick={() => onSelectSchool(school)}
              className="card-item clickable"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px'
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: school.type === 'college' ? 'var(--blue-50)' : '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {school.type === 'college' ? (
                  <GraduationCap size={22} color="var(--navy-800)" />
                ) : (
                  <School size={22} color="#d97706" />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--navy-900)' }}>
                    {school.name}
                  </span>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: '700',
                    color: school.type === 'college' ? 'var(--blue-600)' : '#b45309',
                    background: school.type === 'college' ? 'var(--blue-50)' : '#fef3c7',
                    padding: '1px 6px',
                    borderRadius: '4px'
                  }}>
                    {school.type?.toUpperCase() || 'INSTITUTION'}
                  </span>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {school.city || 'Campus'} • {school.labsCount ?? school.labs?.length ?? 0} Lab(s) • {school.systemsCount ?? 0} Systems
                </div>
              </div>

              <ChevronRight size={18} color="var(--text-muted)" />
            </div>
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '30px',
            background: '#ffffff',
            borderRadius: '10px',
            border: '1px dashed #cbd5e1'
          }}>
            <Building2 size={32} color="#94a3b8" style={{ margin: '0 auto 8px auto' }} />
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy-900)' }}>
              No institutions found
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Register your school or college to access lab mapping and AMC service tracking.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
