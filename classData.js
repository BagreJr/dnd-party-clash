// Lightweight class metadata distilled from the files in /Class.
// Add or tweak entries here when you add new homebrew classes.
const DND_CLASS_DATA = {
  Alchemist: {
    hitDie: 8,
    classGroup: "support",
    roles: ["DPS_RANGED", "SUPPORT", "TACTICIAN"],
    tags: ["dps", "support", "buffer", "debuffer"],
    features: ["Bombs", "Bomb Formulae", "Reagents"],
    attackStyle: "explosive",
    armorProfile: "light",
    primaryStat: "INT"
  },
  Artificer: {
    hitDie: 8,
    classGroup: "support",
    roles: ["SUPPORT", "TACTICIAN", "DPS_RANGED"],
    tags: ["support", "spellcaster", "buffer"],
    features: ["Spellcasting", "Infusions", "Arcane Craft"],
    spellcasting: true,
    attackStyle: "hybrid",
    armorProfile: "medium",
    primaryStat: "INT"
  },
  Barbarian: {
    hitDie: 12,
    classGroup: "tank",
    roles: ["FRONTLINER", "DPS_MELEE"],
    tags: ["tank", "dps"],
    features: ["Rage", "Rage Damage", "Extra Attack"],
    extraAttackAt: 5,
    attackStyle: "melee",
    armorProfile: "unarmoredCon",
    primaryStat: "STR"
  },
  Bard: {
    hitDie: 8,
    classGroup: "support",
    roles: ["SUPPORT", "TACTICIAN", "DPS_RANGED"],
    tags: ["support", "spellcaster", "buffer", "debuffer"],
    features: ["Spellcasting", "Bardic Inspiration"],
    spellcasting: true,
    attackStyle: "support",
    armorProfile: "light",
    primaryStat: "CHA"
  },
  Binder: {
    hitDie: 8,
    classGroup: "arcane",
    roles: ["DPS_RANGED", "TACTICIAN", "SUPPORT"],
    tags: ["spellcaster", "debuffer", "support"],
    features: ["Pact Binding", "Vestiges", "Occult Magic"],
    spellcasting: true,
    attackStyle: "magic",
    armorProfile: "light",
    primaryStat: "CHA"
  },
  "Blood Hunter": {
    hitDie: 12,
    classGroup: "skirmisher",
    roles: ["FRONTLINER", "DPS_MELEE", "TACTICIAN"],
    tags: ["dps", "debuffer"],
    features: ["Crimson Rite", "Blood Maledict", "Extra Attack"],
    extraAttackAt: 5,
    attackStyle: "melee",
    armorProfile: "medium",
    primaryStat: "DEX"
  },
  Captain: {
    hitDie: 8,
    classGroup: "support",
    roles: ["TACTICIAN", "SUPPORT", "FRONTLINER"],
    tags: ["support", "tactician", "buffer"],
    features: ["Commands", "Leadership", "Cohort"],
    attackStyle: "support",
    armorProfile: "medium",
    primaryStat: "CHA"
  },
  Cleric: {
    hitDie: 8,
    classGroup: "divine",
    roles: ["SUPPORT", "FRONTLINER", "DPS_RANGED"],
    tags: ["support", "spellcaster", "healer", "buffer"],
    features: ["Spellcasting", "Channel Divinity"],
    spellcasting: true,
    attackStyle: "support",
    armorProfile: "medium",
    primaryStat: "WIS"
  },
  Commoner: {
    hitDie: 8,
    classGroup: "support",
    roles: ["SUPPORT", "TACTICIAN"],
    tags: ["support"],
    features: ["Common Resourcefulness"],
    attackStyle: "support",
    armorProfile: "light",
    primaryStat: "WIS"
  },
  Craftsman: {
    hitDie: 10,
    classGroup: "support",
    roles: ["SUPPORT", "TACTICIAN", "FRONTLINER"],
    tags: ["support", "buffer"],
    features: ["Crafting", "Construct", "Field Repairs"],
    attackStyle: "hybrid",
    armorProfile: "medium",
    primaryStat: "INT"
  },
  Druid: {
    hitDie: 8,
    classGroup: "primal",
    roles: ["SUPPORT", "DPS_RANGED", "FRONTLINER"],
    tags: ["support", "spellcaster", "healer", "debuffer"],
    features: ["Spellcasting", "Wild Shape"],
    spellcasting: true,
    attackStyle: "magic",
    armorProfile: "medium",
    primaryStat: "WIS"
  },
  Fighter: {
    hitDie: 10,
    classGroup: "martial",
    roles: ["FRONTLINER", "DPS_MELEE", "TACTICIAN"],
    tags: ["tank", "dps"],
    features: ["Second Wind", "Action Surge", "Extra Attack"],
    extraAttackAt: 5,
    attackStyle: "melee",
    armorProfile: "heavy",
    primaryStat: "STR"
  },
  Gadgeteer: {
    hitDie: 6,
    classGroup: "ranged",
    roles: ["DPS_RANGED", "TACTICIAN", "SUPPORT"],
    tags: ["dps", "support", "debuffer"],
    features: ["Gadgets", "Drone", "Construct Grafts"],
    attackStyle: "ranged",
    armorProfile: "light",
    primaryStat: "INT"
  },
  Gunslinger: {
    hitDie: 8,
    classGroup: "ranged",
    roles: ["DPS_RANGED", "TACTICIAN"],
    tags: ["dps", "tactician"],
    features: ["Firearms", "Trick Shots", "Extra Attack"],
    extraAttackAt: 5,
    attackStyle: "firearm",
    armorProfile: "light",
    primaryStat: "DEX"
  },
  Illrigger: {
    hitDie: 10,
    classGroup: "martial",
    roles: ["FRONTLINER", "DPS_MELEE", "TACTICIAN"],
    tags: ["tank", "dps", "debuffer"],
    features: ["Baleful Interdict", "Infernal Conduit", "Extra Attack"],
    extraAttackAt: 5,
    attackStyle: "melee",
    armorProfile: "heavy",
    primaryStat: "CHA"
  },
  Investigator: {
    hitDie: 8,
    classGroup: "skirmisher",
    roles: ["TACTICIAN", "DPS_RANGED", "SUPPORT"],
    tags: ["tactician", "dps", "support"],
    features: ["Investigation", "Exploit Weakness", "Expertise"],
    attackStyle: "ranged",
    armorProfile: "light",
    primaryStat: "INT"
  },
  Magus: {
    hitDie: 10,
    classGroup: "martial",
    roles: ["DPS_MELEE", "DPS_RANGED", "TACTICIAN"],
    tags: ["dps", "spellcaster"],
    features: ["Spellcasting", "Spellstrike", "Extra Attack"],
    spellcasting: true,
    extraAttackAt: 5,
    attackStyle: "hybrid",
    armorProfile: "medium",
    primaryStat: "INT"
  },
  Martyr: {
    hitDie: 12,
    classGroup: "tank",
    roles: ["FRONTLINER", "SUPPORT", "DPS_MELEE"],
    tags: ["tank", "support", "healer"],
    features: ["Martyrdom", "Sacrifice", "Divine Healing"],
    attackStyle: "melee",
    armorProfile: "heavy",
    primaryStat: "WIS"
  },
  Monk: {
    hitDie: 8,
    classGroup: "skirmisher",
    roles: ["DPS_MELEE", "TACTICIAN"],
    tags: ["dps", "tactician"],
    features: ["Martial Arts", "Ki", "Evasion", "Extra Attack"],
    extraAttackAt: 5,
    attackStyle: "melee",
    armorProfile: "unarmoredWis",
    primaryStat: "DEX"
  },
  Necromancer: {
    hitDie: 6,
    classGroup: "arcane",
    roles: ["DPS_RANGED", "TACTICIAN", "SUPPORT"],
    tags: ["spellcaster", "dps", "debuffer"],
    features: ["Spellcasting", "Undead Thralls", "Necromancy"],
    spellcasting: true,
    attackStyle: "magic",
    armorProfile: "caster",
    primaryStat: "INT"
  },
  Paladin: {
    hitDie: 10,
    classGroup: "martial",
    roles: ["FRONTLINER", "SUPPORT", "DPS_MELEE"],
    tags: ["tank", "dps", "support", "healer"],
    features: ["Lay on Hands", "Divine Smite", "Spellcasting", "Extra Attack"],
    spellcasting: true,
    extraAttackAt: 5,
    attackStyle: "melee",
    armorProfile: "heavy",
    primaryStat: "CHA"
  },
  Psion: {
    hitDie: 6,
    classGroup: "arcane",
    roles: ["DPS_RANGED", "TACTICIAN", "SUPPORT"],
    tags: ["spellcaster", "dps", "debuffer", "tactician"],
    features: ["Psionics", "Mental Discipline"],
    spellcasting: true,
    attackStyle: "magic",
    armorProfile: "caster",
    primaryStat: "INT"
  },
  Ranger: {
    hitDie: 10,
    classGroup: "ranged",
    roles: ["DPS_RANGED", "DPS_MELEE", "FRONTLINER", "TACTICIAN"],
    tags: ["dps", "tactician", "spellcaster"],
    features: ["Spellcasting", "Favored Enemy", "Extra Attack"],
    spellcasting: true,
    extraAttackAt: 5,
    attackStyle: "ranged",
    armorProfile: "medium",
    primaryStat: "WIS"
  },
  Rogue: {
    hitDie: 8,
    classGroup: "skirmisher",
    roles: ["DPS_MELEE", "TACTICIAN", "DPS_RANGED"],
    tags: ["dps", "tactician"],
    features: ["Sneak Attack", "Uncanny Dodge", "Evasion"],
    attackStyle: "melee",
    armorProfile: "light",
    primaryStat: "DEX"
  },
  Savant: {
    hitDie: 8,
    classGroup: "support",
    roles: ["TACTICIAN", "SUPPORT", "DPS_RANGED"],
    tags: ["support", "tactician", "buffer"],
    features: ["Analysis", "Expertise", "Intellect Die"],
    attackStyle: "support",
    armorProfile: "light",
    primaryStat: "INT"
  },
  Shaman: {
    hitDie: 8,
    classGroup: "primal",
    roles: ["SUPPORT", "TACTICIAN", "DPS_RANGED"],
    tags: ["support", "spellcaster", "healer", "debuffer"],
    features: ["Spellcasting", "Spirits", "Totems"],
    spellcasting: true,
    attackStyle: "magic",
    armorProfile: "medium",
    primaryStat: "WIS"
  },
  Sorcerer: {
    hitDie: 6,
    classGroup: "arcane",
    roles: ["DPS_RANGED", "TACTICIAN"],
    tags: ["spellcaster", "dps"],
    features: ["Spellcasting", "Metamagic"],
    spellcasting: true,
    attackStyle: "magic",
    armorProfile: "caster",
    primaryStat: "CHA"
  },
  Vagabond: {
    hitDie: 10,
    classGroup: "skirmisher",
    roles: ["DPS_MELEE", "TACTICIAN", "FRONTLINER"],
    tags: ["dps", "tactician"],
    features: ["Wanderer", "Survival Tricks", "Extra Attack"],
    extraAttackAt: 5,
    attackStyle: "melee",
    armorProfile: "medium",
    primaryStat: "DEX"
  },
  Vessel: {
    hitDie: 10,
    classGroup: "martial",
    roles: ["FRONTLINER", "DPS_MELEE", "SUPPORT"],
    tags: ["tank", "dps", "support"],
    features: ["Spirit Vessel", "Channel Spirit", "Possession"],
    attackStyle: "hybrid",
    armorProfile: "medium",
    primaryStat: "CHA"
  },
  Warden: {
    hitDie: 12,
    classGroup: "tank",
    roles: ["FRONTLINER", "SUPPORT", "DPS_MELEE"],
    tags: ["tank", "support"],
    features: ["Guardian Tactics", "Mettle", "Survive", "Extra Attack"],
    extraAttackAt: 5,
    attackStyle: "melee",
    armorProfile: "heavy",
    primaryStat: "CON"
  },
  Warlock: {
    hitDie: 8,
    classGroup: "arcane",
    roles: ["DPS_RANGED", "TACTICIAN", "SUPPORT"],
    tags: ["spellcaster", "dps", "debuffer"],
    features: ["Pact Magic", "Eldritch Blast", "Invocations"],
    spellcasting: true,
    attackStyle: "magic",
    armorProfile: "light",
    primaryStat: "CHA"
  },
  Warlord: {
    hitDie: 10,
    classGroup: "support",
    roles: ["TACTICIAN", "SUPPORT", "FRONTLINER"],
    tags: ["support", "tactician", "buffer", "tank"],
    features: ["Commands", "Battlefield Leadership", "Protege"],
    attackStyle: "melee",
    armorProfile: "heavy",
    primaryStat: "CHA"
  },
  Warmage: {
    hitDie: 8,
    classGroup: "arcane",
    roles: ["DPS_RANGED", "TACTICIAN"],
    tags: ["spellcaster", "dps", "tactician"],
    features: ["Spellcasting", "Arcane Surge", "Arcane Fighting Style"],
    spellcasting: true,
    attackStyle: "magic",
    armorProfile: "caster",
    primaryStat: "INT"
  },
  Witch: {
    hitDie: 8,
    classGroup: "arcane",
    roles: ["DPS_RANGED", "TACTICIAN", "SUPPORT"],
    tags: ["spellcaster", "debuffer", "support"],
    features: ["Spellcasting", "Hexes", "Witch Curse"],
    spellcasting: true,
    attackStyle: "magic",
    armorProfile: "caster",
    primaryStat: "CHA"
  },
  Wizard: {
    hitDie: 6,
    classGroup: "arcane",
    roles: ["DPS_RANGED", "TACTICIAN"],
    tags: ["spellcaster", "dps", "tactician"],
    features: ["Spellcasting", "Ritual Casting", "Arcane Recovery"],
    spellcasting: true,
    attackStyle: "magic",
    armorProfile: "caster",
    primaryStat: "INT"
  },
  "Rogue, Warlord": {
    hitDie: 12,
    classGroup: "skirmisher",
    roles: ["TACTICIAN"],
    tags: ["debuffer","buffer"],
    features: ["Crimson Rite", "Blood Maledict", "Sneak Attack"],
    extraAttackAt: 5,
    attackStyle: "ranged",
    armorProfile: "medium",
    primaryStat: "DEX"
  }
};

if (typeof globalThis !== "undefined") {
  globalThis.DND_CLASS_DATA = DND_CLASS_DATA;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { DND_CLASS_DATA };
}
