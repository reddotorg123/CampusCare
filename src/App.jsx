import React, { useState, useEffect } from 'react';
import { 
  INITIAL_SCHOOLS, 
  INITIAL_TICKETS, 
  getVelammalMainLabDevices 
} from './data/labData';

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
import { FirstTimeGuideModal } from './components/FirstTimeGuideModal';
import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';

import { Home, Ticket, School, UserCheck, MoreHorizontal, HelpCircle, LogOut } from 'lucide-react';
import './styles/campuscare.css';

export default function App() {
  const STORAGE_KEY = 'campuscare_v2_clean';

  // Authentication State - Login Barrier First
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('login');
  const [activeBottomNav, setActiveBottomNav] = useState('home');
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showMoreSheet, setShowMoreSheet] = useState(false);
  const [isSupabaseActive, setIsSupabaseActive] = useState(() => isSupabaseConfigured());

  // Core Business State
  const [schools, setSchools] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_schools`);
    return saved ? JSON.parse(saved) : INITIAL_SCHOOLS;
  });

  const [selectedSchool, setSelectedSchool] = useState(() => schools[0]);

  const [labDevices, setLabDevices] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_devices`);
    return saved ? JSON.parse(saved) : getVelammalMainLabDevices();
  });

  const [selectedDevice, setSelectedDevice] = useState(() => {
    return labDevices.find(d => d.code === 'PC-07') || labDevices[6] || null;
  });

  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tickets`);
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [selectedTicket, setSelectedTicket] = useState(() => tickets[0]);

  // LocalStorage Persistence
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_schools`, JSON.stringify(schools));
  }, [schools]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_devices`, JSON.stringify(labDevices));
  }, [labDevices]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tickets`, JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Live Supabase Sync Effect
  useEffect(() => {
    if (isSupabaseActive) {
      const client = getSupabaseClient();
      if (client) {
        client
          .from('tickets')
          .select('*')
          .order('created_at', { ascending: false })
          .then(({ data, error }) => {
            if (!error && data && data.length > 0) {
              const mapped = data.map(dbT => ({
                id: dbT.id,
                schoolName: dbT.school_name || 'Velammal Matriculation',
                labName: dbT.lab_name || 'Computer Lab 1',
                systemId: dbT.device_code || dbT.system_id || 'PC-07',
                systemName: dbT.device_code || dbT.system_id || 'PC-07',
                issue: dbT.title || dbT.issue,
                priority: dbT.priority ? (dbT.priority.charAt(0).toUpperCase() + dbT.priority.slice(1)) : 'High',
                status: dbT.status || 'open',
                reportedBy: dbT.reporter_name || 'Lab In-Charge',
                reportedAt: dbT.created_at ? new Date(dbT.created_at).toLocaleDateString() : 'Today',
                category: dbT.category || 'Hardware',
                notes: dbT.description || '',
                timeline: [
                  { step: 'Created', label: 'Ticket Logged', date: 'Logged', done: true },
                  { step: 'Assigned', label: 'Tech Assigned', date: '', done: false },
                  { step: 'Service', label: 'In Progress', date: '', done: false },
                  { step: 'Resolved', label: 'Resolved & Signed', date: '', done: false }
                ],
                communications: []
              }));
              setTickets(mapped);
            }
          })
          .catch(err => console.warn('Supabase fetch error:', err));
      }
    }
  }, [isSupabaseActive]);

  // Handlers
  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);

    // Trigger Onboarding Guide on First-Time Login
    const hasSeenGuide = localStorage.getItem(`${STORAGE_KEY}_guide_seen`);
    if (!hasSeenGuide) {
      setShowGuideModal(true);
      localStorage.setItem(`${STORAGE_KEY}_guide_seen`, 'true');
    }

    // Role-based screen routing
    if (userData.role === 'technician') {
      setCurrentScreen('technician_job');
      setActiveBottomNav('tickets');
    } else if (userData.role === 'school_staff') {
      setSelectedSchool(schools[0]);
      setCurrentScreen('dashboard');
      setActiveBottomNav('home');
    } else {
      setCurrentScreen('dashboard');
      setActiveBottomNav('home');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('login');
  };

  const handleSelectSchool = (school) => {
    setSelectedSchool(school);
    setCurrentScreen('lab_map');
  };

  const handleSelectDevice = (device) => {
    setSelectedDevice(device);
    setCurrentScreen('system_details');
  };

  const handleOpenTicketFromSystem = (device) => {
    setSelectedDevice(device);
    setCurrentScreen('create_ticket');
  };

  const handleCreateTicketSubmit = (newTicket) => {
    setTickets(prev => [newTicket, ...prev]);
    
    // Push to Supabase if active
    if (isSupabaseActive) {
      const client = getSupabaseClient();
      if (client) {
        client.from('tickets').insert([{
          id: newTicket.id,
          title: newTicket.issue,
          description: newTicket.notes || newTicket.issue,
          priority: (newTicket.priority || 'medium').toLowerCase(),
          status: 'open',
          reporter_name: newTicket.reportedBy || 'Staff',
          device_code: newTicket.systemName || newTicket.systemId || 'PC-07'
        }]).then(({ error }) => {
          if (error) console.warn('Supabase insert ticket error:', error);
        });
      }
    }

    // Update device status to issue_reported
    if (newTicket.systemName) {
      setLabDevices(prev => prev.map(d => {
        if (d.code === newTicket.systemName) {
          return { ...d, status: 'issue_reported' };
        }
        return d;
      }));
    }

    setSelectedTicket(newTicket);
    setCurrentScreen('ticket_details');
    setActiveBottomNav('tickets');
  };

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setCurrentScreen('ticket_details');
    setActiveBottomNav('tickets');
  };

  const handleToggleChecklistItem = (ticketId, itemId) => {
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      const updatedChecklist = t.checklist?.map(item => {
        if (item.id !== itemId) return item;
        return { ...item, checked: !item.checked };
      });
      return { ...t, checklist: updatedChecklist };
    }));

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(prev => ({
        ...prev,
        checklist: prev.checklist?.map(item => {
          if (item.id !== itemId) return item;
          return { ...item, checked: !item.checked };
        })
      }));
    }
  };

  const handleUpdateTicketStatus = (ticketId, newStatus) => {
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      return { ...t, status: newStatus };
    }));

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(prev => ({ ...prev, status: newStatus }));
    }

    // Sync status to Supabase
    if (isSupabaseActive) {
      const client = getSupabaseClient();
      if (client) {
        client.from('tickets').update({ status: newStatus }).eq('id', ticketId).then(({ error }) => {
          if (error) console.warn('Supabase status update error:', error);
        });
      }
    }

    // Sync device status on lab map
    const t = tickets.find(ticket => ticket.id === ticketId);
    if (t && t.systemName) {
      setLabDevices(prev => prev.map(d => {
        if (d.code === t.systemName) {
          const deviceStatus = newStatus === 'resolved' || newStatus === 'closed' ? 'working' :
                               newStatus === 'in_progress' ? 'under_service' : 'issue_reported';
          return { ...d, status: deviceStatus };
        }
        return d;
      }));
    }
  };

  const handleSendChatMessage = (newMessage) => {
    if (!selectedTicket) return;

    setTickets(prev => prev.map(t => {
      if (t.id !== selectedTicket.id) return t;
      return {
        ...t,
        communications: [...(t.communications || []), newMessage]
      };
    }));

    setSelectedTicket(prev => ({
      ...prev,
      communications: [...(prev.communications || []), newMessage]
    }));

    // Sync communication to Supabase
    if (isSupabaseActive) {
      const client = getSupabaseClient();
      if (client) {
        client.from('ticket_communications').insert([{
          ticket_id: selectedTicket.id,
          sender_name: newMessage.author,
          sender_role: newMessage.role || 'staff',
          message: newMessage.text
        }]).then(({ error }) => {
          if (error) console.warn('Supabase communication insert error:', error);
        });
      }
    }
  };

  const handleSaveLabLayout = (updatedDevices) => {
    setLabDevices(updatedDevices);
  };

  const handleBottomNavClick = (tab) => {
    setActiveBottomNav(tab);
    switch (tab) {
      case 'home':
        setCurrentScreen('dashboard');
        break;
      case 'tickets':
        setCurrentScreen('ticket_details');
        break;
      case 'schools':
        setCurrentScreen('schools');
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

  const showBottomNav = [
    'dashboard', 
    'schools', 
    'lab_map'
  ].includes(currentScreen);

  const openTicketsCount = tickets.filter(t => t.status !== 'resolved' && t.status !== 'closed').length;

  return (
    <div className="campuscare-app-shell">
      <div className="mobile-phone-viewport">
        {/* First Time User Onboarding Guide Modal */}
        {showGuideModal && (
          <FirstTimeGuideModal 
            onClose={() => setShowGuideModal(false)}
          />
        )}

        {/* Screen Routing Switcher */}
        {currentScreen === 'login' && (
          <CampusCareLogin onLogin={handleLogin} />
        )}

        {currentScreen === 'dashboard' && (
          <CampusCareDashboard 
            tickets={tickets}
            onSelectTicket={handleSelectTicket}
            onNavigateTo={(screen) => {
              setCurrentScreen(screen);
              if (screen === 'tickets') setActiveBottomNav('tickets');
              if (screen === 'schools') setActiveBottomNav('schools');
              if (screen === 'lab_map') setActiveBottomNav('home');
            }}
            onQuickAction={(action) => {
              if (action === 'add_school') setCurrentScreen('schools');
              else if (action === 'assign_ticket') setCurrentScreen('ticket_details');
              else if (action === 'reports') setCurrentScreen('ticket_timeline');
            }}
          />
        )}

        {currentScreen === 'schools' && (
          <CampusCareSchoolsList 
            schools={schools}
            onSelectSchool={handleSelectSchool}
            onBack={() => {
              setCurrentScreen('dashboard');
              setActiveBottomNav('home');
            }}
          />
        )}

        {currentScreen === 'lab_map' && (
          <CampusCareLabMap 
            school={selectedSchool}
            lab={selectedSchool?.labs?.[0]}
            devices={labDevices}
            onSelectDevice={handleSelectDevice}
            onOpenEditor={() => setCurrentScreen('lab_editor')}
            onBack={() => {
              setCurrentScreen('schools');
              setActiveBottomNav('schools');
            }}
          />
        )}

        {currentScreen === 'system_details' && (
          <CampusCareSystemDetails 
            device={selectedDevice}
            school={selectedSchool}
            lab={selectedSchool?.labs?.[0]}
            onRaiseTicket={handleOpenTicketFromSystem}
            onBack={() => setCurrentScreen('lab_map')}
          />
        )}

        {currentScreen === 'create_ticket' && (
          <CampusCareCreateTicket 
            schools={schools}
            currentSchool={selectedSchool}
            currentLab={selectedSchool?.labs?.[0]}
            currentDevice={selectedDevice}
            onSubmitTicket={handleCreateTicketSubmit}
            onBack={() => setCurrentScreen('system_details')}
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
              setCurrentScreen('dashboard');
              setActiveBottomNav('home');
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
            ticket={selectedTicket}
            onToggleChecklistItem={handleToggleChecklistItem}
            onUpdateStatus={handleUpdateTicketStatus}
            onNavigateToMap={() => {
              setCurrentScreen('lab_map');
              setActiveBottomNav('home');
            }}
            onBack={() => {
              setCurrentScreen('ticket_details');
              setActiveBottomNav('tickets');
            }}
          />
        )}

        {currentScreen === 'lab_editor' && (
          <CampusCareLabEditor 
            lab={selectedSchool?.labs?.[0]}
            devices={labDevices}
            onSaveLab={handleSaveLabLayout}
            onBack={() => setCurrentScreen('lab_map')}
          />
        )}

        {/* Global Bottom Navigation (Visible on Core Hub Screens) */}
        {showBottomNav && (
          <div className="bottom-nav-bar">
            <button 
              className={`bottom-nav-item ${activeBottomNav === 'home' ? 'active' : ''}`}
              onClick={() => handleBottomNavClick('home')}
            >
              <Home size={18} />
              <span>Home</span>
            </button>

            <button 
              className={`bottom-nav-item ${activeBottomNav === 'tickets' ? 'active' : ''}`}
              onClick={() => handleBottomNavClick('tickets')}
            >
              <Ticket size={18} />
              {openTicketsCount > 0 && (
                <span className="bottom-nav-badge">{openTicketsCount}</span>
              )}
              <span>Tickets</span>
            </button>

            <button 
              className={`bottom-nav-item ${activeBottomNav === 'schools' ? 'active' : ''}`}
              onClick={() => handleBottomNavClick('schools')}
            >
              <School size={18} />
              <span>Schools</span>
            </button>

            <button 
              className={`bottom-nav-item ${activeBottomNav === 'engineers' ? 'active' : ''}`}
              onClick={() => handleBottomNavClick('engineers')}
            >
              <UserCheck size={18} />
              <span>Engineers</span>
            </button>

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
                    {currentUser?.role?.replace('_', ' ') || 'Admin'} • CampusCare
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
                <button
                  onClick={() => { setShowMoreSheet(false); setShowGuideModal(true); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    color: '#1e293b',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <HelpCircle size={18} color="#2563eb" />
                  <span>App Guide & User Tour</span>
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
                    background: '#fff1f2',
                    color: '#e11d48',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={18} color="#e11d48" />
                  <span>Sign Out / Switch Role</span>
                </button>
              </div>

              <button
                onClick={() => setShowMoreSheet(false)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#f1f5f9',
                  color: '#475569',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
