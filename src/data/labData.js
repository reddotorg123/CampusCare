// CampusCare IT AMC & Service Management Platform
// Baseline Institutional Data Model matching the 10 UI Screens

export const INITIAL_SCHOOLS = [
  {
    id: 'sch-velammal',
    name: 'Velammal Matric Hr Sec School',
    type: 'school',
    code: 'VMHS',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'Velammal Nagar, Ambattur Red Hills Road, Surapet, Chennai - 600066',
    contactPerson: 'Mr. Arun Kumar (Lab Staff)',
    phone: '+91 94440 12345',
    email: 'itlab@velammal.edu.in',
    labsCount: 4,
    systemsCount: 120,
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&auto=format&fit=crop&q=80',
    labs: [
      { id: 'lab-velammal-main', name: 'Computer Lab - Main Lab', code: 'LAB-01', room: 'Room 101', capacity: 20 },
      { id: 'lab-velammal-2', name: 'Computer Lab 2', code: 'LAB-02', room: 'Room 102', capacity: 30 },
      { id: 'lab-velammal-lang', name: 'Language Lab', code: 'LAB-03', room: 'Room 204', capacity: 35 },
      { id: 'lab-velammal-robotics', name: 'Robotics & STEM Lab', code: 'LAB-04', room: 'Room 301', capacity: 35 }
    ]
  },
  {
    id: 'sch-srividhya',
    name: 'Sri Vidhya Matric School',
    type: 'school',
    code: 'SVMS',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'Gandhi Road, Tambaram, Chennai - 600045',
    contactPerson: 'Mrs. Shanthi S.',
    phone: '+91 94440 23456',
    email: 'admin@srividhya.edu.in',
    labsCount: 3,
    systemsCount: 75,
    imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=200&auto=format&fit=crop&q=80',
    labs: [
      { id: 'lab-svms-1', name: 'Junior Computer Lab', code: 'LAB-01', room: 'Room 105', capacity: 25 },
      { id: 'lab-svms-2', name: 'Senior Computer Lab', code: 'LAB-02', room: 'Room 205', capacity: 30 },
      { id: 'lab-svms-3', name: 'Staff Workstation Bay', code: 'LAB-03', room: 'Room 302', capacity: 20 }
    ]
  },
  {
    id: 'sch-greenwood',
    name: 'Greenwood International School',
    type: 'school',
    code: 'GWIS',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'East Coast Road, Palavakkam, Chennai - 600041',
    contactPerson: 'Dr. K. Balaji',
    phone: '+91 94440 34567',
    email: 'itdirector@greenwood.org',
    labsCount: 5,
    systemsCount: 160,
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&auto=format&fit=crop&q=80',
    labs: [
      { id: 'lab-gwis-1', name: 'Primary Tech Lab', code: 'LAB-01', room: 'Room 101', capacity: 30 },
      { id: 'lab-gwis-2', name: 'High School Programming Lab', code: 'LAB-02', room: 'Room 201', capacity: 40 },
      { id: 'lab-gwis-3', name: 'AI & Machine Learning Studio', code: 'LAB-03', room: 'Room 202', capacity: 30 },
      { id: 'lab-gwis-4', name: 'Multimedia & CAD Suite', code: 'LAB-04', room: 'Room 305', capacity: 30 },
      { id: 'lab-gwis-5', name: 'Exam & Assessment Lab', code: 'LAB-05', room: 'Room 306', capacity: 30 }
    ]
  },
  {
    id: 'sch-stmarys',
    name: "St. Mary's College",
    type: 'college',
    code: 'SMC',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'College Road, Nungambakkam, Chennai - 600034',
    contactPerson: 'Prof. D. Thomas',
    phone: '+91 94440 45678',
    email: 'systems@stmaryscollege.edu',
    labsCount: 6,
    systemsCount: 210,
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&auto=format&fit=crop&q=80',
    labs: [
      { id: 'lab-smc-1', name: 'MCA Cloud Computing Lab', code: 'LAB-01', room: 'Block C-101', capacity: 40 },
      { id: 'lab-smc-2', name: 'B.Sc Data Science Lab', code: 'LAB-02', room: 'Block C-102', capacity: 40 },
      { id: 'lab-smc-3', name: 'B.Tech Networking Center', code: 'LAB-03', room: 'Block C-201', capacity: 35 }
    ]
  },
  {
    id: 'sch-excel',
    name: 'Excel Engineering College',
    type: 'college',
    code: 'EEC',
    city: 'Komarapalayam',
    state: 'Tamil Nadu',
    address: 'NH-544 Salem Main Road, Pallakapalayam, Komarapalayam - 637303',
    contactPerson: 'Dr. R. Murugan',
    phone: '+91 94440 56789',
    email: 'campus-it@excelengg.ac.in',
    labsCount: 8,
    systemsCount: 320,
    imageUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=80',
    labs: [
      { id: 'lab-eec-1', name: 'Central Computing Facility (CCF-1)', code: 'CCF-01', room: 'Tech Park Floor 1', capacity: 60 },
      { id: 'lab-eec-2', name: 'Cybersecurity Lab', code: 'CS-01', room: 'Tech Park Floor 2', capacity: 50 }
    ]
  }
];

// Generate 20 PCs in 4 rows x 5 columns for Velammal Main Computer Lab
export function getVelammalMainLabDevices() {
  const devices = [];
  const rows = 4;
  const cols = 5;
  const startX = 40;
  const startY = 70;
  const colSpacing = 68;
  const rowSpacing = 82;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const num = r * cols + c + 1;
      const numStr = String(num).padStart(2, '0');
      const code = `PC-${numStr}`;
      const assetCode = `VMHS-PC-0${numStr}`;
      
      let status = 'working';
      if (code === 'PC-07') status = 'warning'; // Issue reported / Warning
      if (code === 'PC-03') status = 'issue_reported'; // Red issue
      if (code === 'PC-12') status = 'under_service'; // Blue under service

      devices.push({
        id: `dev-pc-${numStr}`,
        name: code,
        code: code,
        assetCode: assetCode,
        status: status,
        type: 'pc',
        row: r + 1,
        col: c + 1,
        bench: `Row ${r + 1} - Position ${c + 1}`,
        coords: {
          x: startX + c * colSpacing,
          y: startY + r * rowSpacing
        },
        makeModel: 'Dell OptiPlex 3080',
        processor: 'Intel Core i5 (10th Gen)',
        ram: '8 GB',
        storage: '256 GB SSD',
        os: 'Windows 11 Pro',
        ip: `192.168.1.${100 + num}`,
        mac: `3C:52:82:1A:9F:${numStr}`,
        monitor: 'Dell 21.5"',
        peripherals: 'Keyboard, Mouse',
        ups: 'Central Lab Online UPS',
        switchPort: `SW-01/Gi0/${num}`,
        networkPort: `D-${numStr}`,
        location: `Main Lab - Row ${r + 1}`,
        warranty: 'Expired',
        amcStatus: 'Active',
        photos: [
          'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=300&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&auto=format&fit=crop&q=80'
        ],
        serviceHistory: [
          { date: '12 Aug 2026', action: 'Monitor replaced', technician: 'Karthik V.' },
          { date: '03 Jun 2026', action: 'OS reinstalled', technician: 'Karthik V.' },
          { date: '12 Jan 2026', action: 'Preventive maintenance', technician: 'Karthik V.' }
        ]
      });
    }
  }

  return devices;
}

export const INITIAL_TICKETS = [
  {
    id: 'tkt-1024',
    ticketNumber: '#TKT-1024',
    schoolId: 'sch-velammal',
    schoolName: 'Velammal Matric Hr Sec School',
    labId: 'lab-velammal-main',
    labName: 'Main Lab',
    systemId: 'dev-pc-07',
    systemName: 'PC-07',
    title: 'Monitor not working',
    problem: 'Monitor not working',
    description: 'Monitor shows no display. Power light is on.',
    priority: 'high',
    status: 'in_progress', // 'created', 'assigned', 'acknowledged', 'in_progress', 'resolved', 'closed'
    category: 'Hardware Issue',
    subCategory: 'Monitor Not Working',
    reportedBy: 'Mr. Arun (Lab Staff)',
    reporterPhone: '+91 94440 12345',
    assignedTo: 'Karthik V.',
    assignedToRole: 'Hardware Specialist',
    createdAt: '15 Sep 2025, 10:24 AM',
    relativeTime: '2h ago',
    attachments: [
      { name: 'image1.jpg', url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&auto=format&fit=crop&q=80' }
    ],
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
    ],
    checklist: [
      { id: 1, text: 'Check power supply', checked: true },
      { id: 2, text: 'Check monitor and cable', checked: true },
      { id: 3, text: 'Test with another monitor', checked: false },
      { id: 4, text: 'Check GPU / onboard display', checked: false },
      { id: 5, text: 'Replace cable if required', checked: false }
    ]
  },
  {
    id: 'tkt-1023',
    ticketNumber: '#TKT-1023',
    schoolId: 'sch-velammal',
    schoolName: 'Velammal Matric Hr Sec School',
    labId: 'lab-velammal-main',
    labName: 'Lab 2',
    systemId: 'dev-pc-12',
    systemName: 'PC-12',
    title: 'Monitor not working',
    problem: 'Monitor not working',
    description: 'Display flickers intermittently when moving VGA cable.',
    priority: 'medium',
    status: 'in_progress',
    category: 'Hardware Issue',
    subCategory: 'Display Flickering',
    reportedBy: 'Mr. Arun (Lab Staff)',
    reporterPhone: '+91 94440 12345',
    assignedTo: 'Karthik V.',
    assignedToRole: 'Hardware Specialist',
    createdAt: '15 Sep 2025, 08:30 AM',
    relativeTime: '4h ago',
    attachments: [],
    timeline: [
      { status: 'created', title: 'Ticket Created', by: 'Mr. Arun (Lab Staff)', date: '15 Sep 2025, 08:30 AM', done: true },
      { status: 'in_progress', title: 'In Progress', by: 'Karthik V.', date: '15 Sep 2025, 09:15 AM', done: true }
    ],
    communications: [],
    checklist: []
  },
  {
    id: 'tkt-1022',
    ticketNumber: '#TKT-1022',
    schoolId: 'sch-velammal',
    schoolName: 'Velammal Matric Hr Sec School',
    labId: 'lab-velammal-2',
    labName: 'Computer Lab A',
    systemId: null,
    systemName: 'Lab Wide',
    title: 'Software installation',
    problem: 'Software installation',
    description: 'Need Python 3.12 and VS Code installed across Lab 2 workstations.',
    priority: 'low',
    status: 'created',
    category: 'Software Issue',
    subCategory: 'Application Installation',
    reportedBy: 'Mrs. Priya (Lab Staff)',
    reporterPhone: '+91 94440 98765',
    assignedTo: 'Unassigned',
    assignedToRole: '',
    createdAt: '14 Sep 2025, 10:00 AM',
    relativeTime: '1d ago',
    attachments: [],
    timeline: [
      { status: 'created', title: 'Ticket Created', by: 'Mrs. Priya', date: '14 Sep 2025, 10:00 AM', done: true }
    ],
    communications: [],
    checklist: []
  }
];

export const INITIAL_ENGINEERS = [
  {
    id: 'eng-karthik',
    name: 'Karthik V.',
    role: 'Senior Hardware Specialist',
    phone: '+91 98401 23456',
    email: 'karthik.tech@campuscare.in',
    activeJobs: 3,
    completedToday: 7,
    status: 'on_site'
  }
];

export const LAB_LAYOUT_PRESETS = [
  { id: 'grid_4x5', name: '4x5 Standard Classroom Grid (20 PCs)' },
  { id: 'u_shape', name: 'Perimeter U-Shape (24 PCs)' },
  { id: 'dual_bank', name: 'Dual-Bank Central Aisle (30 PCs)' }
];
