import React, { useState, useEffect, useMemo } from 'react';
import { CampusCareLogin } from './components/CampusCareLogin';
import { CampusCareDashboard } from './components/CampusCareDashboard';
import { CampusCareSchoolsList } from './components/CampusCareSchoolsList';
import { CampusCareLabMap } from './components/CampusCareLabMap';
import { CampusCareSystemDetails } from './components/CampusCareSystemDetails';
import { CampusCareCreateTicket } from './components/CampusCareCreateTicket';
import { CampusCareTicketDetails } from './components/CampusCareTicketDetails';
import { CampusCareTicketTimeline } from './components/CampusCareTicketTimeline';
import { CampusCareTechnicianJob } from './components/CampusCareTechnicianJob';
import { CampusCareLabEditor } from './components/CampusCareLabEditor';
import { CampusCareTicketsList } from './components/CampusCareTicketsList';
import SupabaseConfigModal from './components/SupabaseConfigModal';
import { OtaUpdateModal } from './components/OtaUpdateModal';
import { checkOtaUpdate, APP_CURRENT_VERSION } from './services/otaService';
import { INITIAL_SCHOOLS, INITIAL_TICKETS } from './data/labData';
import { 
  isLiveDb, 
  fetchSchoolsFromDb, 
  fetchTicketsFromDb, 
  registerSchoolInDb,
  createTicketInDb, 
  updateTicketStatusInDb, 
  claimTicketInDb, 
  saveLabLayoutToDb, 
  subscribeToTickets 
} from './services/dbService';

import { Home, Ticket, School, UserCheck, MoreHorizontal, LogOut, Monitor, PlusCircle, Database, ArrowDownCircle } from 'lucide-react';
import './styles/campuscare.css';

// Helper to generate clean lab workstations without hardcoded fake data
export function generateInitialLabDevices(count = 20, schoolCode = 'PC') {
  const devices = [];
  const cols = 5;
  for (let i = 1; i <= count; i++) {
    const numStr = String(i).padStart(2, '0');
    const code = `PC-${numStr}`;
    const r = Math.floor((i - 1) / cols);
    const c = (i - 1) % cols;
    devices.push({
      id: `dev-pc-${numStr}`,
      name: code,
      code: code,
      assetCode: `${schoolCode}-PC-0${numStr}`,
      status: 'working',
      type: 'pc',
      coords: {
        x: 35 + (c * 66),
        y: 60 + (r * 78)
      },
      width: 52,
      height: 44,
      makeModel: 'Standard Lab Workstation',
      processor: 'Intel Core i5',
      ram: '8 GB',
      storage: '256 GB SSD',
      os: 'Windows 11 Pro',
      ip: `192.168.1.${100 + i}`
    });
  }

  // Add configurable Teacher's Desk & Entrance
  devices.push({
    id: 'element-teacher-desk',
    type: 'teacher_desk',
    name: "Teacher's Desk",
    code: "TEACHER",
    coords: { x: 280, y: 340 },
    width: 88,
    height: 44
  });

  devices.push({
    id: 'element-main-entrance',
    type: 'entrance',
    name: "Main Entrance",
    code: "ENTRANCE",
    coords: { x: 10, y: 350 },
    width: 68,
    height: 28
  });

  return devices;
}

export default function App() {
  // Clean persistent storage namespace (v3 - zero fake demo data)
  const STORAGE_KEY = 'campuscare_v3_clean';

  // Authentication State - Login Barrier First
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
    return Boolean(saved);
  });

  const [currentScreen, setCurrentScreen] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
    if (saved) {
      try {
        const u = JSON.parse(saved);
        return u.role === 'technician' ? 'technician_job' : 'dashboard';
      } catch {
        return 'login';
      }
    }
    return 'login';
  });

  const [activeBottomNav, setActiveBottomNav] = useState('home');
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showMoreSheet, setShowMoreSheet] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(() => isLiveDb());
  const [engineerNotification, setEngineerNotification] = useState(null);

  // Over-The-Air (OTA) Update State
  const [otaInfo, setOtaInfo] = useState(null);
  const [showOtaModal, setShowOtaModal] = useState(false);

  // Handle manual or automatic OTA Update check
  const handleCheckOta = async () => {
    const info = await checkOtaUpdate();
    if (info?.updateAvailable) {
      setOtaInfo(info);
      setShowOtaModal(true);
    } else {
      alert(`CampusCare is up to date! Current version: v${APP_CURRENT_VERSION}`);
    }
  };

  // Check for OTA update on startup
  useEffect(() => {
    checkOtaUpdate().then(info => {
      if (info && info.updateAvailable) {
        setOtaInfo(info);
        setShowOtaModal(true);
      }
    });
  }, []);

  // Core Business State - Starts Clean!
  // Core Business State - Falls back to INITIAL_SCHOOLS if storage is empty
  const [schools, setSchools] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_schools`);
      const list = saved ? JSON.parse(saved) : [];
      return (Array.isArray(list) && list.length > 0) ? list : INITIAL_SCHOOLS;
    } catch {
      return INITIAL_SCHOOLS;
    }
  });

  const [selectedSchool, setSelectedSchool] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_schools`);
      const list = saved ? JSON.parse(saved) : [];
      const activeList = (Array.isArray(list) && list.length > 0) ? list : INITIAL_SCHOOLS;
      return activeList[0] || null;
    } catch {
      return INITIAL_SCHOOLS[0] || null;
    }
  });

  // Selected Lab ID for multi-lab navigation
  const [selectedLabId, setSelectedLabId] = useState(() => {
    return INITIAL_SCHOOLS[0]?.labs?.[0]?.id || null;
  });

  // Per-lab devices map: { [labId]: [...] }
  const [devicesByLab, setDevicesByLab] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_devices_by_lab`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [selectedDevice, setSelectedDevice] = useState(null);

  const [tickets, setTickets] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tickets`);
      const list = saved ? JSON.parse(saved) : [];
      return (Array.isArray(list) && list.length > 0) ? list : INITIAL_TICKETS;
    } catch {
      return INITIAL_TICKETS;
    }
  });

  const [selectedTicket, setSelectedTicket] = useState(null);

  // LocalStorage Persistence
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_schools`, JSON.stringify(schools));
  }, [schools]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_devices_by_lab`, JSON.stringify(devicesByLab));
  }, [devicesByLab]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tickets`, JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(`${STORAGE_KEY}_user`);
    }
  }, [currentUser]);

  // Cloud database synchronization (Supabase)
  const loadCloudData = async () => {
    if (!isLiveDb()) return;
    try {
      const dbSchools = await fetchSchoolsFromDb();
      if (dbSchools !== null) {
        setSchools(dbSchools);
        setSelectedSchool(dbSchools[0] || null);
        if (dbSchools[0]?.labs && dbSchools[0].labs.length > 0) {
          setSelectedLabId(dbSchools[0].labs[0].id);
        } else {
          setSelectedLabId(null);
        }
      }

      const dbTickets = await fetchTicketsFromDb();
      if (dbTickets !== null) {
        setTickets(dbTickets);
      }
    } catch (err) {
      console.warn('Error loading cloud database tables:', err);
    }
  };

  useEffect(() => {
    if (isDbConnected) {
      loadCloudData();
      const unsubscribe = subscribeToTickets(() => {
        fetchTicketsFromDb().then(dbTickets => {
          if (dbTickets) setTickets(dbTickets);
        });
      });
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [isDbConnected]);

  // Multi-tenancy filtered schools
  const userSchools = useMemo(() => {
    if (currentUser?.role === 'school_staff') {
      return schools.filter(s => s.id === currentUser.schoolId || s.name === currentUser.schoolName);
    }
    return schools;
  }, [currentUser, schools]);

  const activeSchool = useMemo(() => {
    return userSchools.find(s => s.id === selectedSchool?.id) || userSchools[0] || selectedSchool;
  }, [userSchools, selectedSchool]);

  // Active School Labs
  const schoolLabs = useMemo(() => {
    if (!activeSchool) return [];
    if (activeSchool.labs && activeSchool.labs.length > 0) {
      return activeSchool.labs;
    }
    return [];
  }, [activeSchool]);

  // Current active lab
  const currentLab = useMemo(() => {
    if (!schoolLabs || schoolLabs.length === 0) return null;
    return schoolLabs.find(l => l.id === selectedLabId) || schoolLabs[0];
  }, [schoolLabs, selectedLabId]);

  // Current lab's workstations & layout elements
  const currentLabDevices = useMemo(() => {
    if (!currentLab) return [];
    if (devicesByLab[currentLab.id]) return devicesByLab[currentLab.id];
    return generateInitialLabDevices(currentLab.capacity || 20, currentLab.code || activeSchool?.code || 'PC');
  }, [currentLab, devicesByLab, activeSchool]);

  // Handle new institution registration from Login/Signup
  const handleRegisterNewSchool = async (newSchool, pcCount = 20) => {
    setSchools(prev => {
      const updated = [...prev.filter(s => s.id !== newSchool.id), newSchool];
      return updated;
    });

    setSelectedSchool(newSchool);

    const firstLab = newSchool.labs?.[0];
    const firstLabId = firstLab?.id || `lab-${newSchool.id}-1`;
    setSelectedLabId(firstLabId);

    // Initialize workstations for this school's first lab
    const count = Number(pcCount) || 20;
    const newDevices = generateInitialLabDevices(count, newSchool.code);
    setDevicesByLab(prev => ({
      ...prev,
      [firstLabId]: newDevices
    }));

    if (isDbConnected) {
      await registerSchoolInDb(newSchool);
    }
  };

  // Lab Management Handlers
  const handleSelectLab = (labId) => {
    setSelectedLabId(labId);
  };

  const handleAddLab = (newLabData, pcCount = 20) => {
    if (!activeSchool) return;
    const count = Number(pcCount) || 20;
    const newLabId = `lab-${activeSchool.id}-${Date.now()}`;
    const newLab = {
      id: newLabId,
      name: newLabData.name || `Computer Lab ${(schoolLabs.length || 0) + 1}`,
      code: newLabData.code || `LAB-0${(schoolLabs.length || 0) + 1}`,
      room: newLabData.room || 'Room 201',
      capacity: count,
      inCharge: newLabData.inCharge || '',
      phone: newLabData.phone || '',
      network: newLabData.network || 'Gigabit Ethernet Cat6 with Managed Switch',
      ups: newLabData.ups || '10kVA Online Central UPS (30 min backup)',
      operatingHours: newLabData.operatingHours || '8:30 AM - 4:30 PM (Mon - Fri)',
      notes: newLabData.notes || ''
    };

    // Update schools state
    setSchools(prev => prev.map(s => {
      if (s.id !== activeSchool.id) return s;
      const existingLabs = (s.labs && s.labs.length > 0) ? s.labs : schoolLabs;
      return {
        ...s,
        labsCount: existingLabs.length + 1,
        systemsCount: (s.systemsCount || 0) + count,
        labs: [...existingLabs, newLab]
      };
    }));

    // Generate initial workstations for this new lab
    const newDevices = generateInitialLabDevices(count, newLab.code);
    setDevicesByLab(prev => ({
      ...prev,
      [newLabId]: newDevices
    }));

    setSelectedLabId(newLabId);
  };

  const handleUpdateLab = (updatedLab) => {
    if (!activeSchool || !updatedLab) return;
    setSchools(prev => prev.map(s => {
      if (s.id !== activeSchool.id) return s;
      const currentList = (s.labs && s.labs.length > 0) ? s.labs : schoolLabs;
      return {
        ...s,
        labs: currentList.map(l => l.id === updatedLab.id ? { ...l, ...updatedLab } : l)
      };
    }));
  };

  const handleDeleteLab = (labId) => {
    if (!activeSchool || schoolLabs.length <= 1) return;
    setSchools(prev => prev.map(s => {
      if (s.id !== activeSchool.id) return s;
      const currentList = (s.labs && s.labs.length > 0) ? s.labs : schoolLabs;
      const filtered = currentList.filter(l => l.id !== labId);
      return {
        ...s,
        labsCount: filtered.length,
        labs: filtered
      };
    }));

    // Cleanup devices for deleted lab
    setDevicesByLab(prev => {
      const copy = { ...prev };
      delete copy[labId];
      return copy;
    });

    const remaining = schoolLabs.filter(l => l.id !== labId);
    if (remaining.length > 0) {
      setSelectedLabId(remaining[0].id);
    }
  };

  // Workstation Device Handlers
  const handleUpdateDevice = (updatedDevice) => {
    if (!currentLab || !updatedDevice) return;
    const labId = currentLab.id;
    setDevicesByLab(prev => {
      const list = prev[labId] || currentLabDevices;
      const updated = list.map(d => d.id === updatedDevice.id ? { ...d, ...updatedDevice } : d);
      return {
        ...prev,
        [labId]: updated
      };
    });
    setSelectedDevice(updatedDevice);
  };

  const handleAddDevice = (newDeviceData) => {
    if (!currentLab) return;
    const labId = currentLab.id;
    const currentList = devicesByLab[labId] || currentLabDevices;
    const nextNum = currentList.filter(d => d.type === 'pc' || !d.type).length + 1;
    const numStr = String(nextNum).padStart(2, '0');

    const newDevice = {
      id: `dev-pc-${Date.now()}`,
      name: newDeviceData.code || `PC-${numStr}`,
      code: newDeviceData.code || `PC-${numStr}`,
      assetCode: newDeviceData.assetCode || `${currentLab.code || 'LAB'}-PC-${numStr}`,
      status: newDeviceData.status || 'working',
      type: 'pc',
      coords: newDeviceData.coords || { x: 40 + ((nextNum % 5) * 66), y: 60 + (Math.floor(nextNum / 5) * 78) },
      width: 52,
      height: 44,
      makeModel: newDeviceData.makeModel || 'Standard Lab Workstation',
      processor: newDeviceData.processor || 'Intel Core i5',
      ram: newDeviceData.ram || '8 GB DDR4',
      storage: newDeviceData.storage || '256 GB SSD',
      os: newDeviceData.os || 'Windows 11 Pro',
      ip: newDeviceData.ip || `192.168.1.${100 + nextNum}`,
      mac: newDeviceData.mac || '',
      monitor: newDeviceData.monitor || '21.5" FHD',
      peripherals: newDeviceData.peripherals || 'USB Keyboard, Optical Mouse',
      location: newDeviceData.location || `${currentLab.name} - Row ${Math.ceil(nextNum / 5)}`,
      serialNumber: newDeviceData.serialNumber || `SN-${Date.now().toString().slice(-6)}`,
      purchaseDate: newDeviceData.purchaseDate || new Date().toISOString().split('T')[0]
    };

    setDevicesByLab(prev => ({
      ...prev,
      [labId]: [...currentList, newDevice]
    }));
  };

  // Handlers
  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);

    // For school staff, find their school and isolate view
    if (userData.role === 'school_staff') {
      const userSchool = schools.find(s => s.id === userData.schoolId) || selectedSchool;
      if (userSchool) {
        setSelectedSchool(userSchool);
        if (userSchool.labs && userSchool.labs.length > 0) {
          setSelectedLabId(userSchool.labs[0].id);
        }
      }
      setCurrentScreen('dashboard');
      setActiveBottomNav('home');
    } else if (userData.role === 'technician') {
      setCurrentScreen('technician_job');
      setActiveBottomNav('engineers');
    } else {
      setCurrentScreen('dashboard');
      setActiveBottomNav('home');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem(`${STORAGE_KEY}_user`);
    setCurrentScreen('login');
  };

  const handleSelectSchool = (school) => {
    setSelectedSchool(school);
    if (school?.labs && school.labs.length > 0) {
      setSelectedLabId(school.labs[0].id);
    }
    setCurrentScreen('lab_map');
    setActiveBottomNav('lab_map');
  };

  const handleSelectDevice = (device) => {
    setSelectedDevice(device);
    setCurrentScreen('system_details');
  };

  const handleOpenTicketFromSystem = (device) => {
    setSelectedDevice(device);
    setCurrentScreen('create_ticket');
  };

  const handleCreateTicketSubmit = async (ticketInput) => {
    let newTicket = {
      ...ticketInput,
      id: ticketInput.id || `tkt-${Date.now()}`,
      status: 'open',
      technician: 'Unassigned',
      assignedTo: null
    };

    if (isDbConnected) {
      newTicket = await createTicketInDb(newTicket);
    }

    setTickets(prev => [newTicket, ...prev]);

    // Send instant notification to Field Engineers
    setEngineerNotification(`🚨 New Issue: ${newTicket.schoolName} (${newTicket.systemName || 'PC'}) - "${newTicket.problem || newTicket.title}".`);
    setTimeout(() => setEngineerNotification(null), 7000);

    // Update workstation status to issue_reported
    if (newTicket.systemName) {
      const targetLabId = newTicket.labId || currentLab?.id;
      if (targetLabId) {
        setDevicesByLab(prev => {
          const list = prev[targetLabId] || currentLabDevices;
          const updated = list.map(d => {
            if (d.code === newTicket.systemName || d.name === newTicket.systemName) {
              return { ...d, status: 'issue_reported' };
            }
            return d;
          });
          return {
            ...prev,
            [targetLabId]: updated
          };
        });
      }
    }

    setSelectedTicket(newTicket);
    setCurrentScreen('tickets');
    setActiveBottomNav('tickets');
  };

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setCurrentScreen('ticket_details');
  };

  const handleUpdateTicketStatus = (ticketId, nextStatus) => {
    if (isDbConnected) {
      updateTicketStatusInDb(ticketId, nextStatus, '', currentUser?.name);
    }

    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      return {
        ...t,
        status: nextStatus,
        timeline: t.timeline?.map(step => {
          if (step.status === nextStatus) return { ...step, done: true, date: 'Just now' };
          return step;
        })
      };
    }));

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(prev => ({
        ...prev,
        status: nextStatus
      }));
    }
  };

  const handleClaimTicket = (ticketId, engineerName) => {
    if (isDbConnected) {
      claimTicketInDb(ticketId, engineerName);
    }

    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      return {
        ...t,
        technician: engineerName,
        assignedTo: engineerName,
        status: 'in_progress'
      };
    }));

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(prev => ({
        ...prev,
        technician: engineerName,
        assignedTo: engineerName,
        status: 'in_progress'
      }));
    }
  };

  const handleReleaseTicket = (ticketId, reason) => {
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      return {
        ...t,
        technician: 'Unassigned',
        assignedTo: null,
        status: 'open',
        releaseReason: reason
      };
    }));

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(prev => ({
        ...prev,
        technician: 'Unassigned',
        assignedTo: null,
        status: 'open',
        releaseReason: reason
      }));
    }
  };

  const handleToggleChecklistItem = (itemId) => {
    if (!selectedTicket) return;
    const updatedChecklist = selectedTicket.checklist?.map(item => {
      if (item.id === itemId) return { ...item, checked: !item.checked };
      return item;
    });

    setSelectedTicket(prev => ({ ...prev, checklist: updatedChecklist }));
    setTickets(prev => prev.map(t => {
      if (t.id === selectedTicket.id) return { ...t, checklist: updatedChecklist };
      return t;
    }));
  };

  const handleSendChatMessage = (text) => {
    if (!selectedTicket || !text.trim()) return;
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: currentUser?.name || 'Staff',
      role: currentUser?.role || 'school_staff',
      time: 'Just now',
      text: text.trim()
    };

    const updated = [...(selectedTicket.communications || []), newMessage];
    setSelectedTicket(prev => ({ ...prev, communications: updated }));
    setTickets(prev => prev.map(t => {
      if (t.id === selectedTicket.id) return { ...t, communications: updated };
      return t;
    }));
  };

  const handleSaveLabLayout = (updatedDevices) => {
    if (!currentLab) return;
    if (isDbConnected) {
      saveLabLayoutToDb(currentLab.id, updatedDevices);
    }
    setDevicesByLab(prev => ({
      ...prev,
      [currentLab.id]: updatedDevices
    }));
  };

  const handleBottomNavClick = (tab) => {
    setActiveBottomNav(tab);
    switch (tab) {
      case 'home':
        setCurrentScreen('dashboard');
        break;
      case 'lab_map':
        setCurrentScreen('lab_map');
        break;
      case 'tickets':
        setCurrentScreen('tickets');
        break;
      case 'schools':
        if (currentUser?.role === 'school_staff') {
          // Strictly block access to other schools (Data Isolation)
          setCurrentScreen('dashboard');
          setActiveBottomNav('home');
        } else {
          setCurrentScreen('schools');
        }
        break;
      case 'create_ticket':
        setCurrentScreen('create_ticket');
        break;
      case 'engineers':
        setCurrentScreen('technician_job');
        break;
      case 'more':
        setShowMoreSheet(true);
        break;
      default:
        setCurrentScreen('dashboard');
    }
  };

  const showBottomNav = isLoggedIn && [
    'dashboard', 
    'schools', 
    'lab_map',
    'tickets',
    'technician_job',
    'ticket_details'
  ].includes(currentScreen);

  // Filter tickets to current user's school for badge count
  const visibleTickets = currentUser?.role === 'school_staff'
    ? tickets.filter(t => t.schoolId === currentUser.schoolId || t.schoolName === activeSchool?.name)
    : tickets;

  const openTicketsCount = visibleTickets.filter(t => t.status !== 'resolved' && t.status !== 'closed').length;

  return (
    <div className="campuscare-app-shell">
      <div className="mobile-phone-viewport">
        {/* Real-time Alert for Field Engineers */}
        {engineerNotification && (
          <div style={{
            background: '#0f2942',
            color: '#ffffff',
            padding: '10px 16px',
            fontSize: '11px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 99,
            borderBottom: '2px solid #f59e0b',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px' }}>🚨</span>
              <span>{engineerNotification}</span>
            </div>
            <button
              onClick={() => {
                setEngineerNotification(null);
                setCurrentScreen('technician_job');
                setActiveBottomNav('engineers');
              }}
              style={{
                background: '#f59e0b',
                color: '#000000',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '10px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Open Pool
            </button>
          </div>
        )}

        {/* Screen Routing Switcher */}
        {currentScreen === 'login' && (
          <CampusCareLogin 
            onLogin={handleLogin}
            registeredSchools={schools}
            onRegisterSchool={handleRegisterNewSchool}
            isDbConnected={isDbConnected}
            onOpenDbConfig={() => setShowDbModal(true)}
            onCheckOta={handleCheckOta}
          />
        )}

        {currentScreen === 'dashboard' && (
          <CampusCareDashboard 
            tickets={tickets}
            currentUser={currentUser}
            currentSchool={activeSchool}
            schoolLabs={schoolLabs}
            labDevices={currentLabDevices}
            onSelectTicket={handleSelectTicket}
            isDbConnected={isDbConnected}
            onOpenDbConfig={() => setShowDbModal(true)}
            onNavigateTo={(screen) => {
              setCurrentScreen(screen);
              if (screen === 'tickets') setActiveBottomNav('tickets');
              if (screen === 'schools') setActiveBottomNav('schools');
              if (screen === 'lab_map') setActiveBottomNav('lab_map');
              if (screen === 'create_ticket') setActiveBottomNav('create_ticket');
              if (screen === 'engineers') setActiveBottomNav('engineers');
            }}
            onQuickAction={(action) => {
              if (action === 'add_school') setCurrentScreen('schools');
              else if (action === 'assign_ticket') setCurrentScreen('technician_job');
              else if (action === 'reports') setCurrentScreen('tickets');
            }}
          />
        )}

        {currentScreen === 'tickets' && (
          <CampusCareTicketsList 
            tickets={tickets}
            currentUser={currentUser}
            currentSchool={activeSchool}
            onSelectTicket={handleSelectTicket}
            onRaiseTicket={() => {
              setCurrentScreen('create_ticket');
              setActiveBottomNav('create_ticket');
            }}
            onBack={() => {
              setCurrentScreen('dashboard');
              setActiveBottomNav('home');
            }}
          />
        )}

        {currentScreen === 'schools' && (
          <CampusCareSchoolsList 
            schools={userSchools}
            currentUser={currentUser}
            onSelectSchool={handleSelectSchool}
            onBack={() => {
              setCurrentScreen('dashboard');
              setActiveBottomNav('home');
            }}
          />
        )}

        {currentScreen === 'lab_map' && (
          <CampusCareLabMap 
            school={activeSchool}
            lab={currentLab}
            allLabs={schoolLabs}
            devices={currentLabDevices}
            onSelectLab={handleSelectLab}
            onAddLab={handleAddLab}
            onUpdateLab={handleUpdateLab}
            onDeleteLab={handleDeleteLab}
            onSelectDevice={handleSelectDevice}
            onAddDevice={handleAddDevice}
            onOpenTicketFromSystem={handleOpenTicketFromSystem}
            onOpenEditor={() => setCurrentScreen('lab_editor')}
            onBack={() => {
              setCurrentScreen('dashboard');
              setActiveBottomNav('home');
            }}
          />
        )}

        {currentScreen === 'system_details' && (
          <CampusCareSystemDetails 
            device={selectedDevice}
            school={activeSchool}
            lab={currentLab}
            onUpdateDevice={handleUpdateDevice}
            onRaiseTicket={handleOpenTicketFromSystem}
            onBack={() => setCurrentScreen('lab_map')}
          />
        )}

        {currentScreen === 'create_ticket' && (
          <CampusCareCreateTicket 
            schools={userSchools}
            currentSchool={activeSchool}
            currentLab={currentLab}
            currentDevice={selectedDevice}
            currentUser={currentUser}
            onSubmitTicket={handleCreateTicketSubmit}
            onBack={() => setCurrentScreen('dashboard')}
          />
        )}

        {currentScreen === 'ticket_details' && (
          <CampusCareTicketDetails 
            ticket={selectedTicket}
            onAssign={() => setCurrentScreen('technician_job')}
            onUpdateStatus={() => setCurrentScreen('technician_job')}
            onCloseTicket={() => handleUpdateTicketStatus(selectedTicket.id, 'closed')}
            onOpenTimeline={() => setCurrentScreen('ticket_timeline')}
            onBack={() => {
              setCurrentScreen('tickets');
              setActiveBottomNav('tickets');
            }}
          />
        )}

        {currentScreen === 'ticket_timeline' && (
          <CampusCareTicketTimeline 
            ticket={selectedTicket}
            onSendMessage={handleSendChatMessage}
            onBack={() => setCurrentScreen('ticket_details')}
          />
        )}

        {currentScreen === 'technician_job' && (
          <CampusCareTechnicianJob 
            tickets={tickets}
            ticket={selectedTicket}
            currentUser={currentUser}
            onClaimTicket={handleClaimTicket}
            onReleaseTicket={handleReleaseTicket}
            onToggleChecklistItem={handleToggleChecklistItem}
            onUpdateStatus={handleUpdateTicketStatus}
            onNavigateToMap={() => {
              setCurrentScreen('lab_map');
              setActiveBottomNav('lab_map');
            }}
            onBack={() => {
              setCurrentScreen('dashboard');
              setActiveBottomNav('home');
            }}
          />
        )}

        {currentScreen === 'lab_editor' && (
          <CampusCareLabEditor 
            lab={currentLab}
            devices={currentLabDevices}
            onSaveLab={handleSaveLabLayout}
            onBack={() => setCurrentScreen('lab_map')}
          />
        )}

        {/* Global Bottom Navigation with Strict Role-Based Visibility */}
        {showBottomNav && (
          <div className="bottom-nav-bar">
            {/* 1. Home Tab */}
            <button 
              className={`bottom-nav-item ${activeBottomNav === 'home' ? 'active' : ''}`}
              onClick={() => handleBottomNavClick('home')}
            >
              <Home size={18} />
              <span>{currentUser?.role === 'school_staff' ? 'My School' : 'Home'}</span>
            </button>

            {/* 2. School Staff: Lab Map / Org Admin: Schools List */}
            {currentUser?.role === 'school_staff' ? (
              <button 
                className={`bottom-nav-item ${activeBottomNav === 'lab_map' ? 'active' : ''}`}
                onClick={() => handleBottomNavClick('lab_map')}
              >
                <Monitor size={18} />
                <span>Lab Map</span>
              </button>
            ) : currentUser?.role === 'org_admin' ? (
              <button 
                className={`bottom-nav-item ${activeBottomNav === 'schools' ? 'active' : ''}`}
                onClick={() => handleBottomNavClick('schools')}
              >
                <School size={18} />
                <span>Schools</span>
              </button>
            ) : null}

            {/* 3. School Staff: + Raise Ticket / Technician & Admin: Field Jobs */}
            {currentUser?.role === 'school_staff' ? (
              <button 
                className={`bottom-nav-item ${activeBottomNav === 'create_ticket' ? 'active' : ''}`}
                onClick={() => handleBottomNavClick('create_ticket')}
                style={{ color: '#2563eb' }}
              >
                <PlusCircle size={20} />
                <span style={{ fontWeight: '700' }}>+ Report</span>
              </button>
            ) : (
              <button 
                className={`bottom-nav-item ${activeBottomNav === 'engineers' ? 'active' : ''}`}
                onClick={() => handleBottomNavClick('engineers')}
              >
                <UserCheck size={18} />
                <span>{currentUser?.role === 'technician' ? 'Field Jobs' : 'Engineers'}</span>
              </button>
            )}

            {/* 4. Tickets Tab */}
            <button 
              className={`bottom-nav-item ${activeBottomNav === 'tickets' ? 'active' : ''}`}
              onClick={() => handleBottomNavClick('tickets')}
            >
              <Ticket size={18} />
              {openTicketsCount > 0 && (
                <span className="bottom-nav-badge">{openTicketsCount}</span>
              )}
              <span>{currentUser?.role === 'school_staff' ? 'My Tickets' : 'Tickets'}</span>
            </button>

            {/* 5. More / Account Tab */}
            <button 
              className={`bottom-nav-item ${activeBottomNav === 'more' ? 'active' : ''}`}
              onClick={() => handleBottomNavClick('more')}
            >
              <MoreHorizontal size={18} />
              <span>More</span>
            </button>
          </div>
        )}

        {/* Clean iOS More / Account Action Sheet */}
        {showMoreSheet && (
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center'
            }}
            onClick={() => setShowMoreSheet(false)}
          >
            <div 
              style={{
                width: '100%',
                maxWidth: '430px',
                background: '#ffffff',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px',
                padding: '20px',
                boxShadow: '0 -10px 25px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>
                    {currentUser?.name || 'Administrator'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'capitalize' }}>
                    {currentUser?.role?.replace('_', ' ') || 'Admin'} • {currentUser?.schoolName || 'CampusCare'}
                  </div>
                </div>
                <button 
                  onClick={() => setShowMoreSheet(false)}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', color: '#64748b' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '4px 0' }}>
                {/* Database & Cloud Sync Settings Button */}
                <button
                  onClick={() => { setShowMoreSheet(false); setShowDbModal(true); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Database size={18} color="#00bceb" />
                    <span>Database & Cloud Sync</span>
                  </div>
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: isDbConnected ? '#ecfdf5' : '#fffbeb',
                    color: isDbConnected ? '#047857' : '#b45309',
                    border: isDbConnected ? '1px solid #a7f3d0' : '1px solid #fde68a',
                    fontWeight: 700
                  }}>
                    {isDbConnected ? '🟢 Live Supabase' : '🟡 Local Mode'}
                  </span>
                </button>

                {/* Over-The-Air (OTA) Updates Button */}
                <button
                  onClick={async () => {
                    setShowMoreSheet(false);
                    await handleCheckOta();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ArrowDownCircle size={18} color="#2563eb" />
                    <span>Check for OTA Updates</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>
                    v{APP_CURRENT_VERSION}
                  </span>
                </button>

                <button
                  onClick={() => { setShowMoreSheet(false); handleLogout(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid #fee2e2',
                    background: '#fef2f2',
                    color: '#dc2626',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={18} />
                  <span>Log Out ({currentUser?.email || 'Account'})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Supabase Database Configuration & Status Modal */}
        <SupabaseConfigModal 
          isOpen={showDbModal}
          onClose={() => setShowDbModal(false)}
          onConfigSaved={({ isConnected, reloaded }) => {
            setIsDbConnected(isConnected);
            if (isConnected || reloaded) {
              loadCloudData();
            }
          }}
        />

        {/* Over-The-Air (OTA) Update Modal */}
        {showOtaModal && otaInfo && (
          <OtaUpdateModal 
            otaInfo={otaInfo}
            onClose={() => setShowOtaModal(false)}
          />
        )}
      </div>
    </div>
  );
}
