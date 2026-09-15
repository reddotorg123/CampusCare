import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Save, 
  Sliders, 
  Plus, 
  Trash2, 
  Monitor, 
  Printer, 
  Check, 
  Cpu, 
  Sparkles,
  RefreshCw,
  School,
  Building2
} from 'lucide-react';
import { 
  generateSystemCoordinates, 
  ROOM_ARRANGEMENTS, 
  INITIAL_SCHOOLS 
} from '../data/labData';

export function LabLayoutDesigner({
  currentLab,
  schools = INITIAL_SCHOOLS,
  currentSchoolId,
  onSaveLab,
  onClose
}) {
  const [selectedSchoolId, setSelectedSchoolId] = useState(
    currentLab.schoolId || currentSchoolId || schools[0]?.id || 'sch-main'
  );
  const [labName, setLabName] = useState(currentLab.name || 'New Computer Lab');
  const [room, setRoom] = useState(currentLab.room || 'Room 101');
  const [building, setBuilding] = useState(currentLab.building || 'Main Campus');
  const [code, setCode] = useState(currentLab.code || 'LAB-NEW');
  const [accentColor, setAccentColor] = useState(currentLab.accentColor || '#00bceb');
  
  // Arrangement layout selection
  const [layoutType, setLayoutType] = useState(currentLab.layoutType || 'u_shape');

  // Count from 4 to 100
  const initialPCCount = currentLab.devices?.filter(d => d.type === 'pc').length || 16;
  const [systemCount, setSystemCount] = useState(initialPCCount);
  const [columns, setColumns] = useState(4);

  // Template Hardware Specs
  const [defaultCpu, setDefaultCpu] = useState('Intel Core i7-11700');
  const [defaultRam, setDefaultRam] = useState('16 GB DDR4');
  const [defaultOs, setDefaultOs] = useState('Windows 11 Pro Education');
  const [defaultStorage, setDefaultStorage] = useState('512 GB NVMe SSD');
  const [ipSubnet, setIpSubnet] = useState('192.168.10');

  // Printers Configuration
  const initialPrinters = currentLab.devices?.filter(d => d.type === 'printer') || [];
  const [printerList, setPrinterList] = useState(
    initialPrinters.length ? initialPrinters : [
      {
        id: 'pr-laser-01',
        name: 'HP LaserJet Pro M404n',
        code: 'PRN-01',
        type: 'printer',
        status: 'operational',
        ip: `${ipSubnet}.10`,
        bench: 'Laser-01',
        coords: { x: 242, y: 58 },
        hardware: { model: 'HP LaserJet Pro M404n', tonerLevel: 85, paperLevel: 90, paperStatus: 'Ready', queueCount: 0 }
      }
    ]
  );

  // Teacher PC & Switch inclusions
  const [includeTeacherPC, setIncludeTeacherPC] = useState(true);
  const [includeSwitchRack, setIncludeSwitchRack] = useState(true);

  const selectedSchool = schools.find(s => s.id === selectedSchoolId) || schools[0];

  // Generate the full lab dataset
  const handleGenerateAndSave = () => {
    // 1. Generate PC Devices using the chosen arrangement generator
    const pcDevices = generateSystemCoordinates(systemCount, columns, layoutType).map((pc, idx) => ({
      ...pc,
      ip: `${ipSubnet}.${20 + idx}`,
      hardware: {
        ...pc.hardware,
        cpu: defaultCpu,
        ram: defaultRam,
        os: defaultOs,
        storage: defaultStorage
      }
    }));

    // 2. Add Teacher Station & Switch
    const fixedTopDevices = [];
    if (includeTeacherPC) {
      // If U-shape, teacher is placed in center
      const teacherCoords = layoutType === 'u_shape' 
        ? { x: 190, y: 220 } 
        : { x: 60, y: 58 };

      fixedTopDevices.push({
        id: `pc-${code.toLowerCase()}-teacher`,
        name: 'Teacher Podium Station',
        code: 'TEACHER-PC',
        type: 'pc',
        status: 'operational',
        ip: `${ipSubnet}.15`,
        mac: '00:1B:44:00:A1:00',
        vlan: '10 (Faculty)',
        switchPort: 'Fa0/22',
        bench: 'Teacher',
        coords: teacherCoords,
        hardware: { model: 'Dell OptiPlex 7090 AIO', cpu: defaultCpu, ram: '32 GB', os: defaultOs, storage: defaultStorage, powerState: true },
        tickets: []
      });
    }

    if (includeSwitchRack) {
      fixedTopDevices.push({
        id: `sw-${code.toLowerCase()}-core`,
        name: 'Distribution Switch Rack',
        code: `SW-${code}-2960`,
        type: 'switch',
        status: 'operational',
        ip: `${ipSubnet}.2`,
        mac: '00:1D:71:E5:10:02',
        vlan: '10 (Mgmt)',
        switchPort: 'Uplink Gig0/1',
        bench: 'Rack',
        coords: { x: 138, y: 58 },
        hardware: { model: 'Cisco Catalyst 2960-24TT', os: 'Cisco IOS 15.0', powerState: true, uptime: '90 days' },
        tickets: []
      });
    }

    // 3. Position Printers on Top Right
    const positionedPrinters = printerList.map((pr, idx) => ({
      ...pr,
      coords: { x: 242 + idx * 78, y: 58 },
      ip: `${ipSubnet}.${10 + idx}`
    }));

    // 4. Calculate map height based on layout type and system count
    let calculatedHeight = 520;
    if (layoutType === 'cluster_pods') {
      const podsCount = Math.ceil(systemCount / 4);
      const podRows = Math.ceil(podsCount / 2);
      calculatedHeight = Math.max(490, 180 + podRows * 135);
    } else if (layoutType === 'dual_bank') {
      const rows = Math.ceil(systemCount / 4);
      calculatedHeight = Math.max(500, 160 + rows * 74 + 60);
    } else if (layoutType === 'classroom_rows') {
      const rows = Math.ceil(systemCount / columns);
      calculatedHeight = Math.max(500, 160 + rows * 68 + 70);
    }

    const updatedLab = {
      ...currentLab,
      schoolId: selectedSchool.id,
      schoolName: selectedSchool.name,
      schoolCode: selectedSchool.code,
      name: labName,
      room,
      building,
      code,
      layoutType,
      accentColor: selectedSchool.accentColor || accentColor,
      totalPCs: systemCount + (includeTeacherPC ? 1 : 0),
      totalPrinters: positionedPrinters.length,
      mapBounds: { width: 380, height: calculatedHeight },
      devices: [...fixedTopDevices, ...positionedPrinters, ...pcDevices]
    };

    onSaveLab(updatedLab);
    onClose();
  };

  const addPrinter = () => {
    if (printerList.length >= 4) return;
    const newIdx = printerList.length + 1;
    setPrinterList([
      ...printerList,
      {
        id: `pr-${code.toLowerCase()}-${newIdx}`,
        name: `Network Laser Printer ${newIdx}`,
        code: `PRN-0${newIdx}`,
        type: 'printer',
        status: 'operational',
        ip: `${ipSubnet}.${10 + newIdx}`,
        bench: `Print-${newIdx}`,
        coords: { x: 242, y: 58 },
        hardware: { model: 'HP LaserJet Pro M404n', tonerLevel: 90, paperLevel: 95, paperStatus: 'Ready', queueCount: 0 },
        tickets: []
      }
    ]);
  };

  const removePrinter = (index) => {
    if (printerList.length <= 1) return;
    setPrinterList(printerList.filter((_, idx) => idx !== index));
  };

  return (
    <div className="modal-fullscreen-sheet" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="modal-header">
        <div className="modal-title">
          <Sliders size={20} style={{ color: 'var(--cisco-blue)' }} />
          <span>Lab Layout & System Designer</span>
        </div>

        <button className="icon-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
      </div>

      <div className="modal-content-scroll">
        <div style={{ background: 'rgba(0, 188, 235, 0.08)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-focus)', marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--cisco-blue)' }}>
            🛠️ IT Support Administrator Portal
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Design room layouts (U-Shape, Rows, Pods, Dual-Bank), set system count from 4 to 100 PCs, assign to client schools, and configure hardware specs.
          </div>
        </div>

        {/* 1. Client School Assignment */}
        <div className="hardware-view-card">
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <School size={15} color="var(--cisco-blue)" />
            <span>1. Client School Assignment</span>
          </div>

          <div>
            <label style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Assign Lab to School
            </label>
            <select
              value={selectedSchoolId}
              onChange={e => setSelectedSchoolId(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 600 }}
            >
              {schools.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code}) - {s.campus}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Room Arrangement Selector */}
        <div className="hardware-view-card">
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={15} color="var(--cisco-blue)" />
            <span>2. Room Physical Arrangement</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {ROOM_ARRANGEMENTS.map(arr => {
              const isSelected = arr.id === layoutType;
              return (
                <button
                  key={arr.id}
                  type="button"
                  onClick={() => setLayoutType(arr.id)}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    background: isSelected ? 'var(--bg-surface-active)' : 'var(--bg-surface)',
                    border: isSelected ? `2px solid ${arr.accentColor}` : '1px solid var(--border-subtle)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '18px' }}>{arr.icon}</span>
                    {isSelected && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: arr.accentColor }} />
                    )}
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: isSelected ? arr.accentColor : 'var(--text-main)' }}>
                    {arr.shortName}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: '1.2' }}>
                    {arr.tagline}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Lab Identification */}
        <div className="hardware-view-card">
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)' }}>
            3. Lab Identity & Room Information
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <div>
              <label style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Lab Name</label>
              <input
                type="text"
                value={labName}
                onChange={e => setLabName(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Lab Code / ID</label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Room & Floor</label>
              <input
                type="text"
                value={room}
                onChange={e => setRoom(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Building</label>
              <input
                type="text"
                value={building}
                onChange={e => setBuilding(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* 4. System Count (4 to 100 PCs) */}
        <div className="hardware-view-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                4. Computer Capacity (4 to 100 Workstations)
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Auto-generates desk spacing, benches, and IP ranges
              </div>
            </div>

            <div className="badge badge-operational" style={{ fontSize: '14px', padding: '4px 10px' }}>
              {systemCount} Systems
            </div>
          </div>

          {/* Slider for quick sizing */}
          <div style={{ margin: '14px 0 16px 0' }}>
            <input
              type="range"
              min="4"
              max="100"
              step="2"
              value={systemCount}
              onChange={e => setSystemCount(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--cisco-blue)', height: '6px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-dim)' }}>
              <span>4 PCs (Micro)</span>
              <span>24 PCs (Standard)</span>
              <span>60 PCs (Mega)</span>
              <span>100 PCs (Exam Center)</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
            {[
              { label: '4 PCs (Micro)', val: 4, cols: 2 },
              { label: '12 PCs (Pods)', val: 12, cols: 4 },
              { label: '16 PCs (U-Shape)', val: 16, cols: 4 },
              { label: '24 PCs (Standard)', val: 24, cols: 4 },
              { label: '48 PCs (Exam)', val: 48, cols: 4 },
              { label: '100 PCs (Campus)', val: 100, cols: 4 }
            ].map(p => (
              <button
                key={p.val}
                type="button"
                onClick={() => {
                  setSystemCount(p.val);
                  setColumns(p.cols);
                }}
                className={`pt-pill-btn ${systemCount === p.val ? 'active-all' : ''}`}
                style={{ fontSize: '11px' }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Hardware Template & Specifications */}
        <div className="hardware-view-card">
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px', color: 'var(--text-main)' }}>
            5. Default Workstation Hardware Template
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <div>
              <label style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Processor (CPU)</label>
              <select
                value={defaultCpu}
                onChange={e => setDefaultCpu(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="Intel Core i7-11700">Intel Core i7-11700</option>
                <option value="Intel Core i5-12400">Intel Core i5-12400</option>
                <option value="Intel Xeon W-2245">Intel Xeon W-2245 (CAD/3D)</option>
                <option value="AMD Ryzen 7 5700G">AMD Ryzen 7 5700G</option>
                <option value="Apple M2 Silicon">Apple M2 Silicon</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>RAM Memory</label>
              <select
                value={defaultRam}
                onChange={e => setDefaultRam(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="8 GB DDR4">8 GB DDR4</option>
                <option value="16 GB DDR4">16 GB DDR4</option>
                <option value="32 GB DDR4">32 GB DDR4</option>
                <option value="64 GB DDR4">64 GB DDR4</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <div>
              <label style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Operating System</label>
              <select
                value={defaultOs}
                onChange={e => setDefaultOs(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="Windows 11 Pro Education">Windows 11 Pro Education</option>
                <option value="Ubuntu 24.04 LTS">Ubuntu 24.04 LTS</option>
                <option value="ChromeOS Flex">ChromeOS Flex</option>
                <option value="macOS Sequoia">macOS Sequoia</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Storage</label>
              <select
                value={defaultStorage}
                onChange={e => setDefaultStorage(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="256 GB NVMe SSD">256 GB NVMe SSD</option>
                <option value="512 GB NVMe SSD">512 GB NVMe SSD</option>
                <option value="1 TB NVMe SSD">1 TB NVMe SSD</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>VLAN Subnet (Auto-increment)</label>
            <input
              type="text"
              value={ipSubnet}
              onChange={e => setIpSubnet(e.target.value)}
              placeholder="192.168.10"
              style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
            />
          </div>
        </div>

        {/* 6. Network Printers in Lab */}
        <div className="hardware-view-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
              6. Network Printers ({printerList.length})
            </div>
            {printerList.length < 3 && (
              <button className="action-btn-primary" onClick={addPrinter} style={{ padding: '4px 8px', fontSize: '11px' }}>
                <Plus size={13} />
                <span>Add Printer</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {printerList.map((pr, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Printer size={16} style={{ color: 'var(--cisco-blue)' }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600 }}>{pr.name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{pr.code} • {pr.ip}</div>
                  </div>
                </div>

                {printerList.length > 1 && (
                  <button onClick={() => removePrinter(idx)} style={{ color: '#ef4444', padding: '4px' }}>
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Save and Deploy button */}
        <div style={{ marginTop: '10px', marginBottom: '20px' }}>
          <button
            className="action-btn-primary"
            onClick={handleGenerateAndSave}
            style={{ width: '100%', padding: '12px', fontSize: '14px', gap: '8px' }}
          >
            <Save size={16} />
            <span>Apply Layout & Save to {selectedSchool.name} ({systemCount} PCs)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
