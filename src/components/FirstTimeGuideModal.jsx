import React, { useState } from 'react';
import { Building2, Monitor, Shield, CheckCircle2, ArrowRight, ArrowLeft, X } from 'lucide-react';

export function FirstTimeGuideModal({ onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 4;

  const slides = [
    {
      icon: <Building2 size={36} color="#2563eb" />,
      badge: 'CAMPUSCARE PLATFORM',
      title: 'Welcome to CampusCare',
      subtitle: 'IT Asset, Lab Mapping & AMC Service Management',
      content: 'Designed specifically for educational institutions, school lab assistants, and AMC hardware engineers. CampusCare bridges physical computer lab infrastructure with live diagnostic tracking.'
    },
    {
      icon: <Monitor size={36} color="#16a34a" />,
      badge: 'PHYSICAL FLOORPLAN',
      title: 'Visual 2D Physical Lab Map',
      subtitle: 'Real-time Workstation Health Badges',
      content: 'Monitor physical computer desks on the lab floorplan in real time with hardware state indicators:',
      legend: [
        { color: '#16a34a', text: 'Operational (Student Ready)' },
        { color: '#dc2626', text: 'Issue Reported (Critical BSOD)' },
        { color: '#d97706', text: 'Maintenance Due' },
        { color: '#2563eb', text: 'Under Service / Diagnostic' }
      ]
    },
    {
      icon: <Shield size={36} color="#d97706" />,
      badge: 'ROLE-BASED PERMISSIONS',
      title: 'Strict Role-Based Access Control',
      subtitle: 'Tailored Consoles for Every User Category',
      roles: [
        { icon: '🏫', role: 'School Staff', desc: 'Inspect own labs, report faulty PCs, track incident SLA' },
        { icon: '🛠️', role: 'Technicians', desc: 'Follow hardware diagnosis checklists & minidump tests' },
        { icon: '👑', role: 'Org Admin', desc: 'Multi-school contracts & 2D drag-and-drop map designer' }
      ]
    },
    {
      icon: <CheckCircle2 size={36} color="#16a34a" />,
      badge: 'CROSS-PLATFORM READY',
      title: 'You Are All Set!',
      subtitle: 'Optimized for iPhone, Android, Tablet & Desktop',
      content: 'CampusCare is optimized for your iPhone 7, iPads, and desktop computers. You can re-open this guide anytime via the ❓ Guide button in the top header.'
    }
  ];

  const slide = slides[currentSlide];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.82)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        maxWidth: '440px',
        width: '100%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
      }}>
        {/* Header bar with step counter and skip */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px 10px 20px',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <span style={{
            fontSize: '11px',
            fontWeight: '700',
            color: '#2563eb',
            background: '#eff6ff',
            padding: '3px 8px',
            borderRadius: '12px'
          }}>
            STEP {currentSlide + 1} OF {totalSlides}
          </span>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Skip Guide <X size={14} />
          </button>
        </div>

        {/* Slide Content */}
        <div style={{ padding: '24px 20px', textAlign: 'center', minHeight: '260px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
            border: '1px solid #e2e8f0'
          }}>
            {slide.icon}
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
            {slide.title}
          </h3>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#2563eb', marginBottom: '12px' }}>
            {slide.subtitle}
          </div>

          {slide.content && (
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', margin: 0, maxWidth: '380px' }}>
              {slide.content}
            </p>
          )}

          {slide.legend && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%', marginTop: '10px', textAlign: 'left' }}>
              {slide.legend.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#334155' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          )}

          {slide.roles && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginTop: '8px', textAlign: 'left' }}>
              {slide.roles.map((r, idx) => (
                <div key={idx} style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }}>
                  <span style={{ fontWeight: '700', color: '#0f2942' }}>{r.icon} {r.role}: </span>
                  <span style={{ color: '#475569' }}>{r.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer controls with Dots and Next */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 20px',
          borderTop: '1px solid #f1f5f9',
          background: '#fafafa'
        }}>
          {/* Indicator dots */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {Array.from({ length: totalSlides }).map((_, i) => (
              <div 
                key={i} 
                style={{
                  width: currentSlide === i ? '20px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: currentSlide === i ? '#2563eb' : '#cbd5e1',
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {currentSlide > 0 && (
              <button
                onClick={() => setCurrentSlide(c => c - 1)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#334155',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
            )}

            <button
              onClick={() => {
                if (currentSlide < totalSlides - 1) {
                  setCurrentSlide(c => c + 1);
                } else {
                  onClose();
                }
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: currentSlide === totalSlides - 1 ? '#16a34a' : '#0f2942',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {currentSlide === totalSlides - 1 ? 'Get Started 🚀' : 'Next'}
              {currentSlide < totalSlides - 1 && <ArrowRight size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
