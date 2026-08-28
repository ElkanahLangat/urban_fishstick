/**
 * Comprehensive Nairobi Routes, SACCOs, Matatus, Stages, and Safety Hazard Database
 */

export interface Stage {
  id: string;
  name: string;
  shengName: string;
  lat: number;
  lng: number;
  type: 'cbd_hub' | 'suburb_terminal' | 'waypoint';
  zone: string;
  safetyLevel: 'high' | 'moderate' | 'caution';
  safetyTip: string;
}

export interface MatatuVehicle {
  id: string;
  name: string; // e.g. "Matrix", "Super Metro Express", "Black Hawk"
  sacco: string; // e.g. "Super Metro", "Rongai Pride", "Embassava", "Umoinner"
  routeNumber: string; // e.g. "Route 105", "Route 125", "Route 33"
  routeOrigin: string;
  routeDestination: string;
  plate: string;
  conductorName: string;
  conductorPhone: string;
  driverName: string;
  capacity: number; // 14, 33, or 52
  availableSeats: number;
  totalSeats: number;
  fareKes: number;
  departureTime: string; // e.g. "18:15"
  departureMinutesLeft: number;
  currentStageId: string;
  currentLat: number;
  currentLng: number;
  speedKmh: number;
  headingDeg: number;
  amenities: string[]; // ["Free WiFi", "Bumping Sound", "Screens", "Quiet / Executive", "CCTV"]
  vibe: string;
  status: 'boarding' | 'departed' | 'on_route' | 'arriving';
  colorHex: string;
}

export interface NairobiRoute {
  id: string;
  number: string;
  name: string;
  sacco: string;
  origin: string;
  destination: string;
  baseFare: number;
  travelTimeEstMinutes: number;
  corridor: string;
  jamLevel: 'low' | 'moderate' | 'heavy';
  stages: Stage[];
  pathCoordinates: [number, number][]; // [lat, lng] array
}

export interface HazardZone {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  riskType: 'pickpocket' | 'dark_crossing' | 'speed_traffic' | 'flood_zone' | 'touting_scramble';
  riskLevel: 'caution' | 'moderate' | 'high';
  shengWarning: string;
  englishAdvice: string;
  safeAlternative: string;
  peakDangerHours: string;
}

// Key Nairobi Stages with realistic GPS
export const NAIROBI_STAGES: Stage[] = [
  {
    id: 'kencom',
    name: 'Kencom House (CBD)',
    shengName: 'Kencom Stage / Super Metro Base',
    lat: -1.2858,
    lng: 36.8242,
    type: 'cbd_hub',
    zone: 'CBD Center',
    safetyLevel: 'high',
    safetyTip: 'Well-lit area with security guards. Ideal for peaceful boarding to Kikuyu, Ngong, & Westlands.'
  },
  {
    id: 'odeon',
    name: 'Odeon Cinema / Tom Mboya',
    shengName: 'Odeon / Latema Base',
    lat: -1.2831,
    lng: 36.8245,
    type: 'cbd_hub',
    zone: 'CBD North',
    safetyLevel: 'moderate',
    safetyTip: 'Busy pedestrian flow. Keep backpacks in front and secure phones while waiting.'
  },
  {
    id: 'railways',
    name: 'Railways Bus Station',
    shengName: 'Relwe / Haile Selassie',
    lat: -1.2898,
    lng: 36.8277,
    type: 'cbd_hub',
    zone: 'CBD South',
    safetyLevel: 'moderate',
    safetyTip: 'Major terminal for Ngong Rd, Rongai & Langata. Watch your pockets during 6 PM rush.'
  },
  {
    id: 'ambassadeur',
    name: 'Ambassadeur Bus Stop (Moi Avenue)',
    shengName: 'Amba / Githurai Base',
    lat: -1.2847,
    lng: 36.8256,
    type: 'cbd_hub',
    zone: 'CBD East',
    safetyLevel: 'moderate',
    safetyTip: 'Main stage for Thika Rd & Githurai 44/45. Board via designated queued lanes.'
  },
  {
    id: 'koja',
    name: 'Koja Mosque / Khoja Stage',
    shengName: 'Koja Roundi / Waiyaki Base',
    lat: -1.2811,
    lng: 36.8222,
    type: 'cbd_hub',
    zone: 'CBD North-West',
    safetyLevel: 'moderate',
    safetyTip: 'High traffic junction. Always use designated crossing signals; do not dash across lanes.'
  },
  {
    id: 'westlands',
    name: 'Westlands / Sarit Centre',
    shengName: 'Westy / Sankara Stage',
    lat: -1.2638,
    lng: 36.8028,
    type: 'suburb_terminal',
    zone: 'Westlands',
    safetyLevel: 'high',
    safetyTip: 'Safe, lively business district. Great pickup for office workers commuting up Waiyaki Way.'
  },
  {
    id: 'upperhill',
    name: 'Upper Hill (Mara / Ragati Rd)',
    shengName: 'Apahi / Corporate Corner',
    lat: -1.2965,
    lng: 36.8157,
    type: 'suburb_terminal',
    zone: 'Upper Hill',
    safetyLevel: 'high',
    safetyTip: 'Corporate hub. Fast pickups without having to hike down into CBD gridlock.'
  },
  {
    id: 'kikuyu',
    name: 'Kikuyu Town Terminal',
    shengName: 'Kikuyu / Waiyaki End',
    lat: -1.2464,
    lng: 36.6631,
    type: 'suburb_terminal',
    zone: 'Waiyaki West',
    safetyLevel: 'high',
    safetyTip: 'Calm suburban terminal with organized SACCO operations.'
  },
  {
    id: 'rongai',
    name: 'Ongata Rongai (Maasai Mall)',
    shengName: 'Ron-ga-ga / Diaspo Base',
    lat: -1.3965,
    lng: 36.7592,
    type: 'suburb_terminal',
    zone: 'Magadi Road',
    safetyLevel: 'moderate',
    safetyTip: 'Magadi Rd rush hours can be slow; booking ahead locks express bypass lanes.'
  },
  {
    id: 'githurai45',
    name: 'Githurai 45 / Thika Superhighway',
    shengName: 'Githu 45 / Kasarani Border',
    lat: -1.1996,
    lng: 36.9248,
    type: 'suburb_terminal',
    zone: 'Thika Corridor',
    safetyLevel: 'moderate',
    safetyTip: 'Always use the elevated footbridge to cross the 8-lane expressway. Never jaywalk.'
  },
  {
    id: 'embakasi',
    name: 'Embakasi Village / Pipeline',
    shengName: 'Emba / Pipeline Roundi',
    lat: -1.3094,
    lng: 36.9077,
    type: 'suburb_terminal',
    zone: 'Eastlands South',
    safetyLevel: 'moderate',
    safetyTip: 'High density stage. Keep belongings zipped when alighting at Outering roundabouts.'
  },
  {
    id: 'buruburu',
    name: 'Buru Buru Shopping Centre',
    shengName: 'Buru Phase 4 Stage',
    lat: -1.2878,
    lng: 36.8795,
    type: 'suburb_terminal',
    zone: 'Eastlands Central',
    safetyLevel: 'high',
    safetyTip: 'Home of iconic Nganya art culture. Safe, established SACCO stops.'
  }
];

// Nairobi Routes with path geometries
export const NAIROBI_ROUTES: NairobiRoute[] = [
  {
    id: 'route-105-kikuyu',
    number: 'Route 105',
    name: 'CBD (Kencom) ➔ Westlands ➔ Kikuyu (Waiyaki Way)',
    sacco: 'Super Metro',
    origin: 'Kencom House (CBD)',
    destination: 'Kikuyu Town',
    baseFare: 70,
    travelTimeEstMinutes: 38,
    corridor: 'Waiyaki Way / Westlands',
    jamLevel: 'moderate',
    stages: [
      NAIROBI_STAGES[0], // Kencom
      NAIROBI_STAGES[5], // Westlands
      NAIROBI_STAGES[7]  // Kikuyu
    ],
    pathCoordinates: [
      [-1.2858, 36.8242],
      [-1.2811, 36.8222],
      [-1.2721, 36.8124],
      [-1.2638, 36.8028],
      [-1.2582, 36.7641],
      [-1.2514, 36.7025],
      [-1.2464, 36.6631]
    ]
  },
  {
    id: 'route-125-rongai',
    number: 'Route 125',
    name: 'CBD (Railways) ➔ Upper Hill ➔ Langata ➔ Ongata Rongai',
    sacco: 'Rongai Pride / Matrix',
    origin: 'Railways Bus Station',
    destination: 'Ongata Rongai (Maasai Mall)',
    baseFare: 100,
    travelTimeEstMinutes: 50,
    corridor: 'Langata Rd / Magadi Rd',
    jamLevel: 'heavy',
    stages: [
      NAIROBI_STAGES[2], // Railways
      NAIROBI_STAGES[6], // Upper Hill
      NAIROBI_STAGES[8]  // Rongai
    ],
    pathCoordinates: [
      [-1.2898, 36.8277],
      [-1.2965, 36.8157],
      [-1.3125, 36.8041],
      [-1.3412, 36.7654],
      [-1.3654, 36.7582],
      [-1.3965, 36.7592]
    ]
  },
  {
    id: 'route-44-githurai',
    number: 'Route 44',
    name: 'CBD (Ambassadeur) ➔ Ngara ➔ Kasarani ➔ Githurai 45',
    sacco: 'Super Metro / Zuri',
    origin: 'Ambassadeur Bus Stop',
    destination: 'Githurai 45',
    baseFare: 60,
    travelTimeEstMinutes: 32,
    corridor: 'Thika Superhighway',
    jamLevel: 'moderate',
    stages: [
      NAIROBI_STAGES[3], // Ambassadeur
      NAIROBI_STAGES[9]  // Githurai
    ],
    pathCoordinates: [
      [-1.2847, 36.8256],
      [-1.2764, 36.8312],
      [-1.2541, 36.8624],
      [-1.2285, 36.8912],
      [-1.1996, 36.9248]
    ]
  },
  {
    id: 'route-33-embakasi',
    number: 'Route 33',
    name: 'CBD (Odeon) ➔ Jogoo Rd ➔ Pipeline ➔ Embakasi',
    sacco: 'Embassava SACCO',
    origin: 'Odeon Cinema',
    destination: 'Embakasi Village',
    baseFare: 80,
    travelTimeEstMinutes: 42,
    corridor: 'Jogoo Road / Outering',
    jamLevel: 'heavy',
    stages: [
      NAIROBI_STAGES[1], // Odeon
      NAIROBI_STAGES[10] // Embakasi
    ],
    pathCoordinates: [
      [-1.2831, 36.8245],
      [-1.2891, 36.8398],
      [-1.2942, 36.8654],
      [-1.3021, 36.8872],
      [-1.3094, 36.9077]
    ]
  },
  {
    id: 'route-58-buruburu',
    number: 'Route 58',
    name: 'CBD (Railways) ➔ City Stadium ➔ Buru Buru Phase 4',
    sacco: 'Umoinner / Buru Kings',
    origin: 'Railways Bus Station',
    destination: 'Buru Buru Shopping Centre',
    baseFare: 60,
    travelTimeEstMinutes: 28,
    corridor: 'Jogoo Road',
    jamLevel: 'low',
    stages: [
      NAIROBI_STAGES[2], // Railways
      NAIROBI_STAGES[11] // Buru Buru
    ],
    pathCoordinates: [
      [-1.2898, 36.8277],
      [-1.2882, 36.8451],
      [-1.2861, 36.8655],
      [-1.2878, 36.8795]
    ]
  }
];

// Active Matatus on the road right now
export const INITIAL_MATATUS: MatatuVehicle[] = [
  {
    id: 'mat-001',
    name: 'Super Metro 044 (The King of Waiyaki)',
    sacco: 'Super Metro',
    routeNumber: 'Route 105',
    routeOrigin: 'Kencom House (CBD)',
    routeDestination: 'Kikuyu Town',
    plate: 'KDC 942T',
    conductorName: 'Otieno (Donda Mpole)',
    conductorPhone: '+254 722 198 421',
    driverName: 'Captain Mwangi',
    capacity: 33,
    availableSeats: 6,
    totalSeats: 33,
    fareKes: 70,
    departureTime: '18:15',
    departureMinutesLeft: 7,
    currentStageId: 'kencom',
    currentLat: -1.2858,
    currentLng: 36.8242,
    speedKmh: 0,
    headingDeg: 310,
    amenities: ['Free WiFi', 'Quiet Executive Vibe', 'Speed Governor (80km/h)', 'CCTV'],
    vibe: 'Clean, orderly queue, no loud music, AC ventilation',
    status: 'boarding',
    colorHex: '#10B981' // Green
  },
  {
    id: 'mat-002',
    name: 'MATRIX (Ron-ga-ga Beast)',
    sacco: 'Rongai Pride',
    routeNumber: 'Route 125',
    routeOrigin: 'Railways Bus Station',
    routeDestination: 'Ongata Rongai (Maasai Mall)',
    plate: 'KDF 888Z',
    conductorName: 'Junior "Bling" Kinyua',
    conductorPhone: '+254 711 554 902',
    driverName: 'Dere "Mullah" Salim',
    capacity: 33,
    availableSeats: 3,
    totalSeats: 33,
    fareKes: 100,
    departureTime: '18:20',
    departureMinutesLeft: 12,
    currentStageId: 'railways',
    currentLat: -1.2898,
    currentLng: 36.8277,
    speedKmh: 12,
    headingDeg: 215,
    amenities: ['55" 4K Curved TV', 'Subwoofer Bass Pro', 'Custom Airbrush Graffiti', 'USB Fast Chargers'],
    vibe: 'Top-tier Nairobi Gengetone & Afrobeats, ambient LED neons, full entertainment',
    status: 'boarding',
    colorHex: '#EC4899' // Pink / Magenta
  },
  {
    id: 'mat-003',
    name: 'Zuri Genesis (Thika Express)',
    sacco: 'Super Metro / Zuri',
    routeNumber: 'Route 44',
    routeOrigin: 'Ambassadeur Bus Stop',
    routeDestination: 'Githurai 45',
    plate: 'KDB 012J',
    conductorName: 'Kamau "Chapaa"',
    conductorPhone: '+254 790 321 654',
    driverName: 'Mrefu James',
    capacity: 33,
    availableSeats: 9,
    totalSeats: 33,
    fareKes: 60,
    departureTime: '18:10',
    departureMinutesLeft: 2,
    currentStageId: 'ambassadeur',
    currentLat: -1.2847,
    currentLng: 36.8256,
    speedKmh: 5,
    headingDeg: 45,
    amenities: ['Fast Express Lane', 'High Back Bucket Seats', 'Safe Luggage Racks'],
    vibe: 'Express direct Thika Superhighway run, fast commute',
    status: 'boarding',
    colorHex: '#3B82F6' // Blue
  },
  {
    id: 'mat-004',
    name: 'Embassava Prime (Jogoo Flyer)',
    sacco: 'Embassava SACCO',
    routeNumber: 'Route 33',
    routeOrigin: 'Odeon Cinema',
    routeDestination: 'Embakasi Village',
    plate: 'KDG 331M',
    conductorName: 'Brayo wa Mtaa',
    conductorPhone: '+254 733 987 112',
    driverName: 'Njoro Pilot',
    capacity: 14,
    availableSeats: 4,
    totalSeats: 14,
    fareKes: 80,
    departureTime: '18:25',
    departureMinutesLeft: 17,
    currentStageId: 'odeon',
    currentLat: -1.2831,
    currentLng: 36.8245,
    speedKmh: 0,
    headingDeg: 120,
    amenities: ['Leather Recliners', 'Express Jogoo Corridor', 'M-Pesa Till Payment'],
    vibe: 'Smooth ride with soothing Reggae lovers rock',
    status: 'boarding',
    colorHex: '#F59E0B' // Amber
  },
  {
    id: 'mat-005',
    name: 'Buru Rocker 58 (Eastlands Vibe)',
    sacco: 'Umoinner',
    routeNumber: 'Route 58',
    routeOrigin: 'Railways Bus Station',
    routeDestination: 'Buru Buru Shopping Centre',
    plate: 'KDC 774L',
    conductorName: 'Giddy "Whistle"',
    conductorPhone: '+254 700 882 119',
    driverName: 'Papa Shiro',
    capacity: 33,
    availableSeats: 12,
    totalSeats: 33,
    fareKes: 60,
    departureTime: '18:30',
    departureMinutesLeft: 22,
    currentStageId: 'railways',
    currentLat: -1.2898,
    currentLng: 36.8277,
    speedKmh: 0,
    headingDeg: 100,
    amenities: ['Custom Horn Chime', 'Eastlands Graffiti Art', 'Bass Tubes'],
    vibe: 'Classic Nairobi youth culture & friendly conductor crew',
    status: 'boarding',
    colorHex: '#8B5CF6' // Purple
  }
];

// Safety Radar & Hazard Spots across Nairobi
export const NAIROBI_HAZARDS: HazardZone[] = [
  {
    id: 'hazard-river-road',
    name: 'River Road / Ronald Ngala Junction',
    area: 'Downtown CBD',
    lat: -1.2838,
    lng: 36.8285,
    riskType: 'pickpocket',
    riskLevel: 'high',
    shengWarning: 'Kaa rada na wadosi wa simu! Usitembee ukichati kwa open street, weka simu ndani ya mfuko.',
    englishAdvice: 'High density pedestrian zone. Keep smartphones and laptops securely zipped inside bags. Avoid counting cash in the open.',
    safeAlternative: 'Board matatus at official SACCO terminals like Kencom or Ambassadeur rather than street corners.',
    peakDangerHours: '17:30 - 21:30 (Evening Rush)'
  },
  {
    id: 'hazard-globe-roundabout',
    name: 'Globe Cinema Roundabout / Ngara Underpass',
    area: 'CBD North Fringe',
    lat: -1.2789,
    lng: 36.8201,
    riskType: 'dark_crossing',
    riskLevel: 'caution',
    shengWarning: 'Kivukio cha usiku: Tembea na group au utumie footbridge ya juu. Usipite kichochoro ya giza.',
    englishAdvice: 'Dimly lit pedestrian underpasses after dark. Always stick to well-lit footbridges and walk alongside fellow commuters.',
    safeAlternative: 'Take the lit pedestrian path alongside Murang’a Road toward Koja Mosque.',
    peakDangerHours: '20:00 - 05:00'
  },
  {
    id: 'hazard-thika-expressway-footbridge',
    name: 'Kasarani / Githurai Highway Crossings',
    area: 'Thika Superhighway',
    lat: -1.2185,
    lng: 36.9012,
    riskType: 'speed_traffic',
    riskLevel: 'high',
    shengWarning: 'Usijaribu kuruka guardrail ya highway! Magari inakimbia 100km/h. Tumia footbridge pekee.',
    englishAdvice: 'Extreme traffic speed. Crossing the highway on foot is strictly dangerous and illegal. Always use the elevated pedestrian overpass.',
    safeAlternative: 'Designated elevated steel footbridges located every 500m.',
    peakDangerHours: 'All Hours'
  },
  {
    id: 'hazard-jogoo-city-stadium',
    name: 'City Stadium Roundabout (Jogoo Road)',
    area: 'Eastlands Entry',
    lat: -1.2915,
    lng: 36.8482,
    riskType: 'touting_scramble',
    riskLevel: 'moderate',
    shengWarning: 'Wakati wa mvua kuna scramble kwa milango. Tumia app yetu ya booking uepuke kung’ang’ana na kuongezwa fare.',
    englishAdvice: 'Heavy evening scrambles during sudden rainstorms. Unbooked touts may artificially hike fares by 3x. Use the app’s fixed-price reservation to walk straight to your reserved seat.',
    safeAlternative: 'Use the Nganya Ride app to guarantee seat reservation before leaving your desk.',
    peakDangerHours: '18:00 - 20:00'
  },
  {
    id: 'hazard-south-c-expressway-drain',
    name: 'Nyayo Stadium / South C Flash Flooding Zone',
    area: 'Mombasa Road Corridor',
    lat: -1.3054,
    lng: 36.8261,
    riskType: 'flood_zone',
    riskLevel: 'moderate',
    shengWarning: 'Mvua ikinyesha kubwa, maji inajaa hapa. Dereva wetu hubypass kupitia Langata Link.',
    englishAdvice: 'Flash flood pooling occurs during heavy tropical downpours. Matatu drivers using our system automatically switch to the Southern Bypass / Langata link route.',
    safeAlternative: 'Southern Bypass or elevated Expressway connector.',
    peakDangerHours: 'During Heavy Downpours'
  }
];

// Time & Money Savings statistics
export const COMMUTE_BENEFITS = [
  {
    metric: '45 mins',
    label: 'Daily Time Saved',
    shengLabel: 'Dk 45 zimeokolewa kila siku',
    description: 'No queuing for 40+ minutes at Kencom or Odeon in the cold or rain.'
  },
  {
    metric: '100% Refund',
    label: 'Office Delay Guarantee',
    shengLabel: 'Ukilate ofisi, bob zinarudi 100%',
    description: 'If your boss calls an impromptu 6 PM meeting, your seat is released and M-Pesa is refunded instantly.'
  },
  {
    metric: 'Zero Fare Spikes',
    label: 'Fixed Fair Price',
    shengLabel: 'Hakuna kupandishiwa bei juu ya mvua',
    description: 'Avoid arbitrary street tout price gouging from KES 50 to KES 200 during sudden downpours.'
  },
  {
    metric: '24/7 Safety Radar',
    label: 'Mtaa Intelligence',
    shengLabel: 'Rada ya vitongoji vyote vya Kanairo',
    description: 'Live alerts on flash floods, traffic jams, and pedestrian safety zones.'
  }
];
