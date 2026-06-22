// Shared role ids used by cards, role assignment, scoring, and enemy generation.
const ROLE_ORDER = [
  "FRONTLINER",
  "DPS_MELEE",
  "DPS_RANGED",
  "SUPPORT",
  "TACTICIAN"
];

const ROLE_LABELS = {
  FRONTLINER: "Frontliner",
  DPS_MELEE: "DPS Melee",
  DPS_RANGED: "DPS Rango",
  SUPPORT: "Support",
  TACTICIAN: "Tactician"
};

// Example draft pool: each source party has 4 to 7 characters.
// To add a character by hand, copy one object and edit the visible fields.
// armorClass is optional: if it is missing, CR estimates AC from classData.js armorProfile + DEX/stats.
// For exact AC, put armorClass manually or use hasShield/shieldBonus/armorBonus/magicArmorBonus.
// hitPoints is optional: if it is missing, CR estimates HP from classData.js hitDie + CON + level.
// attacks is optional too; add damageType/damageTypes only when you want precise weapon damage.
// Role preferences come from classData.js + subclassData.js by className + subclass.
// Optional advanced fields are supported too: rolePriority, compatibleRoles, tags, affinities, and classGroup.
// Use rolePriority only for a character that should override its class/subclass default.
// className is matched against classData.js first, so classGroup is only needed for new/unlisted classes.
// classGroup helps custom classes: martial, tank, skirmisher, ranged, arcane, divine, primal, support.
// Spell names are matched against Class/spells.json through spellData.js; use the same spelling when possible.
// Damage spells infer Fire, Cold, Poison, Thunder, Acid, Lightning, Radiant, Necrotic, Force, and Psychic.
// Affinity scores can use -3..+3 as relationship ranks, or larger numbers as direct score points.
const DND_PARTIES = [
  {
    id: "Fighter-Party",
    name: "Fighter Party",
    theme: "Heroes con AC, fuerza y suerte.",
    characters: [
      {
        id: "Vann",
        name: "Vann",
        className: "Fighter",
        subclass: "Arcane Knight",
        level: 8,
        armorClass: 20,
        stats: { STR: 18, DEX: 12, CON: 17, INT: 12, WIS: 13, CHA: 10 },
        spells: [],
        affinities: {
          "Argos": { score: 1, note: "Tanques que pelearon en conjunto" }
        },
      },
      {
        id: "Argos",
        name: "Argos",
        className: "Paladin",
        subclass: "Oath of Redemption",
        level: 8,
        armorClass: 18,
        stats: { STR: 18, DEX: 10, CON: 16, INT: 12, WIS: 10, CHA: 15 },
        spells: ["sanctuary", "hold person", "counterspell"],
        affinities: {
          "Jhonny": { score: -1, note: "Enemigo de amor de Jhonny." }
        },
      },
      {
        id: "Jhonny",
        name: "Jhonny Bless",
        className: "Sorcerer",
        subclass: "Wild Magic",
        level: 8,
        armorClass: 20,
        stats: { STR: 14, DEX: 9, CON: 12, INT: 11, WIS: 11, CHA: 16 },
        spells: ["Fireball", "Scorching Ray", "Aganazzar's Scorcher"],
        affinities: {
          "Rubi": { score: -1, note: "No le cae bien." },
          "Argos": { score: -1, note: "Estuvo con la 'novia' de Argos." }
        },
        tags: ["comico"],
      },
      {
        id: "Rubi",
        name: "Rubi",
        className: "Fighter",
        subclass: "Champion",
        level: 8,
        armorClass: 17,
        stats: { STR: 10, DEX: 18, CON: 15, INT: 12, WIS: 11, CHA: 11 },
        spells: [],
      }
    ]
  },
  {
    id: "Tracendencia",
    name: "Tracendencia Party",
    theme: "Seguidores de Dios en la tierra.",
    characters: [
      {
        id: "Dagon",
        name: "Dagon Bronn",
        className: "Barbarian",
        subclass: "Path of the Beast",
        level: 7,
        armorClass: 17,
        stats: { STR: 18, DEX: 16, CON: 18, INT: 9, WIS: 11, CHA: 13 },
        spells: [],
        affinities: {
          "Dion": { score: 2, note: "Ve a Dios y se motiva mas" },
          "Beyond": { score: 2, note: "Dos tontos muy fuertes." }
        },
      },
      {
        id: "Beyond",
        name: "Beyond Saeltas",
        className: "Paladin",
        subclass: "Oath of Redemption",
        level: 7,
        armorClass: 18,
        stats: { STR: 18, DEX: 11, CON: 18, INT: 7, WIS: 10, CHA: 16 },
        spells: ["Command","Sanctuary", "Find Steed"],
        affinities: {
          "Dion": { score: 2, note: "Dione es su Dios" },
          "Beyond": { score: 2, note: "Dos tontos muy fuertes." }
        },
      },
      {
        id: "Dion",
        name: "Dione",
        className: "Cleric",
        subclass: "Life Domain",
        level: 7,
        armorClass: 22,
        stats: { STR: 12, DEX: 8, CON: 20, INT: 10, WIS: 15, CHA: 9 },
        spells: ["Cure Wounds", "Lesser Restoration", "Beacon of Hope"],
      },
      {
        id: "Brakcius",
        name: "Brakcius",
        className: "Fighter",
        subclass: "Rune Knight",
        level: 9,
        armorClass: 20,
        stats: { STR: 18, DEX: 16, CON: 16, INT: 8, WIS: 10, CHA: 14 },
        spells: [],
      },
      {
        id: "Mizkisha",
        name: "Mizkisha",
        className: "Monk",
        subclass: "Way of the Shadow Arts",
        level: 8,
        armorClass: 17,
        stats: { STR: 12, DEX: 18, CON: 14, INT: 7, WIS: 16, CHA: 10 },
        spells: [],
        affinities: {
          "Dion": { score: 1, note: "Dione es su estatua" }
        },
        tags: ["comico"],
      }
    ]
  },
  {
    id: "Tracendencia2",
    name: "Tracendencia Party 2",
    theme: "Soberbios y Humildes.",
    characters: [
      {
        id: "Gael",
        name: "Gael De Artoas",
        className: "Sorcerer",
        subclass: "Gifted One",
        level: 7,
        armorClass: 16,
        stats: { STR: 5, DEX: 16, CON: 16, INT: 10, WIS: 5, CHA: 20 },
        spells: ["Fireball","Counterspell","Gravity Sinkhole"],
        affinities: {
          "Yotta": { score: 1, note: "Yotta es su amigo" }
        },
      },
      {
        id: "Yotta",
        name: "Yotta",
        className: "Sorcerer",
        subclass: "Shadow",
        level: 7,
        armorClass: 16,
        stats: { STR: 16, DEX: 16, CON: 18, INT: 12, WIS: 7, CHA: 20 },
        spells: ["Shadow of Moil","Darkness","Shadow Blade"],
        affinities: {
          "Gael": { score: 1, note: "Gael es su unico amigo" }
        },
      },
      {
        id: "Arminio",
        name: "Arminio",
        className: "Barbarian",
        subclass: "Path of the Juggernaut",
        level: 7,
        armorClass: 16,
        stats: { STR: 18, DEX: 14, CON: 16, INT: 10, WIS: 14, CHA: 12 },
        spells: [],
      },
      {
        id: "Metis",
        name: "Metis",
        className: "Monk",
        subclass: "Way of the Drunken Fist",
        level: 6,
        armorClass: 16,
        stats: { STR: 12, DEX: 18, CON: 10, INT: 6, WIS: 14, CHA: 12 },
        spells: [],
      },
      {
        id: "Omar",
        name: "Omar",
        className: "Bard",
        subclass: "College of Lore",
        level: 6,
        armorClass: 16,
        stats: { STR: 18, DEX: 13, CON: 16, INT: 9, WIS: 11, CHA: 11 },
        spells: ["Calm Emotions", "Warcry", "Vicious Mockery"],
      }
    ]
  },
  {
    id: "Auk-Eman",
    name: "Auk Eman Party",
    theme: "Pobres sin pesar ni etica.",
    characters: [
      {
        id: "Giovanni",
        name: "Giovanni Giovanni",
        className: "Rogue",
        subclass: "Thief",
        level: 3,
        armorClass: 13,
        stats: { STR: 8, DEX: 16, CON: 13, INT: 12, WIS: 14, CHA: 15 },
        spells: [],
        affinities: {
          "Guileas": { score: 20, note: "Auk Eman Forever" },
          "Noulan": { score: 20, note: "Auk Eman Forever" }
        },
        tags: ["comico"],
      },
      {
        id: "Guileas",
        name: "Guiileas Akkad",
        className: "Fighter",
        subclass: "Master at Arms",
        level: 3,
        armorClass: 17,
        stats: { STR: 18, DEX: 14, CON: 16, INT: 10, WIS: 7, CHA: 12 },
        spells: [],
        affinities: {
          "Giovanni": { score: 20, note: "Auk Eman Forever" },
          "Noulan": { score: 20, note: "Auk Eman Forever" }
        },
        tags: ["comico"],
      },
      {
        id: "Noulan",
        name: "Noulan Elregente",
        className: "Paladin",
        subclass: "Oath of Glory",
        level: 3,
        armorClass: 16,
        stats: { STR: 18, DEX: 8, CON: 14, INT: 2, WIS: 12, CHA: 14 },
        spells: ["Bagre's Cortito", "Guiding Bolt", "Shield of Faith"],
        affinities: {
          "Giovanni": { score: 20, note: "Auk Eman Forever" },
          "Guileas": { score: 20, note: "Auk Eman Forever" }
        },
        tags: ["comico"],
      }
    ]
  },
  {
    id: "Dark-Eternum",
    name: "Gamer Party",
    theme: "Jugamos a ser gamers UwU.",
    characters: [
      {
        id: "Obelisko2",
        name: "Obelisko2",
        className: "Rogue",
        subclass: "Mastermind",
        level: 5,
        armorClass: 17,
        stats: { STR: 15, DEX: 20, CON: 18, INT: 15, WIS: 10, CHA: 13 },
        spells: [],
      },
      {
        id: "Zero-Snake",
        name: "Zero Snake",
        className: "Craftsman",
        subclass: "Mechanauts’ Guild",
        level: 4,
        armorClass: 17,
        stats: { STR: 18, DEX: 13, CON: 14, INT: 18, WIS: 15, CHA: 7 },
        spells: [],
      },
      {
        id: "Torin",
        name: "Torin el Ferviente",
        className: "Cleric",
        subclass: "Forge Domain",
        level: 4,
        armorClass: 20,
        stats: { STR: 15, DEX: 8, CON: 14, INT: 9, WIS: 18, CHA: 9 },
        spells: ["Heat Metal","Spiritual Weapon","Magic Weapon"],
      },
      {
        id: "PrincesaTuttiFrutti",
        name: "♥PrincesaTuttiFrutti♥",
        className: "Sorcerer",
        subclass: "Divine Right",
        level: 4,
        armorClass: 12,
        stats: { STR: 11, DEX: 14, CON: 14, INT: 12, WIS: 16, CHA: 18 },
        spells: ["Magic Missile", "Candy Blast", "Maximilian's Earthen Grasp"],
      },
    ]
  },
  {
    id: "Nexus-Arcana",
    name: "Future Party",
    theme: "Una Kpoper, una tostadora, un jubilado, su hija y Karl.",
    characters: [
      {
        id: "Karl-Mac-Dhiarmaid",
        name: "Karl Mac Dhiarmaid",
        className: "Barbarian",
        subclass: "Path of the Titan",
        level: 3,
        armorClass: 14,
        stats: { STR: 19, DEX: 12, CON: 16, INT: 12, WIS: 12, CHA: 8 },
        spells: [],
      },
      {
        id: "Barian",
        name: "Barian",
        className: "Monk",
        subclass: "Way of Gravity",
        level: 3,
        armorClass: 14,
        stats: { STR: 11, DEX: 18, CON: 17, INT: 14, WIS: 14, CHA: 4 },
        spells: [],
        affinities: {
          "Adom": { score: 20, note: "Robots" },
          "Lucia-Mars": { score: 20, note: "Reparacion y actualizacion" }
        },
      },
      {
        id: "Lucia-Mars",
        name: "Lucia Mars",
        className: "Gadgeteer",
        subclass: "Drone Jockey",
        level: 3,
        armorClass: 17,
        stats: { STR: 11, DEX: 16, CON: 12, INT: 18, WIS: 16, CHA: 10 },
        spells: [],
        affinities: {
          "Oscar-Mars": { score: 2, note: "Padre" },
          "Barian": { score: 2, note: "Reparacion y actualizacion" }
        },
      },
      {
        id: "CANARIO",
        name: "☆CANARIO 22☆",
        className: "Fighter",
        subclass: "Bone Knight",
        level: 3,
        armorClass: 18,
        stats: { STR: 10, DEX: 18, CON: 15, INT: 9, WIS: 8, CHA: 12 },
        spells: [],
        affinities: {
        },
      },
      {
        id: "Oscar-Mars",
        name: "Oscar Mars",
        className: "Warlock",
        subclass: "The Symbiont",
        level: 3,
        armorClass: 16,
        stats: { STR: 12, DEX: 8, CON: 14, INT: 19, WIS: 13, CHA: 13 },
        spells: ["Eldritch Blast", "Hex", "Entangle"],
      }
    ]
  },
  {
    id: "Facha-Party",
    name: "La Facha Party",
    theme: "Eran muy apuestos todos.",
    characters: [
      {
        id: "Gale",
        name: "Gale",
        className: "Paladin",
        subclass: "Oath of Conquest",
        level: 9,
        armorClass: 18,
        stats: { STR: 18, DEX: 8, CON: 16, INT: 7, WIS: 10, CHA: 15 },
        spells: ["Haste", "Counterspell", "Dispel Magic"],
      },
      {
        id: "Ras",
        name: "Ras",
        className: "Barbarian",
        subclass: "Path of the Zealot",
        level: 9,
        armorClass: 16,
        stats: { STR: 19, DEX: 16, CON: 16, INT: 10, WIS: 8, CHA: 13 },
        spells: [],
      },
      {
        id: "Searon",
        name: "Searon",
        className: "Cleric",
        subclass: "Arcana Domain",
        level: 9,
        armorClass: 13,
        stats: { STR: 8, DEX: 14, CON: 16, INT: 14, WIS: 20, CHA: 15 },
        spells: ["Command", "Identify", "Mass Healing Word"],
      },
      {
        id: "Roderick",
        name: "Roderick",
        className: "Wizard",
        subclass: "School of Abjuration",
        level: 9,
        armorClass: 13,
        stats: { STR: 8, DEX: 8, CON: 16, INT: 20, WIS: 12, CHA: 15 },
        spells: ["Banishment", "Blight", "Distort Gravity"],
      },
      {
        id: "Dimas",
        name: "Dimas",
        className: "Sorcerer",
        subclass: "Storm Sorcery",
        level: 9,
        armorClass: 15,
        stats: { STR: 9, DEX: 12, CON: 18, INT: 16, WIS: 12, CHA: 20 },
        spells: ["Chain Lightning", "Lightning Bolt", "Shatter", "Investiture of Storm"],
      }
    ]
  },
  {
    id: "Caballeros1",
    name: "Los 12 Caballeros",
    theme: "Los 6 primeros elegidos por el Rey Arturo.",
    characters: [
      {
        id: "Sir-Kay",
        name: "Sir Kay",
        className: "Paladin",
        subclass: "Oath of the Crown",
        level: 15,
        armorClass: 20,
        stats: { STR: 16, DEX: 11, CON: 16, INT: 12, WIS: 12, CHA: 16 },
        spells: ["Spirit Guardians", "Shield of Faith", "Banishment"],
        affinities: {
          "Sir-Brayton": { score: 10, note: "12 caballeros" },
          "Lady-Jacquelle": { score: 10, note: "12 caballeros" },
          "Sir-Macrath": { score: 10, note: "12 caballeros" },
          "Sir-Timo": { score: 10, note: "12 caballeros" },
          "Sir-Ed": { score: 10, note: "12 caballeros" },
          "Sir-Tyren": { score: 10, note: "12 caballeros" }
        },
      },
      {
        id: "Lady-Ginebra",
        name: "Lady Ginebra",
        className: "Ranger",
        subclass: "Gloom Stalker",
        level: 15,
        armorClass: 16,
        stats: { STR: 12, DEX: 18, CON: 12, INT: 7, WIS: 18, CHA: 8 },
        spells: ["Zephyr strike","Ensnaring Strike","lightning arrow"],
        affinities: {
          "Sir-Brayton": { score: 10, note: "12 caballeros" },
          "Lady-Jacquelle": { score: 10, note: "12 caballeros" },
          "Sir-Macrath": { score: 10, note: "12 caballeros" },
          "Sir-Timo": { score: 10, note: "12 caballeros" },
          "Sir-Ed": { score: 10, note: "12 caballeros" },
          "Sir-Tyren": { score: 10, note: "12 caballeros" }
        },
      },
      {
        id: "Sir-Gareth",
        name: "Sir Gareth",
        className: "Barbarian",
        subclass: "Path of the Ancestral Guardian",
        level: 15,
        armorClass: 19,
        stats: { STR: 18, DEX: 18, CON: 20, INT: 16, WIS: 10, CHA: 11 },
        spells: [],
        affinities: {
          "Sir-Brayton": { score: 10, note: "12 caballeros" },
          "Lady-Jacquelle": { score: 10, note: "12 caballeros" },
          "Sir-Macrath": { score: 10, note: "12 caballeros" },
          "Sir-Timo": { score: 10, note: "12 caballeros" },
          "Sir-Ed": { score: 10, note: "12 caballeros" },
          "Sir-Tyren": { score: 10, note: "12 caballeros" }
        },
      },
      {
        id: "Sir-Galliard",
        name: "Sir Galliard",
        className: "Artificer",
        subclass: "Armorer",
        level: 15,
        armorClass: 24,
        stats: { STR: 13, DEX: 10, CON: 20, INT: 20, WIS: 9, CHA: 11 },
        spells: ["Lightning Bolt", "Greater Invisibility", "Shatter"],
        affinities: {
          "Sir-Brayton": { score: 10, note: "12 caballeros" },
          "Lady-Jacquelle": { score: 10, note: "12 caballeros" },
          "Sir-Macrath": { score: 10, note: "12 caballeros" },
          "Sir-Timo": { score: 10, note: "12 caballeros" },
          "Sir-Ed": { score: 10, note: "12 caballeros" },
          "Sir-Tyren": { score: 10, note: "12 caballeros" }
        },
      },
      {
        id: "Sir-Messi",
        name: "Sir Messi",
        className: "Druid",
        subclass: "Circle of the Wyrm",
        level: 15,
        armorClass: 11,
        stats: { STR: 13, DEX: 13, CON: 16, INT: 14, WIS: 20, CHA: 7 },
        spells: ["Call Lightning", "Chill Strike", "Starfire"],
        affinities: {
          "Sir-Brayton": { score: 10, note: "12 caballeros" },
          "Lady-Jacquelle": { score: 10, note: "12 caballeros" },
          "Sir-Macrath": { score: 10, note: "12 caballeros" },
          "Sir-Timo": { score: 10, note: "12 caballeros" },
          "Sir-Ed": { score: 10, note: "12 caballeros" },
          "Sir-Tyren": { score: 10, note: "12 caballeros" }
        },
      },
      {
        id: "Sir-Lancelot",
        name: "Sir Lancelot",
        className: "Cleric",
        subclass: "Light Domain",
        level: 15,
        armorClass: 14,
        stats: { STR: 16, DEX: 18, CON: 10, INT: 16, WIS: 20, CHA: 20 },
        spells: ["Flaming Sphere", "Hammer of the Gods", "Fireball"],
        affinities: {
          "Sir-Brayton": { score: 10, note: "12 caballeros" },
          "Lady-Jacquelle": { score: 10, note: "12 caballeros" },
          "Sir-Macrath": { score: 10, note: "12 caballeros" },
          "Sir-Timo": { score: 10, note: "12 caballeros" },
          "Sir-Ed": { score: 10, note: "12 caballeros" },
          "Sir-Tyren": { score: 10, note: "12 caballeros" }
        },
      }
    ]
  },
  {
    id: "Caballeros2",
    name: "Los 12 Caballeros",
    theme: "Los 6 ultimos elegidos por el Rey Arturo.",
    characters: [
      {
        id: "Sir-Brayton",
        name: "Sir Brayton",
        className: "Cleric",
        subclass: "Peace Domain",
        level: 15,
        armorClass: 16,
        stats: { STR: 6, DEX: 16, CON: 16, INT: 16, WIS: 20, CHA: 14 },
        spells: ["Spirit Guardians", "Arrow of Light", "Divination"],
        affinities: {
          "Sir-Kay": { score: 10, note: "12 caballeros" },
          "Lady-Ginebra": { score: 10, note: "12 caballeros" },
          "Sir-Gareth": { score: 10, note: "12 caballeros" },
          "Sir-Galliard": { score: 10, note: "12 caballeros" },
          "Sir-Messi": { score: 10, note: "12 caballeros" },
          "Sir-Lancelot": { score: 10, note: "12 caballeros" }
        },
      },
      {
        id: "Lady-Jacquelle",
        name: "Lady Jacquelle",
        className: "Cleric",
        subclass: "Forge Domain",
        level: 15,
        armorClass: 16,
        stats: { STR: 20, DEX: 10, CON: 20, INT: 8, WIS: 10, CHA: 10 },
        spells: ["Creation","Wall of Fire","Flame Strike"],
        affinities: {
          "Sir-Kay": { score: 10, note: "12 caballeros" },
          "Lady-Ginebra": { score: 10, note: "12 caballeros" },
          "Sir-Gareth": { score: 10, note: "12 caballeros" },
          "Sir-Galliard": { score: 10, note: "12 caballeros" },
          "Sir-Messi": { score: 10, note: "12 caballeros" },
          "Sir-Lancelot": { score: 10, note: "12 caballeros" }
        },
      },
      {
        id: "Sir-Macrath",
        name: "Sir Macrath",
        className: "Rogue",
        subclass: "Phantom",
        level: 15,
        armorClass: 15,
        stats: { STR: 11, DEX: 20, CON: 15, INT: 14, WIS: 19, CHA: 8 },
        spells: [],
        affinities: {
          "Sir-Kay": { score: 10, note: "12 caballeros" },
          "Lady-Ginebra": { score: 10, note: "12 caballeros" },
          "Sir-Gareth": { score: 10, note: "12 caballeros" },
          "Sir-Galliard": { score: 10, note: "12 caballeros" },
          "Sir-Messi": { score: 10, note: "12 caballeros" },
          "Sir-Lancelot": { score: 10, note: "12 caballeros" }
        },
      },
      {
        id: "Sir-Timo",
        name: "Sir Timo",
        className: "Monk",
        subclass: "Way of the Wuxia",
        level: 15,
        armorClass: 15,
        stats: { STR: 9, DEX: 18, CON: 14, INT: 8, WIS: 12, CHA: 7 },
        spells: [],
        affinities: {
          "Sir-Kay": { score: 10, note: "12 caballeros" },
          "Lady-Ginebra": { score: 10, note: "12 caballeros" },
          "Sir-Gareth": { score: 10, note: "12 caballeros" },
          "Sir-Galliard": { score: 10, note: "12 caballeros" },
          "Sir-Messi": { score: 10, note: "12 caballeros" },
          "Sir-Lancelot": { score: 10, note: "12 caballeros" }
        },
      },
      {
        id: "Sir-Ed",
        name: "Sir Ed",
        className: "Wizard",
        subclass: "Order of Scribes",
        level: 15,
        armorClass: 16,
        stats: { STR: 16, DEX: 12, CON: 18, INT: 20, WIS: 6, CHA: 15 },
        spells: ["Sunbeam", "Storm Sphere", "Steel Wind Strike"],
        affinities: {
          "Sir-Kay": { score: 10, note: "12 caballeros" },
          "Lady-Ginebra": { score: 10, note: "12 caballeros" },
          "Sir-Gareth": { score: 10, note: "12 caballeros" },
          "Sir-Galliard": { score: 10, note: "12 caballeros" },
          "Sir-Messi": { score: 10, note: "12 caballeros" },
          "Sir-Lancelot": { score: 10, note: "12 caballeros" }
        },
      },
      {
        id: "Sir-Tyren",
        name: "Sir Tyren",
        className: "Blood Hunter",
        subclass: "Order of Dawnbringer",
        level: 15,
        armorClass: 18,
        stats: { STR: 18, DEX: 10, CON: 20, INT: 8, WIS: 16, CHA: 7 },
        spells: [],
        affinities: {
          "Sir-Kay": { score: 10, note: "12 caballeros" },
          "Lady-Ginebra": { score: 10, note: "12 caballeros" },
          "Sir-Gareth": { score: 10, note: "12 caballeros" },
          "Sir-Galliard": { score: 10, note: "12 caballeros" },
          "Sir-Messi": { score: 10, note: "12 caballeros" },
          "Sir-Lancelot": { score: 10, note: "12 caballeros" },
        },
      }
    ]
  },
  {
    id: "Caballeros3",
    name: "Los 12 Caballeros en America",
    theme: "Los 5 heroes que viajan a America.",
    characters: [
      {
        id: "Harry-Time",
        name: "Harry Time",
        className: "Wizard",
        subclass: "School of Warp watcher",
        level: 15,
        armorClass: 12,
        stats: { STR: 9, DEX: 15, CON: 15, INT: 20, WIS: 13, CHA: 12 },
        spells: ["Magic Missile", "Slow", "Fireball"],
      },
      {
        id: "Baltasaria",
        name: "Baltasaria",
        className: "Warden",
        subclass: "Storm Sentinel",
        level: 15,
        armorClass: 19,
        stats: { STR: 18, DEX: 13, CON: 20, INT: 11, WIS: 14, CHA: 9 },
        spells: [],
      },
      {
        id: "Billy",
        name: "Billy",
        className: "Alchemist",
        subclass: "Mad Bomber",
        level: 15,
        armorClass: 12,
        stats: { STR: 12, DEX: 10, CON: 16, INT: 18, WIS: 12, CHA: 8 },
        spells: [],
      },
      {
        id: "Kenny",
        name: "Kenny",
        className: "Fighter",
        subclass: "Mage Hand Magus",
        level: 15,
        armorClass: 17,
        stats: { STR: 16, DEX: 14, CON: 16, INT: 13, WIS: 9, CHA: 12 },
        spells: [],
        affinities: {
          "Sir-Kay": { score: -10, note: "12 caballeros" },
          "Lady-Ginebra": { score: -10, note: "12 caballeros" },
          "Sir-Gareth": { score: -10, note: "12 caballeros" },
          "Sir-Galliard": { score: -10, note: "12 caballeros" },
          "Sir-Messi": { score: -10, note: "12 caballeros" },
          "Sir-Lancelot": { score: -10, note: "12 caballeros" },
          "Sir-Brayton": { score: -10, note: "12 caballeros" },
          "Lady-Jacquelle": { score: -10, note: "12 caballeros" },
          "Sir-Macrath": { score: -10, note: "12 caballeros" },
          "Sir-Timo": { score: -10, note: "12 caballeros" },
          "Sir-Ed": { score: -10, note: "12 caballeros" },
          "Sir-Tyren": { score: -10, note: "12 caballeros" }
        },
      },
      {
        id: "William-J",
        name: "William J.",
        className: "Paladin",
        subclass: "Oath of Glory",
        level: 15,
        armorClass: 18,
        stats: { STR: 18, DEX: 9, CON: 18, INT: 9, WIS: 10, CHA: 15 },
        spells: ["Guiding Bolt", "Dispel Magic", "Counterspell"],
      },
    ]
  },
  {
    id: "HeroesPerdidos1",
    name: "Heroes Perdidos",
    theme: "Un grupo de adolescentes que iniciaron la campaña",
    characters: [
      {
        id: "Miguel",
        name: "Miguel Rubik",
        className: "Rogue",
        subclass: "Arcane Trickster",
        level: 6,
        armorClass: 15,
        stats: { STR: 20, DEX: 14, CON: 14, INT: 12, WIS: 9, CHA: 8 },
        spells: [],
      },
      {
        id: "Brittany",
        name: "Brittany",
        className: "Sorcerer",
        subclass: "Emberheart",
        level: 3,
        armorClass: 12,
        stats: { STR: 8, DEX: 16, CON: 10, INT: 10, WIS: 15, CHA: 17 },
        spells: ["Burning Hands","Scorching Ray","Fire Bolt"],
      },
      {
        id: "Walter",
        name: "Walter",
        className: "Bard",
        subclass: "College of Glamour",
        level: 5,
        armorClass: 12,
        stats: { STR: 12, DEX: 14, CON: 12, INT: 13, WIS: 16, CHA: 10 },
        spells: ["Faerie Fire","Healing Word","Cloud of Daggers"],
      },
      {
        id: "Voños",
        name: "Voños",
        className: "Monk",
        subclass: "Way of the Open Hand",
        level: 4,
        armorClass: 12,
        stats: { STR: 14, DEX: 12, CON: 14, INT: 14, WIS: 12, CHA: 12 },
        spells: [],
      },
      {
        id: "Kiara",
        name: "Kiara",
        className: "Monk",
        subclass: "Way of the Wu Jen",
        level: 5,
        armorClass: 14,
        stats: { STR: 7, DEX: 12, CON: 10, INT: 18, WIS: 14, CHA: 13 },
        spells: [],
      },
      {
        id: "Martin",
        name: "Martin",
        className: "Ranger",
        subclass: "Beast Master",
        level: 8,
        armorClass: 17,
        stats: { STR: 8, DEX: 20, CON: 18, INT: 7, WIS: 14, CHA: 8 },
        spells: [],
      },
      {
        id: "Lito",
        name: "Lito",
        className: "Paladin",
        subclass: "Oath of the Watchers",
        level: 10,
        armorClass: 20,
        stats: { STR: 16, DEX: 12, CON: 12, INT: 9, WIS: 10, CHA: 14 },
        spells: [],
      },
    ]
  },
  {
    id: "HeroesPerdidos2",
    name: "Heroes Perdidos",
    theme: "Un grupo de prepúberes con mucho poder",
    characters: [
      {
        id: "Ratchet",
        name: "Ratchet",
        className: "Druid",
        subclass: "Circle of Dreams",
        level: 3,
        armorClass: 13,
        stats: { STR: 8, DEX: 10, CON: 14, INT: 15, WIS: 15, CHA: 13 },
        spells: ["Faerie Fire","Heat Metal","Spike Growth"],
      },
      {
        id: "Pekos",
        name: "Pekos",
        className: "Paladin",
        subclass: "Oath of the Ancients",
        level: 8,
        armorClass: 17,
        stats: { STR: 16, DEX: 12, CON: 15, INT: 14, WIS: 15, CHA: 8 },
        spells: ["Branding Smite","Moonbeam","misty step"],
      },
      {
        id: "DangXia",
        name: "Dang Xia",
        className: "Monk",
        subclass: "College of Glamour",
        level: 10,
        armorClass: 14,
        stats: { STR: 7, DEX: 18, CON: 10, INT: 12, WIS: 12, CHA: 12 },
        spells: [],
      },
      {
        id: "Urls",
        name: "Urls",
        className: "Cleric",
        subclass: "Tempest domain",
        level: 10,
        armorClass: 19,
        stats: { STR: 7, DEX: 15, CON: 10, INT: 18, WIS: 18, CHA: 8 },
        spells: ["Call Lightning","Sleet Storm","Starfire"],
      },
      {
        id: "Allan",
        name: "Allan Connor",
        className: "Warlock",
        subclass: "The Undying",
        level: 10,
        armorClass: 12,
        stats: { STR: 14, DEX: 11, CON: 19, INT: 14, WIS: 8, CHA: 14 },
        spells: ["Spider Climb","Invisibility","Hunger of Hadar"],
      },
      {
        id: "Javier",
        name: "Javier Ugarte",
        className: "Fighter",
        subclass: "Master at Arms",
        level: 10,
        armorClass: 14,
        stats: { STR: 13, DEX: 18, CON: 12, INT: 11, WIS: 12, CHA: 14 },
        spells: [],
      },
      {
        id: "Many",
        name: "Many",
        className: "Fighter",
        subclass: "Arcane Archer",
        level: 10,
        armorClass: 16,
        stats: { STR: 12, DEX: 18, CON: 12, INT: 12, WIS: 11, CHA: 9 },
        spells: [],
      },
    ]
  },
  {
    id: "HeroesPerdidos3",
    name: "Nuevos Heroes Perdidos",
    theme: "En otro mundo, fueron Heroes",
    characters: [
      {
        id: "Drake",
        name: "Drake 'El Angel' Ijosh",
        className: "Barbarian",
        subclass: "Path of the Totem Warrior",
        level: 12,
        armorClass: 15,
        stats: { STR: 18, DEX: 14, CON: 16, INT: 11, WIS: 13, CHA: 10 },
        spells: [],
      },
      {
        id: "Annie",
        name: "Annie",
        className: "Witch",
        subclass: "Black Magic",
        level: 10,
        armorClass: 12,
        stats: { STR: 9, DEX: 14, CON: 14, INT: 11, WIS: 12, CHA: 20 },
        spells: ["Hold Monster","Cloudkill","Inflict Wounds"],
      },
      {
        id: "Jerry",
        name: "Jerry",
        className: "Rogue",
        subclass: "Thief",
        level: 10,
        armorClass: 15,
        stats: { STR: 12, DEX: 20, CON: 16, INT: 14, WIS: 11, CHA: 7 },
        spells: [],
      },
      {
        id: "Iggy",
        name: "Iggy",
        className: "Sorcerer",
        subclass: "Wild Magic",
        level: 10,
        armorClass: 12,
        stats: { STR: 9, DEX: 15, CON: 12, INT: 9, WIS: 10, CHA: 18 },
        spells: ["Scorching Ray","Immolation","Fireball"],
      },
      {
        id: "Tyler",
        name: "Tyler DeCrieitor",
        className: "Cleric",
        subclass: "Order Domain",
        level: 10,
        armorClass: 20,
        stats: { STR: 14, DEX: 10, CON: 18, INT: 6, WIS: 20, CHA: 15 },
        spells: ["Dominate Person","Hold Person","Spirit Guardians"],
      },
      {
        id: "Wong",
        name: "Wong Sawat",
        className: "Paladin",
        subclass: "Oath of the Crown",
        level: 10,
        armorClass: 18,
        stats: { STR: 16, DEX: 9, CON: 20, INT: 8, WIS: 11, CHA: 14 },
        spells: [],
      },
      {
        id: "Morena",
        name: "Morena Herrera",
        className: "Rogue",
        subclass: "Inquisitive",
        level: 10,
        armorClass: 14,
        stats: { STR: 8, DEX: 18, CON: 13, INT: 15, WIS: 14, CHA: 10 },
        spells: [],
      },
    ]
  },
  {
    id: "HeroesPerdidos4",
    name: "Nuevos Heroes Encontrados",
    theme: "Los ultimos Heroes",
    characters: [
      {
        id: "Koma",
        name: "Koma",
        className: "Barbarian",
        subclass: "Path of the Juggernaut",
        level: 12,
        armorClass: 17,
        stats: { STR: 19, DEX: 16, CON: 18, INT: 5, WIS: 14, CHA: 9 },
        spells: [],
      },
      {
        id: "Domenico",
        name: "Domenico",
        className: "Barbarian",
        subclass: "Path of the Totem Warrior",
        level: 10,
        armorClass: 19,
        stats: { STR: 20, DEX: 14, CON: 16, INT: 8, WIS: 9, CHA: 7 },
        spells: [],
      },
      {
        id: "Deluxo",
        name: "Deluxo",
        className: "Bard",
        subclass: "College of Glamour",
        level: 10,
        armorClass: 15,
        stats: { STR: 9, DEX: 16, CON: 14, INT: 12, WIS: 14, CHA: 18 },
        spells: ["Hypnotic Pattern","Command","Charm Monster"],
      },
      {
        id: "Melindo",
        name: "Melindo",
        className: "Fighter",
        subclass: "Rune Knight",
        level: 10,
        armorClass: 21,
        stats: { STR: 20, DEX: 14, CON: 18, INT: 8, WIS: 12, CHA: 12 },
        spells: [],
      },
      {
        id: "Adom",
        name: "Adom Essam",
        className: "Bard",
        subclass: "College of Lore",
        level: 10,
        armorClass: 20,
        stats: { STR: 13, DEX: 20, CON: 14, INT: 8, WIS: 12, CHA: 20 },
        spells: ["Counterspell","Spiritual Weapon","Spirit Guardians"],
      },
      {
        id: "Luna",
        name: "Luna Taggio",
        className: "Warmage",
        subclass: "House of Kings",
        level: 10,
        armorClass: 17,
        stats: { STR: 11, DEX: 14, CON: 18, INT: 20, WIS: 9, CHA: 8 },
        spells: ["Fire Bolt","Sonic Pulse","Finger Guns"],
      },
      {
        id: "Brandon",
        name: "Brandon Indiana",
        className: "Blood Hunter",
        subclass: "Order of Dawnbringer",
        level: 10,
        armorClass: 16,
        stats: { STR: 12, DEX: 14, CON: 12, INT: 12, WIS: 16, CHA: 13 },
        spells: [],
      },
    ]
  },
  {
    id: "EnemigosNaturales1",
    name: "Enemigos Party",
    theme: "Los humanos prevaleceran",
    characters: [
      {
        id: "Brisa",
        name: "Brisa Brisa",
        className: "Vessel",
        subclass: "The Mushroom Prince",
        level: 16,
        armorClass: 14,
        stats: { STR: 10, DEX: 18, CON: 18, INT: 11, WIS: 12, CHA: 20 },
        spells: ["Bloom","Fear"],
      },
      {
        id: "Fashad",
        name: "Fashad Saut",
        className: "Wizard",
        subclass: "School of Conjuration",
        level: 16,
        armorClass: 17,
        stats: { STR: 15, DEX: 8, CON: 18, INT: 20, WIS: 8, CHA: 13 },
        spells: ["Teleport","Arcane Gate","Plane Shift"],
      },
      {
        id: "Annabella",
        name: "Annabella Cross",
        className: "Investigator",
        subclass: "Time Operative",
        level: 16,
        armorClass: 17,
        stats: { STR: 8, DEX: 20, CON: 14, INT: 20, WIS: 9, CHA: 16 },
        spells: ["Sequester","Heroism","Detect Evil and Good"],
      },
      {
        id: "Tark",
        name: "Tark Ashbeard",
        className: "Blood Hunter",
        subclass: "Order of Transference",
        level: 16,
        armorClass: 21,
        stats: { STR: 20, DEX: 12, CON: 20, INT: 10, WIS: 12, CHA: 6 },
        spells: [],
      }
    ]
  },
  {
    id: "EnemigosNaturales2",
    name: "La Muerte Party",
    theme: "Eran los disparos hacia los Enemigos Naturales",
    characters: [
      {
        id: "Bobby",
        name: "Rey Bobby Williams",
        className: "Warmage",
        subclass: "House of Coalition Arcanist",
        level: 16,
        armorClass: 15,
        stats: { STR: 12, DEX: 14, CON: 20, INT: 20, WIS: 10, CHA: 8 },
        spells: ["Fire Bolt"],
      },
      {
        id: "Lex",
        name: "Lex",
        className: "Rogue, Warlord",
        subclass: "Academy of Schemes, Mastermind",
        level: 16,
        armorClass: 17,
        stats: { STR: 10, DEX: 18, CON: 16, INT: 18, WIS: 16, CHA: 13 },
        spells: [],
      },
      {
        id: "Newt",
        name: "Newt Lancaster",
        className: "Fighter",
        subclass: "Mandalorian",
        level: 16,
        armorClass: 15,
        stats: { STR: 15, DEX: 20, CON: 16, INT: 14, WIS: 8, CHA: 7 },
        spells: [],
      },
      {
        id: "BigSky",
        name: "Big Sky",
        className: "Craftsman",
        subclass: "Calibaron's Guild",
        level: 16,
        armorClass: 21,
        stats: { STR: 14, DEX: 20, CON: 16, INT: 12, WIS: 8, CHA: 8 },
        spells: [],
      },
      {
        id: "Suleiman",
        name: "Suleiman Ibn Absent",
        className: "Rogue",
        subclass: "Swashbuckler",
        level: 15,
        armorClass: 21,
        stats: { STR: 13, DEX: 20, CON: 12, INT: 15, WIS: 8, CHA: 20 },
        spells: [],
      }
    ]
  },
  {
    id: "EnemigosNaturales3",
    name: "Util Party",
    theme: "Eran el cerebro detras de los Enemigos Naturales",
    characters: [
      {
        id: "Aurora",
        name: "Aurora Erx",
        className: "Witch",
        subclass: "Purple Magic",
        level: 10,
        armorClass: 15,
        stats: { STR: 7, DEX: 13, CON: 14, INT: 9, WIS: 20, CHA: 22 },
        spells: ["Word of Recall","Feeblemind","Curse of Binding"],
      },
      {
        id: "Leon",
        name: "Leon",
        className: "Blood Hunter",
        subclass: "Order of Dawnbringer",
        level: 15,
        armorClass: 17,
        stats: { STR: 20, DEX: 14, CON: 16, INT: 10, WIS: 12, CHA: 16 },
        spells: [],
      },
      {
        id: "Katriona",
        name: "Katriona Demeulemeer",
        className: "Rogue",
        subclass: "Infiltrator",
        level: 16,
        armorClass: 15,
        stats: { STR: 9, DEX: 20, CON: 9, INT: 16, WIS: 11, CHA: 14 },
        spells: [],
      },
      {
        id: "Fenris",
        name: "Fenris",
        className: "Druid",
        subclass: "Circle of Disaster",
        level: 16,
        armorClass: 21,
        stats: { STR: 9, DEX: 16, CON: 15, INT: 12, WIS: 20, CHA: 12 },
        spells: ["Earthquake","Incendiary Cloud","Control Weather"],
      },
      {
        id: "PríncipeMedianoche",
        name: "Príncipe de la Medianoche",
        className: "Captain",
        subclass: "Lion Banner",
        level: 16,
        armorClass: 18,
        stats: { STR: 20, DEX: 14, CON: 14, INT: 13, WIS: 10, CHA: 18 },
        spells: [],
      }
    ]
  },
  {
    id: "BuenaOnda",
    name: "Buena Onda Party",
    theme: "Ser bueno es mejor que jugar bien",
    characters: [
      {
        id: "Chris",
        name: "Chris Low",
        className: "Bard",
        subclass: "College of Valor",
        level: 10,
        armorClass: 17,
        stats: { STR: 20, DEX: 14, CON: 15, INT: 5, WIS: 4, CHA: 16 },
        spells: ["Moment"],
      },
      {
        id: "Helios",
        name: "Elios Fandmir",
        className: "Blood Hunter",
        subclass: "Order of Salt & Iron",
        level: 10,
        armorClass: 17,
        stats: { STR: 20, DEX: 14, CON: 16, INT: 10, WIS: 12, CHA: 16 },
        spells: [],
      },
      {
        id: "Maya",
        name: "Maya",
        className: "Wizard",
        subclass: "School of Divination",
        level: 10,
        armorClass: 13,
        stats: { STR: 9, DEX: 14, CON: 12, INT: 20, WIS: 14, CHA: 10 },
        spells: ["Absorb Elements","Arcane Anomaly","Aura of Repulsion"],
      },
      {
        id: "Vulkar",
        name: "Vulkar",
        className: "Paladin",
        subclass: "Oath of Conquest",
        level: 10,
        armorClass: 18,
        stats: { STR: 18, DEX: 9, CON: 16, INT: 12, WIS: 10, CHA: 18 },
        spells: ["hold person", "spiritual weapon","fear"],
      },
      {
        id: "Tanya",
        name: "Tanya",
        className: "Fighter",
        subclass: "Champion",
        level: 10,
        armorClass: 18,
        stats: { STR: 16, DEX: 20, CON: 16, INT: 8, WIS: 10, CHA: 11 },
        spells: [],
      },
      {
        id: "Tsun",
        name: "Tsun",
        className: "Artificer",
        subclass: "Wandslinger",
        level: 14,
        armorClass: 10,
        stats: { STR: 12, DEX: 15, CON: 10, INT: 18, WIS: 7, CHA: 8 },
        spells: ["hold person", "Mending"],
      }
    ]
  },
  {
    id: "Destiny1",
    name: "Cowboy Party",
    theme: "Vaqueros, niñeras y un niño",
    characters: [
      {
        id: "Ricardo",
        name: "Ricardo Martínez",
        className: "Savant",
        subclass: "Virtuoso",
        level: 14,
        armorClass: 17,
        stats: { STR: 14, DEX: 16, CON: 16, INT: 20, WIS: 14, CHA: 8 },
        spells: [],
      },
      {
        id: "Colt",
        name: "Thomas Colt Cassidy",
        className: "Rogue",
        subclass: "Gambler",
        level: 14,
        armorClass: 16,
        stats: { STR: 8, DEX: 18, CON: 14, INT: 13, WIS: 12, CHA: 14 },
        spells: [],
      },
      {
        id: "Betty",
        name: "Beatrice Vientos",
        className: "Cleric",
        subclass: "Peace Domain",
        level: 6,
        armorClass: 18,
        stats: { STR: 12, DEX: 15, CON: 12, INT: 10, WIS: 18, CHA: 15 },
        spells: ["War Cry","healing word", "Spiritual Weapon"],
      },
      {
        id: "Sebastian",
        name: "Sebastian Úrsan",
        className: "Fighter",
        subclass: "Champion",
        level: 14,
        armorClass: 18,
        stats: { STR: 20, DEX: 9, CON: 20, INT: 10, WIS: 10, CHA: 9 },
        spells: [],
      },
      {
        id: "Pocho",
        name: "Pocho Clo",
        className: "Warden",
        subclass: "Stoneheart Defender",
        level: 3,
        armorClass: 18,
        stats: { STR: 16, DEX: 11, CON: 17, INT: 11, WIS: 14, CHA: 10},
        spells: [],
      },
      {
        id: "Davo",
        name: "Davo Ziniz",
        className: "Warlock",
        subclass: "The Genie",
        level: 3,
        armorClass: 16,
        stats: { STR: 11, DEX: 14, CON: 16, INT: 5, WIS: 14, CHA: 18},
        spells: ["Eldritch Blast"],
      }
    ]
  },
  {
    id: "Destiny2",
    name: "Destiny Party",
    theme: "Tan Buenos como Malvados",
    characters: [
      {
        id: "Jeb",
        name: "Jeb Kristan",
        className: "Fighter",
        subclass: "Mage Hand Magus",
        level: 5,
        armorClass: 14,
        stats: { STR: 10, DEX: 15, CON: 15, INT: 20, WIS: 14, CHA: 8 },
        spells: [],
      },
      {
        id: "Hrothgar",
        name: "Hrothgar",
        className: "Paladin",
        subclass: "Oath of Glory",
        level: 5,
        armorClass: 18,
        stats: { STR: 16, DEX: 12, CON: 17, INT: 7, WIS: 10, CHA: 15 },
        spells: ["Hold Person","Bless"],
      },
      {
        id: "Fir",
        name: "Fir",
        className: "Barbarian ",
        subclass: "Path of the Reaver",
        level: 5,
        armorClass: 16,
        stats: { STR: 16, DEX: 14, CON: 16, INT: 12, WIS: 14, CHA: 5 },
        spells: [],
      },
      {
        id: "Wolfgang",
        name: "Wolfgang Mild",
        className: "Illrigger",
        subclass: "Painkiller",
        level: 6,
        armorClass: 18,
        stats: { STR: 16, DEX: 5, CON: 16, INT: 8, WIS: 16, CHA: 15 },
        spells: [],
      },
      {
        id: "Adbullah",
        name: "Adbullah",
        className: "Druid",
        subclass: "Circle of the Moon",
        level: 5,
        armorClass: 16,
        stats: { STR: 7, DEX: 14, CON: 13, INT: 12, WIS: 18, CHA: 11},
        spells: [],
      },
      {
        id: "Lydia",
        name: "Lydia Mikova",
        className: "Bard",
        subclass: "College of Eulogies",
        level: 3,
        armorClass: 16,
        stats: { STR: 10, DEX: 10, CON: 12, INT: 10, WIS: 16, CHA: 20},
        spells: ["Mind Spike","Slow","Counterspell"],
      }
    ]
  },
  {
    id: "Novelaverse",
    name: "Casados Party",
    theme: "Estan todos casados",
    characters: [
      {
        id: "Margaret",
        name: "Doc. Molares",
        className: "Rogue",
        subclass: "Surgeon",
        level: 14,
        armorClass: 17,
        stats: { STR: 11, DEX: 20, CON: 11, INT: 16, WIS: 14, CHA: 12 },
        spells: [],
      },
      {
        id: "Zoddos",
        name: "Zoddos Galba",
        className: "Ranger",
        subclass: "Buccaneer",
        level: 13,
        armorClass: 21,
        stats: { STR: 18, DEX: 10, CON: 18, INT: 7, WIS: 14, CHA: 12 },
        spells: ["Hold Person","Bless"],
        rolePriority: ["FRONTLINER", "DPS_MELEE", "TACTICIAN"],
      },
      {
        id: "Mina",
        name: "Mina Westenra",
        className: "Fighter",
        subclass: "Swordsage",
        level: 14,
        armorClass: 19,
        stats: { STR: 20, DEX: 15, CON: 14, INT: 10, WIS: 14, CHA: 14 },
        spells: [],
      },
      {
        id: "Kafka",
        name: "Franz Kafka",
        className: "Witch",
        subclass: "Blue Magic",
        level: 12,
        armorClass: 18,
        stats: { STR: 11, DEX: 15, CON: 16, INT: 15, WIS: 12, CHA: 24 },
        spells: ["Sunbeam", "Storm Sphere", "Steel Wind Strike", "Hold Monster","Cloudkill","Inflict Wounds"],
      }
    ]
  },
  {
    id: "Imperioverse",
    name: "Imperio Party",
    theme: "Seguidores de la princesa del Imperio",
    characters: [
      {
        id: "Aldora",
        name: "Aldora Fatumis",
        className: "Barbarian",
        subclass: "Path of the Glacier",
        level: 13,
        armorClass: 17,
        stats: { STR: 20, DEX: 14, CON: 18, INT: 11, WIS: 12, CHA: 10 },
        spells: [],
      },
      {
        id: "Atlas",
        name: "Atlas Dynamite",
        className: "Magus",
        subclass: "Order of Gateways",
        level: 14,
        armorClass: 21,
        stats: { STR: 14, DEX: 14, CON: 16, INT: 18, WIS: 14, CHA: 12 },
        spells: ["Vortex Warp","Misty Step","Shield","Moment to Think"],
      },
      {
        id: "Catrina",
        name: "Catrina Chayanne",
        className: "Paladin",
        subclass: "Oath of Storms",
        level: 14,
        armorClass: 18,
        stats: { STR: 20, DEX: 12, CON: 16, INT: 11, WIS: 12, CHA: 16 },
        spells: [],
      },
      {
        id: "Darkslayer",
        name: "Dorrut Darkslayer",
        className: "Captain",
        subclass: "Beast Banner",
        level: 14,
        armorClass: 20,
        stats: { STR: 18, DEX: 10, CON: 16, INT: 7, WIS: 12, CHA: 16 },
        spells: [],
        affinities: {
          "Wolfgang": { score: -10, note: "Odiador del imperio" },
        },
      },
      {
        id: "Liora",
        name: "Liora Mild",
        className: "Gadgeteer",
        subclass: "Photonist",
        level: 14,
        armorClass: 16,
        stats: { STR: 13, DEX: 18, CON: 16, INT: 20, WIS: 16, CHA: 6 },
        spells: [],
        affinities: {
          "Wolfgang": { score: 50, note: "Padre e Hija" },
        },
      },
      {
        id: "Narciso",
        name: "Narciso Matic",
        className: "Alchemist",
        subclass: "Pigmentist",
        level: 14,
        armorClass: 16,
        stats: { STR: 15, DEX: 13, CON: 16, INT: 20, WIS: 10, CHA: 12 },
        spells: [],
        affinities: {
          "Robert-O": { score: 5, note: "Mejores Amigos" },
        },
      }
    ]
  },
  {
    id: "Lestanaverse",
    name: "Lestana Party",
    theme: "Seguidores de la princesa de Lestana",
    characters: [
      {
        id: "Seraphine",
        name: "Seraphine Fordream",
        className: "Paladin",
        subclass: "Oath of the Solar",
        level: 13,
        armorClass: 22,
        stats: { STR: 16, DEX: 20, CON: 16, INT: 6, WIS: 12, CHA: 13 },
        spells: ["Dispel Magic","banishment","Find Steed"],
      },
      {
        id: "Austin",
        name: "Austin Leipz",
        className: "Craftsman",
        subclass: "Thunderlords’ Guild",
        level: 14,
        armorClass: 21,
        stats: { STR: 20, DEX: 9, CON: 14, INT: 16, WIS: 14, CHA: 12 },
        spells: [],
      },
      {
        id: "Seris",
        name: "Seris Fordream",
        className: "Vessel",
        subclass: "The Repercussion",
        level: 14,
        armorClass: 18,
        stats: { STR: 8, DEX: 20, CON: 14, INT: 14, WIS: 11, CHA: 20 },
        spells: [],
      },
      {
        id: "ElPadre",
        name: "Helios Fandmir",
        className: "Cleric",
        subclass: "Light Domain",
        level: 14,
        armorClass: 19,
        stats: { STR: 13, DEX: 14, CON: 16, INT: 10, WIS: 20, CHA: 12 },
        spells: ["heal", "Aura of Evasion", "Dawn", "Wall of Fire", "Circle of Power"],
      }
    ]
  },
  {
    id: "PobreParty",
    name: "Pobre Party",
    theme: "Una capitana muy rica y tripulantes muy Pobres",
    characters: [
      {
        id: "William",
        name: "William Manha",
        className: "Bard",
        subclass: "College of Revelry",
        level: 14,
        armorClass: 17,
        stats: { STR: 11, DEX: 18, CON: 12, INT: 10, WIS: 10, CHA: 20 },
        spells: ["Dispel Magic","banishment","Demand"],
      },
      {
        id: "Serena",
        name: "Serena Grayheart",
        className: "Witch",
        subclass: "Sky Magic",
        level: 14,
        armorClass: 17,
        stats: { STR: 8, DEX: 15, CON: 14, INT: 8, WIS: 14, CHA: 22 },
        spells: ["Hold Monster","Negative Energy Flood","Enervation"],
      },
      {
        id: "Eliana",
        name: "Eliana Art",
        className: "Warmage",
        subclass: "House of Knights",
        level: 14,
        armorClass: 20,
        stats: { STR: 15, DEX: 14, CON: 14, INT: 20, WIS: 13, CHA: 8 },
        spells: ["Force Weapon","Force Dart","Force Buckler"],
      },
      {
        id: "Owen",
        name: "Owen Vientos",
        className: "Magus",
        subclass: "Order of Blade Dancers",
        level: 14,
        armorClass: 18,
        stats: { STR: 18, DEX: 10, CON: 14, INT: 15, WIS: 9, CHA: 14 },
        spells: [],
      }
    ]
  },
  {
    id: "Izquierda",
    name: "Zurda Party",
    theme: "Perdimos por zurdos",
    characters: [
      {
        id: "Tian",
        name: "Tian",
        className: "Warlock",
        subclass: "The Celestial",
        level: 11,
        armorClass: 15,
        stats: { STR: 11, DEX: 16, CON: 15, INT: 10, WIS: 14, CHA: 20 },
        spells: ["cure wounds","lesser restoration","daylight"],
      },
      {
        id: "Lied",
        name: "Lied Fordream",
        className: "Wizard",
        subclass: "School of Illusion",
        level: 10,
        armorClass: 17,
        stats: { STR: 8, DEX: 20, CON: 16, INT: 20, WIS: 8, CHA: 10 },
        spells: ["Blur","Shield","Shadow Blade","Programmed illusion","Tenser's Transformation"],
      },
      {
        id: "Cornalino",
        name: "Cornalino",
        className: "Blood Hunter",
        subclass: "Order of the Pale Moon",
        level: 10,
        armorClass: 18,
        stats: { STR: 18, DEX: 14, CON: 20, INT: 8, WIS: 14, CHA: 8 },
        spells: [],
      }
    ]
  }
];

// Campaign encounters can appear as travel events before a combat during the journey.
// They can be simple strings, or objects with type, title, text, scoreModifier,
// effects, and optional special conditions such as blockedBySpecialId + blessingWhenOwned.
// type: "random" lets the game decide if the event becomes blessing or misfortune.
// Useful concrete effects:
// armorBoost / damageArmor, weaponBoost / breakWeapon, learnSpell / loseRandomSpell,
// healWounds / woundRandomCharacter, statTraining / statDrain.
// addSpecialCharacter can add a SPECIAL_CHARACTERS member to the roster; use specialId to force one.
// Targets can be random, weakest, strongest, frontliner, dps, spellcaster, support,
// tactician, or a specific targetCharacterId.
// A lethal pre-combat effect can look like:
// effects: [{ type: "killRandomCharacter", replacementPool: "all", replacementChoices: 4 }]
function createNegativeCampaignEvent(id, title, text, effects, scoreModifier = 0) {
  return {
    id,
    type: "misfortune",
    title,
    text,
    scoreModifier,
    effects
  };
}

function createPositiveCampaignEvent(id, title, text, effects, scoreModifier = 0) {
  return {
    id,
    type: "blessing",
    title,
    text,
    scoreModifier,
    effects
  };
}

const FIGHTER_SHARED_NEGATIVE_ENCOUNTERS = [
  createNegativeCampaignEvent(
    "fighter-dracos",
    "Dracos",
    "Pequeños dragones versatiles y usados como armas biologicas aparecen antes del combate.",
    [
      { type: "woundRandomCharacter", target: "weakest", amount: 10, text: "Los Dracos rodean a {character} y lo dejan herido antes de entrar al combate." },
      { type: "damageArmor", target: "frontliner", amount: 1, text: "El aliento acido de un Draco Cazadores daña la armadura de {character} ({amountText} AC)." }
    ]
  ),
  createNegativeCampaignEvent(
    "fighter-platinum-tail-maze",
    "Laberinto de la Montaña Cola de Platino",
    "El camino se convierte en un laberinto cruel, lleno de pruebas que castigan cualquier error.",
    [
      { type: "statDrain", target: "random", stat: "WIS", amount: 1, text: "{character} descanso en el laberinto y perdio ({stat} {amountText})." },
      { type: "woundRandomCharacter", target: "weakest", amount: 8, text: "Una trampa escondida golpea a {character} antes del combate." }
    ]
  ),
  createNegativeCampaignEvent(
    "fighter-eragiors-third-eye",
    "Eragiors de 3 grado",
    "Una red de espias que domina desde las sombras filtra informacion y sabotea la preparacion.",
    [
      { type: "statDrain", target: "tactician", stat: "INT", amount: 1, text: "Los Eragiors leen los planes de {character}; su estrategia queda expuesta ({stat} {amountText})." },
      { type: "breakWeapon", target: "dps", feature: "Broken Weapon", text: "Un contacto de los Eragiors sabotea el arma de {character}." }
    ]
  ),
  createNegativeCampaignEvent(
    "fighter-alexander",
    "Alexander",
    "Alexander, un paladin muy poderoso, bloquea el paso y obliga a la party a hacer su obra.",
    [
      { type: "damageArmor", target: "frontliner", amount: 2, text: "Alexander castiga el escudo de {character} con un smite ({amountText} AC)." },
      { type: "woundRandomCharacter", target: "strongest", amount: 20, text: "La presion de Alexander deja a {character} sin aire antes de empezar." }
    ]
  )
];

const FIGHTER_SHARED_POSITIVE_ENCOUNTERS = [
  createPositiveCampaignEvent(
    "fighter-tam",
    "Tam",
    "Tam, la herrera de confianza, aparece con objetos magicos preparados para la ruta.",
    [
      { type: "armorBoost", target: "frontliner", amount: 1, text: "Tam ajusta una pieza defensiva de {character} y le suma +1 AC." },
      { type: "weaponBoost", target: "dps", feature: "Runic Weapon", text: "Tam entrega un arma runica a {character} y mejora su DPS." }
    ]
  ),
  createPositiveCampaignEvent(
    "fighter-sixto",
    "Sixto",
    "Sixto, un pelado monje durisimo, ayuda atrapando Dracos antes de que rompan la formacion.",
    [
      { type: "healWounds", target: "weakest", amount: 10, text: "Sixto cubre a {character} y le permite recuperar +10 HP." },
      { type: "statTraining", target: "random", stat: "DEX", amount: 1, text: "El entrenamiento relampago de Sixto mejora la DEX de {character} en +1." }
    ]
  )
];

const TRACENDENCIA_NEGATIVE_ENCOUNTERS = [
  createNegativeCampaignEvent(
    "tracendencia-pracmenar",
    "Pracmenar",
    "La encarnacion de la peste contamina la ruta y deja a la party debilitada.",
    [
      { type: "statDrain", target: "random", stat: "CON", amount: 2, text: "La peste de Pracmenar baja la resistencia de {character} ({stat} {amountText})." },
      { type: "woundRandomCharacter", target: "weakest", amount: 9, text: "La fiebre alcanza a {character} antes del combate." }
    ]
  ),
  createNegativeCampaignEvent(
    "tracendencia-saeltas-padre",
    "Saeltas Padre",
    "El rey tirano de los Estados Unidos de Saeltas impone una persecucion brutal.",
    [
      { type: "damageArmor", target: "frontliner", amount: 1, text: "La guardia de Saeltas Padre rompe parte de la defensa de {character} ({amountText} AC)." },
      { type: "statDrain", target: "support", stat: "CHA", amount: 1, text: "La autoridad tiranica aplasta el animo de {character} ({stat} {amountText})." }
    ]
  )
];

const TRACENDENCIA2_NEGATIVE_ENCOUNTERS = [
  createNegativeCampaignEvent(
    "tracendencia2-vampires",
    "Vampiros",
    "Vampiros viejos cazan a la party durante la noche y llegan al combate con sangre ajena.",
    [
      { type: "statDrain", target: "random", stat: "CON", amount: 1, text: "Una mordida vampirica debilita a {character} ({stat} {amountText})." },
      { type: "woundRandomCharacter", target: "weakest", amount: 8, text: "{character} pierde sangre antes de que empiece la pelea." }
    ]
  )
];

const TRACENDENCIA_SHARED_POSITIVE_ENCOUNTERS = [
  createPositiveCampaignEvent(
    "tracendencia-impu",
    "Impu",
    "Impu, empuja a la party a recuperar fuerzas y desafiar la muerte.",
    [
      { type: "reviveFallenCharacter", text: "Impu trae de vuelta a {character} desde el borde de la muerte." },
      { type: "healWounds", target: "weakest", amount: 14, text: "Impu invoca energia de muerte domesticada y {character} recupera +14 HP." },
      { type: "learnSpell", target: "support", spellName: "Revivify", text: "Impu ensena a {character} un ritual de regreso: {spell}." }
    ],
    6
  )
];

const AUK_EMAN_NEGATIVE_ENCOUNTERS = [
  createNegativeCampaignEvent(
    "auk-eman-la-negrita",
    "La negrita",
    "Una droga muy potente se mete en la ruta y baja mucho los reflejos de la party.",
    [
      { type: "statDrain", target: "random", amount: 2, text: "{character} queda alterado por la droga y pierde control ({stat} {amountText})." },
      { type: "woundRandomCharacter", target: "weakest", amount: 6, text: "{character} llega al combate con el cuerpo en cualquiera." }
    ]
  ),
  createNegativeCampaignEvent(
    "auk-eman-mafia",
    "La Mafia",
    "Las deudas viejas vuelven en forma de cobradores violentos antes del combate.",
    [
      { type: "breakWeapon", target: "dps", feature: "Broken Weapon", text: "Un cobrador de la Mafia le arruina el equipo ofensivo a {character}." },
      { type: "statDrain", target: "random", stat: "CHA", amount: 1, text: "{character} intenta negociar y solo consigue quedar peor parado ({stat} {amountText})." }
    ]
  ),
  createNegativeCampaignEvent(
    "auk-eman-rituals",
    "Rituales",
    "Rituales malvados alteran cuerpos y proporciones de una forma muy poco practica para pelear.",
    [
      { type: "statDrain", target: "random", stat: "DEX", amount: 1, text: "Un ritual deforma el equilibrio de {character} ({stat} {amountText})." },
      { type: "statDrain", target: "random", stat: "CON", amount: 1, text: "La magia corporal deja a {character} con un pene pequeño incomodo y debilitado ({stat} {amountText})." }
    ]
  )
];

const AUK_EMAN_POSITIVE_ENCOUNTERS = [
  createPositiveCampaignEvent(
    "auk-eman-rata-laucha",
    "Rata y Laucha",
    "Dos traficantes de mala muerte, muy mal hablados, ofrecen ayuda a quien busque La Negrita.",
    [
      { type: "statTraining", target: "random", stat: "CON", amount: 1, text: "Rata y Laucha le dan a {character} algo dudoso pero efectivo: +1 CON." },
      { type: "statTraining", target: "dps", stat: "DEX", amount: 1, text: "Entre insultos y consejos horribles, {character} gana +1 DEX." }
    ]
  ),
  createPositiveCampaignEvent(
    "auk-eman-magic-cargo",
    "Cargamento de objetos magicos",
    "La party encuentra de casualidad un cargamento de objetos magicos que nadie estaba vigilando bien.",
    [
      { type: "armorBoost", target: "frontliner", amount: 1, text: "{character} se queda con una armadura encantada del cargamento y gana +1 AC." },
      { type: "weaponBoost", target: "dps", feature: "Runic Weapon", text: "{character} reclama un arma magica del cargamento." },
      { type: "learnSpell", target: "spellcaster", spellName: "Haste", text: "{character} encuentra un pergamino de {spell}." }
    ]
  )
];

const DARK_ETERNUM_NEGATIVE_ENCOUNTERS = [
  createNegativeCampaignEvent(
    "dark-eternum-bugs",
    "Bugs",
    "Bugs y glitches rompen la logica del viaje en el peor momento.",
    [
      { type: "statDrain", target: "random", stat: "DEX", amount: 1, text: "Un glitch tira a {character} fuera de ritmo ({stat} {amountText})." },
      { type: "loseRandomSpell", target: "spellcaster", fallbackWound: 6, text: "Un bug borra temporalmente un hechizo de {character}: {spell}." }
    ]
  ),
  createNegativeCampaignEvent(
    "dark-eternum-online-scams",
    "Estafas Online",
    "Estafadores online distraen a la party con una mentira demasiado convincente.",
    [
      { type: "statDrain", target: "tactician", stat: "WIS", amount: 1, text: "{character} cae en una estafa y pierde lectura de la situacion ({stat} {amountText})." },
      { type: "breakWeapon", target: "dps", feature: "Broken Weapon", text: "Parte del equipo de {character} desaparece en una compra sospechosa." }
    ]
  )
];

const DARK_ETERNUM_POSITIVE_ENCOUNTERS = [
  createPositiveCampaignEvent(
    "dark-eternum-online-item",
    "Un Item Online!",
    "Un item online aparece con stats raros, tooltip brillante y cero explicacion confiable.",
    [
      { type: "weaponBoost", target: "dps", feature: "Runic Weapon", text: "{character} equipa el item online y su DPS sube." },
      { type: "armorBoost", target: "random", amount: 1, text: "El item trae un bonus defensivo raro: {character} gana +1 AC." }
    ]
  )
];

const NEXUS_ARCANA_NEGATIVE_ENCOUNTERS = [
  createNegativeCampaignEvent(
    "nexus-arcana-robots",
    "Robots",
    "Corporaciones malvadas mandan robots de cobro y seguridad a cortar el avance.",
    [
      { type: "damageArmor", target: "frontliner", amount: 1, text: "Un robot corporativo abolla la armadura de {character} ({amountText} AC)." },
      { type: "woundRandomCharacter", target: "weakest", amount: 9, text: "Un dron impacta a {character} antes del combate." },
      { type: "breakWeapon", target: "dps", feature: "Broken Weapon", text: "Un pulso electromagnetico deja el arma de {character} fallando." }
    ]
  )
];

const FACHA_NEGATIVE_ENCOUNTERS = [
  createNegativeCampaignEvent(
    "facha-eragiors-second-eye",
    "Eragiors 2 grado",
    "Aparecen dos ojos de grado dos.",
    [
      { type: "statDrain", target: "tactician", stat: "INT", amount: 1, text: "Los Eragiors falsean datos y confunden a {character} ({stat} {amountText})." },
      { type: "damageArmor", target: "frontliner", amount: 1, text: "Una emboscada preparada daña la defensa de {character} ({amountText} AC)." }
    ]
  ),
  createNegativeCampaignEvent(
    "facha-pirates",
    "Grupo de piratas",
    "Piratas seguidores de los pulpos intentan arrastrar a la humanidad al mar.",
    [
      { type: "woundRandomCharacter", target: "dps", amount: 8, text: "Un abordaje pirata deja a {character} golpeado." },
      { type: "breakWeapon", target: "dps", feature: "Broken Weapon", text: "El agua salada arruina el arma de {character}." }
    ]
  )
];

const FACHA_POSITIVE_ENCOUNTERS = [
  createPositiveCampaignEvent(
    "facha-sheriff-testimony",
    "Sheriff poco amigable",
    "Un sheriff poco amigable con la comunidad LGTB parece creer tus testimonios y decide ayudar.",
    [
      { type: "statTraining", target: "tactician", stat: "CHA", amount: 1, text: "El respaldo del sheriff mejora la autoridad de {character}: +1 CHA." },
      { type: "weaponBoost", target: "dps", feature: "Masterwork Weapon", text: "El sheriff presta equipo incautado a {character}." }
    ],
    4
  )
];

const CABALLEROS_SHARED_NEGATIVE_ENCOUNTERS = [
  createNegativeCampaignEvent(
    "caballeros-santa-sede",
    "Los caballeros de la Santa Sede",
    "La Santa Sede envia caballeros virtuosos y extremadamente disciplinados a cerrar el camino.",
    [
      { type: "loseRandomSpell", target: "spellcaster", fallbackWound: 7, text: "Un sello sagrado bloquea un hechizo de {character}: {spell}." },
      { type: "damageArmor", target: "frontliner", amount: 1, text: "Un mandamiento golpea la defensa de {character} ({amountText} AC)." }
    ]
  ),
  createNegativeCampaignEvent(
    "caballeros-el-orden",
    "El Orden",
    "Un plano obsesionado con el orden intenta corregir a la party a la fuerza.",
    [
      { type: "statDrain", target: "random", stat: "DEX", amount: 1, text: "La rigidez del Orden vuelve torpe a {character} ({stat} {amountText})." },
      { type: "statDrain", target: "tactician", stat: "CHA", amount: 1, text: "El Orden aplasta la improvisacion de {character} ({stat} {amountText})." }
    ]
  ),
  createNegativeCampaignEvent(
    "caballeros-pecado",
    "Los caballeros del Pecado",
    "Los siete caballeros personales del Rey Lucius aparecen buscando el Santo Grial.",
    [
      { type: "breakWeapon", target: "dps", feature: "Broken Weapon", text: "Un pecado marca el arma de {character} y le roba filo." },
      { type: "woundRandomCharacter", target: "strongest", amount: 11, text: "Un caballero del Pecado humilla a {character} con un golpe limpio." }
    ]
  ),
  createNegativeCampaignEvent(
    "caballeros-primordial-fear-demons",
    "Demonios de miedos primigenios",
    "Demonios nacidos de miedos antiguos muerden la mente antes del combate.",
    [
      { type: "statDrain", target: "random", stat: "WIS", amount: 2, text: "Un miedo primigenio rompe la voluntad de {character} ({stat} {amountText})." },
      { type: "woundRandomCharacter", target: "weakest", amount: 10, text: "{character} queda marcado por una pesadilla fisica." }
    ]
  )
];

const CABALLEROS_SHARED_POSITIVE_ENCOUNTERS = [
  createPositiveCampaignEvent(
    "caballeros-merlin",
    "Merlin",
    "El milenario mago Merlin aparece entre humo y vestido con una tunica infinita para entregar un hechizo.",
    [
      { type: "learnSpell", target: "spellcaster", spellName: "Counterspell", text: "Merlin ensena a {character} el hechizo {spell}." },
      { type: "statTraining", target: "spellcaster", stat: "INT", amount: 1, text: "Merlin ordena la mente arcana de {character}: +1 INT." }
    ],
    6
  )
];

const CABALLEROS3_NEGATIVE_ENCOUNTERS = [
  createNegativeCampaignEvent(
    "caballeros3-megafauna",
    "La megafauna",
    "Animales enormes bloquean el avance y convierten el viaje en una estampida.",
    [
      { type: "woundRandomCharacter", target: "frontliner", amount: 12, text: "Una bestia gigante embiste a {character}." },
      { type: "damageArmor", target: "frontliner", amount: 2, text: "La megafauna aplasta la armadura de {character} ({amountText} AC)." }
    ]
  ),
  createNegativeCampaignEvent(
    "caballeros3-local-societies",
    "Sociedades locales",
    "Tribus de Aasimar se oponen al avance de la party.",
    [
      { type: "breakWeapon", target: "dps", feature: "Broken Weapon", text: "Una negociacion fallida termina con el arma de {character} dañada." },
      { type: "statDrain", target: "tactician", stat: "CHA", amount: 1, text: "{character} pierde apoyo local y queda desmoralizado ({stat} {amountText})." }
    ]
  )
];

const CABALLEROS3_POSITIVE_ENCOUNTERS = [
  createPositiveCampaignEvent(
    "caballeros3-sargento-rim",
    "Sargento Rim",
    "El Sargento Rim entrega partes de su armadura para que la party aguante el siguiente choque.",
    [
      { type: "armorBoost", target: "frontliner", amount: 2, text: "El Sargento Rim refuerza a {character} con placas pesadas: +2 AC." },
      { type: "healWounds", target: "frontliner", amount: 8, text: "Rim estabiliza a {character} antes del combate: +8 HP." }
    ]
  )
];

const HEROES_PERDIDOS_SHARED_NEGATIVE_ENCOUNTERS = [
  createNegativeCampaignEvent(
    "heroes-perdidos-usurpadores",
    "Usurpadores",
    "Robots de tecnologia altisima aparecen para destruir toda masa de vida.",
    [
      { type: "damageArmor", target: "frontliner", amount: 1, text: "Un UKPX regenera escudos enemigos y rompe la defensa de {character} ({amountText} AC)." },
      { type: "woundRandomCharacter", target: "weakest", amount: 10, text: "Un D7T explota electricidad cerca de {character}." }
    ]
  ),
  createNegativeCampaignEvent(
    "heroes-perdidos-creatures",
    "Criaturas",
    "Masas organicas, Patagujas, Stalkers, Hulks y Goliats convierten el terreno en una caceria.",
    [
      { type: "woundRandomCharacter", target: "weakest", amount: 9, text: "Una criatura engulle y suelta a {character} en pesimo estado." },
      { type: "statDrain", target: "random", stat: "CON", amount: 1, text: "El veneno organico debilita a {character} ({stat} {amountText})." }
    ]
  ),
  createNegativeCampaignEvent(
    "heroes-perdidos-guardian",
    "El Guardian",
    "El enemigo final controla magia y a los dracos.",
    [
      { type: "loseRandomSpell", target: "spellcaster", fallbackWound: 8, text: "El Guardian interfiere la magia de {character} y le arranca {spell}." },
      { type: "killRandomCharacter", target: "weakest", replacementPool: "all", replacementChoices: 4, fallbackPenalty: -20, text: "El Guardian asesina a  {character} y posee un cadaver llevandolo con el." }
    ]
  )
];

const HEROES_PERDIDOS_SHARED_POSITIVE_ENCOUNTERS = [
  createPositiveCampaignEvent(
    "heroes-perdidos-survivors",
    "Comunidad de sobrevivientes",
    "Una comunidad de sobrevivientes ayuda a escapar y comparte recursos para seguir el viaje.",
    [
      { type: "healWounds", target: "weakest", amount: 12, text: "Los sobrevivientes curan a {character}: +12 HP." },
      { type: "armorBoost", target: "random", amount: 1, text: "La comunidad repara el equipo de {character}: +1 AC." },
      { type: "weaponBoost", target: "dps", feature: "Masterwork Weapon", text: "Un arma rescatada mejora el DPS de {character}." }
    ]
  ),
  createPositiveCampaignEvent(
    "heroes-perdidos-femme-noir",
    "Femme Noir",
    "Femme Noir te encuentra atractivo y decide ayudarte en el viaje.",
    [
      { type: "addSpecialCharacter", specialId: "femme-noir", text: "{character} se suma a tu equipo como Especial." }
    ],
    8
  ),
  createPositiveCampaignEvent(
    "heroes-perdidos-jake",
    "Jake",
    "Jake te ve en buena forma y comparte tacticas para mejorar el proximo enfrentamiento.",
    [
      { type: "statTraining", target: "tactician", stat: "INT", amount: 1, text: "Jake mejora la lectura tactica de {character}: +1 INT." },
      { type: "statTraining", target: "dps", stat: "DEX", amount: 1, text: "Jake corrige la postura ofensiva de {character}: +1 DEX." }
    ],
    5
  )
];

const ENEMIGOS_NATURALES_SHARED_NEGATIVE_ENCOUNTERS = [
  createNegativeCampaignEvent(
    "enemigos-naturales-mutant-monkeys",
    "Monos mutantes",
    "Monos mutantes atacan en manada y convierten cada rama en una emboscada.",
    [
      { type: "woundRandomCharacter", target: "dps", amount: 8, text: "Un mono mutante cae encima de {character} y le mete un tiro en la cabeza." },
      { type: "breakWeapon", target: "dps", feature: "Broken Weapon", text: "La manada dobla el arma de {character} y le tiran excremento." }
    ]
  ),
  createNegativeCampaignEvent(
    "enemigos-naturales-walking-octopi",
    "Caminantes",
    "Pulpos del mar que se adaptan y mejoran constantemente.",
    [
      { type: "statDrain", target: "random", stat: "CON", amount: 1, text: "Los caminantes atacan a {character} ({stat} {amountText})." },
      { type: "damageArmor", target: "frontliner", amount: 1, text: "Un tentaculo fuerza una grieta en la armadura de {character} ({amountText} AC)." }
    ]
  ),
  createNegativeCampaignEvent(
    "enemigos-naturales-giant-indian-gods",
    "Dioses Indios gigantes",
    "Dioses gigantes y destructivos pisan el terreno como si fuera un tablero ajeno.",
    [
      { type: "woundRandomCharacter", target: "strongest", amount: 12, text: "Una pisada divina sacude a {character}." },
      { type: "damageArmor", target: "frontliner", amount: 2, text: "La presion divina hunde la armadura de {character} ({amountText} AC)." }
    ]
  ),
  createNegativeCampaignEvent(
    "enemigos-naturales-bill-gates",
    "Bill Gates",
    "Un magnate villanesco activa una IA de chips mentales en esta ruta de campana.",
    [
      { type: "statDrain", target: "tactician", stat: "WIS", amount: 1, text: "El chip mental interfiere con el criterio de {character} ({stat} {amountText})." },
      { type: "statDrain", target: "spellcaster", stat: "INT", amount: 1, text: "La IA predice la magia de {character} y lo deja confundido ({stat} {amountText})." }
    ]
  ),
  createNegativeCampaignEvent(
    "enemigos-naturales-anti-magic-angels",
    "Angeles anti magia",
    "Angeles anti magia descienden para castigar cualquier hechizo en la ruta.",
    [
      { type: "loseRandomSpell", target: "spellcaster", fallbackWound: 8, text: "Un angel anti magia le borra a {character} el acceso a {spell}." },
      { type: "woundRandomCharacter", target: "spellcaster", amount: 7, text: "La luz anti magia quema a {character}." }
    ]
  ),
  createNegativeCampaignEvent(
    "enemigos-naturales-cryptids",
    "Criptidos",
    "Criptidos enemigos cazan cualquier ruido y obligan a moverse sin respirar.",
    [
      { type: "woundRandomCharacter", target: "weakest", amount: 10, text: "Un ruido minimo delata a {character}." },
      { type: "statDrain", target: "random", stat: "DEX", amount: 1, text: "{character} queda tenso por el sigilo forzado ({stat} {amountText})." }
    ]
  ),
  createNegativeCampaignEvent(
    "enemigos-naturales-mutants",
    "Mutantes extremos",
    "Mutantes extremadamente poderosos aparecen con fuerza suficiente para borrar a alguien en un instante.",
    [
      { type: "killRandomCharacter", target: "weakest", replacementPool: "all", replacementChoices: 4, fallbackPenalty: -20, text: "Un mutante extremo destruye la posicion de {character} y lo deja fuera del combate." }
    ]
  ),
  createNegativeCampaignEvent(
    "enemigos-naturales-goths",
    "Godos",
    "Magos oscuros buscan destruir el arte bajo la mirada del Dios de la guerra.",
    [
      { type: "loseRandomSpell", target: "spellcaster", fallbackWound: 7, text: "La magia oscura de los Godos apaga un hechizo de {character}: {spell}." },
      { type: "statDrain", target: "support", stat: "CHA", amount: 1, text: "La destruccion del arte apaga la inspiracion de {character} ({stat} {amountText})." }
    ]
  ),
  createNegativeCampaignEvent(
    "enemigos-naturales-visir",
    "Visir",
    "Magos de medio oriente desatan un mal antiguo vinculado al Visir.",
    [
      { type: "statDrain", target: "random", stat: "WIS", amount: 1, text: "El mal del Visir se mete en la mente de {character} ({stat} {amountText})." },
      { type: "loseRandomSpell", target: "spellcaster", fallbackWound: 6, text: "El conjuro del Visir distorsiona un hechizo de {character}: {spell}." }
    ]
  ),
  createNegativeCampaignEvent(
    "enemigos-naturales-sir-ed-clone",
    "Clon de Sir Ed",
    "Un clon de Sir Ed convertido en Lich arrastra magia necrotica hacia la party.",
    [
      { type: "loseRandomSpell", target: "spellcaster", fallbackWound: 8, text: "El Lich roba un hechizo de {character}: {spell}." },
      { type: "woundRandomCharacter", target: "weakest", amount: 8, text: "La energia necrotica del clon marchita a {character}." }
    ]
  )
];

const ENEMIGOS_NATURALES_SHARED_POSITIVE_ENCOUNTERS = [
  createPositiveCampaignEvent(
    "enemigos-naturales-light-goddess",
    "Diosa de la luz",
    "La diosa de la luz bendice a la party y mejora sus estadisticas antes del combate.",
    [
      { type: "statTraining", target: "random", stat: "STR", amount: 1, text: "La luz bendice la fuerza de {character}: +1 STR." },
      { type: "statTraining", target: "random", stat: "DEX", amount: 1, text: "La luz bendice la agilidad de {character}: +1 DEX." },
      { type: "statTraining", target: "random", stat: "CON", amount: 1, text: "La luz bendice la resistencia de {character}: +1 CON." },
      { type: "statTraining", target: "random", stat: "INT", amount: 1, text: "La luz bendice la mente de {character}: +1 INT." },
      { type: "statTraining", target: "random", stat: "WIS", amount: 1, text: "La luz bendice la voluntad de {character}: +1 WIS." },
      { type: "statTraining", target: "random", stat: "CHA", amount: 1, text: "La luz bendice la presencia de {character}: +1 CHA." }
    ],
    10
  ),
  createPositiveCampaignEvent(
    "enemigos-naturales-giant-mecha",
    "Mecha Gigante",
    "La party encuentra un Mecha Gigante funcional y alguien logra pilotearlo el tiempo suficiente.",
    [
      { type: "armorBoost", target: "frontliner", amount: 2, text: "{character} pilota el Mecha y gana +2 AC para sostener la linea." },
      { type: "weaponBoost", target: "dps", feature: "Runic Weapon", text: "El armamento del Mecha potencia el DPS de {character}." }
    ],
    12
  ),
  createPositiveCampaignEvent(
    "enemigos-naturales-nuclear-bomb",
    "Bomba Nuclear",
    "La party encuentra una Bomba Nuclear y decide usarla en el proximo combate. Sutil no es, efectivo si.",
    [
      { type: "statTraining", target: "tactician", stat: "INT", amount: 2, text: "{character} calcula donde no conviene estar cuando explote: +2 INT." }
    ],
    35
  )
];

const DESTINY_SHARED_NEGATIVE_ENCOUNTERS = [
  createNegativeCampaignEvent(
    "destiny-corruption",
    "Corrupcion",
    "La corrupcion corrompe el cuerpo del portador y despierta mutaciones peligrosas.",
    [
      { type: "statDrain", target: "random", stat: "WIS", amount: 2, text: "La corrupcion arruina la mente de {character} ({stat} {amountText})." },
      { type: "statDrain", target: "random", stat: "CON", amount: 1, text: "La mutacion drena el cuerpo de {character} ({stat} {amountText})." }
    ]
  ),
  createNegativeCampaignEvent(
    "destiny-yellow-archives",
    "Archivos Cetrinos",
    "Monjes con mascaras verdes que recolectan informacion atacan en grupo y secuestran objetivos utiles.",
    [
      { type: "statDrain", target: "tactician", stat: "INT", amount: 1, text: "Los Archivos Cetrinos roban informacion clave de {character} ({stat} {amountText})." },
      { type: "woundRandomCharacter", target: "support", amount: 7, text: "Un grupo de monjes reduce a {character} antes del combate." }
    ]
  ),
  createNegativeCampaignEvent(
    "destiny-great-night-demons",
    "Demonios de la Gran Noche",
    "La Gran Noche trae demonios de oscuridad que quieren apagar todo rastro de luz.",
    [
      { type: "loseRandomSpell", target: "spellcaster", fallbackWound: 7, text: "La oscuridad de la Gran Noche devora un hechizo de {character}: {spell}." },
      { type: "woundRandomCharacter", target: "weakest", amount: 8, text: "Un atentado de sombras deja a {character} herido." }
    ]
  ),
  createNegativeCampaignEvent(
    "destiny-elemental-mythic-beasts",
    "Bestias Miticas Elementales",
    "Bestias elementales llenan el ambiente de fuego, frio, veneno, trueno, acido y rayos.",
    [
      { type: "damageArmor", target: "frontliner", amount: 1, text: "Un elemento salvaje corroe la armadura de {character} ({amountText} AC)." },
      { type: "woundRandomCharacter", target: "random", amount: 7, text: "Una descarga elemental golpea a {character}." }
    ]
  ),
  createNegativeCampaignEvent(
    "destiny-church-of-light",
    "La iglesia de la Luz",
    "Clerigos y paladines buscan erradicar toda oscuridad bajo la autoridad de Senkar Luxargenta.",
    [
      { type: "loseRandomSpell", target: "spellcaster", fallbackWound: 7, text: "Un rito de luz cancela un hechizo de {character}: {spell}." },
      { type: "damageArmor", target: "frontliner", amount: 1, text: "Un martillo sagrado marca la armadura de {character} ({amountText} AC)." }
    ]
  ),
  createNegativeCampaignEvent(
    "destiny-dorrut-dark-slayer",
    "Dorrut Dark Slayer",
    "Un minotauro lidera fanaticos que masacran gente para derramar sangre.",
    [
      { type: "woundRandomCharacter", target: "strongest", amount: 12, text: "Dorrut embiste a {character} y lo deja tambaleando." },
      { type: "breakWeapon", target: "dps", feature: "Broken Weapon", text: "Los fanaticos de Dorrut arruinan el arma de {character}." }
    ]
  )
];

const DESTINY_MAIN_POSITIVE_ENCOUNTERS = [
  createPositiveCampaignEvent(
    "destiny-cintor",
    "Cintor",
    "Cintor, un Espiritualista, ayuda a crear objetos magicos para el siguiente combate.",
    [
      { type: "armorBoost", target: "frontliner", amount: 1, text: "Cintor imbuye proteccion espiritual en {character}: +1 AC." },
      { type: "weaponBoost", target: "dps", feature: "Runic Weapon", text: "Cintor crea un objeto ofensivo magico para {character}." }
    ]
  ),
  createPositiveCampaignEvent(
    "destiny-anonymous-hero-book",
    "Libro del heroe anonimo",
    "Obtienes el libro del heroe anonimo. Si caes, la historia te permite reintentar el combate una vez.",
    [
      {
        type: "extraLife",
        retryScoreBonus: 100,
        title: "Libro del heroe anonimo",
        text: "El libro del heroe anonimo queda guardado: si pierdes un combate, lo puedes reintentar con +100 score temporal."
      }
    ],
    6
  ),
  createPositiveCampaignEvent(
    "destiny-narciso",
    "Narciso",
    "Narciso, un Alchemist que disfruta pintar a la gente, te pinta y quedas muy satisfecho.",
    [
      { type: "statTraining", target: "random", stat: "CHA", amount: 1, text: "El retrato de Narciso deja a {character} con una confianza absurda: +1 CHA." },
      { type: "healWounds", target: "weakest", amount: 8, text: "La satisfaccion artistica de Narciso recupera a {character}: +8 HP." }
    ]
  ),
  createPositiveCampaignEvent(
    "destiny-liora-artifact",
    "Liora",
    "Liora ayuda a crear un artefacto para llevar mejor los objetos de la party.",
    [
      { type: "armorBoost", target: "random", amount: 1, text: "El artefacto de Liora ordena el equipo de {character}: +1 AC." },
      { type: "statTraining", target: "random", stat: "DEX", amount: 1, text: "Moverse con el equipo nuevo le da a {character} +1 DEX." }
    ],
    5
  ),
  createPositiveCampaignEvent(
    "destiny-elkas-guidance",
    "Elkas, el nino del destino",
    "Elkas guia el futuro y dice exactamente que hacer para que el proximo combate salga mejor.",
    [
      { type: "statTraining", target: "tactician", stat: "WIS", amount: 1, text: "Elkas le muestra a {character} un futuro posible: +1 WIS." },
      { type: "statTraining", target: "tactician", stat: "INT", amount: 1, text: "La guia de Elkas ordena la estrategia de {character}: +1 INT." }
    ],
    12
  ),
  Object.assign(
    createPositiveCampaignEvent(
      "destiny-molusco-atlas",
      "Molusco",
      "Atlas reconoce a Molusco en la ruta. Ella fue una gran amiga suya y decide sumarse al viaje.",
      [
        { type: "addSpecialCharacter", specialId: "molusco", text: "{character} se une a tu equipo como Especial gracias a Atlas." }
      ],
      8
    ),
    { requiresCharacterId: "Atlas", chance: 0.45 }
  )
];

const GLOBAL_SPECIAL_NEGATIVE_ENCOUNTERS = [
  createNegativeCampaignEvent(
    "global-ivor-el-pilar",
    "Ivor el Pilar",
    "Ivor el Pilar aparece del lado enemigo, levanta a un rival caido y lo manda de vuelta al combate.",
    [
      { type: "unlockSpecialCharacter", specialId: "Ivor-el-Pilar", text: "Despues del desastre, Ivor el Pilar queda disponible como Especial para futuras elecciones." }
    ],
    -32
  ),
  createNegativeCampaignEvent(
    "global-wong-refuses-healing",
    "Wong no cura a nadie",
    "Wong, un tiefling que conoce perfectamente como ayudar, decide no curar a la party ni asistir a sus aliados.",
    [
      { type: "statDrain", target: "support", stat: "WIS", amount: 1, text: "La negativa de Wong desordena a {character} ({stat} {amountText})." },
      { type: "woundRandomCharacter", target: "weakest", amount: 25, text: "La cura que Wong niega deja a {character} entrando herido al combate." }
    ],
    -24
  ),
  createNegativeCampaignEvent(
    "global-robert-o-identity-theft",
    "Robber To roba una identidad",
    "Robber To, un vaquero demasiado convincente, roba la identidad del personaje mas fuerte y deja sus stats reemplazadas por las suyas.",
    [
      {
        type: "identityTheft",
        target: "strongest",
        specialId: "Robert-O",
        stats: { STR: 8, DEX: 15, CON: 14, WIS: 10, INT: 12, CHA: 8 },
        text: "Fuiste engañado! Nunca fue {character}, sino que la identidad siempre fue Robber To!;"
      }
    ],
    -12
  ),
  createNegativeCampaignEvent(
    "global-ejemi-frame",
    "Ejemi y el pueblo arrasado",
    "Aparece Ejemi, Illrigger Radiant Sentinel. Mato a todo un pueblo, pero culpan a tu party porque el es inimputable.",
    [
      {
        type: "jailStrongestAndAddSpecial",
        target: "strongest",
        specialId: "Ejemi",
        text: "{character} es llevado a la carcel por la culpa que le cargan a la party.",
        addText: "Ejemi se une como Especial para compensar el desastre que acaba de provocar."
      }
    ],
    -28
  ),
  createNegativeCampaignEvent(
    "global-criminal-replacement-pack",
    "Prision",
    "Sven, Krog y Chaja se presentan con tantos problemas encima que tres miembros de la party terminan pagando por sus crimenes.",
    [
      {
        type: "criminalReplacementPack",
        target: "strongest",
        count: 3,
        specialIds: ["Sven", "Krog", "Chaja"],
        text: "{character} queda fuera por los crimenes que otros trajeron a la ruta.",
        addText: "{character} entra como reemplazo Especial obligado."
      }
    ],
    -42
  )
];

const GLOBAL_SPECIAL_POSITIVE_ENCOUNTERS = [
  createPositiveCampaignEvent(
    "global-dick-sponsor",
    "Dick compra tus objetos",
    "Dick, un vaquero amante del peligro, decide patrocinar a la party y pagar objetos utiles para el viaje.",
    [
      { type: "addSpecialCharacter", specialId: "Dick", text: "{character} se suma como Especial y trae patrocinio vaquero." },
      { type: "armorBoost", target: "frontliner", amount: 1, text: "Dick compra proteccion nueva para {character}: +1 AC." },
      { type: "weaponBoost", target: "dps", feature: "Sponsored Weapon", text: "Dick paga un arma peligrosa para {character}." }
    ],
    10
  ),
  createPositiveCampaignEvent(
    "global-jhon-cross",
    "Jhon Cross vuelve del infierno",
    "Jhon Cross aparece desde un viaje mistico del infierno, se une a la party y deja una vida extra preparada.",
    [
      { type: "addSpecialCharacter", specialId: "jhon-cross", text: "{character} se une como Especial despues de cruzar el infierno." },
      {
        type: "extraLife",
        retryScoreBonus: 100,
        title: "Pacto de Jhon Cross",
        text: "Jhon Cross deja una vida extra: si pierdes un combate, puedes reintentarlo con +100 score temporal."
      }
    ],
    8
  ),
  createPositiveCampaignEvent(
    "global-pablo-rodriguez",
    "Pablo Rodriguez",
    "Un aventurero famosisimo aparece con un canon de gemas y decide acompanar a la party.",
    [
      { type: "addSpecialCharacter", specialId: "pablo-rodriguez", text: "{character} se une como Especial con su canon de gemas." },
      { type: "weaponBoost", target: "dps", feature: "Gem Cannon", text: "El canon de gemas inspira una mejora ofensiva para {character}." },
      { type: "partyScoreBoost", amount: 8, label: "Fama aventurera", text: "La fama de Pablo Rodriguez mejora la moral y la lectura de ruta (+8 score permanente)." }
    ],
    8
  )
];

const CAMPAIGN_ENCOUNTERS = {
  "Fighter-Party": [...FIGHTER_SHARED_NEGATIVE_ENCOUNTERS, ...FIGHTER_SHARED_POSITIVE_ENCOUNTERS],
  "BuenaOnda": [...FIGHTER_SHARED_NEGATIVE_ENCOUNTERS, ...FIGHTER_SHARED_POSITIVE_ENCOUNTERS],
  "Izquierda": [...FIGHTER_SHARED_NEGATIVE_ENCOUNTERS, ...FIGHTER_SHARED_POSITIVE_ENCOUNTERS],
  "Tracendencia": [...TRACENDENCIA_NEGATIVE_ENCOUNTERS, ...TRACENDENCIA_SHARED_POSITIVE_ENCOUNTERS],
  "Tracendencia2": [...TRACENDENCIA2_NEGATIVE_ENCOUNTERS, ...TRACENDENCIA_SHARED_POSITIVE_ENCOUNTERS],
  "Auk-Eman": [...AUK_EMAN_NEGATIVE_ENCOUNTERS, ...AUK_EMAN_POSITIVE_ENCOUNTERS],
  "Dark-Eternum": [...DARK_ETERNUM_NEGATIVE_ENCOUNTERS, ...DARK_ETERNUM_POSITIVE_ENCOUNTERS],
  "Nexus-Arcana": [...NEXUS_ARCANA_NEGATIVE_ENCOUNTERS],
  "Facha-Party": [...FACHA_NEGATIVE_ENCOUNTERS, ...FACHA_POSITIVE_ENCOUNTERS],
  "Caballeros1": [...CABALLEROS_SHARED_NEGATIVE_ENCOUNTERS, ...CABALLEROS_SHARED_POSITIVE_ENCOUNTERS],
  "Caballeros2": [...CABALLEROS_SHARED_NEGATIVE_ENCOUNTERS, ...CABALLEROS_SHARED_POSITIVE_ENCOUNTERS],
  "Caballeros3": [...CABALLEROS3_NEGATIVE_ENCOUNTERS, ...CABALLEROS3_POSITIVE_ENCOUNTERS],
  "HeroesPerdidos1": [...HEROES_PERDIDOS_SHARED_NEGATIVE_ENCOUNTERS, ...HEROES_PERDIDOS_SHARED_POSITIVE_ENCOUNTERS],
  "HeroesPerdidos2": [...HEROES_PERDIDOS_SHARED_NEGATIVE_ENCOUNTERS, ...HEROES_PERDIDOS_SHARED_POSITIVE_ENCOUNTERS],
  "HeroesPerdidos3": [...HEROES_PERDIDOS_SHARED_NEGATIVE_ENCOUNTERS, ...HEROES_PERDIDOS_SHARED_POSITIVE_ENCOUNTERS],
  "HeroesPerdidos4": [...HEROES_PERDIDOS_SHARED_NEGATIVE_ENCOUNTERS, ...HEROES_PERDIDOS_SHARED_POSITIVE_ENCOUNTERS],
  "EnemigosNaturales1": [...ENEMIGOS_NATURALES_SHARED_NEGATIVE_ENCOUNTERS, ...ENEMIGOS_NATURALES_SHARED_POSITIVE_ENCOUNTERS],
  "EnemigosNaturales2": [...ENEMIGOS_NATURALES_SHARED_NEGATIVE_ENCOUNTERS, ...ENEMIGOS_NATURALES_SHARED_POSITIVE_ENCOUNTERS],
  "EnemigosNaturales3": [...ENEMIGOS_NATURALES_SHARED_NEGATIVE_ENCOUNTERS, ...ENEMIGOS_NATURALES_SHARED_POSITIVE_ENCOUNTERS],
  "Destiny1": [...DESTINY_SHARED_NEGATIVE_ENCOUNTERS, ...DESTINY_MAIN_POSITIVE_ENCOUNTERS],
  "Destiny2": [...DESTINY_SHARED_NEGATIVE_ENCOUNTERS, ...DESTINY_MAIN_POSITIVE_ENCOUNTERS],
  "Novelaverse": [...DESTINY_SHARED_NEGATIVE_ENCOUNTERS],
  "Imperioverse": [...DESTINY_SHARED_NEGATIVE_ENCOUNTERS],
  "Lestanaverse": [...DESTINY_SHARED_NEGATIVE_ENCOUNTERS],
  "PobreParty": [...DESTINY_SHARED_NEGATIVE_ENCOUNTERS]
};

Object.keys(CAMPAIGN_ENCOUNTERS).forEach((partyId) => {
  CAMPAIGN_ENCOUNTERS[partyId] = [
    ...CAMPAIGN_ENCOUNTERS[partyId],
    ...GLOBAL_SPECIAL_NEGATIVE_ENCOUNTERS,
    ...GLOBAL_SPECIAL_POSITIVE_ENCOUNTERS
  ];
});

const SPECIAL_GROUPS = [
  { id: "vaqueros", name: "Vaqueros", memberIds: ["Ricardo", "Colt", "Atlas"], threshold: 3, bonus: 24 },
  { id: "cientificos-locos", name: "Cientificos Locos", memberIds: ["Billy", "Sir-Galliard", "Lucia-Mars", "Tsun"], threshold: 3, bonus: 24 },
  { id: "no-tengo-enemigos", name: "No tengo enemigos", memberIds: ["Chris", "Atlas", "Betty", "Sir-Brayton", "Bobby", "Melindo"], threshold: 3, bonus: 20 },
  { id: "gigantes", name: "Gigantes", memberIds: ["Melindo", "Jhonny", "Sir-Gareth", "Brakcius"], threshold: 3, bonus: 22 },
  { id: "genocidas", name: "Genocidas", memberIds: ["Sir-Ed", "Allan", "Wolfgang", "Ejemi", "ElPadre", "Suleiman"], threshold: 3, bonus: 26 },
  { id: "fanaticos-religiosos", name: "Fanaticos Religiosos", memberIds: ["Elpadre", "Betty", "Dagon", "Suleiman", "Beyond", "Padre-Misty", "Catrina"], threshold: 3, bonus: 22 },
  { id: "servicio-militar", name: "Servicio Militar", memberIds: ["Sebastian", "Sven", "Sir-Tyren", "Sir-Timo", "BigSky"], threshold: 3, bonus: 22 },
  { id: "princesas", name: "Princesas", memberIds: ["Seris", "Aldora", "Seraphine", "Brisa", "PrincesaTuttiFrutti", "Tanya", "Luna"], threshold: 3, bonus: 20 },
  { id: "fumancheros", name: "Fumancheros", memberIds: ["Sir-Messi", "Deluxo", "pedro-hijo-jack", "lorkan"], threshold: 3, bonus: 18 },
  { id: "golden-bros", name: "Golden Bros", memberIds: ["Miguel", "Urls", "Allan", "Vonos", "Martin", "Lito", "Pekos", "Javier", "Many"], threshold: 3, bonus: 24 },
  { id: "robots", name: "Robots", memberIds: [ "Adom", "Barian", "Lucia-Mars", "CANARIO"], threshold: 3, bonus: 24 },
  { id: "odiados", name: "Odiados", memberIds: ["Kenny", "Wong", "ElPadre", "Wolfgang","Roderick", "Ivor-el-Pilar", "Krog", "Sven", "Chaja", "Maya"], threshold: 3, bonus: 20 },
  { id: "sorcadin", name: "Sorcadin", memberIds: ["Gale", "William-J", "Arturo", "Beyond"], threshold: 2, bonus: 18 },
  { id: "virgenes", name: "Virgenes", memberIds: ["Vonos", "Argos", "Lito", "jesus-nazaret"], threshold: 3, bonus: 16 }
];

// Special characters are unique event recruits, not members of any fixed party.
// Their appearance is controlled by lore events and affiliation rules in main.js.
const SPECIAL_CHARACTERS = [
  {
    id: "mikos",
    name: "Mikos",
    className: "Monk",
    subclass: "Way of the Open Hand",
    level: 9,
    armorClass: 18,
    stats: { STR: 14, DEX: 20, CON: 14, INT: 10, WIS: 17, CHA: 8 },
    spells: [],
    tags: ["especial"],
    affinities: {
      "Vann": { score: 30, note: "Ya conoce la disciplina de Fighter Party." },
      "Argos": { score: 30, note: "Le respeta." }
    },
    appearanceWeight: 0.1
  },
  {
    id: "Padre-Misty",
    name: "Padre J. Misty",
    className: "Bard",
    subclass: "College of Eloquence",
    level: 3,
    armorClass: 9,
    stats: { STR: 14, DEX: 9, CON: 12, INT: 16, WIS: 10, CHA: 16 },
    spells: ["Vicious Mockery", "Healing Word", "Command"],
    tags: ["especial", "comico"],
    affinities: {
          "Giovanni": { score: 50, note: "Auk Eman Forever" },
          "Guileas": { score: 50, note: "Auk Eman Forever" },
          "Noulan": { score: 50, note: "Auk Eman Forever" }
    },
    appearanceWeight: 0.1
  },
  {
    id: "Arturo",
    name: "El Rey Arturo",
    className: "Paladin",
    subclass: "Oath of Vengeance",
    level: 20,
    armorClass: 16,
    stats: { STR: 24, DEX: 18, CON: 20, INT: 12, WIS: 12, CHA: 26 },
    spells: ["Hunter's Mark", "Misty Step", "Haste"],
    tags: ["especial"],
    affinities: {
          "Sir-Kay": { score: 20, note: "12 caballeros" },
          "Lady-Ginebra": { score: 20, note: "12 caballeros" },
          "Sir-Gareth": { score: 20, note: "12 caballeros" },
          "Sir-Galliard": { score: 20, note: "12 caballeros" },
          "Sir-Messi": { score: 20, note: "12 caballeros" },
          "Sir-Lancelot": { score: 20, note: "12 caballeros" },
          "Sir-Brayton": { score: 20, note: "12 caballeros" },
          "Lady-Jacquelle": { score: 20, note: "12 caballeros" },
          "Sir-Macrath": { score: 20, note: "12 caballeros" },
          "Sir-Timo": { score: 20, note: "12 caballeros" },
          "Sir-Ed": { score: 20, note: "12 caballeros" },
          "Sir-Tyren": { score: 20, note: "12 caballeros" }
    },
    appearanceWeight: 0.1
  },
  {
    id: "AlejandroIII",
    name: "Alejandro Magno III",
    className: "Paladin",
    subclass: "Oath of the Eternal Dragon",
    level: 20,
    armorClass: 20,
    stats: { STR: 20, DEX: 9, CON: 18, INT: 10, WIS: 9, CHA: 20 },
    spells: ["Destructive Wave", "Templar's Wrath", "Haste"],
    tags: ["especial"],
    affinities: {
          "Sir-Kay": { score: 20, note: "El eterno" },
          "Arturo": { score: 100, note: "El rey de los Eternos" }
    },
    appearanceWeight: 0.1
  },
  {
    id: "femme-noir",
    name: "Femme Noir",
    className: "Rogue",
    subclass: "Mastermind",
    level: 12,
    armorClass: 17,
    stats: { STR: 9, DEX: 20, CON: 14, INT: 16, WIS: 14, CHA: 18 },
    spells: ["Charm Person", "Invisibility", "Suggestion"],
    tags: ["especial"],
    affinities: {
      "Jake": { score: 12, note: "Heroes Perdidos" }
    },
    appearanceWeight: 0.1
  },
  {
    id: "molusco",
    name: "Molusco",
    className: "Monk",
    subclass: "Way of the Riftwalker",
    level: 14,
    armorClass: 20,
    stats: { STR: 11, DEX: 20, CON: 14, INT: 5, WIS: 18, CHA: 13 },
    spells: [],
    tags: ["especial"],
    affinities: {
      "Atlas": { score: 24, note: "Gran amiga de Atlas." },
      "Atlas Dynamite": { score: 24, note: "Gran amiga de Atlas." }
    }
  },
  {
    id: "SOSUN",
    name: "SOSUN",
    className: "Rogue",
    subclass: "Duskcaller",
    level: 14,
    armorClass: 16,
    stats: { STR: 10, DEX: 18, CON: 16, INT: 18, WIS: 12, CHA: 14 },
    spells: ["Vampiric Touch","Invisibility","Blur"],
    tags: ["especial"],
    affinities: {
    }
  },
  {
    id: "homero-delfuturo",
    name: "Homero Del futuro",
    className: "Warlock",
    subclass: "The Legendary Hero",
    level: 17,
    armorClass: 18,
    stats: { STR: 10, DEX: 14, CON: 18, INT: 18, WIS: 15, CHA: 22 },
    spells: ["Eldritch Blast", "Hex", "Counterspell", "Banishment", "Plane Shift"],
    tags: ["especial"],
    appearanceWeight: 0.1
  },
  {
    id: "fresh-el-fresco",
    name: "Fresh El Fresco",
    className: "Bard",
    subclass: "College of Glamour",
    level: 10,
    armorClass: 16,
    stats: { STR: 10, DEX: 16, CON: 14, INT: 13, WIS: 12, CHA: 20 },
    spells: ["Charm Person", "Suggestion", "Hypnotic Pattern", "Haste"],
    tags: ["especial", "comico"],
    appearanceWeight: 0.02
  },
  {
    id: "lorax-comunista",
    name: "El Lorax comunista",
    className: "Druid",
    subclass: "Circle of the Shepherd",
    level: 12,
    armorClass: 17,
    stats: { STR: 11, DEX: 14, CON: 16, INT: 14, WIS: 20, CHA: 13 },
    spells: ["Entangle", "Plant Growth", "Conjure Animals", "Wall of Thorns"],
    tags: ["especial", "comico"],
    appearanceWeight: 0.04
  },
  {
    id: "phill-collings",
    name: "Phil Collings",
    className: "Barbarian",
    subclass: "Path of the Zealot",
    level: 11,
    armorClass: 16,
    stats: { STR: 20, DEX: 13, CON: 18, INT: 10, WIS: 12, CHA: 17 },
    spells: [],
    tags: ["especial", "comico"],
    appearanceWeight: 0.02
  },
  {
    id: "luke-robinson",
    name: "Luke Robinson",
    className: "Wizard",
    subclass: "School of Somnomancy",
    level: 13,
    armorClass: 15,
    stats: { STR: 8, DEX: 15, CON: 14, INT: 21, WIS: 16, CHA: 13 },
    spells: ["Sleep", "Dream", "Hypnotic Pattern", "Phantasmal Killer", "Time Stop"],
    tags: ["especial"],
    appearanceWeight: 0.01
  },
  {
    id: "terminator",
    name: "Terminator",
    className: "Artificer",
    subclass: "Battle Smith",
    level: 14,
    armorClass: 21,
    stats: { STR: 20, DEX: 14, CON: 20, INT: 16, WIS: 12, CHA: 8 },
    spells: ["Shield", "Haste", "Lightning Bolt"],
    tags: ["especial"],
    appearanceWeight: 0.04
  },
  {
    id: "roman-riquelme",
    name: "Roman Riquelme",
    className: "Fighter",
    subclass: "Champion",
    level: 10,
    armorClass: 17,
    stats: { STR: 18, DEX: 18, CON: 15, INT: 16, WIS: 18, CHA: 19 },
    spells: [],
    tags: ["especial", "comico"],
    appearanceWeight: 0.1,
    affinities: {
      "la-12": { score: 30, note: "La hinchada lo empuja a jugar mejor." },
      "diego-maradona": { score: 20, note: "Dos leyendas entienden la pelota." },
      "Sir-Messi": { score: 20, note: "Dos leyendas entienden la pelota." }
    }
  },
  {
    id: "tincho-carpincho",
    name: "Tincho el Carpincho",
    className: "Blood Hunter",
    subclass: "Order of the Pale Moon",
    level: 11,
    armorClass: 17,
    stats: { STR: 16, DEX: 18, CON: 17, INT: 12, WIS: 15, CHA: 10 },
    spells: [],
    tags: ["especial", "comico"],
    appearanceWeight: 0.08
  },
  {
    id: "la-12",
    name: "La 12",
    className: "Bard",
    subclass: "College of Valor",
    level: 9,
    armorClass: 15,
    stats: { STR: 13, DEX: 14, CON: 16, INT: 10, WIS: 12, CHA: 20 },
    spells: ["Vicious Mockery", "Heroism", "Bless", "Thunderwave"],
    tags: ["especial", "comico"],
    appearanceWeight: 0.08,
    affinities: {
      "roman-riquelme": { score: 30, note: "Alienta a Roman sin parar." },
      "diego-maradona": { score: 18, note: "La tribuna explota con Diego." }
    }
  },
  {
    id: "diego-maradona",
    name: "El Diego Armando Maradona",
    className: "Blood Hunter",
    subclass: "Order of Alchemists",
    level: 12,
    armorClass: 18,
    stats: { STR: 14, DEX: 22, CON: 17, INT: 14, WIS: 18, CHA: 22 },
    spells: [],
    tags: ["especial"],
    appearanceWeight: 0.04,
    affinities: {
      "roman-riquelme": { score: 20, note: "La pelota los entiende." },
      "la-12": { score: 18, note: "La tribuna canta mas fuerte." },
      "Sir-Messi": { score: 20, note: "Los dos mejores de la historia." }
    }
  },
  {
    id: "pedro-hijo-jack",
    name: "Pedro hijo Jack",
    className: "Sorcerer",
    subclass: "Clockwork Soul",
    level: 13,
    armorClass: 16,
    stats: { STR: 8, DEX: 18, CON: 14, INT: 15, WIS: 12, CHA: 21 },
    spells: ["Misty Step", "Invisibility", "Haste", "Time Stop"],
    tags: ["especial", "comico"],
    appearanceWeight: 0.01
  },
  {
    id: "star-guardians-lol",
    name: "Star Guardians",
    className: "Warlock",
    subclass: "The Star",
    level: 15,
    armorClass: 18,
    stats: { STR: 18, DEX: 18, CON: 15, INT: 14, WIS: 16, CHA: 26 },
    spells: ["Guiding Bolt", "Moonbeam", "Fly", "Mass Cure Wounds"],
    tags: ["especial"],
    appearanceWeight: 0.04
  },
  {
    id: "jesus-nazaret",
    name: "Jesus de Nazaret",
    className: "Cleric",
    subclass: "Life Domain",
    level: 20,
    armorClass: 18,
    stats: { STR: 12, DEX: 12, CON: 18, INT: 18, WIS: 24, CHA: 22 },
    spells: ["Bless", "Cure Wounds", "Revivify", "Heal", "Mass Heal"],
    tags: ["especial"],
    appearanceWeight: 0.01
  },
  {
    id: "rita-claus",
    name: "Rita Claus",
    className: "Sorcerer",
    subclass: "Divine Soul",
    level: 12,
    armorClass: 16,
    stats: { STR: 9, DEX: 15, CON: 15, INT: 13, WIS: 16, CHA: 21 },
    spells: ["Ice Storm", "Cone of Cold", "Healing Word", "Fly"],
    tags: ["especial"],
    appearanceWeight: 0.07
  },
  {
    id: "salchicha-ovejero",
    name: "Perro salchicha y Ovejero Aleman",
    className: "Ranger",
    subclass: "Beast Master",
    level: 9,
    armorClass: 16,
    stats: { STR: 14, DEX: 19, CON: 16, INT: 6, WIS: 16, CHA: 12 },
    spells: ["Hunter's Mark", "Pass without Trace", "Cure Wounds"],
    tags: ["especial", "comico"],
    appearanceWeight: 0.05
  },
  {
    id: "lorkan",
    name: "Lorkan Pulguita",
    className: "Warlock",
    subclass: "The Hexblade",
    level: 17,
    armorClass: 18,
    stats: { STR: 6, DEX: 15, CON: 12, INT: 21, WIS: 15, CHA: 13 },
    spells: ["Disguise Self", "Hold Person", "Blur", "Misty Step"],
    tags: ["especial"],
    appearanceWeight: 0.07
  },
  {
    id: "Dynamo",
    name: "Dynamo Tuctha",
    className: "Warlock",
    subclass: "The Legacy",
    level: 14,
    armorClass: 17,
    stats: { STR: 8, DEX: 14, CON: 18, INT: 12, WIS: 12, CHA: 20 },
    spells: ["Blink", "Banishment", "Hex", "Misty Step"],
    tags: ["especial"],
    appearanceWeight: 0.1
  },
  {
    id: "Amari",
    name: "Brandon Amari Jackson",
    className: "Alchemist",
    subclass: "Mutagenist",
    level: 14,
    armorClass: 17,
    stats: { STR: 19, DEX: 20, CON: 20, INT: 20, WIS: 15, CHA: 10 },
    spells: [],
    tags: ["especial"],
    appearanceWeight: 0.1
  },
  {
    id: "Ivor-el-Pilar",
    name: "Ivor el Pilar",
    className: "Cleric",
    subclass: "Tempest Domain",
    level: 15,
    armorClass: 18,
    stats: { STR: 16, DEX: 8, CON: 18, INT: 12, WIS: 18, CHA: 6 },
    spells: ["Bless", "Revivify", "Death Ward", "Mass Cure Wounds"],
    tags: ["especial", "healer", "support"],
    eventLocked: true,
    appearanceWeight: 0.01
  },
  {
    id: "Robert-O",
    name: "Robber To",
    className: "Rogue",
    subclass: "charlatan",
    level: 10,
    armorClass: 16,
    stats: { STR: 8, DEX: 15, CON: 14, INT: 12, WIS: 10, CHA: 8 },
    spells: [],
    tags: ["especial", "vaquero"],
    eventLocked: true,
    appearanceWeight: 0.01
  },
  {
    id: "Ejemi",
    name: "Ejemi",
    className: "Illrigger",
    subclass: "Radiant Sentinel",
    level: 10,
    armorClass: 20,
    stats: { STR: 18, DEX: 14, CON: 14, INT: 12, WIS: 10, CHA: 12 },
    spells: [],
    tags: ["especial", "tank", "dps"],
    eventLocked: true,
    appearanceWeight: 0.01
  },
  {
    id: "Sven",
    name: "Sven",
    className: "Monk",
    subclass: "Way of the Wuxia",
    level: 11,
    armorClass: 18,
    stats: { STR: 12, DEX: 20, CON: 15, INT: 11, WIS: 18, CHA: 9 },
    spells: [],
    tags: ["especial", "dps", "comico"],
    eventLocked: true,
    appearanceWeight: 0.01
  },
  {
    id: "Krog",
    name: "Krog",
    className: "Fighter",
    subclass: "Champion",
    level: 10,
    armorClass: 18,
    stats: { STR: 20, DEX: 12, CON: 20, INT: 6, WIS: 10, CHA: 8 },
    spells: [],
    tags: ["especial", "tank", "dps", "comico"],
    eventLocked: true,
    appearanceWeight: 0.01
  },
  {
    id: "Chaja",
    name: "Chaja",
    className: "Rogue",
    subclass: "Scout",
    level: 10,
    armorClass: 17,
    stats: { STR: 9, DEX: 20, CON: 14, INT: 13, WIS: 16, CHA: 12 },
    spells: [],
    tags: ["especial", "tactician", "comico"],
    eventLocked: true,
    appearanceWeight: 0.01
  },
  {
    id: "Albercho",
    name: "Albercho",
    className: "Paladin",
    subclass: "Oath of Devotion",
    level: 20,
    armorClass: 22,
    portrait: "assets/portraits/Albercho.webp",
    stats: { STR: 22, DEX: 12, CON: 20, INT: 12, WIS: 16, CHA: 22 },
    spells: ["Bless", "Shield of Faith", "Aura of Vitality", "Banishing Smite", "Holy Weapon"],
    tags: ["especial", "tank", "support", "healer"],
    affinities: {
      "Sir-Messi": { score: 24, note: "Doce Caballeros" },
      "Sir-Gareth": { score: 24, note: "Doce Caballeros" },
      "Sir-Galliard": { score: 24, note: "Doce Caballeros" },
      "Sir-Lancelot": { score: 24, note: "Doce Caballeros" },
      "Sir-Kay": { score: 30, note: "Un juramento entre leyendas." }
    },
    eventLocked: true,
    appearanceWeight: 0.01
  },
  {
    id: "Fahona",
    name: "Fahona",
    className: "Ranger",
    subclass: "Beast Master",
    level: 6,
    armorClass: 16,
    portrait: "assets/portraits/fahona.webp",
    stats: { STR: 10, DEX: 18, CON: 14, INT: 11, WIS: 16, CHA: 12 },
    spells: ["Hunter's Mark", "Cure Wounds", "Pass without Trace", "Spike Growth"],
    tags: ["especial", "dps", "tactician", "support"],
    affinities: {
      "Vann": { score: 18, note: "Fighter Party" },
      "Argos": { score: 18, note: "Fighter Party" },
      "Rubi": { score: 18, note: "Fighter Party" },
      "Jhonny": { score: 18, note: "Fighter Party" }
    },
    eventLocked: true,
    appearanceWeight: 0.01
  },
  {
    id: "Marise",
    name: "Marice Lecharm",
    className: "Wizard",
    subclass: "School of Chronomancy",
    level: 6,
    armorClass: 14,
    portrait: "assets/portraits/marise.webp",
    stats: { STR: 8, DEX: 14, CON: 14, INT: 19, WIS: 13, CHA: 12 },
    spells: ["Shield", "Silvery Barbs", "Misty Step", "Web", "Haste", "Counterspell"],
    tags: ["especial", "spellcaster", "tactician", "debuffer"],
    affinities: {
      "Atlas": { score: 18, note: "Vaqueros" },
      "Ricardo": { score: 18, note: "Vaqueros" },
      "Colt": { score: 18, note: "Vaqueros" },
      "Dick": { score: 18, note: "Vaqueros" },
      "Robert-O": { score: 12, note: "Vaqueros" }
    },
    eventLocked: true,
    appearanceWeight: 0.01
  },
  {
    id: "Snaak",
    name: "Snaak",
    className: "Bard",
    subclass: "College of Lore",
    level: 10,
    armorClass: 15,
    stats: { STR: 9, DEX: 15, CON: 14, INT: 14, WIS: 12, CHA: 21 },
    spells: ["Vicious Mockery", "Healing Word", "Dissonant Whispers", "Hypnotic Pattern", "Counterspell", "Greater Invisibility"],
    tags: ["especial", "support", "tactician", "debuffer"],
    eventLocked: true,
    appearanceWeight: 0.01
  },
  {
    id: "Dick",
    name: "Dick",
    className: "Vagabond",
    subclass: "Adrenaline Junkie",
    level: 11,
    armorClass: 17,
    stats: { STR: 14, DEX: 8, CON: 20, INT: 12, WIS: 15, CHA: 18 },
    spells: [],
    tags: ["especial", "vaquero", "comico"],
    eventLocked: true,
    appearanceWeight: 0.01,
    affinities: {
      "Atlas": { score: 30, note: "Vaqueros" },
      "Ricardo": { score: 30, note: "Vaqueros" },
      "Colt": { score: 30, note: "Vaqueros" },
      "Robert-O": { score: 50, note: "Vaqueros" }
    },
  },
  {
    id: "jhon-cross",
    name: "Jhon Cross",
    className: "Investigator",
    subclass: "Occultist",
    level: 15,
    armorClass: 17,
    stats: { STR: 7, DEX: 16, CON: 14, INT: 20, WIS: 14, CHA: 13 },
    spells: ["Eldritch Blast", "Hellish Rebuke", "Counterspell", "Banishment","Sequester"],
    tags: ["especial", "spellcaster"],
    eventLocked: true,
    appearanceWeight: 0.01
  },
  {
    id: "pablo-rodriguez",
    name: "Pablo Rodriguez",
    className: "Ranger",
    subclass: "Bounty Hunter",
    level: 12,
    armorClass: 18,
    stats: { STR: 12, DEX: 21, CON: 16, INT: 14, WIS: 20, CHA: 14 },
    spells: ["Hunter's Mark", "Lightning Arrow", "Swift Quiver"],
    tags: ["especial", "dps", "tactician"],
    eventLocked: true,
    appearanceWeight: 0.01
  }
];

window.ROLE_ORDER = ROLE_ORDER;
window.ROLE_LABELS = ROLE_LABELS;
window.DND_PARTIES = DND_PARTIES;
window.CAMPAIGN_ENCOUNTERS = CAMPAIGN_ENCOUNTERS;
window.SPECIAL_GROUPS = SPECIAL_GROUPS;
window.SPECIAL_CHARACTERS = SPECIAL_CHARACTERS;
