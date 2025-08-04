// Chemical Reactions Database with Levels
const REACTIONS_DB = {
  // Level 1 - Basic compounds
  'H2O': { name: 'Water', inputs: ['H', 'H', 'O'], conditions: [], level: 1, reward: 10, fact: 'Water (H₂O) is essential for all known forms of life and covers 71% of Earth\'s surface.' },
  'NaCl': { name: 'Sodium Chloride', inputs: ['Na', 'Cl'], conditions: [], level: 1, reward: 15, fact: 'Sodium Chloride (NaCl), table salt, is essential for human life and used to preserve food.' },
  'HCl': { name: 'Hydrochloric Acid', inputs: ['H', 'Cl'], conditions: [], level: 1, reward: 12, fact: 'Hydrochloric Acid (HCl) is found in stomach acid and helps digest food.' },
  'KCl': { name: 'Potassium Chloride', inputs: ['K', 'Cl'], conditions: [], level: 1, reward: 14, fact: 'Potassium Chloride (KCl) is used as a salt substitute and in fertilizers.' },
  'LiF': { name: 'Lithium Fluoride', inputs: ['Li', 'F'], conditions: [], level: 1, reward: 16, fact: 'Lithium Fluoride (LiF) has extremely high ionic character and is used in specialized ceramics.' },

  // Level 2 - More complex molecules
  'CO2': { name: 'Carbon Dioxide', inputs: ['C', 'O', 'O'], conditions: [], level: 2, reward: 18, fact: 'Carbon Dioxide (CO₂) is essential for plant photosynthesis and makes up 0.04% of Earth\'s atmosphere.' },
  'CH4': { name: 'Methane', inputs: ['C', 'H', 'H', 'H', 'H'], conditions: [], level: 2, reward: 22, fact: 'Methane (CH₄) is the main component of natural gas and a potent greenhouse gas.' },
  'NH3': { name: 'Ammonia', inputs: ['N', 'H', 'H', 'H'], conditions: ['heat'], level: 2, reward: 25, fact: 'Ammonia (NH₃) is crucial for fertilizers and is produced industrially via the Haber process.' },
  'H2S': { name: 'Hydrogen Sulfide', inputs: ['H', 'H', 'S'], conditions: [], level: 2, reward: 20, fact: 'Hydrogen Sulfide (H₂S) smells like rotten eggs and is toxic in high concentrations.' },
  'CO': { name: 'Carbon Monoxide', inputs: ['C', 'O'], conditions: ['heat'], level: 2, reward: 18, fact: 'Carbon Monoxide (CO) is a deadly, odorless gas produced by incomplete combustion.' },

  // Level 3 - Intermediate compounds
  'SO2': { name: 'Sulfur Dioxide', inputs: ['S', 'O', 'O'], conditions: ['heat'], level: 3, reward: 30, fact: 'Sulfur Dioxide (SO₂) is used to preserve wine and dried fruits, and causes acid rain.' },
  'NO2': { name: 'Nitrogen Dioxide', inputs: ['N', 'O', 'O'], conditions: ['heat'], level: 3, reward: 32, fact: 'Nitrogen Dioxide (NO₂) is a major air pollutant that gives smog its brown color.' },
  'MgO': { name: 'Magnesium Oxide', inputs: ['Mg', 'O'], conditions: ['heat'], level: 3, reward: 35, fact: 'Magnesium Oxide (MgO) is used as a refractory material and antacid (milk of magnesia).' },
  'CaO': { name: 'Calcium Oxide', inputs: ['Ca', 'O'], conditions: ['heat'], level: 3, reward: 38, fact: 'Calcium Oxide (CaO), quicklime, is used in cement production and steel making.' },
  'NO': { name: 'Nitric Oxide', inputs: ['N', 'O'], conditions: ['heat'], level: 3, reward: 28, fact: 'Nitric Oxide (NO) plays important roles in biology and is a signaling molecule.' },
  'SO3': { name: 'Sulfur Trioxide', inputs: ['S', 'O', 'O', 'O'], conditions: ['heat'], level: 3, reward: 35, fact: 'Sulfur Trioxide (SO₃) is used to make sulfuric acid, one of the most important industrial chemicals.' },

  // Level 4 - Advanced molecules
  'SiO2': { name: 'Silicon Dioxide', inputs: ['Si', 'O', 'O'], conditions: ['heat'], level: 4, reward: 45, fact: 'Silicon Dioxide (SiO₂) forms quartz crystals and is the main component of sand and glass.' },
  'Al2O3': { name: 'Aluminum Oxide', inputs: ['Al', 'Al', 'O', 'O', 'O'], conditions: ['heat'], level: 4, reward: 55, fact: 'Aluminum Oxide (Al₂O₃) is extremely hard and used to make sapphires and rubies.' },
  'PCl3': { name: 'Phosphorus Trichloride', inputs: ['P', 'Cl', 'Cl', 'Cl'], conditions: [], level: 4, reward: 48, fact: 'Phosphorus Trichloride (PCl₃) is used to manufacture organophosphorus compounds.' },
  'H3PO4': { name: 'Phosphoric Acid', inputs: ['H', 'H', 'H', 'P', 'O', 'O', 'O', 'O'], conditions: [], level: 4, reward: 52, fact: 'Phosphoric Acid (H₃PO₄) is used in soft drinks and as a rust remover.' },
  'CCl4': { name: 'Carbon Tetrachloride', inputs: ['C', 'Cl', 'Cl', 'Cl', 'Cl'], conditions: [], level: 4, reward: 50, fact: 'Carbon Tetrachloride (CCl₄) was once used in dry cleaning but is now banned due to toxicity.' },
  'P2O5': { name: 'Phosphorus Pentoxide', inputs: ['P', 'P', 'O', 'O', 'O', 'O', 'O'], conditions: ['heat'], level: 4, reward: 58, fact: 'Phosphorus Pentoxide (P₂O₅) is a powerful dehydrating agent used in organic synthesis.' },

  // Level 5 - Complex compounds
  'CaCl2': { name: 'Calcium Chloride', inputs: ['Ca', 'Cl', 'Cl'], conditions: [], level: 5, reward: 40, fact: 'Calcium Chloride (CaCl₂) is used for de-icing roads and as a drying agent.' },
  'MgCl2': { name: 'Magnesium Chloride', inputs: ['Mg', 'Cl', 'Cl'], conditions: [], level: 5, reward: 42, fact: 'Magnesium Chloride (MgCl₂) is extracted from seawater and used to make magnesium metal.' },
  'Fe2O3': { name: 'Iron Oxide', inputs: ['Fe', 'Fe', 'O', 'O', 'O'], conditions: ['heat'], level: 5, reward: 58, fact: 'Iron Oxide (Fe₂O₃) is rust and gives Mars its red color.' },
  'CuSO4': { name: 'Copper Sulfate', inputs: ['Cu', 'S', 'O', 'O', 'O', 'O'], conditions: [], level: 5, reward: 65, fact: 'Copper Sulfate (CuSO₄) forms beautiful blue crystals and is used as a fungicide.' },
  'ZnO': { name: 'Zinc Oxide', inputs: ['Zn', 'O'], conditions: ['heat'], level: 5, reward: 45, fact: 'Zinc Oxide (ZnO) is used in sunscreen and gives white paint its opacity.' },
  'FeO': { name: 'Iron Monoxide', inputs: ['Fe', 'O'], conditions: ['heat'], level: 5, reward: 40, fact: 'Iron Monoxide (FeO) is found in iron ore and is used in steel production.' },

  // Level 6 - Advanced transition metal compounds
  'TiO2': { name: 'Titanium Dioxide', inputs: ['Ti', 'O', 'O'], conditions: ['heat'], level: 6, reward: 70, fact: 'Titanium Dioxide (TiO₂) is the whitest substance known and used in paint and cosmetics.' },
  'Cr2O3': { name: 'Chromium Oxide', inputs: ['Cr', 'Cr', 'O', 'O', 'O'], conditions: ['heat'], level: 6, reward: 75, fact: 'Chromium Oxide (Cr₂O₃) is used as a green pigment and in metallurgy.' },
  'MnO2': { name: 'Manganese Dioxide', inputs: ['Mn', 'O', 'O'], conditions: ['heat'], level: 6, reward: 68, fact: 'Manganese Dioxide (MnO₂) is used in batteries and as a catalyst.' },
  'CuO': { name: 'Copper Oxide', inputs: ['Cu', 'O'], conditions: ['heat'], level: 6, reward: 50, fact: 'Copper Oxide (CuO) is a black compound used in ceramics and as a catalyst.' },
  'ZnS': { name: 'Zinc Sulfide', inputs: ['Zn', 'S'], conditions: ['heat'], level: 6, reward: 55, fact: 'Zinc Sulfide (ZnS) glows when exposed to light and is used in luminous paints.' },
  'CuS': { name: 'Copper Sulfide', inputs: ['Cu', 'S'], conditions: ['heat'], level: 6, reward: 52, fact: 'Copper Sulfide (CuS) is found in nature as the mineral covellite.' },

  // Level 7 - More advanced compounds
  'NiO': { name: 'Nickel Oxide', inputs: ['Ni', 'O'], conditions: ['heat'], level: 7, reward: 72, fact: 'Nickel Oxide (NiO) is used in ceramics and as a catalyst in fuel cells.' },
  'CoO': { name: 'Cobalt Oxide', inputs: ['Co', 'O'], conditions: ['heat'], level: 7, reward: 78, fact: 'Cobalt Oxide (CoO) produces a deep blue color in glass and ceramics.' },
  'V2O5': { name: 'Vanadium Pentoxide', inputs: ['V', 'V', 'O', 'O', 'O', 'O', 'O'], conditions: ['heat'], level: 7, reward: 85, fact: 'Vanadium Pentoxide (V₂O₅) is used as a catalyst in sulfuric acid production.' },
  'Cr2O7': { name: 'Dichromate', inputs: ['Cr', 'Cr', 'O', 'O', 'O', 'O', 'O'], conditions: ['heat'], level: 7, reward: 88, fact: 'Dichromate compounds are powerful oxidizing agents used in chrome plating.' },
  'MnO': { name: 'Manganese Monoxide', inputs: ['Mn', 'O'], conditions: ['heat'], level: 7, reward: 65, fact: 'Manganese Monoxide (MnO) is used in ferrite production and as a catalyst.' },
  'BrCl': { name: 'Bromine Chloride', inputs: ['Br', 'Cl'], conditions: [], level: 7, reward: 45, fact: 'Bromine Chloride (BrCl) is used as a disinfectant and in organic synthesis.' },

  // Level 8 - Complex halides and advanced compounds
  'AlCl3': { name: 'Aluminum Chloride', inputs: ['Al', 'Cl', 'Cl', 'Cl'], conditions: [], level: 8, reward: 55, fact: 'Aluminum Chloride (AlCl₃) is used as a catalyst in organic chemistry reactions.' },
  'FeCl3': { name: 'Iron Chloride', inputs: ['Fe', 'Cl', 'Cl', 'Cl'], conditions: [], level: 8, reward: 58, fact: 'Iron Chloride (FeCl₃) is used in water treatment and electronics manufacturing.' },
  'GaCl3': { name: 'Gallium Chloride', inputs: ['Ga', 'Cl', 'Cl', 'Cl'], conditions: [], level: 8, reward: 62, fact: 'Gallium Chloride (GaCl₃) is used in the production of gallium metal and semiconductors.' },
  'GeO2': { name: 'Germanium Dioxide', inputs: ['Ge', 'O', 'O'], conditions: ['heat'], level: 8, reward: 68, fact: 'Germanium Dioxide (GeO₂) is used in fiber optics and infrared optics.' },
  'As2O3': { name: 'Arsenic Trioxide', inputs: ['As', 'As', 'O', 'O', 'O'], conditions: ['heat'], level: 8, reward: 70, fact: 'Arsenic Trioxide (As₂O₃) is highly toxic but used in certain medical treatments.' },
  'SeO2': { name: 'Selenium Dioxide', inputs: ['Se', 'O', 'O'], conditions: ['heat'], level: 8, reward: 65, fact: 'Selenium Dioxide (SeO₂) is used as an oxidizing agent in organic synthesis.' },

  // Level 9 - Precious metal and rare compounds
  'Ag2O': { name: 'Silver Oxide', inputs: ['Ag', 'Ag', 'O'], conditions: ['heat'], level: 9, reward: 95, fact: 'Silver Oxide (Ag₂O) is used in silver-zinc batteries and has antimicrobial properties.' },
  'SnO2': { name: 'Tin Dioxide', inputs: ['Sn', 'O', 'O'], conditions: ['heat'], level: 9, reward: 75, fact: 'Tin Dioxide (SnO₂) is used as a transparent conductor in LCD displays.' },
  'HgO': { name: 'Mercury Oxide', inputs: ['Hg', 'O'], conditions: ['heat'], level: 9, reward: 85, fact: 'Mercury Oxide (HgO) was historically used in batteries but is now restricted due to toxicity.' },
  'PbO': { name: 'Lead Oxide', inputs: ['Pb', 'O'], conditions: ['heat'], level: 9, reward: 70, fact: 'Lead Oxide (PbO) is used in lead-acid batteries and crystal glass production.' },
  'Bi2O3': { name: 'Bismuth Oxide', inputs: ['Bi', 'Bi', 'O', 'O', 'O'], conditions: ['heat'], level: 9, reward: 88, fact: 'Bismuth Oxide (Bi₂O₃) is used in ceramics and as a catalyst.' },
  'SrO': { name: 'Strontium Oxide', inputs: ['Sr', 'O'], conditions: ['heat'], level: 9, reward: 80, fact: 'Strontium Oxide (SrO) is used in fireworks to produce red colors.' },

  // Level 10 - Noble metal compounds
  'AuCl3': { name: 'Gold Chloride', inputs: ['Au', 'Cl', 'Cl', 'Cl'], conditions: [], level: 10, reward: 120, fact: 'Gold Chloride (AuCl₃) is used in gold plating and photography.' },
  'PtCl2': { name: 'Platinum Chloride', inputs: ['Pt', 'Cl', 'Cl'], conditions: [], level: 10, reward: 125, fact: 'Platinum Chloride (PtCl₂) is used in cancer chemotherapy drugs like cisplatin.' },
  'PdCl2': { name: 'Palladium Chloride', inputs: ['Pd', 'Cl', 'Cl'], conditions: [], level: 10, reward: 110, fact: 'Palladium Chloride (PdCl₂) is used as a catalyst in organic synthesis.' },
  'AgCl': { name: 'Silver Chloride', inputs: ['Ag', 'Cl'], conditions: [], level: 10, reward: 85, fact: 'Silver Chloride (AgCl) is used in photography and as an antimicrobial agent.' },
  'CdO': { name: 'Cadmium Oxide', inputs: ['Cd', 'O'], conditions: ['heat'], level: 10, reward: 90, fact: 'Cadmium Oxide (CdO) is used in batteries and as a semiconductor.' },
  'Y2O3': { name: 'Yttrium Oxide', inputs: ['Y', 'Y', 'O', 'O', 'O'], conditions: ['heat'], level: 10, reward: 100, fact: 'Yttrium Oxide (Y₂O₃) is used in phosphors for color TV tubes and LEDs.' },

  // Level 11 - Advanced rare earth compounds
  'La2O3': { name: 'Lanthanum Oxide', inputs: ['La', 'La', 'O', 'O', 'O'], conditions: ['heat'], level: 11, reward: 105, fact: 'Lanthanum Oxide (La₂O₃) is used in camera lenses and as a catalyst.' },
  'CeO2': { name: 'Cerium Oxide', inputs: ['Ce', 'O', 'O'], conditions: ['heat'], level: 11, reward: 95, fact: 'Cerium Oxide (CeO₂) is used in catalytic converters and glass polishing.' },
  'BaO': { name: 'Barium Oxide', inputs: ['Ba', 'O'], conditions: ['heat'], level: 11, reward: 85, fact: 'Barium Oxide (BaO) is used in ceramics and as a drying agent.' },
  'ZrO2': { name: 'Zirconium Dioxide', inputs: ['Zr', 'O', 'O'], conditions: ['heat'], level: 11, reward: 100, fact: 'Zirconium Dioxide (ZrO₂) is extremely hard and used in dental implants and jewelry.' },
  'Nb2O5': { name: 'Niobium Pentoxide', inputs: ['Nb', 'Nb', 'O', 'O', 'O', 'O', 'O'], conditions: ['heat'], level: 11, reward: 115, fact: 'Niobium Pentoxide (Nb₂O₅) is used in capacitors and optical coatings.' },
  'MoO3': { name: 'Molybdenum Trioxide', inputs: ['Mo', 'O', 'O', 'O'], conditions: ['heat'], level: 11, reward: 108, fact: 'Molybdenum Trioxide (MoO₃) is used as a catalyst and in steel production.' },

  // Level 12 - Radioactive and highly advanced compounds
  'UO2': { name: 'Uranium Dioxide', inputs: ['U', 'O', 'O'], conditions: ['heat'], level: 12, reward: 200, fact: 'Uranium Dioxide (UO₂) is used as nuclear fuel in power reactors.' },
  'ThO2': { name: 'Thorium Dioxide', inputs: ['Th', 'O', 'O'], conditions: ['heat'], level: 12, reward: 180, fact: 'Thorium Dioxide (ThO₂) has the highest melting point of any oxide and is used in gas mantles.' },
  'WO3': { name: 'Tungsten Trioxide', inputs: ['W', 'O', 'O', 'O'], conditions: ['heat'], level: 12, reward: 130, fact: 'Tungsten Trioxide (WO₃) is used in smart windows that can change opacity.' },
  'RnF2': { name: 'Radon Fluoride', inputs: ['Rn', 'F', 'F'], conditions: [], level: 12, reward: 250, fact: 'Radon Fluoride (RnF₂) is extremely unstable and radioactive, existing only briefly.' },
  'CsF': { name: 'Cesium Fluoride', inputs: ['Cs', 'F'], conditions: [], level: 12, reward: 120, fact: 'Cesium Fluoride (CsF) is highly soluble and used in organic synthesis.' },
  'TcO2': { name: 'Technetium Dioxide', inputs: ['Tc', 'O', 'O'], conditions: ['heat'], level: 12, reward: 200, fact: 'Technetium Dioxide (TcO₂) is radioactive and used in medical imaging.' },

  // Level 13-15 - Superheavy and exotic compounds
  'HfO2': { name: 'Hafnium Dioxide', inputs: ['Hf', 'O', 'O'], conditions: ['heat'], level: 13, reward: 140, fact: 'Hafnium Dioxide (HfO₂) is used in advanced computer chips as a gate dielectric.' },
  'Ta2O5': { name: 'Tantalum Pentoxide', inputs: ['Ta', 'Ta', 'O', 'O', 'O', 'O', 'O'], conditions: ['heat'], level: 13, reward: 155, fact: 'Tantalum Pentoxide (Ta₂O₅) is used in capacitors for electronic devices.' },
  'ReO3': { name: 'Rhenium Trioxide', inputs: ['Re', 'O', 'O', 'O'], conditions: ['heat'], level: 14, reward: 175, fact: 'Rhenium Trioxide (ReO₃) is one of the few metallic oxides and conducts electricity.' },
  'OsO4': { name: 'Osmium Tetroxide', inputs: ['Os', 'O', 'O', 'O', 'O'], conditions: ['heat'], level: 14, reward: 190, fact: 'Osmium Tetroxide (OsO₄) is extremely toxic and used in electron microscopy staining.' },
  'IrO2': { name: 'Iridium Dioxide', inputs: ['Ir', 'O', 'O'], conditions: ['heat'], level: 14, reward: 185, fact: 'Iridium Dioxide (IrO₂) is extremely corrosion resistant and used in electrodes.' },
  'PuO2': { name: 'Plutonium Dioxide', inputs: ['Pu', 'O', 'O'], conditions: ['heat'], level: 15, reward: 500, fact: 'Plutonium Dioxide (PuO₂) is highly radioactive and used in nuclear weapons and RTGs.' },
  'AmO2': { name: 'Americium Dioxide', inputs: ['Am', 'O', 'O'], conditions: ['heat'], level: 15, reward: 450, fact: 'Americium Dioxide (AmO₂) is used in smoke detectors and neutron sources.' },
  'CmO2': { name: 'Curium Dioxide', inputs: ['Cm', 'O', 'O'], conditions: ['heat'], level: 15, reward: 480, fact: 'Curium Dioxide (CmO₂) glows in the dark due to its intense radioactivity.' }
};
