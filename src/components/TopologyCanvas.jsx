import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Filter, 
  Layers,
  LayoutGrid,
  BookOpen,
  Compass,
  Hammer,
  Move,
  RotateCcw,
  Check,
  Maximize2
} from 'lucide-react';
import { DeviceNode } from './DeviceNode';
import { BuilderToolbar } from './BuilderToolbar';
import { ROOM_ARRANGEMENTS } from '../data/labData';

export function TopologyCanvas({
  lab,
  tickets,
  selectedDevice,
  onSelectDevice,
  filterOnlyIssues,
  onToggleFilterIssues,
  onOpenGuide,
  isBuilderMode = false,
  onToggleBuilderMode,
  onUpdateDevicePosition,
  onRotateDevice,
  onDuplicateDevice,
  onDeleteDevice,
  onRenameDevice,
  onAddDevice,
  onSaveLayout
}) {
  const mapBounds = lab.mapBounds || { width: 380, height: 520 };
  const layoutType = lab.layoutType || 'u_shape';
  const currentArrangement = ROOM_ARRANGEMENTS.find(r => r.id === layoutType) || ROOM_ARRANGEMENTS[0];

  // View Mode: 'plan' (2D CAD Floor Plan) vs 'isometric' (Clash of Clans 2.5D Isometric Tilt)
  const [viewMode, setViewMode] = useState('plan'); // 'plan' | 'isometric'

  // Pan & Zoom Engine (Clash of Clans Continuous Village Map Panning)
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Drag-and-Drop state for devices in Builder Mode
  const [draggedDeviceId, setDraggedDeviceId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragCurrentCoords, setDragCurrentCoords] = useState(null);
  const [gridSnap, setGridSnap] = useState(true);

  // Background Pan dragging state
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0, initialPanX: 0, initialPanY: 0 });
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  // Pinch-to-zoom tracking
  const pinchRef = useRef({ initialDistance: 0, initialZoom: 1 });

  // Reset View to 100% Fit & Center
  const resetFit = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(2.5, +(prev + 0.15).toFixed(2)));
  const handleZoomOut = () => setZoom(prev => Math.max(0.6, +(prev - 0.15).toFixed(2)));

  const activeLabTickets = tickets.filter(t => t.labId === lab.id && t.status !== 'resolved').length;

  // Convert Screen Pointer Event to SVG Coordinates
  const getSvgCoordinates = (clientX, clientY) => {
    if (!svgRef.current) return { x: clientX, y: clientY };
    const pt = svgRef.current.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
    return { x: Math.round(svgP.x), y: Math.round(svgP.y) };
  };

  // 1. Device Pointer Down (Initiate Drag in Builder Mode)
  const handleDevicePointerDown = (e, device) => {
    if (!isBuilderMode) return;
    e.stopPropagation();

    const svgCoords = getSvgCoordinates(e.clientX, e.clientY);
    setDraggedDeviceId(device.id);
    setDragOffset({
      x: svgCoords.x - device.coords.x,
      y: svgCoords.y - device.coords.y
    });
    setDragCurrentCoords({ x: device.coords.x, y: device.coords.y });
    onSelectDevice(device);
  };

  // 2. Background Pointer Down (Initiate Pan in Clash of Clans view)
  const handleBackgroundPointerDown = (e) => {
    // If clicked on empty space, deselect device
    if (e.target === e.currentTarget || e.target.tagName === 'svg' || e.target.id === 'map-background') {
      onSelectDevice(null);
    }

    if (e.pointerType === 'touch' && e.isPrimary === false) return; // ignore secondary touches for panning

    setIsPanning(true);
    panStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialPanX: pan.x,
      initialPanY: pan.y
    };
  };

  // 3. Global Pointer Move (Handles both Pan & Device Drag)
  const handlePointerMove = (e) => {
    // A. If dragging a device
    if (draggedDeviceId) {
      e.preventDefault();
      const svgCoords = getSvgCoordinates(e.clientX, e.clientY);
      let newX = svgCoords.x - dragOffset.x;
      let newY = svgCoords.y - dragOffset.y;

      // Apply Grid Snapping (Clash of Clans tile alignment)
      if (gridSnap) {
        const snapInterval = 20;
        newX = Math.round(newX / snapInterval) * snapInterval;
        newY = Math.round(newY / snapInterval) * snapInterval;
      }

      // Clamp within map bounds
      newX = Math.max(35, Math.min(mapBounds.width - 35, newX));
      newY = Math.max(35, Math.min(mapBounds.height - 35, newY));

      setDragCurrentCoords({ x: newX, y: newY });
      return;
    }

    // B. If panning the canvas
    if (isPanning) {
      e.preventDefault();
      const deltaX = e.clientX - panStartRef.current.x;
      const deltaY = e.clientY - panStartRef.current.y;
      setPan({
        x: panStartRef.current.initialPanX + deltaX,
        y: panStartRef.current.initialPanY + deltaY
      });
    }
  };

  // 4. Global Pointer Up (Commit Device Drop or End Pan)
  const handlePointerUp = () => {
    if (draggedDeviceId && dragCurrentCoords) {
      if (onUpdateDevicePosition) {
        onUpdateDevicePosition(lab.id, draggedDeviceId, dragCurrentCoords);
      }
      setDraggedDeviceId(null);
      setDragCurrentCoords(null);
    }
    setIsPanning(false);
  };

  // 5. Wheel Zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom(prev => Math.min(2.5, Math.max(0.6, +(prev + zoomDelta).toFixed(2))));
  };

  // 6. Touch Pinch-to-Zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      pinchRef.current = { initialDistance: dist, initialZoom: zoom };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && pinchRef.current.initialDistance > 0) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      const factor = dist / pinchRef.current.initialDistance;
      setZoom(Math.min(2.5, Math.max(0.6, +(pinchRef.current.initialZoom * factor).toFixed(2))));
    }
  };

  // Render Architectural Floor Layout Base Graphics
  const renderLayoutFloorPlan = () => {
    switch (layoutType) {
      case 'u_shape':
        return (
          <g opacity="0.9">
            {/* Top Print & Staging Bay */}
            <rect x="15" y="12" width="350" height="78" rx="10" fill="var(--bg-primary)" stroke="var(--border-subtle)" />
            <rect x="15" y="12" width="350" height="18" rx="10" fill="rgba(0, 188, 235, 0.08)" stroke="var(--border-subtle)" />
            <text x="190" y="24" style={{ fontFamily: 'var(--font-mono)', fontSize: '7.5px', fontWeight: 700, fill: 'var(--cisco-blue)', textAnchor: 'middle', letterSpacing: '0.4px' }}>
              🖨️ NETWORK PRINTERS & STAGING RACK
            </text>

            {/* Left Wall Runway */}
            <rect x="15" y="105" width="70" height="365" rx="8" fill="var(--bg-primary)" fillOpacity="0.5" stroke="var(--border-subtle)" strokeDasharray="3 3" />
            <text x="50" y="120" style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', fontWeight: 700, fill: 'var(--text-dim)', textAnchor: 'middle' }}>
              LEFT WALL
            </text>

            {/* Right Wall Runway */}
            <rect x="295" y="105" width="70" height="365" rx="8" fill="var(--bg-primary)" fillOpacity="0.5" stroke="var(--border-subtle)" strokeDasharray="3 3" />
            <text x="330" y="120" style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', fontWeight: 700, fill: 'var(--text-dim)', textAnchor: 'middle' }}>
              RIGHT WALL
            </text>

            {/* Back Wall Row */}
            <rect x="65" y="405" width="250" height="65" rx="8" fill="var(--bg-primary)" fillOpacity="0.5" stroke="var(--border-subtle)" strokeDasharray="3 3" />
            <text x="190" y="460" style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', fontWeight: 700, fill: 'var(--text-dim)', textAnchor: 'middle' }}>
              BACK WALL ROW
            </text>

            {/* Center Teacher Observation Zone */}
            <circle cx="190" cy="220" r="45" fill="rgba(0, 188, 235, 0.04)" stroke="rgba(0, 188, 235, 0.25)" strokeDasharray="4 4" />
            <text x="190" y="195" style={{ fontFamily: 'var(--font-mono)', fontSize: '7.5px', fontWeight: 700, fill: 'var(--cisco-blue)', textAnchor: 'middle', letterSpacing: '0.5px' }}>
              TEACHER PODIUM
            </text>
            <text x="190" y="246" style={{ fontFamily: 'var(--font-mono)', fontSize: '6.5px', fill: 'var(--text-dim)', textAnchor: 'middle' }}>
              (360° Screen Visibility)
            </text>
          </g>
        );

      case 'cluster_pods':
        return (
          <g opacity="0.9">
            <rect x="15" y="12" width="350" height="76" rx="10" fill="var(--bg-primary)" stroke="var(--border-subtle)" />
            <rect x="15" y="12" width="350" height="18" rx="10" fill="rgba(236, 72, 153, 0.08)" stroke="var(--border-subtle)" />
            <text x="190" y="24" style={{ fontFamily: 'var(--font-mono)', fontSize: '7.5px', fontWeight: 700, fill: '#ec4899', textAnchor: 'middle', letterSpacing: '0.4px' }}>
              🔬 3D PRINTERS & CAD PLOTTER BAY
            </text>

            {/* Pod Island Hubs */}
            {[
              { x: 105, y: 175, name: 'POD 1' },
              { x: 275, y: 175, name: 'POD 2' },
              { x: 105, y: 310, name: 'POD 3' },
              { x: 275, y: 310, name: 'POD 4' }
            ].map((p, idx) => (
              <g key={idx} transform={`translate(${p.x}, ${p.y})`}>
                <rect x="-65" y="-55" width="130" height="110" rx="14" fill="var(--bg-primary)" fillOpacity="0.5" stroke="var(--border-subtle)" />
                <circle cx="0" cy="0" r="18" fill="rgba(236, 72, 153, 0.12)" stroke="rgba(236, 72, 153, 0.4)" strokeDasharray="2 2" />
                <text x="0" y="2" style={{ fontFamily: 'var(--font-mono)', fontSize: '6.5px', fontWeight: 800, fill: '#ec4899', textAnchor: 'middle' }}>{p.name}</text>
              </g>
            ))}

            <line x1="190" y1="100" x2="190" y2="440" stroke="var(--cisco-grid-accent)" strokeWidth="1" strokeDasharray="3 3" />
          </g>
        );

      case 'classroom_rows':
        return (
          <g opacity="0.9">
            <rect x="15" y="12" width="350" height="76" rx="10" fill="var(--bg-primary)" stroke="var(--border-subtle)" />
            <rect x="15" y="12" width="350" height="18" rx="10" fill="rgba(16, 185, 129, 0.08)" stroke="var(--border-subtle)" />
            <text x="190" y="24" style={{ fontFamily: 'var(--font-mono)', fontSize: '7.5px', fontWeight: 700, fill: '#10b981', textAnchor: 'middle', letterSpacing: '0.4px' }}>
              🖥️ FRONT SMART BOARD & INSTRUCTOR PODIUM
            </text>

            {[0, 1, 2, 3, 4, 5, 6, 7].map(r => {
              const y = 145 + r * 68;
              if (y > mapBounds.height - 60) return null;
              return (
                <g key={r}>
                  <rect x="25" y={y - 28} width="330" height="58" rx="7" fill="var(--bg-primary)" fillOpacity="0.3" stroke="var(--border-subtle)" strokeDasharray="4 4" />
                  <text x="35" y={y + 3} style={{ fontFamily: 'var(--font-mono)', fontSize: '6px', fontWeight: 800, fill: 'var(--text-dim)', textAnchor: 'start' }}>
                    ROW {r + 1}
                  </text>
                </g>
              );
            })}
          </g>
        );

      case 'dual_bank':
      default:
        return (
          <g opacity="0.9">
            <rect x="12" y="10" width="174" height="80" rx="8" fill="var(--bg-primary)" stroke="var(--border-subtle)" />
            <rect x="12" y="10" width="174" height="18" rx="8" fill="rgba(0, 188, 235, 0.08)" stroke="var(--border-subtle)" />
            <text x="99" y="22" style={{ fontFamily: 'var(--font-mono)', fontSize: '7.5px', fontWeight: 700, fill: 'var(--cisco-blue)', textAnchor: 'middle' }}>
              🖥️ TEACHER PODIUM & RACK
            </text>

            <rect x="194" y="10" width="174" height="80" rx="8" fill="var(--bg-primary)" stroke="rgba(0, 188, 235, 0.25)" strokeWidth="1" />
            <rect x="194" y="10" width="174" height="18" rx="8" fill="rgba(0, 188, 235, 0.08)" stroke="var(--border-subtle)" />
            <text x="281" y="22" style={{ fontFamily: 'var(--font-mono)', fontSize: '7.5px', fontWeight: 700, fill: 'var(--cisco-blue)', textAnchor: 'middle' }}>
              🖨️ PRINT STATION BAY
            </text>

            <line x1={mapBounds.width / 2} y1="96" x2={mapBounds.width / 2} y2={mapBounds.height - 55} stroke="var(--cisco-grid-accent)" strokeWidth="1.2" strokeDasharray="3 3" />

            <rect x="12" y="98" width="174" height={mapBounds.height - 165} rx="8" fill="var(--bg-primary)" fillOpacity="0.4" stroke="var(--border-subtle)" />
            <text x="99" y="112" style={{ fontFamily: 'var(--font-mono)', fontSize: '7.5px', fontWeight: 700, fill: 'var(--text-muted)', textAnchor: 'middle' }}>
              STUDENT POD A
            </text>

            <rect x="194" y="98" width="174" height={mapBounds.height - 165} rx="8" fill="var(--bg-primary)" fillOpacity="0.4" stroke="var(--border-subtle)" />
            <text x="281" y="112" style={{ fontFamily: 'var(--font-mono)', fontSize: '7.5px', fontWeight: 700, fill: 'var(--text-muted)', textAnchor: 'middle' }}>
              STUDENT POD B
            </text>
          </g>
        );
    }
  };

  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* 1. Clash of Clans Map Viewport Toolbar */}
      <div 
        style={{
          padding: '6px 10px',
          background: 'var(--bg-panel)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          gap: '6px',
          zIndex: 30,
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Left: Layout Badge + Room Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
          <button
            onClick={onOpenGuide}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 7px',
              borderRadius: '8px',
              fontSize: '10px',
              fontWeight: 800,
              background: `${currentArrangement.accentColor}22`,
              color: currentArrangement.accentColor,
              border: `1px solid ${currentArrangement.accentColor}55`,
              cursor: 'pointer',
              flexShrink: 0
            }}
            title="Learn about this room arrangement"
          >
            <span>{currentArrangement.icon}</span>
            <span>{currentArrangement.shortName}</span>
          </button>

          <span style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {lab.devices.length} PCs
          </span>
        </div>

        {/* Right: Clash of Clans Perspective Toggle + Builder Mode Toggle + Zoom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          {/* Clash of Clans 2.5D Isometric Tilt View Toggle */}
          <button
            onClick={() => setViewMode(prev => prev === 'plan' ? 'isometric' : 'plan')}
            style={{
              padding: '4px 7px',
              borderRadius: '10px',
              fontSize: '10px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              background: viewMode === 'isometric' ? 'rgba(0, 188, 235, 0.2)' : 'var(--bg-surface)',
              color: viewMode === 'isometric' ? 'var(--cisco-blue)' : 'var(--text-dim)',
              border: viewMode === 'isometric' ? '1.5px solid var(--cisco-blue)' : '1px solid var(--border-subtle)',
              cursor: 'pointer'
            }}
            title="Toggle between 2.5D Isometric Clash View and 2D Plan View"
          >
            <Compass size={11} />
            <span>{viewMode === 'isometric' ? '🏰 2.5D' : '🗺️ 2D'}</span>
          </button>

          {/* Builder Mode Drag & Drop Toggle */}
          <button
            onClick={onToggleBuilderMode}
            style={{
              padding: '4px 7px',
              borderRadius: '10px',
              fontSize: '10px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              background: isBuilderMode ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--bg-surface)',
              color: isBuilderMode ? '#ffffff' : 'var(--cisco-blue)',
              border: isBuilderMode ? '1px solid #10b981' : '1px solid var(--border-subtle)',
              boxShadow: isBuilderMode ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none',
              cursor: 'pointer'
            }}
            title="Unlock Drag & Drop Builder Mode to customize desk locations"
          >
            <Hammer size={11} />
            <span>{isBuilderMode ? 'Done' : 'Edit'}</span>
          </button>

          {/* Issues Filter Button */}
          <button
            onClick={onToggleFilterIssues}
            style={{
              padding: '4px 7px',
              borderRadius: '10px',
              fontSize: '10px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              background: filterOnlyIssues ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-surface)',
              color: filterOnlyIssues ? '#f87171' : 'var(--text-dim)',
              border: filterOnlyIssues ? '1px solid #ef4444' : '1px solid var(--border-subtle)'
            }}
            title="Filter only devices with active tickets"
          >
            <Filter size={11} />
            <span>{filterOnlyIssues ? `${activeLabTickets}` : 'All'}</span>
          </button>

          {/* Pan/Zoom Controls */}
          <div style={{ display: 'flex', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <button 
              onClick={handleZoomOut} 
              style={{ width: '24px', height: '24px', color: 'var(--text-muted)' }}
              title="Zoom Out"
            >
              <ZoomOut size={12} />
            </button>
            <button 
              onClick={resetFit} 
              style={{ width: '28px', height: '24px', color: 'var(--text-muted)', fontSize: '8.5px', fontWeight: 800 }}
              title="Reset Fit & Center"
            >
              FIT
            </button>
            <button 
              onClick={handleZoomIn} 
              style={{ width: '24px', height: '24px', color: 'var(--text-muted)' }}
              title="Zoom In"
            >
              <ZoomIn size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Clash of Clans Canvas Viewport */}
      <div 
        ref={containerRef}
        className="packet-tracer-workspace"
        onPointerDown={handleBackgroundPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isPanning ? 'grabbing' : isBuilderMode ? 'crosshair' : 'grab',
          touchAction: 'none'
        }}
      >
        {/* Transformable Canvas Group with Clash of Clans 2.5D Tilt */}
        <div
          style={{
            transform: viewMode === 'isometric'
              ? `perspective(1000px) rotateX(24deg) rotateZ(-12deg) translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${zoom})`
              : `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isPanning || draggedDeviceId ? 'none' : 'transform 0.22s cubic-bezier(0.34, 1.3, 0.64, 1)',
            filter: viewMode === 'isometric' ? 'drop-shadow(0 25px 45px rgba(0, 0, 0, 0.6))' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${mapBounds.width} ${mapBounds.height}`}
            style={{
              width: `${mapBounds.width}px`,
              height: `${mapBounds.height}px`,
              maxWidth: 'none',
              overflow: 'visible'
            }}
          >
            {/* SVG Definitions for Clash of Clans Ground Tiles & Conduits */}
            <defs>
              <pattern id="clash-grid-tiles" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="transparent" />
                <rect width="10" height="10" fill="rgba(0, 188, 235, 0.025)" />
                <rect x="10" y="10" width="10" height="10" fill="rgba(0, 188, 235, 0.025)" />
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--cisco-grid-accent)" strokeWidth="0.4" opacity="0.35" />
              </pattern>
            </defs>

            {/* Room Ground Floor Tile Grid (Clash of Clans Base Grass) */}
            <rect
              id="map-background"
              x="2"
              y="2"
              width={mapBounds.width - 4}
              height={mapBounds.height - 4}
              rx="16"
              ry="16"
              fill="var(--bg-surface)"
              fillOpacity="0.35"
              stroke={isBuilderMode ? '#10b981' : 'var(--border-subtle)'}
              strokeWidth={isBuilderMode ? '2' : '1.5'}
              strokeDasharray={isBuilderMode ? '6 4' : 'none'}
            />

            <rect
              x="2"
              y="2"
              width={mapBounds.width - 4}
              height={mapBounds.height - 4}
              rx="16"
              ry="16"
              fill="url(#clash-grid-tiles)"
            />

            {/* Floor Plan Graphics */}
            {renderLayoutFloorPlan()}

            {/* Main Lab Entrance */}
            <g transform={`translate(${mapBounds.width / 2}, ${mapBounds.height - 24})`}>
              <rect x="-30" y="-2" width="60" height="4" fill="var(--bg-primary)" />
              <path
                d="M -22 0 A 22 22 0 0 1 0 -22"
                fill="none"
                stroke="var(--cisco-blue)"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />
              <line x1="-22" y1="0" x2="-22" y2="-20" stroke="var(--cisco-blue)" strokeWidth="1.4" />
              <text
                x="0"
                y="16"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '7px',
                  fill: 'var(--text-dim)',
                  textAnchor: 'middle',
                  fontWeight: 700,
                  letterSpacing: '0.4px'
                }}
              >
                🚪 MAIN LAB ENTRANCE
              </text>
            </g>

            {/* Render Devices (Computers, Printers, Rack, Teacher Podium) */}
            <g>
              {lab.devices.map(device => {
                const activeCount = tickets.filter(
                  t => t.deviceId === device.id && t.status !== 'resolved'
                ).length;

                const isDimmed = filterOnlyIssues && activeCount === 0 && device.status === 'operational';
                const isBeingDragged = draggedDeviceId === device.id;

                // If this device is currently being dragged, use the real-time dragged coordinates
                const displayDevice = isBeingDragged && dragCurrentCoords
                  ? { ...device, coords: dragCurrentCoords }
                  : device;

                return (
                  <g key={device.id} opacity={isDimmed ? 0.15 : 1}>
                    <DeviceNode
                      device={displayDevice}
                      isSelected={selectedDevice?.id === device.id}
                      activeTicketsCount={activeCount}
                      isBuilderMode={isBuilderMode}
                      isDragging={isBeingDragged}
                      onPointerDown={handleDevicePointerDown}
                      onSelect={(d) => {
                        if (typeof navigator !== 'undefined' && navigator.vibrate) {
                          navigator.vibrate(15);
                        }
                        onSelectDevice(d);
                      }}
                    />
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* 3. Floating Builder Mode Toolbar (Clash of Clans Layout Editor Dock) */}
      {isBuilderMode && (
        <BuilderToolbar
          selectedDevice={selectedDevice}
          onRotateDevice={onRotateDevice}
          onDuplicateDevice={onDuplicateDevice}
          onDeleteDevice={onDeleteDevice}
          onRenameDevice={onRenameDevice}
          onAddDevice={onAddDevice}
          gridSnap={gridSnap}
          onToggleGridSnap={() => setGridSnap(!gridSnap)}
          onSaveLayout={onSaveLayout}
          onExitBuilder={onToggleBuilderMode}
          lab={lab}
        />
      )}
    </div>
  );
}
