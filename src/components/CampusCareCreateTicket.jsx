import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, Paperclip, Check } from 'lucide-react';

export function CampusCareCreateTicket({ 
  schools = [],
  currentSchool,
  currentLab,
  currentDevice,
  onSubmitTicket,
  onBack 
}) {
  const [selectedSchoolId, setSelectedSchoolId] = useState(currentSchool?.id || schools[0]?.id || 'sch-velammal');
  const [selectedLabId, setSelectedLabId] = useState(currentLab?.id || 'lab-velammal-main');
  const [selectedSystemCode, setSelectedSystemCode] = useState(currentDevice?.code || 'PC-07');
  const [category, setCategory] = useState('Hardware Issue');
  const [subCategory, setSubCategory] = useState('Monitor Not Working');
  const [description, setDescription] = useState('Monitor shows no display. Power light is on.');
  const [priority, setPriority] = useState('medium'); // 'low' | 'medium' | 'high'
  const [attachmentAdded, setAttachmentAdded] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    const targetSchool = schools.find(s => s.id === selectedSchoolId) || currentSchool || schools[0];
    const ticketId = `tkt-${Math.floor(1000 + Math.random() * 9000)}`;
    const ticketNumber = `#TKT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket = {
      id: ticketId,
      ticketNumber: ticketNumber,
      schoolId: selectedSchoolId,
      schoolName: targetSchool?.name || 'Velammal Matric Hr Sec School',
      labId: selectedLabId,
      labName: 'Main Lab',
      systemId: `dev-${selectedSystemCode.toLowerCase()}`,
      systemName: selectedSystemCode,
      title: subCategory || category,
      problem: subCategory || category,
      description: description,
      priority: priority,
      status: 'created',
      category: category,
      subCategory: subCategory,
      reportedBy: 'Mr. Arun (Lab Staff)',
      reporterPhone: '+91 94440 12345',
      assignedTo: 'Unassigned',
      assignedToRole: '',
      createdAt: 'Just now',
      relativeTime: 'Just now',
      attachments: attachmentAdded ? [{ name: 'image1.jpg', url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&auto=format&fit=crop&q=80' }] : [],
      timeline: [
        { status: 'created', title: 'Ticket Created', by: 'Mr. Arun (Lab Staff)', date: 'Just now', done: true },
        { status: 'assigned', title: 'Assigned to Technician', by: '', date: '', done: false },
        { status: 'acknowledged', title: 'Technician Acknowledged', by: '', date: '', done: false },
        { status: 'in_progress', title: 'In Progress', by: '', date: '', done: false },
        { status: 'resolved', title: 'Resolved', by: '', date: '', done: false },
        { status: 'closed', title: 'Closed', by: '', date: '', done: false }
      ],
      communications: [
        { id: 'c1', sender: 'Mr. Arun', role: 'school_staff', time: 'Just now', text: description }
      ],
      checklist: [
        { id: 1, text: 'Check power supply', checked: false },
        { id: 2, text: 'Check monitor and cable', checked: false },
        { id: 3, text: 'Test with another monitor', checked: false },
        { id: 4, text: 'Check GPU / onboard display', checked: false },
        { id: 5, text: 'Replace cable if required', checked: false }
      ]
    };

    onSubmitTicket(newTicket);
  };

  return (
    <div className="screen-scroll-container no-bottom-nav">
      {/* Header */}
      <div className="screen-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="icon-button" onClick={onBack} title="Back">
            <ArrowLeft size={20} />
          </button>
          <span className="screen-header-title">
            Create Service Ticket
          </span>
        </div>
        <button className="icon-button" title="Menu">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Ticket Form */}
      <form onSubmit={handleSubmit} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* School / College */}
        <div className="form-group" style={{ marginBottom: '8px' }}>
          <label className="form-label">
            School / College <span style={{ color: 'var(--status-issue)' }}>*</span>
          </label>
          <select 
            value={selectedSchoolId} 
            onChange={(e) => setSelectedSchoolId(e.target.value)}
            className="form-select"
          >
            {schools.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Lab */}
        <div className="form-group" style={{ marginBottom: '8px' }}>
          <label className="form-label">
            Lab <span style={{ color: 'var(--status-issue)' }}>*</span>
          </label>
          <select 
            value={selectedLabId} 
            onChange={(e) => setSelectedLabId(e.target.value)}
            className="form-select"
          >
            <option value="lab-velammal-main">Main Lab</option>
            <option value="lab-velammal-2">Computer Lab 2</option>
            <option value="lab-velammal-lang">Language Lab</option>
            <option value="lab-velammal-robotics">Robotics & STEM Lab</option>
          </select>
        </div>

        {/* System (Optional) */}
        <div className="form-group" style={{ marginBottom: '8px' }}>
          <label className="form-label">
            System (Optional)
          </label>
          <select 
            value={selectedSystemCode} 
            onChange={(e) => setSelectedSystemCode(e.target.value)}
            className="form-select"
          >
            {Array.from({ length: 20 }, (_, i) => {
              const code = `PC-${String(i + 1).padStart(2, '0')}`;
              return <option key={code} value={code}>{code}</option>;
            })}
            <option value="Lab Wide">Lab Wide Equipment / Switch</option>
          </select>
        </div>

        {/* Issue Category */}
        <div className="form-group" style={{ marginBottom: '8px' }}>
          <label className="form-label">
            Issue Category <span style={{ color: 'var(--status-issue)' }}>*</span>
          </label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="form-select"
          >
            <option value="Hardware Issue">Hardware Issue</option>
            <option value="Software Issue">Software Issue</option>
            <option value="Network Issue">Network Issue</option>
            <option value="Peripherals">Peripherals (Keyboard / Mouse)</option>
            <option value="Power / UPS">Power / UPS Failure</option>
          </select>
        </div>

        {/* Sub Category */}
        <div className="form-group" style={{ marginBottom: '8px' }}>
          <label className="form-label">
            Sub Category
          </label>
          <select 
            value={subCategory} 
            onChange={(e) => setSubCategory(e.target.value)}
            className="form-select"
          >
            <option value="Monitor Not Working">Monitor Not Working</option>
            <option value="Power Not Turning ON">Power Not Turning ON</option>
            <option value="OS Boot Failure / Blue Screen">OS Boot Failure / Blue Screen</option>
            <option value="LAN / Internet Disconnected">LAN / Internet Disconnected</option>
            <option value="Keyboard / Mouse Unresponsive">Keyboard / Mouse Unresponsive</option>
          </select>
        </div>

        {/* Description */}
        <div className="form-group" style={{ marginBottom: '8px' }}>
          <label className="form-label">
            Description <span style={{ color: 'var(--status-issue)' }}>*</span>
          </label>
          <textarea 
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
            placeholder="Describe the issue observed in detail..."
            required
          />
        </div>

        {/* Priority Radio Pills */}
        <div className="form-group" style={{ marginBottom: '14px' }}>
          <label className="form-label">
            Priority <span style={{ color: 'var(--status-issue)' }}>*</span>
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['low', 'medium', 'high'].map(p => {
              const isSelected = priority === p;
              return (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid var(--navy-800)' : '1px solid var(--border-mid)',
                    background: isSelected ? 'var(--blue-50)' : '#ffffff',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: isSelected ? 'var(--navy-800)' : 'var(--text-body)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isSelected ? 'var(--navy-800)' : 'var(--border-mid)',
                    display: 'inline-block'
                  }} />
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Add Attachment */}
        <div style={{ marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => setAttachmentAdded(!attachmentAdded)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--navy-800)',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Paperclip size={16} />
            {attachmentAdded ? 'Attachment Added: image1.jpg ✓' : 'Add Attachment'}
          </button>
        </div>

        {/* Submit Action */}
        <button type="submit" className="btn-primary-navy" style={{ marginTop: '10px' }}>
          Submit Ticket
        </button>
      </form>
    </div>
  );
}
