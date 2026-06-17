const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const subclassDataPath = path.join(rootDir, "subclassData.js");
const classifiedPath = path.join(rootDir, "Class", "subclasses.classified.json");

const ROLE_PRIORITY_BY_PRIMARY = {
  Striker: ["DPS_MELEE", "DPS_RANGED", "FRONTLINER", "TACTICIAN"],
  Tank: ["FRONTLINER", "SUPPORT", "DPS_MELEE", "TACTICIAN"],
  Controller: ["TACTICIAN", "DPS_RANGED", "SUPPORT", "FRONTLINER"],
  Support: ["SUPPORT", "TACTICIAN", "FRONTLINER", "DPS_RANGED"],
  Buffer: ["SUPPORT", "TACTICIAN", "DPS_RANGED", "FRONTLINER"],
  Debuffer: ["TACTICIAN", "DPS_RANGED", "SUPPORT", "DPS_MELEE"],
  Summoner: ["TACTICIAN", "SUPPORT", "DPS_RANGED", "FRONTLINER"],
  Mobility: ["DPS_MELEE", "TACTICIAN", "DPS_RANGED", "FRONTLINER"],
  Utility: ["TACTICIAN", "SUPPORT", "DPS_RANGED", "FRONTLINER"],
  "Skill Expert": ["TACTICIAN", "SUPPORT", "DPS_RANGED", "DPS_MELEE"],
  Face: ["SUPPORT", "TACTICIAN", "DPS_RANGED", "DPS_MELEE"],
  Blaster: ["DPS_RANGED", "TACTICIAN", "SUPPORT", "FRONTLINER"],
  Healer: ["SUPPORT", "TACTICIAN", "FRONTLINER", "DPS_RANGED"],
  "Anti-Magic": ["TACTICIAN", "SUPPORT", "FRONTLINER", "DPS_RANGED"],
  Gish: ["DPS_MELEE", "FRONTLINER", "DPS_RANGED", "TACTICIAN"],
  Nova: ["DPS_MELEE", "DPS_RANGED", "FRONTLINER", "TACTICIAN"],
  "Sustained Damage": ["DPS_RANGED", "DPS_MELEE", "TACTICIAN", "FRONTLINER"],
  "Battlefield Leader": ["TACTICIAN", "SUPPORT", "FRONTLINER", "DPS_MELEE"],
  "Defensive Caster": ["SUPPORT", "FRONTLINER", "TACTICIAN", "DPS_RANGED"],
  Disruptor: ["TACTICIAN", "DPS_RANGED", "SUPPORT", "DPS_MELEE"],
  Assassin: ["DPS_MELEE", "TACTICIAN", "DPS_RANGED", "FRONTLINER"],
  Skirmisher: ["DPS_MELEE", "TACTICIAN", "DPS_RANGED", "FRONTLINER"],
  "Area Denial": ["TACTICIAN", "DPS_RANGED", "SUPPORT", "FRONTLINER"],
  Survivalist: ["FRONTLINER", "TACTICIAN", "SUPPORT", "DPS_MELEE"],
  Hybrid: ["TACTICIAN", "SUPPORT", "DPS_RANGED", "FRONTLINER"]
};

const DEFAULT_CLASS_ROLES = {
  alchemist: "Support",
  artificer: "Support",
  barbarian: "Striker",
  bard: "Support",
  binder: "Controller",
  "blood hunter": "Striker",
  captain: "Battlefield Leader",
  cleric: "Support",
  commoner: "Utility",
  craftsman: "Support",
  druid: "Controller",
  fighter: "Striker",
  gadgeteer: "Utility",
  gunslinger: "Striker",
  illrigger: "Debuffer",
  investigator: "Skill Expert",
  magus: "Gish",
  martyr: "Tank",
  monk: "Skirmisher",
  necromancer: "Summoner",
  occultist: "Controller",
  paladin: "Tank",
  psion: "Controller",
  ranger: "Striker",
  rogue: "Skill Expert",
  savant: "Skill Expert",
  shaman: "Support",
  sorcerer: "Blaster",
  vessel: "Support",
  warmage: "Blaster",
  warlock: "Blaster",
  witch: "Debuffer",
  wizard: "Controller",
  warlord: "Battlefield Leader"
};

const POWER_SOURCE_BY_CLASS = {
  alchemist: "Other",
  artificer: "Arcane Magic",
  barbarian: "Rage",
  bard: "Spellcasting",
  binder: "Other",
  "blood hunter": "Other",
  captain: "Maneuvers",
  cleric: "Divine Magic",
  commoner: "Other",
  craftsman: "Other",
  druid: "Primal Magic",
  fighter: "Weapons",
  gadgeteer: "Other",
  gunslinger: "Weapons",
  illrigger: "Divine Magic",
  investigator: "Other",
  magus: "Arcane Magic",
  martyr: "Divine Magic",
  monk: "Ki",
  necromancer: "Summons",
  occultist: "Arcane Magic",
  paladin: "Divine Magic",
  psion: "Psionics",
  ranger: "Weapons",
  rogue: "Sneak Attack",
  savant: "Other",
  shaman: "Primal Magic",
  sorcerer: "Arcane Magic",
  vessel: "Divine Magic",
  warmage: "Arcane Magic",
  warlock: "Arcane Magic",
  witch: "Arcane Magic",
  wizard: "Arcane Magic",
  warlord: "Maneuvers"
};

const PRIMARY_BASE_VALUE = {
  Striker: 6,
  Tank: 7,
  Controller: 8,
  Support: 8,
  Buffer: 8,
  Debuffer: 7,
  Summoner: 9,
  Mobility: 6,
  Utility: 6,
  "Skill Expert": 6,
  Face: 5,
  Blaster: 7,
  Healer: 8,
  "Anti-Magic": 7,
  Gish: 7,
  Nova: 7,
  "Sustained Damage": 7,
  "Battlefield Leader": 9,
  "Defensive Caster": 8,
  Disruptor: 8,
  Assassin: 6,
  Skirmisher: 6,
  "Area Denial": 8,
  Survivalist: 6,
  Hybrid: 6
};

const EXACT_OVERRIDES = {
  "fighter::battle master": ["Battlefield Leader", ["Striker", "Disruptor", "Support"]],
  "fighter::champion": ["Striker", ["Sustained Damage", "Survivalist"]],
  "fighter::eldritch knight": ["Gish", ["Tank", "Defensive Caster", "Striker"]],
  "fighter::samurai": ["Nova", ["Striker", "Face"]],
  "fighter::cavalier": ["Tank", ["Battlefield Leader", "Controller"]],
  "fighter::rune knight": ["Tank", ["Controller", "Gish"]],
  "fighter::echo knight": ["Battlefield Leader", ["Nova", "Mobility", "Striker"]],
  "wizard::school of evocation": ["Blaster", ["Area Denial", "Controller"]],
  "wizard::school of abjuration": ["Defensive Caster", ["Anti-Magic", "Support"]],
  "wizard::school of conjuration": ["Summoner", ["Utility", "Controller"]],
  "wizard::school of divination": ["Controller", ["Utility", "Disruptor"]],
  "wizard::school of enchantment": ["Controller", ["Face", "Debuffer"]],
  "wizard::school of illusion": ["Controller", ["Utility", "Disruptor"]],
  "wizard::school of necromancy": ["Summoner", ["Debuffer", "Sustained Damage"]],
  "wizard::school of transmutation": ["Utility", ["Support", "Survivalist"]],
  "wizard::school of war magic": ["Defensive Caster", ["Blaster", "Disruptor"]],
  "wizard::bladesinging": ["Gish", ["Defensive Caster", "Skirmisher"]],
  "rogue::assassin": ["Assassin", ["Nova", "Skill Expert"]],
  "rogue::thief": ["Skill Expert", ["Utility", "Skirmisher"]],
  "rogue::arcane trickster": ["Utility", ["Controller", "Assassin", "Gish"]],
  "rogue::mastermind": ["Battlefield Leader", ["Face", "Skill Expert"]],
  "rogue::swashbuckler": ["Skirmisher", ["Face", "Striker"]],
  "rogue::inquisitive": ["Skill Expert", ["Disruptor", "Utility"]],
  "rogue::scout": ["Skirmisher", ["Survivalist", "Skill Expert"]],
  "ranger::gloom stalker": ["Assassin", ["Nova", "Skirmisher", "Survivalist"]],
  "ranger::beast master": ["Summoner", ["Striker", "Survivalist"]],
  "ranger::hunter": ["Striker", ["Sustained Damage", "Survivalist"]],
  "ranger::horizon walker": ["Mobility", ["Gish", "Striker"]],
  "ranger::monster slayer": ["Disruptor", ["Anti-Magic", "Striker"]],
  "paladin::oath of vengeance": ["Nova", ["Striker", "Disruptor"]],
  "paladin::oath of conquest": ["Controller", ["Tank", "Debuffer"]],
  "paladin::oath of the ancients": ["Tank", ["Support", "Anti-Magic"]],
  "paladin::oath of redemption": ["Tank", ["Support", "Defensive Caster"]],
  "paladin::oath of devotion": ["Support", ["Tank", "Striker"]],
  "cleric::life domain": ["Healer", ["Support", "Defensive Caster"]],
  "cleric::light domain": ["Blaster", ["Support", "Area Denial"]],
  "cleric::tempest domain": ["Blaster", ["Tank", "Area Denial"]],
  "cleric::war domain": ["Gish", ["Support", "Striker"]],
  "cleric::forge domain": ["Tank", ["Support", "Buffer"]],
  "cleric::grave domain": ["Support", ["Debuffer", "Healer"]],
  "cleric::order domain": ["Battlefield Leader", ["Buffer", "Support"]],
  "cleric::peace domain": ["Buffer", ["Support", "Healer"]],
  "cleric::twilight domain": ["Support", ["Defensive Caster", "Buffer"]],
  "druid::circle of the moon": ["Tank", ["Gish", "Survivalist"]],
  "druid::circle of the shepherd": ["Summoner", ["Support", "Buffer"]],
  "druid::circle of wildfire": ["Summoner", ["Blaster", "Healer"]],
  "druid::circle of stars": ["Support", ["Blaster", "Healer"]],
  "druid::circle of spores": ["Sustained Damage", ["Tank", "Debuffer"]],
  "bard::college of lore": ["Skill Expert", ["Controller", "Support"]],
  "bard::college of eloquence": ["Face", ["Buffer", "Debuffer"]],
  "bard::college of glamour": ["Support", ["Face", "Battlefield Leader"]],
  "bard::college of swords": ["Gish", ["Skirmisher", "Striker"]],
  "bard::college of valor": ["Battlefield Leader", ["Gish", "Support"]],
  "warlock::hexblade": ["Gish", ["Nova", "Striker"]],
  "warlock::the celestial": ["Healer", ["Support", "Blaster"]],
  "warlock::the fiend": ["Blaster", ["Sustained Damage", "Survivalist"]],
  "sorcerer::divine soul": ["Support", ["Healer", "Blaster"]],
  "sorcerer::draconic bloodline": ["Blaster", ["Defensive Caster", "Striker"]],
  "sorcerer::shadow magic": ["Debuffer", ["Controller", "Survivalist"]],
  "sorcerer::storm sorcery": ["Mobility", ["Blaster", "Skirmisher"]],
  "monk::way of mercy": ["Healer", ["Debuffer", "Skirmisher"]],
  "monk::way of shadow": ["Assassin", ["Utility", "Skirmisher"]],
  "monk::way of the open hand": ["Controller", ["Skirmisher", "Striker"]],
  "monk::way of the kensei": ["Striker", ["Skirmisher", "Sustained Damage"]]
};

function normalizeLookupText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

function includesAny(text, values) {
  return values.some((value) => text.includes(value));
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function getBaseClassKey(baseClass) {
  const normalized = normalizeLookupText(baseClass);
  if (normalized.includes("wizard")) return "wizard";
  if (normalized.includes("rogue")) return "rogue";
  if (normalized.includes("warlord")) return "warlord";
  return normalized.split(" ")[0] || normalized;
}

function getExactOverride(baseClass, subclassName) {
  const direct = `${normalizeLookupText(baseClass)}::${normalizeLookupText(subclassName)}`;
  if (EXACT_OVERRIDES[direct]) return EXACT_OVERRIDES[direct];
  const baseKey = getBaseClassKey(baseClass);
  return EXACT_OVERRIDES[`${baseKey}::${normalizeLookupText(subclassName)}`] || null;
}

function classifyPrimaryRole(baseClass, subclassName) {
  const override = getExactOverride(baseClass, subclassName);
  if (override) {
    return override[0];
  }

  const baseKey = getBaseClassKey(baseClass);
  const text = `${normalizeLookupText(baseClass)} ${normalizeLookupText(subclassName)}`;

  if (includesAny(text, ["life", "mercy", "healer", "healing", "restoration", "apothecary", "physician", "medicine", "vitality", "hospital"])) return "Healer";
  if (includesAny(text, ["beast master", "drake", "shepherd", "conjuration", "summon", "summoner", "companion", "familiar", "pet", "ooze", "rancher", "necromancy", "necromancer", "horde", "swarm", "spirit", "wildfire", "construct", "golem", "cryptozoologist"])) return "Summoner";
  if (includesAny(text, ["abjuration", "ward", "guardian", "armorer", "armor", "forge", "shield", "bastion", "redemption", "crown", "ancients", "stone", "bear", "juggernaut", "defense", "protection", "watcher"])) return baseKey === "wizard" || baseKey === "sorcerer" ? "Defensive Caster" : "Tank";
  if (includesAny(text, ["counter", "anti magic", "antimagic", "mage hunter", "monster slayer", "witch hunter", "exorcist", "null", "banisher", "inquisitor"])) return "Anti-Magic";
  if (includesAny(text, ["battle master", "commander", "captain", "warlord", "leader", "order", "banner", "tactician", "strategist", "mastermind", "marshal", "schemes", "formation", "valor"])) return "Battlefield Leader";
  if (includesAny(text, ["peace", "twilight", "glamour", "inspiration", "mentor", "teacher", "sponsor", "devotion", "community", "unity", "hospitality"])) return "Support";
  if (includesAny(text, ["bless", "luck", "fortune", "clockwork", "fate", "chronomancy", "time", "alacrity", "boon", "enhance", "rune"])) return "Buffer";
  if (includesAny(text, ["bane", "curse", "hex", "shadow", "death", "grave", "long death", "poison", "venom", "fear", "dread", "conquest", "whispers", "fiend", "plague", "torment"])) return "Debuffer";
  if (includesAny(text, ["enchantment", "illusion", "divination", "chronurgy", "graviturgy", "gravity", "control", "hypnotic", "dream", "mind", "psionic", "aberrant", "domination", "open hand"])) return "Controller";
  if (includesAny(text, ["wall", "storm herald", "storm", "tempest", "winter", "frost", "spore", "spores", "terrain", "thorn", "trap", "hazard", "battlefield", "web"])) return "Area Denial";
  if (includesAny(text, ["evocation", "fire", "flame", "light", "tempest", "storm", "dragon", "draconic", "pyro", "lightning", "thunder", "artillerist", "bomber", "bomb", "cannon", "sun", "radiant"])) return "Blaster";
  if (includesAny(text, ["eldritch knight", "blade", "bladesing", "hexblade", "sword", "swords", "battle smith", "war domain", "magus", "arcane archer", "psi warrior", "war magic"])) return "Gish";
  if (includesAny(text, ["assassin", "gloom", "stalker", "shadow", "phantom", "whisper", "ambush", "sniper", "ninja", "shinobi"])) return "Assassin";
  if (includesAny(text, ["vengeance", "samurai", "berserker", "zealot", "brute", "giant", "juggernaut", "nova", "executioner", "slayer", "killer"])) return "Nova";
  if (includesAny(text, ["champion", "hunter", "kensei", "gunslinger", "sharpshooter", "archer", "bow", "pistol", "blade", "beast", "lycan", "mutant"])) return "Striker";
  if (includesAny(text, ["scout", "horizon", "drunken", "swashbuckler", "swift", "wind", "aeronaut", "teleport", "portal", "nomad", "runner", "skirmish", "mobile"])) return "Skirmisher";
  if (includesAny(text, ["thief", "lore", "knowledge", "archivist", "scribe", "cartographer", "investigator", "detective", "archeologist", "expert", "tools", "craft", "invention"])) return "Skill Expert";
  if (includesAny(text, ["eloquence", "fey", "fey wanderer", "court", "mask", "diplomat", "charmer", "silver tongue", "social"])) return "Face";
  if (includesAny(text, ["land", "dreams", "trickery", "creation", "transmutation", "alchemy", "ritual", "wanderer", "explorer", "survival", "totem"])) return "Utility";

  return DEFAULT_CLASS_ROLES[baseKey] || "Hybrid";
}

function getSecondaryRoles(baseClass, subclassName, primaryRole) {
  const override = getExactOverride(baseClass, subclassName);
  const baseKey = getBaseClassKey(baseClass);
  const text = `${normalizeLookupText(baseClass)} ${normalizeLookupText(subclassName)}`;
  const roles = override ? [...override[1]] : [];
  const primaryIsDamageLeaning = ["Striker", "Blaster", "Nova", "Sustained Damage", "Assassin", "Skirmisher", "Gish"].includes(primaryRole);
  const primaryCanTakeMartialDamageSecondary = ["Mobility", "Survivalist", "Hybrid"].includes(primaryRole);

  if (
    ["barbarian", "fighter", "paladin", "monk", "ranger", "rogue", "gunslinger"].includes(baseKey) &&
    (primaryIsDamageLeaning || primaryCanTakeMartialDamageSecondary)
  ) {
    roles.push("Striker");
  }
  if (["wizard", "sorcerer", "warlock", "warmage"].includes(baseKey)) roles.push("Controller", "Blaster");
  if (["cleric", "bard", "druid", "artificer", "shaman"].includes(baseKey)) roles.push("Support");
  if (includesAny(text, ["pet", "companion", "summon", "conjure", "necrom", "spirit", "swarm", "beast"])) roles.push("Summoner");
  if (includesAny(text, ["heal", "life", "mercy", "restoration", "vitality"])) roles.push("Healer");
  if (includesAny(text, ["fear", "curse", "hex", "poison", "shadow", "grave", "death"])) roles.push("Debuffer");
  if (includesAny(text, ["control", "enchant", "illusion", "gravity", "time", "chron", "divination", "wall"])) roles.push("Controller");
  if (includesAny(text, ["armor", "shield", "guardian", "ward", "forge", "defense"])) roles.push("Tank", "Defensive Caster");
  if (includesAny(text, ["leader", "commander", "battle master", "order", "mastermind", "valor"])) roles.push("Battlefield Leader");
  if (includesAny(text, ["lore", "knowledge", "thief", "scout", "archivist", "investigator", "cartographer"])) roles.push("Skill Expert", "Utility");
  if (includesAny(text, ["gloom", "assassin", "shadow", "stalker", "ambush"])) roles.push("Assassin");
  if (includesAny(text, ["storm", "wind", "horizon", "swashbuckler", "drunken", "aeronaut", "teleport"])) roles.push("Mobility", "Skirmisher");
  if (includesAny(text, ["counter", "watcher", "monster slayer", "abjuration", "anti magic"])) roles.push("Anti-Magic", "Disruptor");

  return unique(roles.filter((role) => role !== primaryRole)).slice(0, 4);
}

function getTags(baseClass, subclassName, primaryRole, secondaryRoles) {
  const baseKey = getBaseClassKey(baseClass);
  const text = `${normalizeLookupText(baseClass)} ${normalizeLookupText(subclassName)}`;
  const tags = [];

  if (["barbarian", "fighter", "monk", "rogue", "ranger", "paladin", "gunslinger", "blood"].includes(baseKey)) tags.push("Martial", "Weapon Attacks");
  if (["ranger", "paladin", "artificer"].includes(baseKey)) tags.push("Half-Caster");
  if (["fighter", "rogue"].includes(baseKey) && includesAny(text, ["eldritch", "arcane"])) tags.push("Third-Caster");
  if (["wizard", "sorcerer", "cleric", "druid", "bard", "warlock", "witch", "warmage", "shaman", "necromancer", "psion", "binder"].includes(baseKey)) tags.push("Spellcasting", "Backline");

  const allRoles = [primaryRole, ...secondaryRoles];
  if (allRoles.some((role) => ["Striker", "Nova", "Assassin", "Blaster"].includes(role))) tags.push("High Damage", "Single Target");
  if (allRoles.includes("Nova")) tags.push("Burst Damage", "Resource Heavy", "Boss Killer");
  if (allRoles.includes("Sustained Damage")) tags.push("Sustained Damage");
  if (allRoles.includes("Blaster")) tags.push("Area Damage", "Spell Attacks", "Horde Clear");
  if (allRoles.includes("Tank")) tags.push("Defensive Features", "Frontline", "High AC", "Damage Reduction");
  if (allRoles.includes("Defensive Caster")) tags.push("Defensive Features", "Concentration Dependent");
  if (allRoles.includes("Controller")) tags.push("Crowd Control", "Saving Throw Control", "Battlefield Control", "Concentration Dependent");
  if (allRoles.includes("Area Denial")) tags.push("Battlefield Control", "Area Damage", "Forced Movement");
  if (allRoles.includes("Support")) tags.push("Buffs Allies", "Utility Heavy");
  if (allRoles.includes("Buffer")) tags.push("Buffs Allies", "Advantage Generation");
  if (allRoles.includes("Healer")) tags.push("Healing", "Emergency Healing", "Condition Removal");
  if (allRoles.includes("Debuffer")) tags.push("Debuffs Enemies", "Disadvantage Generation");
  if (allRoles.includes("Summoner")) tags.push("Summons", "Pet Companion", "Action Economy", "Concentration Dependent");
  if (allRoles.includes("Battlefield Leader")) tags.push("Action Economy", "Buffs Allies", "Initiative Bonus");
  if (allRoles.includes("Anti-Magic")) tags.push("Anti-Magic", "Counterspell Support", "Campaign Dependent");
  if (allRoles.includes("Disruptor")) tags.push("Reaction Based", "Debuffs Enemies", "Action Economy");
  if (allRoles.includes("Mobility") || allRoles.includes("Skirmisher")) tags.push("Mobility", "Bonus Action Heavy");
  if (allRoles.includes("Assassin")) tags.push("Stealth", "Burst Damage", "Critical Hits", "Initiative Bonus");
  if (allRoles.includes("Skill Expert")) tags.push("Expertise", "Exploration", "Utility Heavy");
  if (allRoles.includes("Face")) tags.push("Social", "Advantage Generation");
  if (allRoles.includes("Gish")) tags.push("Melee", "Spellcasting", "Flexible Role");

  if (includesAny(text, ["extra attack", "fighter", "barbarian", "paladin", "ranger", "monk"])) tags.push("Extra Attack");
  if (includesAny(text, ["reaction", "counter", "riposte", "ward", "shield"])) tags.push("Reaction Based");
  if (includesAny(text, ["bonus", "swift", "cunning", "ki", "flurry", "rage", "hex"])) tags.push("Bonus Action Heavy");
  if (includesAny(text, ["flight", "aeronaut", "wing", "storm", "dragon"])) tags.push("Flight");
  if (includesAny(text, ["teleport", "horizon", "portal", "warp"])) tags.push("Teleportation");
  if (includesAny(text, ["fear", "dread", "conquest"])) tags.push("Fear");
  if (includesAny(text, ["charm", "fey", "glamour", "enchantment"])) tags.push("Charm");
  if (includesAny(text, ["grapple", "wrestler", "open hand"])) tags.push("Grapple", "Prone");
  if (includesAny(text, ["high", "arch", "master", "ancient", "chronurgy", "twilight", "peace", "shepherd", "conjure"])) tags.push("High Scaling");
  if (includesAny(text, ["berserker", "champion", "purple dragon", "undying"])) tags.push("Low Scaling");
  if (["warlock", "fighter", "monk"].includes(baseKey)) tags.push("Short Rest Resource");
  if (["wizard", "sorcerer", "cleric", "druid", "bard", "paladin", "ranger", "artificer"].includes(baseKey)) tags.push("Long Rest Resource");

  return unique(tags).slice(0, 14);
}

function getPowerSource(baseClass, primaryRole) {
  if (primaryRole === "Summoner") return "Summons";
  const baseKey = getBaseClassKey(baseClass);
  return POWER_SOURCE_BY_CLASS[baseKey] || "Other";
}

function getPartyValue(primaryRole, tags) {
  let value = PRIMARY_BASE_VALUE[primaryRole] || 6;
  if (tags.includes("Action Economy")) value += 1;
  if (tags.includes("High Scaling")) value += 1;
  if (tags.includes("Utility Heavy")) value += 0.5;
  if (tags.includes("Low Scaling")) value -= 1;
  if (tags.includes("Campaign Dependent")) value -= 0.5;
  if (tags.includes("Resource Heavy")) value -= 0.5;
  return Math.max(1, Math.min(10, Math.round(value)));
}

function getComplexity(primaryRole, tags) {
  let value = ["Summoner", "Controller", "Gish", "Battlefield Leader", "Disruptor"].includes(primaryRole) ? 7 : 4;
  if (["Support", "Buffer", "Debuffer", "Defensive Caster", "Anti-Magic"].includes(primaryRole)) value += 1;
  if (tags.includes("Spellcasting")) value += 1;
  if (tags.includes("Action Economy")) value += 1;
  if (tags.includes("Resource Heavy") || tags.includes("Concentration Dependent")) value += 1;
  if (tags.includes("Martial") && !tags.includes("Spellcasting")) value -= 1;
  return Math.max(1, Math.min(10, value));
}

function combatStyleFor(primaryRole, tags) {
  const styles = {
    Striker: "Busca dano directo y presion constante sobre objetivos prioritarios.",
    Tank: "Se queda en primera linea, absorbe dano y protege espacios clave.",
    Controller: "Gana peleas limitando movimiento, acciones o posicionamiento enemigo.",
    Support: "Sostiene la party con proteccion, ventajas y recursos defensivos.",
    Buffer: "Aumenta el rendimiento del grupo con mejoras a tiradas, dano o defensas.",
    Debuffer: "Reduce la eficacia enemiga con penalizaciones, miedo, venenos o maldiciones.",
    Summoner: "Agrega aliados, mascotas o efectos persistentes para ganar economia de acciones.",
    Mobility: "Reposiciona, persigue o escapa para elegir cuando intercambiar golpes.",
    Utility: "Resuelve problemas con herramientas, magia flexible y opciones fuera de combate.",
    "Skill Expert": "Domina habilidades y escenas de investigacion, sigilo o exploracion.",
    Face: "Controla escenas sociales y aporta liderazgo dentro y fuera del combate.",
    Blaster: "Hace dano magico directo, especialmente contra grupos o zonas.",
    Healer: "Recupera aliados, remueve condiciones y evita que la party colapse.",
    "Anti-Magic": "Niega magia enemiga, castiga casters o protege contra efectos magicos.",
    Gish: "Combina armas y magia para alternar frontline, burst y defensa.",
    Nova: "Gasta recursos para producir picos de dano en pocos turnos.",
    "Sustained Damage": "Mantiene dano estable durante encuentros largos.",
    "Battlefield Leader": "Coordina aliados, mejora acciones y reposiciona la pelea.",
    "Defensive Caster": "Usa magia para sobrevivir, mantener concentracion y proteger aliados.",
    Disruptor: "Interrumpe reacciones, concentracion, acciones o planes enemigos.",
    Assassin: "Busca emboscadas, ventaja temprana y eliminar objetivos vulnerables.",
    Skirmisher: "Entra, golpea y sale evitando quedarse trabado.",
    "Area Denial": "Controla zonas del mapa y castiga a quien se mueva mal.",
    Survivalist: "Resiste condiciones adversas y funciona bien en viajes largos.",
    Hybrid: "Cubre varios trabajos segun la escena, sin dominar uno solo."
  };
  return styles[primaryRole] || styles.Hybrid;
}

function crRelevanceFor(primaryRole, tags) {
  if (tags.includes("Action Economy")) return "Sube mucho el CR efectivo porque agrega acciones, ataques, cuerpos o turnos aliados.";
  if (["Controller", "Area Denial", "Disruptor"].includes(primaryRole)) return "Aumenta el CR tactico al negar turnos, movimiento o decisiones enemigas.";
  if (["Tank", "Defensive Caster", "Healer", "Support"].includes(primaryRole)) return "Aumenta CR defensivo al mejorar supervivencia y estabilidad de la party.";
  if (["Striker", "Blaster", "Nova", "Assassin", "Sustained Damage"].includes(primaryRole)) return "Aumenta CR ofensivo por dano, burst o presion sobre objetivos clave.";
  if (primaryRole === "Anti-Magic") return "Su CR depende de la campana, pero sube mucho contra enemigos que usan magia.";
  return "Aporta valor situacional; mejora composicion y resolucion de escenas mas que dano bruto.";
}

function scalingNotesFor(primaryRole, tags) {
  if (tags.includes("High Scaling")) return "Escala muy bien cuando obtiene mas recursos, mejores features o efectos de alto nivel.";
  if (tags.includes("Low Scaling")) return "Es fuerte o simple al inicio, pero puede quedarse atras si no recibe apoyo de equipo o recursos.";
  if (tags.includes("Summons") || tags.includes("Action Economy")) return "Escala con numero de acciones, aliados extra y duracion de efectos persistentes.";
  if (tags.includes("Spellcasting")) return "Escala con slots, DC, concentracion y acceso a spells de mayor impacto.";
  if (tags.includes("Extra Attack")) return "Escala bien en niveles marciales medios por ataques extra y mejoras de dano.";
  return "Escala de forma estable; su valor depende de stats, equipo y ritmo de descanso.";
}

function weaknessNotesFor(primaryRole, tags) {
  const notes = [];
  if (tags.includes("Concentration Dependent")) notes.push("sufre si pierde concentracion");
  if (tags.includes("Resource Heavy")) notes.push("depende de recursos limitados");
  if (tags.includes("Backline")) notes.push("puede caer bajo presion directa");
  if (tags.includes("Frontline")) notes.push("requiere buena defensa y curacion");
  if (primaryRole === "Face" || primaryRole === "Skill Expert") notes.push("su poder de combate directo puede ser menor");
  if (primaryRole === "Anti-Magic") notes.push("depende mucho de enfrentar magia enemiga");
  if (!notes.length) notes.push("depende de posicionamiento, stats correctos y buen uso de recursos");
  return `Debilidades principales: ${notes.join(", ")}.`;
}

function mapToRolePriority(baseClass, primaryRole, secondaryRoles) {
  const rolePriority = [];
  [primaryRole, ...secondaryRoles].forEach((role) => {
    (ROLE_PRIORITY_BY_PRIMARY[role] || ROLE_PRIORITY_BY_PRIMARY.Hybrid).forEach((mapped) => rolePriority.push(mapped));
  });
  const baseDefault = ROLE_PRIORITY_BY_PRIMARY[DEFAULT_CLASS_ROLES[getBaseClassKey(baseClass)] || "Hybrid"] || [];
  return unique([...rolePriority, ...baseDefault]).slice(0, 4);
}

function classifySubclass(baseClass, subclassName) {
  const primaryRole = classifyPrimaryRole(baseClass, subclassName);
  const secondaryRoles = getSecondaryRoles(baseClass, subclassName, primaryRole);
  const tags = getTags(baseClass, subclassName, primaryRole, secondaryRoles);
  const partyValue = getPartyValue(primaryRole, tags);

  return {
    subclassName,
    baseClass,
    primaryRole,
    secondaryRoles,
    tags,
    combatStyle: combatStyleFor(primaryRole, tags),
    powerSource: getPowerSource(baseClass, primaryRole),
    partyValue,
    crRelevance: crRelevanceFor(primaryRole, tags),
    scalingNotes: scalingNotesFor(primaryRole, tags),
    weaknessNotes: weaknessNotesFor(primaryRole, tags),
    complexityScore: getComplexity(primaryRole, tags),
    rolePriority: mapToRolePriority(baseClass, primaryRole, secondaryRoles)
  };
}

function loadExistingSubclassData() {
  const loaded = require(subclassDataPath);
  const classificationData = loaded.DND_SUBCLASS_CLASSIFICATION_DATA;
  if (classificationData) {
    return Object.fromEntries(Object.entries(classificationData).map(([baseClass, subclasses]) => [
      baseClass,
      Object.fromEntries(Object.keys(subclasses || {}).map((subclassName) => [subclassName, true]))
    ]));
  }
  throw new Error("DND_SUBCLASS_CLASSIFICATION_DATA is required to regenerate subclass data.");
}

function writeSubclassData(classificationMap) {
  const contents = `// Generated from /Class subclass headings. Edit tools/generateSubclassData.js for classifier rules.\n` +
    `const DND_SUBCLASS_CLASSIFICATION_DATA = ${JSON.stringify(classificationMap, null, 2)};\n\n` +
    `if (typeof globalThis !== "undefined") {\n` +
    `  globalThis.DND_SUBCLASS_CLASSIFICATION_DATA = DND_SUBCLASS_CLASSIFICATION_DATA;\n` +
    `}\n\n` +
    `if (typeof module !== "undefined" && module.exports) {\n` +
    `  module.exports = { DND_SUBCLASS_CLASSIFICATION_DATA };\n` +
    `}\n`;

  fs.writeFileSync(subclassDataPath, contents, "utf8");
}

function main() {
  const roleData = loadExistingSubclassData();
  const classificationMap = {};
  const flatClassifications = [];

  Object.entries(roleData).forEach(([baseClass, subclasses]) => {
    classificationMap[baseClass] = {};
    Object.keys(subclasses || {}).forEach((subclassName) => {
      const classification = classifySubclass(baseClass, subclassName);
      classificationMap[baseClass][subclassName] = classification;
      const { rolePriority, ...publicClassification } = classification;
      flatClassifications.push(publicClassification);
    });
  });

  fs.writeFileSync(classifiedPath, `${JSON.stringify(flatClassifications, null, 2)}\n`, "utf8");
  writeSubclassData(classificationMap);

  const roleCounts = flatClassifications.reduce((counts, subclass) => {
    counts[subclass.primaryRole] = (counts[subclass.primaryRole] || 0) + 1;
    return counts;
  }, {});
  console.log(`Classified ${flatClassifications.length} subclasses.`);
  console.log(JSON.stringify(roleCounts, null, 2));
}

main();
