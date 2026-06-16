(function () {
/*
  Custom D&D-style CR calculator for player characters and draft parties.
  It is inspired by the idea of Defensive CR and Offensive CR, but uses
  original, configurable ranges rather than copying official DMG tables.
*/

const CR_VALUES = [
  0, 0.125, 0.25, 0.5,
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30
];

const HP_TO_CR = [
  [1, 6, 0],
  [7, 35, 0.125],
  [36, 49, 0.25],
  [50, 70, 0.5],
  [71, 85, 1],
  [86, 100, 2],
  [101, 115, 3],
  [116, 130, 4],
  [131, 145, 5],
  [146, 160, 6],
  [161, 175, 7],
  [176, 190, 8],
  [191, 205, 9],
  [206, 220, 10],
  [221, 240, 11],
  [241, 260, 12],
  [261, 280, 13],
  [281, 300, 14],
  [301, 320, 15],
  [321, 340, 16],
  [341, 360, 17],
  [361, 380, 18],
  [381, 400, 19],
  [401, Infinity, 20]
];

const DPR_TO_CR = [
  [0, 1, 0],
  [2, 3, 0.125],
  [4, 5, 0.25],
  [6, 8, 0.5],
  [9, 14, 1],
  [15, 20, 2],
  [21, 26, 3],
  [27, 32, 4],
  [33, 38, 5],
  [39, 44, 6],
  [45, 50, 7],
  [51, 56, 8],
  [57, 62, 9],
  [63, 68, 10],
  [69, 74, 11],
  [75, 80, 12],
  [81, 86, 13],
  [87, 92, 14],
  [93, 98, 15],
  [99, 104, 16],
  [105, 110, 17],
  [111, 116, 18],
  [117, 122, 19],
  [123, Infinity, 20]
];

const DEFENSIVE_FEATURES = [
  ["shield", 0.5, "Shield spell adds +0.5 Defensive CR."],
  ["second wind", 0.25, "Second Wind adds +0.25 Defensive CR."],
  ["rage", 1, "Rage adds +1 Defensive CR."],
  ["uncanny dodge", 0.75, "Uncanny Dodge adds +0.75 Defensive CR."],
  ["evasion", 0.75, "Evasion adds +0.75 Defensive CR."],
  ["lay on hands", 0.5, "Lay on Hands adds +0.5 Defensive CR."],
  ["guardian tactics", 0.35, "Guardian-style protection adds +0.35 Defensive CR."],
  ["survive", 0.5, "Survival features add +0.5 Defensive CR."],
  ["martyrdom", 0.5, "Martyrdom adds +0.5 Defensive CR."],
  ["field repairs", 0.25, "Field repairs add +0.25 Defensive CR."],
  ["reinforced armor", 0.35, "Reinforced armor adds +0.35 Defensive CR."],
  ["damaged armor", -0.35, "Damaged armor costs -0.35 Defensive CR."]
];

const OFFENSIVE_FEATURES = [
  ["action surge", 0.75, "Action Surge adds +0.75 Offensive CR."],
  ["divine smite", 0.5, "Divine Smite adds +0.5 Offensive CR."],
  ["improved critical", 0.25, "Improved Critical adds +0.25 Offensive CR."],
  ["metamagic", 0.5, "Offensive Metamagic adds +0.5 Offensive CR."],
  ["bombs", 0.5, "Bombs add +0.5 Offensive CR."],
  ["firearms", 0.5, "Firearms add +0.5 Offensive CR."],
  ["crimson rite", 0.5, "Crimson Rite adds +0.5 Offensive CR."],
  ["blood maledict", 0.25, "Blood Maledict adds +0.25 Offensive CR."],
  ["spellstrike", 0.75, "Spellstrike adds +0.75 Offensive CR."],
  ["arcane surge", 0.5, "Arcane Surge adds +0.5 Offensive CR."],
  ["psionics", 0.5, "Psionics add +0.5 Offensive CR."],
  ["hexes", 0.4, "Hexes add +0.4 Offensive CR."],
  ["pact magic", 0.35, "Pact Magic adds +0.35 Offensive CR."],
  ["commands", 0.25, "Battlefield commands add +0.25 Offensive CR."],
  ["runic weapon", 0.5, "Runic weapon adds +0.5 Offensive CR."],
  ["masterwork weapon", 0.35, "Masterwork weapon adds +0.35 Offensive CR."],
  ["arcane focus", 0.35, "Arcane focus adds +0.35 Offensive CR."],
  ["broken weapon", -0.5, "Broken weapon costs -0.5 Offensive CR."]
];

const DAMAGE_SPELL_ESTIMATES = {
  "magic missile": 10.5,
  "scorching ray": 21,
  "fireball": 28,
  "lightning bolt": 28,
  "flame strike": 28,
  "blight": 36,
  "moonbeam": 18,
  "guiding bolt": 14,
  "eldritch blast": 10.5,
  "vampiric touch": 10.5,
  "thunderwave": 9,
  "chill touch": 9,
  "booming blade": 13,
  "heat metal": 9
};

const PHYSICAL_DAMAGE_TYPES = ["bludgeoning", "piercing", "slashing"];
const ELEMENTAL_DAMAGE_TYPES = ["fire", "cold", "poison", "thunder", "acid", "lightning"];
const SPECIAL_MAGIC_DAMAGE_TYPES = ["radiant", "necrotic", "force", "psychic"];
const TRACKED_DAMAGE_TYPES = [
  ...PHYSICAL_DAMAGE_TYPES,
  ...ELEMENTAL_DAMAGE_TYPES,
  ...SPECIAL_MAGIC_DAMAGE_TYPES
];

const DAMAGE_TYPE_HINTS = {
  bludgeoning: ["club", "mace", "hammer", "maul", "staff", "stone", "earth", "earthen", "earthquake", "boulder", "crush"],
  piercing: ["arrow", "bolt", "shot", "rapier", "spear", "dagger", "thorn", "spike", "impale", "lance"],
  slashing: ["sword", "axe", "blade", "claw", "slash", "scythe", "cut"],
  fire: ["fire", "flame", "flaming", "burn", "burning", "scorch", "scorching", "heat", "incendiary", "meteor", "wildfire", "phoenix"],
  cold: ["cold", "frost", "ice", "frigid", "winter", "blizzard", "polar", "chill"],
  poison: ["poison", "venom", "toxic", "infestation", "plague"],
  thunder: ["thunder", "booming", "sonic", "concussive", "shatter", "storm", "warcry"],
  acid: ["acid", "caustic", "corrosive"],
  lightning: ["lightning", "storm", "spark", "thunderbolt"],
  radiant: ["radiant", "holy", "divine", "guiding", "spirit guardians", "sun", "sunbeam", "sunburst", "faith", "light", "starfire", "ra", "arrow of light", "lance of faith"],
  necrotic: ["necrotic", "necro", "blight", "vampiric", "chill touch", "shadow", "soul", "enervation", "death", "darkness", "wither"],
  force: ["force", "magic missile", "eldritch blast", "eldritch orb", "hardlight", "arcane", "dart", "paradox", "gravity", "distort"],
  psychic: ["psychic", "mind", "dissonant", "synaptic", "feeble", "weird", "maddening", "vicious", "mental", "psionic", "mockery"]
};

const UTILITY_HINTS = {
  healingStrong: ["mass healing word", "revivify", "greater restoration", "aura of vitality"],
  healingModerate: ["healing word", "cure wounds", "lesser restoration", "spare the dying"],
  buffsStrong: ["haste", "bless", "bardic inspiration", "heroism", "shield of faith", "mantle of inspiration"],
  debuffsStrong: ["slow", "bane", "hold person", "fear", "hypnotic pattern", "dissonant whispers"],
  areaControl: ["web", "wall of force", "spike growth", "plant growth", "silence"],
  mobility: ["misty step", "fly", "pass without trace"],
  escape: ["invisibility", "mirror image"],
  counterMagic: ["counterspell", "dispel magic"],
  rituals: ["identify", "teleportation circle", "ritual casting"]
};

const CORE_PARTY_ROLES = [
  "FRONTLINE",
  "SUPPORT",
  "SPELLCASTER",
  "DPS_PHYSICAL",
  "DPS_MAGICAL",
  "TACTICIAN"
];

function getClassMetadata(character) {
  const registry = getClassRegistry();
  const className = String(character.className || "").trim();

  if (!registry || !className) {
    return null;
  }

  if (registry[className]) {
    return registry[className];
  }

  const normalizedName = className.toLowerCase();
  const foundKey = Object.keys(registry).find((key) => key.toLowerCase() === normalizedName);
  return foundKey ? registry[foundKey] : null;
}

function getClassRegistry() {
  if (typeof globalThis !== "undefined" && globalThis.DND_CLASS_DATA) {
    return globalThis.DND_CLASS_DATA;
  }
  return null;
}

function getCharacterRolePriority(character) {
  const metadata = getClassMetadata(character);
  return uniqueRoles([
    ...(character.rolePriority || []),
    ...getSubclassRolePriority(character),
    ...(character.roles || []),
    ...(metadata?.roles || [])
  ]);
}

function getSubclassRolePriority(character) {
  const classification = getSubclassClassification(character);
  return uniqueRoles(classification?.rolePriority || []);
}

function getSubclassClassification(character) {
  const registry = typeof globalThis !== "undefined" ? globalThis.DND_SUBCLASS_CLASSIFICATION_DATA : null;
  const className = String(character.className || "").trim();
  const subclassKey = normalizeLookupText(character.subclass);

  if (!registry || !className || !subclassKey) {
    return null;
  }

  const classData = registry[className] || registry[Object.keys(registry)
    .find((key) => normalizeLookupText(key) === normalizeLookupText(className))];

  if (!classData) {
    return null;
  }

  const matchedKey = Object.keys(classData)
    .map((key) => ({ key, normalized: normalizeLookupText(key) }))
    .filter((entry) => subclassKey.includes(entry.normalized) || entry.normalized.includes(subclassKey))
    .sort((left, right) => right.normalized.length - left.normalized.length)[0]?.key;

  return matchedKey ? classData[matchedKey] : null;
}

function uniqueRoles(roles) {
  return [...new Set(normalizeRoles(roles).filter(Boolean))];
}

function normalizeLookupText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

function getSpellMetadata(spell) {
  const spellName = typeof spell === "string" ? spell : spell?.name;
  if (!spellName) {
    return null;
  }
  if (typeof globalThis !== "undefined" && typeof globalThis.getSpellInfo === "function") {
    return globalThis.getSpellInfo(spellName) || null;
  }
  return null;
}

function spellHasTag(spell, tag) {
  if (!Array.isArray(spell.tags)) {
    return false;
  }

  const expected = normalizeTagText(tag);
  return spell.tags.some((spellTag) => normalizeTagText(spellTag) === expected);
}

function normalizeTagText(value) {
  return normalizeLookupText(value).replace(/\s+/g, " ");
}

function calculateCharacterCR(character) {
  const normalized = normalizeCharacter(character);
  const defensive = calculateDefensiveCR(normalized);
  const offensive = calculateOffensiveCR(normalized);
  const utility = calculateUtilityModifier(normalized);
  const role = calculateRoleModifier(normalized);
  const damageProfile = buildCharacterDamageProfile(normalized);
  const finalCR = clamp(((defensive.value + offensive.value) / 2) + utility.value + role.value, 0, 30);
  const roundedCRValue = roundToAllowedCR(finalCR);
  const powerScore = Math.round(roundedCRValue * 10 + normalized.level * 2);

  return {
    characterName: normalized.name,
    armorClass: normalized.armorClass,
    armorClassSource: normalized.armorClassSource,
    armorClassFormula: normalized.armorClassFormula,
    hitPoints: normalized.hitPoints,
    hitDie: normalized.hitDie,
    hitPointSource: normalized.hitPointSource,
    hitPointFormula: normalized.hitPointFormula,
    defensiveCR: roundNumber(defensive.value),
    hpDefensiveCR: roundNumber(defensive.hpDefensiveCR),
    armorClassAdjustment: roundNumber(defensive.acAdjustment),
    offensiveCR: roundNumber(offensive.value),
    utilityModifier: roundNumber(utility.value),
    roleModifier: roundNumber(role.value),
    finalCR: roundNumber(finalCR),
    roundedCR: formatCR(roundedCRValue),
    roundedCRValue,
    powerScore,
    damageProfile,
    breakdown: {
      defensive: defensive.breakdown,
      offensive: offensive.breakdown,
      utility: utility.breakdown,
      role: role.breakdown,
      final: [
        "Final CR is the average of Defensive and Offensive CR plus utility and role modifiers.",
        `Power Score is rounded CR x 10 plus level x 2: ${powerScore}.`
      ]
    },
    character: normalized.original
  };
}

function calculatePartyCR(party) {
  const members = getPartyMembers(party);
  const memberResults = members.map(calculateCharacterCR);
  const damageProfile = buildPartyDamageProfile(memberResults);
  const totalPowerScore = memberResults.reduce((sum, result) => sum + result.powerScore, 0);
  const averageCR = memberResults.length
    ? memberResults.reduce((sum, result) => sum + result.roundedCRValue, 0) / memberResults.length
    : 0;
  const roles = collectPartyRoles(members, memberResults);
  const coveredRoles = [...roles.covered].sort();
  const missingRoles = CORE_PARTY_ROLES.filter((role) => !roles.covered.has(role));
  const affinity = calculateAffinityModifier(members);
  const explanation = [];
  let synergyBonus = 0;
  let penalties = 0;

  if (roles.covered.has("TANK") || roles.covered.has("FRONTLINE")) {
    synergyBonus += 20;
    explanation.push("Tank or Frontline coverage adds +20.");
  }
  if (roles.covered.has("HEALER") || roles.covered.has("SUPPORT")) {
    synergyBonus += 20;
    explanation.push("Healer or Support coverage adds +20.");
  }
  if (roles.covered.has("SPELLCASTER") || roles.covered.has("ARCANE_CASTER")) {
    synergyBonus += 20;
    explanation.push("Spellcaster coverage adds +20.");
  }
  if (memberResults.some((result) => result.offensiveCR >= Math.max(2, averageCR))) {
    synergyBonus += 20;
    explanation.push("A strong DPS profile adds +20.");
  }
  if (roles.covered.has("DEBUFFER") || roles.covered.has("TACTICIAN")) {
    synergyBonus += 15;
    explanation.push("Debuffer or Tactician coverage adds +15.");
  }
  if (roles.hasPhysicalDamage && roles.hasMagicalDamage) {
    synergyBonus += 20;
    explanation.push("A good mix of physical and magical damage adds +20.");
  }
  if (roles.damageTypeCount >= 3) {
    synergyBonus += 10;
    explanation.push("Three or more damage types covered add +10.");
  }
  if (roles.hasElementalDamage && roles.hasSpecialMagicDamage) {
    synergyBonus += 10;
    explanation.push("Elemental plus radiant/necrotic/force/psychic coverage adds +10.");
  }

  if (!roles.covered.has("FRONTLINE") && !roles.covered.has("TANK")) {
    penalties -= 35;
    explanation.push("No Frontline costs -35.");
  }
  if (!roles.covered.has("SUPPORT") && !roles.covered.has("HEALER")) {
    penalties -= 25;
    explanation.push("No Support or Healer costs -25.");
  }
  if (!roles.hasMagicalDamage) {
    penalties -= 20;
    explanation.push("No magical damage costs -20.");
  }
  if (!roles.hasPhysicalDamage) {
    penalties -= 20;
    explanation.push("No physical damage costs -20.");
  }
  if (roles.primaryRoleCount <= 1 && members.length > 1) {
    penalties -= 30;
    explanation.push("All characters fill the same primary role, costing -30.");
  }
  if (average(members.map((member) => normalizeCharacter(member).stats.CON)) < 12) {
    penalties -= 20;
    explanation.push("Average CON below 12 costs -20.");
  }

  const bestResult = [...memberResults].sort((a, b) => b.powerScore - a.powerScore)[0] || null;
  const weakestResult = [...memberResults].sort((a, b) => a.powerScore - b.powerScore)[0] || null;
  const finalPartyScore = Math.round(totalPowerScore + synergyBonus + affinity.affinityBonus + penalties);

  return {
    members: memberResults,
    averageCR: roundNumber(averageCR),
    totalPowerScore,
    synergyBonus,
    affinityBonus: affinity.affinityBonus,
    affinityDetails: affinity.details,
    penalties,
    finalPartyScore,
    coveredRoles,
    missingRoles,
    damageProfile,
    bestCharacter: bestResult,
    weakestCharacter: weakestResult,
    explanation: [...explanation, ...affinity.explanation]
  };
}

function calculateDefensiveCR(character) {
  const breakdown = [];
  const hpDefensiveCR = lookupCR(character.hitPoints, HP_TO_CR);
  let defensiveCR = hpDefensiveCR;
  if (character.hitPointFormula) {
    breakdown.push(character.hitPointFormula);
  }
  breakdown.push(`${character.hitPoints} HP gives a base Defensive CR of ${formatCR(hpDefensiveCR)}.`);

  const acAdjustment = getArmorClassAdjustment(character.armorClass);
  defensiveCR += acAdjustment;
  if (character.armorClassFormula) {
    breakdown.push(character.armorClassFormula);
  }
  breakdown.push(`AC ${character.armorClass} adjusts Defensive CR by ${formatSigned(acAdjustment)}.`);

  const conMod = abilityModifier(character.stats.CON);
  if (conMod >= 3) {
    defensiveCR += 0.25;
    breakdown.push(`CON modifier ${formatSigned(conMod)} adds +0.25 Defensive CR.`);
  } else if (conMod < 0) {
    defensiveCR -= 0.25;
    breakdown.push(`Low CON modifier ${formatSigned(conMod)} costs -0.25 Defensive CR.`);
  }

  for (const [hint, value, text] of DEFENSIVE_FEATURES) {
    if (hasFeatureOrSpell(character, hint)) {
      defensiveCR += value;
      breakdown.push(text);
    }
  }

  if ((character.resistances || []).length >= 3) {
    defensiveCR += 1;
    breakdown.push("Multiple resistances add +1 Defensive CR.");
  }
  if ((character.immunities || []).length > 0) {
    defensiveCR += 2;
    breakdown.push("Important immunities add +2 Defensive CR.");
  }

  return {
    value: clamp(defensiveCR, 0, 30),
    hpDefensiveCR,
    acAdjustment,
    breakdown
  };
}

function calculateOffensiveCR(character) {
  const breakdown = [];
  let averageDamagePerRound = 0;
  let bestAttackBonus = 0;
  const damageProfile = buildCharacterDamageProfile(character);

  for (const attack of character.attacks) {
    const attackDamage = averageDamageDice(attack.damageDice) * (attack.attacksPerRound || 1);
    averageDamagePerRound += attackDamage;
    bestAttackBonus = Math.max(bestAttackBonus, Number(attack.attackBonus || 0));
    breakdown.push(`${attack.name} contributes ${roundNumber(attackDamage)} DPR (${formatDamageTypes(attack.damageTypes || [attack.damageType])}).`);
  }

  for (const spell of character.spells) {
    if (spell.type === "damage" || spellHasTag(spell, "damage")) {
      const spellDamage = Math.max(
        Number(spell.averageDamage || estimateSpellDamage(spell.name)),
        estimateDamageSpellImpactFloor(spell)
      );
      const adjustedDamage = spell.isAoE ? spellDamage * 1.5 : spellDamage;
      averageDamagePerRound += adjustedDamage;
      breakdown.push(`${spell.name} contributes ${roundNumber(adjustedDamage)} DPR${spell.isAoE ? " after AoE adjustment" : ""} (${formatDamageTypes(spell.damageTypes)}).`);
    } else if (spell.type === "summon" || spellHasTag(spell, "summon")) {
      const summonDamage = estimateSummonSpellDamage(spell);
      averageDamagePerRound += summonDamage;
      breakdown.push(`${spell.name} contributes ${roundNumber(summonDamage)} DPR through summoned actions.`);
    }
  }

  if (hasFeature(character, "sneak attack")) {
    const sneakDamage = Math.ceil(character.level / 2) * 3.5;
    averageDamagePerRound += sneakDamage;
    breakdown.push(`Sneak Attack contributes ${roundNumber(sneakDamage)} DPR.`);
  }
  if (hasFeature(character, "rage damage")) {
    averageDamagePerRound += 2;
    breakdown.push("Rage Damage contributes +2 DPR.");
  }

  let offensiveCR = lookupCR(averageDamagePerRound, DPR_TO_CR);
  breakdown.push(`Average damage per round is ${roundNumber(averageDamagePerRound)}.`);
  breakdown.push(`${roundNumber(averageDamagePerRound)} DPR gives a base Offensive CR of ${formatCR(offensiveCR)}.`);

  const attackAdjustment = getAttackBonusAdjustment(bestAttackBonus || estimateAttackBonus(character));
  offensiveCR += attackAdjustment;
  breakdown.push(`Attack bonus ${formatSigned(bestAttackBonus || estimateAttackBonus(character))} adjusts Offensive CR by ${formatSigned(attackAdjustment)}.`);

  if (character.savingThrowDC) {
    const dcAdjustment = getDcAdjustment(character.savingThrowDC);
    offensiveCR += dcAdjustment;
    breakdown.push(`Save DC ${character.savingThrowDC} adjusts Offensive CR by ${formatSigned(dcAdjustment)}.`);
  }

  for (const [hint, value, text] of OFFENSIVE_FEATURES) {
    if (hasFeature(character, hint)) {
      offensiveCR += value;
      breakdown.push(text);
    }
  }

  const damageProfileModifier = calculateDamageProfileModifier(damageProfile);
  if (damageProfileModifier.value !== 0) {
    offensiveCR += damageProfileModifier.value;
    breakdown.push(...damageProfileModifier.breakdown);
  }

  return {
    value: clamp(offensiveCR, 0, 30),
    averageDamagePerRound: roundNumber(averageDamagePerRound),
    damageProfile,
    breakdown
  };
}

function calculateUtilityModifier(character) {
  const breakdown = [];
  let modifier = 0;
  const spellNames = character.spells.map((spell) => spell.name.toLowerCase());
  const featureText = character.features.join(" ").toLowerCase();
  const hasTaggedSpell = (tag) => character.spells.some((spell) => spellHasTag(spell, tag) || spell.type === tag);

  if (hasAnyHint(spellNames, UTILITY_HINTS.healingStrong) || character.spells.some((spell) => spellHasTag(spell, "healing") && Number(spell.level || 0) >= 3)) {
    modifier += 0.75;
    breakdown.push("Strong healing adds +0.75 Utility CR.");
  } else if (hasAnyHint(spellNames, UTILITY_HINTS.healingModerate) || hasTaggedSpell("healing")) {
    modifier += 0.5;
    breakdown.push("Moderate healing adds +0.5 Utility CR.");
  }
  if (hasAnyHint(spellNames, UTILITY_HINTS.buffsStrong) || hasTaggedSpell("buff") || featureText.includes("bardic inspiration")) {
    modifier += 0.75;
    breakdown.push("Strong buffs add +0.75 Utility CR.");
  }
  if (hasAnyHint(spellNames, UTILITY_HINTS.debuffsStrong) || hasTaggedSpell("debuff")) {
    modifier += 0.75;
    breakdown.push("Strong debuffs add +0.75 Utility CR.");
  }
  if (hasAnyHint(spellNames, UTILITY_HINTS.areaControl) || hasTaggedSpell("control")) {
    modifier += 1;
    breakdown.push("Strong area control adds +1 Utility CR.");
  }
  if (hasAnyHint(spellNames, UTILITY_HINTS.mobility)) {
    modifier += 0.25;
    breakdown.push("Superior mobility adds +0.25 Utility CR.");
  }
  if (hasAnyHint(spellNames, UTILITY_HINTS.escape)) {
    modifier += 0.5;
    breakdown.push("Invisibility or strong escape adds +0.5 Utility CR.");
  }
  if (hasAnyHint(spellNames, UTILITY_HINTS.counterMagic) || hasTaggedSpell("countermagic")) {
    modifier += 0.5;
    breakdown.push("Counterspell or Dispel Magic adds +0.5 Utility CR.");
  }
  if (hasAnyHint(spellNames, UTILITY_HINTS.rituals) || hasTaggedSpell("ritual") || character.spells.some((spell) => spell.ritual) || featureText.includes("ritual")) {
    modifier += 0.25;
    breakdown.push("Ritual or out-of-combat utility adds +0.25 Utility CR.");
  }

  const classifiedSpellModifier = calculateClassifiedSpellModifier(character);
  if (classifiedSpellModifier.value !== 0) {
    modifier += classifiedSpellModifier.value;
    breakdown.push(...classifiedSpellModifier.breakdown);
  }

  if (!breakdown.length) {
    breakdown.push("No major non-combat utility modifiers were found.");
  }

  return {
    value: roundNumber(modifier),
    breakdown
  };
}

function calculateClassifiedSpellModifier(character) {
  const categoryWeights = {
    "Control": 0.14,
    "Save-or-Suck": 0.15,
    "Summon": 0.16,
    "Buff": 0.1,
    "Debuff": 0.1,
    "Defense": 0.09,
    "Healing": 0.08,
    "Anti-Magic": 0.1,
    "Mobility": 0.05,
    "Information": 0.03,
    "Utility": 0.03
  };
  const categoryCaps = {
    "Control": 1.1,
    "Save-or-Suck": 1.2,
    "Summon": 1.25,
    "Buff": 0.85,
    "Debuff": 0.85,
    "Defense": 0.75,
    "Healing": 0.7,
    "Anti-Magic": 0.8,
    "Mobility": 0.45,
    "Information": 0.3,
    "Utility": 0.25
  };

  const seen = new Set();
  const spellImpacts = character.spells
    .map((spell) => {
      const key = normalizeLookupText(spell.name);
      if (!key || seen.has(key)) {
        return null;
      }
      seen.add(key);

      const category = spell.category || typeToCategory(spell.type);
      const impactScore = Number(spell.impactScore || 0);
      if (!category || category === "Damage" || impactScore <= 0) {
        return null;
      }

      const weight = categoryWeights[category] || 0.03;
      const cap = categoryCaps[category] || 0.25;
      const useMultiplier = spell.useType === "Exploration" || spell.useType === "Social" ? 0.65 : 1;
      const concentrationMultiplier = spell.concentration && ["Buff", "Debuff", "Defense"].includes(category) ? 0.9 : 1;
      const value = Math.min(cap, impactScore * weight) * useMultiplier * concentrationMultiplier;

      return {
        name: spell.name,
        category,
        impactScore,
        value
      };
    })
    .filter(Boolean)
    .sort((left, right) => right.value - left.value)
    .slice(0, 4);

  const value = roundNumber(clamp(spellImpacts.reduce((sum, spell) => sum + spell.value, 0), 0, 2));

  if (value === 0) {
    return { value: 0, breakdown: [] };
  }

  const labels = spellImpacts
    .map((spell) => `${spell.name} (${spell.category} ${spell.impactScore}/10)`)
    .join(", ");

  return {
    value,
    breakdown: [`Classified spell impact adds +${value} Utility CR from ${labels}.`]
  };
}

function calculateRoleModifier(character) {
  const breakdown = [];
  let modifier = 0;
  const roles = inferRoles(character);
  const supportedRoles = roles.filter((role) => roleIsStatSupported(character, role));

  if (supportedRoles.length >= 3) {
    modifier += 0.75;
    breakdown.push("Several useful roles are supported without losing efficiency: +0.75 Role CR.");
  } else if (supportedRoles.length >= 1) {
    modifier += 0.5;
    breakdown.push(`Clear supported role (${supportedRoles[0]}) adds +0.5 Role CR.`);
  }

  if (roles.length > 0 && supportedRoles.length === 0) {
    modifier -= 0.5;
    breakdown.push("Declared roles are not well supported by stats or features: -0.5 Role CR.");
  }

  if (isResourceDependent(character)) {
    modifier -= 0.25;
    breakdown.push("The build is resource dependent: -0.25 Role CR.");
  }

  if (!breakdown.length) {
    breakdown.push("No strong role modifier was applied.");
  }

  return {
    value: roundNumber(modifier),
    breakdown
  };
}

function normalizeCharacter(character) {
  const stats = {
    STR: 10,
    DEX: 10,
    CON: 10,
    INT: 10,
    WIS: 10,
    CHA: 10,
    ...(character.stats || {})
  };
  const hitPointInfo = getHitPointInfo(character, stats);
  const armorClassInfo = getArmorClassInfo(character, stats);
  const normalized = {
    ...character,
    original: character,
    name: character.name || "Unnamed Character",
    level: Number(character.level || 1),
    stats,
    proficiencyBonus: Number(character.proficiencyBonus || estimateProficiency(character.level || 1)),
    armorClass: armorClassInfo.armorClass,
    armorClassSource: armorClassInfo.source,
    armorClassFormula: armorClassInfo.formula,
    hitPoints: hitPointInfo.hitPoints,
    hitDie: hitPointInfo.hitDie,
    hitPointSource: hitPointInfo.source,
    hitPointFormula: hitPointInfo.formula,
    attacks: normalizeAttacks(character, stats),
    spells: normalizeSpells(character.spells || [], character.level || 1, character),
    savingThrowDC: character.savingThrowDC || estimateSaveDc(character, stats),
    roles: getCharacterRolePriority(character),
    features: normalizeFeatures(character.features || [], character)
  };
  return normalized;
}

function getOptionalPositiveNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function normalizeAttacks(character, stats) {
  if (Array.isArray(character.attacks) && character.attacks.length) {
    return character.attacks.map((attack) => normalizeAttackDamage(attack, character));
  }

  const level = Number(character.level || 1);
  const classGroup = getClassGroup(character);
  const metadata = getClassMetadata(character);
  const attackStyle = metadata?.attackStyle || "";
  const isMagicAttack = ["magic", "explosive"].includes(attackStyle);
  const damageType = getDefaultAttackDamageType(attackStyle, classGroup);
  const attackStatName = isMagicAttack ? metadata?.primaryStat || getBestMentalStatName(stats) : getBestWeaponStatName(stats);
  const attackBonus = estimateProficiency(level) + abilityModifier(stats[attackStatName] || 10);
  const hasExtraAttack = Boolean(metadata?.extraAttackAt && level >= metadata.extraAttackAt) ||
    (["martial", "tank", "skirmisher", "ranged"].includes(classGroup) && level >= 5);
  const attacksPerRound = hasExtraAttack ? 2 : 1;
  const damageDiceByStyle = {
    explosive: level >= 11 ? "3d10" : level >= 5 ? "2d10" : "1d10",
    firearm: "1d10+3",
    ranged: "1d8+3",
    magic: level >= 11 ? "3d10" : level >= 5 ? "2d10" : "1d10",
    support: "1d8+2",
    hybrid: "1d10+3",
    melee: "1d8+4"
  };
  const damageDice = damageDiceByStyle[attackStyle] ||
    (["skirmisher", "ranged"].includes(classGroup) ? "1d8+3" : "1d8+4");
  const attackNamesByStyle = {
    explosive: `${character.className || "Alchemical"} Bomb`,
    firearm: `${character.className || "Firearm"} Shot`,
    ranged: `${character.className || "Ranged"} Shot`,
    magic: `${character.className || "Spell"} Cantrip`,
    support: `${character.className || "Support"} Strike`,
    hybrid: `${character.className || "Hybrid"} Strike`,
    melee: `${character.className || "Weapon"} Attack`
  };

  return [{
    name: attackNamesByStyle[attackStyle] || `${character.className || "Weapon"} Attack`,
    attackBonus,
    damageDice,
    attacksPerRound,
    damageType,
    damageTypes: [damageType],
    damageCategory: getDamageCategory(damageType)
  }];
}

function normalizeSpells(spells, casterLevel = 1, character = {}) {
  return spells.map((spell) => {
    const spellName = typeof spell === "string" ? spell : spell.name || "";
    const metadata = getSpellMetadata(spellName);
    const metadataTags = metadata?.tags || [];
    const fallbackType = inferSpellType(spellName.toLowerCase());
    const damageTypes = inferSpellDamageTypes(spellName, metadata, spell);
    const spellClasses = metadata?.classes || spell.classes || [];

    if (typeof spell === "string") {
      return {
        name: spellName,
        type: metadata?.type || fallbackType,
        category: metadata?.category || typeToCategory(metadata?.type || fallbackType),
        level: metadata?.level ?? inferSpellLevel(spellName.toLowerCase()),
        school: metadata?.school || "",
        concentration: Boolean(metadata?.concentration),
        ritual: Boolean(metadata?.ritual),
        classes: spellClasses,
        usableBy: spellClasses,
        tags: metadataTags,
        classificationTags: metadata?.classificationTags || [],
        useType: metadata?.useType || "",
        impactScore: Number(metadata?.impactScore || 0),
        scalingNotes: metadata?.scalingNotes || "",
        crRelevance: metadata?.crRelevance || "",
        damageType: damageTypes[0] || "",
        damageTypes,
        damageCategory: getDamageCategory(damageTypes[0]),
        averageDamage: estimateSpellDamage(spellName, metadata, casterLevel),
        isAoE: Boolean(metadata?.isAoE || isAoeSpell(spellName.toLowerCase()))
      };
    }

    const explicitTags = Array.isArray(spell.tags) ? spell.tags : [];
    const tags = [...new Set([...metadataTags, ...explicitTags, spell.type].filter(Boolean))];

    return {
      ...spell,
      name: spellName,
      type: spell.type || metadata?.type || fallbackType,
      category: spell.category || metadata?.category || typeToCategory(spell.type || metadata?.type || fallbackType),
      level: spell.level ?? metadata?.level ?? inferSpellLevel(spellName.toLowerCase()),
      school: spell.school || metadata?.school || "",
      concentration: spell.concentration ?? Boolean(metadata?.concentration),
      ritual: spell.ritual ?? Boolean(metadata?.ritual),
      classes: spell.classes || metadata?.classes || [],
      usableBy: spell.classes || metadata?.classes || [character.className].filter(Boolean),
      tags,
      classificationTags: spell.classificationTags || metadata?.classificationTags || [],
      useType: spell.useType || metadata?.useType || "",
      impactScore: Number(spell.impactScore ?? metadata?.impactScore ?? 0),
      scalingNotes: spell.scalingNotes || metadata?.scalingNotes || "",
      crRelevance: spell.crRelevance || metadata?.crRelevance || "",
      damageType: damageTypes[0] || "",
      damageTypes,
      damageCategory: getDamageCategory(damageTypes[0]),
      averageDamage: spell.averageDamage ?? estimateSpellDamage(spellName, metadata, casterLevel),
      isAoE: Boolean(spell.isAoE || metadata?.isAoE || isAoeSpell(spellName.toLowerCase()))
    };
  });
}

function typeToCategory(type) {
  const normalized = normalizeTagText(type);
  const map = {
    "damage": "Damage",
    "control": "Control",
    "defense": "Defense",
    "healing": "Healing",
    "buff": "Buff",
    "debuff": "Debuff",
    "mobility": "Mobility",
    "summon": "Summon",
    "utility": "Utility",
    "countermagic": "Anti-Magic",
    "anti magic": "Anti-Magic",
    "information": "Information",
    "save or suck": "Save-or-Suck"
  };
  return map[normalized] || "";
}

function normalizeFeatures(features, character) {
  const inferred = [...features];
  const names = inferred.map((feature) => String(feature).toLowerCase());
  const metadata = getClassMetadata(character);
  const addFeature = (feature) => {
    const featureName = String(feature);
    if (!names.includes(featureName.toLowerCase())) {
      inferred.push(featureName);
      names.push(featureName.toLowerCase());
    }
  };

  (metadata?.features || []).forEach(addFeature);

  if (character.className === "Fighter") {
    addFeature("Second Wind");
    addFeature("Action Surge");
    if ((character.level || 1) >= 5) addFeature("Extra Attack");
  }
  if (metadata?.extraAttackAt && (character.level || 1) >= metadata.extraAttackAt) {
    addFeature("Extra Attack");
  }
  if (character.className === "Rogue") {
    addFeature("Sneak Attack");
  }
  if (character.className === "Barbarian") {
    addFeature("Rage");
    addFeature("Rage Damage");
  }
  if (character.className === "Paladin") {
    addFeature("Lay on Hands");
    addFeature("Divine Smite");
  }
  if (character.className === "Bard") {
    addFeature("Bardic Inspiration");
  }

  return inferred;
}

function inferRoles(character) {
  const roles = new Set(getCharacterRolePriority(character));
  const className = character.className;
  const classGroup = getClassGroup(character);
  const metadata = getClassMetadata(character);

  if (["Fighter", "Barbarian", "Paladin"].includes(className) || ["martial", "tank"].includes(classGroup)) {
    roles.add("FRONTLINE");
    roles.add("TANK");
  }
  if (["Rogue", "Monk", "Blood Hunter"].includes(className) || classGroup === "skirmisher") {
    roles.add("DPS_MELEE");
  }
  if (["Ranger"].includes(className) || classGroup === "ranged") {
    roles.add("DPS_RANGED");
    roles.add("DPS_PHYSICAL");
  }
  if (["Wizard", "Sorcerer", "Warlock"].includes(className) || classGroup === "arcane") {
    roles.add("DPS_RANGED");
    roles.add("ARCANE_CASTER");
    roles.add("DPS_MAGICAL");
  }
  if (["Cleric", "Druid", "Bard", "Artificer"].includes(className) || ["divine", "primal", "support"].includes(classGroup)) {
    roles.add("SUPPORT");
  }
  if ((character.spells || []).length || metadata?.spellcasting) {
    roles.add("SPELLCASTER");
  }

  return [...roles];
}

function normalizeRoles(roles) {
  const mapped = {
    FRONTLINER: "FRONTLINE",
    DAMAGE_DEALER: "DPS_MELEE"
  };
  return roles.map((role) => mapped[role] || role);
}

function roleIsStatSupported(character, role) {
  const stats = character.stats;
  const bestMental = Math.max(stats.INT, stats.WIS, stats.CHA);
  const metadata = getClassMetadata(character);
  if (["FRONTLINE", "TANK"].includes(role)) return stats.CON >= 13 && Math.max(stats.STR, stats.DEX) >= 13;
  if (role === "DPS_MELEE") return Math.max(stats.STR, stats.DEX) >= 14;
  if (role === "DPS_RANGED") return Math.max(stats.DEX, bestMental) >= 14;
  if (["ARCANE_CASTER", "SPELLCASTER", "DPS_MAGICAL"].includes(role)) return bestMental >= 14 && (character.spells.length > 0 || metadata?.spellcasting);
  if (["HEALER", "BUFFER", "DEBUFFER", "SUPPORT", "TACTICIAN", "UTILITY"].includes(role)) return bestMental >= 13 || character.spells.length > 0 || metadata?.spellcasting;
  return false;
}

function collectPartyRoles(members, memberResults) {
  const covered = new Set();
  let hasPhysicalDamage = false;
  let hasMagicalDamage = false;
  const primaryRoles = new Set();
  const partyDamageProfile = buildPartyDamageProfile(memberResults);

  members.forEach((member, index) => {
    const normalized = normalizeCharacter(member);
    const roles = inferRoles(normalized);
    const metadata = getClassMetadata(normalized);
    const metadataTags = new Set((metadata?.tags || []).map((tag) => String(tag).toLowerCase()));
    roles.forEach((role) => covered.add(role));
    if (roles.includes("FRONTLINE")) covered.add("TANK");
    if (roles.includes("SUPPORT")) covered.add("HEALER");
    if (roles.includes("DPS_MELEE")) {
      covered.add("DPS_PHYSICAL");
      hasPhysicalDamage = true;
    }
    if (roles.includes("DPS_RANGED")) {
      covered.add("DPS_PHYSICAL");
      if (normalized.spells.length || metadata?.spellcasting) {
        covered.add("DPS_MAGICAL");
        hasMagicalDamage = true;
      }
    }
    if (metadata?.spellcasting) {
      covered.add("SPELLCASTER");
    }
    if (metadataTags.has("healer")) covered.add("HEALER");
    if (metadataTags.has("buffer")) covered.add("BUFFER");
    if (metadataTags.has("debuffer")) covered.add("DEBUFFER");
    if (normalized.spells.some((spell) => spell.type === "damage" || spellHasTag(spell, "damage"))) {
      covered.add("DPS_MAGICAL");
      hasMagicalDamage = true;
    }
    if (normalized.attacks.length) {
      hasPhysicalDamage = true;
    }
    if (normalized.spells.some((spell) => spell.type === "control" || spell.type === "debuff" || spellHasTag(spell, "control") || spellHasTag(spell, "debuff"))) {
      covered.add("DEBUFFER");
    }
    if (roles.includes("TACTICIAN")) {
      covered.add("TACTICIAN");
    }
    primaryRoles.add(roles[0] || memberResults[index]?.characterName || "UNKNOWN");
  });

  return {
    covered,
    hasPhysicalDamage: hasPhysicalDamage || partyDamageProfile.hasPhysical,
    hasMagicalDamage: hasMagicalDamage || partyDamageProfile.hasMagical,
    hasElementalDamage: partyDamageProfile.hasElemental,
    hasSpecialMagicDamage: partyDamageProfile.hasSpecial,
    damageTypeCount: partyDamageProfile.damageTypeCount,
    damageProfile: partyDamageProfile,
    primaryRoleCount: primaryRoles.size
  };
}

function calculateAffinityModifier(members) {
  const details = [];
  const explanation = [];
  let rawAffinity = 0;

  for (let left = 0; left < members.length; left += 1) {
    for (let right = left + 1; right < members.length; right += 1) {
      const characterA = members[left];
      const characterB = members[right];
      const relationship = getPairAffinity(characterA, characterB);

      if (!relationship) {
        continue;
      }

      const score = clamp(Number(relationship.score || 0), -3, 3);
      const points = score * 5;
      rawAffinity += points;
      const label = score > 0 ? "positive" : score < 0 ? "negative" : "neutral";
      const note = relationship.note || getDefaultAffinityNote(characterA, characterB, score);

      details.push({
        characterA: characterA.name,
        characterB: characterB.name,
        score,
        points,
        label,
        note
      });

      if (score > 0) {
        explanation.push(`${characterA.name} and ${characterB.name} have positive affinity (${formatSigned(points)}). ${note}`);
      } else if (score < 0) {
        explanation.push(`${characterA.name} and ${characterB.name} have negative affinity (${formatSigned(points)}). ${note}`);
      }
    }
  }

  const affinityBonus = clamp(rawAffinity, -60, 60);
  if (rawAffinity !== affinityBonus) {
    explanation.push(`Affinity total was capped from ${formatSigned(rawAffinity)} to ${formatSigned(affinityBonus)}.`);
  }
  if (!details.length) {
    explanation.push("No known character affinities were found in this party.");
  }

  return {
    affinityBonus,
    details,
    explanation
  };
}

function getPairAffinity(characterA, characterB) {
  const fromA = getCharacterAffinityFor(characterA, characterB.id);
  const fromB = getCharacterAffinityFor(characterB, characterA.id);

  if (!fromA && !fromB) {
    return null;
  }

  if (fromA && fromB) {
    return {
      score: (Number(fromA.score || 0) + Number(fromB.score || 0)) / 2,
      note: [fromA.note, fromB.note].filter(Boolean).join(" / ")
    };
  }

  return fromA || fromB;
}

function getCharacterAffinityFor(character, otherCharacterId) {
  const direct = character.affinities?.[otherCharacterId] || character.affinity?.[otherCharacterId];
  if (direct !== undefined) {
    return normalizeAffinityEntry(direct);
  }

  const relationship = (character.relationships || []).find((entry) =>
    entry.characterId === otherCharacterId ||
    entry.id === otherCharacterId ||
    entry.with === otherCharacterId
  );

  return relationship ? normalizeAffinityEntry(relationship) : null;
}

function normalizeAffinityEntry(entry) {
  if (typeof entry === "number") {
    return { score: entry, note: "" };
  }
  if (typeof entry === "string") {
    return { score: affinityWordToScore(entry), note: "" };
  }
  return {
    score: entry.score ?? entry.value ?? entry.affinity ?? affinityWordToScore(entry.type || entry.status || ""),
    note: entry.note || entry.reason || entry.description || ""
  };
}

function affinityWordToScore(value) {
  const key = String(value || "").toLowerCase();
  const map = {
    bond: 3,
    best: 3,
    ally: 2,
    friend: 2,
    positive: 1,
    neutral: 0,
    rival: -1,
    conflict: -2,
    enemy: -3,
    hate: -3
  };
  return map[key] ?? 0;
}

function getDefaultAffinityNote(characterA, characterB, score) {
  if (score > 1) return "They trust each other and coordinate naturally.";
  if (score > 0) return "They know how to work together.";
  if (score < -1) return "Their conflict hurts the party rhythm.";
  if (score < 0) return "There is tension between them.";
  return `${characterA.name} and ${characterB.name} have a neutral relationship.`;
}

function averageDamageDice(damageDice) {
  if (!damageDice || typeof damageDice !== "string") return 0;
  const cleaned = damageDice.replace(/\s+/g, "");
  const match = cleaned.match(/^(\d+)d(\d+)([+-]\d+)?$/i);
  if (!match) return Number(cleaned) || 0;
  const diceCount = Number(match[1]);
  const dieSize = Number(match[2]);
  const modifier = Number(match[3] || 0);
  return diceCount * ((dieSize + 1) / 2) + modifier;
}

function lookupCR(value, table) {
  const row = table.find(([min, max]) => value >= min && value <= max);
  return row ? row[2] : 0;
}

function getArmorClassAdjustment(ac) {
  if (ac <= 10) return -1;
  if (ac <= 12) return 0;
  if (ac <= 15) return 0.5;
  if (ac <= 18) return 1;
  if (ac <= 21) return 2;
  return 3;
}

function getAttackBonusAdjustment(attackBonus) {
  if (attackBonus <= 3) return -1;
  if (attackBonus <= 5) return 0;
  if (attackBonus <= 7) return 0.5;
  if (attackBonus <= 9) return 1;
  if (attackBonus <= 11) return 1.5;
  return 2;
}

function getDcAdjustment(dc) {
  if (dc <= 12) return -0.5;
  if (dc <= 14) return 0;
  if (dc <= 16) return 0.5;
  if (dc <= 18) return 1;
  return 2;
}

function roundToAllowedCR(value) {
  return CR_VALUES.reduce((closest, current) =>
    Math.abs(current - value) < Math.abs(closest - value) ? current : closest
  , CR_VALUES[0]);
}

function formatCR(value) {
  if (value === 0.125) return "1/8";
  if (value === 0.25) return "1/4";
  if (value === 0.5) return "1/2";
  return String(Math.round(value));
}

function getArmorClassInfo(character, stats) {
  const explicitArmorClass = getOptionalPositiveNumber(character.armorClass);
  const armorProfile = getArmorProfile(character);
  const shieldBonus = getShieldBonus(character);
  const armorBonus = getArmorBonus(character);

  if (explicitArmorClass) {
    return {
      armorClass: Math.round(explicitArmorClass),
      source: "manual",
      formula: `AC provided manually: ${Math.round(explicitArmorClass)}.`
    };
  }

  const baseInfo = getArmorBaseInfo(character, stats, armorProfile);
  const armorClass = Math.max(1, Math.round(baseInfo.value + shieldBonus + armorBonus));
  const additions = [
    shieldBonus ? `shield ${formatSigned(shieldBonus)}` : "",
    armorBonus ? `armor bonus ${formatSigned(armorBonus)}` : ""
  ].filter(Boolean);
  const additionText = additions.length ? ` + ${additions.join(" + ")}` : "";

  return {
    armorClass,
    source: baseInfo.source,
    formula: `AC estimated from ${baseInfo.source}: ${baseInfo.formula}${additionText} = ${armorClass}.`
  };
}

function estimateArmorClass(character, stats) {
  return getArmorClassInfo(character, stats).armorClass;
}

function getArmorProfile(character) {
  const metadata = getClassMetadata(character);
  return character.armorProfile || character.defenseProfile || metadata?.armorProfile || "";
}

function getArmorBaseInfo(character, stats, armorProfile) {
  const dex = abilityModifier(stats.DEX);
  const con = abilityModifier(stats.CON);
  const wis = abilityModifier(stats.WIS);

  if (armorProfile === "heavy") {
    return { value: 16, source: "heavy armor profile", formula: "16" };
  }
  if (armorProfile === "medium") {
    return { value: 14 + Math.min(dex, 2), source: "medium armor profile", formula: `14 + capped DEX ${Math.min(dex, 2)}` };
  }
  if (armorProfile === "light") {
    return { value: 12 + dex, source: "light armor profile", formula: `12 + DEX ${formatSigned(dex)}` };
  }
  if (armorProfile === "caster") {
    return { value: 12 + Math.min(dex, 2), source: "caster armor profile", formula: `12 + capped DEX ${Math.min(dex, 2)}` };
  }
  if (armorProfile === "unarmoredCon") {
    return { value: 10 + dex + con, source: "unarmored CON profile", formula: `10 + DEX ${formatSigned(dex)} + CON ${formatSigned(con)}` };
  }
  if (armorProfile === "unarmoredWis") {
    return { value: 10 + dex + wis, source: "unarmored WIS profile", formula: `10 + DEX ${formatSigned(dex)} + WIS ${formatSigned(wis)}` };
  }

  const classGroup = getClassGroup(character);
  if (["Fighter", "Paladin"].includes(character.className) || ["martial", "tank"].includes(classGroup)) {
    return { value: 16, source: "martial fallback", formula: "16" };
  }
  if (["Barbarian"].includes(character.className)) {
    return { value: 10 + dex + con, source: "barbarian unarmored fallback", formula: `10 + DEX ${formatSigned(dex)} + CON ${formatSigned(con)}` };
  }
  if (["Rogue", "Ranger", "Monk", "Blood Hunter"].includes(character.className) || ["skirmisher", "ranged"].includes(classGroup)) {
    return { value: 13 + dex, source: "agile fallback", formula: `13 + DEX ${formatSigned(dex)}` };
  }
  return { value: 12 + Math.min(dex, 2), source: "default adventurer fallback", formula: `12 + capped DEX ${Math.min(dex, 2)}` };
}

function getShieldBonus(character) {
  const explicitShieldBonus = Number(character.shieldBonus ?? character.equipment?.shieldBonus);
  if (Number.isFinite(explicitShieldBonus) && explicitShieldBonus > 0) {
    return explicitShieldBonus;
  }
  if (character.hasShield || character.shield || character.equipment?.hasShield || character.equipment?.shield) {
    return 2;
  }
  return 0;
}

function getArmorBonus(character) {
  const directBonus = Number(character.armorBonus || 0);
  const magicBonus = Number(character.magicArmorBonus || 0);
  const equipmentBonus = Number(character.equipment?.armorBonus || 0);
  const equipmentMagicBonus = Number(character.equipment?.magicArmorBonus || 0);
  return [directBonus, magicBonus, equipmentBonus, equipmentMagicBonus]
    .filter((bonus) => Number.isFinite(bonus))
    .reduce((sum, bonus) => sum + bonus, 0);
}

function getHitPointInfo(character, stats) {
  const hitDieInfo = getClassHitDie(character);
  const hitDie = hitDieInfo.hitDie;
  const level = Math.max(1, Number(character.level || 1));
  const conMod = abilityModifier(stats.CON);
  const explicitHitPoints = getOptionalPositiveNumber(character.hitPoints);

  if (explicitHitPoints) {
    return {
      hitPoints: Math.round(explicitHitPoints),
      hitDie,
      source: "manual",
      formula: `HP provided manually: ${Math.round(explicitHitPoints)}. Class hit die is d${hitDie} (${hitDieInfo.source}).`
    };
  }

  const firstLevelHp = Math.max(1, hitDie + conMod);
  const averagePerLevel = Math.max(1, Math.floor(hitDie / 2) + 1 + conMod);
  const extraLevels = Math.max(0, level - 1);
  const hitPoints = firstLevelHp + extraLevels * averagePerLevel;

  return {
    hitPoints,
    hitDie,
    source: hitDieInfo.source,
    formula: `HP estimated from d${hitDie} (${hitDieInfo.source}): level 1 ${firstLevelHp} + ${extraLevels} levels x ${averagePerLevel} = ${hitPoints}.`
  };
}

function estimateHitPoints(character, stats) {
  return getHitPointInfo(character, stats).hitPoints;
}

function getClassHitDie(character) {
  const classGroup = getClassGroup(character);
  const metadata = getClassMetadata(character);
  const hitDieByClass = {
    Alchemist: 8,
    Artificer: 8,
    Barbarian: 12,
    Bard: 8,
    Binder: 8,
    Fighter: 10,
    Paladin: 10,
    Ranger: 10,
    "Blood Hunter": 12,
    Blood: 10,
    Captain: 8,
    Cleric: 8,
    Commoner: 8,
    Craftsman: 10,
    Druid: 8,
    Gadgeteer: 6,
    Gunslinger: 8,
    Illrigger: 10,
    Investigator: 8,
    Magus: 10,
    Martyr: 12,
    Necromancer: 6,
    Pugilist: 8,
    Rogue: 8,
    Monk: 8,
    Psion: 6,
    Savant: 8,
    Shaman: 8,
    Tamer: 8,
    Vessel: 10,
    Warden: 12,
    Warmage: 8,
    Witch: 6,
    Wizard: 6,
    Sorcerer: 6,
    Warlock: 8
  };
  const hitDieByGroup = {
    tank: 12,
    martial: 10,
    skirmisher: 8,
    ranged: 8,
    divine: 8,
    primal: 8,
    support: 8,
    arcane: 6
  };
  const className = String(character.className || "").trim();
  const classHitDieKey = Object.keys(hitDieByClass).find((key) => key.toLowerCase() === className.toLowerCase());

  if (metadata?.hitDie) {
    return { hitDie: metadata.hitDie, source: `${className || "Class"} class data` };
  }
  if (classHitDieKey) {
    return { hitDie: hitDieByClass[classHitDieKey], source: `${classHitDieKey} fallback` };
  }
  if (hitDieByGroup[classGroup]) {
    return { hitDie: hitDieByGroup[classGroup], source: `${classGroup} class group` };
  }

  return { hitDie: 8, source: "default adventurer" };
}

function normalizeAttackDamage(attack, character) {
  const classGroup = getClassGroup(character);
  const metadata = getClassMetadata(character);
  const attackStyle = metadata?.attackStyle || "";
  const explicitTypes = [
    ...(Array.isArray(attack.damageTypes) ? attack.damageTypes : []),
    attack.damageType
  ];
  const inferredTypes = inferDamageTypesFromText(`${attack.name || ""} ${attack.damageType || ""}`, explicitTypes);
  const damageTypes = inferredTypes.length
    ? inferredTypes
    : [getDefaultAttackDamageType(attackStyle, classGroup)];

  return {
    ...attack,
    damageType: damageTypes[0],
    damageTypes,
    damageCategory: getDamageCategory(damageTypes[0])
  };
}

function getDefaultAttackDamageType(attackStyle, classGroup) {
  if (attackStyle === "explosive") return "fire";
  if (attackStyle === "firearm" || attackStyle === "ranged") return "piercing";
  if (attackStyle === "magic") return "force";
  if (attackStyle === "support") return "bludgeoning";
  if (attackStyle === "hybrid") return "slashing";
  if (["ranged", "skirmisher"].includes(classGroup)) return "piercing";
  if (classGroup === "arcane") return "force";
  return "slashing";
}

function inferSpellDamageTypes(spellName, metadata, spell = {}) {
  const explicitTypes = [
    ...(Array.isArray(spell?.damageTypes) ? spell.damageTypes : []),
    spell?.damageType,
    metadata?.damageType
  ];
  const text = [
    spellName,
    metadata?.school,
    ...(metadata?.tags || []),
    spell?.school,
    ...(Array.isArray(spell?.tags) ? spell.tags : []),
    spell?.type
  ].filter(Boolean).join(" ");
  const inferredTypes = inferDamageTypesFromText(text, explicitTypes);

  if (inferredTypes.length) {
    return inferredTypes;
  }

  const isDamageSpell = metadata?.type === "damage" ||
    (metadata?.tags || []).includes("damage") ||
    spell?.type === "damage" ||
    (Array.isArray(spell?.tags) && spell.tags.includes("damage")) ||
    Boolean(metadata?.damageDice || spell?.damageDice || metadata?.averageDamage || spell?.averageDamage);

  if (!isDamageSpell) {
    return [];
  }

  const school = String(spell?.school || metadata?.school || "").toLowerCase();
  if (school.includes("necromancy")) return ["necrotic"];
  if (school.includes("enchantment") || school.includes("illusion")) return ["psychic"];
  if (school.includes("evocation") || school.includes("abjuration")) return ["force"];
  if (school.includes("conjuration") || school.includes("transmutation")) return ["bludgeoning"];

  return ["force"];
}

function inferDamageTypesFromText(text, fallbackTypes = []) {
  const normalizedText = normalizeLookupText([
    text,
    ...(Array.isArray(fallbackTypes) ? fallbackTypes : [fallbackTypes])
  ].filter(Boolean).join(" "));
  const explicitTypes = uniqueDamageTypes(fallbackTypes);
  const hintedTypes = TRACKED_DAMAGE_TYPES.filter((type) =>
    DAMAGE_TYPE_HINTS[type].some((hint) => normalizedText.includes(normalizeLookupText(hint)))
  );

  return uniqueDamageTypes([...explicitTypes, ...hintedTypes]);
}

function uniqueDamageTypes(types) {
  return [...new Set((types || [])
    .map((type) => normalizeDamageType(type))
    .filter((type) => TRACKED_DAMAGE_TYPES.includes(type)))];
}

function normalizeDamageType(type) {
  const normalized = normalizeLookupText(type);
  const aliases = {
    weapon: "",
    magic: "force",
    magical: "force",
    melee: "slashing",
    ranged: "piercing",
    physical: "slashing",
    holy: "radiant",
    divine: "radiant",
    shadow: "necrotic",
    mental: "psychic",
    sonic: "thunder"
  };

  return aliases[normalized] ?? normalized;
}

function getDamageCategory(type) {
  const normalized = normalizeDamageType(type);
  if (PHYSICAL_DAMAGE_TYPES.includes(normalized)) return "physical";
  if (ELEMENTAL_DAMAGE_TYPES.includes(normalized)) return "elemental";
  if (SPECIAL_MAGIC_DAMAGE_TYPES.includes(normalized)) return "special";
  return "unknown";
}

function formatDamageTypes(types) {
  const uniqueTypes = uniqueDamageTypes(types);
  return uniqueTypes.length ? uniqueTypes.join(", ") : "untyped";
}

function createEmptyDamageProfile() {
  return {
    physical: { types: [], users: [] },
    elemental: { types: [], users: [] },
    special: { types: [], users: [] },
    allTypes: [],
    usersByType: {},
    spellUsersByType: {},
    attackUsersByType: {},
    hasPhysical: false,
    hasElemental: false,
    hasSpecial: false,
    hasMagical: false,
    damageTypeCount: 0
  };
}

function buildCharacterDamageProfile(character) {
  if (character.damageProfile) {
    return character.damageProfile;
  }

  const profile = createEmptyDamageProfile();
  const characterName = character.characterName || character.name || "Unknown";
  const className = character.className || character.character?.className || "";
  const ownerLabel = className ? `${characterName} (${className})` : characterName;

  (character.attacks || []).forEach((attack) => {
    const damageTypes = uniqueDamageTypes(attack.damageTypes || [attack.damageType]);
    damageTypes.forEach((type) => {
      addDamageProfileUser(profile, type, `${ownerLabel}: ${attack.name || "Attack"}`, "attack");
    });
  });

  (character.spells || []).forEach((spell) => {
    const isDamageSpell = spell.type === "damage" || spellHasTag(spell, "damage") || Number(spell.averageDamage || 0) > 0;
    if (!isDamageSpell) {
      return;
    }

    const damageTypes = uniqueDamageTypes(spell.damageTypes || [spell.damageType]);
    const usableBy = (spell.usableBy || spell.classes || []).length
      ? ` [${(spell.usableBy || spell.classes).join(", ")}]`
      : "";
    damageTypes.forEach((type) => {
      addDamageProfileUser(profile, type, `${ownerLabel}: ${spell.name}${usableBy}`, "spell");
    });
  });

  return finalizeDamageProfile(profile);
}

function buildPartyDamageProfile(memberResults) {
  const profile = createEmptyDamageProfile();

  (memberResults || []).forEach((result) => {
    const memberProfile = result.damageProfile || buildCharacterDamageProfile(result.character || result);
    Object.entries(memberProfile.attackUsersByType || {}).forEach(([type, users]) => {
      users.forEach((user) => addDamageProfileUser(profile, type, user, "attack"));
    });
    Object.entries(memberProfile.spellUsersByType || {}).forEach(([type, users]) => {
      users.forEach((user) => addDamageProfileUser(profile, type, user, "spell"));
    });
  });

  return finalizeDamageProfile(profile);
}

function addDamageProfileUser(profile, type, user, source) {
  const damageType = normalizeDamageType(type);
  const category = getDamageCategory(damageType);

  if (!TRACKED_DAMAGE_TYPES.includes(damageType) || category === "unknown") {
    return;
  }

  addUnique(profile.allTypes, damageType);
  addUnique(profile.usersByType[damageType] ||= [], user);
  addUnique(profile[category].types, damageType);
  addUnique(profile[category].users, user);

  if (source === "spell") {
    addUnique(profile.spellUsersByType[damageType] ||= [], user);
  } else {
    addUnique(profile.attackUsersByType[damageType] ||= [], user);
  }
}

function finalizeDamageProfile(profile) {
  profile.allTypes = [...profile.allTypes].sort();
  profile.physical.types = [...profile.physical.types].sort();
  profile.elemental.types = [...profile.elemental.types].sort();
  profile.special.types = [...profile.special.types].sort();
  profile.hasPhysical = profile.physical.types.length > 0;
  profile.hasElemental = profile.elemental.types.length > 0;
  profile.hasSpecial = profile.special.types.length > 0;
  profile.hasMagical = profile.hasElemental || profile.hasSpecial;
  profile.damageTypeCount = profile.allTypes.length;
  return profile;
}

function addUnique(list, value) {
  if (value && !list.includes(value)) {
    list.push(value);
  }
}

function calculateDamageProfileModifier(profile) {
  const breakdown = [];
  let value = 0;

  if (profile.hasPhysical && profile.hasMagical) {
    value += 0.25;
    breakdown.push("Physical plus magical damage coverage adds +0.25 Offensive CR.");
  }
  if (profile.damageTypeCount >= 3) {
    value += 0.25;
    breakdown.push("Three or more damage types add +0.25 Offensive CR.");
  }
  if (profile.hasSpecial) {
    value += 0.25;
    breakdown.push("Radiant, necrotic, force, or psychic access adds +0.25 Offensive CR.");
  }

  return { value, breakdown };
}

function getClassGroup(character) {
  if (character.classGroup) {
    return String(character.classGroup).toLowerCase();
  }

  const metadata = getClassMetadata(character);
  if (metadata?.classGroup) {
    return String(metadata.classGroup).toLowerCase();
  }

  const className = String(character.className || "").toLowerCase();
  if (["fighter", "paladin"].includes(className)) return "martial";
  if (["barbarian"].includes(className)) return "tank";
  if (["rogue", "monk", "blood hunter"].includes(className)) return "skirmisher";
  if (["ranger"].includes(className)) return "ranged";
  if (["wizard", "sorcerer", "warlock"].includes(className)) return "arcane";
  if (["cleric"].includes(className)) return "divine";
  if (["druid"].includes(className)) return "primal";
  if (["bard", "artificer"].includes(className)) return "support";
  return "";
}

function estimateProficiency(level) {
  return Math.ceil((Number(level || 1) + 3) / 4) + 1;
}

function estimateAttackBonus(character) {
  const stats = character.stats || {};
  const metadata = getClassMetadata(character);
  const primaryStat = metadata?.attackStyle === "magic" || metadata?.attackStyle === "explosive"
    ? metadata.primaryStat || getBestMentalStatName(stats)
    : getBestWeaponStatName(stats);
  return estimateProficiency(character.level || 1) + abilityModifier(stats[primaryStat] || 10);
}

function estimateSaveDc(character, stats) {
  const metadata = getClassMetadata(character);
  if ((!Array.isArray(character.spells) || character.spells.length === 0) && !metadata?.spellcasting) return null;
  const castingStat = stats[metadata?.primaryStat] || Math.max(stats.INT, stats.WIS, stats.CHA);
  return 8 + estimateProficiency(character.level || 1) + abilityModifier(castingStat);
}

function getBestWeaponStatName(stats) {
  return (stats.STR || 10) >= (stats.DEX || 10) ? "STR" : "DEX";
}

function getBestMentalStatName(stats) {
  const mentalStats = ["INT", "WIS", "CHA"];
  return mentalStats.sort((left, right) => (stats[right] || 10) - (stats[left] || 10))[0];
}

function inferSpellType(name) {
  if (DAMAGE_SPELL_ESTIMATES[name]) return "damage";
  if (hasNameHint(name, [...UTILITY_HINTS.debuffsStrong, ...UTILITY_HINTS.areaControl])) return "control";
  if (hasNameHint(name, UTILITY_HINTS.healingStrong) || hasNameHint(name, UTILITY_HINTS.healingModerate)) return "healing";
  if (hasNameHint(name, UTILITY_HINTS.buffsStrong)) return "buff";
  if (hasNameHint(name, UTILITY_HINTS.counterMagic)) return "utility";
  if (name.includes("shield") || name.includes("mirror image")) return "defense";
  return "utility";
}

function inferSpellLevel(name) {
  if (["fireball", "lightning bolt", "hypnotic pattern", "counterspell"].some((spell) => name.includes(spell))) return 3;
  if (["shield", "magic missile", "bless", "cure wounds", "healing word"].some((spell) => name.includes(spell))) return 1;
  return 2;
}

function estimateSpellDamage(name, metadata = getSpellMetadata(name), casterLevel = 1) {
  const key = String(name || "").toLowerCase();
  const exact = DAMAGE_SPELL_ESTIMATES[key];
  if (exact) return exact;
  const foundKey = Object.keys(DAMAGE_SPELL_ESTIMATES).find((spellName) => key.includes(spellName));
  if (foundKey) return DAMAGE_SPELL_ESTIMATES[foundKey];

  if (metadata) {
    const scaledDice = getScaledSpellDamageDice(metadata, casterLevel);
    if (scaledDice) {
      return averageDamageDice(scaledDice);
    }
    return Number(metadata.averageDamage || 0);
  }

  return 0;
}

function estimateDamageSpellImpactFloor(spell) {
  const impactScore = Number(spell.impactScore || 0);
  if (!impactScore || !(spell.type === "damage" || spellHasTag(spell, "damage"))) {
    return 0;
  }

  const level = Number(spell.level || 0);
  const levelPressure = level >= 3 ? level * 1.75 : level;
  return roundNumber(Math.max(0, impactScore * 2 + levelPressure));
}

function estimateSummonSpellDamage(spell) {
  const impactScore = Number(spell.impactScore || 0);
  const level = Number(spell.level || 0);
  const actionEconomyBonus = spellHasTag(spell, "action economy") ? 5 : 0;
  const persistentBonus = spellHasTag(spell, "persistent effect") ? 3 : 0;

  return roundNumber(Math.max(6, impactScore * 2.25 + level * 1.5 + actionEconomyBonus + persistentBonus));
}

function getScaledSpellDamageDice(metadata, casterLevel) {
  const scaling = Array.isArray(metadata.damageAtCharacterLevel)
    ? [...metadata.damageAtCharacterLevel].sort((a, b) => Number(a.level) - Number(b.level))
    : [];
  const scaled = scaling
    .filter((entry) => Number(casterLevel || 1) >= Number(entry.level))
    .pop();
  return scaled?.dice || metadata.damageDice || "";
}

function isAoeSpell(name) {
  const key = String(name || "").toLowerCase();
  return ["fireball", "lightning bolt", "flame strike", "hypnotic pattern", "spike growth", "wall of force"].some((hint) => key.includes(hint));
}

function isResourceDependent(character) {
  const metadata = getClassMetadata(character);
  return (character.spells.length >= 3 || metadata?.spellcasting) &&
    character.attacks.length <= 1 &&
    !["Warlock", "Fighter", "Rogue"].includes(character.className);
}

function hasFeatureOrSpell(character, hint) {
  return hasFeature(character, hint) || character.spells.some((spell) => spell.name.toLowerCase().includes(hint));
}

function hasFeature(character, hint) {
  return character.features.some((feature) => String(feature).toLowerCase().includes(hint));
}

function hasAnyHint(names, hints) {
  return names.some((name) => hints.some((hint) => name.includes(hint)));
}

function hasNameHint(name, hints) {
  return hints.some((hint) => name.includes(hint));
}

function getPartyMembers(party) {
  if (Array.isArray(party)) return party;
  return party.members || party.characters || [];
}

function abilityModifier(score) {
  return Math.floor((Number(score || 10) - 10) / 2);
}

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length : 0;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function roundNumber(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function formatSigned(value) {
  return value >= 0 ? `+${roundNumber(value)}` : `${roundNumber(value)}`;
}

const CR_CALCULATOR_EXAMPLE_CHARACTERS = [
  {
    id: "example-fighter-champion",
    name: "Fighter Champion",
    className: "Fighter",
    subclass: "Champion",
    level: 5,
    armorClass: 18,
    hitPoints: 49,
    proficiencyBonus: 3,
    stats: { STR: 18, DEX: 12, CON: 16, INT: 10, WIS: 11, CHA: 10 },
    attacks: [{ name: "Greatsword", attackBonus: 7, damageDice: "2d6+4", attacksPerRound: 2, damageType: "slashing" }],
    spells: [],
    savingThrowDC: null,
    roles: ["FRONTLINE", "DPS_MELEE"],
    features: ["Second Wind", "Action Surge", "Extra Attack", "Improved Critical"]
  },
  {
    id: "example-eldritch-knight",
    name: "Fighter Eldritch Knight",
    className: "Fighter",
    subclass: "Eldritch Knight",
    level: 5,
    armorClass: 17,
    hitPoints: 48,
    proficiencyBonus: 3,
    stats: { STR: 14, DEX: 14, CON: 15, INT: 16, WIS: 10, CHA: 12 },
    attacks: [{ name: "Longsword", attackBonus: 7, damageDice: "1d8+4", attacksPerRound: 2, damageType: "slashing" }],
    spells: [
      { name: "Shield", type: "defense", level: 1 },
      { name: "Magic Missile", type: "damage", level: 1, averageDamage: 10.5 }
    ],
    savingThrowDC: 14,
    roles: ["FRONTLINE", "DPS_MELEE", "ARCANE_CASTER"],
    features: ["Second Wind", "Action Surge", "Extra Attack"]
  },
  {
    id: "example-cleric-life",
    name: "Cleric Life Domain",
    className: "Cleric",
    subclass: "Life Domain",
    level: 5,
    armorClass: 18,
    hitPoints: 43,
    proficiencyBonus: 3,
    stats: { STR: 12, DEX: 10, CON: 14, INT: 10, WIS: 18, CHA: 12 },
    attacks: [{ name: "Mace", attackBonus: 5, damageDice: "1d6+2", attacksPerRound: 1, damageType: "bludgeoning" }],
    spells: [
      { name: "Cure Wounds", type: "healing", level: 1 },
      { name: "Bless", type: "buff", level: 1 },
      { name: "Spirit Guardians", type: "damage", level: 3, averageDamage: 13.5, isAoE: true }
    ],
    savingThrowDC: 15,
    roles: ["HEALER", "SUPPORT"],
    features: ["Disciple of Life"]
  },
  {
    id: "example-wizard-evocation",
    name: "Wizard Evocation",
    className: "Wizard",
    subclass: "Evocation",
    level: 5,
    armorClass: 13,
    hitPoints: 32,
    proficiencyBonus: 3,
    stats: { STR: 8, DEX: 14, CON: 14, INT: 18, WIS: 12, CHA: 10 },
    attacks: [{ name: "Fire Bolt", attackBonus: 7, damageDice: "2d10", attacksPerRound: 1, damageType: "fire" }],
    spells: [
      { name: "Fireball", type: "damage", level: 3, averageDamage: 28, isAoE: true },
      { name: "Counterspell", type: "utility", level: 3 },
      { name: "Shield", type: "defense", level: 1 }
    ],
    savingThrowDC: 15,
    roles: ["ARCANE_CASTER", "DPS_RANGED"],
    features: ["Sculpt Spells"]
  },
  {
    id: "example-rogue-assassin",
    name: "Rogue Assassin",
    className: "Rogue",
    subclass: "Assassin",
    level: 5,
    armorClass: 15,
    hitPoints: 38,
    proficiencyBonus: 3,
    stats: { STR: 8, DEX: 18, CON: 14, INT: 12, WIS: 13, CHA: 10 },
    attacks: [{ name: "Rapier", attackBonus: 7, damageDice: "1d8+4", attacksPerRound: 1, damageType: "piercing" }],
    spells: [],
    savingThrowDC: null,
    roles: ["DPS_MELEE", "UTILITY"],
    features: ["Sneak Attack", "Uncanny Dodge"]
  },
  {
    id: "example-barbarian-berserker",
    name: "Barbarian Berserker",
    className: "Barbarian",
    subclass: "Berserker",
    level: 5,
    armorClass: 15,
    hitPoints: 60,
    proficiencyBonus: 3,
    stats: { STR: 18, DEX: 14, CON: 16, INT: 8, WIS: 12, CHA: 10 },
    attacks: [{ name: "Greataxe", attackBonus: 7, damageDice: "1d12+4", attacksPerRound: 2, damageType: "slashing" }],
    spells: [],
    savingThrowDC: null,
    roles: ["FRONTLINE", "TANK", "DPS_MELEE"],
    features: ["Rage", "Rage Damage", "Extra Attack"]
  },
  {
    id: "example-bard-lore",
    name: "Bard Lore",
    className: "Bard",
    subclass: "College of Lore",
    level: 5,
    armorClass: 14,
    hitPoints: 35,
    proficiencyBonus: 3,
    stats: { STR: 8, DEX: 14, CON: 12, INT: 13, WIS: 12, CHA: 18 },
    attacks: [{ name: "Rapier", attackBonus: 5, damageDice: "1d8+2", attacksPerRound: 1, damageType: "piercing" }],
    spells: [
      { name: "Healing Word", type: "healing", level: 1 },
      { name: "Hypnotic Pattern", type: "control", level: 3 },
      { name: "Dissonant Whispers", type: "debuff", level: 1 }
    ],
    savingThrowDC: 15,
    roles: ["SUPPORT", "BUFFER", "DEBUFFER", "TACTICIAN"],
    features: ["Bardic Inspiration", "Cutting Words"]
  }
];

function runCRCalculatorExamples() {
  if (typeof console === "undefined") return;
  const results = CR_CALCULATOR_EXAMPLE_CHARACTERS.map(calculateCharacterCR);
  const partyResult = calculatePartyCR(CR_CALCULATOR_EXAMPLE_CHARACTERS);

  console.group("CR calculator examples");
  results.forEach((result) => {
    console.log(`${result.characterName}: CR ${result.roundedCR}, Power ${result.powerScore}`, result);
  });
  console.log("Full example party CR", partyResult);
  console.groupEnd();
}

if (typeof window !== "undefined") {
  window.calculateCharacterCR = calculateCharacterCR;
  window.calculatePartyCR = calculatePartyCR;
  window.CR_CALCULATOR_EXAMPLE_CHARACTERS = CR_CALCULATOR_EXAMPLE_CHARACTERS;
  if (!window.__CR_CALCULATOR_EXAMPLES_RAN__) {
    window.__CR_CALCULATOR_EXAMPLES_RAN__ = true;
    runCRCalculatorExamples();
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    calculateCharacterCR,
    calculatePartyCR,
    CR_CALCULATOR_EXAMPLE_CHARACTERS
  };
}
})();
