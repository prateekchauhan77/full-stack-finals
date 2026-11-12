// NovaTech Electronics - Initial Mock Database & Seed Data

const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "QuantumBook Titan 16 Pro",
    category: "laptops",
    categoryName: "Laptops & Computing",
    price: 2499.00,
    originalPrice: 2799.00,
    rating: 4.9,
    reviewsCount: 142,
    stock: 8,
    tag: "Flagship",
    badgeColor: "#00f2fe",
    shortDesc: "Next-gen M4 architecture laptop with 120Hz Liquid Retina XDR display & 64GB Unified RAM.",
    description: "Engineered for AI researchers, creative pros, and extreme multitaskers. The QuantumBook Titan 16 features our proprietary neural thermal architecture, dual vapor chamber cooling, and up to 22 hours of battery endurance on a single charge.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1000&q=80"
    ],
    specs: {
      "Processor": "NovaCore M4 Ultra (16-Core CPU, 40-Core GPU)",
      "Memory": "64GB Unified High-Bandwidth RAM",
      "Storage": "1TB PCIe Gen5 NVMe SSD (Up to 7,400 MB/s)",
      "Display": "16.2\" Mini-LED XDR, 3456x2234 @ 120Hz ProMotion",
      "Battery": "100Wh, 140W USB-C GaN Fast Charger included",
      "Chassis": "Aerospace Grade 5 Titanium"
    },
    features: [
      "Liquid Retina XDR with 1,600 nits peak HDR brightness",
      "6-speaker sound system with force-cancelling woofers",
      "Studio-quality 3-mic array with beamforming",
      "Wi-Fi 7 and Bluetooth 5.4 LE Ultra"
    ],
    variants: {
      colors: [
        { name: "Space Titanium", hex: "#4b4f56" },
        { name: "Obsidian Black", hex: "#16171b" },
        { name: "Cyber Silver", hex: "#d1d5db" }
      ],
      storage: [
        { label: "1TB SSD", priceDelta: 0 },
        { label: "2TB SSD", priceDelta: 300 },
        { label: "4TB SSD", priceDelta: 700 }
      ]
    }
  },
  {
    id: "prod-2",
    name: "VisionSphere Pro Spatial Headset",
    category: "wearables",
    categoryName: "Wearables & Spatial",
    price: 1499.00,
    originalPrice: 1699.00,
    rating: 4.8,
    reviewsCount: 89,
    stock: 5,
    tag: "Revolutionary",
    badgeColor: "#9d4edd",
    shortDesc: "Dual 8K Micro-OLED spatial computing headset with real-time neural eye tracking and LiDAR hand navigation.",
    description: "Step beyond the screen. VisionSphere Pro transforms your surrounding physical workspace into an infinite high-fidelity canvas. Ultra-low latency passthrough camera array reproduces the physical world in photorealistic HDR clarity.",
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=1000&q=80"
    ],
    specs: {
      "Display": "Dual Micro-OLED (23M pixels total, 90Hz/120Hz)",
      "Tracking": "LiDAR depth sensor, 12 camera array, 5 infrared eye sensors",
      "Audio": "Spatial Audio ray-tracing with acoustic room calibration",
      "Chipset": "Dual R2 Spatial Processor + NovaSilicon M3",
      "Weight": "430g balanced carbon-fiber frame"
    },
    features: [
      "Intuitive navigation using just eyes, hands, and voice",
      "True 4K-per-eye micro-display optical system",
      "Zero-latency wireless PC/Mac streaming",
      "Breathable woven headband with quick-dial fit"
    ],
    variants: {
      colors: [
        { name: "Nebula Gray", hex: "#2b2d42" },
        { name: "Lunar White", hex: "#e5e7eb" }
      ],
      storage: [
        { label: "256GB", priceDelta: 0 },
        { label: "512GB", priceDelta: 200 }
      ]
    }
  },
  {
    id: "prod-3",
    name: "CyberSound Orbit ANC Headphones",
    category: "audio",
    categoryName: "Audio & Acoustics",
    price: 399.00,
    originalPrice: 449.00,
    rating: 4.9,
    reviewsCount: 230,
    stock: 14,
    tag: "Best Seller",
    badgeColor: "#00f2fe",
    shortDesc: "Audiophile-grade 50mm beryllium planar magnetic drivers with active hybrid acoustic cancellation.",
    description: "Unrivaled acoustic transparency meets military-grade 48dB noise reduction. The CyberSound Orbit creates a personal symphony chamber anywhere you travel, equipped with lossless LDAC wireless decoding and personalized hearing calibration.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80"
    ],
    specs: {
      "Drivers": "50mm Custom Beryllium Planar Magnetic",
      "Frequency Response": "5Hz - 48,000Hz (Hi-Res Audio Certified)",
      "ANC Level": "Up to -48dB Adaptive Hybrid Noise Cancellation",
      "Battery Life": "60 Hours (ANC ON), 80 Hours (ANC OFF)",
      "Fast Charge": "10 min charge gives 8 hours playback",
      "Connectivity": "Bluetooth 5.4, 3.5mm Analog, USB-C 24-bit/96kHz DAC"
    },
    features: [
      "Custom tuned acoustic chamber with zero sound leakage",
      "Memory foam protein leather earcups with cooling gel layer",
      "Multi-point pairing to two devices simultaneously",
      "Companion EQ app with parametric 10-band equalizer"
    ],
    variants: {
      colors: [
        { name: "Midnight Black", hex: "#111827" },
        { name: "Cyber Chrome", hex: "#9ca3af" },
        { name: "Rose Gold", hex: "#c084fc" }
      ],
      storage: [
        { label: "Standard Case", priceDelta: 0 },
        { label: "Executive Leather Case", priceDelta: 30 }
      ]
    }
  },
  {
    id: "prod-4",
    name: "NovaWatch Ultra 3 Titanium",
    category: "wearables",
    categoryName: "Wearables & Spatial",
    price: 549.00,
    originalPrice: 599.00,
    rating: 4.8,
    reviewsCount: 178,
    stock: 11,
    tag: "Hot",
    badgeColor: "#f72585",
    shortDesc: "Rugged aerospace titanium smartwatch with 100m water resistance, dual-frequency GPS, and 14-day battery.",
    description: "Designed for endurance athletes, explorers, and modern tacticians. Features an ultra-bright 3000-nit Sapphire Crystal AMOLED display visible under blinding desert sun or 40 meters underwater.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=80"
    ],
    specs: {
      "Case": "49mm Grade 5 Titanium with raised bezel guard",
      "Screen": "1.99\" LTPO AMOLED, 3,000 nits peak, Sapphire Glass",
      "Sensors": "ECG, SpO2, Skin Temp, Dual-Frequency L1/L5 GPS, Depth Gauge",
      "Water Resistance": "100m ISO 22810 (Certified for Scuba Diving to 40m)",
      "Battery": "14 Days Typical Use, 60 Hours in Precision GPS Mode"
    },
    features: [
      "Customizable Action Button with tactile ribbed texture",
      "Emergency 86-decibel siren audible up to 180 meters",
      "Biometric recovery readiness score & sleep stage analysis",
      "Cellular LTE calling & standalone offline navigation"
    ],
    variants: {
      colors: [
        { name: "Natural Titanium", hex: "#71717a" },
        { name: "Tactical Matte Black", hex: "#18181b" },
        { name: "Neon Orange Band", hex: "#f97316" }
      ],
      storage: [
        { label: "Trail Loop", priceDelta: 0 },
        { label: "Ocean Silicone Band", priceDelta: 20 },
        { label: "Titanium Link Bracelet", priceDelta: 90 }
      ]
    }
  },
  {
    id: "prod-5",
    name: "Vortex Quantum 34\" QD-OLED Monitor",
    category: "gaming",
    categoryName: "Gaming & Peripherals",
    price: 899.00,
    originalPrice: 1099.00,
    rating: 4.9,
    reviewsCount: 96,
    stock: 4,
    tag: "Top Rated",
    badgeColor: "#00f2fe",
    shortDesc: "Ultrawide 1800R curved gaming monitor with 175Hz refresh rate, 0.03ms response time, and 99.3% DCI-P3.",
    description: "Witness pure black levels and infinite contrast. The Vortex Quantum 34 blends Quantum Dot color brilliance with self-lit OLED precision, elevating competitive gaming and color-accurate cinema grading to transcendent heights.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80"
    ],
    specs: {
      "Resolution": "3440 x 1440 WQHD (21:9 Ultrawide)",
      "Panel Type": "Quantum Dot OLED (Anti-Reflective coating)",
      "Refresh Rate": "175Hz via DisplayPort 1.4 / 100Hz HDMI 2.1",
      "Response Time": "0.03ms GtG (True Instantaneous)",
      "HDR": "VESA DisplayHDR True Black 400 (1000 nits peak)",
      "Ports": "2x HDMI 2.1, 1x DP 1.4, USB-C 90W Power Delivery"
    },
    features: [
      "Burn-in warranty with active pixel shift & OLED care heatsink",
      "Ambient reactive RGB backlight projection with music sync",
      "Built-in KVM switch for effortless dual-computer control",
      "Height, tilt, and swivel ergonomics with magnetic cable routing"
    ],
    variants: {
      colors: [
        { name: "Cosmic Charcoal", hex: "#1f2937" },
        { name: "Cyber White", hex: "#f3f4f6" }
      ],
      storage: [
        { label: "Desk Stand Included", priceDelta: 0 },
        { label: "Heavy-Duty Gas Spring Arm", priceDelta: 80 }
      ]
    }
  },
  {
    id: "prod-6",
    name: "Apex Pro Wireless Magnesium Mouse",
    category: "gaming",
    categoryName: "Gaming & Peripherals",
    price: 159.00,
    originalPrice: 189.00,
    rating: 4.7,
    reviewsCount: 312,
    stock: 22,
    tag: "Esports",
    badgeColor: "#10b981",
    shortDesc: "Ultra-lightweight 39-gram CNC magnesium alloy exoskeleton with true 8000Hz polling rate.",
    description: "Precision engineered for tournament esports champions. With zero flexing, hollow magnesium structural geometry, and optical sub-millisecond switches guaranteed for 100 million clicks.",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=1000&q=80"
    ],
    specs: {
      "Weight": "39 grams (Ultralight magnesium alloy)",
      "Sensor": "NovaSense 42K Gen-3 (42,000 DPI, 750 IPS, 50G)",
      "Polling Rate": "8000Hz Wireless / 8000Hz Wired",
      "Switches": "Gen-3 Optical Light-Strike Switches (0.2ms actuation)",
      "Battery": "Up to 90 Hours at 1000Hz (40 Hours at 8000Hz)"
    },
    features: [
      "100% pure PTFE virgin glide feet with rounded beveled edges",
      "Web-based driver configuration — zero bloated software needed",
      "Included grip tape set and ultra-flexible paracord USB-C cable",
      "On-board memory profiles for instant tournament switching"
    ],
    variants: {
      colors: [
        { name: "Anodized Slate", hex: "#334155" },
        { name: "Ghost Silver", hex: "#cbd5e1" },
        { name: "Laser Teal", hex: "#06b6d4" }
      ],
      storage: [
        { label: "Standard Wireless Dongle", priceDelta: 0 },
        { label: "8K HyperPolling Receiver", priceDelta: 25 }
      ]
    }
  },
  {
    id: "prod-7",
    name: "CyberKey 75 Hall-Effect Keyboard",
    category: "gaming",
    categoryName: "Gaming & Peripherals",
    price: 219.00,
    originalPrice: 249.00,
    rating: 4.9,
    reviewsCount: 165,
    stock: 12,
    tag: "Custom Grade",
    badgeColor: "#8b5cf6",
    shortDesc: "75% magnetic switch keyboard with Rapid Trigger 0.1mm actuation and CNC anodized aluminum chassis.",
    description: "The ultimate competitive typing and gaming apparatus. Magnetic Hall-effect sensors detect keystroke depth continuously, granting immediate key reset the exact millisecond your finger begins to lift.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80"
    ],
    specs: {
      "Layout": "75% Compact with Rotary Encoder Knob",
      "Switches": "Magnetic Hall-Effect Gateron Jade (Rapid Trigger 0.1 - 4.0mm)",
      "Case": "6063 CNC Machined Anodized Aluminum with Brass Internal Weight",
      "Sound Profile": "Gasket mount with 5 layers of Poron & IXPE acoustic foam",
      "Connectivity": "Tri-Mode: 2.4GHz Wireless, Bluetooth 5.2, USB-C"
    },
    features: [
      "Continuous Rapid Trigger with 0.05mm step adjustment",
      "Per-key south-facing RGB with 24 custom lighting animation presets",
      "Double-shot PBT cherry profile keycaps with crisp legends",
      "Hot-swappable magnetic switch sockets"
    ],
    variants: {
      colors: [
        { name: "Cyberpunk Violet", hex: "#7c3aed" },
        { name: "Stealth Black", hex: "#0f172a" },
        { name: "Polar Ice White", hex: "#e2e8f0" }
      ],
      storage: [
        { label: "Standard Keycaps", priceDelta: 0 },
        { label: "Artisan Ceramic Keycap Set", priceDelta: 45 }
      ]
    }
  },
  {
    id: "prod-8",
    name: "FalconX 8K Cinema Drone",
    category: "smart",
    categoryName: "Smart & Robotics",
    price: 1199.00,
    originalPrice: 1399.00,
    rating: 4.8,
    reviewsCount: 74,
    stock: 6,
    tag: "Cinema Pro",
    badgeColor: "#f59e0b",
    shortDesc: "Triple-camera drone with 8K ProRes RAW, 45-minute flight endurance, and 360° omnidirectional LiDAR.",
    description: "Capture Hollywood-standard cinematography from the sky. Powered by a triple-lens system with mechanical shutter, 15km video transmission range, and AI automated subject-tracking algorithms.",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1000&q=80"
    ],
    specs: {
      "Cameras": "4/3 CMOS Hasselblad + 70mm Medium Tele + 166mm Telephoto",
      "Video": "8K @ 30fps Apple ProRes 422 HQ / 4K @ 120fps Slow Motion",
      "Flight Time": "Up to 46 minutes per battery charge",
      "Transmission": "15km O4 HD Video Link with 1080p 60fps low latency stream",
      "Obstacle Avoidance": "Omnidirectional LiDAR + APAS 5.0 Active Bypass"
    },
    features: [
      "1TB internal high-speed SSD built directly into drone body",
      "MasterShots automatic cinematic flight path creator",
      "Wind resistance up to Level 6 (12 m/s ocean gusts)",
      "Includes NovaSmart Controller with built-in 1000-nit screen"
    ],
    variants: {
      colors: [
        { name: "Aero Gray", hex: "#64748b" },
        { name: "Rescue Orange", hex: "#ea580c" }
      ],
      storage: [
        { label: "Standard Single Battery Pack", priceDelta: 0 },
        { label: "Fly More Combo (3 Batteries + Hub + Case)", priceDelta: 280 }
      ]
    }
  },
  {
    id: "prod-9",
    name: "SonicPods Spatial Earbuds Gen 2",
    category: "audio",
    categoryName: "Audio & Acoustics",
    price: 249.00,
    originalPrice: 279.00,
    rating: 4.8,
    reviewsCount: 380,
    stock: 19,
    tag: "Popular",
    badgeColor: "#10b981",
    shortDesc: "Dual-driver true wireless earbuds with lossless dynamic tracking and translucent cyberpunk charging case.",
    description: "Compact acoustic engineering marvel. High-precision dynamic drivers with micro-balanced armatures deliver punchy sub-bass down to 10Hz and crystal clear vocal separation with adaptive smart transparency.",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80"
    ],
    specs: {
      "Acoustics": "11mm Liquid Crystal Polymer Driver + Balanced Armature",
      "Noise Control": "Active Noise Cancellation up to 45dB with wind shield",
      "Battery": "9 Hours earbuds / 36 Hours total with Wireless Charging Case",
      "Water Resistance": "IP55 dust and water splash resistance",
      "Codecs": "LHDC 5.0, LDAC, AAC, aptX Lossless"
    },
    features: [
      "Cyber-glow case with status LED ring and lanyard slot",
      "Ultra-low 38ms gaming mode latency",
      "Find My Earbuds acoustic radar locator",
      "Pressure-sensitive stem squeeze controls"
    ],
    variants: {
      colors: [
        { name: "Glacier Clear", hex: "#94a3b8" },
        { name: "Smoked Obsidian", hex: "#1e293b" }
      ],
      storage: [
        { label: "Standard Case", priceDelta: 0 },
        { label: "MagSafe Wireless Case", priceDelta: 20 }
      ]
    }
  },
  {
    id: "prod-10",
    name: "NovaBlade Stealth 14 Gaming Ultrabook",
    category: "laptops",
    categoryName: "Laptops & Computing",
    price: 1999.00,
    originalPrice: 2299.00,
    rating: 4.7,
    reviewsCount: 92,
    stock: 3,
    tag: "Low Stock",
    badgeColor: "#ef4444",
    shortDesc: "1.6kg portable titan with RTX 4080 Mobile GPU, Intel Core Ultra 9, and 240Hz OLED display.",
    description: "Pure desktop-class power condensed into a 16mm thin aluminum chassis. Plays every AAA title at ultra settings while slipping silently into any messenger bag for daily work commutes.",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80"
    ],
    specs: {
      "GPU": "NVIDIA GeForce RTX 4080 12GB GDDR6 (140W TGP)",
      "CPU": "Intel Core Ultra 9 185H (16 Cores, 22 Threads, 5.1GHz)",
      "RAM": "32GB LPDDR5X-7467 Dual-Channel",
      "Display": "14.5\" 2.8K (2880x1800) 240Hz 0.2ms OLED HDR500",
      "Storage": "1TB PCIe 4.0 NVMe SSD + Additional M.2 Slot Free"
    },
    features: [
      "Full vapor chamber thermal matrix with dual liquid crystal polymer fans",
      "Glass precision trackpad with haptic feedback clicks",
      "Per-key RGB mechanical-feel keyboard with anti-ghosting",
      "Thunderbolt 4 with 100W USB-C Power Delivery charging"
    ],
    variants: {
      colors: [
        { name: "Matte Anodized Black", hex: "#0f172a" },
        { name: "Mercury Silver", hex: "#e2e8f0" }
      ],
      storage: [
        { label: "1TB SSD", priceDelta: 0 },
        { label: "2TB SSD", priceDelta: 220 }
      ]
    }
  },
  {
    id: "prod-11",
    name: "PulseRing Gen 4 Smart Titanium Ring",
    category: "wearables",
    categoryName: "Wearables & Spatial",
    price: 299.00,
    originalPrice: 349.00,
    rating: 4.8,
    reviewsCount: 114,
    stock: 16,
    tag: "New",
    badgeColor: "#06b6d4",
    shortDesc: "Medical-grade biometric titanium ring monitoring sleep score, heart rate variability, and stress index.",
    description: "Effortless, screen-free health tracking. Lightweight at just 3 grams, the PulseRing Gen 4 uses medical-grade photoplethysmography (PPG) sensors to measure resting heart rate, recovery readiness, and metabolic temperature shifts.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80"
    ],
    specs: {
      "Material": "Titanium with Diamond-Like Carbon (DLC) Scratch Coating",
      "Sensors": "Green & Red LEDs for HR/SpO2, Infrared PPG, Skin Temp sensor",
      "Battery": "7-day battery life on a single 40-minute wireless dock charge",
      "Water Resistance": "Waterproof up to 100 meters (Safe for swimming & saunas)",
      "Weight": "3.2 grams (Hypoallergenic seamless inner molding)"
    },
    features: [
      "Zero subscription fees — all analytics included for lifetime",
      "Predictive illness detection up to 48 hours before symptoms appear",
      "Automatic workout and sleep stage classification",
      "Syncs seamlessly with Apple Health and Google Fit"
    ],
    variants: {
      colors: [
        { name: "Stealth Brushed Black", hex: "#1e293b" },
        { name: "Silver Mirror", hex: "#cbd5e1" },
        { name: "Gold 24K PVD", hex: "#f59e0b" }
      ],
      storage: [
        { label: "Size US 8", priceDelta: 0 },
        { label: "Size US 10", priceDelta: 0 },
        { label: "Size US 12", priceDelta: 0 }
      ]
    }
  },
  {
    id: "prod-12",
    name: "CyberSphere Intelligent Home Hub",
    category: "smart",
    categoryName: "Smart & Robotics",
    price: 349.00,
    originalPrice: 399.00,
    rating: 4.7,
    reviewsCount: 68,
    stock: 9,
    tag: "Smart Living",
    badgeColor: "#3b82f6",
    shortDesc: "Floating magnetic acoustic speaker and smart home control center with Matter and Zigbee 3.0 gateway.",
    description: "The architectural centerpiece of the connected smart home. Magnetic levitation keeps the acoustic sphere floating in mid-air while pumping 360-degree omni-directional sound with integrated local voice AI processing.",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80"
    ],
    specs: {
      "Acoustics": "45W Subwoofer in base + 25W High-Frequency Levitation Sphere",
      "Protocol Support": "Matter, Thread, Zigbee 3.0, Wi-Fi 6E, Bluetooth Mesh",
      "Display": "Circular AMOLED micro-display on base for weather & media controls",
      "Voice AI": "Local on-device NPU for 100% private voice processing",
      "Wireless Power": "Magnetic induction levitation with zero cords to floating sphere"
    },
    features: [
      "360-degree true spatial audio projection with acoustic reflection",
      "RGB reactive aura ring with 16 million colors",
      "Controls over 500+ Matter and Apple HomeKit smart appliances",
      "Hardware privacy switch physically cuts microphone power"
    ],
    variants: {
      colors: [
        { name: "Obsidian Core", hex: "#0f172a" },
        { name: "Pure Ceramic White", hex: "#f8fafc" }
      ],
      storage: [
        { label: "Standard Unit", priceDelta: 0 },
        { label: "Bundle with 3 Smart Sensors", priceDelta: 60 }
      ]
    }
  }
];

const INITIAL_COUPONS = {
  "NOVAFIRST": { type: "percent", value: 15, desc: "15% discount for first-time orders" },
  "CYBER50": { type: "fixed", value: 50, desc: "$50 off purchases over $300", minSpend: 300 },
  "FREESHIP": { type: "shipping", value: 0, desc: "Free Express Shipping on your order" },
  "TECH100": { type: "fixed", value: 100, desc: "$100 VIP tech discount on orders over $800", minSpend: 800 }
};

const INITIAL_ORDERS = [
  {
    id: "ORD-94821",
    customer: {
      name: "Marcus Vance",
      email: "marcus.v@neuralgrid.io",
      phone: "+1 (555) 382-9912",
      address: "742 Innovation Way, Suite 400",
      city: "San Francisco",
      state: "CA",
      zip: "94107",
      country: "United States"
    },
    items: [
      {
        id: "prod-1",
        name: "QuantumBook Titan 16 Pro",
        price: 2499.00,
        quantity: 1,
        color: "Space Titanium",
        storage: "1TB SSD",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "prod-6",
        name: "Apex Pro Wireless Magnesium Mouse",
        price: 159.00,
        quantity: 1,
        color: "Anodized Slate",
        storage: "8K HyperPolling Receiver",
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=400&q=80"
      }
    ],
    pricing: {
      subtotal: 2658.00,
      discount: 398.70,
      couponCode: "NOVAFIRST",
      shipping: 0.00,
      shippingMethod: "Express Drone Air Delivery",
      tax: 180.74,
      total: 2440.04
    },
    paymentMethod: "Credit Card (•••• 4242)",
    status: "Shipped",
    placedAt: "2026-10-08T14:32:00Z",
    trackingNumber: "NOVA-EXP-88492019",
    timeline: [
      { step: "Order Placed", time: "Oct 8, 2026, 2:32 PM", completed: true },
      { step: "Payment Confirmed", time: "Oct 8, 2026, 2:33 PM", completed: true },
      { step: "Order Shipped", time: "Oct 9, 2026, 9:15 AM", completed: true },
      { step: "Out for Delivery", time: "Estimated Tomorrow", completed: false },
      { step: "Delivered", time: "Pending", completed: false }
    ]
  },
  {
    id: "ORD-94819",
    customer: {
      name: "Elena Rostova",
      email: "elena.r@cyberlabs.de",
      phone: "+49 170 555 491",
      address: "Kaiserdamm 112",
      city: "Berlin",
      state: "Berlin",
      zip: "14057",
      country: "Germany"
    },
    items: [
      {
        id: "prod-3",
        name: "CyberSound Orbit ANC Headphones",
        price: 399.00,
        quantity: 1,
        color: "Midnight Black",
        storage: "Standard Case",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
      }
    ],
    pricing: {
      subtotal: 399.00,
      discount: 50.00,
      couponCode: "CYBER50",
      shipping: 15.00,
      shippingMethod: "Standard Global Express",
      tax: 29.12,
      total: 393.12
    },
    paymentMethod: "Apple Pay / NovaPay",
    status: "Delivered",
    placedAt: "2026-10-06T10:15:00Z",
    trackingNumber: "NOVA-GLO-77192834",
    timeline: [
      { step: "Order Placed", time: "Oct 6, 2026, 10:15 AM", completed: true },
      { step: "Payment Confirmed", time: "Oct 6, 2026, 10:15 AM", completed: true },
      { step: "Order Shipped", time: "Oct 7, 2026, 11:00 AM", completed: true },
      { step: "Out for Delivery", time: "Oct 8, 2026, 8:45 AM", completed: true },
      { step: "Delivered", time: "Oct 8, 2026, 1:20 PM", completed: true }
    ]
  }
];
