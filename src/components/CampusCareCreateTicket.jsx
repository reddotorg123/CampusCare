import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

export function CampusCareCreateTicket({ 
  schools = [],
  currentSchool,
  currentLab,
  currentDevice,
  currentUser,
  onSubmitTicket,
  onBack 
}) {
  const targetSchool = currentSchool || (schools.length > 0 ? schools[0] : null);
  const [selectedSchoolId, setSelectedSchoolId] = useState(targetSchool?.id || '');
  const [selectedLabId, setSelectedLabId] = useState(currentLab?.id || targetSchool?.labs?.[0]?.id || 'lab-main');
  const [selectedSystemCode, setSelectedSystemCode] = useState(currentDevice?.code || 'PC-01');
  const [category, setCategory] = useState('Hardware Issue');
  const [subCategory, setSubCategory] = useState('Monitor / Screen Malfunction');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium'); // 'low' | 'medium' | 'high'
  const [attachments, setAttachments] = useState([]);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const fileInputRef = useRef(null);

  const activeSchool = schools.find(s => s.id === selectedSchoolId) || targetSchool;
  const availableLabs = activeSchool?.labs || [
    { id: 'lab-main', name: 'Main Computer Lab' }
  ];

  // Real Image Upload / Camera Handler
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsProcessingImage(true);

    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setAttachments(prev => [
          ...prev,
          {
            id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            type: file.type,
            url: uploadEvent.target.result // Base64 data URL
          }
        ]);
        setIsProcessingImage(false);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleRemoveAttachment = (id) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const ticketId = `tkt-${Math.floor(1000 + Math.random() * 9000)}`;
    const ticketNumber = `#TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const schoolName = activeSchool?.name || currentUser?.schoolName || 'Campus School';
    const labName = availableLabs.find(l => l.id === selectedLabId)?.name || 'Main Computer Lab';

    const newTicket = {
      id: ticketId,
      ticketNumber: ticketNumber,
      schoolId: activeSchool?.id || currentUser?.schoolId || 'sch-default',
      schoolName: schoolName,
      labId: selectedLabId,
      labName: labName,
      systemId: `dev-${selectedSystemCode.toLowerCase()}`,
      systemName: selectedSystemCode,
      title: subCategory || category,
      problem: subCategory || category,
      description: description || 'Issue reported on equipment.',
      priority: priority,
      status: 'created',
      category: category,
      subCategory: subCategory,
      reportedBy: currentUser?.name ? `${currentUser.name} (${currentUser.role === 'school_staff' ? 'School Staff' : 'User'})` : 'School Staff',
      reporterPhone: currentUser?.phone || '+91 98765 43210',
      assignedTo: 'Unassigned',
      assignedToRole: '',
      createdAt: 'Just now',
      relativeTime: 'Just now',
      attachments: attachments, // Real user uploaded photos!
      timeline: [
        { status: 'created', title: 'Ticket Created', by: currentUser?.name || 'School Staff', date: 'Just now', done: true },
        { status: 'assigned', title: 'Assigned to Technician', by: '', date: '', done: false },
        { status: 'in_progress', title: 'Technician Working', by: '', date: '', done: false },
        { status: 'resolved', title: 'Resolved & Verified', by: '', date: '', done: false },
        { status: 'closed', title: 'Closed', by: '', date: '', done: false }
      ],
      communications: description ? [
        { id: 'c1', sender: currentUser?.name || 'School Staff', role: 'school_staff', time: 'Just now', text: description }
      ] : [],
      checklist: [
        { id: 1, text: 'Inspect physical computer & power connections', checked: false },
        { id: 2, text: 'Verify hardware peripherals & cables', checked: false },
        { id: 3, text: 'Perform diagnostics check', checked: false },
        { id: 4, text: 'Replace faulty parts if needed', checked: false },
        { id: 5, text: 'Test functionality and sign off', checked: false }
      ]
    };

    onSubmitTicket(newTicket);
  };

  const isSchoolStaff = currentUser?.role === 'school_staff';

  return (
    <div className="screen-scroll-container no-bottom-nav">
      {/* Header */}
      <div className="screen-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="icon-button" onClick={onBack} title="Back">
            <ArrowLeft size={20} />
          </button>
          <div>
            <span className="screen-header-title">
              Create Service Ticket
            </span>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              Log an IT hardware or software problem
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Form */}
      <form onSubmit={handleSubmit} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* School / College (Locked if School Staff for strict Data Isolation) */}
        <div className="form-group" style={{ marginBottom: '8px' }}>
          <label className="form-label">
            School / College <span style={{ color: 'var(--status-issue)' }}>*</span>
          </label>
          {isSchoolStaff ? (
            <input 
              type="text"
              value={activeSchool?.name || currentUser?.schoolName || 'My School'}
              disabled
              className="form-input"
              style={{ background: '#f8fafc', fontWeight: 600, color: 'var(--navy-900)' }}
            />
          ) : (
            <select 
              value={selectedSchoolId} 
              onChange={(e) => setSelectedSchoolId(e.target.value)}
              className="form-select"
            >
              {schools.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* Lab Selection */}
        <div className="form-group" style={{ marginBottom: '8px' }}>
          <label className="form-label">
            Lab Location <span style={{ color: 'var(--status-issue)' }}>*</span>
          </label>
          <select 
            value={selectedLabId} 
            onChange={(e) => setSelectedLabId(e.target.value)}
            className="form-select"
          >
            {availableLabs.map(l => (
              <option key={l.id} value={l.id}>{l.name} {l.room ? `(${l.room})` : ''}</option>
            ))}
          </select>
        </div>

        {/* System Identifier */}
        <div className="form-group" style={{ marginBottom: '8px' }}>
          <label className="form-label">
            Affected Equipment / Computer <span style={{ color: 'var(--status-issue)' }}>*</span>
          </label>
          <input 
            type="text"
            value={selectedSystemCode}
            onChange={(e) => setSelectedSystemCode(e.target.value)}
            className="form-input"
            placeholder="e.g. PC-07, Teacher PC, Laser-01"
            required
          />
        </div>

        {/* Category */}
        <div className="form-group" style={{ marginBottom: '8px' }}>
          <label className="form-label">
            Issue Category <span style={{ color: 'var(--status-issue)' }}>*</span>
          </label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="form-select"
          >
            <option value="Hardware Issue">Hardware Issue (Monitor, CPU, Keyboard, Mouse)</option>
            <option value="Network / LAN">Network / LAN / Internet Connectivity</option>
            <option value="Operating System">OS Boot Failure / Blue Screen</option>
            <option value="Power & UPS">Power Supply / UPS / SMPS Issue</option>
            <option value="Printer / Projector">Printer / Projector Issue</option>
            <option value="Software / Antivirus">Software & Antivirus License</option>
          </select>
        </div>

        {/* Issue Title / Subcategory */}
        <div className="form-group" style={{ marginBottom: '8px' }}>
          <label className="form-label">
            Problem Summary <span style={{ color: 'var(--status-issue)' }}>*</span>
          </label>
          <input 
            type="text"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="form-input"
            placeholder="e.g. No display output, CPU not turning on"
            required
          />
        </div>

        {/* Description */}
        <div className="form-group" style={{ marginBottom: '8px' }}>
          <label className="form-label">
            Detailed Description <span style={{ color: 'var(--status-issue)' }}>*</span>
          </label>
          <textarea 
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
            placeholder="Describe what happened, any error messages, or symptoms..."
            required
          />
        </div>

        {/* Priority Radio Pills */}
        <div className="form-group" style={{ marginBottom: '12px' }}>
          <label className="form-label">
            Priority Level <span style={{ color: 'var(--status-issue)' }}>*</span>
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
                    fontWeight: '700',
                    color: isSelected ? 'var(--navy-800)' : 'var(--text-body)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: p === 'high' ? 'var(--status-issue)' : p === 'medium' ? 'var(--status-warning)' : 'var(--status-working)',
                    display: 'inline-block'
                  }} />
                  {p.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* REAL IMAGE UPLOAD / CAMERA SECTION */}
        <div style={{
          background: '#f8fafc',
          border: '1.5px dashed #cbd5e1',
          borderRadius: '10px',
          padding: '14px',
          marginBottom: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy-900)' }}>
                Upload Equipment Photo
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                Attach photo of damaged screen, cable, or error code
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: 'var(--navy-800)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer'
              }}
            >
              <Camera size={14} />
              <span>Take / Upload Photo</span>
            </button>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            multiple 
            capture="environment" 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />

          {isProcessingImage && (
            <div style={{ fontSize: '11px', color: 'var(--blue-600)', fontWeight: 600, padding: '4px 0' }}>
              Processing uploaded photo...
            </div>
          )}

          {/* Uploaded Images Thumbnails Grid */}
          {attachments.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {attachments.map(att => (
                <div 
                  key={att.id}
                  style={{
                    position: 'relative',
                    width: '74px',
                    height: '74px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #94a3b8',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <img 
                    src={att.url} 
                    alt={att.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(att.id)}
                    title="Remove Image"
                    style={{
                      position: 'absolute',
                      top: '3px',
                      right: '3px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: '#ffffff',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={11} />
                  </button>
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(15, 23, 42, 0.75)',
                    color: '#ffffff',
                    fontSize: '7.5px',
                    padding: '1px 3px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {att.size}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              fontSize: '11px', 
              color: 'var(--text-muted)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              marginTop: '4px' 
            }}>
              <ImageIcon size={14} color="#94a3b8" />
              <span>No image attached. Tap "Take / Upload Photo" to add equipment pictures.</span>
            </div>
          )}
        </div>

        {/* Submit Action */}
        <button type="submit" className="btn-primary-navy" style={{ marginTop: '6px', padding: '12px' }}>
          Submit Service Ticket
        </button>
      </form>
    </div>
  );
}
