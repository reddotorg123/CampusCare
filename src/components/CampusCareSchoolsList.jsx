import React, { useState } from 'react';
import { ArrowLeft, Search, ChevronRight, School, GraduationCap } from 'lucide-react';

export function CampusCareSchoolsList({ 
  schools = [], 
  onSelectSchool, 
  onBack 
}) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'school' | 'college'
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  const filteredSchools = schools.filter(s => {
    const matchesFilter = activeFilter === 'all' || s.type === activeFilter;
    const matchesSearch = !searchQuery || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase());
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
          <span className="screen-header-title">
            Schools & Colleges
          </span>
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

      {/* Filter Tabs: All (12), Schools (8), Colleges (4) */}
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
          All (12)
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
          Schools (8)
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
          Colleges (4)
        </button>
      </div>

      {/* Schools List Cards */}
      <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredSchools.map(school => (
          <div
            key={school.id}
            onClick={() => onSelectSchool(school)}
            className="card-item clickable"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              padding: '12px',
              cursor: 'pointer',
              marginBottom: 0
            }}
          >
            {/* School Thumbnail */}
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              background: '#e2e8f0',
              flexShrink: 0
            }}>
              <img 
                src={school.imageUrl} 
                alt={school.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            {/* School Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                fontSize: '13px', 
                fontWeight: '700', 
                color: 'var(--text-main)', 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis' 
              }}>
                {school.name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {school.city}, {school.state}
              </div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--navy-700)', marginTop: '4px' }}>
                {school.labsCount} Labs &nbsp;|&nbsp; {school.systemsCount} Systems
              </div>
            </div>

            <ChevronRight size={18} color="var(--border-mid)" />
          </div>
        ))}
      </div>
    </div>
  );
}
