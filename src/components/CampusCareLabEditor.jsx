import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Trash2, 
  Tag, 
  Table2, 
  Monitor, 
  Info, 
  Check, 
  DoorOpen, 
  Armchair,
  Edit3,
  Maximize2
} from 'lucide-react';

export function CampusCareLabEditor({ 
  lab,
  devices = [],
  onSaveLab,
  onBack 
}) {
  // Ensure existing items or initialize with default entrance & teacher desk if missing
  const [labElements, setLabElements] = useState(() => {
    const items = [...devices];
    const hasTeacherDesk = items.some(d => d.type === 'teacher_desk');
    const hasEntrance = items.some(d => d.type === 'entrance');

    if (!hasTeacherDesk) {
      items.push({
        id: 'element-teacher-desk',
        type: 'teacher_desk',
        name: "Teacher's Desk",
        code: "TEACHER",
        coords: { x: 300, y: 350 },
        width: 86,
        height: 44
      });
    }

    if (!hasEntrance) {
      items.push({
        id: 'element-main-entrance',
        type: 'entrance',
        name: "Main Entrance",
        code: "ENTRANCE",
        coords: { x: 10, y: 360 },
        width: 68,
        height: 28
      });
    }

    return items;
  });

  // Keep editor elements synchronized when lab changes
  useEffect(() => {
    if (devices && devices.length > 0) {
      const items = [...devices];
      const hasTeacherDesk = items.some(d => d.type === 'teacher_desk');
      const hasEntrance = items.some(d => d.type === 'entrance');

      if (!hasTeacherDesk) {
        items.push({
          id: 'element-teacher-desk',
          type: 'teacher_desk',
          name: "Teacher's Desk",
          code: "TEACHER",
          coords: { x: 300, y: 350 },
          width: 86,
          height: 44
        });
      }

      if (!hasEntrance) {
        items.push({
          id: 'element-main-entrance',
          type: 'entrance',
          name: "Main Entrance",
          code: "ENTRANCE",
          coords: { x: 10, y: 360 },
          width: 68,
          height: 28
        });
      }

      setLabElements(items);
    }
  }, [devices, lab?.id]);

  const [selectedId, setSelectedId] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [saveNotification, setSaveNotification] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const canvasRef = useRef(null);

  const selectedElement = labElements.find(d => d.id === selectedId);

  // Drag handlers with touch and mouse support
  const handlePointerDown = (e, item) => {
    e.stopPropagation();
    setSelectedId(item.id);
    setDraggedId(item.id);

    try {
      e.target.setPointerCapture?.(e.pointerId);
    } catch (_) {}

    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (canvasRect) {
      const nodeX = item.coords?.x || 30;
      const nodeY = item.coords?.y || 40;
      const pointerCanvasX = e.clientX - canvasRect.left;
      const pointerCanvasY = e.clientY - canvasRect.top;
      setDragOffset({
        x: pointerCanvasX - nodeX,
        y: pointerCanvasY - nodeY
      });
    }
  };

  const handlePointerMove = (e) => {
    if (!draggedId || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const pointerCanvasX = e.clientX - canvasRect.left;
    const pointerCanvasY = e.clientY - canvasRect.top;

    let newX = pointerCanvasX - dragOffset.x;
    let newY = pointerCanvasY - dragOffset.y;

    const currentItem = labElements.find(d => d.id === draggedId);
    const itemW = currentItem?.width || 52;
    const itemH = currentItem?.height || 44;

    const maxX = Math.max(100, canvasRect.width - itemW - 4);
    const maxY = Math.max(100, canvasRect.height - itemH - 4);
    newX = Math.max(4, Math.min(maxX, newX));
    newY = Math.max(4, Math.min(maxY, newY));

    // Snap to 4px
    newX = Math.round(newX / 4) * 4;
    newY = Math.round(newY / 4) * 4;

    setLabElements(prev => prev.map(d => {
      if (d.id === draggedId) {
        return { ...d, coords: { x: newX, y: newY } };
      }
      return d;
    }));
  };

  const handlePointerUp = (e) => {
    if (draggedId) {
      try {
        e.target.releasePointerCapture?.(e.pointerId);
      } catch (_) {}
      setDraggedId(null);
    }
  };

  // 1. Add PC: creates individual computer workstation
  const handleAddPC = () => {
    const pcCount = labElements.filter(d => d.type === 'pc').length + 1;
    const numStr = String(pcCount).padStart(2, '0');
    const code = `PC-${numStr}`;
    
    const newPC = {
      id: `dev-pc-${numStr}-${Date.now()}`,
      name: code,
      code: code,
      assetCode: `ASSET-PC-${numStr}`,
      status: 'working',
      type: 'pc',
      coords: {
        x: 30 + (((pcCount - 1) % 5) * 64),
        y: 50 + (Math.floor((pcCount - 1) / 5) * 76)
      },
      width: 52,
      height: 44,
      makeModel: 'Standard Lab Workstation',
      processor: 'Intel Core i5',
      ram: '8 GB',
      storage: '256 GB SSD',
      os: 'Windows 11 Pro',
      ip: `192.168.1.${100 + pcCount}`
    };

    setLabElements(prev => [...prev, newPC]);
    setSelectedId(newPC.id);
  };

  // 2. Add Table: creates lab workbench block (distinct from PC!)
  const handleAddTable = () => {
    const tableCount = labElements.filter(d => d.type === 'table').length + 1;
    const newTable = {
      id: `element-table-${tableCount}-${Date.now()}`,
      type: 'table',
      name: `Workbench ${tableCount}`,
      code: `TBL-${tableCount}`,
      coords: { x: 80, y: 120 + ((tableCount - 1) * 70) },
      width: 110,
      height: 48,
      capacity: 2
    };

    setLabElements(prev => [...prev, newTable]);
    setSelectedId(newTable.id);
  };

  // 3. Add Label: creates custom zone/aisle text marker
  const handleAddLabel = () => {
    const labelCount = labElements.filter(d => d.type === 'label').length + 1;
    const newLabel = {
      id: `element-label-${labelCount}-${Date.now()}`,
      type: 'label',
      name: `Aisle ${labelCount}`,
      code: `AISLE-${labelCount}`,
      coords: { x: 120, y: 30 },
      width: 88,
      height: 26
    };

    setLabElements(prev => [...prev, newLabel]);
    setSelectedId(newLabel.id);
  };

  // 4. Configurable Teacher's Desk: add if not present or select
  const handleAddTeacherDesk = () => {
    const existing = labElements.find(d => d.type === 'teacher_desk');
    if (existing) {
      setSelectedId(existing.id);
    } else {
      const newDesk = {
        id: `element-teacher-desk-${Date.now()}`,
        type: 'teacher_desk',
        name: "Teacher's Desk",
        code: "TEACHER",
        coords: { x: 260, y: 340 },
        width: 90,
        height: 45
      };
      setLabElements(prev => [...prev, newDesk]);
      setSelectedId(newDesk.id);
    }
  };

  // 5. Configurable Entrance: add if not present or select
  const handleAddEntrance = () => {
    const existing = labElements.find(d => d.type === 'entrance');
    if (existing) {
      setSelectedId(existing.id);
    } else {
      const newDoor = {
        id: `element-entrance-${Date.now()}`,
        type: 'entrance',
        name: "Main Entrance",
        code: "ENTRANCE",
        coords: { x: 12, y: 350 },
        width: 70,
        height: 28
      };
      setLabElements(prev => [...prev, newDoor]);
      setSelectedId(newDoor.id);
    }
  };

  const handleRemoveSelected = () => {
    if (!selectedId) return;
    setLabElements(prev => prev.filter(d => d.id !== selectedId));
    setSelectedId(null);
  };

  const handleUpdateSelectedItem = (key, value) => {
    if (!selectedId) return;
    setLabElements(prev => prev.map(d => {
      if (d.id === selectedId) {
        return { ...d, [key]: value };
      }
      return d;
    }));
  };

  const handleSave = () => {
    onSaveLab(labElements);
    setSaveNotification(true);
    setTimeout(() => {
      setSaveNotification(false);
      onBack();
    }, 1200);
  };

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
              Lab Layout Designer
            </span>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              {lab?.name || 'Computer Lab'} • Drag & configure elements
            </div>
          </div>
        </div>
        <button 
          onClick={handleSave}
          style={{
            background: 'var(--navy-800)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 16px',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          Save Layout
        </button>
      </div>

      {/* Save Toast Notification */}
      {saveNotification && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--status-working)',
          color: '#fff',
          padding: '8px 18px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: 100,
          boxShadow: 'var(--shadow-md)'
        }}>
          <Check size={14} />
          <span>Lab layout saved successfully!</span>
        </div>
      )}

      {/* Instruction Tip */}
      <div style={{
        margin: '10px 16px 6px 16px',
        padding: '8px 12px',
        background: 'var(--blue-50)',
        borderRadius: '8px',
        border: '1px solid rgba(37, 99, 235, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '11px',
        color: 'var(--navy-800)'
      }}>
        <Info size={15} color="var(--blue-600)" style={{ flexShrink: 0 }} />
        <span>Select any element to drag or rename. Entrance & Teacher's Desk can now be placed anywhere.</span>
      </div>

      {/* Workspace Area: Left Toolbar + Canvas */}
      <div style={{ padding: '0 16px 12px 16px', display: 'flex', gap: '10px', flex: 1 }}>
        {/* Left Elements Palette */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          width: '74px',
          flexShrink: 0
        }}>
          {/* Add PC */}
          <button
            onClick={handleAddPC}
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-mid)',
              borderRadius: '8px',
              padding: '8px 2px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: '600',
              color: 'var(--text-main)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Monitor size={17} color="var(--navy-800)" />
            <span>+ PC</span>
          </button>

          {/* Add Table */}
          <button
            onClick={handleAddTable}
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-mid)',
              borderRadius: '8px',
              padding: '8px 2px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: '600',
              color: 'var(--text-main)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Table2 size={17} color="#d97706" />
            <span>+ Table</span>
          </button>

          {/* Add Label / Aisle */}
          <button
            onClick={handleAddLabel}
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-mid)',
              borderRadius: '8px',
              padding: '8px 2px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: '600',
              color: 'var(--text-main)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Tag size={17} color="#2563eb" />
            <span>+ Label</span>
          </button>

          {/* Teacher Desk */}
          <button
            onClick={handleAddTeacherDesk}
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-mid)',
              borderRadius: '8px',
              padding: '8px 2px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: '600',
              color: 'var(--text-main)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Armchair size={17} color="#475569" />
            <span>+ Desk</span>
          </button>

          {/* Entrance Door */}
          <button
            onClick={handleAddEntrance}
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-mid)',
              borderRadius: '8px',
              padding: '8px 2px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: '600',
              color: 'var(--text-main)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <DoorOpen size={17} color="#059669" />
            <span>+ Door</span>
          </button>

          {/* Delete Item */}
          <button
            onClick={handleRemoveSelected}
            disabled={!selectedId}
            style={{
              marginTop: '4px',
              background: selectedId ? '#fee2e2' : '#f8fafc',
              border: selectedId ? '1px solid #ef4444' : '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '8px 2px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              cursor: selectedId ? 'pointer' : 'not-allowed',
              fontSize: '10px',
              fontWeight: '600',
              color: selectedId ? '#dc2626' : 'var(--text-light)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Trash2 size={16} />
            <span>Remove</span>
          </button>
        </div>

        {/* 2D Interactive Canvas */}
        <div 
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={() => setSelectedId(null)}
          style={{
            flex: 1,
            background: '#ffffff',
            border: '2px solid #334155',
            borderRadius: '8px',
            position: 'relative',
            height: '460px',
            minHeight: '400px',
            overflow: 'hidden',
            touchAction: 'none',
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            userSelect: 'none'
          }}
        >
          {labElements.map(item => {
            const isSelected = selectedId === item.id;
            const isDragging = draggedId === item.id;

            // Element 1: Teacher's Desk (Draggable & Configurable)
            if (item.type === 'teacher_desk') {
              return (
                <div
                  key={item.id}
                  onPointerDown={e => handlePointerDown(e, item)}
                  style={{
                    position: 'absolute',
                    left: `${item.coords?.x || 280}px`,
                    top: `${item.coords?.y || 340}px`,
                    width: `${item.width || 88}px`,
                    height: `${item.height || 44}px`,
                    background: isDragging ? '#e2e8f0' : (isSelected ? '#e0f2fe' : '#f1f5f9'),
                    border: isSelected ? '2px solid #0284c7' : '1.5px dashed #475569',
                    borderRadius: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '9px',
                    fontWeight: '700',
                    color: '#334155',
                    textAlign: 'center',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    zIndex: isDragging ? 60 : (isSelected ? 40 : 10),
                    boxShadow: isDragging ? '0 10px 20px rgba(0,0,0,0.2)' : (isSelected ? '0 0 0 3px rgba(2, 132, 199, 0.3)' : 'none')
                  }}
                >
                  <Armchair size={13} color="#475569" />
                  <span>{item.name || "Teacher's Desk"}</span>
                </div>
              );
            }

            // Element 2: Entrance Door (Draggable & Configurable)
            if (item.type === 'entrance') {
              return (
                <div
                  key={item.id}
                  onPointerDown={e => handlePointerDown(e, item)}
                  style={{
                    position: 'absolute',
                    left: `${item.coords?.x || 10}px`,
                    top: `${item.coords?.y || 350}px`,
                    width: `${item.width || 68}px`,
                    height: `${item.height || 28}px`,
                    background: isDragging ? '#dcfce7' : (isSelected ? '#bbf7d0' : '#ffffff'),
                    border: isSelected ? '2px solid #16a34a' : '2px solid #334155',
                    borderLeft: '4px solid #16a34a',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    fontSize: '9px',
                    fontWeight: '800',
                    color: '#15803d',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    zIndex: isDragging ? 60 : (isSelected ? 40 : 10),
                    boxShadow: isDragging ? '0 10px 20px rgba(0,0,0,0.2)' : (isSelected ? '0 0 0 3px rgba(22, 163, 74, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)')
                  }}
                >
                  <DoorOpen size={13} />
                  <span>{item.name || 'Entrance'}</span>
                </div>
              );
            }

            // Element 3: Table / Workbench Block
            if (item.type === 'table') {
              return (
                <div
                  key={item.id}
                  onPointerDown={e => handlePointerDown(e, item)}
                  style={{
                    position: 'absolute',
                    left: `${item.coords?.x || 80}px`,
                    top: `${item.coords?.y || 120}px`,
                    width: `${item.width || 110}px`,
                    height: `${item.height || 48}px`,
                    background: isDragging ? '#fef3c7' : (isSelected ? '#fed7aa' : '#f8fafc'),
                    border: isSelected ? '2px solid #ea580c' : '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px',
                    fontSize: '9.5px',
                    fontWeight: '700',
                    color: '#78350f',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    zIndex: isDragging ? 60 : (isSelected ? 40 : 5),
                    boxShadow: isDragging ? '0 10px 20px rgba(0,0,0,0.2)' : (isSelected ? '0 0 0 3px rgba(234, 88, 12, 0.3)' : '0 2px 4px rgba(0,0,0,0.06)')
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Table2 size={13} color="#d97706" />
                    <span>{item.name || item.code}</span>
                  </div>
                  <span style={{ fontSize: '7.5px', color: '#92400e', fontWeight: 600 }}>
                    Lab Workbench
                  </span>
                </div>
              );
            }

            // Element 4: Floating Label / Aisle Indicator
            if (item.type === 'label') {
              return (
                <div
                  key={item.id}
                  onPointerDown={e => handlePointerDown(e, item)}
                  style={{
                    position: 'absolute',
                    left: `${item.coords?.x || 120}px`,
                    top: `${item.coords?.y || 30}px`,
                    width: `${item.width || 88}px`,
                    height: `${item.height || 26}px`,
                    background: isDragging ? '#dbeafe' : (isSelected ? '#bfdbfe' : 'rgba(239, 246, 255, 0.9)'),
                    border: isSelected ? '2px solid #2563eb' : '1px dashed #3b82f6',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    fontSize: '9px',
                    fontWeight: '800',
                    color: '#1d4ed8',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    zIndex: isDragging ? 60 : (isSelected ? 40 : 8),
                    boxShadow: isDragging ? '0 8px 16px rgba(0,0,0,0.2)' : 'none'
                  }}
                >
                  <Tag size={11} />
                  <span>{item.name || item.code}</span>
                </div>
              );
            }

            // Element 5: Standard PC Workstation
            return (
              <div
                key={item.id}
                onPointerDown={e => handlePointerDown(e, item)}
                style={{
                  position: 'absolute',
                  left: `${item.coords?.x || 30}px`,
                  top: `${item.coords?.y || 40}px`,
                  width: `${item.width || 52}px`,
                  height: `${item.height || 44}px`,
                  background: isDragging ? '#1e3a8a' : (isSelected ? 'var(--navy-800)' : 'var(--status-working)'),
                  border: isDragging ? '2px solid #60a5fa' : (isSelected ? '2px solid #3b82f6' : '1px solid #16a34a'),
                  borderRadius: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '9.5px',
                  fontWeight: '700',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  touchAction: 'none',
                  zIndex: isDragging ? 60 : (isSelected ? 45 : 15),
                  boxShadow: isDragging 
                    ? '0 10px 20px rgba(0,0,0,0.25), 0 0 0 3px rgba(96, 165, 250, 0.5)' 
                    : (isSelected ? '0 0 0 3px rgba(59, 130, 246, 0.4)' : '0 2px 4px rgba(0,0,0,0.1)')
                }}
              >
                <Monitor size={13} />
                <span>{item.code || item.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Element Property Inspector */}
      {selectedElement && (
        <div style={{
          margin: '0 16px 16px 16px',
          padding: '10px 14px',
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid var(--border-mid)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <Edit3 size={15} color="var(--navy-800)" />
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-main)', minWidth: '70px' }}>
              {selectedElement.type === 'pc' ? 'Workstation' :
               selectedElement.type === 'table' ? 'Workbench' :
               selectedElement.type === 'label' ? 'Label Marker' :
               selectedElement.type === 'teacher_desk' ? "Teacher's Desk" : 'Entrance'}:
            </div>
            <input 
              type="text"
              value={selectedElement.name || selectedElement.code || ''}
              onChange={(e) => handleUpdateSelectedItem('name', e.target.value)}
              className="form-input"
              style={{
                fontSize: '11px',
                padding: '4px 8px',
                height: '28px',
                maxWidth: '180px'
              }}
              placeholder="Name / Label"
            />
            {selectedElement.type === 'pc' && (
              <input 
                type="text"
                value={selectedElement.code || ''}
                onChange={(e) => handleUpdateSelectedItem('code', e.target.value)}
                className="form-input"
                style={{
                  fontSize: '11px',
                  padding: '4px 8px',
                  height: '28px',
                  width: '80px'
                }}
                placeholder="Code (PC-01)"
              />
            )}
          </div>

          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            X: {selectedElement.coords?.x || 0}, Y: {selectedElement.coords?.y || 0}
          </div>
        </div>
      )}
    </div>
  );
}
