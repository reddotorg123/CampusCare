import React from 'react';
import { 
  Network, 
  TicketCheck, 
  MonitorSmartphone, 
  Plus, 
  UserCheck,
  QrCode
} from 'lucide-react';

export function BottomNav({ 
  activeTab, 
  setActiveTab, 
  ticketsCount, 
  onQuickReport,
  onOpenScanner
}) {
  const handleHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(12);
    }
  };

  return (
    <nav className="bottom-nav">
      {/* 1. Floor Map Tab */}
      <button 
        className={`nav-item ${activeTab === 'map' ? 'active' : ''}`}
        onClick={() => {
          handleHaptic();
          setActiveTab('map');
        }}
        aria-label="Lab Map"
      >
        <div className="nav-icon-wrapper">
          <Network size={20} />
        </div>
        <span>Lab Map</span>
      </button>

      {/* 2. Tickets Tab */}
      <button 
        className={`nav-item ${activeTab === 'tickets' ? 'active' : ''}`}
        onClick={() => {
          handleHaptic();
          setActiveTab('tickets');
        }}
        aria-label="Tickets"
      >
        <div className="nav-icon-wrapper">
          <TicketCheck size={20} />
          {ticketsCount > 0 && (
            <span className="nav-badge">{ticketsCount}</span>
          )}
        </div>
        <span>Tickets</span>
      </button>

      {/* 3. Center Quick Action: Report Issue Button */}
      <button 
        className="nav-quick-report-btn"
        onClick={() => {
          handleHaptic();
          onQuickReport();
        }}
        title="Raise School IT Ticket"
        aria-label="Raise Ticket"
      >
        <Plus size={24} strokeWidth={2.8} />
      </button>

      {/* 4. Engineer Visits Tab (Who visited & attended tickets) */}
      <button 
        className={`nav-item ${activeTab === 'visits' ? 'active' : ''}`}
        onClick={() => {
          handleHaptic();
          setActiveTab('visits');
        }}
        aria-label="Engineer Visits"
      >
        <div className="nav-icon-wrapper">
          <UserCheck size={20} />
        </div>
        <span>Visits</span>
      </button>

      {/* 5. Inventory / Equipment Tab */}
      <button 
        className={`nav-item ${activeTab === 'devices' ? 'active' : ''}`}
        onClick={() => {
          handleHaptic();
          setActiveTab('devices');
        }}
        aria-label="Devices Inventory"
      >
        <div className="nav-icon-wrapper">
          <MonitorSmartphone size={20} />
        </div>
        <span>Systems</span>
      </button>
    </nav>
  );
}
