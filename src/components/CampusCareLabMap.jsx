import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Edit3, 
  Plus, 
  Minus, 
  Crosshair, 
  Monitor, 
  Table2, 
  Tag, 
  DoorOpen, 
  Armchair, 
  ChevronDown, 
  Building2, 
  Phone, 
  Wifi, 
  BatteryCharging, 
  Clock, 
  FileText, 
  Trash2, 
  PlusCircle, 
  Check, 
  X,
  AlertCircle,
  Sliders,
  Wrench
} from 'lucide-react';

export function CampusCareLabMap({ 
  school,
  lab,
  allLabs = [],
  devices = [],
  onSelectLab,
  onAddLab,
  onUpdateLab,
  onDeleteLab,
  onSelectDevice,
  onAddDevice,
  onOpenTicketFromSystem,
  onOpenEditor,
  onBack
}) {
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'systems' | 'details'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'working' | 'issue_reported' | 'under_service' | 'offline'

  // Modals state
  const [isLabSelectorOpen, setIsLabSelectorOpen] = useState(false);
  const [isAddLabModalOpen, setIsAddLabModalOpen] = useState(false);
  const [isEditLabModalOpen, setIsEditLabModalOpen] = useState(false);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const schoolName = school?.name || 'School / College';
  const labList = (allLabs && allLabs.length > 0) 
    ? allLabs 
    : (school?.labs && school.labs.length > 0) 
      ? school.labs 
      : (lab ? [lab] : []);

  const activeLab = lab || labList[0] || null;
  const labName = activeLab?.name || (school ? 'No Labs Configured' : 'No Lab Selected');
  const labRoom = activeLab?.room || '';

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleZoom = (delta) => {
    setZoomLevel(prev => Math.min(1.4, Math.max(0.7, prev + delta)));
  };

  const handleResetZoom = () => setZoomLevel(1);

  // Filter actual PC workstations safely (exclude layout elements: tables, labels, doors, desks)
  const workstationDevices = useMemo(() => {
    return devices.filter(d => d.type === 'pc' || !d.type);
  }, [devices]);

  // Real-time calculated KPI counts for this lab
  const workingCount = workstationDevices.filter(d => (d.status || 'working') === 'working').length;
  const issueCount = workstationDevices.filter(d => d.status === 'issue_reported' || d.status === 'warning').length;
  const serviceCount = workstationDevices.filter(d => d.status === 'under_service').length;
  const offlineCount = workstationDevices.filter(d => d.status === 'offline').length;

  // Filtered systems for the Systems Tab
  const filteredWorkstations = useMemo(() => {
    return workstationDevices.filter(device => {
      // 1. Status Filter
      if (statusFilter !== 'all') {
        const devStatus = device.status || 'working';
        if (statusFilter === 'issue_reported') {
          if (devStatus !== 'issue_reported' && devStatus !== 'warning') return false;
        } else if (devStatus !== statusFilter) {
          return false;
        }
      }

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const code = (device.code || '').toLowerCase();
        const assetCode = (device.assetCode || '').toLowerCase();
        const ip = (device.ip || '').toLowerCase();
        const processor = (device.processor || '').toLowerCase();
        const makeModel = (device.makeModel || '').toLowerCase();
        const ram = (device.ram || '').toLowerCase();
        return code.includes(q) || assetCode.includes(q) || ip.includes(q) || processor.includes(q) || makeModel.includes(q) || ram.includes(q);
      }

      return true;
    });
  }, [workstationDevices, statusFilter, searchQuery]);

  // Color helper for 2D Map nodes
  const getDeviceColor = (status) => {
    switch (status) {
      case 'working': return { bg: '#22c55e', border: '#16a34a', text: '#ffffff' };
      case 'warning': return { bg: '#f59e0b', border: '#d97706', text: '#ffffff' };
      case 'issue_reported': return { bg: '#ef4444', border: '#dc2626', text: '#ffffff' };
      case 'under_service': return { bg: '#3b82f6', border: '#2563eb', text: '#ffffff' };
      case 'offline': return { bg: '#64748b', border: '#475569', text: '#ffffff' };
      default: return { bg: '#22c55e', border: '#16a34a', text: '#ffffff' };
    }
  };

  // ----------------------------------------------------
  // Form State: Add New Lab
  // ----------------------------------------------------
  const [newLabForm, setNewLabForm] = useState({
    name: '',
    code: '',
    room: '',
    capacity: 20,
    inCharge: '',
    phone: '',
    network: 'Gigabit Ethernet Cat6 with Managed Switch',
    ups: '10kVA Online Central UPS (30 min backup)',
    operatingHours: '8:30 AM - 4:30 PM (Mon - Fri)',
    notes: ''
  });

  const handleCreateLabSubmit = (e) => {
    e.preventDefault();
    if (!newLabForm.name.trim()) return;

    if (onAddLab) {
      onAddLab({
        name: newLabForm.name.trim(),
        code: newLabForm.code.trim() || `LAB-0${labList.length + 1}`,
        room: newLabForm.room.trim() || `Room ${100 + labList.length + 1}`,
        inCharge: newLabForm.inCharge.trim() || 'Lab Coordinator',
        phone: newLabForm.phone.trim() || '+91 94440 12345',
        network: newLabForm.network.trim(),
        ups: newLabForm.ups.trim(),
        operatingHours: newLabForm.operatingHours.trim(),
        notes: newLabForm.notes.trim()
      }, Number(newLabForm.capacity) || 20);
    }

    setIsAddLabModalOpen(false);
    setIsLabSelectorOpen(false);
    setNewLabForm({
      name: '',
      code: '',
      room: '',
      capacity: 20,
      inCharge: '',
      phone: '',
      network: 'Gigabit Ethernet Cat6 with Managed Switch',
      ups: '10kVA Online Central UPS (30 min backup)',
      operatingHours: '8:30 AM - 4:30 PM (Mon - Fri)',
      notes: ''
    });
    showToast('New Lab created successfully!');
  };

  // ----------------------------------------------------
  // Form State: Edit Current Lab
  // ----------------------------------------------------
  const [editLabForm, setEditLabForm] = useState({
    name: activeLab?.name || '',
    code: activeLab?.code || '',
    room: activeLab?.room || '',
    inCharge: activeLab?.inCharge || '',
    phone: activeLab?.phone || '',
    network: activeLab?.network || 'Gigabit Ethernet Cat6 with Managed Switch',
    ups: activeLab?.ups || '10kVA Online Central UPS (30 min backup)',
    operatingHours: activeLab?.operatingHours || '8:30 AM - 4:30 PM',
    notes: activeLab?.notes || ''
  });

  const handleOpenEditLab = () => {
    setEditLabForm({
      name: activeLab?.name || '',
      code: activeLab?.code || '',
      room: activeLab?.room || '',
      inCharge: activeLab?.inCharge || '',
      phone: activeLab?.phone || '',
      network: activeLab?.network || 'Gigabit Ethernet Cat6 with Managed Switch',
      ups: activeLab?.ups || '10kVA Online Central UPS (30 min backup)',
      operatingHours: activeLab?.operatingHours || '8:30 AM - 4:30 PM',
      notes: activeLab?.notes || ''
    });
    setIsEditLabModalOpen(true);
  };

  const handleSaveEditLab = (e) => {
    e.preventDefault();
    if (onUpdateLab && activeLab) {
      onUpdateLab({
        ...activeLab,
        name: editLabForm.name.trim() || activeLab.name,
        code: editLabForm.code.trim() || activeLab.code,
        room: editLabForm.room.trim() || activeLab.room,
        inCharge: editLabForm.inCharge.trim(),
        phone: editLabForm.phone.trim(),
        network: editLabForm.network.trim(),
        ups: editLabForm.ups.trim(),
        operatingHours: editLabForm.operatingHours.trim(),
        notes: editLabForm.notes.trim()
      });
    }
    setIsEditLabModalOpen(false);
    showToast('Lab details updated successfully!');
  };

  // ----------------------------------------------------
  // Form State: Add New Workstation
  // ----------------------------------------------------
  const [newDeviceForm, setNewDeviceForm] = useState({
    code: '',
    assetCode: '',
    makeModel: 'Standard Lab Workstation',
    processor: 'Intel Core i5',
    ram: '8 GB DDR4',
    storage: '256 GB SSD',
    os: 'Windows 11 Pro',
    ip: `192.168.1.${101 + workstationDevices.length}`
  });

  const handleOpenAddDevice = () => {
    const nextNum = workstationDevices.length + 1;
    const numStr = String(nextNum).padStart(2, '0');
    setNewDeviceForm({
      code: `PC-${numStr}`,
      assetCode: `${activeLab?.code || 'LAB'}-PC-${numStr}`,
      makeModel: 'Standard Lab Workstation',
      processor: 'Intel Core i5 (10th Gen)',
      ram: '8 GB DDR4',
      storage: '256 GB SSD',
      os: 'Windows 11 Pro',
      ip: `192.168.1.${100 + nextNum}`
    });
    setIsAddDeviceModalOpen(true);
  };

  const handleCreateDeviceSubmit = (e) => {
    e.preventDefault();
    if (!newDeviceForm.code.trim()) return;

    if (onAddDevice) {
      onAddDevice({
        code: newDeviceForm.code.trim(),
        assetCode: newDeviceForm.assetCode.trim(),
        makeModel: newDeviceForm.makeModel.trim(),
        processor: newDeviceForm.processor.trim(),
        ram: newDeviceForm.ram.trim(),
        storage: newDeviceForm.storage.trim(),
        os: newDeviceForm.os.trim(),
        ip: newDeviceForm.ip.trim(),
        status: 'working'
      });
    }

    setIsAddDeviceModalOpen(false);
    showToast(`System ${newDeviceForm.code} added to ${labName}!`);
  };

  return (
    <div className="screen-scroll-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--navy-900)',
          color: '#ffffff',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: 100,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          <Check size={14} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="screen-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
          <button className="icon-button" onClick={onBack} title="Back">
            <ArrowLeft size={20} />
          </button>
          
          {/* Interactive Lab Switcher Dropdown */}
          <div 
            onClick={() => setIsLabSelectorOpen(true)}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              cursor: 'pointer',
              minWidth: 0,
              flex: 1
            }}
            title="Switch Lab"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="screen-header-title" style={{ fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {labName}
              </span>
              <ChevronDown size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            </div>
            <div className="screen-header-subtitle" style={{ fontSize: '10.5px' }}>
              {labRoom} • {schoolName}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Quick Add Lab Button */}
          <button 
            onClick={() => setIsAddLabModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'var(--blue-50)',
              border: '1px solid var(--blue-600)',
              borderRadius: '6px',
              padding: '5px 8px',
              fontSize: '11px',
              fontWeight: '700',
              color: 'var(--blue-600)',
              cursor: 'pointer'
            }}
            title="Add New Lab"
          >
            <Plus size={13} />
            <span>Add Lab</span>
          </button>
        </div>
      </div>

      {/* Lab Switcher Modal / Bottom Sheet */}
      {isLabSelectorOpen && (
        <div 
          onClick={() => setIsLabSelectorOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'flex-end',
            zIndex: 90,
            backdropFilter: 'blur(2px)'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              background: '#ffffff',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              padding: '18px',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--navy-900)' }}>
                  Switch Laboratory
                </h3>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {schoolName} has {labList.length} registered {labList.length === 1 ? 'lab' : 'labs'}
                </div>
              </div>
              <button 
                className="icon-button"
                onClick={() => setIsLabSelectorOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* List of labs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              {labList.map(item => {
                const isSelected = item.id === activeLab?.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (onSelectLab) onSelectLab(item.id);
                      setIsLabSelectorOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid var(--blue-600)' : '1px solid var(--border-light)',
                      background: isSelected ? 'var(--blue-50)' : '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: isSelected ? 'var(--blue-600)' : 'var(--navy-900)' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {item.room || 'Room 101'} • {item.capacity || 20} Systems • {item.code || 'LAB'}
                      </div>
                    </div>
                    {isSelected && (
                      <span style={{ color: 'var(--blue-600)', fontWeight: '800' }}>✓ Active</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action to create new lab */}
            <button
              onClick={() => {
                setIsLabSelectorOpen(false);
                setIsAddLabModalOpen(true);
              }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: 'var(--navy-900)',
                color: '#ffffff',
                border: 'none',
                fontSize: '12px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Plus size={16} />
              <span>Create Another Lab for this School</span>
            </button>
          </div>
        </div>
      )}

      {/* Tabs: Lab Map | Systems | Details */}
      <div className="segmented-tabs">
        <button 
          className={`segmented-tab-btn ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          Lab Map
        </button>
        <button 
          className={`segmented-tab-btn ${activeTab === 'systems' ? 'active' : ''}`}
          onClick={() => setActiveTab('systems')}
        >
          Systems ({workstationDevices.length})
        </button>
        <button 
          className={`segmented-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
      </div>

      {/* TAB 1: 2D LAB MAP */}
      {activeTab === 'map' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '0 16px 16px 16px' }}>
          {/* Action Row: Edit Map & Workstations count */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
              {workstationDevices.length} PCs ({workingCount} working, {issueCount} issues)
            </div>

            <button 
              onClick={onOpenEditor}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: '#ffffff',
                border: '1px solid var(--border-mid)',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--navy-800)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Edit3 size={12} />
              Edit Layout
            </button>
          </div>

          {/* 2D Canvas Room Box */}
          <div style={{
            position: 'relative',
            background: '#ffffff',
            border: '2px solid #334155',
            borderRadius: '8px',
            minHeight: '440px',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.03)'
          }}>
            {/* Architectural Grid & Room Boundary */}
            <div 
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top left',
                transition: 'transform 0.15s ease-out',
                position: 'relative',
                width: '390px',
                height: '440px',
                padding: '10px'
              }}
            >
              {/* Devices and Layout Elements */}
              {devices.map(device => {
                // 1. Teacher's Desk
                if (device.type === 'teacher_desk') {
                  return (
                    <div
                      key={device.id}
                      style={{
                        position: 'absolute',
                        left: `${device.coords?.x || 280}px`,
                        top: `${device.coords?.y || 340}px`,
                        width: `${device.width || 88}px`,
                        height: `${device.height || 44}px`,
                        background: '#f1f5f9',
                        border: '1.5px dashed #475569',
                        borderRadius: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        fontWeight: '700',
                        color: '#334155',
                        textAlign: 'center',
                        zIndex: 10
                      }}
                    >
                      <Armchair size={13} color="#475569" />
                      <span>{device.name || "Teacher's Desk"}</span>
                    </div>
                  );
                }

                // 2. Entrance Door
                if (device.type === 'entrance') {
                  return (
                    <div
                      key={device.id}
                      style={{
                        position: 'absolute',
                        left: `${device.coords?.x || 10}px`,
                        top: `${device.coords?.y || 350}px`,
                        width: `${device.width || 68}px`,
                        height: `${device.height || 28}px`,
                        background: '#ffffff',
                        border: '2px solid #334155',
                        borderLeft: '4px solid #16a34a',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        fontSize: '9px',
                        fontWeight: '800',
                        color: '#15803d',
                        zIndex: 10
                      }}
                    >
                      <DoorOpen size={13} />
                      <span>{device.name || 'Entrance'}</span>
                    </div>
                  );
                }

                // 3. Workbench / Table
                if (device.type === 'table') {
                  return (
                    <div
                      key={device.id}
                      style={{
                        position: 'absolute',
                        left: `${device.coords?.x || 80}px`,
                        top: `${device.coords?.y || 120}px`,
                        width: `${device.width || 110}px`,
                        height: `${device.height || 48}px`,
                        background: '#f8fafc',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px',
                        fontSize: '9px',
                        fontWeight: '700',
                        color: '#78350f',
                        zIndex: 5
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Table2 size={12} color="#d97706" />
                        <span>{device.name || device.code}</span>
                      </div>
                      <span style={{ fontSize: '7.5px', color: '#92400e', fontWeight: 600 }}>
                        Lab Workbench
                      </span>
                    </div>
                  );
                }

                // 4. Custom Label / Aisle Tag
                if (device.type === 'label') {
                  return (
                    <div
                      key={device.id}
                      style={{
                        position: 'absolute',
                        left: `${device.coords?.x || 120}px`,
                        top: `${device.coords?.y || 30}px`,
                        width: `${device.width || 88}px`,
                        height: `${device.height || 26}px`,
                        background: 'rgba(239, 246, 255, 0.95)',
                        border: '1px dashed #3b82f6',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        fontSize: '9px',
                        fontWeight: '800',
                        color: '#1d4ed8',
                        zIndex: 8
                      }}
                    >
                      <Tag size={11} />
                      <span>{device.name || device.code}</span>
                    </div>
                  );
                }

                // 5. Standard PC Workstation (Guarded against undefined status)
                const statusSafe = device.status || 'working';
                const color = getDeviceColor(statusSafe);
                return (
                  <div
                    key={device.id}
                    onClick={() => onSelectDevice(device)}
                    title={`${device.code} - ${statusSafe}`}
                    style={{
                      position: 'absolute',
                      left: `${device.coords?.x || 40}px`,
                      top: `${device.coords?.y || 60}px`,
                      width: '54px',
                      height: '46px',
                      background: color.bg,
                      border: `1.5px solid ${color.border}`,
                      borderRadius: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
                      transition: 'transform 0.1s',
                      userSelect: 'none',
                      zIndex: 15
                    }}
                  >
                    <Monitor size={14} color={color.text} />
                    <span style={{ 
                      fontSize: '9px', 
                      fontWeight: '800', 
                      color: color.text, 
                      marginTop: '2px',
                      letterSpacing: '-0.3px'
                    }}>
                      {device.code}
                    </span>
                  </div>
                );
              })}

              {/* Fallback Teacher Desk only if not in devices */}
              {!devices.some(d => d.type === 'teacher_desk') && (
                <div style={{
                  position: 'absolute',
                  right: '24px',
                  bottom: '24px',
                  width: '90px',
                  height: '44px',
                  background: '#f1f5f9',
                  border: '1.5px dashed #64748b',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: '700',
                  color: '#475569',
                  textAlign: 'center'
                }}>
                  Teacher's<br/>Desk
                </div>
              )}

              {/* Fallback Entrance only if not in devices */}
              {!devices.some(d => d.type === 'entrance') && (
                <div style={{
                  position: 'absolute',
                  left: '0px',
                  bottom: '18px',
                  width: '60px',
                  height: '24px',
                  background: '#ffffff',
                  borderTop: '2px solid #334155',
                  borderRight: '2px solid #334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                  fontWeight: '700',
                  color: '#64748b'
                }}>
                  Entrance
                </div>
              )}
            </div>

            {/* Floating Zoom Controls (+ / - / Reticle) */}
            <div style={{
              position: 'absolute',
              right: '12px',
              bottom: '90px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              background: '#ffffff',
              border: '1px solid var(--border-mid)',
              borderRadius: '6px',
              padding: '2px',
              boxShadow: 'var(--shadow-md)',
              zIndex: 10
            }}>
              <button 
                onClick={() => handleZoom(0.1)} 
                className="icon-button" 
                style={{ padding: '4px' }}
                title="Zoom In"
              >
                <Plus size={14} />
              </button>
              <div style={{ height: '1px', background: 'var(--border-light)' }}></div>
              <button 
                onClick={() => handleZoom(-0.1)} 
                className="icon-button" 
                style={{ padding: '4px' }}
                title="Zoom Out"
              >
                <Minus size={14} />
              </button>
              <div style={{ height: '1px', background: 'var(--border-light)' }}></div>
              <button 
                onClick={handleResetZoom} 
                className="icon-button" 
                style={{ padding: '4px' }}
                title="Center / Reset"
              >
                <Crosshair size={14} />
              </button>
            </div>
          </div>

          {/* Bottom Color Status Legend */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '12px',
            padding: '8px 6px',
            background: '#ffffff',
            borderRadius: '8px',
            border: '1px solid var(--border-light)',
            fontSize: '10px',
            fontWeight: '600'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-working)' }}></span>
              Working ({workingCount})
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-issue)' }}></span>
              Issue ({issueCount})
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-service)' }}></span>
              In Service ({serviceCount})
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-offline)' }}></span>
              Offline ({offlineCount})
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SYSTEMS TAB (Crash Fixed, Searchable, Filterable, Feedable Specs) */}
      {activeTab === 'systems' && (
        <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Search & Add System Header */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px' }} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by PC code, IP, specs..."
                className="form-input"
                style={{ paddingLeft: '32px', fontSize: '11.5px', height: '36px' }}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              onClick={handleOpenAddDevice}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'var(--navy-900)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0 12px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <Plus size={14} />
              <span>Add PC</span>
            </button>
          </div>

          {/* Status Filter Chips */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {[
              { id: 'all', label: `All (${workstationDevices.length})` },
              { id: 'working', label: `Working (${workingCount})` },
              { id: 'issue_reported', label: `Issues (${issueCount})` },
              { id: 'under_service', label: `In Service (${serviceCount})` },
              { id: 'offline', label: `Offline (${offlineCount})` }
            ].map(chip => (
              <button
                key={chip.id}
                onClick={() => setStatusFilter(chip.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '16px',
                  border: statusFilter === chip.id ? '1.5px solid var(--navy-900)' : '1px solid var(--border-mid)',
                  background: statusFilter === chip.id ? 'var(--navy-900)' : '#ffffff',
                  color: statusFilter === chip.id ? '#ffffff' : 'var(--text-body)',
                  fontSize: '10.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Workstations List */}
          {filteredWorkstations.length > 0 ? (
            filteredWorkstations.map(device => {
              const statusRaw = device.status || 'working';
              const statusLabel = statusRaw.replace(/_/g, ' ');

              return (
                <div 
                  key={device.id}
                  className="card-item clickable"
                  style={{ padding: '12px 14px', marginBottom: 0 }}
                  onClick={() => onSelectDevice(device)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        background: 'var(--navy-800)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff'
                      }}>
                        <Monitor size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--navy-900)' }}>
                          {device.code} &nbsp;
                          <span style={{ fontSize: '10.5px', fontWeight: '500', color: 'var(--text-muted)' }}>
                            ({device.assetCode || 'No Asset ID'})
                          </span>
                        </div>
                        <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                          IP: {device.ip || 'DHCP'} • {device.location || activeLab?.name}
                        </div>
                      </div>
                    </div>

                    <span className={`status-pill ${statusRaw}`}>
                      {statusLabel}
                    </span>
                  </div>

                  {/* Hardware Spec snippet */}
                  <div style={{ 
                    fontSize: '11px', 
                    color: 'var(--text-body)', 
                    background: '#f8fafc', 
                    padding: '6px 8px', 
                    borderRadius: '6px',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>
                      <strong>{device.processor || 'Core i5'}</strong> • {device.ram || '8 GB'} • {device.storage || '256 GB'}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--blue-600)', fontWeight: '700' }}>
                      Feed Specs &rarr;
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '30px 16px',
              background: '#ffffff',
              borderRadius: '10px',
              border: '1px dashed var(--border-mid)'
            }}>
              <Monitor size={28} color="var(--text-muted)" style={{ margin: '0 auto 8px auto' }} />
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--navy-900)' }}>
                No systems found
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {searchQuery ? `No systems matching "${searchQuery}"` : `There are no systems recorded in ${labName}.`}
              </div>
              <button
                onClick={handleOpenAddDevice}
                style={{
                  marginTop: '10px',
                  background: 'var(--blue-600)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                + Add Workstation Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DETAILS TAB (Fully Editable Lab Information) */}
      {activeTab === 'details' && (
        <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Main Lab Details Card */}
          <div className="card-item" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--navy-900)' }}>
                  {labName}
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {schoolName} • Code: {activeLab?.code || 'LAB-01'}
                </span>
              </div>

              {/* Edit Lab Details Action */}
              <button
                onClick={handleOpenEditLab}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'var(--navy-900)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Edit3 size={13} />
                <span>Edit Lab Info</span>
              </button>
            </div>

            {/* Spec rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Building2 size={16} color="var(--blue-600)" />
                <div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '600' }}>ROOM / FLOOR LOCATION</div>
                  <div style={{ fontWeight: '700', color: 'var(--navy-900)' }}>{activeLab?.room || 'Room 101'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Monitor size={16} color="#10b981" />
                <div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '600' }}>WORKSTATION CAPACITY</div>
                  <div style={{ fontWeight: '700', color: 'var(--navy-900)' }}>
                    {workstationDevices.length} Connected PCs ({workingCount} Working, {issueCount} Issues)
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="#f59e0b" />
                <div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '600' }}>LAB IN-CHARGE & CONTACT</div>
                  <div style={{ fontWeight: '700', color: 'var(--navy-900)' }}>
                    {activeLab?.inCharge || 'Mr. Arun Kumar'} &nbsp;
                    <span style={{ color: 'var(--blue-600)', fontWeight: 600 }}>
                      ({activeLab?.phone || '+91 94440 12345'})
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Wifi size={16} color="#3b82f6" />
                <div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '600' }}>NETWORK & SWITCH INFRASTRUCTURE</div>
                  <div style={{ fontWeight: '600', color: 'var(--navy-900)' }}>
                    {activeLab?.network || 'Gigabit Ethernet Cat6 with Managed Switch SW-01'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BatteryCharging size={16} color="#8b5cf6" />
                <div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '600' }}>CENTRAL UPS & POWER BACKUP</div>
                  <div style={{ fontWeight: '600', color: 'var(--navy-900)' }}>
                    {activeLab?.ups || '10kVA Online Central UPS (30 min backup)'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={16} color="#059669" />
                <div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '600' }}>OPERATING HOURS</div>
                  <div style={{ fontWeight: '600', color: 'var(--navy-900)' }}>
                    {activeLab?.operatingHours || '8:30 AM - 4:30 PM (Mon - Fri)'}
                  </div>
                </div>
              </div>

              {activeLab?.notes && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={16} color="var(--text-muted)" />
                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '600' }}>SPECIAL NOTES & GUIDELINES</div>
                    <div style={{ fontWeight: '500', color: 'var(--text-body)' }}>
                      {activeLab?.notes}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions in Details Tab */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              onClick={() => setIsAddLabModalOpen(true)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border-mid)',
                background: '#ffffff',
                color: 'var(--navy-900)',
                fontSize: '11px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <PlusCircle size={15} color="var(--blue-600)" />
              <span>+ Add Another Lab</span>
            </button>

            <button
              onClick={handleOpenAddDevice}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border-mid)',
                background: '#ffffff',
                color: 'var(--navy-900)',
                fontSize: '11px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Monitor size={15} color="#10b981" />
              <span>+ Add Workstation</span>
            </button>
          </div>

          {/* Delete Lab Option (Only if school has more than 1 lab) */}
          {labList.length > 1 && (
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete ${labName}? This will remove this lab and its workstations.`)) {
                  if (onDeleteLab) onDeleteLab(activeLab.id);
                  showToast('Lab deleted');
                }
              }}
              style={{
                marginTop: '4px',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #fee2e2',
                background: '#fff5f5',
                color: '#dc2626',
                fontSize: '11px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Trash2 size={14} />
              <span>Delete This Laboratory</span>
            </button>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 1: EDIT LAB DETAILS                           */}
      {/* ==================================================== */}
      {isEditLabModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          zIndex: 95,
          backdropFilter: 'blur(2px)'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '420px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '20px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={18} color="var(--navy-900)" />
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--navy-900)' }}>
                  Edit Lab Details
                </h3>
              </div>
              <button className="icon-button" onClick={() => setIsEditLabModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditLab} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label">Lab Name *</label>
                <input 
                  type="text" 
                  value={editLabForm.name} 
                  onChange={e => setEditLabForm(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input" 
                  required 
                  placeholder="e.g. Computer Lab 1" 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="form-group">
                  <label className="form-label">Lab Code</label>
                  <input 
                    type="text" 
                    value={editLabForm.code} 
                    onChange={e => setEditLabForm(prev => ({ ...prev, code: e.target.value }))}
                    className="form-input" 
                    placeholder="e.g. LAB-01" 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Room / Floor *</label>
                  <input 
                    type="text" 
                    value={editLabForm.room} 
                    onChange={e => setEditLabForm(prev => ({ ...prev, room: e.target.value }))}
                    className="form-input" 
                    required 
                    placeholder="e.g. Room 101, 1st Floor" 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                <div className="form-group">
                  <label className="form-label">Lab In-Charge Name</label>
                  <input 
                    type="text" 
                    value={editLabForm.inCharge} 
                    onChange={e => setEditLabForm(prev => ({ ...prev, inCharge: e.target.value }))}
                    className="form-input" 
                    placeholder="e.g. Mr. Arun Kumar" 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input 
                    type="text" 
                    value={editLabForm.phone} 
                    onChange={e => setEditLabForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="form-input" 
                    placeholder="+91 94440 12345" 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Network & Switch Infrastructure</label>
                <input 
                  type="text" 
                  value={editLabForm.network} 
                  onChange={e => setEditLabForm(prev => ({ ...prev, network: e.target.value }))}
                  className="form-input" 
                  placeholder="e.g. 1Gbps Cat6 Ethernet with Cisco 24-Port Switch" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Central UPS Backup</label>
                <input 
                  type="text" 
                  value={editLabForm.ups} 
                  onChange={e => setEditLabForm(prev => ({ ...prev, ups: e.target.value }))}
                  className="form-input" 
                  placeholder="e.g. 10kVA Online UPS (30 min backup)" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Operating Schedule</label>
                <input 
                  type="text" 
                  value={editLabForm.operatingHours} 
                  onChange={e => setEditLabForm(prev => ({ ...prev, operatingHours: e.target.value }))}
                  className="form-input" 
                  placeholder="e.g. 8:30 AM - 4:30 PM (Mon - Fri)" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lab Notes / Guidelines</label>
                <textarea 
                  value={editLabForm.notes} 
                  onChange={e => setEditLabForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="form-textarea" 
                  rows={2}
                  placeholder="e.g. No food allowed. Systems reset after every session." 
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditLabModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-mid)',
                    background: '#f8fafc',
                    color: 'var(--text-body)',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--navy-900)',
                    color: '#ffffff',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Save Lab Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 2: ADD NEW LAB                                 */}
      {/* ==================================================== */}
      {isAddLabModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          zIndex: 95,
          backdropFilter: 'blur(2px)'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '420px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '20px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} color="var(--blue-600)" />
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--navy-900)' }}>
                    Add New Laboratory
                  </h3>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Add another lab for {schoolName}
                  </div>
                </div>
              </div>
              <button className="icon-button" onClick={() => setIsAddLabModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateLabSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label">Lab Name *</label>
                <input 
                  type="text" 
                  value={newLabForm.name} 
                  onChange={e => setNewLabForm(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input" 
                  required 
                  placeholder="e.g. AI & Robotics Lab, Language Lab" 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="form-group">
                  <label className="form-label">Lab Code</label>
                  <input 
                    type="text" 
                    value={newLabForm.code} 
                    onChange={e => setNewLabForm(prev => ({ ...prev, code: e.target.value }))}
                    className="form-input" 
                    placeholder={`LAB-0${labList.length + 1}`} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Room / Floor *</label>
                  <input 
                    type="text" 
                    value={newLabForm.room} 
                    onChange={e => setNewLabForm(prev => ({ ...prev, room: e.target.value }))}
                    className="form-input" 
                    required 
                    placeholder="e.g. Room 204, 2nd Floor" 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Initial Workstations Count (PCs)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="number" 
                    min="1"
                    max="100"
                    value={newLabForm.capacity} 
                    onChange={e => setNewLabForm(prev => ({ ...prev, capacity: e.target.value }))}
                    className="form-input" 
                    style={{ width: '80px', fontWeight: '700' }}
                  />
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[15, 20, 30, 40].map(cnt => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setNewLabForm(prev => ({ ...prev, capacity: cnt }))}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: Number(newLabForm.capacity) === cnt ? '1.5px solid var(--blue-600)' : '1px solid var(--border-mid)',
                          background: Number(newLabForm.capacity) === cnt ? 'var(--blue-50)' : '#ffffff',
                          color: Number(newLabForm.capacity) === cnt ? 'var(--blue-600)' : 'var(--text-muted)',
                          fontSize: '10.5px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        {cnt} PCs
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                <div className="form-group">
                  <label className="form-label">In-Charge Staff</label>
                  <input 
                    type="text" 
                    value={newLabForm.inCharge} 
                    onChange={e => setNewLabForm(prev => ({ ...prev, inCharge: e.target.value }))}
                    className="form-input" 
                    placeholder="e.g. Dr. Priya Nathan" 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Number</label>
                  <input 
                    type="text" 
                    value={newLabForm.phone} 
                    onChange={e => setNewLabForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="form-input" 
                    placeholder="+91 94440 12345" 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Network Infrastructure</label>
                <input 
                  type="text" 
                  value={newLabForm.network} 
                  onChange={e => setNewLabForm(prev => ({ ...prev, network: e.target.value }))}
                  className="form-input" 
                  placeholder="e.g. Gigabit Ethernet Cat6" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Central UPS</label>
                <input 
                  type="text" 
                  value={newLabForm.ups} 
                  onChange={e => setNewLabForm(prev => ({ ...prev, ups: e.target.value }))}
                  className="form-input" 
                  placeholder="e.g. 10kVA Online UPS (30 min)" 
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddLabModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-mid)',
                    background: '#f8fafc',
                    color: 'var(--text-body)',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--blue-600)',
                    color: '#ffffff',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Create Lab & Generate Workstations
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 3: ADD NEW WORKSTATION                         */}
      {/* ==================================================== */}
      {isAddDeviceModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          zIndex: 95,
          backdropFilter: 'blur(2px)'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '400px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '20px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Monitor size={18} color="var(--navy-900)" />
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--navy-900)' }}>
                  Add PC to {labName}
                </h3>
              </div>
              <button className="icon-button" onClick={() => setIsAddDeviceModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateDeviceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="form-group">
                  <label className="form-label">PC Code *</label>
                  <input 
                    type="text" 
                    value={newDeviceForm.code} 
                    onChange={e => setNewDeviceForm(prev => ({ ...prev, code: e.target.value }))}
                    className="form-input" 
                    required 
                    placeholder="e.g. PC-21" 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Asset ID</label>
                  <input 
                    type="text" 
                    value={newDeviceForm.assetCode} 
                    onChange={e => setNewDeviceForm(prev => ({ ...prev, assetCode: e.target.value }))}
                    className="form-input" 
                    placeholder="e.g. LAB-PC-21" 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Make & Model</label>
                <input 
                  type="text" 
                  value={newDeviceForm.makeModel} 
                  onChange={e => setNewDeviceForm(prev => ({ ...prev, makeModel: e.target.value }))}
                  className="form-input" 
                  placeholder="e.g. Dell OptiPlex 3080 / HP ProDesk" 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                <div className="form-group">
                  <label className="form-label">Processor (CPU)</label>
                  <input 
                    type="text" 
                    value={newDeviceForm.processor} 
                    onChange={e => setNewDeviceForm(prev => ({ ...prev, processor: e.target.value }))}
                    className="form-input" 
                    placeholder="e.g. Intel Core i5" 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">RAM</label>
                  <input 
                    type="text" 
                    value={newDeviceForm.ram} 
                    onChange={e => setNewDeviceForm(prev => ({ ...prev, ram: e.target.value }))}
                    className="form-input" 
                    placeholder="e.g. 8 GB DDR4" 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="form-group">
                  <label className="form-label">Storage</label>
                  <input 
                    type="text" 
                    value={newDeviceForm.storage} 
                    onChange={e => setNewDeviceForm(prev => ({ ...prev, storage: e.target.value }))}
                    className="form-input" 
                    placeholder="e.g. 256 GB SSD" 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Operating System</label>
                  <input 
                    type="text" 
                    value={newDeviceForm.os} 
                    onChange={e => setNewDeviceForm(prev => ({ ...prev, os: e.target.value }))}
                    className="form-input" 
                    placeholder="e.g. Windows 11 Pro" 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Static / DHCP IP</label>
                <input 
                  type="text" 
                  value={newDeviceForm.ip} 
                  onChange={e => setNewDeviceForm(prev => ({ ...prev, ip: e.target.value }))}
                  className="form-input" 
                  placeholder="192.168.1.125" 
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddDeviceModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-mid)',
                    background: '#f8fafc',
                    color: 'var(--text-body)',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--navy-900)',
                    color: '#ffffff',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Add Workstation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
