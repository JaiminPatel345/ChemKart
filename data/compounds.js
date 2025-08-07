// Compound Management System
// Each compound has a unique ID and tracks usage per level

const COMPOUNDS_DB = {
  // Level 1 - Basic compounds
  'H2O': { id: 'L1_001', name: 'Water', inputs: ['H', 'H', 'O'], conditions: [], level: 1, reward: 10, fact: 'Water (H₂O) is essential for all known forms of life and covers 71% of Earth\'s surface.' },
  'NaCl': { id: 'L1_002', name: 'Sodium Chloride', inputs: ['Na', 'Cl'], conditions: [], level: 1, reward: 15, fact: 'Sodium Chloride (NaCl), table salt, is essential for human life and used to preserve food.' },
  'HCl': { id: 'L1_003', name: 'Hydrochloric Acid', inputs: ['H', 'Cl'], conditions: [], level: 1, reward: 12, fact: 'Hydrochloric Acid (HCl) is found in stomach acid and helps digest food.' },
  'KCl': { id: 'L1_004', name: 'Potassium Chloride', inputs: ['K', 'Cl'], conditions: [], level: 1, reward: 14, fact: 'Potassium Chloride (KCl) is used as a salt substitute and in fertilizers.' },
  'LiF': { id: 'L1_005', name: 'Lithium Fluoride', inputs: ['Li', 'F'], conditions: [], level: 1, reward: 16, fact: 'Lithium Fluoride (LiF) has extremely high ionic character and is used in specialized ceramics.' },

  // Level 2 - More complex molecules
  'CO2': { id: 'L2_001', name: 'Carbon Dioxide', inputs: ['C', 'O', 'O'], conditions: [], level: 2, reward: 18, fact: 'Carbon Dioxide (CO₂) is essential for plant photosynthesis and makes up 0.04% of Earth\'s atmosphere.' },
  'CH4': { id: 'L2_002', name: 'Methane', inputs: ['C', 'H', 'H', 'H', 'H'], conditions: [], level: 2, reward: 22, fact: 'Methane (CH₄) is the main component of natural gas and a potent greenhouse gas.' },
  'NH3': { id: 'L2_003', name: 'Ammonia', inputs: ['N', 'H', 'H', 'H'], conditions: ['heat'], level: 2, reward: 25, fact: 'Ammonia (NH₃) is crucial for fertilizers and is produced industrially via the Haber process.' },
  'H2S': { id: 'L2_004', name: 'Hydrogen Sulfide', inputs: ['H', 'H', 'S'], conditions: [], level: 2, reward: 20, fact: 'Hydrogen Sulfide (H₂S) smells like rotten eggs and is toxic in high concentrations.' },
  'CO': { id: 'L2_005', name: 'Carbon Monoxide', inputs: ['C', 'O'], conditions: ['heat'], level: 2, reward: 18, fact: 'Carbon Monoxide (CO) is a deadly, odorless gas produced by incomplete combustion.' },

  // Level 3 - Intermediate compounds
  'SO2': { id: 'L3_001', name: 'Sulfur Dioxide', inputs: ['S', 'O', 'O'], conditions: ['heat'], level: 3, reward: 30, fact: 'Sulfur Dioxide (SO₂) is used to preserve wine and dried fruits, and causes acid rain.' },
  'NO2': { id: 'L3_002', name: 'Nitrogen Dioxide', inputs: ['N', 'O', 'O'], conditions: ['heat'], level: 3, reward: 32, fact: 'Nitrogen Dioxide (NO₂) is a major air pollutant that gives smog its brown color.' },
  'MgO': { id: 'L3_003', name: 'Magnesium Oxide', inputs: ['Mg', 'O'], conditions: ['heat'], level: 3, reward: 35, fact: 'Magnesium Oxide (MgO) is used as a refractory material and antacid (milk of magnesia).' },
  'CaO': { id: 'L3_004', name: 'Calcium Oxide', inputs: ['Ca', 'O'], conditions: ['heat'], level: 3, reward: 38, fact: 'Calcium Oxide (CaO), quicklime, is used in cement production and steel making.' },
  'NO': { id: 'L3_005', name: 'Nitric Oxide', inputs: ['N', 'O'], conditions: ['heat'], level: 3, reward: 28, fact: 'Nitric Oxide (NO) plays important roles in biology and is a signaling molecule.' },
  'SO3': { id: 'L3_006', name: 'Sulfur Trioxide', inputs: ['S', 'O', 'O', 'O'], conditions: ['heat'], level: 3, reward: 35, fact: 'Sulfur Trioxide (SO₃) is used to make sulfuric acid, one of the most important industrial chemicals.' },

  // Level 4 - Advanced molecules
  'SiO2': { id: 'L4_001', name: 'Silicon Dioxide', inputs: ['Si', 'O', 'O'], conditions: ['heat'], level: 4, reward: 45, fact: 'Silicon Dioxide (SiO₂) forms quartz crystals and is the main component of sand and glass.' },
  'Al2O3': { id: 'L4_002', name: 'Aluminum Oxide', inputs: ['Al', 'Al', 'O', 'O', 'O'], conditions: ['heat'], level: 4, reward: 55, fact: 'Aluminum Oxide (Al₂O₃) is extremely hard and used to make sapphires and rubies.' },
  'PCl3': { id: 'L4_003', name: 'Phosphorus Trichloride', inputs: ['P', 'Cl', 'Cl', 'Cl'], conditions: [], level: 4, reward: 48, fact: 'Phosphorus Trichloride (PCl₃) is used to manufacture organophosphorus compounds.' },
  'H3PO4': { id: 'L4_004', name: 'Phosphoric Acid', inputs: ['H', 'H', 'H', 'P', 'O', 'O', 'O', 'O'], conditions: [], level: 4, reward: 52, fact: 'Phosphoric Acid (H₃PO₄) is used in soft drinks and as a rust remover.' },
  'CCl4': { id: 'L4_005', name: 'Carbon Tetrachloride', inputs: ['C', 'Cl', 'Cl', 'Cl', 'Cl'], conditions: [], level: 4, reward: 50, fact: 'Carbon Tetrachloride (CCl₄) was once used in dry cleaning but is now banned due to toxicity.' },
  'P2O5': { id: 'L4_006', name: 'Phosphorus Pentoxide', inputs: ['P', 'P', 'O', 'O', 'O', 'O', 'O'], conditions: ['heat'], level: 4, reward: 58, fact: 'Phosphorus Pentoxide (P₂O₅) is a powerful dehydrating agent used in organic synthesis.' },

  // Level 5 - Complex compounds
  'CaCl2': { id: 'L5_001', name: 'Calcium Chloride', inputs: ['Ca', 'Cl', 'Cl'], conditions: [], level: 5, reward: 40, fact: 'Calcium Chloride (CaCl₂) is used for de-icing roads and as a drying agent.' },
  'MgCl2': { id: 'L5_002', name: 'Magnesium Chloride', inputs: ['Mg', 'Cl', 'Cl'], conditions: [], level: 5, reward: 42, fact: 'Magnesium Chloride (MgCl₂) is extracted from seawater and used to make magnesium metal.' },
  'Fe2O3': { id: 'L5_003', name: 'Iron Oxide', inputs: ['Fe', 'Fe', 'O', 'O', 'O'], conditions: ['heat'], level: 5, reward: 58, fact: 'Iron Oxide (Fe₂O₃) is rust and gives Mars its red color.' },
  'CuSO4': { id: 'L5_004', name: 'Copper Sulfate', inputs: ['Cu', 'S', 'O', 'O', 'O', 'O'], conditions: [], level: 5, reward: 65, fact: 'Copper Sulfate (CuSO₄) forms beautiful blue crystals and is used as a fungicide.' },
  'ZnO': { id: 'L5_005', name: 'Zinc Oxide', inputs: ['Zn', 'O'], conditions: ['heat'], level: 5, reward: 45, fact: 'Zinc Oxide (ZnO) is used in sunscreen and gives white paint its opacity.' },
  'FeO': { id: 'L5_006', name: 'Iron Monoxide', inputs: ['Fe', 'O'], conditions: ['heat'], level: 5, reward: 40, fact: 'Iron Monoxide (FeO) is found in iron ore and is used in steel production.' },

  // Level 6 - Advanced transition metal compounds
  'TiO2': { id: 'L6_001', name: 'Titanium Dioxide', inputs: ['Ti', 'O', 'O'], conditions: ['heat'], level: 6, reward: 70, fact: 'Titanium Dioxide (TiO₂) is the whitest substance known and used in paint and cosmetics.' },
  'Cr2O3': { id: 'L6_002', name: 'Chromium Oxide', inputs: ['Cr', 'Cr', 'O', 'O', 'O'], conditions: ['heat'], level: 6, reward: 75, fact: 'Chromium Oxide (Cr₂O₃) is used as a green pigment and in metallurgy.' },
  'MnO2': { id: 'L6_003', name: 'Manganese Dioxide', inputs: ['Mn', 'O', 'O'], conditions: ['heat'], level: 6, reward: 68, fact: 'Manganese Dioxide (MnO₂) is used in batteries and as a catalyst.' },
  'CuO': { id: 'L6_004', name: 'Copper Oxide', inputs: ['Cu', 'O'], conditions: ['heat'], level: 6, reward: 50, fact: 'Copper Oxide (CuO) is a black compound used in ceramics and as a catalyst.' },
  'ZnS': { id: 'L6_005', name: 'Zinc Sulfide', inputs: ['Zn', 'S'], conditions: ['heat'], level: 6, reward: 55, fact: 'Zinc Sulfide (ZnS) glows when exposed to light and is used in luminous paints.' },
  'CuS': { id: 'L6_006', name: 'Copper Sulfide', inputs: ['Cu', 'S'], conditions: ['heat'], level: 6, reward: 52, fact: 'Copper Sulfide (CuS) is found in nature as the mineral covellite.' },

  // Level 7 - More advanced compounds
  'NiO': { id: 'L7_001', name: 'Nickel Oxide', inputs: ['Ni', 'O'], conditions: ['heat'], level: 7, reward: 72, fact: 'Nickel Oxide (NiO) is used in ceramics and as a catalyst in fuel cells.' },
  'CoO': { id: 'L7_002', name: 'Cobalt Oxide', inputs: ['Co', 'O'], conditions: ['heat'], level: 7, reward: 78, fact: 'Cobalt Oxide (CoO) produces a deep blue color in glass and ceramics.' },
  'V2O5': { id: 'L7_003', name: 'Vanadium Pentoxide', inputs: ['V', 'V', 'O', 'O', 'O', 'O', 'O'], conditions: ['heat'], level: 7, reward: 85, fact: 'Vanadium Pentoxide (V₂O₅) is used as a catalyst in sulfuric acid production.' },
  'Cr2O7': { id: 'L7_004', name: 'Dichromate', inputs: ['Cr', 'Cr', 'O', 'O', 'O', 'O', 'O'], conditions: ['heat'], level: 7, reward: 88, fact: 'Dichromate compounds are powerful oxidizing agents used in chrome plating.' },
  'MnO': { id: 'L7_005', name: 'Manganese Monoxide', inputs: ['Mn', 'O'], conditions: ['heat'], level: 7, reward: 65, fact: 'Manganese Monoxide (MnO) is used in ferrite production and as a catalyst.' },
  'BrCl': { id: 'L7_006', name: 'Bromine Chloride', inputs: ['Br', 'Cl'], conditions: [], level: 7, reward: 45, fact: 'Bromine Chloride (BrCl) is used as a disinfectant and in organic synthesis.' },

  // Level 8 - Complex halides and advanced compounds
  'AlCl3': { id: 'L8_001', name: 'Aluminum Chloride', inputs: ['Al', 'Cl', 'Cl', 'Cl'], conditions: [], level: 8, reward: 55, fact: 'Aluminum Chloride (AlCl₃) is used as a catalyst in organic chemistry reactions.' },
  'FeCl3': { id: 'L8_002', name: 'Iron Chloride', inputs: ['Fe', 'Cl', 'Cl', 'Cl'], conditions: [], level: 8, reward: 58, fact: 'Iron Chloride (FeCl₃) is used in water treatment and electronics manufacturing.' },
  'GaCl3': { id: 'L8_003', name: 'Gallium Chloride', inputs: ['Ga', 'Cl', 'Cl', 'Cl'], conditions: [], level: 8, reward: 62, fact: 'Gallium Chloride (GaCl₃) is used in the production of gallium metal and semiconductors.' },
  'GeO2': { id: 'L8_004', name: 'Germanium Dioxide', inputs: ['Ge', 'O', 'O'], conditions: ['heat'], level: 8, reward: 68, fact: 'Germanium Dioxide (GeO₂) is used in fiber optics and infrared optics.' },
  'As2O3': { id: 'L8_005', name: 'Arsenic Trioxide', inputs: ['As', 'As', 'O', 'O', 'O'], conditions: ['heat'], level: 8, reward: 70, fact: 'Arsenic Trioxide (As₂O₃) is highly toxic but used in certain medical treatments.' },
  'SeO2': { id: 'L8_006', name: 'Selenium Dioxide', inputs: ['Se', 'O', 'O'], conditions: ['heat'], level: 8, reward: 65, fact: 'Selenium Dioxide (SeO₂) is used as an oxidizing agent in organic synthesis.' }
};

// Compound usage tracking per level
class CompoundTracker {
  constructor() {
    this.usedCompounds = {
      1: new Set(), // Level 1 used compounds
      2: new Set(),
      3: new Set(),
      4: new Set(),
      5: new Set(),
      6: new Set(),
      7: new Set(),
      8: new Set()
    };
  }

  // Get available compounds for a specific level
  getAvailableCompounds(level) {
    const levelCompounds = Object.keys(COMPOUNDS_DB).filter(
      compoundId => COMPOUNDS_DB[compoundId].level === level
    );
    
    // Filter out already used compounds for this level
    return levelCompounds.filter(compoundId => 
      !this.usedCompounds[level].has(compoundId)
    );
  }

  // Mark a compound as used for a specific level
  markAsUsed(compoundId, level) {
    if (this.usedCompounds[level]) {
      this.usedCompounds[level].add(compoundId);
    }
  }

  // Reset used compounds for a level (when all compounds are used)
  resetLevel(level) {
    if (this.usedCompounds[level]) {
      this.usedCompounds[level].clear();
    }
  }

  // Check if all compounds for a level have been used
  isLevelExhausted(level) {
    const levelCompounds = Object.keys(COMPOUNDS_DB).filter(
      compoundId => COMPOUNDS_DB[compoundId].level === level
    );
    return this.usedCompounds[level].size >= levelCompounds.length;
  }

  // Get a random available compound for a level
  getRandomCompound(level) {
    const available = this.getAvailableCompounds(level);
    if (available.length === 0) {
      // If no compounds available, reset the level and try again
      this.resetLevel(level);
      return this.getRandomCompound(level);
    }
    
    const randomIndex = Math.floor(Math.random() * available.length);
    const selectedCompound = available[randomIndex];
    this.markAsUsed(selectedCompound, level);
    return selectedCompound;
  }

  // Save tracking state
  save() {
    const serialized = {};
    for (let level in this.usedCompounds) {
      serialized[level] = Array.from(this.usedCompounds[level]);
    }
    localStorage.setItem('compoundTracker', JSON.stringify(serialized));
  }

  // Load tracking state
  load() {
    const saved = localStorage.getItem('compoundTracker');
    if (saved) {
      const serialized = JSON.parse(saved);
      for (let level in serialized) {
        this.usedCompounds[level] = new Set(serialized[level]);
      }
    }
  }
} 