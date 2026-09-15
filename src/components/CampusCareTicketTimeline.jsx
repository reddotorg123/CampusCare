import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, Send, CheckCircle2, Circle } from 'lucide-react';

export function CampusCareTicketTimeline({ 
  ticket,
  onSendMessage,
  onBack 
}) {
  const [inputText, setInputText] = useState('');
  
  const t = ticket || {
    ticketNumber: '#TKT-1024',
    timeline: [
      { status: 'created', title: 'Ticket Created', by: 'Mr. Arun (Lab Staff)', date: '15 Sep 2025, 10:24 AM', done: true },
      { status: 'assigned', title: 'Assigned to Technician', by: 'Admin', date: '15 Sep 2025, 11:10 AM', done: true },
      { status: 'acknowledged', title: 'Technician Acknowledged', by: 'Karthik', date: '15 Sep 2025, 11:30 AM', done: true },
      { status: 'in_progress', title: 'In Progress', by: 'Diagnosing the issue', date: '15 Sep 2025, 12:15 PM', done: true },
      { status: 'resolved', title: 'Resolved', by: '', date: '', done: false },
      { status: 'closed', title: 'Closed', by: '', date: '', done: false }
    ],
    communications: [
      { id: 'c1', sender: 'Karthik', role: 'technician', time: '12:20 PM', text: 'We are checking the issue. Will update soon.' },
      { id: 'c2', sender: 'Mr. Arun', role: 'school_staff', time: '12:25 PM', text: 'Please carry a VGA cable also.' }
    ]
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage({
      id: `c-${Date.now()}`,
      sender: 'Karthik',
      role: 'technician',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputText.trim()
    });

    setInputText('');
  };

  return (
    <div className="screen-scroll-container no-bottom-nav" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="screen-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="icon-button" onClick={onBack} title="Back">
            <ArrowLeft size={20} />
          </button>
          <span className="screen-header-title">
            Ticket Timeline
          </span>
        </div>
        <button className="icon-button" title="Menu">
          <MoreVertical size={18} />
        </button>
      </div>

      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Stepper Vertical Flow */}
        <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '16px' }}>
          {t.timeline?.map((step, idx, arr) => {
            const isLast = idx === arr.length - 1;
            const isCompleted = step.done;
            const isCurrent = step.status === 'in_progress';

            const dotColor = isCurrent ? 'var(--blue-600)' : isCompleted ? 'var(--status-working)' : 'var(--border-mid)';

            return (
              <div key={step.title} style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                {/* Left Indicator & Connecting Vertical Line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: isCompleted ? dotColor : '#ffffff',
                    border: `2px solid ${dotColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2
                  }}>
                    {isCompleted && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff' }} />}
                  </div>

                  {!isLast && (
                    <div style={{
                      width: '2px',
                      flex: 1,
                      minHeight: '28px',
                      background: isCompleted ? 'var(--status-working)' : 'var(--border-light)',
                      margin: '2px 0'
                    }} />
                  )}
                </div>

                {/* Right Step Meta */}
                <div style={{ paddingBottom: isLast ? 0 : '18px' }}>
                  <div style={{ 
                    fontSize: '13px', 
                    fontWeight: '700', 
                    color: isCompleted ? 'var(--navy-900)' : 'var(--text-light)' 
                  }}>
                    {step.title}
                  </div>
                  {step.by && (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      By {step.by}
                    </div>
                  )}
                  {step.date && (
                    <div style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '2px' }}>
                      {step.date}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Communication Chat Section */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '10px' }}>
            Communication
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
            {t.communications?.map(msg => {
              const isTech = msg.role === 'technician';
              return (
                <div 
                  key={msg.id}
                  style={{
                    alignSelf: isTech ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    background: isTech ? 'var(--navy-800)' : '#f1f5f9',
                    color: isTech ? '#ffffff' : 'var(--text-main)',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                    {msg.text}
                  </div>
                  <div style={{ 
                    fontSize: '9.5px', 
                    color: isTech ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', 
                    textAlign: 'right', 
                    marginTop: '4px' 
                  }}>
                    {msg.sender} &nbsp;•&nbsp; {msg.time}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
              className="form-input"
              style={{ flex: 1, padding: '10px 14px' }}
            />
            <button 
              type="submit"
              className="btn-primary-navy"
              style={{ width: '42px', height: '42px', padding: 0, borderRadius: '8px', flexShrink: 0 }}
              title="Send"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
