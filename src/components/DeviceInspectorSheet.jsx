import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Monitor, 
  Printer, 
  Network, 
  Terminal, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Power, 
  Cpu, 
  HardDrive, 
  Plus, 
  Send, 
  Wrench, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ISSUE_PRESETS } from '../data/labData';

export function DeviceInspectorSheet({
  device,
  lab,
  tickets,
  onClose,
  onResolveTicket,
  onAddTicket,
  onUpdateDeviceStatus,
  onTogglePower
}) {
  const [activeTab, setActiveTab] = useState('physical'); // 'physical' | 'config' | 'tickets' | 'cli'
  const [showNewIssueForm, setShowNewIssueForm] = useState(false);
  const [newIssueCategory, setNewIssueCategory] = useState('');
  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [newIssueDesc, setNewIssueDesc] = useState('');
  const [newIssuePriority, setNewIssuePriority] = useState('medium');

  // Terminal / CLI state
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [cliInput, setCliInput] = useState('');
  const terminalEndRef = useRef(null);

  // Initialize terminal banner when device opens
  useEffect(() => {
    if (!device) return;
    const isOnline = device.status !== 'critical' && (device.hardware?.powerState !== false);
    setTerminalHistory([
      `Cisco Packet Tracer Shell v8.2.0 - Node ${device.code}`,
      `Host: ${device.code} (${device.ip}) [VLAN 10]`,
      `NIC Link: ${isOnline ? 'UP (Full Duplex 1Gbps)' : 'DOWN / DISCONNECTED'}`,
      `Type 'help' or tap quick actions below to run diagnostics.`,
      `--------------------------------------------------`
    ]);
  }, [device?.id, device?.status]);

  useEffect(() => {
    if (activeTab === 'cli') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory, activeTab]);

  if (!device) return null;

  const isPrinter = device.type === 'printer';
  const isPC = device.type === 'pc';
  const isSwitch = device.type === 'switch';
  const isRouter = device.type === 'router';
  const isPoweredOn = device.hardware?.powerState !== false;

  const deviceTickets = tickets.filter(t => t.deviceId === device.id);
  const activeTickets = deviceTickets.filter(t => t.status !== 'resolved');

  // CLI Command Execution Simulator
  const executeCommand = (cmdStr) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const newLogs = [...terminalHistory, `C:\\Users\\student> ${trimmed}`];
    const cmd = trimmed.toLowerCase();

    if (cmd === 'help') {
      newLogs.push(
        'Available commands:',
        '  ping <ip>       - Test ICMP connectivity',
        '  ipconfig /all   - Display network adapter configuration',
        '  tracert <ip>    - Trace network hops to target',
        '  diagnose        - Run hardware and port diagnostics',
        '  clear           - Clear terminal window',
        '  reboot          - Simulate soft system restart'
      );
    } else if (cmd === 'clear') {
      setTerminalHistory([`Terminal cleared for ${device.code}`]);
      setCliInput('');
      return;
    } else if (cmd.startsWith('ping')) {
      const target = trimmed.split(' ')[1] || '192.168.10.1';
      newLogs.push(`Pinging ${target} with 32 bytes of data:`);
      
      if (!isPoweredOn || device.status === 'critical') {
        newLogs.push(
          'Request timed out.',
          'Request timed out.',
          'Request timed out.',
          'Request timed out.',
          `Ping statistics for ${target}:`,
          '    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss)'
        );
      } else {
        const time1 = Math.floor(Math.random() * 2) + 1;
        const time2 = Math.floor(Math.random() * 2) + 1;
        newLogs.push(
          `Reply from ${target}: bytes=32 time=${time1}ms TTL=64`,
          `Reply from ${target}: bytes=32 time=${time2}ms TTL=64`,
          `Reply from ${target}: bytes=32 time=${time1}ms TTL=64`,
          `Reply from ${target}: bytes=32 time=${time2}ms TTL=64`,
          `Ping statistics for ${target}:`,
          `    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)`,
          `Approximate round trip times in milli-seconds:`,
          `    Minimum = 1ms, Maximum = 2ms, Average = 1ms`
        );
      }
    } else if (cmd === 'ipconfig' || cmd === 'ipconfig /all') {
      newLogs.push(
        'Windows IP Configuration',
        `   Host Name . . . . . . . . . . . . : ${device.code}`,
        `   Primary Dns Suffix  . . . . . . . : campus.internal`,
        `   Node Type . . . . . . . . . . . . : Hybrid`,
        `   IP Routing Enabled. . . . . . . . : No`,
        '',
        'Ethernet adapter Local Area Connection:',
        `   Physical Address. . . . . . . . . : ${device.mac}`,
        `   DHCP Enabled. . . . . . . . . . . : Yes`,
        `   IPv4 Address. . . . . . . . . . . : ${device.ip}(Preferred)`,
        `   Subnet Mask . . . . . . . . . . . : 255.255.255.0`,
        `   Default Gateway . . . . . . . . . : 192.168.10.1`,
        `   DNS Servers . . . . . . . . . . . : 192.168.10.1, 8.8.8.8`
      );
    } else if (cmd.startsWith('diagnose')) {
      newLogs.push(
        'Running Cisco Packet Tracer Hardware & Link Self-Test...',
        `[1/4] Power Unit: ${isPoweredOn ? 'PASS (12V Rail Nominal)' : 'FAIL (Power Off)'}`,
        `[2/4] Ethernet Interface (${device.switchPort}): ${device.status === 'critical' ? 'FAULT DETECTED' : 'LINK OPERATIONAL'}`,
        `[3/4] ARP Table Resolution: OK`,
        `[4/4] Queue Status: ${activeTickets.length} active ticket(s) flagged on node.`,
        `Diagnostics complete. Overall Health: ${device.status.toUpperCase()}`
      );
    } else if (cmd === 'reboot') {
      newLogs.push('Broadcast message from System: rebooting node in 3 seconds...');
    } else {
      newLogs.push(`'${trimmed}' is not recognized as an internal or external command. Type 'help' for commands.`);
    }

    setTerminalHistory(newLogs);
    setCliInput('');
  };

  const handleCreateIssue = (e) => {
    e.preventDefault();
    if (!newIssueTitle.trim()) return;

    onAddTicket({
      deviceId: device.id,
      deviceName: device.name,
      deviceCode: device.code,
      deviceType: device.type,
      labId: lab.id,
      labName: lab.name,
      room: lab.room,
      category: newIssueCategory || (isPrinter ? 'printer_jam' : 'hardware'),
      title: newIssueTitle,
      description: newIssueDesc || 'Reported from mobile field inspection.',
      priority: newIssuePriority
    });

    setShowNewIssueForm(false);
    setNewIssueTitle('');
    setNewIssueDesc('');
    setActiveTab('tickets');
  };

  const triggerCelebrate = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch (e) {
      // safe fallback
    }
  };

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet-container">
        {/* Pull Handle */}
        <div className="sheet-handle-bar" />

        {/* Sheet Header */}
        <div className="sheet-header">
          <div className="sheet-device-intro">
            <div className="device-avatar">
              {isPrinter ? <Printer size={24} /> : isPC ? <Monitor size={24} /> : isSwitch ? <Network size={24} /> : <Cpu size={24} />}
            </div>
            <div className="sheet-device-title">
              <h3>{device.name}</h3>
              <div className="sheet-device-meta">
                <span>{device.code}</span>
                <span>•</span>
                <span>{device.ip}</span>
                <span>•</span>
                <span>{device.switchPort}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`badge badge-${device.status}`}>
              {device.status}
            </span>
            <button className="icon-btn" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Cisco Packet Tracer Device Dialog Tabs */}
        <div className="sheet-tabs">
          <button 
            className={`sheet-tab-btn ${activeTab === 'physical' ? 'active' : ''}`}
            onClick={() => setActiveTab('physical')}
          >
            <Cpu size={14} />
            <span>Physical</span>
          </button>
          <button 
            className={`sheet-tab-btn ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => setActiveTab('config')}
          >
            <Sliders size={14} />
            <span>Config</span>
          </button>
          <button 
            className={`sheet-tab-btn ${activeTab === 'tickets' ? 'active' : ''}`}
            onClick={() => setActiveTab('tickets')}
          >
            <Wrench size={14} />
            <span>Tickets ({activeTickets.length})</span>
          </button>
          <button 
            className={`sheet-tab-btn ${activeTab === 'cli' ? 'active' : ''}`}
            onClick={() => setActiveTab('cli')}
          >
            <Terminal size={14} />
            <span>CLI / Ping</span>
          </button>
        </div>

        {/* Sheet Body Content */}
        <div className="sheet-body">
          {/* TAB 1: PHYSICAL VIEW */}
          {activeTab === 'physical' && (
            <div>
              {/* Power Control & Status Card */}
              <div className="hardware-view-card">
                <div className="hardware-preview-header">
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                      Hardware Chassis State
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      FastEthernet Port: {device.switchPort} ({isPoweredOn ? 'Link Up' : 'No Signal'})
                    </div>
                  </div>

                  <div className="power-switch-container">
                    <span>Power:</span>
                    <button 
                      className={`power-toggle-btn ${isPoweredOn ? 'powered-on' : ''}`}
                      onClick={() => onTogglePower(device.id)}
                      title={isPoweredOn ? 'Turn Power Off' : 'Turn Power On'}
                      aria-label="Toggle Power"
                    >
                      <Power size={16} />
                    </button>
                  </div>
                </div>

                <div className="hardware-specs-grid">
                  <div className="spec-item">
                    <div className="spec-label">Model</div>
                    <div className="spec-val">{device.hardware?.model || 'Generic Node'}</div>
                  </div>
                  <div className="spec-item">
                    <div className="spec-label">OS / Firmware</div>
                    <div className="spec-val">{device.hardware?.os || 'Embedded'}</div>
                  </div>
                  {device.hardware?.cpu && (
                    <div className="spec-item">
                      <div className="spec-label">Processor</div>
                      <div className="spec-val">{device.hardware.cpu}</div>
                    </div>
                  )}
                  {device.hardware?.ram && (
                    <div className="spec-item">
                      <div className="spec-label">RAM Memory</div>
                      <div className="spec-val">{device.hardware.ram}</div>
                    </div>
                  )}
                  <div className="spec-item">
                    <div className="spec-label">Bench / Location</div>
                    <div className="spec-val">{device.bench || lab.room}</div>
                  </div>
                  <div className="spec-item">
                    <div className="spec-label">MAC Address</div>
                    <div className="spec-val" style={{ fontSize: '11px' }}>{device.mac}</div>
                  </div>
                </div>
              </div>

              {/* Printer Supplies & Paper Card (for Printers) */}
              {isPrinter && (
                <div className="printer-supplies-card">
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Consumables & Paper Tray
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Status: {device.hardware?.paperStatus || 'Ready'}
                  </div>

                  {/* Toner Gauge */}
                  <div className="gauge-row">
                    <div className="gauge-meta">
                      <span>Toner / Cartridge Level</span>
                      <span style={{ color: (device.hardware?.tonerLevel ?? 0) < 20 ? '#ef4444' : '#10b981' }}>
                        {device.hardware?.tonerLevel ?? 0}%
                      </span>
                    </div>
                    <div className="progress-bar-bg">
                      <div 
                        className="progress-bar-fill" 
                        style={{ 
                          width: `${device.hardware?.tonerLevel ?? 0}%`,
                          background: (device.hardware?.tonerLevel ?? 0) < 20 ? '#ef4444' : '#10b981'
                        }} 
                      />
                    </div>
                  </div>

                  {/* Paper Gauge */}
                  <div className="gauge-row">
                    <div className="gauge-meta">
                      <span>Paper Tray Capacity</span>
                      <span style={{ color: (device.hardware?.paperLevel ?? 0) < 15 ? '#ef4444' : '#38bdf8' }}>
                        {device.hardware?.paperLevel ?? 0}%
                      </span>
                    </div>
                    <div className="progress-bar-bg">
                      <div 
                        className="progress-bar-fill" 
                        style={{ 
                          width: `${device.hardware?.paperLevel ?? 0}%`,
                          background: (device.hardware?.paperLevel ?? 0) < 15 ? '#ef4444' : '#38bdf8'
                        }} 
                      />
                    </div>
                  </div>

                  {/* Spooler Queue */}
                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Spooler Queue Jobs:</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      {device.hardware?.queueCount ?? 0} documents
                    </span>
                  </div>
                </div>
              )}

              {/* Quick Actions Bar */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <button 
                  className="action-btn-primary" 
                  style={{ flex: 1 }}
                  onClick={() => {
                    setShowNewIssueForm(true);
                    setActiveTab('tickets');
                  }}
                >
                  <Plus size={16} />
                  <span>Raise Ticket For This Device</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CONFIG / IP TAB */}
          {activeTab === 'config' && (
            <div className="config-card">
              <div className="config-row">
                <span className="config-label">IP Configuration Mode</span>
                <span className="badge badge-operational">DHCP (Assigned)</span>
              </div>
              <div className="config-row">
                <span className="config-label">IPv4 Address</span>
                <span className="config-val">{device.ip}</span>
              </div>
              <div className="config-row">
                <span className="config-label">Subnet Mask</span>
                <span className="config-val">255.255.255.0</span>
              </div>
              <div className="config-row">
                <span className="config-label">Default Gateway</span>
                <span className="config-val">192.168.10.1</span>
              </div>
              <div className="config-row">
                <span className="config-label">DNS Server</span>
                <span className="config-val">192.168.10.1</span>
              </div>
              <div className="config-row">
                <span className="config-label">VLAN Assignment</span>
                <span className="config-val">{device.vlan || 'VLAN 10'}</span>
              </div>
              <div className="config-row">
                <span className="config-label">Switch Uplink Port</span>
                <span className="config-val">{device.switchPort}</span>
              </div>
              <div className="config-row">
                <span className="config-label">Physical Hardware MAC</span>
                <span className="config-val">{device.mac}</span>
              </div>
            </div>
          )}

          {/* TAB 3: TICKETS & ISSUE RESOLUTION */}
          {activeTab === 'tickets' && (
            <div>
              {/* Form Toggle Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Active Issues ({activeTickets.length})
                </div>

                <button 
                  className="action-btn-primary" 
                  style={{ padding: '6px 12px', fontSize: '11px' }}
                  onClick={() => setShowNewIssueForm(!showNewIssueForm)}
                >
                  <Plus size={14} />
                  <span>{showNewIssueForm ? 'Cancel' : 'Report Issue'}</span>
                </button>
              </div>

              {/* Inline Issue Creation Form */}
              {showNewIssueForm && (
                <form 
                  onSubmit={handleCreateIssue}
                  style={{
                    background: 'var(--bg-primary)',
                    borderRadius: '14px',
                    border: '1px solid var(--cisco-blue)',
                    padding: '14px',
                    marginBottom: '16px',
                    animation: 'slideUp 0.18s ease-out'
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--cisco-blue)', marginBottom: '10px' }}>
                    Report New Ticket for {device.code}
                  </div>

                  {/* Quick Preset Selector */}
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '6px' }}>
                      Quick Common Issues (Tap to Select):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {(isPrinter ? ISSUE_PRESETS.printer : ISSUE_PRESETS.pc).map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setNewIssueTitle(preset.label);
                            setNewIssueCategory(preset.category);
                            setNewIssuePriority(preset.priority);
                          }}
                          style={{
                            background: newIssueTitle === preset.label ? 'var(--cisco-blue)' : 'var(--bg-surface)',
                            color: newIssueTitle === preset.label ? '#0b1320' : 'var(--text-main)',
                            border: '1px solid var(--border-subtle)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 500
                          }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div style={{ marginBottom: '10px' }}>
                    <input 
                      type="text" 
                      placeholder="Issue summary / Title..."
                      value={newIssueTitle}
                      onChange={e => setNewIssueTitle(e.target.value)}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div style={{ marginBottom: '10px' }}>
                    <textarea 
                      placeholder="Detailed notes (e.g., error codes, student bench observation)..."
                      value={newIssueDesc}
                      onChange={e => setNewIssueDesc(e.target.value)}
                      rows={2}
                      style={{ width: '100%', resize: 'none' }}
                    />
                  </div>

                  {/* Priority */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    {['low', 'medium', 'urgent'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewIssuePriority(p)}
                        className={`badge badge-${p}`}
                        style={{
                          flex: 1,
                          padding: '6px',
                          border: newIssuePriority === p ? '2px solid currentColor' : '1px solid transparent'
                        }}
                      >
                        {p.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <button 
                    type="submit" 
                    className="action-btn-primary" 
                    style={{ width: '100%' }}
                  >
                    <Send size={14} />
                    <span>Submit & Update Topology LED</span>
                  </button>
                </form>
              )}

              {/* Tickets List */}
              {deviceTickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={36} style={{ color: '#10b981', margin: '0 auto 10px auto' }} />
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>No Issues Reported</div>
                  <div style={{ fontSize: '12px' }}>This device is functioning normally with active network link.</div>
                </div>
              ) : (
                deviceTickets.map(ticket => {
                  const isResolved = ticket.status === 'resolved';

                  return (
                    <div key={ticket.id} className="ticket-card">
                      <div className="ticket-top-row">
                        <span className={`badge badge-${ticket.priority}`}>
                          {ticket.priority}
                        </span>
                        <span className={`badge badge-${ticket.status}`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="ticket-card-title">{ticket.title}</div>
                      <div className="ticket-card-desc">{ticket.description}</div>

                      <div className="ticket-meta-footer">
                        <div>
                          <span>Reported by: {ticket.reportedBy}</span>
                          <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                            Ticket ID: {ticket.ticketNumber}
                          </div>
                        </div>

                        {!isResolved && (
                          <button 
                            className="action-btn-resolve"
                            onClick={() => {
                              triggerCelebrate();
                              onResolveTicket(ticket.id, device.id);
                            }}
                          >
                            <CheckCircle2 size={14} />
                            <span>Mark Resolved</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 4: PACKET TRACER CLI / PING SIMULATOR */}
          {activeTab === 'cli' && (
            <div className="cli-terminal-window">
              <div className="cli-title-bar">
                <div className="cli-window-dots">
                  <div className="cli-dot cli-dot-red" />
                  <div className="cli-dot cli-dot-yellow" />
                  <div className="cli-dot cli-dot-green" />
                </div>
                <div className="cli-title">{device.code} - Command Prompt</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>80x24</div>
              </div>

              {/* Terminal Logs Output */}
              <div className="cli-output-area">
                {terminalHistory.map((line, i) => (
                  <div key={i} style={{ whiteSpace: 'pre-wrap' }}>{line}</div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {/* Quick CLI Action Chips */}
              <div className="cli-quick-commands">
                <button className="cli-cmd-chip" onClick={() => executeCommand('ping 192.168.10.1')}>
                  ping Gateway (192.168.10.1)
                </button>
                <button className="cli-cmd-chip" onClick={() => executeCommand('ping 192.168.10.2')}>
                  ping Switch (192.168.10.2)
                </button>
                <button className="cli-cmd-chip" onClick={() => executeCommand('ipconfig /all')}>
                  ipconfig /all
                </button>
                <button className="cli-cmd-chip" onClick={() => executeCommand('diagnose')}>
                  diagnose
                </button>
                <button className="cli-cmd-chip" onClick={() => executeCommand('clear')}>
                  clear
                </button>
              </div>

              {/* Input Form */}
              <form 
                className="cli-input-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  executeCommand(cliInput);
                }}
              >
                <span className="cli-input-prompt">&gt;</span>
                <input
                  type="text"
                  className="cli-input-field"
                  placeholder="Type command (ping, ipconfig, help)..."
                  value={cliInput}
                  onChange={e => setCliInput(e.target.value)}
                  autoCapitalize="none"
                  autoCorrect="off"
                />
                <button type="submit" style={{ padding: '0 12px', color: '#00bceb' }}>
                  <Send size={14} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
