const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const sourcePath = path.join(rootDir, "Class", "spells.json");
const classifiedPath = path.join(rootDir, "Class", "spells.classified.json");
const runtimePath = path.join(rootDir, "spellData.js");

const CLASS_COLUMNS = {
  bardo: "Bard",
  clerigo: "Cleric",
  druida: "Druid",
  paladin: "Paladin",
  ranger: "Ranger",
  sorcerer: "Sorcerer",
  warlock: "Warlock",
  wizard: "Wizard",
  artificer: "Artificer",
  warmage: "Warmage",
  witch: "Witch",
  martyrs: "Martyr",
  vessel: "Vessel",
  shaman: "Shaman",
  necromancer: "Necromancer",
  magus: "Magus",
  investigator: "Investigator"
};

const CATEGORIES = [
  "Damage",
  "Control",
  "Defense",
  "Healing",
  "Buff",
  "Debuff",
  "Mobility",
  "Summon",
  "Utility",
  "Anti-Magic",
  "Information",
  "Save-or-Suck"
];

const DAMAGE_TYPES = [
  "Acid",
  "Cold",
  "Fire",
  "Force",
  "Lightning",
  "Necrotic",
  "Poison",
  "Psychic",
  "Radiant",
  "Thunder",
  "Bludgeoning",
  "Piercing",
  "Slashing"
];

const KNOWN_OVERRIDES = {
  "hypnotic pattern": {
    category: "Control",
    tags: ["Concentration", "Area", "Multi-Target", "Wis Save", "Action Economy", "Persistent Effect", "Save-or-Suck"],
    useType: "Combat",
    impactScore: 9,
    crRelevance: "Muy alta: puede quitar varios turnos enemigos y cambia la economia de acciones."
  },
  web: {
    category: "Control",
    tags: ["Concentration", "Area", "Multi-Target", "Dex Save", "Action Economy", "Persistent Effect"],
    useType: "Combat",
    impactScore: 8,
    crRelevance: "Muy alta: restringe movimiento, fuerza saves repetidos y permite concentrar dano."
  },
  banishment: {
    category: "Save-or-Suck",
    tags: ["Concentration", "Single Target", "Cha Save", "Action Economy", "Control", "Upcast Scaling"],
    useType: "Combat",
    impactScore: 9,
    crRelevance: "Muy alta: puede sacar una amenaza entera del combate con una sola salvacion."
  },
  polymorph: {
    category: "Save-or-Suck",
    tags: ["Concentration", "Single Target", "Wis Save", "Action Economy", "Buff", "Control", "Debuff", "Persistent Effect"],
    useType: "Mixed",
    impactScore: 9,
    crRelevance: "Muy alta: puede transformar aliados en tanques o neutralizar enemigos clave."
  },
  "wall of force": {
    category: "Control",
    tags: ["Concentration", "Area", "Action Economy", "Persistent Effect", "Defense"],
    useType: "Combat",
    impactScore: 10,
    crRelevance: "Extrema: divide encuentros y puede negar amenazas sin tirada de salvacion."
  },
  "spirit guardians": {
    category: "Damage",
    tags: ["Concentration", "Area", "Multi-Target", "Wis Save", "Persistent Effect", "Debuff", "Radiant", "Necrotic"],
    useType: "Combat",
    impactScore: 9,
    crRelevance: "Muy alta: dano persistente de area y control de movimiento alrededor del caster."
  },
  "conjure animals": {
    category: "Summon",
    tags: ["Concentration", "Multi-Target", "Action Economy", "Persistent Effect", "Upcast Scaling"],
    useType: "Combat",
    impactScore: 10,
    crRelevance: "Extrema: agrega cuerpos, ataques y acciones extra al bando del caster."
  },
  counterspell: {
    category: "Anti-Magic",
    tags: ["Reaction", "Action Economy", "Single Target"],
    useType: "Combat",
    impactScore: 9,
    crRelevance: "Muy alta: cancela acciones enemigas y puede negar spells decisivos."
  },
  bless: {
    category: "Buff",
    tags: ["Concentration", "Multi-Target", "Upcast Scaling", "Action Economy"],
    useType: "Combat",
    impactScore: 8,
    crRelevance: "Alta: sube ataques y salvaciones de varios aliados durante todo el combate."
  },
  shield: {
    category: "Defense",
    tags: ["Reaction", "Single Target", "Action Economy"],
    useType: "Combat",
    impactScore: 7,
    crRelevance: "Alta: evita golpes importantes y sube supervivencia efectiva."
  },
  "absorb elements": {
    category: "Defense",
    tags: ["Reaction", "Single Target", "Elemental", "Action Economy"],
    useType: "Combat",
    impactScore: 7,
    crRelevance: "Alta: reduce dano elemental grande y conserva al personaje en pie."
  },
  fireball: {
    category: "Damage",
    tags: ["Area", "Multi-Target", "Dex Save", "Fire"],
    useType: "Combat",
    impactScore: 8,
    crRelevance: "Alta: gran dano de area que puede decidir encuentros con varios enemigos."
  },
  "lightning bolt": {
    category: "Damage",
    tags: ["Area", "Multi-Target", "Dex Save", "Lightning"],
    useType: "Combat",
    impactScore: 8,
    crRelevance: "Alta: gran dano lineal que castiga formaciones agrupadas."
  },
  "healing word": {
    category: "Healing",
    tags: ["Bonus Action", "Single Target", "Upcast Scaling", "Action Economy"],
    useType: "Combat",
    impactScore: 6,
    crRelevance: "Alta: levanta aliados caidos gastando bonus action."
  },
  "cure wounds": {
    category: "Healing",
    tags: ["Single Target", "Upcast Scaling"],
    useType: "Mixed",
    impactScore: 5,
    crRelevance: "Media: recupera HP, pero compite con la accion principal."
  },
  revivify: {
    category: "Healing",
    tags: ["Single Target", "Action Economy"],
    useType: "Combat",
    impactScore: 7,
    crRelevance: "Alta: revierte una baja reciente y conserva recursos de party."
  },
  haste: {
    category: "Buff",
    tags: ["Concentration", "Single Target", "Action Economy", "Defense", "Mobility"],
    useType: "Combat",
    impactScore: 8,
    crRelevance: "Alta: agrega acciones, AC y movilidad, aunque depende de concentracion."
  },
  slow: {
    category: "Debuff",
    tags: ["Concentration", "Area", "Multi-Target", "Wis Save", "Action Economy", "Persistent Effect"],
    useType: "Combat",
    impactScore: 8,
    crRelevance: "Alta: reduce acciones, defensa y volumen ofensivo enemigo."
  },
  "hold person": {
    category: "Save-or-Suck",
    tags: ["Concentration", "Single Target", "Wis Save", "Control", "Action Economy", "Upcast Scaling", "Persistent Effect"],
    useType: "Combat",
    impactScore: 8,
    crRelevance: "Alta: paraliza humanoides y habilita criticos automaticos cercanos."
  },
  "hold monster": {
    category: "Save-or-Suck",
    tags: ["Concentration", "Single Target", "Wis Save", "Control", "Action Economy", "Upcast Scaling", "Persistent Effect"],
    useType: "Combat",
    impactScore: 9,
    crRelevance: "Muy alta: paraliza casi cualquier criatura y puede decidir la pelea."
  },
  "forcecage": {
    category: "Control",
    tags: ["Area", "Action Economy", "Persistent Effect"],
    useType: "Combat",
    impactScore: 10,
    crRelevance: "Extrema: encierra amenazas sin concentracion y altera el encuentro completo."
  },
  maze: {
    category: "Control",
    tags: ["Concentration", "Single Target", "Action Economy", "Persistent Effect"],
    useType: "Combat",
    impactScore: 9,
    crRelevance: "Muy alta: elimina temporalmente un enemigo fuerte sin salvacion inicial."
  },
  "animate objects": {
    category: "Summon",
    tags: ["Concentration", "Multi-Target", "Action Economy", "Persistent Effect"],
    useType: "Combat",
    impactScore: 10,
    crRelevance: "Extrema: convierte objetos en muchas acciones ofensivas adicionales."
  },
  "spiritual weapon": {
    category: "Summon",
    tags: ["Bonus Action", "Action Economy", "Persistent Effect", "Force"],
    useType: "Combat",
    impactScore: 7,
    crRelevance: "Alta: fuente persistente de dano sin usar concentracion."
  },
  "dispel magic": {
    category: "Anti-Magic",
    tags: ["Single Target", "Upcast Scaling"],
    useType: "Mixed",
    impactScore: 7,
    crRelevance: "Alta contra casters: remueve efectos que sostienen defensa, control o buffs."
  },
  "antimagic field": {
    category: "Anti-Magic",
    tags: ["Concentration", "Area", "Persistent Effect", "Defense"],
    useType: "Combat",
    impactScore: 9,
    crRelevance: "Muy alta: apaga magia y objetos magicos en un area."
  }
};

function normalizeLookupText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

function normalizeLooseText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function parseBool(value) {
  return ["si", "yes", "true", "1"].includes(normalizeLooseText(value).trim());
}

function parseLevel(value) {
  const level = Number.parseInt(value, 10);
  return Number.isFinite(level) ? level : 0;
}

function hasAny(text, patterns) {
  return patterns.some((pattern) => {
    if (pattern instanceof RegExp) {
      return pattern.test(text);
    }
    return text.includes(pattern);
  });
}

function titleCaseTag(tag) {
  const aliases = {
    aoe: "Area",
    "single target": "Single Target",
    "multi target": "Multi-Target",
    "action economy": "Action Economy",
    "persistent effect": "Persistent Effect",
    "bonus action": "Bonus Action",
    "attack roll": "Attack Roll",
    "upcast scaling": "Upcast Scaling",
    "anti magic": "Anti-Magic",
    "save or suck": "Save-or-Suck",
    "dexterity save": "Dex Save",
    "dex save": "Dex Save",
    "strength save": "Str Save",
    "str save": "Str Save",
    "constitution save": "Con Save",
    "con save": "Con Save",
    "intelligence save": "Int Save",
    "int save": "Int Save",
    "wisdom save": "Wis Save",
    "wis save": "Wis Save",
    "charisma save": "Cha Save",
    "cha save": "Cha Save",
    "spell attack": "Attack Roll",
    "upcast": "Upcast Scaling",
    "persistent": "Persistent Effect",
    "bonus": "Bonus Action",
    "reaction": "Reaction"
  };
  const key = normalizeLookupText(tag);
  if (aliases[key]) return aliases[key];
  return String(tag || "")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function addTag(tags, tag) {
  if (!tag) return;
  tags.add(titleCaseTag(tag));
}

function detectSaveTags(text, tags) {
  const saveChecks = [
    ["Strength", "Str Save", /\bstrength saving throw\b|\bstr saving throw\b|\bstrength save\b|\bstr save\b/],
    ["Dexterity", "Dex Save", /\bdexterity saving throw\b|\bdex saving throw\b|\bdexterity save\b|\bdex save\b/],
    ["Constitution", "Con Save", /\bconstitution saving throw\b|\bcon saving throw\b|\bconstitution save\b|\bcon save\b/],
    ["Intelligence", "Int Save", /\bintelligence saving throw\b|\bint saving throw\b|\bintelligence save\b|\bint save\b/],
    ["Wisdom", "Wis Save", /\bwisdom saving throw\b|\bwis saving throw\b|\bwisdom save\b|\bwis save\b/],
    ["Charisma", "Cha Save", /\bcharisma saving throw\b|\bcha saving throw\b|\bcharisma save\b|\bcha save\b/]
  ];

  saveChecks.forEach(([, tag, regex]) => {
    if (regex.test(text)) addTag(tags, tag);
  });
}

function detectDamageTypes(text, tags) {
  DAMAGE_TYPES.forEach((type) => {
    const key = type.toLowerCase();
    if (new RegExp(`\\b${key}\\b`).test(text)) {
      addTag(tags, type);
    }
  });
}

function detectShapeTags(text, range, tags) {
  const shapeText = `${text} ${normalizeLooseText(range)}`;
  const isArea = hasAny(shapeText, [
    "radius",
    "cone",
    "cube",
    "sphere",
    "cylinder",
    "line",
    "area",
    "each creature",
    "all creatures",
    "self (",
    "self("
  ]);
  const isMulti = isArea || hasAny(shapeText, [
    "up to",
    "two creatures",
    "three creatures",
    "four creatures",
    "six creatures",
    "multiple",
    "each target",
    "all targets",
    "creatures within"
  ]);
  const isSingle = hasAny(shapeText, [
    "one creature",
    "one target",
    "a creature",
    "a target",
    "one object",
    "a willing creature"
  ]);

  if (isArea) addTag(tags, "Area");
  if (isMulti) addTag(tags, "Multi-Target");
  if (isSingle && !isMulti) addTag(tags, "Single Target");
}

function detectActionTags(castingTime, text, tags) {
  const casting = normalizeLooseText(castingTime);
  if (casting.includes("reaction")) addTag(tags, "Reaction");
  if (casting.includes("bonus action")) addTag(tags, "Bonus Action");
  if (casting.includes("reaction") || casting.includes("bonus action")) addTag(tags, "Action Economy");
  if (hasAny(text, ["extra attack", "additional action", "take an action", "uses its action", "loses its action", "can't take actions", "cant take actions"])) {
    addTag(tags, "Action Economy");
  }
}

function detectBaseTags(spell, text) {
  const tags = new Set();
  const duration = normalizeLooseText(spell.duracion || spell.duration);
  const higher = normalizeLooseText(spell["level alto"]);

  if (parseBool(spell.concentracion) || duration.includes("concentration")) addTag(tags, "Concentration");
  if (parseBool(spell.ritual)) addTag(tags, "Ritual");
  if (duration && !duration.includes("instantaneous") && !duration.includes("instantaneo")) addTag(tags, "Persistent Effect");
  if (higher || hasAny(text, ["at higher levels", "higher level", "using a spell slot of", "for each slot level above"])) addTag(tags, "Upcast Scaling");
  if (hasAny(text, ["spell attack", "melee spell attack", "ranged spell attack", "make an attack roll"])) addTag(tags, "Attack Roll");

  detectSaveTags(text, tags);
  detectDamageTypes(text, tags);
  detectShapeTags(text, spell.Range || spell.range, tags);
  detectActionTags(spell["Casting time"] || spell.castingTime, text, tags);

  return tags;
}

function hasDamage(text) {
  return /\d+d\d+/i.test(text) && hasAny(text, ["damage", "dano", "damages"]);
}

function detectFunctions(text) {
  return {
    antiMagic: hasAny(text, [
      /^counterspell\b/,
      /^dispel magic\b/,
      /^antimagic field\b/,
      /^globe of invulnerability\b/,
      /^remove curse\b/,
      /^nullify\b/,
      /^absorption\b/,
      /\bend one spell\b/,
      /\bends one spell\b/,
      /\bchoose one spell\b.{0,120}\bends\b/,
      /\bmagical effect\b.{0,120}\bends\b/,
      /\bsuppress(?:es|ed)? magic\b/
    ]),
    summon: hasAny(text, [
      /\bsummon(?:s|ed|ing)?\b/,
      /\bconjure (?:animals?|elementals?|minor elementals?|celestials?|fey|woodland beings?|creatures?|spirits?|demons?|devils?)\b/,
      "animate dead",
      "animate objects",
      "create undead",
      "find familiar",
      "find steed",
      "find greater steed",
      "spiritual weapon",
      "unseen servant",
      "tiny servant",
      "creates a creature",
      "animated object"
    ]),
    healing: hasAny(text, [
      "regain hit points",
      "regains hit points",
      "restore hit points",
      "restores hit points",
      "heals",
      "heal ",
      "cure wounds",
      "healing word",
      "revivify",
      "resurrection",
      "raise dead",
      "spare the dying",
      "remove a condition",
      "ends one condition",
      "restoration"
    ]),
    defense: hasAny(text, [
      "armor class",
      "ac ",
      "+5 bonus to ac",
      "temporary hit points",
      "resistance to",
      "immune to",
      "immunity to",
      "ward",
      "shield",
      "protect",
      "protection from",
      "reduce the damage",
      "takes half damage",
      "disadvantage on attack rolls against",
      "mirror image",
      "blur",
      "stoneskin",
      "death ward"
    ]),
    buff: hasAny(text, [
      "bonus to attack rolls",
      "bonus to saving throws",
      "advantage on",
      "add a d4",
      "add 1d4",
      "extra attack",
      "additional action",
      "haste",
      "bless",
      "heroism",
      "enlarge",
      "enhance ability",
      "greater invisibility",
      "aid "
    ]),
    debuff: hasAny(text, [
      "subtract",
      "penalty",
      "disadvantage on",
      "can't regain hit points",
      "cant regain hit points",
      "reduced by",
      "speed is halved",
      "takes a -",
      "bane",
      "hex",
      "curse",
      "slow",
      "poisoned",
      "frightened",
      "blind",
      "deafened"
    ]),
    control: hasAny(text, [
      "restrained",
      "grappled",
      "paralyzed",
      "stunned",
      "incapacitated",
      "unconscious",
      "banished",
      "charmed",
      "frightened",
      "can't move",
      "cant move",
      "can't take actions",
      "cant take actions",
      "difficult terrain",
      "wall of",
      "cage",
      "sphere",
      "silence",
      "darkness",
      "web",
      "hypnotic",
      "sleep",
      "hold person",
      "hold monster",
      "plant growth",
      "spike growth",
      "forcecage",
      "maze"
    ]),
    mobility: hasAny(text, [
      "teleport",
      "fly",
      "flying speed",
      "misty step",
      "dimension door",
      /^jump\b/,
      "speed increases",
      "movement speed",
      "climb speed",
      "swim speed",
      "freedom of movement",
      "longstrider",
      "expeditious retreat",
      "passwall",
      "etherealness"
    ]),
    information: hasAny(text, [
      "detect",
      "identify",
      "locate",
      "scry",
      "clairvoyance",
      "divination",
      "commune",
      "augury",
      "true seeing",
      "see invisibility",
      "comprehend languages",
      "legend lore",
      "find the path",
      "contact other plane",
      "detect thoughts",
      "sense"
    ]),
    social: hasAny(text, [
      "charm",
      "suggestion",
      "friends",
      "disguise",
      "modify memory",
      "calm emotions",
      "zone of truth",
      "command",
      "compelled duel"
    ]),
    utility: hasAny(text, [
      "create food",
      "purify food",
      "mending",
      "prestidigitation",
      "minor illusion",
      "silent image",
      "major image",
      "illusion",
      "alarm",
      "floating disk",
      "rope trick",
      "tiny hut",
      "magnificent mansion",
      "demiplane",
      "sending",
      "message",
      /\blight\b/,
      "mage hand",
      "water breathing",
      "water walk",
      "fabricate",
      "creation"
    ]),
    saveOrSuck: hasAny(text, [
      "banishment",
      "polymorph",
      "hold person",
      "hold monster",
      "dominate",
      "feeblemind",
      "flesh to stone",
      "power word stun",
      "power word kill",
      "plane shift",
      "imprisonment",
      "finger of death"
    ])
  };
}

function chooseCategory(spell, functions, text) {
  const name = normalizeLookupText(spell.Nombre || spell.name);
  const override = KNOWN_OVERRIDES[name];
  if (override?.category) return override.category;

  if (functions.antiMagic) return "Anti-Magic";
  if (functions.summon) return "Summon";
  if (functions.saveOrSuck) return "Save-or-Suck";
  if (functions.healing && !hasDamage(text)) return "Healing";
  if (functions.control && !hasDamage(text)) return "Control";
  if (functions.defense && !hasDamage(text) && !functions.debuff) return "Defense";
  if (functions.buff && !hasDamage(text) && !functions.debuff) return "Buff";
  if (functions.debuff && !hasDamage(text)) return "Debuff";
  if (functions.mobility && !hasDamage(text) && !functions.control) return "Mobility";
  if (functions.information && !hasDamage(text) && !functions.control) return "Information";
  if (hasDamage(text)) return "Damage";
  if (functions.control) return "Control";
  if (functions.healing) return "Healing";
  if (functions.defense) return "Defense";
  if (functions.buff) return "Buff";
  if (functions.debuff) return "Debuff";
  if (functions.mobility) return "Mobility";
  if (functions.information) return "Information";
  return "Utility";
}

function addFunctionTags(tags, category, functions) {
  Object.entries({
    Damage: false,
    Control: functions.control,
    Defense: functions.defense,
    Healing: functions.healing,
    Buff: functions.buff,
    Debuff: functions.debuff,
    Mobility: functions.mobility,
    Summon: functions.summon,
    Utility: functions.utility && ["Utility", "Information", "Mobility"].includes(category),
    "Anti-Magic": functions.antiMagic && category === "Anti-Magic",
    Information: functions.information,
    "Save-or-Suck": functions.saveOrSuck
  }).forEach(([tag, present]) => {
    if (present && tag !== category) addTag(tags, tag);
  });
}

function chooseUseType(category, functions) {
  if (functions.social && ["Buff", "Debuff", "Control", "Information", "Utility", "Save-or-Suck"].includes(category)) {
    return category === "Utility" || category === "Information" ? "Social" : "Mixed";
  }

  if (["Damage", "Control", "Defense", "Healing", "Buff", "Debuff", "Summon", "Anti-Magic", "Save-or-Suck"].includes(category)) {
    if (functions.mobility || functions.information || functions.utility) return "Mixed";
    return "Combat";
  }

  if (category === "Mobility" || category === "Information" || category === "Utility") {
    return functions.control || functions.defense || functions.buff || functions.debuff ? "Mixed" : "Exploration";
  }

  return "Mixed";
}

function scoreImpact(spell, category, tags, functions, text) {
  const level = parseLevel(spell.Nivel || spell.level);
  const name = normalizeLookupText(spell.Nombre || spell.name);
  const override = KNOWN_OVERRIDES[name];
  if (override?.impactScore) return override.impactScore;

  let score;
  if (category === "Damage") score = level === 0 ? 3 : 3 + level;
  else if (["Control", "Save-or-Suck", "Summon"].includes(category)) score = level === 0 ? 3 : 5 + level;
  else if (["Defense", "Buff", "Healing", "Anti-Magic"].includes(category)) score = level === 0 ? 2 : 4 + Math.ceil(level * 0.75);
  else if (["Debuff", "Mobility"].includes(category)) score = level === 0 ? 2 : 3 + Math.ceil(level * 0.75);
  else score = level === 0 ? 1 : 2 + Math.ceil(level * 0.5);

  if (tags.has("Area") || tags.has("Multi-Target")) score += 1;
  if (tags.has("Action Economy")) score += 1;
  if (tags.has("Persistent Effect") && category !== "Utility") score += 1;
  if (tags.has("Upcast Scaling") && level <= 5) score += 1;
  if (tags.has("Concentration") && ["Damage", "Buff", "Debuff", "Defense"].includes(category)) score -= 1;
  if (functions.social && category === "Utility") score += 1;
  if (hasAny(text, ["wish", "meteor swarm", "time stop", "true polymorph", "mass heal"])) score = 10;

  return Math.max(1, Math.min(10, Math.round(score)));
}

function buildScalingNotes(spell, category, tags) {
  const pieces = [];
  const level = parseLevel(spell.Nivel || spell.level);

  if (level === 0 && tags.has("Upcast Scaling")) {
    pieces.push("Escala como cantrip al subir de nivel del personaje.");
  } else if (tags.has("Upcast Scaling")) {
    pieces.push("Mejora con slots superiores, normalmente en dano, objetivos o duracion.");
  } else {
    pieces.push("No tiene escalado fuerte por upcast o depende mas del efecto base.");
  }

  if (tags.has("Concentration")) pieces.push("La concentracion limita mantener otros efectos a la vez.");
  if (tags.has("Area") || tags.has("Multi-Target")) pieces.push("Gana valor cuando afecta varios objetivos.");
  if (tags.has("Action Economy")) pieces.push("Impacta la economia de acciones.");
  if (category === "Summon") pieces.push("Escala mucho si agrega ataques o cuerpos extra.");
  if (category === "Save-or-Suck") pieces.push("Escala por la calidad del objetivo neutralizado.");

  return pieces.join(" ");
}

function buildCrRelevance(category, impactScore, tags) {
  if (["Damage"].includes(category)) {
    return tags.has("Area") || tags.has("Persistent Effect")
      ? "Afecta CR ofensivo por dano repetido o dano a multiples enemigos."
      : "Afecta CR ofensivo por dano directo esperado.";
  }
  if (["Control", "Save-or-Suck"].includes(category)) {
    return "Afecta mucho el CR al negar turnos, movimiento o acciones enemigas.";
  }
  if (category === "Summon") {
    return "Afecta mucho el CR por economia de acciones, cuerpos extra y ataques adicionales.";
  }
  if (["Defense", "Healing"].includes(category)) {
    return "Afecta CR defensivo al aumentar supervivencia efectiva de personaje o party.";
  }
  if (["Buff", "Debuff"].includes(category)) {
    return "Afecta CR por cambiar probabilidades de impacto, saves, dano o rendimiento enemigo.";
  }
  if (category === "Anti-Magic") {
    return "Afecta CR especialmente contra casters al cancelar o remover recursos magicos clave.";
  }
  if (category === "Mobility") {
    return impactScore >= 6
      ? "Afecta CR tactico al permitir reposicionamiento, escape o alcance superior."
      : "Aporta utilidad tactica moderada; su CR depende mucho del mapa.";
  }
  if (category === "Information") {
    return "Tiene baja relevancia de CR directo, pero mejora preparacion y decisiones de aventura.";
  }
  return "Tiene baja relevancia de CR de combate directo, aunque puede resolver escenas de utilidad.";
}

function mergeOverride(classification, override) {
  if (!override) return classification;

  const tags = new Set(classification.tags);
  (override.tags || []).forEach((tag) => addTag(tags, tag));

  return {
    ...classification,
    category: override.category || classification.category,
    tags: [...tags],
    useType: override.useType || classification.useType,
    impactScore: override.impactScore || classification.impactScore,
    crRelevance: override.crRelevance || classification.crRelevance
  };
}

function classifySpell(spell) {
  const name = spell.Nombre || spell.name || "";
  const level = parseLevel(spell.Nivel || spell.level);
  const text = normalizeLooseText(`${name} ${spell.efecto || ""} ${spell["level alto"] || ""}`);
  const functions = detectFunctions(text);
  const tags = detectBaseTags(spell, text);
  const category = chooseCategory(spell, functions, text);

  if (hasDamage(text)) addTag(tags, "Damage");
  addFunctionTags(tags, category, functions);
  if (category === "Summon") addTag(tags, "Action Economy");
  if (category === "Save-or-Suck") {
    addTag(tags, "Control");
    addTag(tags, "Action Economy");
  }
  if (category === "Anti-Magic") addTag(tags, "Anti-Magic");
  if (level > 0 && tags.has("Area")) addTag(tags, "Multi-Target");

  const classificationTags = new Set([...tags]);
  const useType = chooseUseType(category, functions);
  const impactScore = scoreImpact(spell, category, classificationTags, functions, text);

  const classification = mergeOverride({
    category,
    tags: [...classificationTags].sort(),
    useType,
    impactScore,
    scalingNotes: "",
    crRelevance: buildCrRelevance(category, impactScore, classificationTags)
  }, KNOWN_OVERRIDES[normalizeLookupText(name)]);

  classification.tags = [...new Set(classification.tags.map(titleCaseTag))].sort();
  classification.scalingNotes = buildScalingNotes(spell, classification.category, new Set(classification.tags));
  if (!classification.crRelevance) {
    classification.crRelevance = buildCrRelevance(classification.category, classification.impactScore, new Set(classification.tags));
  }

  if (!CATEGORIES.includes(classification.category)) {
    classification.category = "Utility";
  }

  return classification;
}

function averageDamageDice(dice) {
  const match = String(dice || "").match(/(\d+)d(\d+)(?:\s*([+-])\s*(\d+))?/i);
  if (!match) return 0;

  const count = Number(match[1]);
  const sides = Number(match[2]);
  const sign = match[3] === "-" ? -1 : 1;
  const bonus = Number(match[4] || 0) * sign;
  return count * ((sides + 1) / 2) + bonus;
}

function extractDamageDice(spell) {
  const text = `${spell.efecto || ""} ${spell["level alto"] || ""}`;
  const damageMatches = [...text.matchAll(/(\d+d\d+(?:\s*[+-]\s*\d+)?)(?=[^.]{0,80}\bdamage\b)/gi)];
  if (damageMatches.length) return damageMatches[0][1].replace(/\s+/g, "");

  const anyDice = text.match(/\b(\d+d\d+(?:\s*[+-]\s*\d+)?)\b/i);
  return anyDice ? anyDice[1].replace(/\s+/g, "") : null;
}

function extractCharacterLevelScaling(spell) {
  const text = spell.efecto || "";
  const scaling = [];
  const regex = /(\d+)(?:st|nd|rd|th)\s+level[^(]{0,80}\((\d+d\d+(?:\s*[+-]\s*\d+)?)\)/gi;
  let match;

  while ((match = regex.exec(text))) {
    scaling.push({ level: Number(match[1]), dice: match[2].replace(/\s+/g, "") });
  }

  return [...new Map(scaling.map((entry) => [entry.level, entry])).values()].sort((a, b) => a.level - b.level);
}

function getSpellClasses(spell) {
  return Object.entries(CLASS_COLUMNS)
    .filter(([column]) => String(spell[column] || "").trim() === "1")
    .map(([, className]) => className);
}

function categoryToRuntimeType(category) {
  const map = {
    Damage: "damage",
    Control: "control",
    Defense: "defense",
    Healing: "healing",
    Buff: "buff",
    Debuff: "debuff",
    Mobility: "mobility",
    Summon: "summon",
    Utility: "utility",
    "Anti-Magic": "countermagic",
    Information: "information",
    "Save-or-Suck": "save-or-suck"
  };
  return map[category] || "utility";
}

function runtimeTagAliases(tag) {
  const normalized = normalizeLookupText(tag).replace(/\s+/g, "-");
  const aliases = [normalized, normalized.replace(/-/g, " ")];

  if (normalized === "anti-magic") aliases.push("countermagic");
  if (normalized === "save-or-suck") aliases.push("control");
  if (normalized === "attack-roll") aliases.push("attack");
  if (normalized === "area") aliases.push("aoe");
  if (normalized === "bonus-action" || normalized === "reaction") aliases.push("action-economy");
  if (normalized.endsWith("-save")) aliases.push("saving-throw");

  return aliases;
}

function buildRuntimeTags(classification) {
  const tags = new Set();
  tags.add(categoryToRuntimeType(classification.category));
  classification.tags.forEach((tag) => runtimeTagAliases(tag).forEach((alias) => tags.add(alias)));

  if (classification.category === "Damage") tags.add("damage");
  if (classification.category === "Healing") tags.add("healing");
  if (classification.category === "Buff") tags.add("buff");
  if (classification.category === "Debuff") tags.add("debuff");
  if (classification.category === "Control" || classification.category === "Save-or-Suck") tags.add("control");
  if (classification.category === "Anti-Magic") tags.add("countermagic");
  if (classification.category === "Information" || classification.category === "Utility") tags.add("utility");

  return [...tags].sort();
}

function toRuntimeSpell(spell) {
  const classification = classifySpell(spell);
  const damageDice = extractDamageDice(spell);
  const damageAtCharacterLevel = extractCharacterLevelScaling(spell);
  const runtimeTags = buildRuntimeTags(classification);

  return {
    name: spell.Nombre || "",
    key: normalizeLookupText(spell.Nombre),
    level: parseLevel(spell.Nivel),
    school: spell.Escuela || "",
    castingTime: spell["Casting time"] || "",
    range: spell.Range || "",
    duration: spell.duracion || "",
    concentration: parseBool(spell.concentracion),
    ritual: parseBool(spell.ritual),
    category: classification.category,
    type: categoryToRuntimeType(classification.category),
    tags: runtimeTags,
    classificationTags: classification.tags,
    useType: classification.useType,
    impactScore: classification.impactScore,
    scalingNotes: classification.scalingNotes,
    crRelevance: classification.crRelevance,
    damageDice,
    damageAtCharacterLevel,
    averageDamage: damageDice ? averageDamageDice(damageDice) : 0,
    isAoE: runtimeTags.includes("area") || runtimeTags.includes("aoe"),
    classes: getSpellClasses(spell)
  };
}

function enrichSourceSpell(spell) {
  const classification = classifySpell(spell);
  return {
    ...spell,
    category: classification.category,
    tags: classification.tags,
    useType: classification.useType,
    impactScore: classification.impactScore,
    scalingNotes: classification.scalingNotes,
    crRelevance: classification.crRelevance
  };
}

function toClassifiedSpell(spell) {
  const classification = classifySpell(spell);
  return {
    name: spell.Nombre || spell.name || "",
    level: parseLevel(spell.Nivel || spell.level),
    category: classification.category,
    tags: classification.tags,
    useType: classification.useType,
    impactScore: classification.impactScore,
    scalingNotes: classification.scalingNotes,
    crRelevance: classification.crRelevance
  };
}

function writeRuntime(spells) {
  const runtimeSpells = spells.map(toRuntimeSpell);
  const contents = `// Generated from Class/spells.json. Do not edit by hand; edit the JSON source and regenerate.\n` +
    `const SPELL_DATA = ${JSON.stringify(runtimeSpells)};\n\n` +
    `const SPELL_INDEX = Object.fromEntries(SPELL_DATA.map((spell) => [spell.key, spell]));\n` +
    `const SPELL_NAMES = SPELL_DATA.map((spell) => spell.name);\n\n` +
    `function normalizeSpellLookupName(value) {\n` +
    `  return String(value || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/[^a-z0-9]+/gi, ' ').trim().toLowerCase();\n` +
    `}\n\n` +
    `function getSpellInfo(name) {\n` +
    `  return SPELL_INDEX[normalizeSpellLookupName(typeof name === 'string' ? name : name?.name)];\n` +
    `}\n\n` +
    `function getSpellNamesForClass(className) {\n` +
    `  const normalizedClass = String(className || '').toLowerCase();\n` +
    `  return SPELL_DATA.filter((spell) => spell.classes.some((spellClass) => spellClass.toLowerCase() === normalizedClass)).map((spell) => spell.name);\n` +
    `}\n\n` +
    `if (typeof globalThis !== 'undefined') {\n` +
    `  globalThis.SPELL_DATA = SPELL_DATA;\n` +
    `  globalThis.getSpellInfo = getSpellInfo;\n` +
    `  globalThis.getSpellNamesForClass = getSpellNamesForClass;\n` +
    `}\n`;

  fs.writeFileSync(runtimePath, contents, "utf8");
  return runtimeSpells;
}

function main() {
  const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  const enriched = source.map(enrichSourceSpell);
  fs.writeFileSync(sourcePath, `${JSON.stringify(enriched, null, 2)}\n`, "utf8");
  fs.writeFileSync(classifiedPath, `${JSON.stringify(enriched.map(toClassifiedSpell), null, 2)}\n`, "utf8");
  const runtimeSpells = writeRuntime(enriched);

  const categoryCounts = runtimeSpells.reduce((counts, spell) => {
    counts[spell.category] = (counts[spell.category] || 0) + 1;
    return counts;
  }, {});

  console.log(`Classified ${runtimeSpells.length} spells.`);
  console.log(JSON.stringify(categoryCounts, null, 2));
}

main();
