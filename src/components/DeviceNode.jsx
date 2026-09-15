import React from 'react';
import { Move } from 'lucide-react';

export function DeviceNode({ 
  device, 
  isSelected, 
  activeTicketsCount, 
  onSelect,
  isBuilderMode = false,
  isDragging = false,
  onPointerDown
}) {
  const { coords, type, status, code, bench, hardware, rotation = 0 } = device;
  const x = coords.x;
  const y = coords.y;

  // Box dimensions for floor map desk node
  const boxWidth = 58;
  const boxHeight = 52;
  const halfW = boxWidth / 2;
  const halfH = boxHeight / 2;

  const hasCritical = status === 'critical';
  const hasWarning = status === 'warning';

  // Short label (e.g. "PC-04", "B04", "Laser", "Rack")
  const shortTag = bench || code;

  // Hardware spec sub-label
  const specSnippet = hardware?.cpu 
    ? hardware.cpu.replace('Intel Core ', '').replace('Intel ', '').split('-')[0]
    : type === 'printer' ? 'Laser' : 'Cisco';

  // Realistic Vector Hardware Silhouettes
  const renderHardwareGraphic = () => {
    if (type === 'switch') {
      // Cisco 2960 Rack Unit
      return (
        <g transform="translate(-18, -13)">
          <rect x="0" y="0" width="36" height="13" rx="2" fill="#0f172a" stroke="#00bceb" strokeWidth="0.9" />
          <line x1="2" y1="3" x2="34" y2="3" stroke="#0284c7" strokeWidth="0.8" />
          {/* LED array */}
          <circle cx="5" cy="8" r="1.1" fill="#10b981" />
          <circle cx="9" cy="8" r="1.1" fill="#10b981" />
          <circle cx="13" cy="8" r="1.1" fill="#10b981" />
          <circle cx="17" cy="8" r="1.1" fill={hasCritical ? '#ef4444' : '#10b981'} />
          <circle cx="21" cy="8" r="1.1" fill="#10b981" />
          <circle cx="25" cy="8" r="1.1" fill={hasWarning ? '#f59e0b' : '#10b981'} />
          <circle cx="29" cy="8" r="1.1" fill="#10b981" />
        </g>
      );
    }

    if (type === 'printer') {
      // Modern Network Laser / MFP Printer
      return (
        <g transform="translate(-16, -15)">
          {/* Paper Output Sheet */}
          <rect x="7" y="0" width="18" height="3.5" fill="#f8fafc" stroke="#64748b" strokeWidth="0.5" rx="0.5" />
          {/* Printer Body */}
          <rect x="0" y="2.5" width="32" height="15" rx="3" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
          {/* Front Tray Slot */}
          <rect x="4" y="10.5" width="24" height="5" rx="1.5" fill="#0f172a" stroke="#475569" strokeWidth="0.6" />
          {/* LCD Status Screen */}
          <rect x="4" y="4.5" width="10" height="4" rx="0.8" fill={hasCritical ? '#ef4444' : hasWarning ? '#f59e0b' : '#00bceb'} opacity="0.9" />
          {/* Power / Ready LED */}
          <circle cx="27" cy="6.5" r="1.4" fill={hasCritical ? '#ef4444' : hasWarning ? '#f59e0b' : '#10b981'} />
        </g>
      );
    }

    // Default: Sleek Modern Desktop Workstation (Monitor + Slim Tower)
    return (
      <g transform="translate(-15, -16)">
        {/* Monitor Frame */}
        <rect x="0" y="0" width="26" height="16" rx="2" fill="#0f172a" stroke="#475569" strokeWidth="1" />
        {/* Screen Display */}
        <rect x="1.5" y="1.5" width="23" height="13" rx="1" fill={hasCritical ? '#3b0707' : hasWarning ? '#331804' : '#031f38'} />
        {/* Terminal / OS desktop graphics */}
        <line x1="4" y1="4.5" x2="16" y2="4.5" stroke={hasCritical ? '#ef4444' : hasWarning ? '#f59e0b' : '#38bdf8'} strokeWidth="1" strokeLinecap="round" />
        <line x1="4" y1="8" x2="12" y2="8" stroke={hasCritical ? '#ef4444' : hasWarning ? '#f59e0b' : '#38bdf8'} strokeWidth="1" strokeLinecap="round" />
        <line x1="4" y1="11.5" x2="18" y2="11.5" stroke={hasCritical ? '#ef4444' : hasWarning ? '#f59e0b' : '#38bdf8'} strokeWidth="1" strokeLinecap="round" />
        {/* Monitor Neck & Base */}
        <rect x="11.5" y="16" width="3" height="2" fill="#64748b" />
        <rect x="8" y="17.5" width="10" height="1.5" rx="0.5" fill="#475569" />
        {/* Mini Tower on Right */}
        <rect x="27.5" y="4" width="4.5" height="15" rx="1" fill="#1e293b" stroke="#64748b" strokeWidth="0.7" />
        <circle cx="29.7" cy="6.5" r="0.8" fill={hasCritical ? '#ef4444' : '#10b981'} />
      </g>
    );
  };

  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${isDragging ? 1.1 : 1})`}
      className={`pt-device-group ${isSelected ? 'selected' : ''} ${hasCritical ? 'has-critical' : ''} ${hasWarning ? 'has-warning' : ''}`}
      onPointerDown={(e) => {
        if (isBuilderMode && onPointerDown) {
          e.stopPropagation();
          onPointerDown(e, device);
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(device);
      }}
      style={{ 
        cursor: isBuilderMode ? 'grab' : 'pointer',
        touchAction: 'none',
        transition: isDragging ? 'none' : 'transform 0.15s ease-out'
      }}
    >
      {/* Clash of Clans Style Building Footprint (Active when dragging or selected in builder mode) */}
      {(isDragging || (isBuilderMode && isSelected)) && (
        <g>
          <rect
            x={-halfW - 5}
            y={-halfH - 5}
            width={boxWidth + 10}
            height={boxHeight + 10}
            rx="12"
            fill="rgba(16, 185, 129, 0.22)"
            stroke="#10b981"
            strokeWidth="1.8"
            strokeDasharray="4 3"
          />
          {/* Grid target crosshairs */}
          <line x1={-halfW - 8} y1="0" x2={halfW + 8} y2="0" stroke="rgba(16, 185, 129, 0.5)" strokeWidth="0.8" strokeDasharray="2 2" />
          <line x1="0" y1={-halfH - 8} x2="0" y2={halfH + 8} stroke="rgba(16, 185, 129, 0.5)" strokeWidth="0.8" strokeDasharray="2 2" />
        </g>
      )}

      {/* Selection Halo / Glowing Frame in Normal Mode */}
      {!isBuilderMode && isSelected && (
        <rect
          x={-halfW - 3}
          y={-halfH - 3}
          width={boxWidth + 6}
          height={boxHeight + 6}
          rx="12"
          ry="12"
          fill="none"
          stroke="var(--cisco-blue)"
          strokeWidth="2"
          strokeDasharray="4 2"
          opacity="0.95"
        />
      )}

      {/* Desk Surface / Workstation Pad Base with Clash of Clans Physical Bevel */}
      <rect
        x={-halfW}
        y={-halfH}
        width={boxWidth}
        height={boxHeight}
        rx="9"
        ry="9"
        fill="var(--bg-surface)"
        stroke={
          isBuilderMode && isSelected
            ? '#10b981'
            : hasCritical 
              ? 'rgba(239, 68, 68, 0.7)' 
              : hasWarning 
                ? 'rgba(245, 158, 11, 0.6)' 
                : isSelected 
                  ? 'var(--cisco-blue)' 
                  : isBuilderMode 
                    ? 'rgba(0, 188, 235, 0.4)'
                    : 'var(--border-subtle)'
        }
        strokeWidth={isDragging || isSelected || hasCritical ? '1.8' : '1.2'}
        strokeDasharray={isBuilderMode && !isSelected ? '3 2' : 'none'}
        style={{
          filter: isDragging 
            ? 'drop-shadow(0 12px 16px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 10px rgba(16, 185, 129, 0.5))'
            : hasCritical 
              ? 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.4))' 
              : hasWarning 
                ? 'drop-shadow(0 0 5px rgba(245, 158, 11, 0.3))' 
                : 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.28))'
        }}
      />

      {/* Builder Mode Drag Grip Indicator */}
      {isBuilderMode && (
        <g transform={`translate(${halfW - 9}, ${-halfH + 9})`}>
          <circle cx="0" cy="0" r="4.5" fill="rgba(0, 188, 235, 0.2)" stroke="var(--cisco-blue)" strokeWidth="0.8" />
          <circle cx="-1.5" cy="-1.5" r="0.7" fill="var(--cisco-blue)" />
          <circle cx="1.5" cy="-1.5" r="0.7" fill="var(--cisco-blue)" />
          <circle cx="-1.5" cy="1.5" r="0.7" fill="var(--cisco-blue)" />
          <circle cx="1.5" cy="1.5" r="0.7" fill="var(--cisco-blue)" />
        </g>
      )}

      {/* Top Header Label Badge (Bench Code e.g. "B04", "L-02", "PRN-01") */}
      <g transform={`translate(0, ${-halfH + 7})`}>
        <rect
          x={-20}
          y={-5}
          width={40}
          height={9}
          rx="3"
          fill={hasCritical ? 'rgba(239, 68, 68, 0.15)' : hasWarning ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0, 188, 235, 0.12)'}
        />
        <text
          x="0"
          y="2"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '6.5px',
            fontWeight: 800,
            fill: hasCritical ? '#ef4444' : hasWarning ? '#f59e0b' : 'var(--cisco-blue)',
            textAnchor: 'middle',
            letterSpacing: '0.3px'
          }}
        >
          {shortTag}
        </text>
      </g>

      {/* Hardware Graphic Icon (Centered) */}
      <g transform="translate(0, 3)">
        {renderHardwareGraphic()}
      </g>

      {/* Glowing Link Status Beacon LED */}
      <g transform={`translate(${-halfW + 7}, ${-halfH + 7})`}>
        <circle
          cx="0"
          cy="0"
          r="2.5"
          fill={hasCritical ? '#ef4444' : hasWarning ? '#f59e0b' : '#10b981'}
        />
        <circle
          cx="0"
          cy="0"
          r="5"
          fill={hasCritical ? 'rgba(239, 68, 68, 0.3)' : hasWarning ? 'rgba(245, 158, 11, 0.25)' : 'rgba(16, 185, 129, 0.25)'}
          style={{ animation: hasCritical ? 'pulseGlow 1.2s infinite' : 'none' }}
        />
      </g>

      {/* Active Ticket Notification Badge */}
      {activeTicketsCount > 0 && (
        <g transform={`translate(${halfW - 5}, ${-halfH + 5})`}>
          <circle
            cx="0"
            cy="0"
            r="6"
            fill="#ef4444"
            style={{ filter: 'drop-shadow(0 0 4px #ef4444)' }}
          />
          <text
            x="0"
            y="2.5"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '6.5px',
              fontWeight: 800,
              fill: '#ffffff',
              textAnchor: 'middle'
            }}
          >
            {activeTicketsCount}
          </text>
        </g>
      )}

      {/* Bottom Sub-label (Hostname / Spec snippet) */}
      <text
        x="0"
        y={halfH - 4}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '5.5px',
          fontWeight: 600,
          fill: 'var(--text-dim)',
          textAnchor: 'middle',
          letterSpacing: '0.2px'
        }}
      >
        {code}
      </text>
    </g>
  );
}
