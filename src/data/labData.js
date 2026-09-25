// CampusCare IT AMC & Service Management Platform
// Clean Data Models & Institutional Constants (Zero Fake / Demo Data)

export const INITIAL_SCHOOLS = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    name: 'Velammal Matric Hr Sec School',
    type: 'school',
    code: 'VMHS',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'Mogappair East, Chennai - 600037',
    contactPerson: 'Mr. Arun',
    phone: '+91 94440 12345',
    email: 'arun.lab@velammal.edu.in',
    labsCount: 2,
    systemsCount: 45,
    leadEngineer: 'Karthik V.',
    contractTier: 'Comprehensive AMC',
    accentColor: '#10b981',
    labs: [
      {
        id: '40000000-0000-0000-0000-000000000001',
        schoolId: '10000000-0000-0000-0000-000000000001',
        name: 'Main Computer Lab',
        code: 'LAB-01',
        room: 'Room 101, Block A',
        capacity: 20,
        inCharge: 'Mr. Arun',
        phone: '+91 94440 12345',
        network: 'Gigabit Ethernet Cat6 with Managed Switch',
        ups: '10kVA Online Central UPS (30 min backup)',
        operatingHours: '8:30 AM - 4:30 PM (Mon - Fri)',
        notes: 'Primary lab for Higher Secondary CS and practical sessions.'
      },
      {
        id: '40000000-0000-0000-0000-000000000002',
        schoolId: '10000000-0000-0000-0000-000000000001',
        name: 'AI & Robotics Lab',
        code: 'LAB-02',
        room: 'Block B-204',
        capacity: 25,
        inCharge: 'Mr. Arun',
        phone: '+91 94440 12345',
        network: 'Gigabit Wi-Fi 6 + Cat6 LAN',
        ups: '15kVA Online Central UPS',
        operatingHours: '9:00 AM - 5:00 PM (Mon - Sat)',
        notes: 'Equipped with Nvidia RTX workstations and IoT kits.'
      }
    ]
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    name: 'Excel Engineering College',
    type: 'college',
    code: 'EEC',
    city: 'Komarapalayam',
    state: 'Tamil Nadu',
    address: 'NH-544 Salem Main Road, Pallakapalayam - 637303',
    contactPerson: 'Dr. R. Murugan',
    phone: '+91 94440 56789',
    email: 'campus-it@excelengg.ac.in',
    labsCount: 1,
    systemsCount: 30,
    leadEngineer: 'Karthik V.',
    contractTier: 'Comprehensive AMC',
    accentColor: '#3b82f6',
    labs: [
      {
        id: '40000000-0000-0000-0000-000000000003',
        schoolId: '10000000-0000-0000-0000-000000000002',
        name: 'Central Computing Facility (CCF)',
        code: 'CCF-01',
        room: 'Tech Park Floor 1',
        capacity: 30,
        inCharge: 'Dr. R. Murugan',
        phone: '+91 94440 56789',
        network: '10-Gigabit Optical Fiber Backbone',
        ups: '30kVA Redundant UPS',
        operatingHours: '8:00 AM - 8:00 PM',
        notes: 'Central campus server room and coding facility.'
      }
    ]
  }
];

export const INITIAL_TICKETS = [
  {
    id: 'tkt-1024',
    ticketNumber: '#TKT-1024',
    schoolId: '10000000-0000-0000-0000-000000000001',
    schoolName: 'Velammal Matric Hr Sec School',
    labId: '40000000-0000-0000-0000-000000000001',
    labName: 'Main Computer Lab',
    systemId: 'dev-pc-07',
    systemName: 'PC-07',
    title: 'Monitor no display',
    problem: 'Monitor shows no display. Power LED is solid orange.',
    description: 'Monitor has no video signal. VGA cable checked but issue persists.',
    category: 'hardware',
    priority: 'high',
    status: 'in_progress',
    createdAt: 'Today, 10:24 AM',
    reportedBy: 'Mr. Arun',
    assignedTo: 'Karthik V.',
    attachments: [],
    timeline: [
      { status: 'created', title: 'Ticket Raised', by: 'Mr. Arun', date: '10:24 AM', done: true },
      { status: 'in_progress', title: 'Assigned to Technician', by: 'Karthik V.', date: '11:00 AM', done: true }
    ],
    checklist: [
      { id: 1, text: 'Check power cable and switch', checked: true },
      { id: 2, text: 'Inspect HDMI/VGA cable connection', checked: true },
      { id: 3, text: 'Test with spare monitor', checked: false },
      { id: 4, text: 'Check RAM/GPU seating on motherboard', checked: false }
    ]
  },
  {
    id: 'tkt-1023',
    ticketNumber: '#TKT-1023',
    schoolId: '10000000-0000-0000-0000-000000000001',
    schoolName: 'Velammal Matric Hr Sec School',
    labId: '40000000-0000-0000-0000-000000000001',
    labName: 'Main Computer Lab',
    systemId: 'dev-pc-12',
    systemName: 'PC-12',
    title: 'Intermittent LAN disconnection',
    problem: 'System randomly drops network connection during lab tests.',
    description: 'RJ45 clip appears loose. Port flickers amber and loses IP lease.',
    category: 'network',
    priority: 'medium',
    status: 'in_progress',
    createdAt: 'Today, 09:15 AM',
    reportedBy: 'Mr. Arun',
    assignedTo: 'Karthik V.',
    attachments: [],
    timeline: [
      { status: 'created', title: 'Ticket Raised', by: 'Mr. Arun', date: '09:15 AM', done: true },
      { status: 'in_progress', title: 'In Progress', by: 'Karthik V.', date: '10:00 AM', done: true }
    ],
    checklist: [
      { id: 1, text: 'Crimping new RJ45 connector', checked: true },
      { id: 2, text: 'Cable continuity tester check', checked: false },
      { id: 3, text: 'Verify switch port Gi0/12', checked: false }
    ]
  },
  {
    id: 'tkt-1022',
    ticketNumber: '#TKT-1022',
    schoolId: '10000000-0000-0000-0000-000000000001',
    schoolName: 'Velammal Matric Hr Sec School',
    labId: '40000000-0000-0000-0000-000000000002',
    labName: 'AI & Robotics Lab',
    systemId: null,
    systemName: 'Lab Wide',
    title: 'Python 3.12 & OpenCV setup needed',
    problem: 'Install updated Python environment and dependencies for computer vision projects.',
    description: 'All 25 machines need Python 3.12, VS Code, OpenCV, and Jupyter Notebook configured.',
    category: 'software',
    priority: 'medium',
    status: 'open',
    createdAt: 'Yesterday, 04:30 PM',
    reportedBy: 'Mr. Arun',
    assignedTo: null,
    attachments: [],
    timeline: [
      { status: 'created', title: 'Ticket Raised', by: 'Mr. Arun', date: 'Yesterday, 04:30 PM', done: true }
    ],
    checklist: []
  }
];

export const INITIAL_ENGINEERS = [
  {
    id: '20000000-0000-0000-0000-000000000002',
    name: 'Karthik V.',
    role: 'Senior Hardware Engineer',
    phone: '+91 98401 23456',
    email: 'karthik.tech@campuscare.in',
    activeJobs: 2,
    completedToday: 5,
    status: 'on_site'
  }
];

export const ISSUE_PRESETS = {
  pc: [
    { id: 'no_display', label: 'Monitor No Display', icon: 'monitor', category: 'hardware', priority: 'high' },
    { id: 'blue_screen', label: 'Blue Screen (BSOD)', icon: 'alert-triangle', category: 'software', priority: 'high' },
    { id: 'no_boot', label: 'System Won\'t Power On', icon: 'power', category: 'hardware', priority: 'urgent' },
    { id: 'slow_performance', label: 'Extremely Slow / Freezing', icon: 'clock', category: 'software', priority: 'medium' },
    { id: 'network_down', label: 'No Internet / LAN Disconnected', icon: 'wifi-off', category: 'network', priority: 'medium' },
    { id: 'mouse_keyboard', label: 'Keyboard or Mouse Unresponsive', icon: 'mouse', category: 'peripherals', priority: 'low' }
  ],
  printer: [
    { id: 'paper_jam', label: 'Paper Jam', icon: 'file-text', category: 'hardware', priority: 'medium' },
    { id: 'toner_low', label: 'Toner Empty / Low', icon: 'droplet', category: 'consumables', priority: 'medium' },
    { id: 'print_spooler', label: 'Print Spooler Error', icon: 'alert-circle', category: 'software', priority: 'low' },
    { id: 'printer_offline', label: 'Printer Offline / Network Fail', icon: 'wifi-off', category: 'network', priority: 'high' }
  ]
};

export const ROOM_ARRANGEMENTS = [
  { id: 'grid_4x5', name: '4x5 Standard Classroom Grid (20 PCs)', icon: 'Grid' },
  { id: 'u_shape', name: 'Perimeter U-Shape (24 PCs)', icon: 'Square' },
  { id: 'dual_bank', name: 'Dual-Bank Central Aisle (30 PCs)', icon: 'Columns' }
];

export const LAB_LAYOUT_PRESETS = [
  { id: 'grid_4x5', name: '4x5 Standard Classroom Grid (20 PCs)' },
  { id: 'u_shape', name: 'Perimeter U-Shape (24 PCs)' },
  { id: 'dual_bank', name: 'Dual-Bank Central Aisle (30 PCs)' }
];

export function generateInitialLabDevices(count = 20, schoolCode = 'PC') {
  const devices = [];
  const cols = 5;
  for (let i = 1; i <= count; i++) {
    const numStr = String(i).padStart(2, '0');
    const code = `PC-${numStr}`;
    const r = Math.floor((i - 1) / cols);
    const c = (i - 1) % cols;
    devices.push({
      id: `dev-pc-${numStr}`,
      name: code,
      code: code,
      assetCode: `${schoolCode}-PC-0${numStr}`,
      status: 'working',
      type: 'pc',
      coords: {
        x: 35 + (c * 66),
        y: 60 + (r * 78)
      },
      width: 52,
      height: 44,
      makeModel: 'Standard Lab Workstation',
      processor: 'Intel Core i5',
      ram: '8 GB',
      storage: '256 GB SSD',
      os: 'Windows 11 Pro',
      ip: `192.168.1.${100 + i}`
    });
  }

  devices.push({
    id: 'element-teacher-desk',
    type: 'teacher_desk',
    name: "Teacher's Desk",
    code: 'TEACHER',
    coords: { x: 300, y: 350 },
    width: 86,
    height: 44
  });

  devices.push({
    id: 'element-main-entrance',
    type: 'entrance',
    name: 'Main Entrance',
    code: 'ENTRANCE',
    coords: { x: 10, y: 360 },
    width: 68,
    height: 28
  });

  return devices;
}

