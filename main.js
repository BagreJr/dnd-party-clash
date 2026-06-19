const app = document.getElementById("app");

// Central state keeps the single-page flow simple and local to the browser.
const state = {
  screen: "start",
  seenSpecialCharacterIds: [],
  currentDraftParty: null,
  currentDraftCharacters: [],
  pendingDraftParty: null,
  draftedCharacters: [],
  draftPickOwners: {},
  assignments: {},
  partyName: "Tu Party",
  showRoleHints: true,
  isLocalCoop: false,
  playerNames: ["Jugador 1", "Jugador 2"],
  coopPartyNames: ["Party Jugador 1", "Party Jugador 2"],
  activeCoopPlayerIndex: 0,
  coopRuns: [],
  coopFinal: null,
  recentTrophies: [],
  tournament: null,
  rouletteTimer: null,
  combatTimer: null,
  typingTimer: null,
  galleryReturnScreen: "start",
  trophyReturnScreen: "start",
  gallerySelectedId: ""
};

const ADVENTURE_MAX_COMBATS = 7;
const PATH_CHOICE_COUNT = 2;
const REWARD_OPTION_COUNT = 2;
const REWARD_OPTION_MEMORY_LIMIT = 18;
const ROLE_PRIORITY_MULTIPLIERS = [1.15, 1, 0.75, 0.5];
const UNASSIGNED_ROLE_MULTIPLIER = 0.3;
const TROPHY_STORAGE_KEY = "dnd-party-clash-trophies-v1";
const GALLERY_STORAGE_KEY = "dnd-party-clash-gallery-v1";
const AUDIO_STORAGE_KEY = "dnd-party-clash-audio-v1";
const MUSIC_TRACKS = {
  menu: "assets/audio/music/menu_theme.mp3",
  draft: "assets/audio/music/draft_theme.ogg",
  tournament: "assets/audio/music/tournament_theme.ogg",
  victory: "assets/audio/music/victory_theme.mp3",
  defeat: "assets/audio/music/defeat_theme.mp3"
};
const SFX_TRACKS = {
  uiClick: "assets/audio/sfx/ui_click.ogg",
  rouletteTick: "assets/audio/sfx/roulette_tick.ogg",
  partyReveal: "assets/audio/sfx/party_reveal.ogg",
  cardPick: "assets/audio/sfx/card_pick.ogg",
  specialCardReveal: "assets/audio/sfx/special_card_reveal.ogg",
  rewardOpen: "assets/audio/sfx/reward_open.ogg",
  combatStart: "assets/audio/sfx/combat_start.mp3",
  combatWin: "assets/audio/sfx/combat_win.mp3",
  combatLoss: "assets/audio/sfx/combat_loss.mp3",
  achievementUnlock: "assets/audio/sfx/achievement_unlock.mp3"
};
const PORTRAIT_FILES = {
  adahi: "assets/portraits/Adahi.webp",
  adbullah: "assets/portraits/Adbullah.webp",
  aldora: "assets/portraits/aldora.webp",
  allan: "assets/portraits/allan.webp",
  amari: "assets/portraits/amari.webp",
  annabella: "assets/portraits/Annabella.webp",
  arminio: "assets/portraits/Arminio.webp",
  atlas: "assets/portraits/atlas.webp",
  aurora: "assets/portraits/Aurora.webp",
  austin: "assets/portraits/Austin.webp",
  baltasaria: "assets/portraits/baltasaria.webp",
  barian: "assets/portraits/barian.webp",
  betty: "assets/portraits/betty.webp",
  beyond: "assets/portraits/beyond.webp",
  bigsky: "assets/portraits/Bigsky.webp",
  billy: "assets/portraits/billy.webp",
  bobby: "assets/portraits/bobby.webp",
  brakcius: "assets/portraits/Brakcius.webp",
  brandon: "assets/portraits/Brandon.webp",
  brisa: "assets/portraits/brisa.webp",
  brittany: "assets/portraits/Brittany.webp",
  canario: "assets/portraits/CANARIO.webp",
  catrina: "assets/portraits/catrina.webp",
  chris: "assets/portraits/chris.webp",
  colt: "assets/portraits/colt.webp",
  dagon: "assets/portraits/dagon.webp",
  dangxia: "assets/portraits/DangXia.webp",
  deluxo: "assets/portraits/deluxo.webp",
  dimas: "assets/portraits/dimas.webp",
  dion: "assets/portraits/dion.webp",
  domenico: "assets/portraits/Domenico.webp",
  dynamo: "assets/portraits/Dynamo.webp",
  eliana: "assets/portraits/Eliana.webp",
  elpadre: "assets/portraits/elpadre.webp",
  fashad: "assets/portraits/fashad.webp",
  fahona: "assets/portraits/fahona.webp",
  fenris: "assets/portraits/Fenris.webp",
  gael: "assets/portraits/gael.webp",
  gale: "assets/portraits/gale.webp",
  giovanni: "assets/portraits/Giovanni.webp",
  guileas: "assets/portraits/Guileas.webp",
  javier: "assets/portraits/javier.webp",
  "jhon-cross": "assets/portraits/jhon-cross.webp",
  jhonny: "assets/portraits/jhonny.webp",
  kafka: "assets/portraits/kafka.webp",
  katriona: "assets/portraits/Katriona.webp",
  kiara: "assets/portraits/kiara.webp",
  "lady-ginebra": "assets/portraits/Lady-Ginebra.webp",
  lex: "assets/portraits/lex.webp",
  lied: "assets/portraits/lied.webp",
  liora: "assets/portraits/liora.webp",
  lito: "assets/portraits/lito.webp",
  lorkan: "assets/portraits/lorkan.webp",
  "lucia-mars": "assets/portraits/lucia-mars.webp",
  luna: "assets/portraits/luna.webp",
  lydia: "assets/portraits/Lydia.webp",
  many: "assets/portraits/many.webp",
  margaret: "assets/portraits/margaret.webp",
  martin: "assets/portraits/martin.webp",
  maya: "assets/portraits/maya.webp",
  melindo: "assets/portraits/melindo.webp",
  metis: "assets/portraits/metis.webp",
  miguel: "assets/portraits/miguel.webp",
  mizkisha: "assets/portraits/Mizkisha.webp",
  morena: "assets/portraits/morena.webp",
  narciso: "assets/portraits/narciso.webp",
  newt: "assets/portraits/newt.webp",
  omar: "assets/portraits/omar.webp",
  "oscar-mars": "assets/portraits/Oscar-Mars.webp",
  owen: "assets/portraits/Owen.webp",
  pekos: "assets/portraits/pekos.webp",
  princesatuttifrutti: "assets/portraits/PrincesaTuttiFrutti.webp",
  principemedianoche: "assets/portraits/PríncipeMedianoche.webp",
  ras: "assets/portraits/ras.webp",
  ratchet: "assets/portraits/Ratchet.webp",
  ricardo: "assets/portraits/ricardo.webp",
  roderick: "assets/portraits/Roderick.webp",
  searon: "assets/portraits/searon.webp",
  sebastian: "assets/portraits/sebastian.webp",
  seraphine: "assets/portraits/seraphine.webp",
  serena: "assets/portraits/serena.webp",
  seris: "assets/portraits/seris.webp",
  "sir-ed": "assets/portraits/sir-ed.webp",
  "sir-galliard": "assets/portraits/sir-Galliard.webp",
  "sir-gareth": "assets/portraits/Sir-Gareth.webp",
  "sir-kay": "assets/portraits/sir-kay.webp",
  "sir-lancelot": "assets/portraits/sir-lancelot.webp",
  "sir-macrath": "assets/portraits/sir-macrath.webp",
  "sir-tyren": "assets/portraits/Sir-Tyren.webp",
  suleiman: "assets/portraits/Suleiman.webp",
  tanya: "assets/portraits/Tanya.webp",
  tark: "assets/portraits/Tark.webp",
  tsun: "assets/portraits/tsun.webp",
  urls: "assets/portraits/urls.webp",
  vonos: "assets/portraits/voños.webp",
  walter: "assets/portraits/walter.webp",
  "william-j": "assets/portraits/William-J.webp",
  yotta: "assets/portraits/Yotta.webp",
  zoddos: "assets/portraits/Zoddos.webp",
  adom: "assets/portraits/Adom.webp",
  albercho: "assets/portraits/Albercho.webp",
  alejandroiii: "assets/portraits/AlejandroIII.webp",
  annie: "assets/portraits/Annie.webp",
  argos: "assets/portraits/argos.webp",
  arturo: "assets/portraits/Arturo.webp",
  chaja: "assets/portraits/Chaja.webp",
  cornalino: "assets/portraits/Cornalino.webp",
  darkslayer: "assets/portraits/Darkslayer.webp",
  davo: "assets/portraits/Davo.webp",
  "diego-maradona": "assets/portraits/diego-maradona.webp",
  drake: "assets/portraits/Drake.webp",
  dick: "assets/portraits/dick.webp",
  ejemi: "assets/portraits/Ejemi.webp",
  evento: "assets/portraits/evento.webp",
  "femme-noir": "assets/portraits/femme-noir.webp",
  fir: "assets/portraits/fir.webp",
  "fresh-el-fresco": "assets/portraits/fresh-el-fresco.webp",
  "harry-time": "assets/portraits/Harry-Time.webp",
  helios: "assets/portraits/helios.webp",
  hrothgar: "assets/portraits/Hrothgar.webp",
  "homero-delfuturo": "assets/portraits/homero-delfuturo.webp",
  iggy: "assets/portraits/Iggy.webp",
  "ivor-el-pilar": "assets/portraits/Ivor-el-Pilar.webp",
  jeb: "assets/portraits/jeb.webp",
  jerry: "assets/portraits/jerry.webp",
  "jesus-nazaret": "assets/portraits/jesus-nazaret.webp",
  karl: "assets/portraits/Karl.webp",
  kenny: "assets/portraits/kenny.webp",
  koma: "assets/portraits/Koma.webp",
  krog: "assets/portraits/Krog.webp",
  "la-12": "assets/portraits/la-12.webp",
  "lady-jacquelle": "assets/portraits/Lady-Jacquelle.webp",
  leon: "assets/portraits/Leon.webp",
  "lorax-comunista": "assets/portraits/lorax-comunista.webp",
  "luke-robinson": "assets/portraits/luke-robinson.webp",
  mikos: "assets/portraits/mikos.webp",
  mina: "assets/portraits/Mina.webp",
  molusco: "assets/portraits/Molusco.webp",
  noulan: "assets/portraits/Noulan.webp",
  obelisko2: "assets/portraits/Obelisko2.webp",
  "pablo-rodriguez": "assets/portraits/Pablo Rodriguez.webp",
  "padre-misty": "assets/portraits/Padre-Misty.webp",
  "pedro-hijo-jack": "assets/portraits/pedro-hijo-jack.webp",
  "phill-collings": "assets/portraits/phill-collings.webp",
  pocho: "assets/portraits/Pocho.webp",
  "robert-o": "assets/portraits/Robert-O.webp",
  "rita-claus": "assets/portraits/Rita-Claus.webp",
  "roman-riquelme": "assets/portraits/roman-riquelme.webp",
  rubi: "assets/portraits/Rubi.webp",
  "salchicha-ovejero": "assets/portraits/salchicha-ovejero.webp",
  "sir-brayton": "assets/portraits/Sir-Brayton.webp",
  "sir-messi": "assets/portraits/sir-messi.webp",
  "sir-timo": "assets/portraits/sit-timo.webp",
  "sit-timo": "assets/portraits/sit-timo.webp",
  marise: "assets/portraits/marise.webp",
  snaak: "assets/portraits/Snaak.webp",
  sosun: "assets/portraits/SOSUN.webp",
  "star-guardians": "assets/portraits/Star-Guardians.webp",
  sven: "assets/portraits/sven.webp",
  terminator: "assets/portraits/Terminator.webp",
  tian: "assets/portraits/Tian.webp",
  "tincho-carpincho": "assets/portraits/tincho-carpincho.webp",
  torin: "assets/portraits/Torin.webp",
  tyler: "assets/portraits/Tyler.webp",
  vann: "assets/portraits/Vann.webp",
  vulkar: "assets/portraits/Vulkar.webp",
  william: "assets/portraits/William.webp",
  wolfgang: "assets/portraits/Wolfgang.webp",
  wong: "assets/portraits/wong.webp",
  "zero-snake": "assets/portraits/Zero-Snake.webp"
};
const CLASS_ICON_FILES = {
  alchemist: "assets/icons/alchemist.webp",
  artificer: "assets/icons/artificer.webp",
  barbarian: "assets/icons/Barbarian.webp",
  bard: "assets/icons/Bard.webp",
  binder: "assets/icons/Binder.webp",
  "blood-hunter": "assets/icons/Blood_hunter.webp",
  captain: "assets/icons/Captain.webp",
  capitan: "assets/icons/Captain.webp",
  cleric: "assets/icons/Cleric.webp",
  commoner: "assets/icons/Commoner.webp",
  craftsman: "assets/icons/Craftsman.webp",
  druid: "assets/icons/Druid.webp",
  fighter: "assets/icons/Fighter.webp",
  gadgeteer: "assets/icons/Gadgeteer.webp",
  gunslinger: "assets/icons/Gunslinger.webp",
  illrigger: "assets/icons/illrigger.webp",
  investigator: "assets/icons/Investigator.webp",
  magus: "assets/icons/Magus.webp",
  martyr: "assets/icons/Martyr.webp",
  monk: "assets/icons/Monk.webp",
  multiclass: "assets/icons/Multiclass.webp",
  necromancer: "assets/icons/Necromancer.webp",
  paladin: "assets/icons/Paladin.webp",
  psion: "assets/icons/psionico.webp",
  psionico: "assets/icons/psionico.webp",
  ranger: "assets/icons/Ranger.webp",
  rogue: "assets/icons/Rogue.webp",
  "rogue-warlord": "assets/icons/Rogue.webp",
  savant: "assets/icons/Savant.webp",
  shaman: "assets/icons/Shaman.webp",
  sorcerer: "assets/icons/Sorcerer.webp",
  vagabond: "assets/icons/vagabond.webp",
  vessel: "assets/icons/Vessel.webp",
  warden: "assets/icons/Warden.webp",
  warlock: "assets/icons/Warlock.webp",
  warlord: "assets/icons/Warlord.webp",
  warmage: "assets/icons/Warmage.webp",
  witch: "assets/icons/Witch.webp",
  wizard: "assets/icons/Wizard.webp"
};
const audioManager = {
  musicEnabled: true,
  sfxEnabled: true,
  musicVolume: 0.15,
  sfxVolume: 0.25,
  currentMusic: null,
  currentTrackName: "",
  pendingTrackName: "",
  unlocked: false,
  fadeTimer: null,
  sfxCache: new Map(),
  failedAudio: new Set(),
  lastSfxAt: {},
  loadAudioSettings() {
    const storage = getLocalStorageSafe();
    if (!storage) {
      return;
    }

    try {
      const saved = JSON.parse(storage.getItem(AUDIO_STORAGE_KEY) || "{}");
      this.musicEnabled = saved.musicEnabled !== false;
      this.sfxEnabled = saved.sfxEnabled !== false;
      this.musicVolume = clamp(Number(saved.musicVolume ?? this.musicVolume), 0, 1);
      this.sfxVolume = clamp(Number(saved.sfxVolume ?? this.sfxVolume), 0, 1);
    } catch (error) {
      this.musicEnabled = true;
      this.sfxEnabled = true;
    }
  },
  saveAudioSettings() {
    const storage = getLocalStorageSafe();
    if (!storage) {
      return;
    }
    storage.setItem(AUDIO_STORAGE_KEY, JSON.stringify({
      musicEnabled: this.musicEnabled,
      sfxEnabled: this.sfxEnabled,
      musicVolume: this.musicVolume,
      sfxVolume: this.sfxVolume
    }));
  },
  unlock() {
    this.unlocked = true;
    if (this.pendingTrackName && this.musicEnabled) {
      this.fadeMusicTo(this.pendingTrackName);
    }
  },
  canUseAudio() {
    return typeof Audio !== "undefined";
  },
  playMusic(trackName) {
    this.fadeMusicTo(trackName);
  },
  stopMusic() {
    if (this.fadeTimer) {
      window.clearInterval(this.fadeTimer);
      this.fadeTimer = null;
    }
    if (this.currentMusic) {
      try {
        this.currentMusic.pause();
        this.currentMusic.currentTime = 0;
      } catch (error) {
        // Ignore browsers that reject direct media control.
      }
    }
    this.currentMusic = null;
    this.currentTrackName = "";
  },
  fadeMusicTo(trackName) {
    const path = this.resolveMusicPath(trackName);
    if (!path) {
      return;
    }
    this.pendingTrackName = trackName;
    if (!this.musicEnabled) {
      this.stopMusic();
      return;
    }
    if (!this.unlocked || !this.canUseAudio() || this.failedAudio.has(path)) {
      return;
    }
    if (this.currentTrackName === trackName && this.currentMusic) {
      this.currentMusic.volume = this.musicVolume;
      return;
    }

    const nextMusic = this.createAudio(path, { loop: this.shouldLoopMusic(trackName) });
    if (!nextMusic) {
      return;
    }

    const previousMusic = this.currentMusic;
    const previousTrackName = this.currentTrackName;
    this.currentMusic = nextMusic;
    this.currentTrackName = trackName;
    nextMusic.volume = 0;

    const restorePreviousMusic = () => {
      this.failedAudio.add(path);
      try {
        nextMusic.pause();
        nextMusic.currentTime = 0;
      } catch (error) {
        // Ignore media nodes that never started.
      }
      if (this.currentMusic === nextMusic) {
        this.currentMusic = previousMusic || null;
        this.currentTrackName = previousMusic ? previousTrackName : "";
      }
    };

    try {
      const playPromise = nextMusic.play();
      if (playPromise?.then) {
        playPromise
          .then(() => {
            if (this.currentMusic !== nextMusic) {
              try {
                nextMusic.pause();
                nextMusic.currentTime = 0;
              } catch (error) {
                // Ignore tracks superseded before the browser started them.
              }
              return;
            }
            this.crossfade(previousMusic, nextMusic);
          })
          .catch(restorePreviousMusic);
      } else {
        this.crossfade(previousMusic, nextMusic);
      }
    } catch (error) {
      restorePreviousMusic();
    }
  },
  crossfade(previousMusic, nextMusic) {
    if (this.fadeTimer) {
      window.clearInterval(this.fadeTimer);
      this.fadeTimer = null;
    }

    const steps = 18;
    let step = 0;
    const previousStartVolume = previousMusic ? Number(previousMusic.volume || 0) : 0;
    this.fadeTimer = window.setInterval(() => {
      step += 1;
      const ratio = Math.min(1, step / steps);
      if (previousMusic) {
        previousMusic.volume = Math.max(0, previousStartVolume * (1 - ratio));
      }
      nextMusic.volume = this.musicVolume * ratio;

      if (ratio >= 1) {
        window.clearInterval(this.fadeTimer);
        this.fadeTimer = null;
        if (previousMusic) {
          try {
            previousMusic.pause();
            previousMusic.currentTime = 0;
          } catch (error) {
            // Ignore stale media nodes.
          }
        }
      }
    }, 45);
  },
  playSfx(sfxName) {
    const path = this.resolveSfxPath(sfxName);
    if (!path || !this.sfxEnabled || !this.unlocked || !this.canUseAudio() || this.failedAudio.has(path)) {
      return;
    }

    const now = Date.now();
    const cooldown = this.getSfxCooldown(sfxName);
    if (now - (this.lastSfxAt[sfxName] || 0) < cooldown) {
      return;
    }
    this.lastSfxAt[sfxName] = now;

    const baseAudio = this.getSfxAudio(path);
    if (!baseAudio) {
      return;
    }

    const sound = baseAudio.paused ? baseAudio : baseAudio.cloneNode(true);
    sound.volume = this.sfxVolume;
    try {
      sound.currentTime = 0;
      const playPromise = sound.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {});
      }
    } catch (error) {
      this.failedAudio.add(path);
    }
  },
  setMusicEnabled(value) {
    this.musicEnabled = Boolean(value);
    this.saveAudioSettings();
    if (this.musicEnabled) {
      this.unlock();
    } else {
      this.stopMusic();
    }
  },
  setSfxEnabled(value) {
    this.sfxEnabled = Boolean(value);
    this.saveAudioSettings();
  },
  setMusicVolume(value) {
    this.musicVolume = clamp(Number(value), 0, 1);
    if (this.currentMusic) {
      this.currentMusic.volume = this.musicVolume;
    }
    this.saveAudioSettings();
  },
  setSfxVolume(value) {
    this.sfxVolume = clamp(Number(value), 0, 1);
    this.saveAudioSettings();
  },
  resolveMusicPath(trackName) {
    return MUSIC_TRACKS[trackName] || MUSIC_TRACKS[normalizeLookupText(trackName)] || "";
  },
  resolveSfxPath(sfxName) {
    return SFX_TRACKS[sfxName] || SFX_TRACKS[normalizeLookupText(sfxName)] || "";
  },
  createAudio(path, options = {}) {
    if (!this.canUseAudio() || this.failedAudio.has(path)) {
      return null;
    }

    try {
      const audio = new Audio(path);
      audio.preload = "none";
      audio.loop = Boolean(options.loop);
      audio.addEventListener("error", () => {
        this.failedAudio.add(path);
      }, { once: true });
      return audio;
    } catch (error) {
      this.failedAudio.add(path);
      return null;
    }
  },
  getSfxAudio(path) {
    if (this.sfxCache.has(path)) {
      return this.sfxCache.get(path);
    }
    const audio = this.createAudio(path);
    if (audio) {
      this.sfxCache.set(path, audio);
    }
    return audio;
  },
  getSfxCooldown(sfxName) {
    const cooldowns = {
      rouletteTick: 70,
      achievementUnlock: 350
    };
    return cooldowns[sfxName] || 90;
  },
  shouldLoopMusic(trackName) {
    return !["victory", "defeat"].includes(trackName);
  }
};

let audioFeedbackBound = false;

const ADVENTURE_MAP_POINTS = [
  { x: 9, y: 62 },
  { x: 22, y: 32 },
  { x: 36, y: 54 },
  { x: 50, y: 30 },
  { x: 64, y: 60 },
  { x: 79, y: 38 },
  { x: 92, y: 56 }
];

const SPECIAL_AFFILIATIONS = [
  {
    specialId: "mikos",
    label: "Fighter Party",
    partyIds: ["Fighter-Party"],
    chance: 0.4,
    bonus: 8,
    text: "{special} reconoce las viejas tecnicas contra Dracos de Fighter Party y refuerza a {target} antes de {phase}."
  },
  {
    specialId: "Fahona",
    label: "Fighter Party",
    partyIds: ["Fighter-Party"],
    chance: 0.28,
    bonus: 7,
    text: "{special} sigue rastros de Fighter Party, llama a su companero animal y cubre a {target} durante la ruta."
  },
  {
    specialId: "Padre-Misty",
    label: "Auk Eman",
    partyIds: ["Auk-Eman"],
    chance: 0.38,
    bonus: 7,
    text: "{special} aparece por los contactos de Auk Eman y convierte una charla imposible en ventaja para {target}."
  },
  {
    specialId: "Arturo",
    label: "los Doce Caballeros",
    partyIds: ["Caballeros1", "Caballeros2", "Caballeros3"],
    chance: 0.3,
    bonus: 10,
    text: "{special} ve caballeros en la ruta y levanta un juramento que fortalece a {target}."
  },
  {
    specialId: "Ivor-el-Pilar",
    label: "los Doce Caballeros",
    partyIds: ["Caballeros1", "Caballeros2", "Caballeros3"],
    chance: 0.26,
    bonus: 9,
    text: "{special} deja de ayudar al enemigo y sostiene a {target} con una plegaria pesada."
  },
  {
    specialId: "jhon-cross",
    label: "los Doce Caballeros",
    partyIds: ["Caballeros1", "Caballeros2", "Caballeros3"],
    chance: 0.24,
    bonus: 9,
    text: "{special} vuelve del infierno siguiendo rastros caballerescos y prepara a {target} para sobrevivir."
  },
  {
    specialId: "AlejandroIII",
    label: "los Doce Caballeros",
    partyIds: ["Caballeros1", "Caballeros2", "Caballeros3"],
    chance: 0.24,
    bonus: 10,
    text: "{special} reconoce la sangre de los Eternos y ordena a {target} pelear con autoridad."
  },
  {
    specialId: "Albercho",
    label: "los Doce Caballeros",
    partyIds: ["Caballeros1", "Caballeros2", "Caballeros3"],
    chance: 0.18,
    bonus: 12,
    text: "{special} aparece cuando los Doce Caballeros pesan en la historia y protege a {target} con un juramento sagrado."
  },
  {
    specialId: "star-guardians-lol",
    label: "los Doce Caballeros",
    partyIds: ["Caballeros1", "Caballeros2", "Caballeros3"],
    chance: 0.22,
    bonus: 8,
    text: "{special} cae como una luz absurda sobre la orden caballeresca y bendice a {target}."
  },
  {
    specialId: "femme-noir",
    label: "Heroes Perdidos",
    partyIds: ["HeroesPerdidos1", "HeroesPerdidos2", "HeroesPerdidos3", "HeroesPerdidos4"],
    chance: 0.34,
    bonus: 8,
    text: "{special} aparece desde una organizacion oscura de Heroes Perdidos y le enseña a {target} a no confiar en nadie."
  },
  {
    specialId: "molusco",
    label: "Atlas Dynamite",
    characterIds: ["Atlas"],
    chance: 0.55,
    bonus: 10,
    text: "{special} reconoce a Atlas Dynamite y se suma por amistad; {target} aprovecha el impulso del reencuentro."
  },
  {
    specialId: "SOSUN",
    label: "Molusco o Catrina",
    characterIds: ["molusco", "Catrina"],
    chance: 0.32,
    bonus: 8,
    text: "{special} sigue el rastro de Molusco y Catrina, aparece entre sombras y mejora la posicion de {target}."
  },
  {
    specialId: "Dynamo",
    label: "Molusco o Catrina",
    characterIds: ["molusco", "Catrina"],
    chance: 0.32,
    bonus: 8,
    text: "{special} detecta una herencia magica cerca de Molusco y Catrina y carga de energia a {target}."
  },
  {
    specialId: "homero-delfuturo",
    label: "Destiny Party",
    partyIds: ["Destiny1", "Destiny2"],
    chance: 0.3,
    bonus: 9,
    text: "{special} llega desde un futuro imposible de Destiny Party y le muestra a {target} una forma nueva de hacer magia."
  },
  {
    specialId: "lorkan",
    label: "Destiny Party",
    partyIds: ["Destiny1", "Destiny2"],
    chance: 0.3,
    bonus: 8,
    text: "{special} reconoce un hilo de Destiny Party y comparte trucos de supervivencia con {target}."
  },
  {
    specialId: "fresh-el-fresco",
    label: "Fumancheros",
    groupIds: ["fumancheros"],
    chance: 0.34,
    bonus: 7,
    text: "{special} siente el humo narrativo de los Fumancheros y aparece para ponerle estilo a {target}."
  },
  {
    specialId: "lorax-comunista",
    label: "No tengo enemigos",
    groupIds: ["no-tengo-enemigos"],
    chance: 0.32,
    bonus: 8,
    text: "{special} detecta una party que insiste en no tener enemigos y organiza a {target} con naturaleza y sindicalismo."
  },
  {
    specialId: "phill-collings",
    label: "Sebastian",
    characterIds: ["Sebastian"],
    chance: 0.35,
    bonus: 8,
    text: "{special} escucha a Sebastian avanzar y entra con un grito de Tarzan que envalentona a {target}."
  },
  {
    specialId: "luke-robinson",
    label: "New Age Party",
    partyIds: ["New-Age-Party", "NewAgeParty", "New-Age", "NewAge"],
    chance: 0.36,
    bonus: 9,
    text: "{special} cruza desde los sueños de New Age Party y le enseña a {target} a leer el combate dormido."
  },
  {
    specialId: "terminator",
    label: "Robots",
    groupIds: ["robots"],
    chance: 0.34,
    bonus: 9,
    text: "{special} identifica firmas de robots en la party y optimiza el equipo de {target}."
  },
  {
    specialId: "roman-riquelme",
    label: "Tracendencia",
    partyIds: ["Tracendencia", "Tracendencia2"],
    chance: 0.32,
    bonus: 8,
    text: "{special} pisa la ruta de Tracendencia como si fuera la Bombonera y le da pausa a {target}."
  },
  {
    specialId: "tincho-carpincho",
    label: "Tracendencia",
    partyIds: ["Tracendencia", "Tracendencia2"],
    chance: 0.3,
    bonus: 7,
    text: "{special} aparece por la vibra de Tracendencia y le enseña a {target} a aguantar con maldicion pale moon."
  },
  {
    specialId: "la-12",
    label: "Tracendencia",
    partyIds: ["Tracendencia", "Tracendencia2"],
    chance: 0.3,
    bonus: 7,
    text: "{special} canta desde la ruta de Tracendencia y levanta la moral de {target}."
  },
  {
    specialId: "diego-maradona",
    label: "Tracendencia",
    partyIds: ["Tracendencia", "Tracendencia2"],
    chance: 0.24,
    bonus: 10,
    text: "{special} aparece donde Tracendencia necesita una jugada imposible y bendice a {target}."
  },
  {
    specialId: "pedro-hijo-jack",
    label: "Luke, Phil o Terminator",
    characterIds: ["luke-robinson", "phill-collings", "terminator"],
    chance: 0.35,
    bonus: 8,
    text: "{special} viaja en el tiempo siguiendo a Luke, Phil o Terminator y deja a {target} listo para actuar primero."
  },
  {
    specialId: "jesus-nazaret",
    label: "Pedro hijo Jack",
    characterIds: ["pedro-hijo-jack"],
    chance: 0.26,
    bonus: 10,
    text: "{special} aparece porque Pedro hijo Jack altero demasiado el tiempo y cubre a {target} con una bendicion real."
  },
  {
    specialId: "rita-claus",
    label: "Pedro hijo Jack",
    characterIds: ["pedro-hijo-jack"],
    chance: 0.3,
    bonus: 8,
    text: "{special} sigue la estela temporal de Pedro hijo Jack y deja un regalo tactico para {target}."
  },
  {
    specialId: "Amari",
    label: "Odiados",
    groupIds: ["odiados"],
    chance: 0.34,
    bonus: 8,
    text: "{special} reconoce una party suficientemente odiada como para experimentar y mejora a {target} con mutagenos."
  },
  {
    specialId: "Dick",
    label: "Vaqueros",
    groupIds: ["vaqueros"],
    chance: 0.34,
    bonus: 8,
    text: "{special} huele peligro vaquero y patrocina a {target} con equipo mejorado."
  },
  {
    specialId: "Robert-O",
    label: "Vaqueros",
    groupIds: ["vaqueros"],
    chance: 0.24,
    bonus: 7,
    text: "{special} aparece entre vaqueros con una identidad demasiado convincente y deja a {target} mejor preparado."
  },
  {
    specialId: "Marise",
    label: "Vaqueros",
    groupIds: ["vaqueros"],
    chance: 0.28,
    bonus: 8,
    text: "{special} dobla unos segundos de la ruta vaquera y le deja a {target} una ventana perfecta para actuar."
  },
  {
    specialId: "pablo-rodriguez",
    label: "cualquier party",
    alwaysEligible: true,
    chance: 0.16,
    bonus: 9,
    text: "{special} es famoso en demasiadas rutas, aparece con su canon de gemas y ayuda a {target}."
  }
];

const PLAYER_COLLECTION_REWARDS = [
  {
    id: "bagre",
    playerName: "Bagre",
    portrait: "assets/portraits/Bagre.webp",
    requiredIds: ["Chris", "Beyond", "Miguel", "Ricardo", "Seraphine", "Sven", "Snaak"]
  },
  {
    id: "maqui",
    playerName: "Maqui",
    portrait: "assets/portraits/Maqui.webp",
    requiredIds: ["Albercho", "Tark", "Suleiman", "Fenris", "Karl"]
  },
  {
    id: "ivo",
    playerName: "Ivo",
    portrait: "assets/portraits/Ivo.webp",
    requiredIds: ["Lex", "Lito", "Krog", "Elpadre", "Sir-Gareth", "Sebastian"]
  },
  {
    id: "juan",
    playerName: "Juan",
    portrait: "assets/portraits/Juan.webp",
    requiredIds: ["Eliana", "Annabella", "Giovanni", "Sir-Kay", "Deluxo", "Colt"]
  },
  {
    id: "marco",
    playerName: "Marco",
    portrait: "assets/portraits/Marco.webp",
    requiredIds: ["Newt", "Sir-Ed", "Dion", "Lady-Ginebra", "Billy", "Katriona"]
  },
  {
    id: "dana",
    playerName: "Dana",
    portrait: "assets/portraits/Dana.webp",
    requiredIds: ["PrincesaTuttiFrutti", "Amari", "Alan", "Betty", "Aldora", "PrincipeMedianoche", "Bobby"]
  },
  {
    id: "facu",
    playerName: "Facu",
    portrait: "assets/portraits/Facu.webp",
    requiredIds: ["Tanya", "Fahona", "Argos", "Adom", "Darkslayer", "Brittany", "Harry-Time", "Chaja"]
  },
  {
    id: "dany",
    playerName: "Dany",
    portrait: "assets/portraits/Dany.webp",
    requiredIds: ["Tian", "Walter", "Vulkar", "Rubi", "Tsun", "Urls"]
  },
  {
    id: "sofi",
    playerName: "Sofi",
    portrait: "assets/portraits/Sofi.webp",
    requiredIds: ["William", "Mina", "Robert-O"]
  },
  {
    id: "marco-messi",
    playerName: "MarcoMessi",
    portrait: "assets/portraits/MarcoMessi.webp",
    requiredIds: ["Kenny", "Sir-Messi", "Pocho", "Fir", "Sir-Timo", "Pekos", "Jerry"]
  },
  {
    id: "gaby",
    playerName: "Gaby",
    portrait: "assets/portraits/Gaby.webp",
    requiredIds: ["Martin", "Cornalino", "Marise", "Brandon", "Sir-Galiard", "Lady-Jaqueline", "Davo", "Jeb"]
  }
];

const COLLECTION_REQUIREMENT_ALIASES = {
  alan: "Allan",
  elpadre: "ElPadre",
  "sir-galiard": "Sir-Galliard",
  "lady-jaqueline": "Lady-Jacquelle"
};

function renderStart() {
  clearRouletteTimer();
  clearCombatTimer();
  audioManager.fadeMusicTo("menu");
  state.screen = "start";
  app.innerHTML = `
    <section class="screen hero">
      <div class="hero-copy">
        <span class="eyebrow">Draft + aventura por caminos</span>
        <h1>D&amp;D Party Clash</h1>
        <p class="lead">Elige hasta cinco aventureros desde partys rivales, asigna los roles que quieras y decide entre dos rutas en un viaje de siete combates, eventos y mejoras.</p>
      </div>
      <form class="setup-panel" data-setup>
        <div class="form-field" data-solo-party-field>
          <label for="party-name">Nombre de party</label>
          <input id="party-name" name="party-name" type="text" maxlength="36" value="${escapeHtml(state.partyName)}" autocomplete="off">
        </div>
        <div class="form-field">
          <span class="field-label">Informacion</span>
          <div class="segmented-control">
            <label>
              <input type="radio" name="role-mode" value="visible" ${state.showRoleHints ? "checked" : ""}>
              <span>Roles visibles</span>
            </label>
            <label>
              <input type="radio" name="role-mode" value="hard" ${state.showRoleHints ? "" : "checked"}>
              <span>Modo dificil</span>
            </label>
          </div>
        </div>
        <div class="form-field">
          <span class="field-label">Jugadores</span>
          <div class="segmented-control">
            <label>
              <input type="radio" name="player-mode" value="solo" ${state.isLocalCoop ? "" : "checked"}>
              <span>Solo</span>
            </label>
            <label>
              <input type="radio" name="player-mode" value="coop" ${state.isLocalCoop ? "checked" : ""}>
              <span>Versus local</span>
            </label>
          </div>
        </div>
        <div class="coop-fields" data-coop-fields ${state.isLocalCoop ? "" : "hidden"}>
          <div class="form-field">
            <label for="player-one">Jugador 1</label>
            <input id="player-one" name="player-one" type="text" maxlength="24" value="${escapeHtml(state.playerNames[0])}" autocomplete="off">
          </div>
          <div class="form-field">
            <label for="party-one">Party jugador 1</label>
            <input id="party-one" name="party-one" type="text" maxlength="36" value="${escapeHtml(state.coopPartyNames[0])}" autocomplete="off">
          </div>
          <div class="form-field">
            <label for="player-two">Jugador 2</label>
            <input id="player-two" name="player-two" type="text" maxlength="24" value="${escapeHtml(state.playerNames[1])}" autocomplete="off">
          </div>
          <div class="form-field">
            <label for="party-two">Party jugador 2</label>
            <input id="party-two" name="party-two" type="text" maxlength="36" value="${escapeHtml(state.coopPartyNames[1])}" autocomplete="off">
          </div>
        </div>
        <button type="submit">Iniciar Aventura</button>
        <button type="button" class="ghost-button" data-action="gallery">Galeria</button>
        <button type="button" class="ghost-button" data-action="trophies">Ver trofeos</button>
        ${renderAudioSettings()}
      </form>
    </section>
  `;
  app.querySelector("[data-setup]").addEventListener("submit", startDraft);
  app.querySelector("[data-action='gallery']").addEventListener("click", openImageGallery);
  app.querySelector("[data-action='trophies']").addEventListener("click", openTrophyCollection);
  app.querySelectorAll("input[name='player-mode']").forEach((input) => {
    input.addEventListener("change", updateStartCoopFields);
  });
  bindAudioControls(app);
  updateStartCoopFields();
}

function updateStartCoopFields() {
  const fields = app.querySelector("[data-coop-fields]");
  const soloPartyField = app.querySelector("[data-solo-party-field]");
  const coopSelected = app.querySelector("input[name='player-mode']:checked")?.value === "coop";

  if (fields) {
    fields.hidden = !coopSelected;
  }
  if (soloPartyField) {
    soloPartyField.hidden = coopSelected;
  }
}

function startDraft(event) {
  event?.preventDefault();
  audioManager.unlock();
  audioManager.fadeMusicTo("draft");
  applyStartSettings();
  clearRouletteTimer();
  clearCombatTimer();
  state.coopRuns = [];
  state.coopFinal = null;
  state.activeCoopPlayerIndex = 0;
  if (state.isLocalCoop) {
    state.partyName = getCurrentCoopPartyName();
  }
  resetDraftState();
  startPartyRoulette();
}

function resetDraftState() {
  state.draftedCharacters = [];
  state.draftPickOwners = {};
  state.assignments = {};
  state.tournament = null;
  state.seenSpecialCharacterIds = [];
  state.currentDraftParty = null;
  state.currentDraftCharacters = [];
  state.pendingDraftParty = null;
}

function confirmRestartGame() {
  const confirmed = typeof window === "undefined" || typeof window.confirm !== "function"
    ? true
    : window.confirm("seguro quieres reiniciar?");

  if (confirmed) {
    renderStart();
  }
}

function applyStartSettings() {
  const partyName = app.querySelector("#party-name")?.value;
  const roleMode = app.querySelector("input[name='role-mode']:checked")?.value || "visible";
  const playerMode = app.querySelector("input[name='player-mode']:checked")?.value || "solo";
  const playerOne = app.querySelector("#player-one")?.value;
  const playerTwo = app.querySelector("#player-two")?.value;
  const partyOne = app.querySelector("#party-one")?.value;
  const partyTwo = app.querySelector("#party-two")?.value;

  state.partyName = cleanDisplayName(partyName, "Tu Party");
  state.showRoleHints = roleMode === "visible";
  state.isLocalCoop = playerMode === "coop";
  state.playerNames = [
    cleanDisplayName(playerOne, "Jugador 1"),
    cleanDisplayName(playerTwo, "Jugador 2")
  ];
  state.coopPartyNames = [
    cleanDisplayName(partyOne, `${state.playerNames[0]} Party`),
    cleanDisplayName(partyTwo, `${state.playerNames[1]} Party`)
  ];
}

function openTrophyCollection() {
  const currentScreen = state.screen || "start";
  state.trophyReturnScreen = currentScreen === "trophies"
    ? state.trophyReturnScreen || "start"
    : currentScreen;
  renderTrophyCollection();
}

function returnFromTrophyCollection() {
  const target = state.trophyReturnScreen || "start";

  if (target === "tournament" && state.tournament) {
    renderTournament({ preserveScroll: true });
    return;
  }
  if (target === "adventure-party" && state.tournament) {
    renderAdventurePartyEditor();
    return;
  }
  if (target === "formation") {
    renderFormation();
    return;
  }
  if (target === "coop-results") {
    renderCoopVersusResults();
    return;
  }
  if (target === "coop-final" && state.coopFinal) {
    renderCoopFinalResult();
    return;
  }

  renderStart();
}

function renderTrophyCollection() {
  clearRouletteTimer();
  clearCombatTimer();
  audioManager.fadeMusicTo("menu");
  state.screen = "trophies";
  checkGalleryCollectionRewards({ partyName: "Galeria" });
  const trophies = getTrophyDefinitions();
  const trophyState = loadTrophyState();
  const unlockedIds = new Set(Object.keys(trophyState.unlocked || {}));
  const unlockedCount = trophies.filter((trophy) => unlockedIds.has(trophy.id)).length;
  const totalCount = trophies.length;
  const byCategory = groupTrophiesByCategory(trophies);

  app.innerHTML = `
    <section class="screen">
      <header class="screen-header">
        <div>
          <span class="status-pill">Coleccion</span>
          <h2>Trofeos</h2>
          <p class="lead">Completa viajes con sinergias activas y personajes de distintas partys para llenar la coleccion.</p>
        </div>
        <div class="toolbar">
          <button class="ghost-button" data-action="back-start">Volver</button>
          <button class="ghost-button" data-action="gallery">Galeria</button>
          <button class="ghost-button" data-action="reset-trophies">Reiniciar trofeos</button>
          ${renderAudioSettings("compact")}
        </div>
      </header>
      <div class="trophy-summary">
        <div class="score-tile cr-total">
          <span>Progreso</span>
          <strong>${unlockedCount}/${totalCount}</strong>
        </div>
        <div class="score-tile">
          <span>Sinergias</span>
          <strong>${getUnlockedCategoryCount("synergy", trophies, unlockedIds)}</strong>
        </div>
        <div class="score-tile">
          <span>Partys</span>
          <strong>${getUnlockedCategoryCount("party", trophies, unlockedIds)}</strong>
        </div>
        <div class="score-tile">
          <span>Colecciones</span>
          <strong>${getUnlockedCategoryCount("collection", trophies, unlockedIds)}</strong>
        </div>
      </div>
      ${Object.entries(byCategory).map(([category, entries]) => `
        <section class="panel trophy-section">
          <h3>${escapeHtml(getTrophyCategoryLabel(category))}</h3>
          <div class="trophy-grid">
            ${entries.map((trophy) => renderTrophyCard(trophy, trophyState.unlocked?.[trophy.id])).join("")}
          </div>
        </section>
      `).join("")}
    </section>
  `;

  app.querySelector("[data-action='back-start']").addEventListener("click", returnFromTrophyCollection);
  app.querySelector("[data-action='gallery']").addEventListener("click", openImageGallery);
  app.querySelector("[data-action='reset-trophies']").addEventListener("click", () => {
    resetTrophyState();
    renderTrophyCollection();
  });
  app.querySelectorAll("[data-trophy-gallery]").forEach((card) => {
    card.addEventListener("click", () => {
      state.gallerySelectedId = card.dataset.trophyGallery;
      openImageGallery();
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        state.gallerySelectedId = card.dataset.trophyGallery;
        openImageGallery();
      }
    });
  });
  bindAudioControls(app);
}

function renderTrophyCard(trophy, unlockInfo) {
  const unlocked = Boolean(unlockInfo);
  const galleryRewardAttr = unlocked && trophy.galleryRewardId
    ? `data-trophy-gallery="${escapeHtml(trophy.galleryRewardId)}" role="button" tabindex="0" aria-label="Abrir imagen de ${escapeHtml(trophy.name)}"`
    : "";
  return `
    <article class="trophy-card ${unlocked ? "unlocked" : "locked"} ${trophy.galleryRewardId ? "gallery-trophy" : ""}" ${galleryRewardAttr}>
      <div class="trophy-icon">${unlocked ? "T" : "?"}</div>
      <div>
        <span class="meta-label">${escapeHtml(trophy.categoryLabel)}</span>
        <h4>${escapeHtml(trophy.name)}</h4>
        <p>${escapeHtml(trophy.description)}</p>
        ${unlocked ? `<small>Ganado con ${escapeHtml(unlockInfo.partyName || "una party")} ${unlockInfo.playerName ? `por ${escapeHtml(unlockInfo.playerName)}` : ""}</small>` : `<small>Bloqueado</small>`}
        ${unlocked && trophy.galleryRewardId ? `<small class="trophy-gallery-hint">Click para ver la imagen en galeria</small>` : ""}
      </div>
    </article>
  `;
}

function groupTrophiesByCategory(trophies) {
  return trophies.reduce((groups, trophy) => {
    groups[trophy.category] = groups[trophy.category] || [];
    groups[trophy.category].push(trophy);
    return groups;
  }, {});
}

function getTrophyCategoryLabel(category) {
  const labels = {
    milestone: "Hitos",
    synergy: "Sinergias",
    party: "Partys",
    collection: "Colecciones especiales"
  };
  return labels[category] || category;
}

function getUnlockedCategoryCount(category, trophies, unlockedIds) {
  const categoryTrophies = trophies.filter((trophy) => trophy.category === category);
  const unlocked = categoryTrophies.filter((trophy) => unlockedIds.has(trophy.id)).length;
  return `${unlocked}/${categoryTrophies.length}`;
}

function getTrophyDefinitions() {
  const specialGroups = typeof globalThis !== "undefined" && Array.isArray(globalThis.SPECIAL_GROUPS)
    ? globalThis.SPECIAL_GROUPS
    : [];
  const milestoneTrophies = [
    {
      id: "first-win",
      category: "milestone",
      categoryLabel: "Hito",
      name: "Primera expedicion",
      description: "Completa una aventura de 7 combates por primera vez."
    },
    {
      id: "all-synergies",
      category: "milestone",
      categoryLabel: "Hito",
      name: "Coleccionista de sinergias",
      description: "Desbloquea todos los trofeos de sinergia."
    },
    {
      id: "all-parties",
      category: "milestone",
      categoryLabel: "Hito",
      name: "Archivista de campanas",
      description: "Gana usando al menos un personaje activo de cada party del dataset."
    },
    {
      id: "local-champion",
      category: "milestone",
      categoryLabel: "Hito",
      name: "Campeon local",
      description: "Gana una final local entre dos jugadores."
    }
  ];
  const synergyTrophies = specialGroups.map((group) => ({
    id: `synergy-${group.id}`,
    category: "synergy",
    categoryLabel: "Sinergia",
    name: group.name,
    description: `Completa una aventura con la sinergia ${group.name} activa.`
  }));
  const partyTrophies = DND_PARTIES.map((party) => ({
    id: `party-${party.id}`,
    category: "party",
    categoryLabel: "Party",
    name: party.name,
    description: `Completa una aventura usando al menos un personaje activo de ${party.name}.`
  }));
  const collectionTrophies = PLAYER_COLLECTION_REWARDS.map((reward) => ({
    id: getCollectionRewardTrophyId(reward),
    category: "collection",
    categoryLabel: "Coleccion",
    name: reward.playerName,
    galleryRewardId: reward.id,
    description: `???`
  }));

  return [...milestoneTrophies, ...synergyTrophies, ...partyTrophies, ...collectionTrophies];
}

function loadTrophyState() {
  const storage = getLocalStorageSafe();
  if (!storage) {
    return { unlocked: {} };
  }

  try {
    const parsed = JSON.parse(storage.getItem(TROPHY_STORAGE_KEY) || "{}");
    return {
      unlocked: parsed && typeof parsed.unlocked === "object" ? parsed.unlocked : {}
    };
  } catch (error) {
    return { unlocked: {} };
  }
}

function saveTrophyState(trophyState) {
  const storage = getLocalStorageSafe();
  if (!storage) {
    return;
  }
  storage.setItem(TROPHY_STORAGE_KEY, JSON.stringify({
    unlocked: trophyState.unlocked || {}
  }));
}

function resetTrophyState() {
  const storage = getLocalStorageSafe();
  if (!storage) {
    return;
  }
  const confirmed = typeof window === "undefined" || !window.confirm
    ? true
    : window.confirm("Seguro que quieres reiniciar todos los trofeos?");
  if (confirmed) {
    storage.removeItem(TROPHY_STORAGE_KEY);
  }
}

function loadGalleryState() {
  const storage = getLocalStorageSafe();
  if (!storage) {
    return { unlocked: {} };
  }

  try {
    const parsed = JSON.parse(storage.getItem(GALLERY_STORAGE_KEY) || "{}");
    return {
      unlocked: parsed && typeof parsed.unlocked === "object" ? parsed.unlocked : {}
    };
  } catch (error) {
    return { unlocked: {} };
  }
}

function saveGalleryState(galleryState) {
  const storage = getLocalStorageSafe();
  if (!storage) {
    return;
  }
  storage.setItem(GALLERY_STORAGE_KEY, JSON.stringify({
    unlocked: galleryState.unlocked || {}
  }));
}

function resetGalleryState() {
  const storage = getLocalStorageSafe();
  if (!storage) {
    return;
  }
  const confirmed = typeof window === "undefined" || !window.confirm
    ? true
    : window.confirm("Seguro que quieres reiniciar la galeria de retratos?");
  if (confirmed) {
    storage.removeItem(GALLERY_STORAGE_KEY);
    state.gallerySelectedId = "";
  }
}

function getGalleryCharacterKey(character) {
  return getClassThemeSlug(character?.id || character?.name || "unknown");
}

function getCollectionRequirementKey(value) {
  const slug = getClassThemeSlug(value);
  return getClassThemeSlug(COLLECTION_REQUIREMENT_ALIASES[slug] || value);
}

function getCollectionRewardTrophyId(reward) {
  return `collection-${reward.id}`;
}

function formatCollectionRequirementNames(requiredIds = []) {
  return requiredIds.join(", ");
}

function getGalleryUnlockContext(source = "Galeria") {
  const team = state.tournament?.playerTeam || {};
  return {
    partyName: team.name || state.partyName || source,
    playerName: state.tournament?.coopPlayerName || team.ownerName || "",
    score: team.score?.finalScore || 0
  };
}

function checkGalleryCollectionRewards(context = {}) {
  const galleryState = loadGalleryState();
  const unlockedKeys = new Set(Object.keys(galleryState.unlocked || {}).map((key) => getClassThemeSlug(key)));
  const unlocked = [];

  PLAYER_COLLECTION_REWARDS.forEach((reward) => {
    const complete = (reward.requiredIds || [])
      .map(getCollectionRequirementKey)
      .every((key) => unlockedKeys.has(key));

    if (!complete) {
      return;
    }

    const trophy = unlockTrophy(getCollectionRewardTrophyId(reward), context);
    if (trophy) {
      unlocked.push(trophy);
    }
  });

  return unlocked;
}

function unlockGalleryPortrait(character, source = "Reclutado") {
  if (!character || !getCharacterPortraitPath(character)) {
    return false;
  }

  const key = getGalleryCharacterKey(character);
  const galleryState = loadGalleryState();
  if (galleryState.unlocked[key]) {
    return false;
  }

  galleryState.unlocked[key] = {
    unlockedAt: new Date().toISOString(),
    name: character.name || "",
    source
  };
  saveGalleryState(galleryState);
  checkGalleryCollectionRewards(getGalleryUnlockContext(source));
  return true;
}

function unlockGalleryPortraits(characters = [], source = "Reclutado") {
  characters.forEach((character) => unlockGalleryPortrait(character, source));
}

function getGalleryEntries() {
  const galleryState = loadGalleryState();
  const trophyState = loadTrophyState();
  const byKey = new Map();

  getAllCharacters().forEach((character) => {
    const portrait = getCharacterPortraitPath(character);
    if (!portrait) {
      return;
    }

    const key = getGalleryCharacterKey(character);
    if (byKey.has(key)) {
      return;
    }

    const party = findPartyForCharacter(character.id);
    byKey.set(key, {
      key,
      character,
      portrait,
      partyName: party?.name || (hasTag(character, "especial") ? "Especial" : "Sin party"),
      unlocked: Boolean(galleryState.unlocked[key]),
      unlockInfo: galleryState.unlocked[key] || null
    });
  });

  getPlayerCollectionRewardEntries(trophyState).forEach((entry) => {
    byKey.set(entry.key, entry);
  });

  return [...byKey.values()].sort((left, right) => {
    const unlockedDiff = Number(right.unlocked) - Number(left.unlocked);
    if (unlockedDiff) {
      return unlockedDiff;
    }
    return String(left.character.name || "").localeCompare(String(right.character.name || ""));
  });
}

function getPlayerCollectionRewardEntries(trophyState = loadTrophyState()) {
  return PLAYER_COLLECTION_REWARDS.map((reward) => {
    const trophyId = getCollectionRewardTrophyId(reward);
    const unlockInfo = trophyState.unlocked?.[trophyId] || null;
    const character = {
      id: reward.id,
      name: reward.playerName,
      className: "Jugador",
      subclass: "Coleccion especial",
      level: "-",
      tags: ["especial"]
    };

    return {
      key: reward.id,
      reward,
      character,
      portrait: reward.portrait,
      partyName: "Trofeo especial",
      unlocked: Boolean(unlockInfo),
      unlockInfo
    };
  });
}

function openImageGallery() {
  state.galleryReturnScreen = state.screen || "start";
  renderImageGallery();
}

function returnFromImageGallery() {
  const target = state.galleryReturnScreen || "start";
  if (target === "tournament" && state.tournament) {
    renderTournament({ preserveScroll: true });
    return;
  }
  if (target === "adventure-party" && state.tournament) {
    renderAdventurePartyEditor();
    return;
  }
  if (target === "formation") {
    renderFormation();
    return;
  }
  if (target === "trophies") {
    renderTrophyCollection();
    return;
  }
  renderStart();
}

function renderImageGallery() {
  clearRouletteTimer();
  clearCombatTimer();
  audioManager.fadeMusicTo("menu");
  state.screen = "gallery";

  const entries = getGalleryEntries();
  const unlockedEntries = entries.filter((entry) => entry.unlocked);
  const selectedEntry = entries.find((entry) => entry.key === state.gallerySelectedId && entry.unlocked)
    || unlockedEntries[0]
    || null;
  if (selectedEntry) {
    state.gallerySelectedId = selectedEntry.key;
  }

  app.innerHTML = `
    <section class="screen">
      <header class="screen-header">
        <div>
          <span class="status-pill">Coleccion</span>
          <h2>Galeria de retratos</h2>
          <p class="lead">Los retratos se desbloquean cuando reclutas personajes. Los bloqueados quedan como siluetas hasta que pasen por tu party.</p>
        </div>
        <div class="toolbar">
          <button class="ghost-button" data-action="gallery-back">Volver</button>
          <button class="ghost-button" data-action="reset-gallery">Reiniciar galeria</button>
          ${renderAudioSettings("compact")}
        </div>
      </header>
      <div class="gallery-summary">
        <div class="score-tile cr-total">
          <span>Retratos</span>
          <strong>${unlockedEntries.length}/${entries.length}</strong>
        </div>
        <div class="score-tile">
          <span>Con foto lista</span>
          <strong>${entries.length}</strong>
        </div>
        <div class="score-tile">
          <span>Por descubrir</span>
          <strong>${Math.max(0, entries.length - unlockedEntries.length)}</strong>
        </div>
      </div>
      <div class="gallery-layout">
        <section class="panel gallery-list-panel">
          <h3>Retratos disponibles</h3>
          <div class="gallery-grid">
            ${entries.map((entry) => renderGalleryCard(entry, selectedEntry?.key)).join("")}
          </div>
        </section>
        ${renderGalleryViewer(selectedEntry)}
      </div>
    </section>
  `;

  app.querySelector("[data-action='gallery-back']").addEventListener("click", returnFromImageGallery);
  app.querySelector("[data-action='reset-gallery']").addEventListener("click", () => {
    resetGalleryState();
    renderImageGallery();
  });
  app.querySelectorAll("[data-gallery-select]").forEach((button) => {
    button.addEventListener("click", () => {
      state.gallerySelectedId = button.dataset.gallerySelect;
      renderImageGallery();
    });
  });
  bindAudioControls(app);
}

function renderGalleryCard(entry, selectedKey) {
  const character = entry.character;
  const visualTheme = getCharacterVisualTheme(character);
  const active = entry.key === selectedKey;
  const locked = !entry.unlocked;
  const isReward = Boolean(entry.reward);
  const title = isReward ? entry.reward.playerName : character.name;
  const unlockedSubtitle = isReward
    ? "Jugador desbloqueado - Coleccion"
    : `${character.className} - ${entry.partyName}`;
  const lockedSubtitle = isReward ? "Imagen de trofeo" : entry.partyName;

  return `
    <button
      type="button"
      class="gallery-card class-theme-${visualTheme.slug} ${isReward ? "collection-reward-card" : ""} ${active ? "active" : ""} ${locked ? "locked" : "unlocked"} ${hasTag(character, "especial") ? "special-card" : ""}"
      ${locked ? "disabled" : `data-gallery-select="${escapeHtml(entry.key)}"`}
    >
      <span class="gallery-thumb">
        ${entry.unlocked
          ? renderGalleryImageMarkup(entry, title, "lazy")
          : `<span class="gallery-locked-mark">${escapeHtml(getCharacterInitials(title))}</span>`}
      </span>
      <span class="gallery-card-copy">
        <strong>${entry.unlocked ? escapeHtml(title) : "Retrato bloqueado"}</strong>
        <small>${escapeHtml(entry.unlocked ? unlockedSubtitle : lockedSubtitle)}</small>
      </span>
    </button>
  `;
}

function renderGalleryImageMarkup(entry, altText, loading = "") {
  const initials = getCharacterInitials(altText);
  const loadingAttr = loading ? ` loading="${escapeHtml(loading)}"` : "";
  return `
    <span class="gallery-image-fallback">${escapeHtml(initials)}</span>
    <img src="${escapeHtml(entry.portrait)}" alt="${escapeHtml(altText)}"${loadingAttr} onerror="this.remove()">
  `;
}

function renderGalleryViewer(entry) {
  if (!entry) {
    return `
      <aside class="panel gallery-viewer empty">
        <h3>Sin retratos desbloqueados</h3>
        <p>Recluta personajes con portrait para abrir sus imagenes aca.</p>
      </aside>
    `;
  }

  const character = entry.character;
  const visualTheme = getCharacterVisualTheme(character);
  if (entry.reward) {
    return `
      <aside class="panel gallery-viewer collection-reward-viewer class-theme-${visualTheme.slug} special-card">
        <div class="gallery-viewer-image">
          ${renderGalleryImageMarkup(entry, entry.reward.playerName)}
        </div>
        <div class="gallery-meta">
          <span class="status-pill">Trofeo especial</span>
          <h3>${escapeHtml(entry.reward.playerName)}</h3>
          <p>Imagen desbloqueada por completar una coleccion de retratos.</p>
          <div class="gallery-meta-grid">
            <span><strong>Tipo</strong>Jugador</span>
            <span><strong>Coleccion</strong>${escapeHtml(entry.reward.requiredIds.length)} retratos</span>
            <span><strong>Origen</strong>Trofeo</span>
            <span><strong>Estado</strong>Desbloqueado</span>
          </div>
          <small>Desbloqueado ${escapeHtml(formatGalleryDate(entry.unlockInfo?.unlockedAt))}</small>
        </div>
      </aside>
    `;
  }

  return `
    <aside class="panel gallery-viewer class-theme-${visualTheme.slug} ${hasTag(character, "especial") ? "special-card" : ""}">
      <div class="gallery-viewer-image">
        ${renderGalleryImageMarkup(entry, character.name)}
      </div>
      <div class="gallery-meta">
        <span class="status-pill">${escapeHtml(entry.partyName)}</span>
        <h3>${escapeHtml(character.name)}</h3>
        <p>${escapeHtml(character.className)} - ${escapeHtml(character.subclass)}</p>
        <div class="gallery-meta-grid">
          <span><strong>Level</strong>${escapeHtml(character.level)}</span>
          <span><strong>AC</strong>${escapeHtml(getCharacterArmorClass(character))}</span>
          <span><strong>HP</strong>${escapeHtml(getCharacterHitPointInfo(character).hitPoints)}</span>
          <span><strong>Origen</strong>${escapeHtml(entry.unlockInfo?.source || "Reclutado")}</span>
        </div>
        <small>Desbloqueado ${escapeHtml(formatGalleryDate(entry.unlockInfo?.unlockedAt))}</small>
      </div>
    </aside>
  `;
}

function formatGalleryDate(value) {
  if (!value) {
    return "durante una partida";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "durante una partida";
  }
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function unlockTrophy(trophyId, context = {}) {
  const trophy = getTrophyDefinitions().find((candidate) => candidate.id === trophyId);
  if (!trophy) {
    return null;
  }

  const trophyState = loadTrophyState();
  if (trophyState.unlocked[trophyId]) {
    return null;
  }

  trophyState.unlocked[trophyId] = {
    unlockedAt: new Date().toISOString(),
    partyName: context.partyName || "",
    playerName: context.playerName || "",
    score: context.score || 0
  };
  saveTrophyState(trophyState);
  audioManager.playSfx("achievementUnlock");

  return {
    ...trophy,
    unlockInfo: trophyState.unlocked[trophyId]
  };
}

function getLocalStorageSafe() {
  try {
    if (typeof localStorage !== "undefined") {
      return localStorage;
    }
  } catch (error) {
    return null;
  }
  return null;
}

function renderAudioSettings(mode = "full") {
  const compact = mode === "compact";
  return `
    <div class="audio-settings ${compact ? "compact" : ""}" data-audio-settings>
      <button
        type="button"
        class="audio-toggle ${audioManager.musicEnabled ? "active" : "inactive"}"
        data-audio-toggle="music"
        aria-pressed="${audioManager.musicEnabled ? "true" : "false"}"
      >Musica ${audioManager.musicEnabled ? "ON" : "OFF"}</button>
      <button
        type="button"
        class="audio-toggle ${audioManager.sfxEnabled ? "active" : "inactive"}"
        data-audio-toggle="sfx"
        aria-pressed="${audioManager.sfxEnabled ? "true" : "false"}"
      >SFX ${audioManager.sfxEnabled ? "ON" : "OFF"}</button>
      <label class="volume-slider">
        <span>Musica</span>
        <input type="range" min="0" max="1" step="0.05" value="${audioManager.musicVolume}" data-audio-volume="music">
      </label>
      <label class="volume-slider">
        <span>SFX</span>
        <input type="range" min="0" max="1" step="0.05" value="${audioManager.sfxVolume}" data-audio-volume="sfx">
      </label>
    </div>
  `;
}

function bindAudioControls(root = app) {
  if (!root?.querySelectorAll) {
    return;
  }

  root.querySelectorAll("[data-audio-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      audioManager.unlock();
      if (button.dataset.audioToggle === "music") {
        audioManager.setMusicEnabled(!audioManager.musicEnabled);
      } else {
        audioManager.setSfxEnabled(!audioManager.sfxEnabled);
      }
      syncAudioControls(root);
    });
  });

  root.querySelectorAll("[data-audio-volume]").forEach((input) => {
    input.addEventListener("input", () => {
      audioManager.unlock();
      if (input.dataset.audioVolume === "music") {
        audioManager.setMusicVolume(input.value);
      } else {
        audioManager.setSfxVolume(input.value);
      }
      syncAudioControls(root);
    });
  });
}

function syncAudioControls(root = app) {
  if (!root?.querySelectorAll) {
    return;
  }

  root.querySelectorAll("[data-audio-toggle]").forEach((button) => {
    const kind = button.dataset.audioToggle;
    const enabled = kind === "music" ? audioManager.musicEnabled : audioManager.sfxEnabled;
    button.classList.toggle("active", enabled);
    button.classList.toggle("inactive", !enabled);
    button.setAttribute("aria-pressed", enabled ? "true" : "false");
    button.textContent = `${kind === "music" ? "Musica" : "SFX"} ${enabled ? "ON" : "OFF"}`;
  });

  root.querySelectorAll("[data-audio-volume]").forEach((input) => {
    input.value = input.dataset.audioVolume === "music"
      ? String(audioManager.musicVolume)
      : String(audioManager.sfxVolume);
  });
}

function setupGlobalAudioFeedback() {
  if (audioFeedbackBound || typeof document === "undefined" || !document.addEventListener) {
    return;
  }

  audioFeedbackBound = true;
  const unlockAudio = () => audioManager.unlock();
  document.addEventListener("pointerdown", unlockAudio, { once: true, capture: true });
  document.addEventListener("keydown", unlockAudio, { once: true, capture: true });

  document.addEventListener("click", (event) => {
    if (!event.target?.closest) {
      return;
    }
    if (event.target.closest("button, [data-pick], [data-path-choice], [data-reward-choice], [data-recruit-choice], [data-replacement-pick]")) {
      audioManager.playSfx("uiClick");
    }
  });

  document.addEventListener("pointerover", (event) => {
    if (!event.target?.closest) {
      return;
    }
  });
}

function startPartyRoulette() {
  clearRouletteTimer();
  audioManager.fadeMusicTo("draft");
  state.currentDraftParty = null;
  state.currentDraftCharacters = [];

  const targetParty = drawNextDraftParty();
  if (!targetParty) {
    state.assignments = autoAssignRoles(state.draftedCharacters);
    renderFormation();
    return;
  }

  state.pendingDraftParty = targetParty;
  const rouletteParties = getRemainingDraftParties(targetParty);
  let tick = 0;
  renderRoulette(rouletteParties[0] || targetParty, rouletteParties);

  state.rouletteTimer = window.setInterval(() => {
    tick += 1;
    const visibleParty = rouletteParties[tick % rouletteParties.length] || targetParty;
    updateRouletteDisplay(visibleParty.id);

    if (tick >= 18) {
      clearRouletteTimer();
      state.currentDraftParty = targetParty;
      state.currentDraftCharacters = rollDraftCharacters(targetParty);
      state.pendingDraftParty = null;
      audioManager.playSfx("partyReveal");
      if (state.currentDraftCharacters.some((character) => hasTag(character, "especial"))) {
        audioManager.playSfx("specialCardReveal");
      }
      renderDraft();
    }
  }, 75);
}

function renderRoulette(activeParty, parties) {
  const round = state.draftedCharacters.length + 1;

  app.innerHTML = `
    <section class="screen">
      <header class="screen-header">
        <div>
          <span class="status-pill">Draft ${round} / 5</span>
          ${renderCoopTurnPill()}
          <h2>Ruleta de partys</h2>
          <p class="lead">El selector recorre las partys de campana y puede detenerse en una party ya vista.</p>
        </div>
        <div class="toolbar">
          ${canStartTournament() ? `<button class="ghost-button" data-action="formation">Ir a formacion</button>` : ""}
          <button class="ghost-button" data-action="restart">Reiniciar</button>
          ${renderAudioSettings("compact")}
        </div>
      </header>
      <div class="roulette-panel">
        <span class="eyebrow">Seleccionando</span>
        <strong class="roulette-name" data-roulette-name>${escapeHtml(activeParty.name)}</strong>
        <div class="roulette-list">
          ${parties.map((party) => `
            <span class="roulette-item ${party.id === activeParty.id ? "active" : ""}" data-roulette-party="${party.id}">
              ${escapeHtml(party.name)}
            </span>
          `).join("")}
        </div>
      </div>
      <aside class="panel">
        <h3>${escapeHtml(state.partyName)}</h3>
        ${renderDraftedList()}
      </aside>
    </section>
  `;

  app.querySelector("[data-action='restart']").addEventListener("click", confirmRestartGame);
  const formationButton = app.querySelector("[data-action='formation']");
  if (formationButton) {
    formationButton.addEventListener("click", finishDraftEarly);
  }
  bindAudioControls(app);
}

function updateRouletteDisplay(activePartyId) {
  audioManager.playSfx("rouletteTick");
  const activeParty = DND_PARTIES.find((party) => party.id === activePartyId);
  const nameNode = app.querySelector("[data-roulette-name]");

  if (nameNode && activeParty) {
    nameNode.textContent = activeParty.name;
  }

  app.querySelectorAll("[data-roulette-party]").forEach((item) => {
    item.classList.toggle("active", item.dataset.rouletteParty === activePartyId);
  });
}

function drawNextDraftParty() {
  const pickedIds = new Set(state.draftedCharacters.map((character) => character.id));
  const partiesWithAvailableCharacters = DND_PARTIES.filter((party) =>
    party.characters.some((character) => !pickedIds.has(character.id))
  );
  const pool = partiesWithAvailableCharacters.length ? partiesWithAvailableCharacters : DND_PARTIES;
  return pool.length ? randomItem(pool) : null;
}

function getRemainingDraftParties(extraParty) {
  return shuffle(DND_PARTIES).sort((left, right) => {
    if (left.id === extraParty.id) return -1;
    if (right.id === extraParty.id) return 1;
    return 0;
  });
}

function clearRouletteTimer() {
  if (state.rouletteTimer) {
    window.clearInterval(state.rouletteTimer);
    state.rouletteTimer = null;
  }
}

function clearCombatTimer() {
  if (state.combatTimer) {
    window.clearTimeout(state.combatTimer);
    window.clearInterval(state.combatTimer);
    state.combatTimer = null;
  }
  if (state.typingTimer) {
    window.clearTimeout(state.typingTimer);
    window.clearInterval(state.typingTimer);
    state.typingTimer = null;
  }
}

function rollDraftCharacters(party) {
  const visibleCharacters = [...party.characters];

  if (visibleCharacters.length > 0) {
    return shuffle(visibleCharacters);
  }

  return [weightedPick(party.characters)];
}

function renderDraft() {
  state.screen = "draft";
  audioManager.fadeMusicTo("draft");
  const round = state.draftedCharacters.length + 1;
  const party = state.currentDraftParty;

  app.innerHTML = `
    <section class="screen">
      <header class="screen-header">
        <div>
          <span class="status-pill">Draft ${round} / 5</span>
          ${renderCoopTurnPill()}
          <h2>${escapeHtml(party.name)}</h2>
          <p class="lead">${escapeHtml(party.theme)}</p>
        </div>
        <div class="toolbar">
          ${canStartTournament() ? `<button class="ghost-button" data-action="formation">Ir a formacion</button>` : ""}
          <button class="ghost-button" data-action="restart">Reiniciar</button>
          ${renderAudioSettings("compact")}
        </div>
      </header>
      <div class="draft-layout">
        <div class="card-grid">
          ${state.currentDraftCharacters.map(renderDraftCard).join("")}
        </div>
        <aside class="panel">
          <h3>${escapeHtml(state.partyName)}</h3>
          ${renderDraftedList()}
        </aside>
      </div>
    </section>
  `;

  app.querySelectorAll("[data-pick]").forEach((button) => {
    button.addEventListener("click", () => chooseCharacter(button.dataset.pick));
  });
  app.querySelector("[data-action='restart']").addEventListener("click", confirmRestartGame);
  const formationButton = app.querySelector("[data-action='formation']");
  if (formationButton) {
    formationButton.addEventListener("click", finishDraftEarly);
  }
  bindAudioControls(app);
}

function renderDraftCard(character) {
  const alreadyPicked = state.draftedCharacters.some((picked) => picked.id === character.id);
  const tags = getDisplayTags(character);
  const armorClass = getCharacterArmorClass(character);
  const revealRating = false;
  const ratingClass = getVisibleRatingClass(character, revealRating);
  const visualTheme = getCharacterVisualTheme(character);

  return `
    <article class="character-card compact ${ratingClass} class-theme-${visualTheme.slug} ${alreadyPicked ? "selected" : ""} ${hasTag(character, "especial") ? "special-card" : ""}">
      <div class="card-top">
        <div class="card-rating ${shouldRevealCharacterCR(revealRating) ? "" : "hidden-rating"}">
          <span>${getVisibleRatingLabel(revealRating)}</span>
          <strong>${getVisibleRatingValue(character, revealRating)}</strong>
        </div>
        <div class="card-identity">
          <span class="meta-label">${getVisibleRatingMetaLabel(revealRating)}</span>
          <h3>${escapeHtml(character.name)}</h3>
          <p class="class-line">${escapeHtml(character.className)} - ${escapeHtml(character.subclass)}</p>
        </div>
      </div>
      ${renderCharacterArt(character, visualTheme)}
      <div class="card-meta">
        <span class="badge gold">Level ${character.level}</span>
        <span class="badge gold">AC ${armorClass}</span>
        ${tags.map((tag) => `<span class="badge ${getTagBadgeClass(tag)}">${escapeHtml(getTagLabel(tag))}</span>`).join("")}
      </div>
      <div class="card-footer">
        <button data-pick="${character.id}" ${alreadyPicked ? "disabled" : ""}>Elegir</button>
      </div>
    </article>
  `;
}

function renderCharacterArt(character, visualTheme = getCharacterVisualTheme(character)) {
  const portrait = getCharacterPortraitPath(character);
  const classIcon = visualTheme.iconPath || getClassIconPath(character?.className);
  const hasPortrait = Boolean(portrait);
  const initials = getCharacterInitials(character.name);
  const placeholder = `
    <div class="card-art-placeholder" ${portrait ? "hidden" : ""}>
      ${classIcon ? `<img class="card-placeholder-icon" src="${escapeHtml(classIcon)}" alt="" aria-hidden="true" onerror="this.hidden=true;">` : ""}
      <strong>${escapeHtml(initials)}</strong>
      <span>${escapeHtml(visualTheme.label)}</span>
    </div>
  `;

  return `
    <div class="card-art ${hasPortrait ? "has-portrait" : ""} class-art-${visualTheme.slug}" data-class-label="${escapeHtml(visualTheme.label)}">
      ${portrait ? `<img class="card-portrait" src="${escapeHtml(portrait)}" alt="${escapeHtml(character.name)}" loading="lazy" onerror="this.hidden=true; this.nextElementSibling.hidden=false;">` : ""}
      ${placeholder}
      ${classIcon ? `<img class="card-class-icon" src="${escapeHtml(classIcon)}" alt="" aria-hidden="true" loading="lazy" onerror="this.hidden=true;">` : ""}
      <div class="card-art-mark">${escapeHtml(visualTheme.emblem)}</div>
    </div>
  `;
}

function getCharacterVisualTheme(character) {
  const label = cleanDisplayName(character?.className, "Adventurer");
  const slug = getClassThemeSlug(label);
  const themes = {
    barbarian: { emblem: "Rage", label: "Barbarian" },
    fighter: { emblem: "Steel", label: "Fighter" },
    paladin: { emblem: "Oath", label: "Paladin" },
    cleric: { emblem: "Divine", label: "Cleric" },
    wizard: { emblem: "Runes", label: "Wizard" },
    sorcerer: { emblem: "Chaos", label: "Sorcerer" },
    warlock: { emblem: "Pact", label: "Warlock" },
    druid: { emblem: "Primal", label: "Druid" },
    ranger: { emblem: "Trail", label: "Ranger" },
    rogue: { emblem: "Shadow", label: "Rogue" },
    monk: { emblem: "Spirit", label: "Monk" },
    bard: { emblem: "Song", label: "Bard" },
    artificer: { emblem: "Forge", label: "Artificer" },
    alchemist: { emblem: "Elixir", label: "Alchemist" },
    binder: { emblem: "Seal", label: "Binder" },
    "blood-hunter": { emblem: "Blood", label: "Blood Hunter" },
    commoner: { emblem: "Torch", label: "Commoner" },
    gunslinger: { emblem: "Powder", label: "Gunslinger" },
    witch: { emblem: "Moon", label: "Witch" },
    warden: { emblem: "Ward", label: "Warden" },
    necromancer: { emblem: "Soul", label: "Necromancer" },
    magus: { emblem: "Rune Blade", label: "Magus" },
    martyr: { emblem: "Sacrifice", label: "Martyr" },
    psion: { emblem: "Mind", label: "Psion" },
    shaman: { emblem: "Totem", label: "Shaman" },
    warlord: { emblem: "Banner", label: "Warlord" },
    warmage: { emblem: "Cantrip", label: "Warmage" },
    illrigger: { emblem: "Infernal", label: "Illrigger" },
    captain: { emblem: "Command", label: "Captain" },
    capitan: { emblem: "Command", label: "Capitan" },
    craftsman: { emblem: "Craft", label: "Craftsman" },
    gadgeteer: { emblem: "Gear", label: "Gadgeteer" },
    investigator: { emblem: "Clue", label: "Investigator" },
    savant: { emblem: "Insight", label: "Savant" },
    vagabond: { emblem: "Road", label: "Vagabond" },
    vessel: { emblem: "Vessel", label: "Vessel" },
    "rogue-warlord": { emblem: "Ambush", label: "Rogue Warlord" }
  };
  const theme = themes[slug] || themes[slug.split("-")[0]] || { emblem: "D20", label };

  return {
    slug,
    label: theme.label || label,
    emblem: theme.emblem || "D20",
    iconPath: getClassIconPath(label)
  };
}

function getCharacterPortraitPath(character) {
  const explicitPortrait = typeof character?.portrait === "string" ? character.portrait.trim() : "";
  if (explicitPortrait) {
    return explicitPortrait;
  }

  const nameParts = String(character?.name || "").split(/\s+/).filter(Boolean);
  const candidates = [
    character?.id,
    character?.name,
    nameParts[0],
    `${nameParts[0] || ""}-${nameParts[1] || ""}`
  ]
    .map(getClassThemeSlug)
    .filter(Boolean);

  for (const candidate of [...new Set(candidates)]) {
    if (PORTRAIT_FILES[candidate]) {
      return PORTRAIT_FILES[candidate];
    }
  }

  return "";
}

function getClassIconPath(className) {
  const slug = getClassThemeSlug(className);
  return CLASS_ICON_FILES[slug] || CLASS_ICON_FILES[slug.split("-")[0]] || "";
}

function getClassThemeSlug(className) {
  const slug = String(className || "adventurer")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return slug || "adventurer";
}

function getCharacterInitials(name) {
  const parts = String(name || "Adventurer")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) {
    return "PC";
  }
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function renderDraftedList() {
  if (state.draftedCharacters.length === 0) {
    return `<div class="empty-state">Aun no hay personajes elegidos.</div>`;
  }

  return `
    <div class="mini-list">
      ${state.draftedCharacters.map((character) => `
        <div class="mini-item">
          <span class="mini-rating">${getCharacterCRLabel(character)}</span>
          <span class="mini-copy">
            <strong>${escapeHtml(character.name)}</strong>
            <span class="muted">${escapeHtml(character.className)} - CR ${getCharacterCRLabel(character)}</span>
            ${state.isLocalCoop ? `<span class="muted">Elegido por ${escapeHtml(getDraftOwner(character))}</span>` : ""}
          </span>
        </div>
      `).join("")}
    </div>
  `;
}

function chooseCharacter(characterId) {
  const character = state.currentDraftCharacters.find((candidate) => candidate.id === characterId) || findCharacter(characterId);
  if (!character || state.draftedCharacters.some((picked) => picked.id === characterId)) {
    return;
  }

  const owner = getCurrentDraftPlayerName();
  const draftedCharacter = cloneCharacterForRun(character);
  const originParty = state.currentDraftParty?.characters?.some((candidate) => candidate.id === character.id)
    ? state.currentDraftParty
    : findPartyForCharacter(character.id);
  if (originParty) {
    draftedCharacter.sourcePartyId = originParty.id;
    draftedCharacter.sourcePartyName = originParty.name;
  }
  audioManager.playSfx(hasTag(draftedCharacter, "especial") ? "specialCardReveal" : "cardPick");
  state.draftedCharacters.push(draftedCharacter);
  unlockGalleryPortrait(draftedCharacter, "Draft");
  if (state.isLocalCoop) {
    state.draftPickOwners[draftedCharacter.id] = owner;
  }

  if (state.draftedCharacters.length >= 5) {
    state.assignments = autoAssignRoles(state.draftedCharacters);
    renderFormation();
    return;
  }

  startPartyRoulette();
}

function finishDraftEarly() {
  clearRouletteTimer();
  syncAssignmentsWithDraftedCharacters();
  renderFormation();
}

function renderFormation() {
  state.screen = "formation";
  audioManager.fadeMusicTo("draft");
  syncAssignmentsWithDraftedCharacters();
  const canStart = canStartTournament();
  const score = canStart ? calculatePartyScore({
    name: state.partyName,
    members: state.draftedCharacters,
    assignments: state.assignments
  }) : null;
  const canReturnToDraft = state.draftedCharacters.length < 5;

  app.innerHTML = `
    <section class="screen">
      <header class="screen-header">
        <div>
          <span class="status-pill">Formacion</span>
          <h2>${escapeHtml(state.partyName)}</h2>
          <p class="lead">Ajusta las posiciones que quieras; los personajes sin asignar igual pueden entrar al viaje.</p>
        </div>
        <div class="toolbar">
          <button class="ghost-button" data-action="auto">Autoasignar</button>
          <button class="ghost-button" data-action="gallery">Galeria</button>
          ${canReturnToDraft ? `<button class="ghost-button" data-action="draft">Seguir draft</button>` : ""}
          ${renderAudioSettings("compact")}
        </div>
      </header>
      <div class="formation-stack">
        <section class="panel assignment-panel">
          <div class="assignment-panel-header">
            <div>
              <h3>Asignar puestos</h3>
              <p class="party-editor-note">Elige rapido quien ocupa cada rol. Las cartas quedan abajo para revisar detalles sin tener que bajar hasta la asignacion.</p>
            </div>
            <button type="button" data-action="tournament" ${canStart ? "" : "disabled"}>Iniciar Viaje</button>
          </div>
          <div class="assignment-top-grid">
            <div class="score-anchor" data-formation-score>
              ${score ? renderAssignmentScoreBox(score) : `<div class="empty-state">Elige al menos un personaje.</div>`}
            </div>
            <div class="role-list compact-role-list" data-formation-roles>
              ${ROLE_ORDER.map(renderRoleSelector).join("")}
            </div>
          </div>
        </section>
        <div class="card-grid" data-formation-cards>
          ${state.draftedCharacters.map(renderFullCard).join("")}
        </div>
      </div>
    </section>
  `;

  app.querySelector(".screen").addEventListener("change", handleFormationChange);
  app.querySelector("[data-action='auto']").addEventListener("click", () => {
    state.assignments = autoAssignRoles(state.draftedCharacters);
    syncCurrentAssignmentUI({ preserveUi: true });
  });
  app.querySelector("[data-action='gallery']").addEventListener("click", openImageGallery);
  const draftButton = app.querySelector("[data-action='draft']");
  if (draftButton) {
    draftButton.addEventListener("click", continueDraftFromFormation);
  }
  app.querySelector("[data-action='tournament']").addEventListener("click", startTournament);
  bindAudioControls(app);
}

function continueDraftFromFormation() {
  clearRouletteTimer();
  audioManager.fadeMusicTo("draft");

  if (state.currentDraftParty && Array.isArray(state.currentDraftCharacters) && state.currentDraftCharacters.length) {
    renderDraft();
    return;
  }

  if (state.pendingDraftParty) {
    state.currentDraftParty = state.pendingDraftParty;
    state.currentDraftCharacters = rollDraftCharacters(state.pendingDraftParty);
    state.pendingDraftParty = null;
    audioManager.playSfx("partyReveal");
    renderDraft();
    return;
  }

  startPartyRoulette();
}

function handleFormationChange(event) {
  const select = event.target.closest("[data-role-select]");
  if (!select) {
    return;
  }

  assignFormationRole(select.dataset.roleSelect, select.value);
}

function assignFormationRole(role, characterId) {
  if (!role) {
    return;
  }

  state.assignments[role] = characterId || "";
  removeDuplicateAssignments(role, characterId);
  syncCurrentAssignmentUI({ preserveUi: true });
}

function syncCurrentAssignmentUI(options = {}) {
  const uiState = options.preserveUi ? captureAssignmentUiState() : null;
  if (state.screen === "adventure-party") {
    syncAdventurePartyEditorUI();
    restoreAssignmentUiState(uiState);
    return;
  }
  syncFormationUI();
  restoreAssignmentUiState(uiState);
}

function syncFormationUI() {
  syncAssignmentsWithDraftedCharacters();
  const canStart = canStartTournament();
  const score = canStart ? calculatePartyScore({
    name: state.partyName,
    members: state.draftedCharacters,
    assignments: state.assignments
  }) : null;

  const cardsNode = app.querySelector("[data-formation-cards]");
  const rolesNode = app.querySelector("[data-formation-roles]");
  const scoreNode = app.querySelector("[data-formation-score]");
  const startButton = app.querySelector("[data-action='tournament']");

  if (cardsNode) {
    cardsNode.innerHTML = state.draftedCharacters.map(renderFullCard).join("");
  }
  if (rolesNode) {
    rolesNode.innerHTML = ROLE_ORDER.map(renderRoleSelector).join("");
  }
  if (scoreNode) {
    scoreNode.innerHTML = score ? renderAssignmentScoreBox(score) : `<div class="empty-state">Elige al menos un personaje.</div>`;
  }
  if (startButton) {
    startButton.disabled = !canStart;
  }
}

function captureAssignmentUiState() {
  const hasWindow = typeof window !== "undefined";
  return {
    scrollY: hasWindow ? window.scrollY || window.pageYOffset || 0 : null,
    scoreDetailsOpen: Boolean(app.querySelector("[data-assignment-score-details]")?.open),
    openCharacterDetailIds: [...app.querySelectorAll("[data-character-id]")]
      .filter((card) => card.querySelector(".character-detail-drawer")?.open)
      .map((card) => card.dataset.characterId)
      .filter(Boolean)
  };
}

function restoreAssignmentUiState(uiState) {
  if (!uiState) {
    return;
  }

  const scoreDetails = app.querySelector("[data-assignment-score-details]");
  if (scoreDetails && uiState.scoreDetailsOpen) {
    scoreDetails.open = true;
  }

  const openIds = new Set(uiState.openCharacterDetailIds || []);
  app.querySelectorAll("[data-character-id]").forEach((card) => {
    if (!openIds.has(card.dataset.characterId)) {
      return;
    }
    const details = card.querySelector(".character-detail-drawer");
    if (details) {
      details.open = true;
    }
  });

  if (uiState.scrollY === null || typeof window === "undefined" || typeof window.scrollTo !== "function") {
    return;
  }

  const restoreScroll = () => {
    try {
      window.scrollTo({ top: uiState.scrollY, behavior: "auto" });
    } catch (error) {
      window.scrollTo(0, uiState.scrollY);
    }
  };

  if (typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(restoreScroll);
    return;
  }
  window.setTimeout(restoreScroll, 0);
}

function renderFullCard(character) {
  const assignedRole = findAssignedRole(character.id);
  const multiplier = assignedRole ? getRoleFitMultiplier(character, assignedRole) : null;
  const tags = getDisplayTags(character);
  const armorClass = getCharacterArmorClass(character);
  const hitPointInfo = getCharacterHitPointInfo(character);
  const defenseInfo = getCharacterDefenseInfo(character);
  const powerScore = getCharacterPowerScore(character);
  const damageProfile = getCharacterDamageProfile(character);
  const revealRating = true;
  const ratingClass = getVisibleRatingClass(character, revealRating);
  const visualTheme = getCharacterVisualTheme(character);

  return `
    <article class="character-card ${ratingClass} class-theme-${visualTheme.slug} ${hasTag(character, "especial") ? "special-card" : ""}" data-character-id="${escapeHtml(character.id)}">
      <div class="card-top">
        <div class="card-rating ${shouldRevealCharacterCR(revealRating) ? "" : "hidden-rating"}">
          <span>${getVisibleRatingLabel(revealRating)}</span>
          <strong>${getVisibleRatingValue(character, revealRating)}</strong>
        </div>
        <div class="card-identity">
          <span class="meta-label">${getVisibleRatingMetaLabel(revealRating)}</span>
          <h3>${escapeHtml(character.name)}</h3>
          <p class="class-line">${escapeHtml(character.className)} - ${escapeHtml(character.subclass)}</p>
        </div>
      </div>
      ${renderCharacterArt(character, visualTheme)}
      <div class="card-meta">
        <span class="badge gold">Level ${character.level}</span>
        <span class="badge gold">AC ${armorClass}</span>
        <span class="badge gold">HP ${hitPointInfo.hitPoints}</span>
        ${state.isLocalCoop ? `<span class="badge teal">${escapeHtml(getDraftOwner(character))}</span>` : ""}
        ${shouldShowRoleHints() ? getCharacterRolePriority(character).slice(0, 2).map((role) => `<span class="badge">${getRoleLabel(role)}</span>`).join("") : ""}
        ${assignedRole ? `<span class="badge teal">${getRoleLabel(assignedRole)}${shouldShowRoleHints() ? ` x${multiplier.toFixed(2)}` : ""}</span>` : ""}
        ${tags.slice(0, 3).map((tag) => `<span class="badge ${getTagBadgeClass(tag)}">${escapeHtml(getTagLabel(tag))}</span>`).join("")}
      </div>
      <details class="character-detail-drawer">
        <summary>Stats, defensa y daño</summary>
        <div class="character-detail-content">
          <div class="compact-stat-row">
            ${Object.entries(character.stats).map(([stat, value]) => `<span>${stat} ${value}</span>`).join("")}
          </div>
          <div class="compact-stat-row">
            <span>d${hitPointInfo.hitDie}</span>
            <span>Def CR ${formatDefenseCRValue(defenseInfo.defensiveCR)}</span>
            ${shouldRevealCharacterCR(revealRating) && powerScore ? `<span>Power ${powerScore}</span>` : ""}
          </div>
          ${renderCharacterDefenseSummary(defenseInfo)}
          <p class="class-line">${formatSpellList(character.spells)}</p>
          ${renderCharacterDamageSummary(damageProfile)}
        </div>
      </details>
    </article>
  `;
}

function renderRoleSelector(role) {
  const assignedId = state.assignments[role] || "";
  const usedIds = new Set(Object.entries(state.assignments)
    .filter(([assignedRole]) => assignedRole !== role)
    .map(([, characterId]) => characterId));

  return `
    <div class="role-row">
      <label for="${role}">${getRoleLabel(role)}</label>
      <select id="${role}" data-role-select="${role}">
        <option value="">Sin asignar</option>
        ${state.draftedCharacters.map((character) => `
          <option value="${character.id}" ${assignedId === character.id ? "selected" : ""} ${usedIds.has(character.id) ? "disabled" : ""}>
            ${escapeHtml(character.name)} - CR ${getCharacterCRLabel(character)}
          </option>
        `).join("")}
      </select>
    </div>
  `;
}

function renderAssignmentScoreBox(score) {
  const assignedCount = score.assignedCharacters?.length || 0;
  const activeCount = score.activeMembers?.length || 0;
  const reserveCount = score.reserveMembers?.length || 0;

  return `
    <div class="assignment-score-box">
      <div class="assignment-score-main">
        <span>Puntaje final</span>
        <strong>${score.finalScore}</strong>
      </div>
      <div class="assignment-score-chips">
        <span>${assignedCount}/5 puestos</span>
        <span>${activeCount}/5 activos</span>
        ${reserveCount ? `<span>${reserveCount} reserva</span>` : ""}
        <span>Roles ${formatModifier(score.roleBonus || 0)}</span>
        <span>Sinergia +${score.synergyBonus || 0}</span>
        <span>Penal ${score.penalties || 0}</span>
      </div>
      <details class="assignment-score-details" data-assignment-score-details>
        <summary>Ver desglose</summary>
        ${renderScoreBox(score)}
      </details>
    </div>
  `;
}

function renderScoreBox(score) {
  const partyCR = score.partyCR;
  const showHints = shouldShowRoleHints();
  const revealCR = shouldRevealCharacterCR(true);
  const visibleStrengths = getVisibleScoreInsights(score.strengths);
  const visibleWeaknesses = getVisibleScoreInsights(score.weaknesses);
  return `
    <div class="score-box score-box-detailed">
      <div class="score-detail-column score-detail-main">
        <span class="meta-label">Score</span>
        <div class="score-total">
          <span>Puntaje final</span>
          <strong>${score.finalScore}</strong>
        </div>
        ${revealCR && partyCR ? `<div class="score-line"><span>CR promedio</span><strong>${partyCR.averageCR}</strong></div>` : ""}
        <div class="score-line"><span>Power Score total</span><strong>${score.rawPower}</strong></div>
        <div class="score-line"><span>Puestos cubiertos</span><strong>${score.assignedCharacters?.length || 0}/5</strong></div>
        <div class="score-line"><span>Roster activo</span><strong>${score.activeMembers?.length || 0}/5</strong></div>
        ${score.reserveMembers?.length ? `<div class="score-line"><span>Reserva</span><strong>${score.reserveMembers.length}</strong></div>` : ""}
        ${showHints ? `<div class="score-line"><span>Bonus por roles</span><strong>${formatModifier(score.roleBonus || 0)}</strong></div>` : ""}
        <div class="score-line"><span>Bonus de sinergia</span><strong>+${score.synergyBonus}</strong></div>
        ${partyCR ? `<div class="score-line"><span>Afinidad</span><strong>${formatModifier(score.affinityBonus || 0)}</strong></div>` : ""}
        ${score.rewardBonus ? `<div class="score-line"><span>Modificador permanente</span><strong>${formatModifier(score.rewardBonus)}</strong></div>` : ""}
        ${score.groupBonus ? `<div class="score-line"><span>Grupos especiales</span><strong>${formatModifier(score.groupBonus)}</strong></div>` : ""}
        <div class="score-line"><span>Penalizaciones</span><strong>${score.penalties}</strong></div>
        ${showHints && partyCR ? `<div class="score-line"><span>Roles cubiertos</span><strong>${partyCR.coveredRoles.length}</strong></div>` : ""}
        ${partyCR?.damageProfile ? renderPartyDamageProfile(partyCR.damageProfile) : ""}
      </div>
      ${showHints ? `
        <div class="score-detail-column">
          <span class="meta-label">Fortalezas</span>
          ${renderInsightList(visibleStrengths, "good", "Sin fortalezas claras.")}
        </div>
        <div class="score-detail-column">
          <span class="meta-label">Debilidades</span>
          ${renderInsightList(visibleWeaknesses, "bad", "Sin debilidades graves.")}
        </div>` : `<div class="score-detail-column"><div class="empty-state compact">Pistas ocultas por modo dificil.</div></div>`}
    </div>
  `;
}

function getVisibleScoreInsights(items) {
  if (shouldRevealCharacterCR(true)) {
    return items;
  }

  return items.filter((item) => {
    const normalized = normalizeLookupText(item);
    return !normalized.startsWith("cr promedio") &&
      !normalized.startsWith("mejor personaje");
  });
}

function renderInsightList(items, type, emptyText) {
  if (!items.length) {
    return `<div class="empty-state compact">${emptyText}</div>`;
  }

  return `
    <ul class="insight-list">
      ${items.map((item) => `<li class="insight ${type}">${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

function renderRecentTrophies(trophies = []) {
  if (!Array.isArray(trophies) || !trophies.length) {
    return "";
  }

  return `
    <div class="trophy-unlock-list">
      ${trophies.map((trophy) => `
        <div class="trophy-unlock">
          <span>Trofeo desbloqueado</span>
          <strong>${escapeHtml(trophy.name)}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function startTournament() {
  if (!canStartTournament()) {
    return;
  }

  audioManager.unlock();
  audioManager.fadeMusicTo("tournament");
  clearCombatTimer();
  syncAssignmentsWithDraftedCharacters();
  const playerTeam = {
    id: "player",
    name: state.partyName,
    members: state.draftedCharacters,
    assignments: { ...state.assignments },
    isPlayer: true,
    ownerName: state.isLocalCoop ? getCurrentDraftPlayerName() : ""
  };
  unlockGalleryPortraits(playerTeam.members, "Party inicial");
  playerTeam.score = calculatePartyScore(playerTeam);

  state.tournament = createLiveTournament(playerTeam);
  if (state.isLocalCoop) {
    state.tournament.coopPlayerIndex = state.activeCoopPlayerIndex;
    state.tournament.coopPlayerName = getCurrentDraftPlayerName();
    state.tournament.coopPartyName = state.partyName;
  }
  renderTournament();
  queueNextCombat();
}

function renderTournament(options = {}) {
  const tournament = state.tournament;
  state.screen = "tournament";
  const previousScrollY = options.preserveScroll && typeof window !== "undefined"
    ? window.scrollY || window.pageYOffset || 0
    : null;
  audioManager.fadeMusicTo(tournament.finished ? (tournament.champion ? "victory" : "defeat") : "tournament");
  const bannerClass = tournament.finished
    ? tournament.champion ? "victory" : "defeat"
    : "";
  const title = tournament.finished ? tournament.finalTitle : "Viaje en vivo";
  const current = tournament.currentMatch;
  const currentCampaignEvent = tournament.currentCampaignEvent;
  const adventureTabsHtml = renderAdventureTabs(tournament);

  app.innerHTML = `
    <section class="screen">
      <div class="result-banner ${bannerClass}">
        ${tournament.finished && tournament.champion ? renderVictoryFireworks(tournament) : ""}
        ${renderTournamentScoreboard(tournament)}
        <h2>${title}</h2>
        <p class="lead">${escapeHtml(tournament.statusText)}</p>
        ${renderRecentTrophies(tournament.unlockedTrophies)}
        <div class="button-row">
          ${!tournament.finished ? `<button class="ghost-button" data-action="party-editor">Ver / editar party</button>` : ""}
          ${tournament.waitingForNext ? `<button data-action="next-combat">${escapeHtml(getNextCombatButtonLabel(tournament))}</button>` : ""}
          ${renderCoopTournamentAction(tournament)}
          ${!tournament.currentMatch || tournament.combatComplete ? `<button class="ghost-button" data-action="gallery">Galeria</button>` : ""}
          <button class="ghost-button" data-action="trophies">Trofeos</button>
          <button class="ghost-button" data-action="restart">${tournament.finished ? "Jugar otra vez" : "Reiniciar"}</button>
          ${renderAudioSettings("compact")}
        </div>
      </div>
      <div class="tournament-layout">
        <div class="tournament-main-column">
          ${adventureTabsHtml}
        </div>
        <aside class="panel">
          <h3>Avance del viaje</h3>
          ${renderTournamentRoute(tournament)}
        </aside>
      </div>
    </section>
  `;

  app.querySelector("[data-action='restart']").addEventListener("click", confirmRestartGame);
  app.querySelector("[data-action='trophies']").addEventListener("click", openTrophyCollection);
  const galleryButton = app.querySelector("[data-action='gallery']");
  if (galleryButton) {
    galleryButton.addEventListener("click", openImageGallery);
  }
  const partyEditorButton = app.querySelector("[data-action='party-editor']");
  if (partyEditorButton) {
    partyEditorButton.addEventListener("click", renderAdventurePartyEditor);
  }
  app.querySelectorAll("[data-action='next-combat']").forEach((nextButton) => {
    nextButton.addEventListener("click", continueTournament);
  });
  const narratorToggle = app.querySelector("[data-action='toggle-narrator']");
  if (narratorToggle) {
    narratorToggle.addEventListener("click", (event) => {
      event.preventDefault();
      tournament.narratorMinimized = !tournament.narratorMinimized;
      renderTournament({ preserveScroll: true });
    });
  }
  app.querySelectorAll("[data-action='toggle-reward']").forEach((rewardToggle) => {
    rewardToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      tournament.rewardMinimized = !tournament.rewardMinimized;
      renderTournament({ preserveScroll: true, focusSelector: "[data-reward-panel]" });
    });
  });
  app.querySelectorAll("[data-adventure-tab]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      tournament.activeAdventureTab = button.dataset.adventureTab;
      renderTournament({ preserveScroll: true });
    });
  });
  const coopActionButton = app.querySelector("[data-coop-action]");
  if (coopActionButton) {
    coopActionButton.addEventListener("click", () => handleCoopTournamentAction(coopActionButton.dataset.coopAction));
  }
  app.querySelectorAll("[data-path-choice]").forEach((button) => {
    button.addEventListener("click", () => chooseAdventurePath(button.dataset.pathChoice));
  });
  app.querySelectorAll("[data-reward-choice]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      chooseAdventureReward(button.dataset.rewardChoice);
    });
  });
  app.querySelectorAll("[data-recruit-choice]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      chooseVictoryRecruit(button.dataset.recruitChoice);
    });
  });
  const skipRecruitmentButton = app.querySelector("[data-action='skip-recruitment']");
  if (skipRecruitmentButton) {
    skipRecruitmentButton.addEventListener("click", skipVictoryRecruitment);
  }
  app.querySelectorAll("[data-replacement-pick]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      chooseCampaignReplacement(button.dataset.replacementPick);
    });
  });
  bindAudioControls(app);
  restoreTournamentScroll(options, previousScrollY);
}

function renderAdventureTabs(tournament) {
  const activeTab = getActiveAdventureTab(tournament);
  const tabs = [
    {
      id: "log",
      label: "Bitacora",
      detail: getLogTabDetail(tournament)
    },
    {
      id: "events",
      label: "Eventos",
      detail: `${tournament.campaignEvents?.length || 0}`
    },
    {
      id: "reward",
      label: "Recompensa",
      detail: tournament.currentReward ? "Pendiente" : `${tournament.boons?.length || 0}`
    },
    {
      id: "recruitment",
      label: "Reclutamiento",
      detail: tournament.currentRecruitment ? "Disponible" : "Sin oferta"
    }
  ];

  return `
    <div class="panel adventure-tabs-panel" data-adventure-tabs-panel>
      <div class="adventure-tab-bar" role="tablist" aria-label="Panel del viaje">
        ${tabs.map((tab) => `
          <button
            type="button"
            class="adventure-tab ${activeTab === tab.id ? "active" : ""}"
            data-adventure-tab="${tab.id}"
            role="tab"
            aria-selected="${activeTab === tab.id ? "true" : "false"}"
          >
            <span>${escapeHtml(tab.label)}</span>
            <em>${escapeHtml(tab.detail)}</em>
          </button>
        `).join("")}
      </div>
      <div class="adventure-tab-content" data-adventure-tab-content>
        ${renderAdventureTabContent(activeTab, tournament)}
      </div>
    </div>
  `;
}

function getActiveAdventureTab(tournament) {
  const validTabs = new Set(["log", "events", "reward", "recruitment"]);
  if (!validTabs.has(tournament.activeAdventureTab)) {
    tournament.activeAdventureTab = getDefaultAdventureTab(tournament);
  }
  return tournament.activeAdventureTab;
}

function getDefaultAdventureTab(tournament) {
  if (tournament.currentRecruitment) {
    return "recruitment";
  }
  if (tournament.currentReward) {
    return "reward";
  }
  if (tournament.currentCampaignEvent || tournament.replacementRequest) {
    return "events";
  }
  return "log";
}

function getLogTabDetail(tournament) {
  if (tournament.awaitingPathChoice) {
    return "Camino";
  }
  if (tournament.currentMatch) {
    return tournament.combatComplete ? "Resultado" : "En vivo";
  }
  return `${tournament.completedMatches?.length || 0}`;
}

function renderAdventureTabContent(tabId, tournament) {
  if (tabId === "events") {
    return renderAdventureEventsTab(tournament);
  }
  if (tabId === "reward") {
    return renderAdventureRewardTab(tournament);
  }
  if (tabId === "recruitment") {
    return renderAdventureRecruitmentTab(tournament);
  }
  return renderAdventureLogTab(tournament);
}

function renderAdventureLogTab(tournament) {
  const sections = [];

  if (tournament.awaitingPathChoice) {
    sections.push(`
      <section class="adventure-tab-section">
        <div class="panel-heading">
          <h3>Elegir camino</h3>
        </div>
        ${renderPathChoices(tournament)}
      </section>
    `);
  }

  if (tournament.currentMatch) {
    sections.push(`
      <section class="adventure-tab-section">
        <div class="panel-heading">
          <h3>Combate actual</h3>
          <button type="button" class="icon-button narrator-toggle" data-action="toggle-narrator" aria-label="${tournament.narratorMinimized ? "Expandir narrador" : "Minimizar narrador"}">${tournament.narratorMinimized ? "+" : "-"}</button>
        </div>
        ${renderCurrentCombat(tournament.currentMatch, tournament)}
      </section>
    `);
  }

  if (!sections.length) {
    sections.push(`<div class="empty-state">${tournament.waitingForNext ? "Listo para avanzar." : "Preparando el camino..."}</div>`);
  }

  sections.push(`
    <section class="adventure-tab-section">
      <div class="panel-heading">
        <h3>Bitacora de combate</h3>
      </div>
      ${renderMatchHistory(tournament)}
    </section>
  `);

  return sections.join("");
}

function renderAdventureEventsTab(tournament) {
  const events = tournament.campaignEvents || [];
  if (!events.length) {
    return `<div class="empty-state">Todavia no ocurrio ningun evento de camino.</div>`;
  }

  return `
    <div class="adventure-event-list">
      ${[...events].reverse().map((event) =>
        renderCampaignEvent(event, tournament, event === tournament.currentCampaignEvent ? tournament.replacementRequest : null)
      ).join("")}
    </div>
  `;
}

function renderAdventureRewardTab(tournament) {
  if (tournament.currentReward) {
    return renderRewardPanel(tournament.currentReward, false);
  }
  if (tournament.boons?.length) {
    return renderBoonHistory(tournament);
  }
  return `<div class="empty-state">No hay recompensa pendiente. Gana un combate para abrir botin nuevo.</div>`;
}

function renderAdventureRecruitmentTab(tournament) {
  if (tournament.currentRecruitment) {
    return renderRecruitmentPanel(tournament.currentRecruitment);
  }
  return `<div class="empty-state">No hay reclutamiento disponible ahora. Despues de una victoria puede aparecer una party para sumar personajes.</div>`;
}

function restoreTournamentScroll(options = {}, previousScrollY = null) {
  if ((!options.preserveScroll && !options.focusSelector) || typeof window === "undefined") {
    return;
  }

  const restore = () => {
    const focusNode = options.focusSelector ? app.querySelector(options.focusSelector) : null;
    if (focusNode) {
      focusNode.scrollIntoView({ block: "nearest", behavior: "auto" });
      return;
    }
    if (previousScrollY !== null && typeof window.scrollTo === "function") {
      window.scrollTo({ top: previousScrollY, behavior: "auto" });
    }
  };

  if (typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(restore);
    return;
  }
  window.setTimeout(restore, 0);
}

function renderAdventurePartyEditor() {
  const tournament = state.tournament;
  if (!tournament) {
    renderFormation();
    return;
  }

  state.screen = "adventure-party";
  state.draftedCharacters = tournament.playerTeam.members || [];
  state.assignments = { ...(tournament.playerTeam.assignments || {}) };
  syncAssignmentsWithDraftedCharacters();
  tournament.playerTeam.assignments = { ...state.assignments };
  refreshPlayerTeamScore(tournament);

  const score = tournament.playerTeam.score || calculatePartyScore(tournament.playerTeam);
  const activeCount = getActiveCombatRoster(tournament.playerTeam.members, tournament.playerTeam.assignments).length;
  const coveredCount = score.assignedCharacters?.length || 0;
  const benchCount = Math.max(0, (tournament.playerTeam.members || []).length - activeCount);

  app.innerHTML = `
    <section class="screen">
      <header class="screen-header">
        <div>
          <span class="status-pill">Party del viaje</span>
          <h2>${escapeHtml(tournament.playerTeam.name)}</h2>
          <p class="lead">Edita puestos, revisa personajes y vuelve al mapa sin reiniciar la aventura. Los cambios de roles aplican al siguiente calculo de score.</p>
        </div>
        <div class="toolbar">
          <button class="ghost-button" data-action="back-to-adventure">Volver al viaje</button>
          <button class="ghost-button" data-action="gallery">Galeria</button>
          <button class="ghost-button" data-action="restart">Reiniciar</button>
          ${renderAudioSettings("compact")}
        </div>
      </header>
      <div class="formation-stack adventure-party-editor">
        <section class="panel assignment-panel">
          <div class="assignment-panel-header">
            <div>
              <h3>Puestos activos</h3>
              <p class="party-editor-note" data-adventure-party-note>${coveredCount}/5 puestos cubiertos. ${activeCount}/5 personajes cuentan para el combate${benchCount ? `, ${benchCount} ${benchCount === 1 ? "queda" : "quedan"} en reserva` : ""}.</p>
            </div>
            <div class="button-row">
              <button type="button" class="ghost-button" data-action="auto">Auto asignar</button>
            </div>
          </div>
          <div class="assignment-top-grid">
            <div class="score-anchor" data-formation-score>
              ${renderAssignmentScoreBox(score)}
            </div>
            <div class="role-list compact-role-list" data-formation-roles>
              ${ROLE_ORDER.map(renderRoleSelector).join("")}
            </div>
          </div>
        </section>
        <div class="card-grid" data-formation-cards>
          ${state.draftedCharacters.map(renderFullCard).join("")}
        </div>
      </div>
    </section>
  `;

  app.querySelector(".screen").addEventListener("change", handleFormationChange);
  app.querySelector("[data-action='back-to-adventure']").addEventListener("click", () => {
    tournament.playerTeam.assignments = { ...state.assignments };
    refreshPlayerTeamScore(tournament);
    renderTournament();
  });
  app.querySelector("[data-action='gallery']").addEventListener("click", openImageGallery);
  app.querySelector("[data-action='restart']").addEventListener("click", confirmRestartGame);
  app.querySelector("[data-action='auto']").addEventListener("click", () => {
    state.assignments = autoAssignRoles(state.draftedCharacters);
    tournament.playerTeam.assignments = { ...state.assignments };
    refreshPlayerTeamScore(tournament);
    syncCurrentAssignmentUI({ preserveUi: true });
  });
  bindAudioControls(app);
}

function syncAdventurePartyEditorUI() {
  const tournament = state.tournament;
  if (!tournament) {
    syncFormationUI();
    return;
  }

  syncAssignmentsWithDraftedCharacters();
  tournament.playerTeam.members = state.draftedCharacters;
  tournament.playerTeam.assignments = { ...state.assignments };
  refreshPlayerTeamScore(tournament);

  const score = tournament.playerTeam.score || calculatePartyScore(tournament.playerTeam);
  const activeCount = getActiveCombatRoster(tournament.playerTeam.members, tournament.playerTeam.assignments).length;
  const coveredCount = score.assignedCharacters?.length || 0;
  const benchCount = Math.max(0, (tournament.playerTeam.members || []).length - activeCount);
  const cardsNode = app.querySelector("[data-formation-cards]");
  const rolesNode = app.querySelector("[data-formation-roles]");
  const scoreNode = app.querySelector("[data-formation-score]");
  const noteNode = app.querySelector("[data-adventure-party-note]");

  if (cardsNode) {
    cardsNode.innerHTML = state.draftedCharacters.map(renderFullCard).join("");
  }
  if (rolesNode) {
    rolesNode.innerHTML = ROLE_ORDER.map(renderRoleSelector).join("");
  }
  if (scoreNode) {
    scoreNode.innerHTML = renderAssignmentScoreBox(score);
  }
  if (noteNode) {
    noteNode.textContent = `${coveredCount}/5 puestos cubiertos. ${activeCount}/5 personajes cuentan para el combate${benchCount ? `, ${benchCount} ${benchCount === 1 ? "queda" : "quedan"} en reserva` : ""}.`;
  }
}

function renderTournamentScoreboard(tournament) {
  const snapshot = getTournamentScoreSnapshot(tournament);
  const modifierClass = snapshot.eventModifier > 0
    ? "buff"
    : snapshot.eventModifier < 0 ? "nerf" : "";

  return `
    <div class="tournament-scoreboard">
      <div class="score-tile cr-total">
        <span>Progreso</span>
        <strong>${snapshot.progress}</strong>
      </div>
      <div class="score-tile">
        <span>${snapshot.hasEventImpact ? "Score previo" : "Score base"}</span>
        <strong>${snapshot.baseScore}</strong>
      </div>
      <div class="score-tile ${modifierClass}">
        <span>${snapshot.hasEventImpact ? "Impacto" : "Evento"}</span>
        <strong>${formatModifier(snapshot.eventModifier)}</strong>
      </div>
      <div class="score-tile current-score">
        <span>Score actual</span>
        <strong>${snapshot.currentScore}</strong>
      </div>
      <div class="score-tile">
        <span>Mejoras</span>
        <strong>${snapshot.boons}</strong>
      </div>
    </div>
  `;
}

function getTournamentScoreSnapshot(tournament) {
  const currentBaseScore = tournament.playerTeam.score.finalScore;
  const hasEventImpact = tournament.scoreBeforeCurrentEvent !== null && tournament.scoreBeforeCurrentEvent !== undefined;
  const baseScore = hasEventImpact ? tournament.scoreBeforeCurrentEvent : currentBaseScore;
  const fallbackEventDelta = currentBaseScore + (tournament.playerTeam.campaignModifier || 0) - baseScore;
  const eventModifier = hasEventImpact
    ? Number(tournament.currentEventScoreDelta ?? fallbackEventDelta)
    : tournament.playerTeam.campaignModifier || 0;
  const activeRoster = getActiveCombatRoster(tournament.playerTeam.members || [], tournament.playerTeam.assignments || {});

  return {
    totalCR: formatCRNumber(getPartyTotalCR(activeRoster)),
    progress: `${tournament.completedCombats || 0}/${tournament.maxCombats || ADVENTURE_MAX_COMBATS}`,
    baseScore,
    eventModifier,
    hasEventImpact,
    boons: tournament.boons?.length || 0,
    currentScore: Math.max(1, baseScore + eventModifier)
  };
}

function renderCurrentCombat(match, tournament) {
  const revealResult = tournament.combatComplete;
  const visibleResult = revealResult ? match.result : "En combate";
  const minimized = Boolean(tournament.narratorMinimized);
  const resultClass = revealResult
    ? match.result === "Victoria" ? "win" : match.result === "Empate" ? "draw" : "loss"
    : "fighting";

  return `
    <article class="match-card ${resultClass}">
      <div class="match-title">
        <strong>${escapeHtml(match.phase)}</strong>
        <span class="match-score">${escapeHtml(visibleResult)}</span>
      </div>
      ${renderClashAnimation(match, revealResult)}
      ${renderMatchNumbers(match)}
      ${minimized
        ? `<div class="combat-next-note compact">Narrador minimizado. Expandilo para leer los detalles del combate.</div>`
        : `<div class="combat-log" data-combat-log>${renderCombatLogContent(tournament)}</div>`}
      ${tournament.combatComplete && tournament.pendingReward ? `
        <div class="combat-next-note combat-continue-box">
          <span>Combate terminado. Lee la bitacora con calma y continua cuando estes listo.</span>
          <button type="button" data-action="next-combat">${escapeHtml(getNextCombatButtonLabel(tournament))}</button>
        </div>
      ` : tournament.combatComplete && tournament.waitingForNext ? `<div class="combat-next-note">Combate terminado. Avanza cuando quieras.</div>` : ""}
    </article>
  `;
}

function renderClashAnimation(match, revealResult) {
  const resultClass = revealResult
    ? match.result === "Victoria" ? "win" : "loss"
    : "fighting";
  const resultText = revealResult
    ? match.result === "Victoria" ? "Victoria" : "Derrota"
    : "Choque en curso";

  return `
    <div class="clash-arena ${resultClass}" aria-live="polite">
      <div class="sword-clash" aria-hidden="true">
        <span class="sword sword-left"></span>
        <span class="sword sword-right"></span>
        <span class="clash-impact"></span>
      </div>
      <div class="clash-copy">
        <span>${escapeHtml(match.enemy.name)}</span>
        <strong>${escapeHtml(resultText)}</strong>
      </div>
    </div>
  `;
}

function renderCampaignEvent(event, tournament, replacementRequestOverride) {
  const type = event.type || "neutral";
  const typeLabel = type === "blessing"
    ? "Bendicion de campaña"
    : type === "misfortune"
      ? "Desgracia pre-combate"
      : "Evento pre-combate";
  const modifierText = getCampaignEventImpactText(event);
  const replacementRequest = replacementRequestOverride !== undefined
    ? replacementRequestOverride
    : tournament.replacementRequest;
  const canContinueFromEvent = event === tournament.currentCampaignEvent
    && tournament.waitingForNext
    && !replacementRequest;

  return `
    <article class="campaign-event-card ${type}">
      <span class="status-pill">${typeLabel}</span>
      <h4>${escapeHtml(event.title || "Evento de campaña")}</h4>
      ${renderCampaignEventArt(event)}
      <p>${escapeHtml(event.text || "")}</p>
      ${event.sourcePartyName ? `<p class="campaign-source">Origen: ${escapeHtml(event.sourcePartyName)}</p>` : ""}
      ${renderCampaignEffectLog(event)}
      <div class="campaign-event-actions">
        <strong class="campaign-event-modifier">${escapeHtml(modifierText)}</strong>
        ${canContinueFromEvent ? `<button type="button" data-action="next-combat">${escapeHtml(getNextCombatButtonLabel(tournament))}</button>` : ""}
      </div>
      ${replacementRequest ? renderReplacementRequest(replacementRequest) : ""}
    </article>
  `;
}

function renderCampaignEventArt(event) {
  return `
    <div class="campaign-event-art">
      <img src="assets/portraits/evento.webp" alt="${escapeHtml(event.title || "Evento")}" loading="lazy">
    </div>
  `;
}

function renderPathChoices(tournament) {
  const choices = tournament.pathChoices || [];

  if (!choices.length) {
    return `<div class="empty-state">El mapa se esta dibujando...</div>`;
  }

  return `
    <div class="path-choice-grid">
      ${choices.map((choice) => renderPathChoiceCard(choice, tournament)).join("")}
    </div>
  `;
}

function renderPathChoiceCard(choice, tournament) {
  const enemy = choice.enemy;
  const playerScore = tournament.playerTeam.score.finalScore;
  const delta = enemy.score.finalScore - playerScore;
  const difficulty = getPathDifficultyLabel(delta);
  const eventChance = formatEventChance(choice.eventChance);

  return `
    <article class="path-card ${difficulty.className}">
      <div class="path-card-top">
        <span class="status-pill">${escapeHtml(choice.label)}</span>
        <span class="path-risk">${escapeHtml(difficulty.label)}</span>
      </div>
      <h4>${escapeHtml(enemy.name)}</h4>
      <p>${escapeHtml(enemy.theme || "Una party rival bloquea esta ruta.")}</p>
      <div class="combat-stats path-stats">
        <div><span>Amenaza</span><strong>${escapeHtml(difficulty.label)}</strong></div>
        <div><span>Evento</span><strong>${eventChance}</strong></div>
        <div><span>Recompensa</span><strong>Oculta hasta vencer</strong></div>
        <div><span>Lectura</span><strong>${escapeHtml(difficulty.text)}</strong></div>
      </div>
      <button data-path-choice="${choice.id}">Tomar camino</button>
    </article>
  `;
}

function renderRewardPanel(reward, minimized = false) {
  if (minimized) {
    return `
      <article class="campaign-event-card blessing reward-card collapsed-reward">
        <span class="status-pill">Recompensa de combate</span>
        <h4>Recompensa pendiente</h4>
        <p>Ganaste el combate. Abri este panel cuando quieras descubrir y elegir la recompensa.</p>
        <button type="button" class="ghost-button reward-open-button" data-action="toggle-reward">Abrir recompensa</button>
      </article>
    `;
  }

  return `
    <article class="campaign-event-card blessing reward-card">
      <span class="status-pill">Recompensa de combate</span>
      <h4>${escapeHtml(reward.title)}</h4>
      <p>${escapeHtml(reward.text)}</p>
      <div class="reward-grid">
        ${reward.options.map((option) => `
          <button type="button" class="reward-option" data-reward-choice="${option.id}">
            <strong>${escapeHtml(option.title)}</strong>
            <span>${escapeHtml(option.text)}</span>
            <em>${escapeHtml(option.effectText || "Mejora concreta para la party")}</em>
          </button>
        `).join("")}
      </div>
    </article>
  `;
}

function renderRecruitmentPanel(recruitment) {
  return `
    <article class="campaign-event-card blessing reward-card recruitment-card">
      <span class="status-pill">Reclutamiento por victoria</span>
      <h4>${escapeHtml(recruitment.partyName)}</h4>
      <p>${escapeHtml(recruitment.theme || "Una party aleatoria ofrece un nuevo aliado para el viaje.")}</p>
      <p class="campaign-source">Elige 1 personaje. Si ya tienes cinco activos, quedara en reserva hasta que edites puestos.</p>
      <div class="reward-grid recruit-grid">
        ${recruitment.options.map(renderRecruitmentOption).join("")}
      </div>
      <div class="button-row">
        <button type="button" class="ghost-button" data-action="skip-recruitment">Seguir sin reclutar</button>
      </div>
    </article>
  `;
}

function renderRecruitmentOption(character) {
  const tags = getDisplayTags(character);
  const armorClass = getCharacterArmorClass(character);

  return `
    <button type="button" class="reward-option recruit-option" data-recruit-choice="${character.id}">
      <strong>${escapeHtml(character.name)}</strong>
      <span>${escapeHtml(character.className)} - ${escapeHtml(character.subclass)}</span>
      <span>Level ${character.level} - AC ${armorClass}</span>
      <em>${tags.length ? tags.map(getTagLabel).join(" / ") : "Sin tags visibles"}</em>
    </button>
  `;
}

function getPathDifficultyLabel(delta) {
  if (delta <= -45) return { label: "Seguro", className: "safe", text: "Tu party parece tener ventaja." };
  if (delta <= -10) return { label: "Parejo", className: "steady", text: "La ruta se ve manejable." };
  if (delta <= 25) return { label: "Duro", className: "hard", text: "Puede salir caro." };
  return { label: "Peligroso", className: "danger", text: "La amenaza se ve muy alta." };
}

function formatEventChance(value) {
  return `${Math.round(clamp(Number(value || 0), 0, 1) * 100)}%`;
}

function renderCampaignEffectLog(event) {
  if (!Array.isArray(event.resolvedEffects) || !event.resolvedEffects.length) {
    return "";
  }

  return `
    <div class="campaign-effect-log">
      ${event.resolvedEffects.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
    </div>
  `;
}

function getCampaignEventImpactText(event) {
  if (Number.isFinite(Number(event.scoreDelta)) && event.scoreBefore !== undefined) {
    return `Score ${event.scoreBefore} -> ${event.scoreAfter} (${formatModifier(event.scoreDelta)})`;
  }
  if (event.scoreModifier) {
    return `${formatModifier(event.scoreModifier)} al score de la party`;
  }
  if (Array.isArray(event.resolvedEffects) && event.resolvedEffects.length) {
    return event.type === "misfortune" ? "Consecuencia aplicada" : "Mejora aplicada";
  }
  return "Sin efecto directo";
}

function renderReplacementRequest(request) {
  return `
    <div class="replacement-panel">
      <div>
        <span class="meta-label">Reemplazo obligatorio</span>
        <h5>${escapeHtml(request.title || "Elige un suplente")}</h5>
        <p>${escapeHtml(request.text || "Un personaje quedo fuera. Elige quien toma su lugar antes del combate.")}</p>
      </div>
      <div class="replacement-grid">
        ${request.candidates.map(renderReplacementCard).join("")}
      </div>
    </div>
  `;
}

function renderReplacementCard(character) {
  const tags = getDisplayTags(character);
  const revealRating = false;
  const ratingClass = getVisibleRatingClass(character, revealRating);

  return `
    <article class="character-card compact replacement-card ${ratingClass} ${hasTag(character, "especial") ? "special-card" : ""}">
      <div class="card-top">
        <div class="card-rating ${shouldRevealCharacterCR(revealRating) ? "" : "hidden-rating"}">
          <span>${getVisibleRatingLabel(revealRating)}</span>
          <strong>${getVisibleRatingValue(character, revealRating)}</strong>
        </div>
        <div class="card-identity">
          <span class="meta-label">Suplente</span>
          <h3>${escapeHtml(character.name)}</h3>
          <p class="class-line">${escapeHtml(character.className)} - ${escapeHtml(character.subclass)}</p>
        </div>
      </div>
      <div class="card-meta">
        <span class="badge gold">Level ${character.level}</span>
        <span class="badge gold">AC ${getCharacterArmorClass(character)}</span>
        ${tags.map((tag) => `<span class="badge ${getTagBadgeClass(tag)}">${escapeHtml(getTagLabel(tag))}</span>`).join("")}
      </div>
      <div class="card-footer">
        <button data-replacement-pick="${character.id}">Reemplazar</button>
      </div>
    </article>
  `;
}

function renderCombatLogContent(tournament) {
  const typedLine = tournament.typedEvent
    ? `<p class="typing-line">${escapeHtml(tournament.typedEvent)}<span class="typing-caret">|</span></p>`
    : "";

  return `
    ${tournament.visibleEvents.map((event) => `<p>${escapeHtml(event)}</p>`).join("")}
    ${typedLine}
  `;
}

function updateCombatLog() {
  const tournament = state.tournament;
  const log = app.querySelector("[data-combat-log]");

  if (!tournament || !log) {
    return;
  }

  log.innerHTML = renderCombatLogContent(tournament);
}

function renderMatchHistory(tournament) {
  if (!tournament.completedMatches.length && !tournament.boons?.length) {
    return `<div class="empty-state">Aun no termino ningun combate.</div>`;
  }

  const lastIndex = tournament.completedMatches.length - 1;

  return `
    ${renderBoonHistory(tournament)}
    <div class="match-list history-list">
      ${tournament.completedMatches.map((match, index) => renderCompletedMatchCard(match, index === lastIndex)).join("")}
    </div>
  `;
}

function renderBoonHistory(tournament) {
  const boons = tournament.boons || [];
  if (!boons.length) {
    return "";
  }

  return `
    <div class="boon-history">
      <h4>Mejoras obtenidas</h4>
      ${boons.map((boon, index) => renderBoonCard(boon, index)).join("")}
    </div>
  `;
}

function renderBoonCard(boon, index) {
  const details = Array.isArray(boon.details) ? boon.details : [];
  const targetText = details[0]?.characterName || "Party";
  const scoreText = getBoonScoreText(boon);

  return `
    <details class="boon-card">
      <summary>
        <span>
          <strong>${escapeHtml(boon.title || `Mejora ${index + 1}`)}</strong>
          <small>${escapeHtml(targetText)} - ${escapeHtml(boon.effectText || boon.text || "Mejora aplicada")}${scoreText ? ` - ${scoreText}` : ""}</small>
        </span>
        <em>Ver mejora</em>
      </summary>
      <div class="boon-content">
        <p>${escapeHtml(boon.text || "")}</p>
        ${scoreText ? `<div class="boon-score-impact">${escapeHtml(scoreText)}</div>` : ""}
        ${details.length ? `<div class="boon-detail-grid">${details.map(renderBoonEffectDetail).join("")}</div>` : ""}
      </div>
    </details>
  `;
}

function getBoonScoreText(boon) {
  if (!Number.isFinite(Number(boon.scoreDelta))) {
    return "";
  }

  return `Score ${boon.scoreBefore} -> ${boon.scoreAfter} (${formatModifier(boon.scoreDelta)})`;
}

function renderBoonEffectDetail(detail) {
  const metric = getEffectMetricText(detail);

  return `
    <article class="boon-effect-detail">
      <span class="meta-label">${escapeHtml(detail.label || "Mejora")}</span>
      <strong>${escapeHtml(detail.characterName || "Party")}</strong>
      <small>${escapeHtml([detail.className, detail.subclass].filter(Boolean).join(" - "))}</small>
      ${metric ? `<div class="boon-metric">${metric}</div>` : ""}
      <p>${escapeHtml(detail.summary || "")}</p>
    </article>
  `;
}

function getEffectMetricText(detail) {
  if (detail.before !== undefined && detail.after !== undefined && detail.stat) {
    return `<span>${escapeHtml(detail.stat)}</span><strong>${escapeHtml(detail.before)} -> ${escapeHtml(detail.after)}</strong>`;
  }
  if (detail.spell) {
    return `<span>Spell</span><strong>${escapeHtml(detail.spell)}</strong>`;
  }
  if (detail.feature) {
    return `<span>Rasgo</span><strong>${escapeHtml(detail.feature)}</strong>`;
  }
  if (Number.isFinite(Number(detail.amount))) {
    return `<span>Score</span><strong>${formatModifier(detail.amount)}</strong>`;
  }
  return "";
}

function renderCompletedMatchCard(match, openByDefault = false) {
  const resultClass = match.result === "Victoria" ? "win" : match.result === "Empate" ? "draw" : "loss";
  const threat = getCombatThreat(match);

  return `
    <details class="match-card history-card ${resultClass}" ${openByDefault ? "open" : ""}>
      <summary class="history-summary">
        <span class="history-main">
          <strong>${escapeHtml(match.phase)} vs ${escapeHtml(match.enemy.name)}</strong>
          <small>${escapeHtml(match.result)} - Amenaza ${escapeHtml(threat.label)} - ${escapeHtml(match.playerName || "Tu party")}</small>
        </span>
        <span class="match-score">${escapeHtml(match.result)}</span>
      </summary>
      <div class="history-content">
        ${renderMatchNumbers(match)}
        <p class="narrative">${escapeHtml(match.narrative)}</p>
        ${renderCompletedCombatLog(match)}
      </div>
    </details>
  `;
}

function renderCompletedCombatLog(match) {
  if (!Array.isArray(match.events) || !match.events.length) {
    return "";
  }

  return `
    <div class="combat-log history-combat-log">
      ${match.events.map((event) => `<p>${escapeHtml(event)}</p>`).join("")}
    </div>
  `;
}

function renderMatchNumbers(match) {
  const playerCampaignText = match.playerCampaignModifier
    ? ` ${formatModifier(match.playerCampaignModifier)} evento`
    : "";
  const hasEventImpact = Number.isFinite(Number(match.playerEventImpact)) &&
    match.playerEventImpact !== 0 &&
    Number.isFinite(Number(match.playerScoreBeforeEvent));
  const playerScoreText = hasEventImpact
    ? `${match.playerScoreBeforeEvent} ${formatModifier(match.playerEventImpact)} evento = ${match.playerBaseScore}`
    : `${match.playerRawScore || match.playerBaseScore}${playerCampaignText}`;
  const threat = getCombatThreat(match);

  return `
    <div class="combat-stats">
      <div><span>Party enemiga</span><strong>${escapeHtml(match.enemy.name)}</strong></div>
      <div><span>Amenaza estimada</span><strong>${escapeHtml(threat.label)}</strong></div>
      <div><span>${escapeHtml(match.playerName || "Tu party")}</span><strong>${playerScoreText} (${formatModifier(match.playerModifier)} azar) = ${match.playerScore}</strong></div>
      <div><span>Azar del combate</span><strong>Tu party ${formatModifier(match.playerModifier)} / Rival ${formatModifier(match.enemyModifier)}</strong></div>
    </div>
  `;
}

function getCombatThreat(match) {
  return getPathDifficultyLabel((match.enemyBaseScore || 0) - (match.playerRawScore || match.playerBaseScore || 0));
}

function renderTournamentRoute(tournament) {
  const totalCombats = tournament.maxCombats || ADVENTURE_MAX_COMBATS;
  const completed = tournament.completedCombats || 0;
  const remaining = Math.max(0, totalCombats - completed);
  const currentStep = Math.min(totalCombats, (tournament.nextCombatIndex || completed) + 1);
  const progress = totalCombats ? Math.round((completed / totalCombats) * 100) : 0;
  const lastMatch = tournament.completedMatches[tournament.completedMatches.length - 1];
  const currentLabel = tournament.awaitingPathChoice
    ? "Elegir camino"
    : tournament.currentCampaignEvent
      ? "Evento de camino"
      : tournament.currentReward
        ? "Elegir mejora"
        : tournament.currentMatch
          ? "Combate en curso"
          : tournament.waitingForNext
            ? "Listo para avanzar"
            : "Preparando ruta";

  return `
    <div class="journey-notice">
      <div class="journey-count">
        <span>Faltan</span>
        <strong>${remaining}</strong>
        <em>${remaining === 1 ? "combate" : "combates"}</em>
      </div>
      <div class="journey-progress" aria-label="Progreso del viaje">
        <span style="width:${progress}%"></span>
      </div>
      <div class="route-list compact-route-list">
        <div class="standing-row player-row">
          <strong>Tramo actual</strong>
          <span class="standing-stats">${currentStep}/${totalCombats}</span>
        </div>
        <div class="standing-row">
          <strong>Estado</strong>
          <span class="standing-stats">${escapeHtml(currentLabel)}</span>
        </div>
        <div class="standing-row ${lastMatch?.result === "Victoria" ? "player-row" : ""}">
          <strong>Ultimo combate</strong>
          <span class="standing-stats">${lastMatch ? `${escapeHtml(lastMatch.result)} vs ${escapeHtml(lastMatch.enemy.name)}` : "Ninguno"}</span>
        </div>
        <div class="standing-row ${tournament.boons?.length ? "player-row" : ""}">
          <strong>Mejoras</strong>
          <span class="standing-stats">${tournament.boons?.length || 0} activas</span>
        </div>
        <div class="standing-row ${tournament.extraLives?.length ? "player-row" : ""}">
          <strong>Vidas extra</strong>
          <span class="standing-stats">${tournament.extraLives?.length || 0}</span>
        </div>
      </div>
    </div>
  `;
}

function renderAdventureMap(tournament, steps) {
  const allPoints = ADVENTURE_MAP_POINTS.map(formatMapPoint).join(" ");
  const progressCount = clamp((tournament.completedCombats || 0) + 1, 1, ADVENTURE_MAP_POINTS.length);
  const progressPoints = ADVENTURE_MAP_POINTS.slice(0, progressCount).map(formatMapPoint).join(" ");
  const branchData = getAdventureMapBranches(tournament);

  return `
    <div class="adventure-map-shell">
      <div class="adventure-map" aria-label="Mapa del viaje">
        <svg class="map-trails" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polyline class="map-trail-base" points="${allPoints}" />
          ${progressPoints.includes(" ") ? `<polyline class="map-trail-progress" points="${progressPoints}" />` : ""}
          ${branchData.lines}
        </svg>
        ${ADVENTURE_MAP_POINTS.map((point, index) => renderAdventureMapNode(point, steps[index], tournament)).join("")}
        ${branchData.nodes}
      </div>
      ${branchData.legend}
    </div>
  `;
}

function renderAdventureMapNode(point, step, tournament) {
  const isCompleted = indexIsCompleted(tournament, step.index);
  const className = [
    "map-node",
    isCompleted ? "completed" : "",
    step.active ? "active" : "",
    step.match?.result === "Derrota" ? "lost" : ""
  ].filter(Boolean).join(" ");

  return `
    <div class="${className}" style="left:${point.x}%; top:${point.y}%;" title="${escapeHtml(step.status)}">
      <span>${step.index + 1}</span>
    </div>
  `;
}

function getAdventureMapBranches(tournament) {
  if (!tournament.awaitingPathChoice || !tournament.pathChoices?.length) {
    return { lines: "", nodes: "", legend: "" };
  }

  const start = ADVENTURE_MAP_POINTS[clamp(tournament.nextCombatIndex || 0, 0, ADVENTURE_MAP_POINTS.length - 1)];
  const branches = tournament.pathChoices.map((choice, index) => {
    const yOffset = index === 0 ? -24 : 24;
    const point = {
      x: clamp(start.x + 20, 18, 92),
      y: clamp(start.y + yOffset, 16, 84)
    };
    const difficulty = getPathDifficultyLabel(choice.enemy.score.finalScore - tournament.playerTeam.score.finalScore);
    return { choice, point, difficulty, label: index === 0 ? "A" : "B" };
  });

  return {
    lines: branches.map(({ point }) =>
      `<line class="map-trail-branch" x1="${start.x}" y1="${start.y}" x2="${point.x}" y2="${point.y}" />`
    ).join(""),
    nodes: branches.map(({ choice, point, difficulty, label }) => `
      <div class="map-branch-node ${difficulty.className}" style="left:${point.x}%; top:${point.y}%;" title="${escapeHtml(choice.enemy.name)}">
        <span>${label}</span>
      </div>
    `).join(""),
    legend: `
      <div class="map-choice-legend">
        ${branches.map(({ choice, difficulty, label }) => `
          <button class="map-choice-pill ${difficulty.className}" data-path-choice="${choice.id}">
            <strong>${label}</strong>
            <span>${escapeHtml(difficulty.label)}</span>
            <em>${formatEventChance(choice.eventChance)}</em>
          </button>
        `).join("")}
      </div>
    `
  };
}

function indexIsCompleted(tournament, index) {
  return index < (tournament.completedCombats || 0);
}

function formatMapPoint(point) {
  return `${point.x},${point.y}`;
}

function renderVictoryFireworks(tournament) {
  const partyName = tournament.playerTeam.name;
  const letters = [...partyName].map((letter, index) => `
    <span style="--letter-index:${index}">${letter === " " ? "&nbsp;" : escapeHtml(letter)}</span>
  `).join("");

  return `
    <div class="victory-fireworks" data-party-name="${escapeHtml(partyName)}" aria-hidden="true">
      <div class="firework burst-a"></div>
      <div class="firework burst-b"></div>
      <div class="firework burst-c"></div>
      <div class="firework burst-d"></div>
      <div class="firework-name">${letters}</div>
    </div>
  `;
}

function createLiveTournament(playerTeam) {
  playerTeam.campaignModifier = playerTeam.campaignModifier || 0;

  const adventure = {
    playerTeam,
    maxCombats: ADVENTURE_MAX_COMBATS,
    nextCombatIndex: 0,
    completedCombats: 0,
    pathChoices: [],
    awaitingPathChoice: false,
    usedPartyIds: [],
    boons: [],
    rewardOptionHistory: [],
    extraLives: [],
    completedMatches: [],
    currentMatch: null,
    currentCampaignEvent: null,
    scoreBeforeCurrentEvent: null,
    currentEventScoreDelta: 0,
    fallenMembers: [],
    campaignEvents: [],
    campaignEventRoundIndexes: [],
    campaignSpecialIdsSeen: [],
    unlockedSpecialIds: [],
    pendingCombat: null,
    pendingReward: null,
    currentReward: null,
    rewardMinimized: true,
    currentRecruitment: null,
    activeAdventureTab: "log",
    replacementRequest: null,
    waitingForReplacement: false,
    visibleEvents: [],
    typedEvent: "",
    combatComplete: false,
    narratorMinimized: false,
    waitingForNext: false,
    pendingFinish: null,
    pendingRetry: null,
    activeRetryBonus: 0,
    finished: false,
    champion: false,
    finalTitle: "",
    statusText: "El mapa se abre: elige el primer camino."
  };

  refreshPlayerTeamScore(adventure);
  prepareAdventurePathChoices(adventure);
  return adventure;
}

function queueNextCombat() {
  clearCombatTimer();
  const tournament = state.tournament;
  if (!tournament || tournament.finished) {
    return;
  }

  if (tournament.maxCombats) {
    if (tournament.completedCombats >= tournament.maxCombats) {
      finishTournament("Expedicion completada", `${tournament.playerTeam.name} sobrevivio a los siete combates del camino.`, true);
      return;
    }
    if (!tournament.pathChoices.length) {
      prepareAdventurePathChoices(tournament);
    }
    renderTournament();
    return;
  }

  prepareAdventurePathChoices(tournament);
  renderTournament();
}

function startLiveCombat(enemy, phase, stage) {
  const tournament = state.tournament;
  audioManager.fadeMusicTo("tournament");
  audioManager.playSfx("combatStart");
  const match = simulatePlayerCombat(tournament.playerTeam, enemy, phase, stage);
  match.journeyIndex = tournament.nextCombatIndex || 0;
  tournament.currentMatch = match;
  tournament.activeAdventureTab = "log";
  tournament.awaitingPathChoice = false;
  tournament.visibleEvents = [];
  tournament.typedEvent = "";
  tournament.combatComplete = false;
  tournament.narratorMinimized = false;
  tournament.waitingForNext = false;
  tournament.pendingFinish = null;
  tournament.statusText = `${phase}: ${enemy.name}`;
  renderTournament();
  revealCombatEvents(match);
}

function startCampaignPreCombat(enemy, phase, stage, roundIndex) {
  const tournament = state.tournament;
  if (!tournament || tournament.finished) {
    return;
  }

  clearCampaignScoreImpact(tournament);
  tournament.playerTeam.campaignModifier = 0;
  refreshPlayerTeamScore(tournament);
  const event = tournament.maxCombats
    ? rollTravelEvent(tournament, enemy, phase)
    : rollCampaignEvent(tournament, enemy, phase) || createQuietCampaignEvent(phase);
  markCampaignEventScoreStart(tournament, event);
  event.phase = phase;
  event.roundIndex = roundIndex;
  event.journeyIndex = roundIndex;
  tournament.currentCampaignEvent = event;
  tournament.activeAdventureTab = "events";
  tournament.campaignEvents.push(event);
  tournament.campaignEventRoundIndexes.push(roundIndex);
  tournament.pendingCombat = { enemy, phase, stage, roundIndex };
  tournament.currentMatch = null;
  tournament.replacementRequest = null;
  tournament.waitingForReplacement = false;
  tournament.visibleEvents = [];
  tournament.typedEvent = "";
  tournament.combatComplete = false;
  tournament.pendingFinish = null;
  applyCampaignEventModifier(tournament, event);
  applyCampaignEventEffects(tournament, event);
  updateCampaignEventScoreImpact(tournament, event);
  tournament.waitingForNext = !tournament.waitingForReplacement;
  tournament.statusText = createCampaignStatusText(event, phase);
  renderTournament();
}

function continueTournament() {
  const tournament = state.tournament;
  if (!tournament || !tournament.waitingForNext) {
    return;
  }

  if (tournament.pendingFinish) {
    const { title, statusText, champion } = tournament.pendingFinish;
    finishTournament(title, statusText, champion);
    return;
  }

  if (tournament.pendingRetry) {
    const retry = tournament.pendingRetry;
    tournament.pendingRetry = null;
    tournament.currentMatch = null;
    tournament.visibleEvents = [];
    tournament.typedEvent = "";
    tournament.combatComplete = false;
    tournament.waitingForNext = false;
    tournament.playerTeam.campaignModifier = (tournament.playerTeam.campaignModifier || 0) + retry.scoreBonus;
    tournament.activeRetryBonus = retry.scoreBonus;
    tournament.currentEventScoreDelta = (tournament.currentEventScoreDelta || 0) + retry.scoreBonus;
    tournament.playerTeam.currentEventScoreDelta = (tournament.playerTeam.currentEventScoreDelta || 0) + retry.scoreBonus;
    tournament.statusText = `${retry.sourceTitle} activa una revancha con ${formatModifier(retry.scoreBonus)} score.`;
    startLiveCombat(retry.enemy, retry.phase, retry.stage);
    return;
  }

  if (tournament.currentReward) {
    return;
  }

  if (tournament.pendingReward) {
    const { enemy, match } = tournament.pendingReward;
    tournament.pendingReward = null;
    tournament.currentReward = createRewardFromEnemy(tournament, enemy, match);
    tournament.rewardMinimized = false;
    tournament.currentMatch = null;
    tournament.visibleEvents = [];
    tournament.typedEvent = "";
    tournament.combatComplete = false;
    tournament.waitingForNext = false;
    tournament.activeAdventureTab = "reward";
    tournament.statusText = `${enemy.name} fue derrotada. Elige una recompensa de combate.`;
    audioManager.playSfx("rewardOpen");
    renderTournament();
    return;
  }

  if (tournament.currentCampaignEvent) {
    if (tournament.replacementRequest) {
      return;
    }
    const pendingCombat = tournament.pendingCombat;
    tournament.currentCampaignEvent = null;
    tournament.replacementRequest = null;
    tournament.waitingForReplacement = false;
    tournament.pendingCombat = null;
    tournament.visibleEvents = [];
    tournament.typedEvent = "";
    tournament.combatComplete = false;
    tournament.waitingForNext = false;
    if (pendingCombat) {
      tournament.statusText = `${pendingCombat.phase} listo. Preparando combate.`;
      startLiveCombat(pendingCombat.enemy, pendingCombat.phase, pendingCombat.stage);
      return;
    }
    renderTournament();
    queueNextCombat();
    return;
  }

  tournament.currentMatch = null;
  tournament.visibleEvents = [];
  tournament.typedEvent = "";
  tournament.combatComplete = false;
  tournament.waitingForNext = false;
  tournament.playerTeam.campaignModifier = 0;
  clearCampaignScoreImpact(tournament);
  renderTournament();
  queueNextCombat();
}

function prepareExtraLifeRetry(tournament, match) {
  const extraLife = Array.isArray(tournament.extraLives) && tournament.extraLives.length
    ? tournament.extraLives.shift()
    : null;

  if (!extraLife) {
    return false;
  }

  const scoreBonus = Math.max(1, Number(extraLife.retryScoreBonus || extraLife.scoreBonus || 100));
  tournament.pendingRetry = {
    enemy: match.enemy,
    phase: match.phase,
    stage: match.stage,
    scoreBonus,
    sourceTitle: extraLife.title || "Libro del heroe anonimo"
  };
  tournament.waitingForNext = true;
  tournament.statusText = `${tournament.pendingRetry.sourceTitle} evita el final. Puedes reintentar este combate con ${formatModifier(scoreBonus)} score temporal.`;
  match.events = Array.isArray(match.events) ? match.events : [];
  match.events.push(`${tournament.pendingRetry.sourceTitle} se abre solo: la derrota no cuenta todavia y prepara una revancha con ${formatModifier(scoreBonus)} score.`);
  match.narrative = `${match.narrative} ${tournament.pendingRetry.sourceTitle} te concede una revancha.`;
  return true;
}

function clearActiveRetryBonus(tournament) {
  const bonus = Number(tournament?.activeRetryBonus || 0);
  if (!bonus) {
    return;
  }

  tournament.playerTeam.campaignModifier = (tournament.playerTeam.campaignModifier || 0) - bonus;
  tournament.currentEventScoreDelta = (tournament.currentEventScoreDelta || 0) - bonus;
  tournament.playerTeam.currentEventScoreDelta = (tournament.playerTeam.currentEventScoreDelta || 0) - bonus;
  tournament.activeRetryBonus = 0;
}

function getNextCombatButtonLabel(tournament) {
  if (tournament.pendingFinish) {
    return "Ver resultado";
  }
  if (tournament.pendingRetry) {
    return `Reintentar con ${formatModifier(tournament.pendingRetry.scoreBonus)}`;
  }
  if (tournament.pendingReward) {
    return "Continuar a recompensa";
  }
  if (tournament.currentCampaignEvent) {
    return tournament.pendingCombat ? `Entrar a ${tournament.pendingCombat.phase}` : "Seguir camino";
  }
  if (!tournament.maxCombats && needsCampaignEventBeforeNextCombat(tournament)) {
    return "Ver evento pre-combate";
  }
  return tournament.maxCombats ? "Seguir al mapa" : "Siguiente combate";
}

function prepareAdventurePathChoices(tournament) {
  tournament.playerTeam.campaignModifier = 0;
  clearCampaignScoreImpact(tournament);
  refreshPlayerTeamScore(tournament);
  tournament.pathChoices = createAdventurePathChoices(tournament);
  tournament.awaitingPathChoice = true;
  tournament.currentMatch = null;
  tournament.currentCampaignEvent = null;
  tournament.currentReward = null;
  tournament.pendingReward = null;
  tournament.currentRecruitment = null;
  tournament.pendingCombat = null;
  tournament.replacementRequest = null;
  tournament.waitingForNext = false;
  tournament.activeAdventureTab = "log";
  tournament.statusText = `Tramo ${tournament.nextCombatIndex + 1}/${tournament.maxCombats}: elige entre dos caminos.`;
}

function chooseAdventurePath(choiceId) {
  const tournament = state.tournament;
  const choice = tournament?.pathChoices.find((candidate) => candidate.id === choiceId);
  if (!tournament || !choice || !tournament.awaitingPathChoice) {
    return;
  }

  tournament.awaitingPathChoice = false;
  tournament.pathChoices = [];
  tournament.usedPartyIds.push(choice.enemy.sourcePartyId);
  const phase = `Tramo ${tournament.nextCombatIndex + 1}/${tournament.maxCombats}`;

  if (Math.random() < choice.eventChance) {
    startCampaignPreCombat(choice.enemy, phase, "journey", tournament.nextCombatIndex);
    return;
  }

  startLiveCombat(choice.enemy, phase, "journey");
}

function createAdventurePathChoices(tournament) {
  const rankedEnemies = getRankedAdventureEnemies();
  const progress = tournament.nextCombatIndex / Math.max(1, tournament.maxCombats - 1);
  const allowedRatio = clamp(0.42 + progress * 0.58, 0.42, 1);
  const allowedCount = Math.max(PATH_CHOICE_COUNT, Math.ceil(rankedEnemies.length * allowedRatio));
  const allowedEnemies = rankedEnemies.slice(0, allowedCount);
  const unusedEnemies = allowedEnemies.filter((enemy) => !tournament.usedPartyIds.includes(enemy.sourcePartyId));
  const pool = unusedEnemies.length >= PATH_CHOICE_COUNT ? unusedEnemies : allowedEnemies;
  const targetMultiplier = 0.78 + progress * 0.55;
  const targetScore = tournament.playerTeam.score.finalScore * targetMultiplier;
  const selected = shuffle(pool)
    .sort((left, right) => Math.abs(left.score.finalScore - targetScore) - Math.abs(right.score.finalScore - targetScore))
    .slice(0, PATH_CHOICE_COUNT);

  return selected.map((enemy, index) => ({
    id: `path-${tournament.nextCombatIndex}-${index}-${enemy.sourcePartyId}`,
    label: index === 0 ? "Camino izquierdo" : "Camino derecho",
    enemy,
    eventChance: randomFloat(0.45, 0.82),
    rewardHint: getRewardHintForEnemy(enemy)
  }));
}

function getRankedAdventureEnemies() {
  return DND_PARTIES
    .map((party, index) => createEnemyTeamFromParty(party, index))
    .sort((left, right) => left.score.finalScore - right.score.finalScore);
}

function rollTravelEvent(tournament, enemy, phase) {
  return rollCampaignEvent(tournament, enemy, phase) || createGeneratedTravelEvent(enemy, phase);
}

function createGeneratedTravelEvent(enemy, phase) {
  const type = pickCampaignPolarity({ blessingChance: 0.5 });
  return {
    id: `travel-${enemy.sourcePartyId}-${normalizeLookupText(phase)}`,
    type,
    title: type === "blessing" ? "Atajo encontrado" : "Mal presagio del camino",
    text: type === "blessing"
      ? `Antes de enfrentar a ${enemy.name}, la party encuentra una ruta vieja que mejora su posicion.`
      : `Antes de enfrentar a ${enemy.name}, el camino se complica y la marcha llega desordenada.`,
    scoreModifier: 0,
    effects: [createTravelEventEffect(type, enemy)],
    sourcePartyId: enemy.sourcePartyId,
    sourcePartyName: enemy.name
  };
}

function createRewardFromEnemy(tournament, enemy, match) {
  const options = createRewardOptionsForEnemy(tournament, enemy);
  rememberRewardOptions(tournament, options);

  return {
    journeyIndex: tournament.nextCombatIndex,
    enemy,
    match,
    title: `Botin de ${enemy.name}`,
    text: "La victoria deja equipo, tecnicas o magia recuperada. Elige una mejora concreta para el resto del viaje.",
    options
  };
}

function createRewardOptionsForEnemy(tournament, enemy) {
  const theme = getEnemyRewardTheme(enemy);
  const loreOptions = createLoreRewardOptions(tournament, enemy);
  const fallbackTypes = shuffle([
    "armor",
    "weapon",
    "spell",
    "vitality",
    "training",
    "focus",
    "artifact",
    "drill",
    "warding",
    "scouting",
    "medical",
    "battleRelic",
    "statGrowth",
    "teamTactics",
    "elementalKit",
    "sacredCharm",
    "steelTemper",
    "sunBlessing",
    "tideRoute",
    "orderProtocol",
    "chaosRelic",
    "infernalClause",
    "limboTrial",
    "mythicShard"
  ]);
  const rewardTypes = [...new Set([...(theme.types || []), ...fallbackTypes])];
  const genericOptions = rewardTypes
    .map((type, index) => createRewardOption(type, tournament, enemy, index, index === 0 ? theme : null))
    .filter(Boolean);
  const options = chooseDiverseRewardOptions(tournament, loreOptions, genericOptions);

  if (options.length >= 2) {
    return options.slice(0, REWARD_OPTION_COUNT);
  }

  return options.length ? options : [createFallbackRewardOption(tournament, enemy)];
}

function chooseDiverseRewardOptions(tournament, loreOptions, genericOptions) {
  const allOptions = uniqueRewardOptions([...shuffle(loreOptions), ...shuffle(genericOptions)]);
  const recentKeys = new Set((tournament?.rewardOptionHistory || []).map(normalizeLookupText));
  const freshOptions = allOptions.filter((option) => !recentKeys.has(getRewardOptionMemoryKey(option)));
  const preferredOptions = freshOptions.length >= REWARD_OPTION_COUNT ? freshOptions : allOptions;
  const preferredLore = shuffle(preferredOptions.filter(isLoreRewardOption));
  const preferredGeneric = shuffle(preferredOptions.filter((option) => !isLoreRewardOption(option)));
  const selected = [];

  if (preferredLore.length && (Math.random() < 0.62 || !preferredGeneric.length)) {
    selected.push(preferredLore.shift());
  }
  if (preferredGeneric.length) {
    selected.push(preferredGeneric.shift());
  }
  if (selected.length < REWARD_OPTION_COUNT && preferredLore.length) {
    selected.push(preferredLore.shift());
  }

  const selectedKeys = new Set(selected.map(getRewardOptionMemoryKey));
  const rest = shuffle(preferredOptions).filter((option) => !selectedKeys.has(getRewardOptionMemoryKey(option)));
  while (selected.length < REWARD_OPTION_COUNT && rest.length) {
    selected.push(rest.shift());
  }

  return uniqueRewardOptions(selected).slice(0, REWARD_OPTION_COUNT);
}

function isLoreRewardOption(option) {
  return String(option?.id || "").startsWith("lore-");
}

function getRewardOptionMemoryKey(option) {
  return normalizeLookupText(option?.title || option?.id || "");
}

function rememberRewardOptions(tournament, options = []) {
  if (!tournament) {
    return;
  }

  const current = Array.isArray(tournament.rewardOptionHistory) ? tournament.rewardOptionHistory : [];
  const nextKeys = options
    .map(getRewardOptionMemoryKey)
    .filter(Boolean);
  tournament.rewardOptionHistory = [...current, ...nextKeys].slice(-REWARD_OPTION_MEMORY_LIMIT);
}

function uniqueRewardOptions(options) {
  const seen = new Set();
  return options.filter((option) => {
    const key = normalizeLookupText(`${option.id}-${option.title}`);
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function createLoreRewardOptions(tournament, enemy) {
  const blueprints = [
    ...getLoreRewardBlueprints(enemy),
    ...getWorldLoreRewardBlueprints(enemy)
  ];
  return shuffle(blueprints)
    .map((blueprint, index) => createLoreRewardOption(blueprint, tournament, enemy, index))
    .filter(Boolean);
}

function createLoreRewardOption(blueprint, tournament, enemy, index) {
  const effects = (blueprint.effects || [])
    .map((effect) => materializeRewardEffect(effect, tournament, enemy))
    .filter(Boolean);

  if (!effects.length) {
    return null;
  }

  return {
    id: `lore-${normalizeLookupText(enemy?.sourcePartyId || enemy?.name)}-${blueprint.id || index}`,
    title: blueprint.title,
    text: blueprint.text,
    effectText: blueprint.effectText || summarizeRewardEffects(effects),
    effect: effects.length === 1 ? effects[0] : { type: "bundleReward", effects }
  };
}

function materializeRewardEffect(effect, tournament, enemy) {
  const effectType = normalizeLookupText(effect?.type);
  if (!effectType) {
    return null;
  }

  if (effect.requiresCharacterId && !playerHasCampaignCharacter(tournament.playerTeam, effect.requiresCharacterId)) {
    return null;
  }

  const materialized = { ...effect };
  const purpose = getRewardPurposeForEffect(effectType);
  if (purpose && !materialized.targetCharacterId && !materialized.characterId) {
    const target = pickEffectTarget(tournament, materialized, purpose) || pickRewardTarget(tournament, purpose);
    if (!target) {
      return null;
    }
    materialized.targetCharacterId = target.id;
  }

  if (purpose === "spell" && !["learnspell", "findspell", "newspell"].includes(effectType)) {
    const target = getRewardEffectTarget(tournament, materialized);
    if (!target || !canReceiveRewardSpell(target)) {
      return null;
    }
  }

  if (["learnspell", "findspell", "newspell"].includes(effectType)) {
    const target = getRewardEffectTarget(tournament, materialized);
    if (!target || !canReceiveRewardSpell(target)) {
      return null;
    }
    const spellName = materialized.spellName || materialized.spell || pickRewardSpell(target, enemy, materialized.spellTags || []);
    if (!spellName) {
      return null;
    }
    materialized.spellName = spellName;
  }

  return materialized;
}

function getRewardPurposeForEffect(effectType) {
  if (["armorboost", "reinforcearmor", "repairarmor", "acboost"].includes(effectType)) return "armor";
  if (["weaponboost", "findweapon", "dpsboost", "upgradeweapon"].includes(effectType)) return "weapon";
  if (["arcanefocus", "focusboost"].includes(effectType)) return "spell";
  if (["learnspell", "findspell", "newspell"].includes(effectType)) return "spell";
  if (["healwounds", "rest", "hpboost", "vitalityboost"].includes(effectType)) return "vitality";
  if (["stattraining", "statboost", "training"].includes(effectType)) return "training";
  return "";
}

function getRewardEffectTarget(tournament, effect) {
  const id = effect?.targetCharacterId || effect?.characterId || effect?.targetId;
  if (!id) {
    return null;
  }
  return (tournament.playerTeam.members || [])
    .find((character) => normalizeLookupText(character.id) === normalizeLookupText(id)) || null;
}

function summarizeRewardEffects(effects) {
  return effects
    .map((effect) => {
      const type = normalizeLookupText(effect.type);
      if (type.includes("armor")) return "+AC";
      if (type.includes("weapon")) return "+DPS";
      if (type.includes("spell")) return effect.spellName ? `Spell: ${effect.spellName}` : "Spell";
      if (type.includes("heal") || type.includes("hp")) return "+HP";
      if (type.includes("stat") || type.includes("training")) return `+${effect.amount || 1} ${effect.stat || "stat"}`;
      if (type.includes("score") || type.includes("artifact")) return `Score ${formatModifier(effect.amount || effect.scoreModifier || 0)}`;
      if (type.includes("extra")) return "Vida extra";
      if (type.includes("special")) return "Especial";
      return "Mejora";
    })
    .join(" + ");
}

function getLoreRewardBlueprints(enemy) {
  const partyId = enemy?.sourcePartyId || "";
  const group = getLoreRewardGroup(partyId);
  const common = [
    {
      id: "spoils",
      title: `Tesoros de ${enemy?.name || "la party rival"}`,
      text: "La victoria deja equipo util, mapas marcados y algunas tecnicas copiables.",
      effectText: "Recursos mixtos para el viaje",
      effects: [
        { type: "partyScoreBoost", amount: 6, label: "Recursos", text: "La party ordena el botin y gana +6 score permanente." },
        { type: "statTraining", target: "random", amount: 1, text: "{character} aprende una tecnica menor y mejora {stat} en +1." }
      ]
    }
  ];

  if (group === "fighter") {
    return [
      {
        id: "tam-forge",
        title: "Forja de Tam",
        text: "Tam convierte partes del botin en una defensa real y un arma lista para el siguiente tramo.",
        effectText: "+AC y arma mejorada",
        effects: [
          { type: "armorBoost", target: "frontliner", amount: 1, feature: "Tam Forged Armor", text: "{character} equipa armadura reforzada por Tam y gana +{amount} AC." },
          { type: "weaponBoost", target: "dps", feature: "Tam Forged Weapon", text: "{character} recibe un arma ajustada por Tam y sube su DPS." }
        ]
      },
      {
        id: "sixto-draco",
        title: "Metodo de Sixto",
        text: "Sixto deja trampas, agarres y consejos para sobrevivir a cosas que se mueven demasiado rapido.",
        effectText: "+DEX y control de ruta",
        effects: [
          { type: "statTraining", target: "random", stat: "DEX", amount: 1, text: "{character} practica capturas de Dracos y mejora DEX en +1." },
          { type: "partyScoreBoost", amount: 8, label: "Trampas de Dracos", text: "Las trampas de Sixto dan ventaja de posicion (+8 score permanente)." }
        ]
      },
      {
        id: "platinum-tail-map",
        title: "Mapa de Cola de Platino",
        text: "El laberinto deja rutas marcadas, puertas falsas y una regla simple: pensar antes de correr.",
        effectText: "+tactica y lectura",
        effects: [
          { type: "statTraining", target: "tactician", stat: "INT", amount: 1, text: "{character} descifra rutas del laberinto y mejora INT en +1." },
          { type: "partyScoreBoost", amount: 7, label: "Lectura de mapa", text: "La party viaja mejor gracias al mapa del laberinto (+7 score permanente)." }
        ]
      }
    ];
  }

  if (group === "tracendencia") {
    return [
      {
        id: "impu-reliquary",
        title: "Reliquia de Impu",
        text: "La energia de muerte domesticada sirve para traer a alguien de vuelta o cerrar heridas horribles.",
        effectText: "Revivir o curar + spell legal",
        effects: [
          { type: "reviveFallenCharacter", fallbackHeal: 14, text: "{character} vuelve gracias al ritual de Impu." },
          { type: "learnSpell", target: "spellcaster", spellTags: ["healing", "buff"], text: "{character} adapta un ritual de Impu y aprende {spell}." }
        ]
      },
      {
        id: "plague-antidote",
        title: "Antidoto contra la peste",
        text: "La sombra de Pracmenar deja una cura amarga, pero efectiva para aguantar el viaje.",
        effectText: "+HP y +CON",
        effects: [
          { type: "healWounds", target: "weakest", amount: 12, text: "{character} toma el antidoto y recupera +{amount} HP." },
          { type: "statTraining", target: "random", stat: "CON", amount: 1, text: "{character} resiste la peste y mejora CON en +1." }
        ]
      },
      {
        id: "vampire-wards",
        title: "Sellos contra vampiros",
        text: "Los restos de una caceria vampirica se vuelven sellos de proteccion y foco oscuro.",
        effectText: "+AC y foco arcano",
        effects: [
          { type: "armorBoost", target: "frontliner", amount: 1, feature: "Vampire Ward", text: "{character} graba un sello vampirico y gana +{amount} AC." },
          { type: "arcaneFocus", target: "spellcaster", feature: "Deathward Focus", text: "{character} usa un foco de muerte controlada para mejorar su magia." }
        ]
      }
    ];
  }

  if (group === "auk") {
    return [
      {
        id: "magic-cargo",
        title: "Cargamento de objetos magicos",
        text: "La party encuentra un cargamento perdido. Nadie pregunta demasiado; todos equipan algo.",
        effectText: "+AC y +DPS",
        effects: [
          { type: "armorBoost", target: "frontliner", amount: 1, feature: "Smuggled Armor", text: "{character} equipa una pieza magica del cargamento y gana +{amount} AC." },
          { type: "weaponBoost", target: "dps", feature: "Smuggled Weapon", text: "{character} toma un arma del cargamento y mejora su DPS." }
        ]
      },
      {
        id: "rata-laucha",
        title: "Favor de Rata y Laucha",
        text: "Los dos traficantes hablan horrible, pero consiguen recursos que nadie mas puede conseguir.",
        effectText: "+CON y ventaja sucia",
        effects: [
          { type: "statTraining", target: "random", stat: "CON", amount: 1, text: "{character} sobrevive al trato con Rata y Laucha y mejora CON en +1." },
          { type: "partyScoreBoost", amount: 9, label: "Contrabando util", text: "El contrabando da herramientas practicas (+9 score permanente)." }
        ]
      },
      {
        id: "mafia-ledger",
        title: "Libro de deudas de la Mafia",
        text: "Las deudas viejas se transforman en informacion, contactos y una amenaza bien dirigida.",
        effectText: "+CHA o +INT y score",
        effects: [
          { type: "statTraining", target: "tactician", stat: "INT", amount: 1, text: "{character} estudia el libro de deudas y mejora INT en +1." },
          { type: "partyScoreBoost", amount: 7, label: "Contactos de mafia", text: "La party usa contactos dudosos para abrir camino (+7 score permanente)." }
        ]
      }
    ];
  }

  if (group === "digital") {
    return [
      {
        id: "online-item",
        title: "Un item online",
        text: "El juego escupe un item raro. Parece bug, pero pega demasiado bien para tirarlo.",
        effectText: "Arma runica y score",
        effects: [
          { type: "weaponBoost", target: "dps", feature: "Online Unique Weapon", text: "{character} equipa un item online raro y mejora su DPS." },
          { type: "partyScoreBoost", amount: 8, label: "Item online", text: "El item online mejora la preparacion de toda la party (+8 score permanente)." }
        ]
      },
      {
        id: "debug-patch",
        title: "Parche anti-bugs",
        text: "Los glitches dejan de arruinar la interfaz de la realidad durante un rato.",
        effectText: "+INT y foco",
        effects: [
          { type: "statTraining", target: "tactician", stat: "INT", amount: 1, text: "{character} entiende el bug y mejora INT en +1." },
          { type: "arcaneFocus", target: "spellcaster", feature: "Debug Focus", text: "{character} convierte un bug en foco de casteo estable." }
        ]
      },
      {
        id: "anti-scam",
        title: "Filtro anti-estafas",
        text: "La party aprende a detectar perfiles falsos, promesas raras y trampas online.",
        effectText: "+WIS y score",
        effects: [
          { type: "statTraining", target: "random", stat: "WIS", amount: 1, text: "{character} se vuelve mas dificil de engañar y mejora WIS en +1." },
          { type: "partyScoreBoost", amount: 6, label: "Ciberseguridad", text: "La party evita perder recursos por estafas (+6 score permanente)." }
        ]
      }
    ];
  }

  if (group === "nexus") {
    return [
      {
        id: "robot-core",
        title: "Nucleo de robot corporativo",
        text: "Los robots caidos dejan energia limpia, placas y un nucleo que todavia zumba.",
        effectText: "+DPS y foco",
        effects: [
          { type: "weaponBoost", target: "dps", feature: "Robot-Core Weapon", text: "{character} monta un nucleo robotico en su arma y mejora su DPS." },
          { type: "arcaneFocus", target: "spellcaster", feature: "Corporate Arc Core", text: "{character} canaliza magia con un nucleo corporativo." }
        ]
      },
      {
        id: "corporate-plating",
        title: "Blindaje corporativo",
        text: "Las placas de robot no son comodas, pero detienen golpes como si fueran caras.",
        effectText: "+AC y score",
        effects: [
          { type: "armorBoost", target: "frontliner", amount: 2, feature: "Corporate Plating", text: "{character} instala blindaje corporativo y gana +{amount} AC." },
          { type: "partyScoreBoost", amount: 6, label: "Tecnologia recuperada", text: "La tecnologia recuperada mejora la ruta (+6 score permanente)." }
        ]
      }
    ];
  }

  if (group === "facha") {
    return [
      {
        id: "sheriff-badge",
        title: "Placa del Sheriff",
        text: "Un sheriff poco amigable igual decide creer el testimonio y deja recursos utiles.",
        effectText: "+CHA y autoridad",
        effects: [
          { type: "statTraining", target: "random", stat: "CHA", amount: 1, text: "{character} usa la placa del Sheriff y mejora CHA en +1." },
          { type: "partyScoreBoost", amount: 7, label: "Autoridad local", text: "La placa abre puertas durante el viaje (+7 score permanente)." }
        ]
      },
      {
        id: "pirate-haul",
        title: "Botin de piratas",
        text: "El grupo de piratas deja armas raras, mapas mojados y piezas de armadura salada.",
        effectText: "+DPS y +AC",
        effects: [
          { type: "weaponBoost", target: "dps", feature: "Pirate Cutlass", text: "{character} toma un arma pirata y mejora su DPS." },
          { type: "armorBoost", target: "frontliner", amount: 1, feature: "Sea-Worn Armor", text: "{character} adapta armadura pirata y gana +{amount} AC." }
        ]
      },
      {
        id: "eragior-dossier",
        title: "Dossier Eragior",
        text: "Los espias dejan documentos que explican patrones, nombres falsos y rutas de escape.",
        effectText: "+INT y lectura",
        effects: [
          { type: "statTraining", target: "tactician", stat: "INT", amount: 1, text: "{character} estudia el dossier Eragior y mejora INT en +1." },
          { type: "partyScoreBoost", amount: 8, label: "Informacion Eragior", text: "La informacion de espias evita emboscadas (+8 score permanente)." }
        ]
      }
    ];
  }

  if (group === "caballeros") {
    return [
      {
        id: "merlin-sigil",
        title: "Sigilo de Merlin",
        text: "El milenario mago Merlin deja un sigilo que solo un verdadero caster puede adaptar.",
        effectText: "Spell legal o foco arcano",
        effects: [
          { type: "learnSpell", target: "spellcaster", spellTags: ["control", "buff", "countermagic"], text: "{character} estudia el sigilo de Merlin y aprende {spell}." },
          { type: "partyScoreBoost", amount: 6, label: "Guia de Merlin", text: "La guia de Merlin mejora la preparacion general (+6 score permanente)." }
        ]
      },
      {
        id: "holy-plate",
        title: "Placas de la Santa Sede",
        text: "El metal sagrado es pesado, brillante y bastante convincente cuando alguien intenta pegarte.",
        effectText: "+2 AC y curacion",
        effects: [
          { type: "armorBoost", target: "frontliner", amount: 2, feature: "Holy Plate", text: "{character} equipa placas sagradas y gana +{amount} AC." },
          { type: "healWounds", target: "weakest", amount: 10, text: "{character} descansa bajo sellos sagrados y recupera +{amount} HP." }
        ]
      },
      {
        id: "sin-relic",
        title: "Reliquia del Pecado",
        text: "La reliquia de los caballeros del Pecado arde al tocarla, pero empuja el ataque.",
        effectText: "+DPS y +CHA",
        effects: [
          { type: "weaponBoost", target: "dps", feature: "Sin Relic Weapon", text: "{character} empuña una reliquia del Pecado y mejora su DPS." },
          { type: "statTraining", target: "random", stat: "CHA", amount: 1, text: "{character} domina la presencia de la reliquia y mejora CHA en +1." }
        ]
      }
    ];
  }

  if (group === "caballeros3") {
    return [
      {
        id: "rim-armor",
        title: "Partes de armadura de Rim",
        text: "El Sargento Rim deja piezas duras, practicas y llenas de marcas de batalla.",
        effectText: "+2 AC y score",
        effects: [
          { type: "armorBoost", target: "frontliner", amount: 2, feature: "Rim Armor Parts", text: "{character} monta partes de Rim y gana +{amount} AC." },
          { type: "partyScoreBoost", amount: 6, label: "Disciplina de Rim", text: "La disciplina de Rim mejora la marcha (+6 score permanente)." }
        ]
      },
      {
        id: "megafauna-hide",
        title: "Cuero de megafauna",
        text: "La megafauna deja cuero grueso, huesos enormes y el recordatorio de no confiarse.",
        effectText: "+HP y +AC",
        effects: [
          { type: "healWounds", target: "weakest", amount: 14, text: "{character} usa recursos de megafauna y gana +{amount} HP." },
          { type: "armorBoost", target: "frontliner", amount: 1, feature: "Megafauna Hide", text: "{character} refuerza su armadura con cuero de megafauna y gana +{amount} AC." }
        ]
      }
    ];
  }

  if (group === "heroes") {
    return [
      {
        id: "survivor-cache",
        title: "Cache de sobrevivientes",
        text: "Una comunidad de sobrevivientes comparte medicinas, placas improvisadas y comida decente.",
        effectText: "+HP, +AC y recursos",
        effects: [
          { type: "healWounds", target: "weakest", amount: 12, text: "{character} usa medicinas de sobrevivientes y gana +{amount} HP." },
          { type: "armorBoost", target: "frontliner", amount: 1, feature: "Survivor Plating", text: "{character} adapta placas de sobrevivientes y gana +{amount} AC." },
          { type: "partyScoreBoost", amount: 5, label: "Recursos varios", text: "La comunidad entrega recursos para seguir (+5 score permanente)." }
        ]
      },
      {
        id: "usurper-core",
        title: "Nucleo Usurpador",
        text: "Los robots de altisima tecnologia dejan escudos, cañones y piezas que nadie deberia tocar sin guantes.",
        effectText: "+DPS y foco tecnologico",
        effects: [
          { type: "weaponBoost", target: "dps", feature: "Usurper Core Weapon", text: "{character} integra un nucleo Usurpador y mejora su DPS." },
          { type: "arcaneFocus", target: "spellcaster", feature: "Usurper Shield Core", text: "{character} convierte un escudo Usurpador en foco defensivo." }
        ]
      },
      {
        id: "jake-tactics",
        title: "Tacticas de Jake",
        text: "Jake ve buen potencial y corrige postura, rotacion y decisiones de combate.",
        effectText: "+WIS y score tactico",
        effects: [
          { type: "statTraining", target: "tactician", stat: "WIS", amount: 1, text: "{character} aprende tacticas de Jake y mejora WIS en +1." },
          { type: "partyScoreBoost", amount: 9, label: "Plan de Jake", text: "Las tacticas de Jake ordenan a toda la party (+9 score permanente)." }
        ]
      },
      {
        id: "femme-noir",
        title: "Femme Noir aparece",
        text: "Femme Noir decide que la party le cae bien y ofrece sumarse si hay lugar en el caos.",
        effectText: "Puede unirse un Especial",
        effects: [
          { type: "addSpecialCharacter", specialId: "Femme Noir", text: "{character} se suma como Especial para el viaje." }
        ]
      }
    ];
  }

  if (group === "naturales") {
    return [
      {
        id: "light-goddess",
        title: "Bendicion de la diosa de la luz",
        text: "La diosa de la luz bendice a la party con una mejora general de cuerpo y voluntad.",
        effectText: "+stats y score",
        effects: [
          { type: "statTraining", target: "random", stat: "WIS", amount: 1, text: "{character} recibe luz divina y mejora WIS en +1." },
          { type: "statTraining", target: "random", stat: "CON", amount: 1, text: "{character} resiste mejor gracias a la bendicion y mejora CON en +1." },
          { type: "partyScoreBoost", amount: 10, label: "Bendicion de luz", text: "La bendicion mejora a toda la party (+10 score permanente)." }
        ]
      },
      {
        id: "giant-mecha",
        title: "Mecha gigante encontrado",
        text: "La party encuentra un Mecha gigante. No todos saben pilotearlo, pero todos sonrien un poco.",
        effectText: "+AC, +DPS y score",
        effects: [
          { type: "armorBoost", target: "frontliner", amount: 2, feature: "Mecha Plating", text: "{character} usa placas del Mecha y gana +{amount} AC." },
          { type: "weaponBoost", target: "dps", feature: "Mecha Cannon", text: "{character} adapta un cañon del Mecha y mejora su DPS." },
          { type: "partyScoreBoost", amount: 12, label: "Mecha operativo", text: "El Mecha cambia la moral del viaje (+12 score permanente)." }
        ]
      },
      {
        id: "nuclear-option",
        title: "La Bomba Nuclear",
        text: "La party encuentra una bomba nuclear. La prudencia no mejora, pero el proximo problema se ve mas pequeño.",
        effectText: "Gran impulso ofensivo",
        effects: [
          { type: "partyScoreBoost", amount: 18, label: "Opcion nuclear", text: "La amenaza nuclear intimida el resto del viaje (+18 score permanente)." },
          { type: "weaponBoost", target: "dps", feature: "Nuclear Deterrent", text: "{character} convierte la amenaza nuclear en presion ofensiva." }
        ]
      }
    ];
  }

  if (group === "destiny") {
    return [
      {
        id: "cintor-crafting",
        title: "Creacion de Cintor",
        text: "Cintor arma objetos magicos a medida con paciencia de espiritualista y ojo de artesano.",
        effectText: "+AC y +DPS",
        effects: [
          { type: "armorBoost", target: "frontliner", amount: 1, feature: "Cintor Charm Armor", text: "{character} recibe un amuleto defensivo de Cintor y gana +{amount} AC." },
          { type: "weaponBoost", target: "dps", feature: "Cintor Crafted Weapon", text: "{character} usa un objeto de Cintor y mejora su DPS." }
        ]
      },
      {
        id: "anonymous-hero-book",
        title: "Libro del heroe anonimo",
        text: "El libro promete una segunda oportunidad si el viaje sale terriblemente mal.",
        effectText: "Vida extra con +100 temporal",
        effects: [
          { type: "extraLife", retryScoreBonus: 100, title: "Libro del heroe anonimo" },
          { type: "partyScoreBoost", amount: 4, label: "Inspiracion heroica", text: "El libro inspira a la party (+4 score permanente)." }
        ]
      },
      {
        id: "narciso-portrait",
        title: "Retrato de Narciso",
        text: "Narciso pinta a la party. Nadie sabe por que eso ayuda, pero todos salen mas satisfechos.",
        effectText: "+CHA y curacion",
        effects: [
          { type: "statTraining", target: "random", stat: "CHA", amount: 1, text: "{character} queda satisfecho con el retrato y mejora CHA en +1." },
          { type: "healWounds", target: "weakest", amount: 10, text: "{character} recupera animo y gana +{amount} HP." }
        ]
      },
      {
        id: "liora-artifact",
        title: "Artefacto de Liora",
        text: "Liora crea un artefacto para llevar mejor objetos, reagrupar recursos y no perder lo importante.",
        effectText: "Score y +AC",
        effects: [
          { type: "partyScoreBoost", amount: 10, label: "Artefacto logistico", text: "El artefacto de Liora mejora la organizacion (+10 score permanente)." },
          { type: "armorBoost", target: "frontliner", amount: 1, feature: "Liora Utility Harness", text: "{character} usa el arnes de Liora y gana +{amount} AC." }
        ]
      },
      {
        id: "elkas-guidance",
        title: "Guia de Elkas",
        text: "El niño del destino señala un detalle del futuro y evita una mala decision.",
        effectText: "+WIS y score",
        effects: [
          { type: "statTraining", target: "tactician", stat: "WIS", amount: 1, text: "{character} escucha a Elkas y mejora WIS en +1." },
          { type: "partyScoreBoost", amount: 9, label: "Destino favorable", text: "La guia de Elkas mejora el siguiente tramo (+9 score permanente)." }
        ]
      },
      {
        id: "molusco-atlas",
        title: "Molusco busca a Atlas",
        text: "Si Atlas viaja con la party, Molusco puede aparecer y sumarse como Especial.",
        effectText: "Especial condicionado",
        effects: [
          { type: "addSpecialCharacter", specialId: "Molusco", requiresCharacterId: "Atlas", text: "{character} reconoce a Atlas y se suma como Especial." }
        ]
      }
    ];
  }

  if (group === "archives") {
    return [
      {
        id: "cetrine-archive",
        title: "Archivos Cetrinos",
        text: "Los monjes dejan informacion robada, rapida de consultar y demasiado especifica.",
        effectText: "+INT y score",
        effects: [
          { type: "statTraining", target: "tactician", stat: "INT", amount: 1, text: "{character} ordena los Archivos Cetrinos y mejora INT en +1." },
          { type: "partyScoreBoost", amount: 8, label: "Informacion Cetrina", text: "La informacion reunida mejora las decisiones de ruta (+8 score permanente)." }
        ]
      },
      {
        id: "elemental-beast-scale",
        title: "Escama de bestia elemental",
        text: "Una bestia mitica elemental deja material perfecto para defensa o canalizacion.",
        effectText: "+AC y foco",
        effects: [
          { type: "armorBoost", target: "frontliner", amount: 1, feature: "Elemental Scale", text: "{character} usa escamas elementales y gana +{amount} AC." },
          { type: "arcaneFocus", target: "spellcaster", feature: "Elemental Focus", text: "{character} canaliza energia elemental con un nuevo foco." }
        ]
      },
      {
        id: "light-church-relic",
        title: "Reliquia de la Iglesia de la Luz",
        text: "La reliquia brilla, sana heridas y deja una proteccion incomoda contra la oscuridad.",
        effectText: "+HP y +AC",
        effects: [
          { type: "healWounds", target: "weakest", amount: 12, text: "{character} recibe luz reparadora y gana +{amount} HP." },
          { type: "armorBoost", target: "frontliner", amount: 1, feature: "Light Church Relic", text: "{character} porta una reliquia protectora y gana +{amount} AC." }
        ]
      }
    ];
  }

  return common;
}

function getWorldLoreRewardBlueprints(enemy) {
  return [
    {
      id: "sun-men-ritual",
      title: "Ritual de los Hombres del Sol",
      text: "Los Aasimar de las montañas enseñan a absorber luz, cargar peso imposible y destruir rastros de maldicion.",
      effectText: "+STR, +WIS y score",
      effects: [
        { type: "statTraining", target: "frontliner", stat: "STR", amount: 1, text: "{character} aprende postura solar y mejora STR en +1." },
        { type: "statTraining", target: "support", stat: "WIS", amount: 1, text: "{character} estudia el ritual del Sol Antiguo y mejora WIS en +1." },
        { type: "partyScoreBoost", amount: 8, label: "Tributo solar", text: "La party gana disciplina de solsticio (+8 score permanente)." }
      ]
    },
    {
      id: "devotees-of-steel-forge",
      title: "Forja de los Devotos del Acero",
      text: "Los minotauros forjadores comparten acero sagrado, tecnicas de dos manos y piezas de guerra.",
      effectText: "+DPS, +AC y STR",
      effects: [
        { type: "weaponBoost", target: "dps", feature: "Devotee Steel Weapon", text: "{character} recibe acero devoto y mejora su DPS." },
        { type: "armorBoost", target: "frontliner", amount: 1, feature: "Devotee Steel Plate", text: "{character} adapta placas de acero devoto y gana +{amount} AC." },
        { type: "statTraining", target: "dps", stat: "STR", amount: 1, text: "{character} aprende tecnica de arma pesada y mejora STR en +1." }
      ]
    },
    {
      id: "fish-men-sea-route",
      title: "Ruta de los Hombres Pez",
      text: "El reino triton comparte mapas de marea, respiracion anfibia y lectura de corrientes.",
      effectText: "+DEX, +WIS y movilidad",
      effects: [
        { type: "statTraining", target: "random", stat: "DEX", amount: 1, text: "{character} practica movimiento de marea y mejora DEX en +1." },
        { type: "statTraining", target: "tactician", stat: "WIS", amount: 1, text: "{character} aprende a leer corrientes y mejora WIS en +1." },
        { type: "partyScoreBoost", amount: 7, label: "Rutas de marea", text: "Los mapas de marea aceleran el viaje (+7 score permanente)." }
      ]
    },
    {
      id: "modron-protocol",
      title: "Protocolo del Reino del Orden",
      text: "Un patron Modron convierte el caos de la party en una secuencia repetible y muy eficiente.",
      effectText: "+INT y orden tactico",
      effects: [
        { type: "statTraining", target: "tactician", stat: "INT", amount: 1, text: "{character} memoriza protocolo Modron y mejora INT en +1." },
        { type: "partyScoreBoost", amount: 10, label: "Orden operativo", text: "La party reduce errores gracias al protocolo del Orden (+10 score permanente)." }
      ]
    },
    {
      id: "chaos-portal-trick",
      title: "Truco del Reino del Caos",
      text: "Un portal anarquista deja una tecnica absurda: moverse sin patron para volverse dificil de leer.",
      effectText: "+DEX, +CHA y ventaja rara",
      effects: [
        { type: "statTraining", target: "random", stat: "DEX", amount: 1, text: "{character} practica movimiento caotico y mejora DEX en +1." },
        { type: "statTraining", target: "random", stat: "CHA", amount: 1, text: "{character} aprende presencia impredecible y mejora CHA en +1." },
        { type: "partyScoreBoost", amount: 6, label: "Improvisacion caotica", text: "La improvisacion caotica abre jugadas raras (+6 score permanente)." }
      ]
    },
    {
      id: "infernal-contract",
      title: "Contrato del Infierno",
      text: "Un demonio respeta la letra chica: si todo sale mal, una puerta del techo se abre una vez.",
      effectText: "Vida extra y poder oscuro",
      effects: [
        { type: "extraLife", retryScoreBonus: 80, title: "Contrato infernal" },
        { type: "partyScoreBoost", amount: 5, label: "Clausula infernal", text: "La clausula infernal intimida a los enemigos (+5 score permanente)." }
      ]
    },
    {
      id: "limbo-zodd-trial",
      title: "Prueba de Zodd en el Limbo",
      text: "Zodd pone a prueba la voluntad de la party dentro de una dimension sostenida por Vilium.",
      effectText: "+CON, +WIS y score",
      effects: [
        { type: "statTraining", target: "random", stat: "CON", amount: 1, text: "{character} soporta la prueba de Zodd y mejora CON en +1." },
        { type: "statTraining", target: "tactician", stat: "WIS", amount: 1, text: "{character} resiste el sueño del Limbo y mejora WIS en +1." },
        { type: "partyScoreBoost", amount: 9, label: "Bendicion del Limbo", text: "La prueba del Limbo fortalece el viaje (+9 score permanente)." }
      ]
    },
    {
      id: "vilium-heart-shard",
      title: "Fragmento del corazon de Vilium",
      text: "Una astilla del metal mistico estabiliza magia, foco y decisiones imposibles.",
      effectText: "Foco arcano y spell compatible",
      effects: [
        { type: "arcaneFocus", target: "spellcaster", feature: "Vilium Heart Focus", text: "{character} canaliza magia con un fragmento de Vilium." },
        { type: "learnSpell", target: "spellcaster", spellTags: ["defense", "control", "mobility"], text: "{character} aprende {spell} gracias al Vilium." }
      ]
    },
    {
      id: "sun-solstice-hunt",
      title: "Caceria del solsticio",
      text: "Los Hombres del Sol premian una caza dificil con comida ritual, fuerza y disciplina de altura.",
      effectText: "+STR, +HP y score",
      effects: [
        { type: "statTraining", target: "frontliner", stat: "STR", amount: 1, text: "{character} carga presas de solsticio y mejora STR en +1." },
        { type: "healWounds", target: "weakest", amount: 10, text: "{character} come en el ritual solar y gana +{amount} HP." },
        { type: "partyScoreBoost", amount: 7, label: "Caza del solsticio", text: "La caza ritual deja a la party mas firme (+7 score permanente)." }
      ]
    },
    {
      id: "ramses-tide-seal",
      title: "Sello de Ramses",
      text: "El rey triton Ramses entrega una marca de paso por el mar y lectura de corrientes.",
      effectText: "+WIS, +CHA y ruta segura",
      effects: [
        { type: "statTraining", target: "tactician", stat: "WIS", amount: 1, text: "{character} interpreta corrientes por el sello de Ramses y mejora WIS en +1." },
        { type: "statTraining", target: "support", stat: "CHA", amount: 1, text: "{character} negocia mejor con la marca triton y mejora CHA en +1." },
        { type: "partyScoreBoost", amount: 8, label: "Sello de Ramses", text: "El sello triton evita rodeos peligrosos (+8 score permanente)." }
      ]
    },
    {
      id: "kaleb-red-weapon",
      title: "Arma carmesi de Kaleb",
      text: "La faccion roja deja un arma peligrosa; bien atada sirve, mal usada muerde.",
      effectText: "+DPS y +DEX",
      effects: [
        { type: "weaponBoost", target: "dps", feature: "Crimson Tide Weapon", text: "{character} domina un arma carmesi y mejora su DPS." },
        { type: "statTraining", target: "dps", stat: "DEX", amount: 1, text: "{character} aprende a no cortarse con el arma de Kaleb y mejora DEX en +1." }
      ]
    },
    {
      id: "primus-schematic",
      title: "Esquema de Primus",
      text: "Un esquema del Reino del Orden marca prioridades, errores repetidos y posiciones limpias.",
      effectText: "+INT, +AC y score",
      effects: [
        { type: "statTraining", target: "tactician", stat: "INT", amount: 1, text: "{character} descifra un esquema de Primus y mejora INT en +1." },
        { type: "armorBoost", target: "frontliner", amount: 1, feature: "Modron Guard Pattern", text: "{character} adapta defensa geométrica y gana +{amount} AC." },
        { type: "partyScoreBoost", amount: 9, label: "Esquema de Primus", text: "La party elimina errores de posicion (+9 score permanente)." }
      ]
    },
    {
      id: "zeta-portal-map",
      title: "Mapa de portales Zeta",
      text: "Un anarquista del Caos dibuja un mapa que parece una broma, pero funciona si nadie pregunta demasiado.",
      effectText: "+DEX, movilidad y score",
      effects: [
        { type: "statTraining", target: "random", stat: "DEX", amount: 1, text: "{character} aprende a entrar y salir de portales raros y mejora DEX en +1." },
        { type: "partyScoreBoost", amount: 6, label: "Mapa Zeta", text: "El mapa de portales acorta un tramo dificil (+6 score permanente)." },
        { type: "arcaneFocus", target: "spellcaster", feature: "Zeta Portal Chalk", text: "{character} usa tiza Zeta como foco de movilidad." }
      ]
    },
    {
      id: "devotee-sacred-armor",
      title: "Armadura sagrada de acero",
      text: "Los Devotos del Acero no regalan nada: te hacen pelear por cada placa, pero las placas sirven.",
      effectText: "+AC, +CON y +DPS",
      effects: [
        { type: "armorBoost", target: "frontliner", amount: 2, feature: "Sacred Steel Armor", text: "{character} gana placas de acero sagrado y suma +{amount} AC." },
        { type: "statTraining", target: "frontliner", stat: "CON", amount: 1, text: "{character} soporta el peso del acero y mejora CON en +1." },
        { type: "weaponBoost", target: "dps", feature: "Sacred Steel Edge", text: "{character} recibe filo devoto y mejora su DPS." }
      ]
    },
    {
      id: "mythic-weapon-purification",
      title: "Purificacion de arma mitica",
      text: "Un ritual parcial limpia una reliquia creada por el demonio de las armas antes de que arruine a su portador.",
      effectText: "+DPS, +WIS y score",
      effects: [
        { type: "weaponBoost", target: "dps", feature: "Purified Mythic Edge", text: "{character} blande una reliquia purificada y mejora su DPS." },
        { type: "statTraining", target: "support", stat: "WIS", amount: 1, text: "{character} aprende a controlar la maldicion y mejora WIS en +1." },
        { type: "partyScoreBoost", amount: 10, label: "Reliquia purificada", text: "La reliquia purificada cambia el techo de la party (+10 score permanente)." }
      ]
    },
    {
      id: "infernal-fear-trophy",
      title: "Trofeo de miedo infernal",
      text: "Un demonio menor se alimenta mal, pierde una apuesta y deja un trofeo que intimida al siguiente rival.",
      effectText: "+CHA y score",
      effects: [
        { type: "statTraining", target: "support", stat: "CHA", amount: 1, text: "{character} aprende presencia infernal y mejora CHA en +1." },
        { type: "partyScoreBoost", amount: 8, label: "Trofeo infernal", text: "El trofeo de miedo intimida a enemigos futuros (+8 score permanente)." }
      ]
    },
    {
      id: "red-division-draco-tactics",
      title: "Pautas de la Division Roja",
      text: "La Division Roja enseña lo basico contra dracos: aislarlos, controlarlos y no subestimar ni a categoria 1.",
      effectText: "+INT, control y score",
      effects: [
        { type: "statTraining", target: "tactician", stat: "INT", amount: 1, text: "{character} memoriza pautas anti-draco y mejora INT en +1." },
        { type: "learnSpell", target: "spellcaster", spellTags: ["control", "debuff"], text: "{character} aprende {spell} para controlar presas antes de que escapen." },
        { type: "partyScoreBoost", amount: 8, label: "Pautas anti-draco", text: "La party mejora sus protocolos contra amenazas veloces (+8 score permanente)." }
      ]
    },
    {
      id: "draco-organs-kit",
      title: "Organos de draco aprovechados",
      text: "Corazon, higado, glandulas, ojos y aguijones de draco se convierten en componentes utiles para magia y equipo.",
      effectText: "+DPS, foco y HP",
      effects: [
        { type: "weaponBoost", target: "dps", feature: "Draco Stinger Weapon", text: "{character} adapta un aguijon de draco y mejora su DPS." },
        { type: "arcaneFocus", target: "spellcaster", feature: "Draco Gland Focus", text: "{character} estabiliza glandulas de draco como foco arcano." },
        { type: "healWounds", target: "weakest", amount: 9, text: "{character} usa preparados de higado de draco y gana +{amount} HP." }
      ]
    },
    {
      id: "protector-guild-sentinel",
      title: "Centinela del Gremio de Protectores",
      text: "Un centinela informa rutas peligrosas antes de que la party caiga en un problema que era evitable.",
      effectText: "+WIS, +AC y score",
      effects: [
        { type: "statTraining", target: "tactician", stat: "WIS", amount: 1, text: "{character} aprende a leer reportes de centinela y mejora WIS en +1." },
        { type: "armorBoost", target: "frontliner", amount: 1, feature: "Protector Field Guard", text: "{character} ajusta defensa con consejo del gremio y gana +{amount} AC." },
        { type: "partyScoreBoost", amount: 7, label: "Reporte de centinela", text: "La informacion del Gremio evita errores caros (+7 score permanente)." }
      ]
    },
    {
      id: "silver-swallows-rescue",
      title: "Rescate de las Golondrinas Plateadas",
      text: "Las Golondrinas Plateadas aparecen cuando la ruta parece perdida y sacan a la party de una mala posicion.",
      effectText: "+HP, +DEX y score",
      effects: [
        { type: "healWounds", target: "weakest", amount: 12, text: "{character} recibe auxilio de las Golondrinas y gana +{amount} HP." },
        { type: "statTraining", target: "random", stat: "DEX", amount: 1, text: "{character} aprende una salida rapida y mejora DEX en +1." },
        { type: "partyScoreBoost", amount: 8, label: "Rescate plateado", text: "El rescate deja a la party mejor posicionada (+8 score permanente)." }
      ]
    },
    {
      id: "factory-omar-feli",
      title: "Taller de Omar y Feli",
      text: "Omar arregla lo mecanico y Feli arregla lo que todavia respira. La Fabrica deja a la party lista para seguir.",
      effectText: "+AC, +HP y +DPS",
      effects: [
        { type: "armorBoost", target: "frontliner", amount: 1, feature: "Factory Repair Plates", text: "Omar repara la defensa de {character} y suma +{amount} AC." },
        { type: "healWounds", target: "weakest", amount: 11, text: "Feli atiende a {character} y le devuelve +{amount} HP." },
        { type: "weaponBoost", target: "dps", feature: "Factory Tuned Weapon", text: "Omar calibra el arma de {character} y mejora su DPS." }
      ]
    },
    {
      id: "jake-security-drill",
      title: "Entrenamiento de Jake Davinogh",
      text: "Jake baja ordenes de seguridad con tono militar; por una vez, eso ayuda a no morir.",
      effectText: "+STR, +CON y score",
      effects: [
        { type: "statTraining", target: "frontliner", stat: "CON", amount: 1, text: "{character} aguanta el entrenamiento de Jake y mejora CON en +1." },
        { type: "statTraining", target: "dps", stat: "STR", amount: 1, text: "{character} entrena presion fisica y mejora STR en +1." },
        { type: "partyScoreBoost", amount: 7, label: "Disciplina de Fabrica", text: "La disciplina de seguridad ordena al grupo (+7 score permanente)." }
      ]
    },
    {
      id: "zylchos-royal-forge",
      title: "Forja real de Zylchos",
      text: "Mougther trabaja metal real mientras Leuros abre una ruta imposible para que el equipo llegue a tiempo.",
      effectText: "+DPS, +AC y movilidad",
      effects: [
        { type: "weaponBoost", target: "dps", feature: "Zylchos Royal Weapon", text: "{character} recibe una pieza de Mougther y mejora su DPS." },
        { type: "armorBoost", target: "frontliner", amount: 1, feature: "Zylchos Royal Plate", text: "{character} adapta placa real y gana +{amount} AC." },
        { type: "partyScoreBoost", amount: 9, label: "Portal de Leuros", text: "El portal de Leuros evita desgaste de ruta (+9 score permanente)." }
      ]
    },
    {
      id: "centaur-survivor-stones",
      title: "Piedras de los supervivientes",
      text: "El joven gnomo crea piedras para hablar con centauros y coordinar pasos sin gritar en medio del desastre.",
      effectText: "+WIS, +CHA y score",
      effects: [
        { type: "statTraining", target: "support", stat: "CHA", amount: 1, text: "{character} aprende comunicacion de supervivientes y mejora CHA en +1." },
        { type: "statTraining", target: "tactician", stat: "WIS", amount: 1, text: "{character} interpreta senales de centauros y mejora WIS en +1." },
        { type: "partyScoreBoost", amount: 6, label: "Piedras de enlace", text: "Las piedras coordinan mejor a la party (+6 score permanente)." }
      ]
    }
  ];
}

function getLoreRewardGroup(partyId) {
  const id = normalizeLookupText(partyId);
  if (["fighter party", "buenaonda", "izquierda"].includes(id)) return "fighter";
  if (["tracendencia", "tracendencia2"].includes(id)) return "tracendencia";
  if (id === "auk eman") return "auk";
  if (id === "dark eternum") return "digital";
  if (id === "nexus arcana") return "nexus";
  if (id === "facha party") return "facha";
  if (["caballeros1", "caballeros2"].includes(id)) return "caballeros";
  if (id === "caballeros3") return "caballeros3";
  if (["heroesperdidos1", "heroesperdidos2", "heroesperdidos3", "heroesperdidos4"].includes(id)) return "heroes";
  if (["enemigosnaturales1", "enemigosnaturales2", "enemigosnaturales3"].includes(id)) return "naturales";
  if (["destiny1", "destiny2"].includes(id)) return "destiny";
  if (["novelaverse", "imperioverse", "lestanaverse", "pobreparty"].includes(id)) return "archives";
  return "";
}

function createRewardOption(type, tournament, enemy, index, theme = null) {
  const target = pickRewardTarget(tournament, type);
  if (!target) {
    return null;
  }

  const lateRouteBonus = tournament.nextCombatIndex >= 4 && Math.random() < 0.35 ? 1 : 0;
  const id = `${type}-${index}-${target.id}`;
  const enemyName = enemy?.name || "la party rival";

  if (type === "armor") {
    const amount = 1 + lateRouteBonus;
    return {
      id,
      title: theme?.title || "Armadura recuperada",
      text: theme?.text || `${target.name} adapta una pieza defensiva encontrada tras vencer a ${enemyName}.`,
      effectText: `${target.name} gana +${amount} AC`,
      effect: {
        type: "armorBoost",
        targetCharacterId: target.id,
        amount,
        text: `{character} equipa una armadura nueva y gana +${amount} AC.`
      }
    };
  }

  if (type === "weapon") {
    const feature = lateRouteBonus ? "Runic Weapon" : "Masterwork Weapon";
    return {
      id,
      title: theme?.title || "Arma mejorada",
      text: theme?.text || `${target.name} convierte el botin de ${enemyName} en una mejora ofensiva.`,
      effectText: `${target.name} gana +DPS (${feature})`,
      effect: {
        type: "weaponBoost",
        targetCharacterId: target.id,
        feature,
        text: `{character} toma ${feature} y sube su presion de DPS.`
      }
    };
  }

  if (type === "spell") {
    const spellName = pickRewardSpell(target, enemy, theme?.spellTags || []);
    if (!spellName) {
      return null;
    }
    return {
      id,
      title: theme?.title || "Hechizo aprendido",
      text: theme?.text || `${target.name} rescata una formula magica usada por ${enemyName}.`,
      effectText: `${target.name} aprende ${spellName}`,
      effect: {
        type: "learnSpell",
        targetCharacterId: target.id,
        spellName,
        text: `{character} aprende ${spellName}.`
      }
    };
  }

  if (type === "vitality") {
    const amount = randomInt(6, 10) + lateRouteBonus * 3;
    return {
      id,
      title: theme?.title || "Descanso reforzado",
      text: theme?.text || `${target.name} aprovecha los recursos de ${enemyName} para resistir mas.`,
      effectText: `${target.name} gana +${amount} HP`,
      effect: {
        type: "healWounds",
        targetCharacterId: target.id,
        amount,
        text: `{character} queda mejor preparado y gana +${amount} HP.`
      }
    };
  }

  if (type === "training") {
    const stat = pickTrainingStat(target, enemy);
    return {
      id,
      title: theme?.title || "Entrenamiento de ruta",
      text: theme?.text || `${target.name} estudia la forma de pelear de ${enemyName} y mejora una tecnica clave.`,
      effectText: `${target.name} gana +1 ${stat}`,
      effect: {
        type: "statTraining",
        targetCharacterId: target.id,
        stat,
        amount: 1,
        text: `{character} mejora ${stat} en +1.`
      }
    };
  }

  if (type === "focus") {
    return {
      id,
      title: theme?.title || "Foco recuperado",
      text: theme?.text || `${target.name} transforma restos arcanos de ${enemyName} en un foco estable.`,
      effectText: `${target.name} gana foco arcano`,
      effect: {
        type: "arcaneFocus",
        targetCharacterId: target.id,
        feature: lateRouteBonus ? "Greater Arcane Focus" : "Arcane Focus",
        text: `{character} estabiliza un foco arcano y mejora su magia.`
      }
    };
  }

  if (type === "artifact") {
    const amount = randomInt(6, 10) + lateRouteBonus * 4;
    return {
      id,
      title: theme?.title || "Artefacto util",
      text: theme?.text || `${enemyName} deja un artefacto que mejora la preparacion general de la party.`,
      effectText: `La party gana ${formatModifier(amount)} score`,
      effect: {
        type: "partyScoreBoost",
        amount,
        label: "Artefacto",
        text: `La party aprovecha un artefacto recuperado y gana ${formatModifier(amount)} score permanente.`
      }
    };
  }

  if (type === "drill") {
    const physicalStat = randomItem(["STR", "DEX"]);
    const mentalStat = randomItem(["INT", "WIS", "CHA"]);
    return {
      id,
      title: theme?.title || "Ejercicio de combate copiado",
      text: theme?.text || `La party estudia como ${enemyName} sostiene el ritmo y convierte esa lectura en entrenamiento concreto.`,
      effectText: `+1 ${physicalStat} y +1 ${mentalStat}`,
      effect: {
        type: "bundleReward",
        effects: [
          { type: "statTraining", target: "dps", stat: physicalStat, amount: 1, text: "{character} mejora tecnica ofensiva y sube {stat} en +1." },
          { type: "statTraining", target: "tactician", stat: mentalStat, amount: 1, text: "{character} mejora lectura tactica y sube {stat} en +1." }
        ]
      }
    };
  }

  if (type === "warding") {
    return {
      id,
      title: theme?.title || "Proteccion de ruta",
      text: theme?.text || `Los restos de ${enemyName} dejan amuletos, placas y rutinas para aguantar emboscadas.`,
      effectText: "+AC y +CON",
      effect: {
        type: "bundleReward",
        effects: [
          { type: "armorBoost", target: "frontliner", amount: 1, feature: "Route Ward Armor", text: "{character} refuerza su defensa de ruta y gana +{amount} AC." },
          { type: "statTraining", target: "weakest", stat: "CON", amount: 1, text: "{character} aprende a resistir mejor y sube CON en +1." }
        ]
      }
    };
  }

  if (type === "scouting") {
    return {
      id,
      title: theme?.title || "Exploracion asegurada",
      text: theme?.text || `${enemyName} deja mapas, marcas y rutas secundarias que vuelven menos torpe el siguiente tramo.`,
      effectText: "+DEX, +WIS y score",
      effect: {
        type: "bundleReward",
        effects: [
          { type: "statTraining", target: "random", stat: "DEX", amount: 1, text: "{character} practica avance silencioso y sube DEX en +1." },
          { type: "statTraining", target: "tactician", stat: "WIS", amount: 1, text: "{character} lee mejor el terreno y sube WIS en +1." },
          { type: "partyScoreBoost", amount: 6 + lateRouteBonus * 3, label: "Mapa de ruta", text: "La exploracion preparada suma score permanente a la party." }
        ]
      }
    };
  }

  if (type === "medical") {
    const amount = randomInt(8, 14) + lateRouteBonus * 4;
    return {
      id,
      title: theme?.title || "Kit de recuperacion",
      text: theme?.text || `La victoria permite recuperar medicinas, vendas raras y una forma menos horrible de seguir caminando.`,
      effectText: `+${amount} HP y +CON`,
      effect: {
        type: "bundleReward",
        effects: [
          { type: "healWounds", target: "weakest", amount, text: "{character} usa el kit de recuperacion y gana +{amount} HP." },
          { type: "statTraining", target: "weakest", stat: "CON", amount: 1, text: "{character} se recompone y mejora CON en +1." }
        ]
      }
    };
  }

  if (type === "battleRelic") {
    const amount = randomInt(7, 12) + lateRouteBonus * 4;
    return {
      id,
      title: theme?.title || "Reliquia de combate",
      text: theme?.text || `${enemyName} deja una reliquia imperfecta: no gana sola, pero cambia como se prepara la party.`,
      effectText: `Score ${formatModifier(amount)} y mejora ofensiva`,
      effect: {
        type: "bundleReward",
        effects: [
          { type: "partyScoreBoost", amount, label: "Reliquia de combate", text: `La reliquia mejora el plan de viaje (${formatModifier(amount)} score permanente).` },
          { type: "weaponBoost", target: "dps", feature: "Relic Weapon", text: "{character} canaliza la reliquia en su arma y mejora su DPS." }
        ]
      }
    };
  }

  if (type === "statGrowth") {
    const stats = target.stats || {};
    const stat = Object.entries(stats)
      .sort((left, right) => Number(left[1] || 10) - Number(right[1] || 10))[0]?.[0] || pickTrainingStat(target, enemy);
    const amount = tournament.nextCombatIndex >= 5 && Math.random() < 0.25 ? 2 : 1;
    return {
      id,
      title: theme?.title || "Crecimiento de campana",
      text: theme?.text || `${target.name} convierte la experiencia contra ${enemyName} en una mejora real de atributo.`,
      effectText: `${target.name} gana +${amount} ${stat}`,
      effect: {
        type: "statTraining",
        targetCharacterId: target.id,
        stat,
        amount,
        text: `{character} crece por la experiencia del viaje y mejora {stat} en +${amount}.`
      }
    };
  }

  if (type === "teamTactics") {
    const amount = randomInt(8, 14) + lateRouteBonus * 4;
    return {
      id,
      title: theme?.title || "Tacticas compartidas",
      text: theme?.text || `La party analiza como ${enemyName} se movia y arma una rutina comun para no regalar aperturas.`,
      effectText: `+INT, +WIS y score ${formatModifier(amount)}`,
      effect: {
        type: "bundleReward",
        effects: [
          { type: "statTraining", target: "tactician", stat: "INT", amount: 1, text: "{character} convierte la lectura rival en un plan mejor y sube INT en +1." },
          { type: "statTraining", target: "support", stat: "WIS", amount: 1, text: "{character} afina decisiones de soporte y sube WIS en +1." },
          { type: "partyScoreBoost", amount, label: "Tacticas compartidas", text: `La party ordena sus respuestas y gana ${formatModifier(amount)} score permanente.` }
        ]
      }
    };
  }

  if (type === "elementalKit") {
    return {
      id,
      title: theme?.title || "Kit elemental recuperado",
      text: theme?.text || `Entre restos de ${enemyName} quedan aceites, cristales y municion con energia elemental.`,
      effectText: "DPS elemental y posible spell",
      effect: {
        type: "bundleReward",
        effects: [
          { type: "weaponBoost", target: "dps", feature: "Elemental Weapon Kit", text: "{character} prepara un kit elemental y mejora su DPS." },
          { type: "learnSpell", target: "spellcaster", spellTags: ["damage"], fallbackFeature: "Elemental Focus", text: "{character} aprende {spell} desde los restos elementales." }
        ]
      }
    };
  }

  if (type === "sacredCharm") {
    const amount = randomInt(6, 11) + lateRouteBonus * 3;
    return {
      id,
      title: theme?.title || "Amuleto consagrado",
      text: theme?.text || `El botin deja un amuleto defensivo que ordena heridas, miedo y mala suerte.`,
      effectText: `+WIS, +HP y score ${formatModifier(amount)}`,
      effect: {
        type: "bundleReward",
        effects: [
          { type: "statTraining", target: "support", stat: "WIS", amount: 1, text: "{character} calma a la party con el amuleto y sube WIS en +1." },
          { type: "healWounds", target: "weakest", amount: randomInt(6, 12), text: "{character} se recupera gracias al amuleto y gana +{amount} HP." },
          { type: "partyScoreBoost", amount, label: "Amuleto consagrado", text: `El amuleto estabiliza el viaje (${formatModifier(amount)} score permanente).` }
        ]
      }
    };
  }

  if (type === "steelTemper") {
    return {
      id,
      title: theme?.title || "Temple de acero",
      text: theme?.text || "Tecnicas de forja y mantenimiento convierten piezas comunes en equipo confiable.",
      effectText: "+AC, +DPS y +STR",
      effect: {
        type: "bundleReward",
        effects: [
          { type: "armorBoost", target: "frontliner", amount: 1, feature: "Tempered Armor", text: "{character} ajusta placas templadas y gana +{amount} AC." },
          { type: "weaponBoost", target: "dps", feature: "Tempered Weapon", text: "{character} templa su arma y mejora su DPS." },
          { type: "statTraining", target: "dps", stat: "STR", amount: 1, text: "{character} aprende a usar peso y filo y sube STR en +1." }
        ]
      }
    };
  }

  if (type === "sunBlessing") {
    const amount = randomInt(7, 13) + lateRouteBonus * 3;
    return {
      id,
      title: theme?.title || "Bendicion del sol antiguo",
      text: theme?.text || "Un rito solar limpia parte de la fatiga y vuelve mas firme al frente.",
      effectText: `+STR, +CON y score ${formatModifier(amount)}`,
      effect: {
        type: "bundleReward",
        effects: [
          { type: "statTraining", target: "frontliner", stat: "STR", amount: 1, text: "{character} absorbe disciplina solar y sube STR en +1." },
          { type: "statTraining", target: "weakest", stat: "CON", amount: 1, text: "{character} resiste mejor el camino y sube CON en +1." },
          { type: "partyScoreBoost", amount, label: "Rito solar", text: `El rito solar fortalece la marcha (${formatModifier(amount)} score permanente).` }
        ]
      }
    };
  }

  if (type === "tideRoute") {
    return {
      id,
      title: theme?.title || "Ruta de mareas",
      text: theme?.text || "Mapas tritones, marcas de corriente y respiracion medida abren un camino menos peligroso.",
      effectText: "+DEX, +WIS y recuperacion",
      effect: {
        type: "bundleReward",
        effects: [
          { type: "statTraining", target: "random", stat: "DEX", amount: 1, text: "{character} aprende paso de marea y sube DEX en +1." },
          { type: "statTraining", target: "tactician", stat: "WIS", amount: 1, text: "{character} lee corrientes y sube WIS en +1." },
          { type: "healWounds", target: "weakest", amount: randomInt(6, 10), text: "{character} descansa con provisiones de marea y gana +{amount} HP." }
        ]
      }
    };
  }

  if (type === "orderProtocol") {
    const amount = randomInt(8, 13) + lateRouteBonus * 3;
    return {
      id,
      title: theme?.title || "Protocolo Modron",
      text: theme?.text || "Una secuencia del Reino del Orden reduce improvisaciones tontas y deja roles mas claros.",
      effectText: `+INT y score ${formatModifier(amount)}`,
      effect: {
        type: "bundleReward",
        effects: [
          { type: "statTraining", target: "tactician", stat: "INT", amount: 1, text: "{character} memoriza un patron Modron y sube INT en +1." },
          { type: "partyScoreBoost", amount, label: "Protocolo Modron", text: `La party aplica protocolo de orden (${formatModifier(amount)} score permanente).` }
        ]
      }
    };
  }

  if (type === "chaosRelic") {
    const amount = randomInt(5, 12) + lateRouteBonus * 4;
    return {
      id,
      title: theme?.title || "Reliquia del Caos controlada",
      text: theme?.text || "La party logra encerrar un truco caotico en una herramienta que no explota de inmediato.",
      effectText: `+DEX, +CHA y score ${formatModifier(amount)}`,
      effect: {
        type: "bundleReward",
        effects: [
          { type: "statTraining", target: "random", stat: "DEX", amount: 1, text: "{character} aprende a reaccionar al caos y sube DEX en +1." },
          { type: "statTraining", target: "support", stat: "CHA", amount: 1, text: "{character} vende la improvisacion como plan y sube CHA en +1." },
          { type: "partyScoreBoost", amount, label: "Caos contenido", text: `El caos contenido suma sorpresa util (${formatModifier(amount)} score permanente).` }
        ]
      }
    };
  }

  if (type === "infernalClause") {
    return {
      id,
      title: theme?.title || "Clausula infernal favorable",
      text: theme?.text || "Un contrato pequeno, legible por una vez, promete una oportunidad extra si todo sale mal.",
      effectText: "Vida extra y +CHA",
      effect: {
        type: "bundleReward",
        effects: [
          { type: "extraLife", retryScoreBonus: 75, title: "Clausula infernal favorable" },
          { type: "statTraining", target: "support", stat: "CHA", amount: 1, text: "{character} aprende a leer letra chica infernal y sube CHA en +1." }
        ]
      }
    };
  }

  if (type === "limboTrial") {
    const amount = randomInt(8, 14) + lateRouteBonus * 3;
    return {
      id,
      title: theme?.title || "Prueba de Zodd",
      text: theme?.text || "El Limbo exige voluntad; superar la prueba deja cuerpo y mente mas dificiles de quebrar.",
      effectText: `+CON, +WIS y score ${formatModifier(amount)}`,
      effect: {
        type: "bundleReward",
        effects: [
          { type: "statTraining", target: "weakest", stat: "CON", amount: 1, text: "{character} aguanta la prueba de Zodd y sube CON en +1." },
          { type: "statTraining", target: "tactician", stat: "WIS", amount: 1, text: "{character} vuelve del Limbo con mas voluntad y sube WIS en +1." },
          { type: "partyScoreBoost", amount, label: "Bendicion del Limbo", text: `La prueba del Limbo deja temple permanente (${formatModifier(amount)} score).` }
        ]
      }
    };
  }

  if (type === "mythicShard") {
    const amount = randomInt(9, 15) + lateRouteBonus * 5;
    return {
      id,
      title: theme?.title || "Fragmento de arma mitica",
      text: theme?.text || "Un fragmento de arma creada por el demonio de las armas se purifica lo suficiente como para usarlo sin perder la mano.",
      effectText: `DPS, foco y score ${formatModifier(amount)}`,
      effect: {
        type: "bundleReward",
        effects: [
          { type: "weaponBoost", target: "dps", feature: "Mythic Weapon Shard", text: "{character} incrusta un fragmento mitico y mejora su DPS." },
          { type: "arcaneFocus", target: "spellcaster", feature: "Mythic Focus Shard", text: "{character} estabiliza un fragmento mitico como foco arcano." },
          { type: "partyScoreBoost", amount, label: "Fragmento mitico", text: `El fragmento mitico cambia la preparacion de la party (${formatModifier(amount)} score).` }
        ]
      }
    };
  }

  return null;
}

function createFallbackRewardOption(tournament, enemy) {
  return createRewardOption("training", tournament, enemy, 0) || {
    id: "fallback-rest",
    title: "Respiro minimo",
    text: "La party junta fuerzas antes del siguiente tramo.",
    effectText: "La party se estabiliza",
    effect: { type: "healWounds", amount: 4 }
  };
}

function chooseAdventureReward(rewardId) {
  const tournament = state.tournament;
  const reward = tournament?.currentReward;
  const option = reward?.options.find((candidate) => candidate.id === rewardId);
  if (!tournament || !reward || !option) {
    return;
  }

  audioManager.playSfx("cardPick");
  let appliedReward;
  try {
    appliedReward = applyAdventureReward(tournament, option);
  } catch (error) {
    console.error("No se pudo aplicar la recompensa", error);
    tournament.statusText = "Hubo un problema al aplicar esa recompensa. Proba otra vez o reinicia solo si vuelve a pasar.";
    tournament.rewardMinimized = false;
    renderTournament({ preserveScroll: true });
    return;
  }
  tournament.boons.push({
    id: `boon-${tournament.boons.length}-${option.id}`,
    title: option.title,
    text: appliedReward.text || option.text,
    effectText: option.effectText,
    enemyName: reward.enemy.name,
    details: appliedReward.details,
    scoreBefore: appliedReward.scoreBefore,
    scoreAfter: appliedReward.scoreAfter,
    scoreDelta: appliedReward.scoreDelta
  });
  tournament.currentReward = null;
  tournament.currentMatch = null;
  tournament.visibleEvents = [];
  tournament.typedEvent = "";
  tournament.completedCombats += 1;
  tournament.nextCombatIndex += 1;
  tournament.playerTeam.campaignModifier = 0;
  clearCampaignScoreImpact(tournament);
  refreshPlayerTeamScore(tournament);

  if (tournament.completedCombats >= tournament.maxCombats) {
    finishTournament("Expedicion completada", `${tournament.playerTeam.name} completo los siete combates y termino el viaje con ${tournament.boons.length} mejoras.`, true);
    return;
  }

  tournament.currentRecruitment = createVictoryRecruitment(tournament);
  if (tournament.currentRecruitment) {
    tournament.activeAdventureTab = "recruitment";
    tournament.statusText = `La victoria abre una chance de reclutar desde ${tournament.currentRecruitment.partyName}.`;
    renderTournament({ preserveScroll: true });
    return;
  }

  prepareAdventurePathChoices(tournament);
  renderTournament({ preserveScroll: true });
}

function createVictoryRecruitment(tournament) {
  const currentIds = new Set((tournament.playerTeam.members || []).map((character) => normalizeLookupText(character.id)));
  const unlockedSpecials = getUnlockedRecruitableSpecials(tournament, currentIds);

  if (unlockedSpecials.length) {
    const options = shuffle(unlockedSpecials).slice(0, Math.min(4, unlockedSpecials.length));
    return {
      id: `recruit-${tournament.completedCombats}-event-specials`,
      partyId: "special-unlocked",
      partyName: "Especiales desbloqueados",
      theme: "Los eventos recientes dejaron personajes unicos disponibles para sumarse a tu viaje.",
      options
    };
  }

  const availableParties = DND_PARTIES
    .map((party) => ({
      party,
      characters: party.characters.filter((character) => !currentIds.has(normalizeLookupText(character.id)))
    }))
    .filter((entry) => entry.characters.length);

  if (!availableParties.length) {
    return null;
  }

  const entry = randomItem(availableParties);
  const options = shuffle(entry.characters).slice(0, Math.min(4, entry.characters.length));

  return {
    id: `recruit-${tournament.completedCombats}-${entry.party.id}`,
    partyId: entry.party.id,
    partyName: entry.party.name,
    theme: entry.party.theme,
    options
  };
}

function chooseVictoryRecruit(characterId) {
  const tournament = state.tournament;
  const recruitment = tournament?.currentRecruitment;
  const sourceCharacter = recruitment?.options.find((character) => character.id === characterId);
  if (!tournament || !recruitment || !sourceCharacter) {
    return;
  }

  audioManager.playSfx(hasTag(sourceCharacter, "especial") ? "specialCardReveal" : "cardPick");
  const alreadyInParty = (tournament.playerTeam.members || [])
    .some((character) => normalizeLookupText(character.id) === normalizeLookupText(sourceCharacter.id));
  if (alreadyInParty) {
    skipVictoryRecruitment();
    return;
  }

  const recruited = cloneCharacterForRun(sourceCharacter);
  recruited.recruitedFromPartyId = recruitment.partyId;
  recruited.recruitedFromPartyName = recruitment.partyName;
  tournament.playerTeam.members = Array.isArray(tournament.playerTeam.members) ? tournament.playerTeam.members : [];
  tournament.playerTeam.members.push(recruited);
  unlockGalleryPortrait(recruited, "Reclutamiento");
  tournament.playerTeam.assignments = tournament.playerTeam.assignments || {};
  assignCharacterToBestOpenRole(recruited, tournament.playerTeam.assignments);
  state.draftedCharacters = tournament.playerTeam.members;
  state.assignments = { ...tournament.playerTeam.assignments };
  if (state.isLocalCoop) {
    state.draftPickOwners[recruited.id] = "Reclutamiento";
  }

  tournament.currentRecruitment = null;
  tournament.activeAdventureTab = "log";
  tournament.statusText = `${recruited.name} se suma al viaje. Ajusta la party si quieres usarlo en el proximo combate.`;
  refreshPlayerTeamScore(tournament);
  prepareAdventurePathChoices(tournament);
  renderAdventurePartyEditor();
}

function skipVictoryRecruitment() {
  const tournament = state.tournament;
  if (!tournament) {
    return;
  }

  tournament.currentRecruitment = null;
  tournament.activeAdventureTab = "log";
  prepareAdventurePathChoices(tournament);
  renderTournament({ preserveScroll: true });
}

function getEnemyRewardTheme(enemy) {
  const tags = new Set(enemy.members.flatMap((member) => [...getCharacterTags(member)]));
  const damageProfile = enemy.score.partyCR?.damageProfile;

  if (tags.has("healer") || tags.has("support")) {
    return {
      title: "Ritual de soporte aprendido",
      text: `La forma en que ${enemy.name} sostenia la pelea mejora la recuperacion tactica de tu party.`,
      types: ["spell", "vitality"],
      spellTags: ["healing", "buff"]
    };
  }
  if (tags.has("tank")) {
    return {
      title: "Guardia pesada",
      text: `Tu party copia la disciplina defensiva de ${enemy.name} y aguanta mejor los siguientes tramos.`,
      types: ["armor", "vitality"]
    };
  }
  if (tags.has("debuffer") || tags.has("tactician")) {
    return {
      title: "Lectura tactica",
      text: `Las maniobras de ${enemy.name} dejan una leccion clara: controlar el ritmo vale oro.`,
      types: ["training", "spell"],
      spellTags: ["debuff", "control"]
    };
  }
  if (damageProfile?.hasElemental || damageProfile?.hasSpecial) {
    return {
      title: "Canalizacion arcana",
      text: `La energia usada por ${enemy.name} se transforma en una mejora ofensiva para tu party.`,
      types: ["spell", "weapon"],
      spellTags: ["damage"]
    };
  }
  if (tags.has("dps")) {
    return {
      title: "Tecnica de presion",
      text: `La manera en que ${enemy.name} castigaba aperturas se convierte en una mejora ofensiva.`,
      types: ["weapon", "training"]
    };
  }

  return {
    title: "Impulso de combate",
    text: `Derrotar a ${enemy.name} deja material util para ajustar la party.`,
    types: ["training", "armor", "weapon"]
  };
}

function getRewardHintForEnemy(enemy) {
  const loreReward = getLoreRewardBlueprints(enemy)[0];
  if (loreReward?.title) {
    return loreReward.title;
  }
  const theme = getEnemyRewardTheme(enemy);
  return theme.title;
}

function applyAdventureReward(tournament, option) {
  refreshPlayerTeamScore(tournament);
  const beforeScore = Number(tournament.playerTeam.score?.finalScore || 0);
  const rewardEvent = { resolvedEffects: [], appliedEffects: [] };
  applyPartyEffect(tournament, rewardEvent, option.effect || {});
  refreshPlayerTeamScore(tournament);
  let afterScore = Number(tournament.playerTeam.score?.finalScore || beforeScore);
  let scoreDelta = afterScore - beforeScore;

  if (rewardEvent.appliedEffects.length && scoreDelta <= 0) {
    const fallbackBonus = Math.max(4, Math.min(10, rewardEvent.appliedEffects.length * 4));
    tournament.playerTeam.permanentScoreBonus = Number(tournament.playerTeam.permanentScoreBonus || 0) + fallbackBonus;
    rewardEvent.resolvedEffects.push(`La mejora suma impulso permanente a la party (${formatModifier(fallbackBonus)} score).`);
    rewardEvent.appliedEffects.push({
      type: "rewardScoreBonus",
      kind: "score",
      label: "Score de party",
      characterName: "Party",
      amount: fallbackBonus,
      summary: `Score permanente ${formatModifier(fallbackBonus)}.`
    });
    refreshPlayerTeamScore(tournament);
    afterScore = Number(tournament.playerTeam.score?.finalScore || beforeScore);
    scoreDelta = afterScore - beforeScore;
  }

  return {
    text: rewardEvent.resolvedEffects[0] || option.effectText || option.text,
    details: rewardEvent.appliedEffects,
    scoreBefore: beforeScore,
    scoreAfter: afterScore,
    scoreDelta
  };
}

function pickRewardTarget(tournament, type) {
  const members = (tournament.playerTeam.members || [])
    .filter((character) => ["spell", "focus"].includes(type) ? canReceiveRewardSpell(character) : true);
  if (!members.length) {
    return null;
  }

  const scored = members
    .map((character) => ({
      character,
      score: getRewardTargetScore(character, type)
    }))
    .sort((left, right) => right.score - left.score);
  const bestScore = scored[0]?.score ?? 0;
  const closeTargets = scored.filter((entry) => entry.score >= bestScore - 4);

  return randomItem(closeTargets.length ? closeTargets : scored).character;
}

function getRewardTargetScore(character, type) {
  const tags = getCharacterTags(character);
  const roles = getCharacterRolePriority(character);
  const stats = character.stats || {};
  const armorClass = getCharacterArmorClass(character);
  const hitPointInfo = getCharacterHitPointInfo(character);
  const bestMental = Math.max(stats.INT || 10, stats.WIS || 10, stats.CHA || 10);
  let score = randomInt(0, 3);

  if (["armor", "warding", "steelTemper", "sunBlessing"].includes(type)) {
    if (tags.has("tank") || roles.includes("FRONTLINER")) score += 10;
    if (armorClass <= 15) score += 5;
    score += Math.max(0, (stats.CON || 10) - 12);
  } else if (["weapon", "battleRelic", "elementalKit", "mythicShard"].includes(type)) {
    if (tags.has("dps")) score += 10;
    if (roles.includes("DPS_MELEE") || roles.includes("DPS_RANGED")) score += 5;
    score += Math.max(stats.STR || 10, stats.DEX || 10) - 10;
  } else if (["spell", "focus", "sacredCharm", "orderProtocol", "chaosRelic", "infernalClause", "limboTrial", "tideRoute"].includes(type)) {
    if (tags.has("spellcaster") || isSpellcasterClass(character)) score += 10;
    if (tags.has("support") || tags.has("debuffer") || tags.has("tactician")) score += 4;
    score += bestMental - 10;
  } else if (type === "vitality") {
    if (tags.has("tank") || roles.includes("FRONTLINER")) score += 5;
    score += Math.max(0, 90 - hitPointInfo.hitPoints) / 8;
  } else if (["training", "drill", "scouting", "medical", "statGrowth", "teamTactics"].includes(type)) {
    const statValues = Object.values(stats).map((value) => Number(value || 10));
    score += (statValues.length ? Math.max(...statValues) : 10) - 10;
    if (tags.has("tactician") || tags.has("support")) score += 3;
  }

  return score;
}

function pickRewardSpell(character, enemy, preferredTags = []) {
  if (!canReceiveRewardSpell(character)) {
    return "";
  }

  const known = new Set((character.spells || []).map((spell) => normalizeLookupText(getSpellDisplayName(spell))));
  const enemySpells = (enemy?.members || [])
    .flatMap((member) => member.spells || [])
    .map(getSpellDisplayName)
    .filter((spellName) => spellName && canCharacterLearnRewardSpell(character, spellName));
  const classSpells = typeof getSpellNamesForClass === "function"
    ? getSpellNamesForClass(character.className)
    : [];
  const fallbackSpells = [
    "Magic Missile",
    "Shield",
    "Bless",
    "Cure Wounds",
    "Guiding Bolt",
    "Fire Bolt",
    "Web",
    "Haste"
  ];
  const maxLevel = getMaxRewardSpellLevel(character);
  const candidates = [...new Set([...enemySpells, ...classSpells, ...fallbackSpells])]
    .filter((spellName) => canCharacterLearnRewardSpell(character, spellName))
    .filter((spellName) => spellName && !known.has(normalizeLookupText(spellName)))
    .filter((spellName) => {
      const metadata = getSpellMetadata(spellName);
      return !metadata || Number(metadata.level || 0) <= maxLevel;
    });

  const preferred = candidates.filter((spellName) => {
    const metadata = getSpellMetadata(spellName);
    if (!metadata || !preferredTags.length) {
      return false;
    }
    return preferredTags.some((tag) => metadata.type === tag || metadata.tags.includes(tag));
  });

  const finalCandidates = preferred.length ? preferred : candidates;
  return finalCandidates.length ? randomItem(finalCandidates) : "";
}

function canReceiveRewardSpell(character) {
  return getRewardClassSpellNames(character).length > 0 || isSpellcasterClass(character) || hasSpells(character);
}

function canCharacterLearnRewardSpell(character, spellName) {
  const normalizedSpell = normalizeLookupText(spellName);
  if (!normalizedSpell) {
    return false;
  }

  const classSpellNames = getRewardClassSpellNames(character);
  if (classSpellNames.some((candidate) => normalizeLookupText(candidate) === normalizedSpell)) {
    return true;
  }

  const metadata = getSpellMetadata(spellName);
  if (!metadata?.classes?.length) {
    return classSpellNames.length > 0;
  }

  const characterClass = normalizeLookupText(character.className);
  return metadata.classes.some((spellClass) => normalizeLookupText(spellClass) === characterClass);
}

function getRewardClassSpellNames(character) {
  if (typeof getSpellNamesForClass !== "function") {
    return [];
  }
  return getSpellNamesForClass(character.className) || [];
}

function getMaxRewardSpellLevel(character) {
  const level = Number(character.level || 1);
  if (!isSpellcasterClass(character) && !hasSpells(character)) {
    return 1;
  }
  return clamp(Math.ceil(level / 3), 1, 5);
}

function pickTrainingStat(character, enemy) {
  const tags = new Set((enemy?.members || []).flatMap((member) => [...getCharacterTags(member)]));
  if (tags.has("tactician") || tags.has("debuffer")) {
    return randomItem(["INT", "WIS"]);
  }
  if (tags.has("support") || tags.has("healer")) {
    return randomItem(["WIS", "CHA", "CON"]);
  }
  if (tags.has("dps")) {
    return randomItem(["STR", "DEX", "CHA"]);
  }

  const stats = character.stats || {};
  return Object.entries(stats)
    .sort((left, right) => Number(right[1] || 0) - Number(left[1] || 0))[0]?.[0] || "CON";
}

function revealCombatEvents(match) {
  const tournament = state.tournament;
  typeCombatEvent(match, 0, 0);
}

function typeCombatEvent(match, eventIndex, charIndex) {
  const tournament = state.tournament;
  if (!tournament || tournament.currentMatch !== match || tournament.finished) {
    clearCombatTimer();
    return;
  }

  if (eventIndex >= match.events.length) {
    tournament.typedEvent = "";
    updateCombatLog();
    finishCurrentCombat(match);
    return;
  }

  const line = match.events[eventIndex];
  tournament.typedEvent = line.slice(0, charIndex);
  updateCombatLog();

  if (charIndex < line.length) {
    state.typingTimer = window.setTimeout(() => {
      typeCombatEvent(match, eventIndex, charIndex + 3);
    }, 12);
    return;
  }

  tournament.visibleEvents.push(line);
  tournament.typedEvent = "";
  updateCombatLog();
  state.combatTimer = window.setTimeout(() => {
    typeCombatEvent(match, eventIndex + 1, 0);
  }, 140);
}

function finishCurrentCombat(match) {
  const tournament = state.tournament;
  if (!tournament || tournament.finished) {
    return;
  }

  tournament.typedEvent = "";
  tournament.combatComplete = true;
  tournament.waitingForNext = true;
  audioManager.playSfx(match.result === "Victoria" ? "combatWin" : "combatLoss");
  clearActiveRetryBonus(tournament);

  if (tournament.maxCombats) {
    if (match.result !== "Victoria") {
      if (prepareExtraLifeRetry(tournament, match)) {
        renderTournament();
        return;
      }
      if (!tournament.completedMatches.includes(match)) {
        tournament.completedMatches.push(match);
      }
      tournament.pendingFinish = {
        title: "La expedicion cayo en el camino",
        statusText: `${tournament.playerTeam.name} fue derrotada por ${match.enemy.name} en el tramo ${tournament.nextCombatIndex + 1}.`,
        champion: false
      };
      tournament.statusText = "El viaje termina aqui. Resultado listo.";
      renderTournament();
      return;
    }

    if (!tournament.completedMatches.includes(match)) {
      tournament.completedMatches.push(match);
    }

    tournament.pendingReward = { enemy: match.enemy, match };
    tournament.currentReward = null;
    tournament.rewardMinimized = true;
    tournament.activeAdventureTab = "log";
    tournament.waitingForNext = true;
    tournament.statusText = `${match.enemy.name} fue derrotada. Lee la bitacora y continua a la recompensa cuando quieras.`;
    renderTournament();
    return;
  }

  if (!tournament.completedMatches.includes(match)) {
    tournament.completedMatches.push(match);
  }

  if (match.stage === "group") {
    const isNewGroupMatch = !tournament.groupMatches.includes(match);
    if (isNewGroupMatch) {
      tournament.groupMatches.push(match);
    }
    if (isNewGroupMatch && match.result === "Victoria") {
      tournament.groupWins += 1;
    }
    if (tournament.groupMatches.length === 3 && tournament.groupWins < 2) {
      tournament.pendingFinish = {
        title: "Expedicion terminada",
        statusText: "Expedicion terminada.",
        champion: false
      };
      tournament.statusText = "Tramo terminado. Resultado listo.";
      renderTournament();
      return;
    }
    tournament.statusText = tournament.groupMatches.length === 3
      ? "El mapa se abre de nuevo. Avanza para ver el evento del camino."
      : `Camino: ${tournament.groupWins}/3 avances. Avanza cuando quieras.`;
    renderTournament();
    return;
  }

  if (match.result !== "Victoria") {
    tournament.pendingFinish = {
      title: `Eliminado en ${match.phase}`,
      statusText: `Eliminado en ${match.phase}.`,
      champion: false
    };
    tournament.statusText = `${match.phase} terminado. Resultado listo.`;
    renderTournament();
    return;
  }

  if (match.phase === "Final") {
    tournament.pendingFinish = {
      title: "Expedicion completada",
      statusText: "Expedicion completada.",
      champion: true
    };
    tournament.statusText = "Final terminada. Resultado listo.";
    renderTournament();
    return;
  }

  if (match.phase === "Final") {
    finishTournament("Expedicion completada", "Expedicion completada.", true);
    return;
  }

  tournament.knockoutIndex += 1;
  tournament.statusText = `${match.phase} superado. Avanza para el siguiente evento pre-combate.`;
  renderTournament();
}

function finishTournament(title, statusText, champion) {
  clearCombatTimer();
  const tournament = state.tournament;
  audioManager.fadeMusicTo(champion ? "victory" : "defeat");
  audioManager.playSfx(champion ? "combatWin" : "combatLoss");
  tournament.currentMatch = null;
  tournament.currentCampaignEvent = null;
  tournament.pendingCombat = null;
  tournament.replacementRequest = null;
  tournament.visibleEvents = [];
  clearCampaignScoreImpact(tournament);
  tournament.finished = true;
  tournament.champion = champion;
  tournament.finalTitle = title;
  tournament.statusText = statusText;
  recordTournamentTrophies(tournament);
  recordCoopRunResult(tournament);
  renderTournament();
}

function recordTournamentTrophies(tournament) {
  if (!tournament?.champion || tournament.trophiesRecorded) {
    return [];
  }

  refreshPlayerTeamScore(tournament);
  const team = tournament.playerTeam;
  const score = team.score || calculatePartyScore(team);
  const context = {
    partyName: team.name,
    playerName: tournament.coopPlayerName || team.ownerName || "",
    score: score.finalScore
  };
  const unlocked = [];
  const pushUnlock = (trophyId) => {
    const trophy = unlockTrophy(trophyId, context);
    if (trophy) {
      unlocked.push(trophy);
    }
  };

  pushUnlock("first-win");
  (score.groupDetails || []).forEach((group) => pushUnlock(`synergy-${group.id}`));

  const activeMembers = score.activeMembers || getActiveCombatRoster(team.members || [], team.assignments || {});
  getActiveOriginPartyIds(activeMembers)
    .forEach((partyId) => pushUnlock(`party-${partyId}`));

  checkGalleryCollectionRewards(context)
    .forEach((trophy) => unlocked.push(trophy));
  unlockMetaCollectionTrophies(context, unlocked);

  tournament.trophiesRecorded = true;
  tournament.unlockedTrophies = unlocked;
  state.recentTrophies = unlocked;
  return unlocked;
}

function unlockMetaCollectionTrophies(context, unlocked) {
  const trophyState = loadTrophyState();
  const unlockedIds = new Set(Object.keys(trophyState.unlocked || {}));
  unlocked.forEach((trophy) => unlockedIds.add(trophy.id));
  const definitions = getTrophyDefinitions();
  const synergyIds = definitions
    .filter((trophy) => trophy.category === "synergy")
    .map((trophy) => trophy.id);
  const partyIds = definitions
    .filter((trophy) => trophy.category === "party")
    .map((trophy) => trophy.id);

  if (synergyIds.length && synergyIds.every((id) => unlockedIds.has(id))) {
    const trophy = unlockTrophy("all-synergies", context);
    if (trophy) {
      unlocked.push(trophy);
      unlockedIds.add(trophy.id);
    }
  }
  if (partyIds.length && partyIds.every((id) => unlockedIds.has(id))) {
    const trophy = unlockTrophy("all-parties", context);
    if (trophy) {
      unlocked.push(trophy);
      unlockedIds.add(trophy.id);
    }
  }
}

function getActiveOriginPartyIds(members = []) {
  return [...new Set(members
    .map(getCharacterOriginPartyId)
    .filter(Boolean))];
}

function getCharacterOriginPartyId(character) {
  const explicitPartyId = character.recruitedFromPartyId || character.sourcePartyId;
  if (explicitPartyId && DND_PARTIES.some((party) => party.id === explicitPartyId)) {
    return explicitPartyId;
  }

  const party = findPartyForCharacter(character.id);
  return party?.id || "";
}

function renderCoopTournamentAction(tournament) {
  if (!state.isLocalCoop || !tournament?.finished) {
    return "";
  }

  const completedRuns = state.coopRuns.length;
  if (completedRuns < 2) {
    const nextName = state.playerNames[1] || "Jugador 2";
    return `<button data-coop-action="next-player">Juega ${escapeHtml(nextName)}</button>`;
  }

  if (shouldPlayCoopFinal()) {
    return `<button data-coop-action="final">Final local</button>`;
  }

  return `<button data-coop-action="results">Ver resultado local</button>`;
}

function handleCoopTournamentAction(action) {
  if (action === "next-player") {
    beginCoopPlayerDraft(1);
    return;
  }
  if (action === "final") {
    state.coopFinal = createCoopFinalDuel();
    renderCoopFinalResult();
    return;
  }
  renderCoopVersusResults();
}

function beginCoopPlayerDraft(playerIndex) {
  clearCombatTimer();
  clearRouletteTimer();
  state.activeCoopPlayerIndex = playerIndex;
  state.partyName = getCurrentCoopPartyName();
  resetDraftState();
  startPartyRoulette();
}

function recordCoopRunResult(tournament) {
  if (!state.isLocalCoop || !tournament || tournament.coopResultRecorded) {
    return;
  }

  refreshPlayerTeamScore(tournament);
  const playerIndex = Number.isInteger(tournament.coopPlayerIndex)
    ? tournament.coopPlayerIndex
    : state.activeCoopPlayerIndex;
  const result = {
    playerIndex,
    playerName: tournament.coopPlayerName || state.playerNames[playerIndex] || `Jugador ${playerIndex + 1}`,
    partyName: tournament.playerTeam.name,
    champion: Boolean(tournament.champion),
    completedCombats: Number(tournament.completedCombats || 0),
    maxCombats: Number(tournament.maxCombats || ADVENTURE_MAX_COMBATS),
    finalTitle: tournament.finalTitle || "",
    statusText: tournament.statusText || "",
    finalScore: Number(tournament.playerTeam.score?.finalScore || 0),
    boons: Number(tournament.boons?.length || 0),
    members: deepCloneData(tournament.playerTeam.members || []),
    assignments: deepCloneData(tournament.playerTeam.assignments || {}),
    team: deepCloneData(tournament.playerTeam)
  };

  state.coopRuns = state.coopRuns.filter((run) => run.playerIndex !== playerIndex);
  state.coopRuns.push(result);
  state.coopRuns.sort((left, right) => left.playerIndex - right.playerIndex);
  tournament.coopResultRecorded = true;
}

function shouldPlayCoopFinal() {
  return state.coopRuns.length >= 2 &&
    state.coopRuns.every((run) => run.champion && run.completedCombats >= run.maxCombats) &&
    !state.coopFinal;
}

function renderCoopVersusResults() {
  state.screen = "coop-results";
  const bothComplete = state.coopRuns.length >= 2 && state.coopRuns.every((run) => run.champion);
  const winner = bothComplete && !state.coopFinal ? null : getCoopVersusWinner();
  audioManager.fadeMusicTo(winner ? "victory" : "tournament");
  const title = winner
    ? `Vencedor local: ${winner.playerName}`
    : bothComplete ? "Final local pendiente" : "Resultado local";

  app.innerHTML = `
    <section class="screen">
      <div class="result-banner ${winner ? "victory" : ""}">
        <h2>${escapeHtml(title)}</h2>
        <p class="lead">${bothComplete ? "Ambas parties completaron el viaje; falta resolver la final local." : "Gana quien llego mas lejos en la aventura."}</p>
        <div class="button-row">
          ${shouldPlayCoopFinal() ? `<button data-coop-action="final">Jugar final local</button>` : ""}
          <button class="ghost-button" data-action="trophies">Trofeos</button>
          <button class="ghost-button" data-action="restart">Jugar otra vez</button>
          ${renderAudioSettings("compact")}
        </div>
      </div>
      <div class="coop-results-grid">
        ${state.coopRuns.map(renderCoopRunCard).join("")}
      </div>
    </section>
  `;

  app.querySelector("[data-action='restart']").addEventListener("click", confirmRestartGame);
  app.querySelector("[data-action='trophies']").addEventListener("click", openTrophyCollection);
  const finalButton = app.querySelector("[data-coop-action='final']");
  if (finalButton) {
    finalButton.addEventListener("click", () => {
      state.coopFinal = createCoopFinalDuel();
      renderCoopFinalResult();
    });
  }
  bindAudioControls(app);
}

function renderCoopRunCard(run) {
  return `
    <article class="match-card coop-run-card ${run.champion ? "win" : "loss"}">
      <div class="match-title">
        <strong>${escapeHtml(run.playerName)}</strong>
        <span class="match-score">${run.champion ? "Completo" : `${run.completedCombats}/${run.maxCombats}`}</span>
      </div>
      <h3>${escapeHtml(run.partyName)}</h3>
      <div class="combat-stats">
        <div><span>Avance</span><strong>${run.completedCombats}/${run.maxCombats}</strong></div>
        <div><span>Score final</span><strong>${run.finalScore}</strong></div>
        <div><span>Mejoras</span><strong>${run.boons}</strong></div>
        <div><span>Estado</span><strong>${run.champion ? "Campeon del viaje" : "Cayo en ruta"}</strong></div>
      </div>
    </article>
  `;
}

function getCoopVersusWinner() {
  if (state.coopRuns.length < 2) {
    return state.coopRuns[0] || null;
  }

  const ranked = [...state.coopRuns].sort((left, right) => {
    if (right.completedCombats !== left.completedCombats) {
      return right.completedCombats - left.completedCombats;
    }
    if (Number(right.champion) !== Number(left.champion)) {
      return Number(right.champion) - Number(left.champion);
    }
    return right.finalScore - left.finalScore;
  });

  const first = ranked[0];
  const second = ranked[1];
  if (
    first.completedCombats === second.completedCombats &&
    first.champion === second.champion &&
    first.finalScore === second.finalScore
  ) {
    return null;
  }
  return first;
}

function createCoopFinalDuel() {
  const [leftRun, rightRun] = state.coopRuns;
  const leftTeam = deepCloneData(leftRun.team);
  const rightTeam = deepCloneData(rightRun.team);
  leftTeam.score = calculatePartyScore(leftTeam);
  rightTeam.score = calculatePartyScore(rightTeam);

  const leftModifier = randomInt(-20, 20);
  const rightModifier = randomInt(-20, 20);
  const leftScore = Math.max(1, leftTeam.score.finalScore + leftModifier);
  const rightScore = Math.max(1, rightTeam.score.finalScore + rightModifier);
  let winnerRun = leftRun;
  let loserRun = rightRun;
  if (rightScore > leftScore || (rightScore === leftScore && rightTeam.score.finalScore > leftTeam.score.finalScore)) {
    winnerRun = rightRun;
    loserRun = leftRun;
  } else if (rightScore === leftScore && rightTeam.score.finalScore === leftTeam.score.finalScore) {
    winnerRun = randomItem([leftRun, rightRun]);
    loserRun = winnerRun === leftRun ? rightRun : leftRun;
  }

  const events = createCoopFinalEvents(leftTeam, rightTeam, winnerRun);
  return {
    leftRun,
    rightRun,
    winnerRun,
    loserRun,
    leftBaseScore: leftTeam.score.finalScore,
    rightBaseScore: rightTeam.score.finalScore,
    leftModifier,
    rightModifier,
    leftScore,
    rightScore,
    events
  };
}

function createCoopFinalEvents(leftTeam, rightTeam, winnerRun) {
  const leftRoster = getActiveCombatRoster(leftTeam.members || [], leftTeam.assignments || {});
  const rightRoster = getActiveCombatRoster(rightTeam.members || [], rightTeam.assignments || {});
  const events = [
    `${leftTeam.name} y ${rightTeam.name} chocan en la final local.`
  ];

  for (let index = 0; index < 3; index += 1) {
    events.push(createCharacterAction(randomItem(leftRoster), {
      allies: leftRoster,
      enemies: rightRoster,
      result: winnerRun.partyName === leftTeam.name ? "Victoria" : "Derrota",
      side: "player"
    }));
    events.push(createCharacterAction(randomItem(rightRoster), {
      allies: rightRoster,
      enemies: leftRoster,
      result: winnerRun.partyName === rightTeam.name ? "Victoria" : "Derrota",
      side: "player"
    }));
  }

  events.push(`${winnerRun.partyName} gana la final local para ${winnerRun.playerName}.`);
  return events;
}

function renderCoopFinalResult() {
  state.screen = "coop-final";
  const final = state.coopFinal || createCoopFinalDuel();
  state.coopFinal = final;
  audioManager.fadeMusicTo("victory");
  if (!final.newTrophies) {
    const trophy = unlockTrophy("local-champion", {
      partyName: final.winnerRun.partyName,
      playerName: final.winnerRun.playerName,
      score: Math.max(final.leftScore, final.rightScore)
    });
    final.newTrophies = trophy ? [trophy] : [];
  }

  app.innerHTML = `
    <section class="screen">
      <div class="result-banner victory">
        ${renderVictoryFireworks({ playerTeam: { name: final.winnerRun.partyName } })}
        <h2>Vencedor local: ${escapeHtml(final.winnerRun.playerName)}</h2>
        <p class="lead">${escapeHtml(final.winnerRun.partyName)} derrota a ${escapeHtml(final.loserRun.partyName)} y se queda con el duelo entre jugadores.</p>
        ${renderRecentTrophies(final.newTrophies)}
        <div class="button-row">
          <button class="ghost-button" data-action="trophies">Trofeos</button>
          <button class="ghost-button" data-action="restart">Jugar otra vez</button>
          ${renderAudioSettings("compact")}
        </div>
      </div>
      <article class="match-card win">
        <div class="match-title">
          <strong>Final local</strong>
          <span class="match-score">${escapeHtml(final.winnerRun.partyName)}</span>
        </div>
        <div class="combat-stats">
          <div><span>${escapeHtml(final.leftRun.partyName)}</span><strong>${final.leftBaseScore} ${formatModifier(final.leftModifier)} = ${final.leftScore}</strong></div>
          <div><span>${escapeHtml(final.rightRun.partyName)}</span><strong>${final.rightBaseScore} ${formatModifier(final.rightModifier)} = ${final.rightScore}</strong></div>
        </div>
        <div class="combat-log history-combat-log">
          ${final.events.map((event) => `<p>${escapeHtml(event)}</p>`).join("")}
        </div>
      </article>
      <div class="coop-results-grid">
        ${state.coopRuns.map(renderCoopRunCard).join("")}
      </div>
    </section>
  `;

  app.querySelector("[data-action='trophies']").addEventListener("click", openTrophyCollection);
  app.querySelector("[data-action='restart']").addEventListener("click", confirmRestartGame);
  bindAudioControls(app);
}

function simulatePlayerCombat(playerTeam, enemy, phase, stage) {
  const playerModifier = randomInt(-20, 20);
  const enemyModifier = randomInt(-20, 20);
  const playerRawScore = playerTeam.score.finalScore;
  const playerBaseScore = Math.max(1, playerRawScore + (playerTeam.campaignModifier || 0));
  const playerScoreBeforeEvent = playerTeam.scoreBeforeCurrentEvent;
  const playerEventImpact = playerTeam.currentEventScoreDelta || 0;
  const playerScore = Math.max(1, playerBaseScore + playerModifier);
  const enemyScore = Math.max(1, enemy.score.finalScore + enemyModifier);
  let result = "Derrota";

  if (playerScore > enemyScore) {
    result = "Victoria";
  } else if (playerScore === enemyScore) {
    result = playerBaseScore >= enemy.score.finalScore ? "Victoria" : "Derrota";
  }

  const match = {
    phase,
    stage,
    playerName: playerTeam.name,
    enemy,
    playerRawScore,
    playerBaseScore,
    playerScoreBeforeEvent,
    playerEventImpact,
    enemyBaseScore: enemy.score.finalScore,
    playerCampaignModifier: playerTeam.campaignModifier || 0,
    playerModifier,
    enemyModifier,
    playerScore,
    enemyScore,
    result,
    narrative: ""
  };
  match.narrative = createLiveNarrative(playerTeam, enemy, match);
  match.events = createCombatEvents(playerTeam, enemy, match);
  return match;
}

function createLiveNarrative(playerTeam, enemy, match) {
  if (!shouldShowRoleHints() && playerTeam.isPlayer) {
    if (match.result === "Victoria") {
      return `${playerTeam.name} encontro una apertura, sostuvo el ritmo y dejo a ${enemy.name} sin respuesta clara.`;
    }
    if (match.result === "Empate") {
      return `${playerTeam.name} y ${enemy.name} chocaron sin ceder terreno; nadie salio con ventaja real.`;
    }
    return `${enemy.name} manejo mejor el cierre del combate y obligo a ${playerTeam.name} a retirarse.`;
  }

  const playerStrength = firstText(playerTeam.score.strengths, "una composicion flexible");
  const playerWeakness = firstText(playerTeam.score.weaknesses, "pocas grietas claras");
  const enemyStrength = firstText(enemy.score.strengths, "presion constante");
  const enemyWeakness = firstText(enemy.score.weaknesses, "una debilidad mal cubierta");

  if (match.result === "Victoria") {
    return `Clave de la victoria: ${playerStrength}. Problema que casi costo caro: ${playerWeakness}. La party castigo ${enemyWeakness} y aguanto la presion rival de ${enemyStrength}.`;
  }
  if (match.result === "Empate") {
    return `El combate quedo trabado. ${playerStrength} sostuvo a la party, pero ${playerWeakness} impidio cerrar la pelea. El rival tambien dejo ver ${enemyWeakness}.`;
  }
  return `La derrota vino por ${playerWeakness}. El rival sostuvo la presion con ${enemyStrength}; la mejor respuesta propia fue ${playerStrength}, pero no alcanzo.`;
}

function createCombatEvents(playerTeam, enemy, match) {
  const threat = getCombatThreat(match);
  const playerCombatants = getActiveCombatRoster(playerTeam.members || [], playerTeam.assignments || {});
  const enemyCombatants = getActiveCombatRoster(enemy.members || [], enemy.assignments || {});
  const playerActors = playerCombatants.length ? playerCombatants : playerTeam.members || [];
  const enemyActors = enemyCombatants.length ? enemyCombatants : enemy.members || [];
  const events = [
    `${match.phase}: ${playerTeam.name} entra en combate contra ${enemy.name}. Amenaza estimada: ${threat.label}.`
  ];
  const rounds = randomInt(3, 5);

  for (let index = 0; index < rounds; index += 1) {
    const actor = randomItem(playerActors);
    events.push(createCharacterAction(actor, {
      allies: playerActors,
      enemies: enemyActors,
      result: match.result,
      side: "player"
    }));

    if (index < rounds - 1) {
      const enemyActor = randomItem(enemyActors);
      events.push(createEnemyAction(enemyActor, {
        allies: enemyActors,
        enemies: playerActors,
        result: match.result,
        side: "enemy"
      }));
    }
  }

  events.push(`Resultado final: ${match.result}. ${match.narrative}`);
  return events;
}

function rollCampaignEvent(tournament, enemy, phase) {
  const entries = getCampaignEventEntriesForEnemy(enemy);
  const candidates = entries
    .map((entry) => normalizeCampaignEvent(entry, enemy, tournament, phase))
    .filter(Boolean)
    .filter((event) => event.chance === undefined || Math.random() <= event.chance);
  const specialEvent = rollSpecialCampaignEvent(tournament, enemy, phase);
  if (specialEvent) {
    candidates.push(specialEvent);
  }

  return candidates.length ? randomItem(candidates) : null;
}

function normalizeCampaignEvent(entry, sourceEnemy, tournament, phase = "combate") {
  const isObjectEntry = entry && typeof entry === "object";
  const isGlobalEntry = isObjectEntry && (entry.globalEvent || String(entry.id || "").startsWith("global-"));
  const sourcePartyName = isGlobalEntry
    ? entry.sourcePartyName || "Origenes varios"
    : sourceEnemy?.name || "Party desconocida";
  const sourcePartyId = isGlobalEntry
    ? entry.sourcePartyId || "global"
    : sourceEnemy?.sourcePartyId || "";

  if (typeof entry === "string") {
    const type = pickCampaignPolarity({});
    const modifier = randomInt(7, 14);
    return {
      id: `legacy-${sourcePartyId}-${normalizeLookupText(entry).slice(0, 24)}`,
      type,
      title: type === "blessing" ? `La campaña ayuda contra ${sourcePartyName}` : `Viejo problema de ${sourcePartyName}`,
      text: type === "blessing"
        ? `${entry}. Por una vuelta rara del destino, la situacion favorece a tu party antes de ${phase}.`
        : `${entry}. La consecuencia cae justo antes de ${phase}.`,
      scoreModifier: type === "blessing" ? modifier : -modifier,
      sourcePartyId,
      sourcePartyName
    };
  }

  if (!entry || typeof entry !== "object") {
    return null;
  }

  if (entry.requiresCharacterId && !playerHasCampaignCharacter(tournament.playerTeam, entry.requiresCharacterId)) {
    return null;
  }

  const specialId = entry.blockedBySpecialId || entry.specialId;
  const hasSpecial = specialId && playerHasCampaignSpecial(tournament.playerTeam, specialId);
  const specialOutcome = hasSpecial
    ? entry.blessingWhenOwned || entry.ifOwned || entry.blessing
    : null;
  const baseType = entry.type || "random";
  const selectedType = baseType === "random" ? pickCampaignPolarity(entry) : pickCampaignPolarity(entry, baseType);
  const outcome = getCampaignOutcomeOverrides(entry, selectedType);
  const fallbackEffects = baseType === "random" && !outcome.effects ? [] : (entry.effects || []);
  const eventEffects = outcome.effects || fallbackEffects;
  const scoreInput = outcome.scoreModifier ?? entry.scoreModifier;
  const baseEvent = {
    ...entry,
    ...outcome,
    type: selectedType,
    title: outcome.title || entry.title || getDefaultCampaignTitle(selectedType, sourcePartyName),
    text: outcome.text || getCampaignOutcomeText(entry, selectedType, phase),
    scoreModifier: scoreInput === undefined && eventEffects.length ? 0 : getCampaignScoreModifier(scoreInput, selectedType),
    effects: eventEffects,
    sourcePartyId,
    sourcePartyName
  };

  if (specialOutcome) {
    const outcomeType = specialOutcome.type || "blessing";
    const specialEffects = Array.isArray(specialOutcome.effects) ? specialOutcome.effects : [];
    const specialScoreInput = specialOutcome.scoreModifier;
    return {
      ...baseEvent,
      ...specialOutcome,
      type: outcomeType,
      title: specialOutcome.title || `${getSpecialDisplayName(specialId)} reconoce a tu party`,
      text: specialOutcome.text || baseEvent.text,
      scoreModifier: specialScoreInput === undefined && specialEffects.length ? 0 : getCampaignScoreModifier(specialScoreInput, outcomeType),
      effects: specialEffects,
      preventedBySpecialId: specialId
    };
  }

  return baseEvent;
}

function getCampaignEventEntriesForEnemy(enemy) {
  const campaignEntries = getCampaignEncountersForParty(enemy?.sourcePartyId);
  const globalEntries = getGlobalCampaignEventEntries(campaignEntries);
  const generatedEntries = createGeneratedCampaignEvents(enemy);
  if (campaignEntries.length || globalEntries.length) {
    return [...campaignEntries, ...globalEntries, ...generatedEntries];
  }

  return generatedEntries;
}

function getGlobalCampaignEventEntries(existingEntries = []) {
  const registry = typeof globalThis !== "undefined" ? globalThis.CAMPAIGN_ENCOUNTERS : null;
  if (!registry || typeof registry !== "object") {
    return [];
  }

  const existingIds = new Set(existingEntries
    .map((entry) => entry && typeof entry === "object" ? entry.id : "")
    .filter(Boolean));
  const collectedIds = new Set(existingIds);
  const globalEntries = [];

  Object.values(registry).flat().forEach((entry) => {
    if (!entry || typeof entry !== "object") {
      return;
    }
    const entryId = String(entry.id || "");
    if (!entryId.startsWith("global-") || collectedIds.has(entryId)) {
      return;
    }
    collectedIds.add(entryId);
    globalEntries.push({
      ...entry,
      globalEvent: true,
      sourcePartyId: entry.sourcePartyId || "global",
      sourcePartyName: entry.sourcePartyName || "Origenes varios"
    });
  });

  return globalEntries;
}

function createGeneratedCampaignEvents(enemy) {
  const partyName = enemy?.name || "la party rival";
  const partyId = enemy?.sourcePartyId || "unknown";

  return [
    {
      id: `generated-${partyId}-old-rumor`,
      type: "random",
      title: `Rumor de ${partyName}`,
      text: `Un rumor viejo de ${partyName} llega al camino y cambia el animo antes del combate.`,
      blessingText: `Un rumor viejo de ${partyName} revela una ventaja tactica justo a tiempo.`,
      misfortuneText: `Un rumor viejo de ${partyName} distrae a tu party y ensucia la preparacion.`,
      outcomes: [
        {
          type: "blessing",
          scoreModifier: 0,
          effects: [createTravelEventEffect("blessing", enemy)]
        },
        {
          type: "misfortune",
          scoreModifier: 0,
          effects: [createTravelEventEffect("misfortune", enemy)]
        }
      ]
    },
    {
      id: `generated-${partyId}-campaign-echo`,
      type: "random",
      title: `Eco de campaña de ${partyName}`,
      text: `Algo que paso en la campaña de ${partyName} vuelve a pesar sobre la ronda.`,
      blessingText: `Un eco de la campaña de ${partyName} juega a favor de tu party.`,
      misfortuneText: `Un eco de la campaña de ${partyName} aparece en el peor momento posible.`,
      outcomes: [
        {
          type: "blessing",
          scoreModifier: 0,
          effects: [createTravelEventEffect("blessing", enemy)]
        },
        {
          type: "misfortune",
          scoreModifier: 0,
          effects: [createTravelEventEffect("misfortune", enemy)]
        }
      ]
    },
    {
      id: `generated-${partyId}-southern-mist`,
      type: "misfortune",
      chance: 0.4,
      title: "Niebla corrupta del sur",
      text: "La niebla que cayo del cielo toca la ruta; corrompe provisiones, mapas y confianza de la party.",
      scoreModifier: 0,
      effects: [
        { type: "partyScorePenalty", amount: randomInt(8, 14), label: "Niebla corrupta", text: "La niebla del sur arruina recursos clave y baja el score permanente de la party." },
        { type: "statDrain", target: "random", stat: "CON", amount: 1, text: "{character} respira corrupcion y pierde CON en 1." }
      ]
    },
    {
      id: `generated-${partyId}-order-audit`,
      type: "random",
      chance: 0.35,
      title: "Auditoria del Reino del Orden",
      blessingText: "Un patron Modron ordena la marcha y convierte errores en protocolo.",
      misfortuneText: "Los Modrons detectan caos en la party y aplican una correccion burocratica brutal.",
      outcomes: [
        {
          type: "blessing",
          scoreModifier: 0,
          effects: [
            { type: "statTraining", target: "tactician", stat: "INT", amount: 1, text: "{character} aprende protocolo Modron y mejora INT en +1." },
            { type: "partyScoreBoost", amount: 7, label: "Protocolo del Orden", text: "El protocolo Modron mejora la preparacion de la party (+7 score permanente)." }
          ]
        },
        {
          type: "misfortune",
          scoreModifier: 0,
          effects: [
            { type: "partyScorePenalty", amount: randomInt(7, 13), label: "Correccion del Orden", text: "El Reino del Orden confisca recursos caoticos y baja el score permanente." },
            { type: "statDrain", target: "random", stat: "CHA", amount: 1, text: "{character} queda aplastado por el protocolo y pierde CHA en 1." }
          ]
        }
      ]
    },
    {
      id: `generated-${partyId}-chaos-anarchists`,
      type: "random",
      chance: 0.35,
      title: "Anarquistas del Reino del Caos",
      blessingText: "Un portal del Caos deja una maniobra impredecible que sirve justo antes del combate.",
      misfortuneText: "Los Anarquistas juegan a romper reglas y la party pierde control de la ruta.",
      outcomes: [
        {
          type: "blessing",
          scoreModifier: 0,
          effects: [
            { type: "statTraining", target: "random", stat: "DEX", amount: 1, text: "{character} aprende movimiento impredecible y mejora DEX en +1." },
            { type: "partyScoreBoost", amount: 6, label: "Improvisacion caotica", text: "La improvisacion caotica mejora la ruta (+6 score permanente)." }
          ]
        },
        {
          type: "misfortune",
          scoreModifier: 0,
          effects: [
            { type: "partyScorePenalty", amount: randomInt(6, 12), label: "Ruptura caotica", text: "El Caos rompe el plan de viaje y baja el score permanente." },
            { type: "breakWeapon", target: "dps", feature: "Broken Weapon", text: "{character} termina con el arma arruinada por un juego anarquista." }
          ]
        }
      ]
    },
    {
      id: `generated-${partyId}-infernal-bargain`,
      type: "random",
      chance: 0.32,
      title: "Contrato del Infierno",
      blessingText: "Un demonio ofrece una clausula util; la letra chica parece aceptable por ahora.",
      misfortuneText: "Una clausula infernal se activa tarde y cobra recursos que la party ya daba por propios.",
      outcomes: [
        {
          type: "blessing",
          scoreModifier: 0,
          effects: [
            { type: "extraLife", retryScoreBonus: 70, title: "Clausula infernal" }
          ]
        },
        {
          type: "misfortune",
          scoreModifier: 0,
          effects: [
            { type: "partyScorePenalty", amount: randomInt(9, 16), label: "Deuda infernal", text: "La deuda infernal cobra materiales y baja el score permanente." },
            { type: "woundRandomCharacter", target: "weakest", amount: randomInt(7, 13), text: "{character} paga una parte del contrato con sangre." }
          ]
        }
      ]
    },
    {
      id: `generated-${partyId}-limbo-sleep`,
      type: "misfortune",
      chance: 0.28,
      title: "Sueño del Limbo",
      text: "El Limbo exige una salvada de voluntad; una parte de la party camina despierta, pero piensa dormida.",
      scoreModifier: 0,
      effects: [
        { type: "partyScorePenalty", amount: randomInt(7, 15), label: "Letargo del Limbo", text: "El letargo del Limbo baja el score permanente de la party." },
        { type: "statDrain", target: "tactician", stat: "WIS", amount: 1, text: "{character} queda marcado por el sueño del Limbo y pierde WIS en 1." }
      ]
    },
    {
      id: `generated-${partyId}-cursed-weapon-demon`,
      type: "misfortune",
      chance: 0.3,
      title: "Arma mitica maldita",
      text: "Una pieza creada por el demonio de las armas llama demasiado fuerte; tocarla cuesta caro.",
      scoreModifier: 0,
      effects: [
        { type: "partyScorePenalty", amount: randomInt(8, 14), label: "Maldicion del arma", text: "La maldicion del arma desordena recursos y baja el score permanente." },
        { type: "breakWeapon", target: "dps", feature: "Cursed Weapon Scar", text: "{character} fuerza una reliquia maldita y pierde filo ofensivo." }
      ]
    },
    {
      id: `generated-${partyId}-tribal-border`,
      type: "random",
      chance: 0.34,
      title: "Frontera de tribus",
      blessingText: "Una tribu local acepta negociar paso, tecnica o provisiones antes del combate.",
      misfortuneText: "La party cruza territorio tribal sin entender las marcas y paga el error.",
      outcomes: [
        {
          type: "blessing",
          scoreModifier: 0,
          effects: [
            { type: "statTraining", target: "random", stat: randomItem(["STR", "WIS", "DEX"]), amount: 1, text: "{character} aprende de la tribu local y mejora {stat} en +1." },
            { type: "partyScoreBoost", amount: 6, label: "Paso tribal", text: "El paso negociado mejora la ruta (+6 score permanente)." }
          ]
        },
        {
          type: "misfortune",
          scoreModifier: 0,
          effects: [
            { type: "partyScorePenalty", amount: randomInt(6, 12), label: "Conflicto tribal", text: "Cruzar territorio tribal sin permiso baja el score permanente." },
            { type: "damageArmor", target: "frontliner", amount: 1, text: "{character} recibe el castigo del territorio y pierde +1 AC efectivo." }
          ]
        }
      ]
    },
    {
      id: `generated-${partyId}-sunless-altitude`,
      type: "misfortune",
      chance: 0.28,
      title: "Altura sin sol",
      text: "El camino sube hacia piedras flotantes, pero el cielo se tapa; la fuerza solar no llega y el cuerpo lo siente.",
      scoreModifier: 0,
      effects: [
        { type: "partyScorePenalty", amount: randomInt(7, 13), label: "Sol bloqueado", text: "La ruta sin sol deja cansancio permanente y baja el score de la party." },
        { type: "statDrain", target: "frontliner", stat: "STR", amount: 1, text: "{character} pierde ritmo cargando peso sin sol y baja STR en 1." }
      ]
    },
    {
      id: `generated-${partyId}-modron-reprisal`,
      type: "misfortune",
      chance: 0.27,
      title: "Reproduccion Modron",
      text: "Los Modrons vuelven a buscar cuentas viejas. No vienen furiosos: vienen organizados, que es peor.",
      scoreModifier: 0,
      effects: [
        { type: "partyScorePenalty", amount: randomInt(8, 15), label: "Persecucion Modron", text: "La persecucion del Reino del Orden consume recursos y baja el score permanente." },
        { type: "statDrain", target: "random", stat: "DEX", amount: 1, text: "{character} queda atrapado en patrones rigidos y pierde DEX en 1." }
      ]
    },
    {
      id: `generated-${partyId}-red-tide-debt`,
      type: "misfortune",
      chance: 0.25,
      title: "Deuda con la faccion roja",
      text: "La faccion carmesi de Kaleb reclama un arma, una promesa o una mentira. Algo se paga igual.",
      scoreModifier: 0,
      effects: [
        { type: "partyScorePenalty", amount: randomInt(6, 14), label: "Deuda carmesi", text: "La deuda con la faccion roja baja el score permanente de la party." },
        { type: "breakWeapon", target: "dps", feature: "Crimson Debt Scar", text: "{character} entrega piezas de su equipo para saldar la deuda y pierde presion ofensiva." }
      ]
    },
    {
      id: `generated-${partyId}-steel-devotee-toll`,
      type: "random",
      chance: 0.32,
      title: "Peaje de los Devotos del Acero",
      blessingText: "Los Devotos del Acero respetan una demostracion limpia y prestan forja antes del combate.",
      misfortuneText: "Los Devotos del Acero cobran peaje por cruzar territorio armado y se llevan material importante.",
      outcomes: [
        {
          type: "blessing",
          scoreModifier: 0,
          effects: [
            { type: "armorBoost", target: "frontliner", amount: 1, feature: "Borrowed Steel Plate", text: "{character} recibe placas prestadas y gana +{amount} AC." },
            { type: "partyScoreBoost", amount: 6, label: "Respeto del acero", text: "El respeto de la forja mejora la moral de la party (+6 score permanente)." }
          ]
        },
        {
          type: "misfortune",
          scoreModifier: 0,
          effects: [
            { type: "partyScorePenalty", amount: randomInt(7, 14), label: "Peaje de acero", text: "El peaje de acero consume equipo y baja el score permanente." },
            { type: "damageArmor", target: "frontliner", amount: 1, text: "{character} pierde placas utiles pagando el peaje y baja AC efectivo." }
          ]
        }
      ]
    },
    {
      id: `generated-${partyId}-infernal-meat-price`,
      type: "misfortune",
      chance: 0.24,
      title: "Precio de carne infernal",
      text: "Una puerta del Infierno queda abierta demasiado tiempo. El miedo se vuelve criatura y cobra carne mortal.",
      scoreModifier: 0,
      effects: [
        { type: "partyScorePenalty", amount: randomInt(9, 16), label: "Precio infernal", text: "El precio infernal baja el score permanente de la party." },
        { type: "woundRandomCharacter", target: "weakest", amount: randomInt(8, 15), text: "{character} queda marcado por una criatura de miedo." }
      ]
    },
    {
      id: `generated-${partyId}-megafauna-supply-loss`,
      type: "misfortune",
      chance: 0.26,
      title: "Megafauna en estampida",
      text: "Una masa enorme cruza el camino; nadie pelea por honor cuando una sombra gigante pisa provisiones.",
      scoreModifier: 0,
      effects: [
        { type: "partyScorePenalty", amount: randomInt(6, 13), label: "Provisiones aplastadas", text: "La megafauna aplasta recursos y baja el score permanente." },
        { type: "woundRandomCharacter", target: "frontliner", amount: randomInt(6, 12), text: "{character} frena la estampida como puede y queda herido." }
      ]
    },
    {
      id: `generated-${partyId}-weapon-demon-whisper`,
      type: "misfortune",
      chance: 0.25,
      title: "Susurro del demonio de las armas",
      text: "Una reliquia promete poder gratis. La promesa dura menos que la maldicion.",
      scoreModifier: 0,
      effects: [
        { type: "partyScorePenalty", amount: randomInt(8, 15), label: "Susurro maldito", text: "El susurro de la reliquia maldita baja el score permanente." },
        { type: "statDrain", target: "dps", stat: "WIS", amount: 1, text: "{character} escucha demasiado tiempo al arma y pierde WIS en 1." }
      ]
    },
    {
      id: `generated-${partyId}-draco-hunt`,
      type: "random",
      chance: 0.38,
      title: "Caceria de dracos",
      blessingText: "La party recuerda las pautas de la Division Roja: aislar, controlar y recien despues rematar.",
      misfortuneText: "Mas de un draco aparece junto; uno queda herido, escapa y convierte el camino en una persecucion horrible.",
      outcomes: [
        {
          type: "blessing",
          scoreModifier: 0,
          effects: [
            { type: "statTraining", target: "tactician", stat: "INT", amount: 1, text: "{character} aplica protocolo anti-draco y mejora INT en +1." },
            { type: "partyScoreBoost", amount: 8, label: "Control anti-draco", text: "La party aprende a aislar objetivos veloces (+8 score permanente)." }
          ]
        },
        {
          type: "misfortune",
          scoreModifier: 0,
          effects: [
            { type: "partyScorePenalty", amount: randomInt(8, 15), label: "Draco escapado", text: "Un draco herido escapa y obliga a gastar recursos de rastreo, bajando el score permanente." },
            { type: "woundRandomCharacter", target: "random", amount: randomInt(7, 13), text: "{character} recibe tres ataques de draco antes de poder reposicionarse." }
          ]
        }
      ]
    },
    {
      id: `generated-${partyId}-gray-dominator-draco`,
      type: "misfortune",
      chance: 0.24,
      title: "Draco gris dominador",
      text: "Un zumbido de 25 pies apaga componentes verbales; los conjuros no salen y el plan queda mudo.",
      scoreModifier: 0,
      effects: [
        { type: "partyScorePenalty", amount: randomInt(7, 13), label: "Silencio draconico", text: "El zumbido del draco gris rompe la preparacion magica y baja el score permanente." },
        { type: "loseRandomSpell", target: "spellcaster", fallbackWound: 8, text: "{character} pierde acceso temporal a {spell} por el zumbido antiverbal." }
      ]
    },
    {
      id: `generated-${partyId}-black-trapper-draco`,
      type: "misfortune",
      chance: 0.25,
      title: "Draco negro trampero",
      text: "El draco vomita una mezcla que arruina armas, armaduras y paciencia en la misma escena.",
      scoreModifier: 0,
      effects: [
        { type: "damageArmor", target: "frontliner", amount: 1, text: "La baba del draco derrite parte de la defensa de {character}." },
        { type: "breakWeapon", target: "dps", feature: "Corroded Weapon", text: "El arma de {character} queda corroída por el vomito acido." },
        { type: "partyScorePenalty", amount: randomInt(8, 14), label: "Equipo corroído", text: "La corrosion obliga a gastar materiales y baja el score permanente." }
      ]
    },
    {
      id: `generated-${partyId}-violet-draco-crystal`,
      type: "random",
      chance: 0.27,
      title: "Cristal violeta de draco",
      blessingText: "Un cristal de cola violeta se recupera entero y sirve para estudiar teletransporte.",
      misfortuneText: "Una salvada de DEX fallida separa a la party sesenta pies en el peor momento.",
      outcomes: [
        {
          type: "blessing",
          scoreModifier: 0,
          effects: [
            { type: "arcaneFocus", target: "spellcaster", feature: "Violet Draco Crystal", text: "{character} usa un cristal violeta como foco arcano." },
            { type: "learnSpell", target: "spellcaster", spellTags: ["mobility", "defense"], text: "{character} aprende {spell} estudiando el cristal violeta." }
          ]
        },
        {
          type: "misfortune",
          scoreModifier: 0,
          effects: [
            { type: "statDrain", target: "random", stat: "DEX", amount: 1, text: "{character} queda desorientado por el teletransporte y pierde DEX en 1." },
            { type: "partyScorePenalty", amount: randomInt(6, 12), label: "Separacion violeta", text: "La separacion forzada rompe la formacion y baja el score permanente." }
          ]
        }
      ]
    },
    {
      id: `generated-${partyId}-eragior-eyes`,
      type: "random",
      chance: 0.34,
      title: "Ojos del Orden Eragior",
      blessingText: "Un informe robado de los Eragior revela panorama, pasado y una pista del futuro inmediato.",
      misfortuneText: "Los Eragior ven demasiado: el individuo, el panorama, el pasado y la jugada que todavia no hiciste.",
      outcomes: [
        {
          type: "blessing",
          scoreModifier: 0,
          effects: [
            { type: "statTraining", target: "tactician", stat: "INT", amount: 1, text: "{character} descifra simbolos de los Ojos Eragior y mejora INT en +1." },
            { type: "partyScoreBoost", amount: 9, label: "Informe Eragior", text: "El informe permite anticipar problemas (+9 score permanente)." }
          ]
        },
        {
          type: "misfortune",
          scoreModifier: 0,
          effects: [
            { type: "partyScorePenalty", amount: randomInt(9, 16), label: "Vigilancia Eragior", text: "La vigilancia Eragior fuerza rutas peores y baja el score permanente." },
            { type: "statDrain", target: "random", stat: "CHA", amount: 1, text: "{character} queda paranoico tras notar ojos encima y pierde CHA en 1." }
          ]
        }
      ]
    },
    {
      id: `generated-${partyId}-broken-moon-cell`,
      type: "misfortune",
      chance: 0.29,
      title: "Celula de la Luna Rota",
      text: "Una celula durmiente marca humanoides con simbolos antiguos y la ruta se llena de monstruos rituales.",
      scoreModifier: 0,
      effects: [
        { type: "partyScorePenalty", amount: randomInt(8, 15), label: "Rito de Luna Rota", text: "Los rituales de la Luna Rota contaminan la ruta y bajan el score permanente." },
        { type: "woundRandomCharacter", target: "weakest", amount: randomInt(8, 14), text: "Un monstruo marcado por la Luna Rota alcanza a {character}." }
      ]
    },
    {
      id: `generated-${partyId}-evolution-maws`,
      type: "misfortune",
      chance: 0.24,
      title: "Fauces de la evolucion",
      text: "Las Fauces empujan a los dracos a evolucionar y hasta los archidruidas parecen obedecer algo que no deberian.",
      scoreModifier: 0,
      effects: [
        { type: "partyScorePenalty", amount: randomInt(10, 17), label: "Evolucion forzada", text: "La evolucion de dracos vuelve la amenaza mas cara y baja el score permanente." },
        { type: "statDrain", target: "support", stat: "WIS", amount: 1, text: "{character} siente la presion druidica controlada y pierde WIS en 1." }
      ]
    },
    {
      id: `generated-${partyId}-protector-guild-alert`,
      type: "blessing",
      chance: 0.26,
      title: "Alerta del Gremio de Protectores",
      text: "Un centinela del gremio informa un problema antes de que sea problema; raro, util y muy profesional.",
      scoreModifier: 0,
      effects: [
        { type: "statTraining", target: "tactician", stat: "WIS", amount: 1, text: "{character} interpreta el reporte de centinela y mejora WIS en +1." },
        { type: "partyScoreBoost", amount: 8, label: "Alerta de centinela", text: "El aviso temprano mejora la ruta (+8 score permanente)." }
      ]
    },
    {
      id: `generated-${partyId}-adin-army-pursuit`,
      type: "random",
      chance: 0.27,
      title: "Ejercitos de Adin",
      blessingText: "Un salvoconducto de Adin abre camino entre patrullas y evita revisiones absurdas.",
      misfortuneText: "Los ejercitos de Adin confunden a la party con gente que ayuda a los Eragior y empiezan las preguntas.",
      outcomes: [
        {
          type: "blessing",
          scoreModifier: 0,
          effects: [
            { type: "partyScoreBoost", amount: 7, label: "Salvoconducto de Adin", text: "El salvoconducto evita bloqueos de ruta (+7 score permanente)." },
            { type: "statTraining", target: "support", stat: "CHA", amount: 1, text: "{character} aprende a negociar con patrullas y mejora CHA en +1." }
          ]
        },
        {
          type: "misfortune",
          scoreModifier: 0,
          effects: [
            { type: "partyScorePenalty", amount: randomInt(7, 14), label: "Revision de Adin", text: "La persecucion politica consume tiempo y baja el score permanente." },
            { type: "statDrain", target: "random", stat: "CHA", amount: 1, text: "{character} queda marcado por interrogatorios y pierde CHA en 1." }
          ]
        }
      ]
    },
    {
      id: `generated-${partyId}-femme-noir-black`,
      type: "random",
      chance: 0.28,
      title: "Color Negro: Femme Noir",
      blessingText: "Un contacto de negro entrega informacion incomoda sobre quien miente en la ruta.",
      misfortuneText: "La organizacion de Femme Noir cruza nombres, favores y amenazas; nadie sabe quien esta jugando para quien.",
      outcomes: [
        {
          type: "blessing",
          scoreModifier: 0,
          effects: [
            { type: "statTraining", target: "tactician", stat: "CHA", amount: 1, text: "{character} aprende a moverse entre favores oscuros y mejora CHA en +1." },
            { type: "partyScoreBoost", amount: 7, label: "Contacto negro", text: "La informacion de Femme Noir evita una trampa (+7 score permanente)." }
          ]
        },
        {
          type: "misfortune",
          scoreModifier: 0,
          effects: [
            { type: "partyScorePenalty", amount: randomInt(8, 15), label: "Juego negro", text: "La organizacion manipula la ruta y baja el score permanente." },
            { type: "statDrain", target: "support", stat: "WIS", amount: 1, text: "{character} confia en la persona equivocada y pierde WIS en 1." }
          ]
        }
      ]
    },
    {
      id: `generated-${partyId}-paseo-closed-door`,
      type: "misfortune",
      chance: 0.23,
      title: "Puerta abierta en el Paseo",
      text: "Sergio Vanel aviso que la puerta del bano debia quedar cerrada. Por supuesto, alguien no la cerro.",
      scoreModifier: 0,
      effects: [
        { type: "partyScorePenalty", amount: randomInt(6, 12), label: "Agujero del Paseo", text: "El problema del bano del Paseo desordena el viaje y baja el score permanente." },
        { type: "woundRandomCharacter", target: "random", amount: randomInt(5, 11), text: "{character} paga las consecuencias de mirar donde no debia." }
      ]
    },
    {
      id: `generated-${partyId}-paseo-support`,
      type: "blessing",
      chance: 0.24,
      title: "Ayuda del Paseo de las Vistas",
      text: "Dahlia trae herramienta, Amir cubre con rifle, Micaela aporta cultivo y Cesar aparece con comida a tiempo.",
      scoreModifier: 0,
      effects: [
        { type: "healWounds", target: "weakest", amount: randomInt(8, 13), text: "{character} recupera fuerzas con ayuda del Paseo y gana +{amount} HP." },
        { type: "weaponBoost", target: "dps", feature: "Paseo Field Gear", text: "{character} recibe equipo improvisado del Paseo y mejora su DPS." },
        { type: "partyScoreBoost", amount: 7, label: "Red del Paseo", text: "La ayuda vecinal mejora la ruta (+7 score permanente)." }
      ]
    },
    {
      id: `generated-${partyId}-factory-census`,
      type: "random",
      chance: 0.26,
      title: "Libretas de la Fabrica",
      blessingText: "Jake, Melania, Omar y Feli convierten la Fabrica en descanso, seguridad y reparaciones.",
      misfortuneText: "Anthony Ghessir empieza a preguntar por el pasado de todos y la ruta se vuelve un expediente.",
      outcomes: [
        {
          type: "blessing",
          scoreModifier: 0,
          effects: [
            { type: "armorBoost", target: "frontliner", amount: 1, feature: "Factory Plates", text: "Omar ajusta la defensa de {character} y gana +{amount} AC." },
            { type: "healWounds", target: "weakest", amount: 10, text: "Feli cura a {character} y le devuelve +{amount} HP." }
          ]
        },
        {
          type: "misfortune",
          scoreModifier: 0,
          effects: [
            { type: "partyScorePenalty", amount: randomInt(6, 13), label: "Expediente de Fabrica", text: "Las preguntas de la Fabrica vuelven lento el viaje y bajan el score permanente." },
            { type: "statDrain", target: "random", stat: "INT", amount: 1, text: "{character} queda saturado por interrogatorios y pierde INT en 1." }
          ]
        }
      ]
    },
    {
      id: `generated-${partyId}-azure-emissaries`,
      type: "random",
      chance: 0.27,
      title: "Azures y Emisarios",
      blessingText: "Digory Flecher y el color azur dejan una pista util sin pedir que te unas a nadie.",
      misfortuneText: "Los Emisarios marrones y el Bombardero convierten la ruta en una amenaza publica.",
      outcomes: [
        {
          type: "blessing",
          scoreModifier: 0,
          effects: [
            { type: "learnSpell", target: "spellcaster", spellTags: ["utility", "defense"], text: "{character} aprende {spell} a partir de una pista azur." },
            { type: "partyScoreBoost", amount: 8, label: "Pista azur", text: "La pista azur mejora la lectura del mundo (+8 score permanente)." }
          ]
        },
        {
          type: "misfortune",
          scoreModifier: 0,
          effects: [
            { type: "partyScorePenalty", amount: randomInt(8, 15), label: "Amenaza emisaria", text: "La amenaza del Bombardero fuerza desvio y baja el score permanente." },
            { type: "woundRandomCharacter", target: "random", amount: randomInt(7, 12), text: "{character} queda en medio de un ataque pensado para llamar la atencion." }
          ]
        }
      ]
    },
    {
      id: `generated-${partyId}-colors-war`,
      type: "misfortune",
      chance: 0.25,
      title: "Guerra de colores",
      text: "Negro, Azur, Naranja, Marron, Blancos y Hermanas empujan objetivos distintos; la party queda en el medio.",
      scoreModifier: 0,
      effects: [
        { type: "partyScorePenalty", amount: randomInt(9, 16), label: "Guerra de colores", text: "La guerra de organizaciones vuelve imposible una ruta limpia y baja el score permanente." },
        { type: "statDrain", target: "tactician", stat: "WIS", amount: 1, text: "{character} intenta entender demasiados bandos y pierde WIS en 1." }
      ]
    },
    {
      id: `generated-${partyId}-brandon-capsule`,
      type: "blessing",
      chance: 0.2,
      title: "Capsula de luz de Brandon",
      text: "Una version adulta de Brandon despierta, advierte que todos tienen su propio equipo y deja una leccion simple: cuidado.",
      scoreModifier: 0,
      effects: [
        { type: "statTraining", target: "tactician", stat: "WIS", amount: 1, text: "{character} toma en serio la advertencia de Brandon y mejora WIS en +1." },
        { type: "partyScoreBoost", amount: 10, label: "Advertencia de Brandon", text: "La advertencia evita confiar de mas (+10 score permanente)." }
      ]
    }
  ];
}

function getCampaignOutcomeOverrides(entry, type) {
  if (Array.isArray(entry.outcomes)) {
    const matchingOutcomes = entry.outcomes.filter((outcome) => (outcome.type || type) === type);
    if (matchingOutcomes.length) {
      return randomItem(matchingOutcomes);
    }
  }

  if (type === "blessing") {
    return entry.blessingOutcome || entry.positiveOutcome || entry.positive || {};
  }
  if (type === "misfortune") {
    return entry.misfortuneOutcome || entry.negativeOutcome || entry.negative || {};
  }
  return {};
}

function getCampaignOutcomeText(entry, type, phase) {
  if (type === "blessing") {
    return entry.blessingText ||
      entry.positiveText ||
      `La historia de ${entry.title || "este encuentro"} se da vuelta y favorece a tu party antes de ${phase}.`;
  }
  if (type === "misfortune") {
    return entry.misfortuneText ||
      entry.negativeText ||
      entry.text ||
      entry.description ||
      `La historia de ${entry.title || "este encuentro"} golpea a tu party antes de ${phase}.`;
  }
  return entry.text || entry.description || "";
}

function pickCampaignPolarity(entry, fallbackType = "random") {
  if (["blessing", "misfortune", "neutral"].includes(fallbackType)) {
    return fallbackType;
  }

  const blessingChance = clamp(Number(entry.blessingChance ?? 0.5), 0, 1);
  return Math.random() < blessingChance ? "blessing" : "misfortune";
}

function createTravelEventEffect(type, enemy) {
  const enemyTags = new Set((enemy?.members || []).flatMap((member) => [...getCharacterTags(member)]));
  const preferredSpellTags = getPreferredSpellTagsForEnemy(enemy);
  const blessingPool = [];
  const misfortunePool = ["woundRandomCharacter", "damageArmor", "breakWeapon", "statDrain", "partyScorePenalty"];

  if (enemyTags.has("tank")) blessingPool.push("armorBoost", "healWounds");
  if (enemyTags.has("dps")) blessingPool.push("weaponBoost", "statTraining");
  if (enemyTags.has("spellcaster")) blessingPool.push("learnSpell");
  if (enemyTags.has("support") || enemyTags.has("healer")) blessingPool.push("healWounds", "learnSpell");
  if (enemyTags.has("tactician") || enemyTags.has("debuffer")) blessingPool.push("statTraining", "learnSpell");

  const positivePool = blessingPool.length
    ? blessingPool
    : ["armorBoost", "weaponBoost", "learnSpell", "healWounds", "statTraining"];
  const negativePool = enemyTags.has("spellcaster")
    ? [...misfortunePool, "loseRandomSpell"]
    : misfortunePool;

  return createTravelEffectByType(
    type === "blessing" ? randomItem(positivePool) : randomItem(negativePool),
    preferredSpellTags
  );
}

function createTravelEffectByType(effectType, preferredSpellTags = []) {
  if (effectType === "addSpecialCharacter") {
    return {
      type: "addSpecialCharacter",
      text: "{character} cruza el camino de la party y se suma como Especial."
    };
  }
  if (effectType === "armorBoost") {
    return { type: "armorBoost", target: "frontliner", amount: 1 };
  }
  if (effectType === "weaponBoost") {
    return { type: "weaponBoost", target: "dps", feature: Math.random() < 0.35 ? "Runic Weapon" : "Masterwork Weapon" };
  }
  if (effectType === "learnSpell") {
    return { type: "learnSpell", target: "spellcaster", spellTags: preferredSpellTags };
  }
  if (effectType === "healWounds") {
    return { type: "healWounds", target: "weakest", amount: randomInt(5, 10) };
  }
  if (effectType === "statTraining") {
    return { type: "statTraining", target: "random", stat: randomItem(["STR", "DEX", "CON", "INT", "WIS", "CHA"]), amount: 1 };
  }
  if (effectType === "damageArmor") {
    return { type: "damageArmor", target: "frontliner", amount: 1 };
  }
  if (effectType === "breakWeapon") {
    return { type: "breakWeapon", target: "dps", feature: "Broken Weapon" };
  }
  if (effectType === "loseRandomSpell") {
    return { type: "loseRandomSpell", target: "spellcaster" };
  }
  if (effectType === "statDrain") {
    return { type: "statDrain", target: "random", stat: randomItem(["STR", "DEX", "CON", "INT", "WIS", "CHA"]), amount: 1 };
  }
  if (effectType === "partyScorePenalty") {
    return {
      type: "partyScorePenalty",
      amount: randomInt(6, 12),
      label: "Cicatriz de ruta",
      text: "La desgracia deja perdida de recursos y baja el score permanente de la party."
    };
  }

  return { type: "woundRandomCharacter", target: "weakest", amount: randomInt(5, 11) };
}

function getPreferredSpellTagsForEnemy(enemy) {
  const tags = new Set((enemy?.members || []).flatMap((member) => [...getCharacterTags(member)]));
  const damageProfile = enemy?.score?.partyCR?.damageProfile;
  if (tags.has("healer") || tags.has("support")) return ["healing", "buff"];
  if (tags.has("debuffer") || tags.has("tactician")) return ["debuff", "control"];
  if (damageProfile?.hasElemental || damageProfile?.hasSpecial || tags.has("dps")) return ["damage"];
  return [];
}

function rollSpecialCampaignEvent(tournament, enemy, phase) {
  if (!Array.isArray(tournament.campaignSpecialIdsSeen)) {
    tournament.campaignSpecialIdsSeen = [];
  }

  const candidates = getEligibleAssociatedSpecials(tournament)
    .filter((entry) => !tournament.campaignSpecialIdsSeen.some((id) =>
      normalizeLookupText(id) === normalizeLookupText(entry.special.id)
    ))
    .filter((entry) => Math.random() <= entry.association.chance);

  if (!candidates.length) {
    return null;
  }

  const { association, special, linkedMembers } = randomItem(candidates);
  tournament.campaignSpecialIdsSeen.push(special.id);

  const playerOwnsSpecial = playerHasCampaignSpecial(tournament.playerTeam, special.id);
  const buffTarget = pickAssociatedSpecialBuffTarget(tournament, association, linkedMembers);
  const effects = createAssociatedSpecialEffects(association, special, buffTarget, playerOwnsSpecial);

  return {
    id: `special-${special.id}-${tournament.campaignEvents.length}`,
    type: "blessing",
    title: playerOwnsSpecial
      ? `${special.name} vuelve a ayudar`
      : `${special.name} aparece por ${association.label}`,
    text: getAssociatedSpecialEventText(association, special, buffTarget, phase, playerOwnsSpecial),
    scoreModifier: 0,
    effects,
    sourcePartyId: `special-${normalizeLookupText(association.label).replace(/\s+/g, "-")}`,
    sourcePartyName: `Especial afiliado: ${association.label}`,
    specialId: special.id
  };
}

function getEligibleAssociatedSpecials(tournament) {
  if (!tournament?.playerTeam) {
    return [];
  }

  return SPECIAL_AFFILIATIONS
    .map((association) => {
      const special = findSpecialCharacterById(association.specialId);
      if (!special) {
        return null;
      }
      const linkedMembers = getSpecialAffiliationMembers(tournament.playerTeam, association);
      if (!association.alwaysEligible && !linkedMembers.length) {
        return null;
      }
      return { association, special, linkedMembers };
    })
    .filter(Boolean);
}

function getSpecialAffiliationMembers(playerTeam, association) {
  const members = playerTeam.members || [];
  const linked = [];

  members.forEach((member) => {
    if (specialAssociationMatchesMember(member, association)) {
      linked.push(member);
    }
  });

  return linked;
}

function specialAssociationMatchesMember(member, association) {
  if (!member) {
    return false;
  }

  if (association.characterIds?.some((id) => characterMatchesId(member, id))) {
    return true;
  }

  if (association.partyIds?.some((partyId) => characterComesFromParty(member, partyId))) {
    return true;
  }

  if (association.groupIds?.some((groupId) => characterIsInSpecialGroup(member, groupId))) {
    return true;
  }

  return false;
}

function characterMatchesId(character, id) {
  const target = normalizeLookupText(id);
  return [character?.id, character?.name]
    .some((value) => normalizeLookupText(value) === target);
}

function characterComesFromParty(character, partyId) {
  const target = normalizeLookupText(partyId);
  const originIds = [
    character?.sourcePartyId,
    character?.recruitedFromPartyId,
    findPartyForCharacter(character?.id)?.id
  ];
  const originNames = originIds
    .map((id) => DND_PARTIES.find((party) => party.id === id)?.name)
    .filter(Boolean);

  return [...originIds, ...originNames]
    .some((value) => normalizeLookupText(value) === target);
}

function characterIsInSpecialGroup(character, groupId) {
  const registry = typeof globalThis !== "undefined" && Array.isArray(globalThis.SPECIAL_GROUPS)
    ? globalThis.SPECIAL_GROUPS
    : [];
  const group = registry.find((entry) => normalizeLookupText(entry.id) === normalizeLookupText(groupId));
  if (!group) {
    return false;
  }
  return (group.memberIds || []).some((id) => characterMatchesId(character, id));
}

function pickAssociatedSpecialBuffTarget(tournament, association, linkedMembers = []) {
  if (linkedMembers.length) {
    return randomItem(linkedMembers);
  }
  const activeMembers = getActiveCombatRoster(tournament.playerTeam.members || [], tournament.playerTeam.assignments || {});
  return activeMembers.length ? randomItem(activeMembers) : randomItem(tournament.playerTeam.members || []);
}

function createAssociatedSpecialEffects(association, special, buffTarget, playerOwnsSpecial) {
  const effects = [];
  if (!playerOwnsSpecial) {
    effects.push({
      type: "addSpecialCharacter",
      specialId: special.id,
      text: "{character} se suma como Especial por su vinculo con la party."
    });
  }

  if (buffTarget) {
    effects.push({
      type: "statTraining",
      targetCharacterId: buffTarget.id,
      stat: getAssociatedSpecialBuffStat(special, buffTarget),
      amount: 1,
      text: `${special.name} potencia a {character} por el vinculo con ${association.label}; {character} mejora {stat} en +1.`
    });
  }

  effects.push({
    type: "partyScoreBoost",
    amount: association.bonus || 7,
    label: `Apoyo de ${special.name}`,
    text: `${special.name} deja recursos, tacticas o equipo para la party (${formatModifier(association.bonus || 7)} score permanente).`
  });

  return effects;
}

function getAssociatedSpecialBuffStat(special, target) {
  const tags = new Set(getCharacterTags(special));
  if (tags.has("healer") || tags.has("support")) return "WIS";
  if (tags.has("tactician") || tags.has("debuffer")) return "INT";
  if (tags.has("dps")) return (target.stats?.DEX || 10) >= (target.stats?.STR || 10) ? "DEX" : "STR";
  if (hasSpells(special)) return ["Wizard", "Artificer", "Alchemist", "Magus", "Warmage"].includes(special.className) ? "INT" : "CHA";
  return (target.stats?.CON || 10) < 18 ? "CON" : "DEX";
}

function getAssociatedSpecialEventText(association, special, buffTarget, phase, playerOwnsSpecial) {
  const targetName = buffTarget?.name || "la party";
  const template = association.text || "{special} aparece por su vinculo con {target} antes de {phase}.";
  const baseText = template
    .replaceAll("{special}", special.name)
    .replaceAll("{target}", targetName)
    .replaceAll("{phase}", phase);
  return playerOwnsSpecial
    ? `${baseText} Como ya viaja con vos, esta vez transforma el encuentro en una mejora directa.`
    : baseText;
}

function createQuietCampaignEvent(phase = "combate") {
  return {
    id: `quiet-before-${normalizeLookupText(phase)}`,
    type: "neutral",
    title: `Respiro antes de ${phase}`,
    text: "No aparecio ningun viejo aliado ni enemigo. La party aprovecha para ajustar correas, respirar y seguir el mapa.",
    scoreModifier: 0,
    sourcePartyId: "",
    sourcePartyName: ""
  };
}

function clearCampaignScoreImpact(tournament) {
  if (!tournament) {
    return;
  }

  tournament.scoreBeforeCurrentEvent = null;
  tournament.currentEventScoreDelta = 0;
  tournament.currentEventPermanentDelta = 0;
  tournament.currentEventTemporaryDelta = 0;
  tournament.activeRetryBonus = 0;

  if (tournament.playerTeam) {
    tournament.playerTeam.scoreBeforeCurrentEvent = null;
    tournament.playerTeam.currentEventScoreDelta = 0;
  }
}

function markCampaignEventScoreStart(tournament, event) {
  const beforeScore = Number(tournament.playerTeam.score?.finalScore || 0);
  tournament.scoreBeforeCurrentEvent = beforeScore;
  tournament.currentEventScoreDelta = 0;
  tournament.currentEventPermanentDelta = 0;
  tournament.currentEventTemporaryDelta = 0;
  tournament.playerTeam.scoreBeforeCurrentEvent = beforeScore;
  tournament.playerTeam.currentEventScoreDelta = 0;

  if (event) {
    event.scoreBefore = beforeScore;
    event.scoreAfter = beforeScore;
    event.scoreDelta = 0;
    event.permanentScoreDelta = 0;
    event.temporaryScoreDelta = 0;
  }
}

function updateCampaignEventScoreImpact(tournament, event) {
  if (!tournament || !event) {
    return;
  }

  refreshPlayerTeamScore(tournament);
  const beforeScore = Number(event.scoreBefore ?? tournament.scoreBeforeCurrentEvent ?? tournament.playerTeam.score.finalScore);
  const permanentDelta = Number(tournament.playerTeam.score.finalScore || 0) - beforeScore;
  let temporaryDelta = Number(tournament.playerTeam.campaignModifier || 0);
  let totalDelta = permanentDelta + temporaryDelta;
  const effectCount = Array.isArray(event.effects) ? event.effects.length : 0;
  const hasConcreteEffect = effectCount > 0 || (Array.isArray(event.resolvedEffects) && event.resolvedEffects.length > 0);

  if (event.type === "misfortune" && hasConcreteEffect && totalDelta >= 0 && !event.fallbackScorePenaltyApplied) {
    const fallbackPenalty = -clamp(effectCount * 6 || 8, 8, 18);
    tournament.playerTeam.campaignModifier = temporaryDelta + fallbackPenalty;
    temporaryDelta += fallbackPenalty;
    totalDelta = permanentDelta + temporaryDelta;
    event.fallbackScorePenaltyApplied = true;
    event.resolvedEffects = event.resolvedEffects || [];
    event.resolvedEffects.push(`La desgracia baja la preparacion general de la party (${formatModifier(fallbackPenalty)} score para este combate).`);
  }

  if (event.type === "blessing" && hasConcreteEffect && totalDelta <= 0 && !event.fallbackScoreBonusApplied) {
    const fallbackBonus = clamp(effectCount * 6 || 8, 8, 18);
    tournament.playerTeam.campaignModifier = temporaryDelta + fallbackBonus;
    temporaryDelta += fallbackBonus;
    totalDelta = permanentDelta + temporaryDelta;
    event.fallbackScoreBonusApplied = true;
    event.resolvedEffects = event.resolvedEffects || [];
    event.resolvedEffects.push(`La bendicion mejora la preparacion general de la party (${formatModifier(fallbackBonus)} score para este combate).`);
  }

  event.scoreBefore = beforeScore;
  event.permanentScoreDelta = permanentDelta;
  event.temporaryScoreDelta = temporaryDelta;
  event.scoreDelta = totalDelta;
  event.scoreAfter = Math.max(1, beforeScore + totalDelta);
  tournament.scoreBeforeCurrentEvent = beforeScore;
  tournament.currentEventScoreDelta = totalDelta;
  tournament.currentEventPermanentDelta = permanentDelta;
  tournament.currentEventTemporaryDelta = temporaryDelta;
  tournament.playerTeam.scoreBeforeCurrentEvent = beforeScore;
  tournament.playerTeam.currentEventScoreDelta = totalDelta;
}

function applyCampaignEventModifier(tournament, event) {
  const modifier = Number(event.scoreModifier || 0);
  if (!Number.isFinite(modifier) || modifier === 0) {
    return;
  }

  tournament.playerTeam.campaignModifier = (tournament.playerTeam.campaignModifier || 0) + modifier;
}

function applyCampaignEventEffects(tournament, event) {
  const effects = getCampaignEventEffects(event);
  event.resolvedEffects = event.resolvedEffects || [];

  effects.forEach((effect) => {
    if (tournament.replacementRequest) {
      return;
    }

    if (["killRandomCharacter", "removeRandomCharacter", "defeatRandomCharacter"].includes(effect.type)) {
      resolveCharacterRemovalEffect(tournament, event, effect);
      return;
    }

    applyPartyEffect(tournament, event, effect);
  });

  refreshPlayerTeamScore(tournament);
}

function applyPartyEffect(tournament, event, effect) {
  if (Array.isArray(effect?.effects)) {
    const results = effect.effects
      .map((subEffect) => applyPartyEffect(tournament, event, subEffect))
      .filter(Boolean);

    if (effect.scoreModifier) {
      const modifier = Number(effect.scoreModifier || 0);
      tournament.playerTeam.campaignModifier = (tournament.playerTeam.campaignModifier || 0) + modifier;
      event.resolvedEffects.push(`El paquete cambia temporalmente el score (${formatModifier(modifier)}).`);
    }

    return results[0] || "";
  }

  const type = normalizeLookupText(effect?.type);
  if (!type) {
    return "";
  }

  if (["armorboost", "reinforcearmor", "repairarmor", "acboost"].includes(type)) {
    return applyArmorEffect(tournament, event, effect, 1);
  }
  if (["damagearmor", "armordamage", "breakarmor", "acpenalty"].includes(type)) {
    return applyArmorEffect(tournament, event, effect, -1);
  }
  if (["weaponboost", "findweapon", "dpsboost", "upgradeweapon"].includes(type)) {
    return applyFeatureEffect(tournament, event, { ...effect, feature: effect.feature || "Masterwork Weapon" }, "weapon");
  }
  if (["breakweapon", "weaponbreak", "dpspenalty"].includes(type)) {
    return applyFeatureEffect(tournament, event, { ...effect, feature: effect.feature || "Broken Weapon" }, "weaponDamage");
  }
  if (["arcanefocus", "focusboost"].includes(type)) {
    return applyFeatureEffect(tournament, event, { ...effect, feature: effect.feature || "Arcane Focus" }, "spell");
  }
  if (["learnspell", "findspell", "newspell"].includes(type)) {
    return applyLearnSpellEffect(tournament, event, effect);
  }
  if (["loserandomspell", "forgetspell", "spellloss"].includes(type)) {
    return applyLoseSpellEffect(tournament, event, effect);
  }
  if (["woundrandomcharacter", "woundcharacter", "hpdamage"].includes(type)) {
    return applyHitPointEffect(tournament, event, effect, -1);
  }
  if (["healwounds", "rest", "hpboost", "vitalityboost"].includes(type)) {
    return applyHitPointEffect(tournament, event, effect, 1);
  }
  if (["stattraining", "statboost", "training"].includes(type)) {
    return applyStatEffect(tournament, event, effect, 1);
  }
  if (["statdrain", "curse", "statpenalty"].includes(type)) {
    return applyStatEffect(tournament, event, effect, -1);
  }
  if (["revivefallencharacter", "revivefallen", "resurrectfallen", "raisefallen"].includes(type)) {
    return applyReviveFallenCharacterEffect(tournament, event, effect);
  }
  if (["extralife", "retrytoken", "secondchance", "lifeextra"].includes(type)) {
    return applyExtraLifeEffect(tournament, event, effect);
  }
  if (["unlockspecialcharacter", "unlockspecial", "specialunlock"].includes(type)) {
    return applyUnlockSpecialCharacterEffect(tournament, event, effect);
  }
  if (["identitytheft", "stealidentity", "robertidentity"].includes(type)) {
    return applyIdentityTheftEffect(tournament, event, effect);
  }
  if (["jailstrongestandaddspecial", "frameparty", "jailstrongest"].includes(type)) {
    return applyJailStrongestAndAddSpecialEffect(tournament, event, effect);
  }
  if (["criminalreplacementpack", "criminalreplacements", "forcedcriminalpack"].includes(type)) {
    return applyCriminalReplacementPackEffect(tournament, event, effect);
  }
  if (["addspecialcharacter", "recruitspecial", "specialjoin", "specialally"].includes(type)) {
    return applyAddSpecialCharacterEffect(tournament, event, effect);
  }
  if (["partyscoreboost", "scoreboost", "artifactboost", "moraleboost", "rewardscorebonus"].includes(type)) {
    return applyPartyScoreBoostEffect(tournament, event, effect, 1);
  }
  if (["partyscorepenalty", "scorepenalty", "permanentscorepenalty", "moraledamage", "logisticdamage", "scarparty"].includes(type)) {
    return applyPartyScoreBoostEffect(tournament, event, effect, -1);
  }
  if (effect.scoreModifier) {
    const modifier = Number(effect.scoreModifier || 0);
    tournament.playerTeam.campaignModifier = (tournament.playerTeam.campaignModifier || 0) + modifier;
    event.resolvedEffects.push(`El evento cambia temporalmente el score (${formatModifier(modifier)}).`);
  }

  return "";
}

function applyExtraLifeEffect(tournament, event, effect) {
  const retryScoreBonus = Math.max(1, Number(effect.retryScoreBonus || effect.scoreBonus || 100));
  const token = {
    id: `extra-life-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: effect.title || event.title || "Libro del heroe anonimo",
    retryScoreBonus
  };

  tournament.extraLives = Array.isArray(tournament.extraLives) ? tournament.extraLives : [];
  tournament.extraLives.push(token);

  const text = effect.text || `${token.title} queda guardado: si pierdes un combate, puedes reintentarlo con ${formatModifier(retryScoreBonus)} score.`;
  event.resolvedEffects.push(text);
  event.appliedEffects = Array.isArray(event.appliedEffects) ? event.appliedEffects : [];
  event.appliedEffects.push({
    type: "extraLife",
    kind: "extraLife",
    label: "Vida extra",
    characterName: "Party",
    amount: retryScoreBonus,
    summary: text
  });
  return text;
}

function applyPartyScoreBoostEffect(tournament, event, effect, direction = 1) {
  const amount = Math.max(1, Math.abs(Number(effect.amount ?? effect.value ?? effect.scoreBonus ?? effect.scoreModifier ?? 6)));
  const signedAmount = amount * (direction < 0 ? -1 : 1);
  tournament.playerTeam.permanentScoreBonus = Number(tournament.playerTeam.permanentScoreBonus || 0) + signedAmount;

  const text = effect.text || (direction < 0
    ? `La party pierde ${amount} score permanente.`
    : `La party gana ${formatModifier(signedAmount)} score permanente.`);
  event.resolvedEffects.push(text);
  event.appliedEffects = Array.isArray(event.appliedEffects) ? event.appliedEffects : [];
  event.appliedEffects.push({
    type: effect.type || "partyScoreBoost",
    kind: "score",
    label: effect.label || "Score de party",
    characterName: "Party",
    amount: signedAmount,
    summary: text
  });
  return text;
}

function applyAddSpecialCharacterEffect(tournament, event, effect) {
  const special = pickSpecialCharacterForEvent(tournament, effect);
  if (!special) {
    event.resolvedEffects.push("Un Especial casi se suma, pero no hay nadie disponible para esta ruta.");
    return "";
  }

  const character = cloneCharacterForRun(special);
  tournament.playerTeam.members = Array.isArray(tournament.playerTeam.members)
    ? tournament.playerTeam.members
    : [];
  tournament.playerTeam.assignments = tournament.playerTeam.assignments || {};
  tournament.playerTeam.members.push(character);
  unlockGalleryPortrait(character, "Evento especial");
  state.draftedCharacters = tournament.playerTeam.members;
  if (state.isLocalCoop) {
    state.draftPickOwners[character.id] = "Evento";
  }

  const assignedRole = assignCharacterToBestOpenRole(character, tournament.playerTeam.assignments);
  state.assignments = { ...tournament.playerTeam.assignments };
  const activeAfterJoin = getActiveCombatRoster(tournament.playerTeam.members, tournament.playerTeam.assignments)
    .some((member) => member.id === character.id);
  const defaultText = assignedRole
    ? `${character.name} se suma como Especial y toma el puesto ${getRoleLabel(assignedRole)}.`
    : activeAfterJoin
      ? `${character.name} se suma como Especial y pelea sin puesto asignado hasta que edites la party.`
      : `${character.name} se suma como Especial y queda en reserva hasta que edites la party.`;

  return pushEffectResolution(event, effect, character, {
    kind: "specialJoin",
    label: "Especial reclutado",
    role: assignedRole
  }, defaultText);
}

function applyUnlockSpecialCharacterEffect(tournament, event, effect) {
  const specialId = effect.specialId || effect.characterId || effect.id;
  const special = findSpecialCharacterById(specialId);
  const specialName = special?.name || effect.name || specialId || "Especial";
  unlockSpecialCharacter(tournament, specialId || special?.id);

  const text = effect.text || `${specialName} queda disponible como Especial para futuras elecciones.`;
  event.resolvedEffects.push(text);
  event.appliedEffects = Array.isArray(event.appliedEffects) ? event.appliedEffects : [];
  event.appliedEffects.push({
    type: effect.type || "unlockSpecialCharacter",
    kind: "specialUnlock",
    label: "Especial desbloqueado",
    characterId: special?.id || specialId,
    characterName: specialName,
    summary: text
  });
  return text;
}

function applyIdentityTheftEffect(tournament, event, effect) {
  const target = pickEffectTarget(tournament, effect, "curse");
  if (!target) {
    return "";
  }

  const special = findSpecialCharacterById(effect.specialId);
  if (!special) {
    const replacementStats = normalizeStatBlock(effect.stats || {});
    const previousStats = { ...(target.stats || {}) };
    target.stats = replacementStats;
    target.identityStolenBy = effect.specialId || effect.by || "Robber To";
    const beforeSummary = formatStatBlock(previousStats);
    const afterSummary = formatStatBlock(replacementStats);
    return pushEffectResolution(event, effect, target, {
      kind: "identityTheft",
      label: "Identidad robada",
      before: beforeSummary,
      after: afterSummary
    }, `${target.name} sufre robo de identidad: ${beforeSummary} -> ${afterSummary}.`);
  }

  const replacementStats = normalizeStatBlock(effect.stats || {});
  const team = tournament.playerTeam;
  const assignedRole = ROLE_ORDER.find((role) => team.assignments?.[role] === target.id);
  const previousOwner = state.draftPickOwners[target.id];
  const alreadyInParty = (team.members || []).some((member) =>
    member.id !== target.id &&
    normalizeLookupText(member.id) === normalizeLookupText(special.id)
  );

  tournament.stolenMembers = Array.isArray(tournament.stolenMembers) ? tournament.stolenMembers : [];
  tournament.stolenMembers.push({
    ...cloneCharacterForRun(target),
    removedByEvent: event.title || "Robo de identidad",
    replacedBy: special.id
  });

  removeCharacterFromTournamentParty(tournament, target);
  unlockSpecialCharacter(tournament, special.id);

  let replacement = (team.members || []).find((member) =>
    normalizeLookupText(member.id) === normalizeLookupText(special.id)
  );

  if (!alreadyInParty) {
    replacement = cloneCharacterForRun(special);
    replacement.stats = replacementStats;
    replacement.replacedCharacterId = target.id;
    replacement.replacedCharacterName = target.name;
    team.members = Array.isArray(team.members) ? team.members : [];
    team.members.push(replacement);
  } else if (replacement) {
    replacement.stats = replacementStats;
    replacement.replacedCharacterId = target.id;
    replacement.replacedCharacterName = target.name;
  }

  if (assignedRole && replacement) {
    team.assignments = team.assignments || {};
    team.assignments[assignedRole] = replacement.id;
  } else if (replacement) {
    assignCharacterToBestOpenRole(replacement, team.assignments || {});
  }

  state.draftedCharacters = team.members;
  state.assignments = { ...team.assignments };
  if (previousOwner) {
    state.draftPickOwners[replacement.id] = previousOwner;
  } else if (state.isLocalCoop && replacement) {
    state.draftPickOwners[replacement.id] = "Evento";
  }
  delete state.draftPickOwners[target.id];
  if (replacement) {
    unlockGalleryPortrait(replacement, "Robo de identidad");
  }

  const defaultText = `${target.name} fue reemplazado por ${replacement?.name || special.name}.`;
  const text = pushEffectResolution(event, effect, target, {
    kind: "identityTheft",
    label: "Identidad robada",
    before: target.name,
    after: replacement?.name || special.name
  }, defaultText);
  if (replacement) {
    event.appliedEffects = Array.isArray(event.appliedEffects) ? event.appliedEffects : [];
    event.appliedEffects.push({
      type: effect.type || "identityTheft",
      kind: "specialJoin",
      label: "Reemplazo impostor",
      characterId: replacement.id,
      characterName: replacement.name,
      className: replacement.className,
      subclass: replacement.subclass,
      role: assignedRole,
      summary: `${replacement.name} toma el lugar de ${target.name}${assignedRole ? ` como ${getRoleLabel(assignedRole)}` : ""}.`
    });
  }
  return text;
}

function applyJailStrongestAndAddSpecialEffect(tournament, event, effect) {
  const target = pickEffectTarget(tournament, effect, "curse");
  if (!target) {
    return applyUnlockSpecialCharacterEffect(tournament, event, {
      type: "unlockSpecialCharacter",
      specialId: effect.specialId,
      text: effect.addText
    });
  }

  tournament.fallenMembers = Array.isArray(tournament.fallenMembers) ? tournament.fallenMembers : [];
  if (!tournament.fallenMembers.some((character) => character.id === target.id)) {
    const jailed = cloneCharacterForRun(target);
    jailed.removedByEvent = event.title || "Evento";
    tournament.fallenMembers.push(jailed);
  }

  const text = pushEffectResolution(event, effect, target, {
    kind: "memberRemoved",
    label: "Miembro encarcelado"
  }, `${target.name} queda fuera de la party por el caos del evento.`);

  removeCharacterFromTournamentParty(tournament, target);
  if (effect.specialId) {
    unlockSpecialCharacter(tournament, effect.specialId);
    applyAddSpecialCharacterEffect(tournament, event, {
      type: "addSpecialCharacter",
      specialId: effect.specialId,
      text: effect.addText || "{character} se suma como Especial despues del evento."
    });
  }
  return text;
}

function applyCriminalReplacementPackEffect(tournament, event, effect) {
  const members = tournament.playerTeam.members || [];
  const requestedCount = Math.max(1, Number(effect.count || effect.removeCount || 3));
  const removableCount = Math.min(requestedCount, Math.max(0, members.length - 1));
  const victims = [...members]
    .sort((left, right) => getCharacterPowerScore(right) - getCharacterPowerScore(left))
    .slice(0, removableCount);

  if (!victims.length) {
    const penalty = Number(effect.fallbackPenalty || -20);
    tournament.playerTeam.campaignModifier = (tournament.playerTeam.campaignModifier || 0) + penalty;
    event.resolvedEffects.push(`El grupo criminal no logra sacar miembros, pero deja a la party bajo sospecha (${formatModifier(penalty)} score).`);
  }

  tournament.fallenMembers = Array.isArray(tournament.fallenMembers) ? tournament.fallenMembers : [];
  victims.forEach((victim) => {
    if (!tournament.fallenMembers.some((character) => character.id === victim.id)) {
      const removed = cloneCharacterForRun(victim);
      removed.removedByEvent = event.title || "Evento";
      tournament.fallenMembers.push(removed);
    }
    pushEffectResolution(event, effect, victim, {
      kind: "memberRemoved",
      label: "Miembro fuera"
    }, `${victim.name} queda fuera por los crimenes ajenos.`);
    removeCharacterFromTournamentParty(tournament, victim);
  });

  const specialIds = Array.isArray(effect.specialIds) ? effect.specialIds : [];
  specialIds.forEach((specialId) => {
    unlockSpecialCharacter(tournament, specialId);
    applyAddSpecialCharacterEffect(tournament, event, {
      type: "addSpecialCharacter",
      specialId,
      text: effect.addText || "{character} entra como reemplazo Especial obligado."
    });
  });

  tournament.playerTeam.assignments = autoAssignRoles(tournament.playerTeam.members || []);
  state.assignments = { ...tournament.playerTeam.assignments };
  return victims[0]?.name || "";
}

function applyReviveFallenCharacterEffect(tournament, event, effect) {
  const fallenMembers = Array.isArray(tournament.fallenMembers) ? tournament.fallenMembers : [];
  const currentIds = new Set((tournament.playerTeam.members || []).map((character) => character.id));
  const candidates = fallenMembers.filter((character) => !currentIds.has(character.id));

  if (!candidates.length) {
    return applyHitPointEffect(tournament, event, {
      ...effect,
      type: "healWounds",
      target: effect.target || "weakest",
      amount: effect.fallbackHeal || 12,
      text: effect.fallbackText || "No hay aliados caidos que traer; la energia de muerte cura a {character} (+{amount} HP)."
    }, 1);
  }

  const revivedSource = effect.targetCharacterId
    ? candidates.find((character) => normalizeLookupText(character.id) === normalizeLookupText(effect.targetCharacterId)) || randomItem(candidates)
    : randomItem(candidates);
  const revived = cloneCharacterForRun(revivedSource);

  tournament.playerTeam.members.push(revived);
  tournament.fallenMembers = fallenMembers.filter((character) => character.id !== revived.id);
  state.draftedCharacters = tournament.playerTeam.members;

  if (state.isLocalCoop && !state.draftPickOwners[revived.id]) {
    state.draftPickOwners[revived.id] = "Evento";
  }

  tournament.playerTeam.assignments = tournament.playerTeam.assignments || {};
  const assignedRole = assignCharacterToBestOpenRole(revived, tournament.playerTeam.assignments);
  state.assignments = { ...tournament.playerTeam.assignments };

  const defaultText = assignedRole
    ? `${revived.name} vuelve de la muerte y toma el puesto ${getRoleLabel(assignedRole)}.`
    : `${revived.name} vuelve de la muerte y queda en reserva hasta que edites la party.`;

  return pushEffectResolution(event, effect, revived, {
    kind: "revive",
    label: "Aliado revivido",
    role: assignedRole
  }, defaultText);
}

function pickSpecialCharacterForEvent(tournament, effect = {}) {
  const currentIds = new Set((tournament.playerTeam.members || []).map((character) => normalizeLookupText(character.id)));
  const targetId = normalizeLookupText(effect.specialId || effect.characterId || effect.id);

  if (targetId) {
    return getSpecialCharacters().find((character) =>
      !currentIds.has(normalizeLookupText(character.id)) &&
      (normalizeLookupText(character.id) === targetId || normalizeLookupText(character.name) === targetId)
    );
  }

  return null;
}

function hasAvailableSpecialForEvent(tournament) {
  return Boolean(tournament && pickSpecialCharacterForEvent(tournament));
}

function assignCharacterToBestOpenRole(character, assignments) {
  const openRoles = ROLE_ORDER.filter((role) => !assignments[role]);
  if (!openRoles.length) {
    return "";
  }

  const bestRole = openRoles
    .map((role) => ({
      role,
      value: getRoleFitMultiplier(character, role) * getCharacterPowerScore(character)
    }))
    .sort((left, right) => right.value - left.value)[0]?.role;

  if (bestRole) {
    assignments[bestRole] = character.id;
  }

  return bestRole || "";
}

function applyArmorEffect(tournament, event, effect, direction) {
  const target = pickEffectTarget(tournament, effect, direction > 0 ? "armor" : "armorDamage");
  if (!target) {
    return "";
  }

  const amount = Math.max(1, Math.abs(Number(effect.amount ?? effect.value ?? 1))) * direction;
  const before = getCharacterArmorClass(target);
  target.armorClass = clamp(before + amount, 8, 30);
  if (direction > 0) {
    removeCharacterFeature(target, "Damaged Armor");
    addCharacterFeature(target, effect.feature || "Reinforced Armor");
  } else {
    removeCharacterFeature(target, "Reinforced Armor");
    addCharacterFeature(target, effect.feature || "Damaged Armor");
  }

  const defaultText = direction > 0
    ? `${target.name} mejora su armadura (${before} -> ${target.armorClass} AC).`
    : `${target.name} queda con la armadura dañada (${before} -> ${target.armorClass} AC).`;
  return pushEffectResolution(event, effect, target, {
    kind: direction > 0 ? "armor" : "armorDamage",
    label: direction > 0 ? "Armadura mejorada" : "Armadura dañada",
    stat: "AC",
    before,
    after: target.armorClass,
    amount: Math.abs(amount),
    amountText: formatModifier(amount)
  }, defaultText);
}

function applyFeatureEffect(tournament, event, effect, purpose) {
  const target = pickEffectTarget(tournament, effect, purpose);
  if (!target) {
    return "";
  }

  const feature = effect.feature || "Masterwork Weapon";
  const isBroken = normalizeLookupText(feature) === "broken weapon";
  if (isBroken) {
    removeCharacterFeature(target, "Runic Weapon");
    removeCharacterFeature(target, "Masterwork Weapon");
  } else {
    removeCharacterFeature(target, "Broken Weapon");
  }
  addCharacterFeature(target, feature);

  const defaultText = isBroken
    ? `${target.name} pierde filo ofensivo: su arma queda dañada.`
    : `${target.name} obtiene ${feature} y sube su DPS.`;
  return pushEffectResolution(event, effect, target, {
    kind: isBroken ? "weaponDamage" : purpose,
    label: isBroken ? "Arma dañada" : purpose === "spell" ? "Foco arcano" : "DPS mejorado",
    feature
  }, defaultText);
}

function applyLearnSpellEffect(tournament, event, effect) {
  const target = pickEffectTarget(tournament, effect, "spell");
  if (!target) {
    return "";
  }

  if (!canReceiveRewardSpell(target)) {
    return applyFeatureEffect(tournament, event, {
      ...effect,
      type: "arcaneFocus",
      targetCharacterId: target.id,
      feature: effect.fallbackFeature || "Arcane Trinket",
      text: effect.fallbackText || "{character} no puede aprender ese hechizo, pero convierte el hallazgo en una herramienta magica util."
    }, "spell");
  }

  let spellName = effect.spellName || effect.spell || pickRewardSpell(target, null, effect.spellTags || []);
  if (spellName && !canCharacterLearnRewardSpell(target, spellName)) {
    spellName = pickRewardSpell(target, null, effect.spellTags || []);
  }
  if (!spellName) {
    return applyFeatureEffect(tournament, event, {
      ...effect,
      type: "arcaneFocus",
      targetCharacterId: target.id,
      feature: effect.fallbackFeature || "Arcane Focus",
      text: effect.fallbackText || "{character} no encuentra un spell compatible, pero aprovecha el botin como foco arcano."
    }, "spell");
  }

  addCharacterSpell(target, spellName);
  const defaultText = `${target.name} aprende ${spellName}.`;
  return pushEffectResolution(event, effect, target, {
    kind: "spell",
    label: "Nuevo hechizo",
    spell: spellName
  }, defaultText);
}

function applyLoseSpellEffect(tournament, event, effect) {
  const members = tournament.playerTeam.members || [];
  const spellUsers = members.filter((character) => Array.isArray(character.spells) && character.spells.length);
  if (!spellUsers.length) {
    return applyHitPointEffect(tournament, event, {
      ...effect,
      type: "woundRandomCharacter",
      amount: effect.fallbackWound || 6,
      target: "weakest",
      text: effect.fallbackText || "La magia no encuentra objetivo y termina como una herida sobre {character}."
    }, -1);
  }

  let target = pickEffectTarget(tournament, effect, "spell");
  if (!target || !Array.isArray(target.spells) || !target.spells.length) {
    target = randomItem(spellUsers);
  }

  const spellIndex = effect.spellName
    ? target.spells.findIndex((spell) => normalizeLookupText(getSpellDisplayName(spell)) === normalizeLookupText(effect.spellName))
    : randomInt(0, target.spells.length - 1);
  const safeIndex = spellIndex >= 0 ? spellIndex : randomInt(0, target.spells.length - 1);
  const [removedSpell] = target.spells.splice(safeIndex, 1);
  const spellName = getSpellDisplayName(removedSpell);
  const defaultText = `${target.name} pierde acceso a ${spellName}.`;

  return pushEffectResolution(event, effect, target, {
    kind: "spellLoss",
    label: "Hechizo perdido",
    spell: spellName
  }, defaultText);
}

function applyHitPointEffect(tournament, event, effect, direction) {
  const target = pickEffectTarget(tournament, effect, direction > 0 ? "vitality" : "wound");
  if (!target) {
    return "";
  }

  const amount = Math.max(1, Math.abs(Number(effect.amount ?? effect.value ?? randomInt(5, 10)))) * direction;
  const before = getCharacterHitPointInfo(target).hitPoints;
  target.hitPoints = clamp(before + amount, 1, 999);
  const defaultText = direction > 0
    ? `${target.name} gana resistencia (${before} -> ${target.hitPoints} HP).`
    : `${target.name} queda herido (${before} -> ${target.hitPoints} HP).`;

  return pushEffectResolution(event, effect, target, {
    kind: direction > 0 ? "hp" : "wound",
    label: direction > 0 ? "HP mejorado" : "Herida",
    stat: "HP",
    before,
    after: target.hitPoints,
    amount: Math.abs(amount),
    amountText: formatModifier(amount)
  }, defaultText);
}

function applyStatEffect(tournament, event, effect, direction) {
  const target = pickEffectTarget(tournament, effect, direction > 0 ? "training" : "curse");
  if (!target) {
    return "";
  }

  const stat = effect.stat || pickEffectStat(target, direction);
  const amount = Math.max(1, Math.abs(Number(effect.amount ?? effect.value ?? 1))) * direction;
  target.stats = { ...(target.stats || {}) };
  const before = Number(target.stats[stat] || 10);
  target.stats[stat] = clamp(before + amount, 3, 30);
  const defaultText = direction > 0
    ? `${target.name} entrena ${stat} (${before} -> ${target.stats[stat]}).`
    : `${target.name} sufre una baja en ${stat} (${before} -> ${target.stats[stat]}).`;

  return pushEffectResolution(event, effect, target, {
    kind: direction > 0 ? "stat" : "statDrain",
    label: direction > 0 ? "Entrenamiento" : "Baja de stat",
    stat,
    before,
    after: target.stats[stat],
    amount: Math.abs(amount),
    amountText: formatModifier(amount)
  }, defaultText);
}

function pickEffectTarget(tournament, effect, purpose) {
  const members = tournament.playerTeam.members || [];
  if (!members.length) {
    return null;
  }

  const explicitId = effect.targetCharacterId || effect.targetId || effect.characterId;
  if (explicitId) {
    const explicitTarget = members.find((character) => normalizeLookupText(character.id) === normalizeLookupText(explicitId));
    if (explicitTarget) {
      return explicitTarget;
    }
  }

  const target = normalizeLookupText(effect.target || "");
  if (target === "weakest") {
    return [...members].sort((left, right) => getCharacterPowerScore(left) - getCharacterPowerScore(right))[0];
  }
  if (target === "strongest") {
    return [...members].sort((left, right) => getCharacterPowerScore(right) - getCharacterPowerScore(left))[0];
  }

  let candidates = target && target !== "random"
    ? members.filter((character) => characterMatchesEffectTarget(character, target))
    : [];
  if (!candidates.length) {
    candidates = filterEffectTargetsByPurpose(members, purpose);
  }
  if (!candidates.length) {
    candidates = members;
  }

  return randomItem(candidates);
}

function characterMatchesEffectTarget(character, target) {
  const tags = getCharacterTags(character);
  const roles = getCharacterRolePriority(character);
  if (["frontliner", "frontline", "tank"].includes(target)) {
    return tags.has("tank") || roles.includes("FRONTLINER");
  }
  if (["dps", "damage", "damage dealer", "dps melee", "dps ranged", "melee", "ranged"].includes(target)) {
    return tags.has("dps") || roles.includes("DPS_MELEE") || roles.includes("DPS_RANGED");
  }
  if (["spellcaster", "caster", "arcane"].includes(target)) {
    return tags.has("spellcaster") || hasSpells(character) || isSpellcasterClass(character);
  }
  if (["support", "healer"].includes(target)) {
    return tags.has("support") || tags.has("healer") || roles.includes("SUPPORT");
  }
  if (["tactician", "debuffer"].includes(target)) {
    return tags.has("tactician") || tags.has("debuffer") || roles.includes("TACTICIAN");
  }
  return normalizeLookupText(character.id) === target || normalizeLookupText(character.name) === target;
}

function filterEffectTargetsByPurpose(members, purpose) {
  if (["armor", "armorDamage"].includes(purpose)) {
    return members.filter((character) => {
      const tags = getCharacterTags(character);
      return tags.has("tank") || getCharacterRolePriority(character).includes("FRONTLINER");
    });
  }
  if (["weapon", "weaponDamage"].includes(purpose)) {
    return members.filter((character) => getCharacterTags(character).has("dps"));
  }
  if (purpose === "spell") {
    return members.filter((character) => canReceiveRewardSpell(character));
  }
  if (purpose === "vitality" || purpose === "wound") {
    return [...members].sort((left, right) => getCharacterHitPointInfo(left).hitPoints - getCharacterHitPointInfo(right).hitPoints).slice(0, 2);
  }
  if (purpose === "training" || purpose === "curse") {
    return [...members].sort((left, right) => getCharacterPowerScore(right) - getCharacterPowerScore(left)).slice(0, 3);
  }

  return [];
}

function pickEffectStat(character, direction) {
  const entries = Object.entries(character.stats || {});
  if (!entries.length) {
    return "CON";
  }
  if (direction > 0) {
    return entries.sort((left, right) => Number(right[1]) - Number(left[1]))[0][0];
  }
  return randomItem(entries.sort((left, right) => Number(right[1]) - Number(left[1])).slice(0, 3))[0];
}

function normalizeStatBlock(stats = {}) {
  return {
    STR: Number(stats.STR ?? stats.str ?? 10),
    DEX: Number(stats.DEX ?? stats.dex ?? 10),
    CON: Number(stats.CON ?? stats.con ?? 10),
    INT: Number(stats.INT ?? stats.int ?? 10),
    WIS: Number(stats.WIS ?? stats.wis ?? 10),
    CHA: Number(stats.CHA ?? stats.cha ?? 10)
  };
}

function formatStatBlock(stats = {}) {
  const normalized = normalizeStatBlock(stats);
  return `STR ${normalized.STR}, DEX ${normalized.DEX}, CON ${normalized.CON}, INT ${normalized.INT}, WIS ${normalized.WIS}, CHA ${normalized.CHA}`;
}

function pushEffectResolution(event, effect, character, values, defaultText) {
  const text = effect.text
    ? fillEffectText(effect.text, character, values)
    : defaultText;
  event.resolvedEffects.push(text);
  if (character) {
    event.appliedEffects = Array.isArray(event.appliedEffects) ? event.appliedEffects : [];
    event.appliedEffects.push({
      type: effect.type || values.kind || "effect",
      kind: values.kind || effect.type || "effect",
      label: values.label || getEffectDetailLabel(effect, values),
      characterId: character.id,
      characterName: character.name,
      className: character.className,
      subclass: character.subclass,
      stat: values.stat,
      before: values.before,
      after: values.after,
      spell: values.spell,
      feature: values.feature,
      role: values.role,
      amount: values.amount,
      summary: text
    });
  }
  return text;
}

function getEffectDetailLabel(effect, values = {}) {
  const type = normalizeLookupText(effect?.type || values.kind);
  if (type.includes("armor")) return "Armadura";
  if (type.includes("weapon") || type.includes("dps")) return "Arma";
  if (type.includes("spell")) return "Hechizo";
  if (type.includes("hp") || type.includes("wound") || type.includes("heal")) return "HP";
  if (type.includes("stat") || type.includes("training")) return "Stat";
  if (type.includes("special")) return "Especial";
  return "Mejora";
}

function fillEffectText(template, character, values = {}) {
  return String(template)
    .replaceAll("{character}", character?.name || "Alguien")
    .replaceAll("{amount}", values.amount ?? "")
    .replaceAll("{amountText}", values.amountText ?? "")
    .replaceAll("{spell}", values.spell || "")
    .replaceAll("{stat}", values.stat || "")
    .replaceAll("{feature}", values.feature || "")
    .replaceAll("{role}", values.role ? getRoleLabel(values.role) : "");
}

function addCharacterFeature(character, feature) {
  character.features = Array.isArray(character.features) ? character.features : [];
  if (!character.features.some((item) => normalizeLookupText(item) === normalizeLookupText(feature))) {
    character.features.push(feature);
  }
}

function removeCharacterFeature(character, feature) {
  character.features = (character.features || [])
    .filter((item) => normalizeLookupText(item) !== normalizeLookupText(feature));
}

function addCharacterSpell(character, spellName) {
  character.spells = Array.isArray(character.spells) ? character.spells : [];
  if (!character.spells.some((spell) => normalizeLookupText(getSpellDisplayName(spell)) === normalizeLookupText(spellName))) {
    character.spells.push(spellName);
  }
}

function getCampaignEventEffects(event) {
  if (Array.isArray(event.effects)) {
    return event.effects;
  }
  if (event.killsCharacter) {
    return [{
      type: "killRandomCharacter",
      replacementPool: event.replacementPool || "all",
      replacementChoices: event.replacementChoices || 4
    }];
  }
  return [];
}

function resolveCharacterRemovalEffect(tournament, event, effect) {
  const members = tournament.playerTeam.members || [];
  if (members.length <= 1) {
    const penalty = Number(effect.fallbackPenalty || -15);
    tournament.playerTeam.campaignModifier = (tournament.playerTeam.campaignModifier || 0) + penalty;
    event.resolvedEffects.push(`El evento intento dejar fuera al ultimo miembro, pero se convierte en una herida grave (${formatModifier(penalty)}).`);
    return;
  }

  const defeatedCharacter = pickCampaignVictim(members, effect);
  if (!defeatedCharacter) {
    return;
  }

  tournament.fallenMembers = Array.isArray(tournament.fallenMembers) ? tournament.fallenMembers : [];
  if (!tournament.fallenMembers.some((character) => character.id === defeatedCharacter.id)) {
    tournament.fallenMembers.push(cloneCharacterForRun(defeatedCharacter));
  }
  removeCharacterFromTournamentParty(tournament, defeatedCharacter);
  const candidates = getReplacementCandidates(tournament, event, effect, defeatedCharacter);
  const effectText = effect.text || `${defeatedCharacter.name} cae antes del combate y queda fuera de la party.`;
  event.resolvedEffects.push(effectText.replace("{character}", defeatedCharacter.name));

  if (!candidates.length) {
    event.resolvedEffects.push("No hay suplentes disponibles; la party debe seguir con un miembro menos.");
    return;
  }

  tournament.waitingForReplacement = true;
  event.requiresReplacement = true;
  tournament.replacementRequest = {
    defeatedCharacter,
    candidates,
    title: effect.replacementTitle || `${defeatedCharacter.name} quedo fuera`,
    text: effect.replacementText || "Elige un reemplazo antes de entrar al siguiente combate."
  };
}

function pickCampaignVictim(members, effect) {
  const pool = members.filter((character) => !effect.protectedTags?.some((tag) => hasTag(character, tag)));
  const candidates = pool.length ? pool : members;

  if (effect.targetCharacterId) {
    const target = candidates.find((character) => normalizeLookupText(character.id) === normalizeLookupText(effect.targetCharacterId));
    if (target) {
      return target;
    }
  }
  if (effect.target === "weakest") {
    return [...candidates].sort((left, right) => getCharacterPowerScore(left) - getCharacterPowerScore(right))[0];
  }
  if (effect.target === "strongest") {
    return [...candidates].sort((left, right) => getCharacterPowerScore(right) - getCharacterPowerScore(left))[0];
  }

  return randomItem(candidates);
}

function removeCharacterFromTournamentParty(tournament, character) {
  const team = tournament.playerTeam;
  team.members = (team.members || []).filter((member) => member.id !== character.id);
  state.draftedCharacters = team.members;
  removeCharacterFromAssignments(team.assignments, character.id);
  removeCharacterFromAssignments(state.assignments, character.id);
}

function removeCharacterFromAssignments(assignments, characterId) {
  Object.keys(assignments || {}).forEach((role) => {
    if (assignments[role] === characterId) {
      assignments[role] = "";
    }
  });
}

function getReplacementCandidates(tournament, event, effect, defeatedCharacter) {
  const currentIds = new Set((tournament.playerTeam.members || []).map((character) => character.id));
  currentIds.add(defeatedCharacter.id);

  const pool = getReplacementPool(event, effect, defeatedCharacter)
    .filter((character) => !currentIds.has(character.id));
  const choices = Number(effect.replacementChoices || 4);

  return shuffle(pool).slice(0, Math.max(1, choices));
}

function getReplacementPool(event, effect, defeatedCharacter) {
  const poolType = effect.replacementPool || "all";

  if (poolType === "sourceParty") {
    const party = DND_PARTIES.find((candidate) => candidate.id === event.sourcePartyId);
    return party ? party.characters : getAllPartyCharacters();
  }
  if (poolType === "sameClass") {
    return getAllPartyCharacters().filter((character) => character.className === defeatedCharacter.className);
  }
  if (poolType === "specials") {
    return getEligibleAssociatedSpecials(state.tournament).map((entry) => entry.special);
  }
  if (poolType === "allWithSpecials") {
    return [
      ...getAllPartyCharacters(),
      ...getEligibleAssociatedSpecials(state.tournament).map((entry) => entry.special)
    ];
  }

  return getAllPartyCharacters();
}

function chooseCampaignReplacement(characterId) {
  const tournament = state.tournament;
  const request = tournament?.replacementRequest;
  if (!tournament || !request) {
    return;
  }

  const replacementCandidate = request.candidates.find((candidate) => candidate.id === characterId);
  if (!replacementCandidate) {
    return;
  }

  audioManager.playSfx(hasTag(replacementCandidate, "especial") ? "specialCardReveal" : "cardPick");
  const replacement = cloneCharacterForRun(replacementCandidate);
  const defeatedOwner = state.draftPickOwners[request.defeatedCharacter.id];
  tournament.playerTeam.members.push(replacement);
  unlockGalleryPortrait(replacement, "Reemplazo");
  state.draftedCharacters = tournament.playerTeam.members;
  if (defeatedOwner) {
    state.draftPickOwners[replacement.id] = defeatedOwner;
  } else if (state.isLocalCoop) {
    state.draftPickOwners[replacement.id] = "Evento";
  }
  delete state.draftPickOwners[request.defeatedCharacter.id];

  tournament.playerTeam.assignments = autoAssignRoles(tournament.playerTeam.members);
  state.assignments = { ...tournament.playerTeam.assignments };
  refreshPlayerTeamScore(tournament);
  tournament.currentCampaignEvent.resolvedEffects.push(`${replacement.name} entra como reemplazo de ${request.defeatedCharacter.name}.`);
  updateCampaignEventScoreImpact(tournament, tournament.currentCampaignEvent);
  tournament.replacementRequest = null;
  tournament.waitingForReplacement = false;
  tournament.waitingForNext = true;
  tournament.statusText = `Reemplazo listo. Avanza a ${tournament.pendingCombat?.phase || "la siguiente pelea"} cuando quieras.`;
  renderTournament();
}

function refreshPlayerTeamScore(tournament) {
  const team = tournament.playerTeam;
  if (!team.members || !team.members.length) {
    return;
  }
  team.score = calculatePartyScore(team);
}

function createCampaignStatusText(event, phase = "combate") {
  if (event.requiresReplacement || state.tournament?.replacementRequest) {
    return `${event.title}. Elige un reemplazo antes del combate.`;
  }
  const hasConcreteEffect = Array.isArray(event.resolvedEffects) && event.resolvedEffects.length > 0;
  if (event.type === "blessing") {
    if (event.scoreModifier) {
      return `${event.title}. Tu party recibe ${formatModifier(event.scoreModifier || 0)} antes de ${phase}.`;
    }
    return hasConcreteEffect
      ? `${event.title}. Tu party gana una ventaja concreta antes de ${phase}.`
      : `${event.title}. Avanza cuando quieras.`;
  }
  if (event.type === "misfortune") {
    if (event.scoreModifier) {
      return `${event.title}. Tu party carga ${formatModifier(event.scoreModifier || 0)} antes de ${phase}.`;
    }
    return hasConcreteEffect
      ? `${event.title}. Tu party sufre una consecuencia antes de ${phase}.`
      : `${event.title}. Avanza cuando quieras.`;
  }
  return `${event.title}. Avanza cuando quieras.`;
}

function getDefaultCampaignTitle(type, sourcePartyName) {
  if (type === "blessing") {
    return `Bendicion de ${sourcePartyName}`;
  }
  if (type === "misfortune") {
    return `Desgracia de ${sourcePartyName}`;
  }
  return `Evento de ${sourcePartyName}`;
}

function getCampaignScoreModifier(value, type) {
  if (value !== undefined && value !== null && value !== "") {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      return 0;
    }
    if (type === "blessing") {
      return Math.abs(numericValue);
    }
    if (type === "misfortune") {
      return -Math.abs(numericValue);
    }
    return numericValue;
  }
  if (type === "blessing") {
    return 10;
  }
  if (type === "misfortune") {
    return -10;
  }
  return 0;
}

function playerHasCampaignSpecial(playerTeam, specialId) {
  const target = normalizeLookupText(specialId);
  return (playerTeam.members || []).some((character) =>
    normalizeLookupText(character.id) === target ||
    normalizeLookupText(character.name) === target
  );
}

function playerHasCampaignCharacter(playerTeam, characterId) {
  const target = normalizeLookupText(characterId);
  return (playerTeam.members || []).some((character) =>
    normalizeLookupText(character.id) === target ||
    normalizeLookupText(character.name) === target
  );
}

function getSpecialDisplayName(specialId) {
  const target = normalizeLookupText(specialId);
  const special = getSpecialCharacters().find((character) =>
    normalizeLookupText(character.id) === target ||
    normalizeLookupText(character.name) === target
  );
  return special?.name || specialId;
}

function getCampaignEncountersForParty(partyId) {
  const registry = typeof globalThis !== "undefined" ? globalThis.CAMPAIGN_ENCOUNTERS : null;
  return Array.isArray(registry?.[partyId]) ? registry[partyId] : [];
}

function createCharacterAction(actor, context = {}) {
  return createContextualCombatAction(actor, context, false);
}

function createEnemyAction(actor, context = {}) {
  return createContextualCombatAction(actor, context, true);
}

function createContextualCombatAction(actor, context = {}, isEnemy = false) {
  if (!actor) {
    return "El combate se mueve entre polvo, gritos y una apertura dificil de leer.";
  }

  const allies = Array.isArray(context.allies) && context.allies.length ? context.allies : [actor];
  const enemies = Array.isArray(context.enemies) && context.enemies.length ? context.enemies : allies;
  const spellAction = createSpellCombatAction(actor, allies, enemies, isEnemy);
  if (spellAction) {
    return spellAction;
  }

  return createMartialCombatAction(actor, enemies, context.result, isEnemy);
}

function createSpellCombatAction(actor, allies, enemies, isEnemy) {
  if (!hasSpells(actor) || Math.random() > 0.82) {
    return "";
  }

  const spell = randomItem(actor.spells);
  const spellName = getSpellDisplayName(spell);
  const metadata = getSpellMetadata(spellName);
  const category = getSpellNarrativeCategory(spellName, metadata);
  const ally = pickNarrativeAlly(actor, allies);
  const enemy = pickNarrativeEnemy(enemies);
  const enemyCaster = pickNarrativeCaster(enemies) || enemy;
  const funnySuffix = hasTag(actor, "comico") ? " Lo hace de una forma ridicula, pero funciona." : "";

  if (category === "healing") {
    return `${actor.name} castea ${spellName} sobre ${ally.name}; las heridas se cierran y la linea aguanta.${funnySuffix}`;
  }
  if (category === "defense") {
    return `${actor.name} castea ${spellName} para defenderse del ataque de ${enemy.name}.${funnySuffix}`;
  }
  if (category === "buff") {
    return `${actor.name} castea ${spellName} sobre ${ally.name}; mejora su ritmo y lo deja listo para responder.${funnySuffix}`;
  }
  if (category === "control") {
    return `${actor.name} castea ${spellName} contra ${enemy.name}; el rival queda trabado y pierde posicion.${funnySuffix}`;
  }
  if (category === "save-or-suck") {
    return `${actor.name} arriesga ${spellName} contra ${enemy.name}; si la salvacion falla, el turno rival se rompe.${funnySuffix}`;
  }
  if (category === "debuff") {
    return `${actor.name} castea ${spellName} sobre ${enemy.name}; el rival sigue peleando, pero mucho peor.${funnySuffix}`;
  }
  if (category === "summon") {
    return `${actor.name} invoca ${spellName}; nuevos aliados entran al campo y presionan a ${enemy.name}.${funnySuffix}`;
  }
  if (category === "anti-magic") {
    return `${actor.name} responde con ${spellName} y corta la magia de ${enemyCaster.name}.${funnySuffix}`;
  }
  if (category === "mobility") {
    return `${actor.name} castea ${spellName} para reposicionarse y escapar del peor angulo.${funnySuffix}`;
  }
  if (category === "information" || category === "utility") {
    return `${actor.name} usa ${spellName} para leer el campo y preparar la siguiente jugada.${funnySuffix}`;
  }

  const damageType = getSpellNarrativeDamageType(metadata, spellName);
  return `${actor.name} castea ${spellName} contra ${enemy.name}; ${getDamageNarrativeByType(damageType, enemy.name)}${funnySuffix}`;
}

function createMartialCombatAction(actor, enemies, result, isEnemy) {
  const target = pickNarrativeEnemy(enemies);
  const roles = getCharacterRolePriority(actor);
  const tags = getCharacterTags(actor);
  const specialText = hasTag(actor, "especial") ? " activa su rasgo Especial y" : "";

  if (hasTag(actor, "comico")) {
    return `${actor.name}${specialText} hace una maniobra absurda contra ${target.name}; nadie entiende el plan, pero el rival pierde posicion.`;
  }
  if (tags.has("tank") || roles.includes("FRONTLINER")) {
    return `${actor.name}${specialText} toma la primera linea y choca contra ${target.name} para sostener el frente.`;
  }
  if (roles.includes("DPS_RANGED")) {
    return `${actor.name}${specialText} castiga desde rango a ${target.name} y obliga al rival a cubrirse.`;
  }
  if (roles.includes("TACTICIAN") || tags.has("tactician")) {
    return `${actor.name}${specialText} lee el movimiento de ${target.name} y abre una ventana tactica para la party.`;
  }
  if (roles.includes("SUPPORT") || tags.has("support")) {
    return `${actor.name}${specialText} cubre a la party y evita que ${target.name} convierta la presion en ventaja.`;
  }
  if (result === "Victoria" && !isEnemy) {
    return `${actor.name}${specialText} ataca con su arma a ${target.name} y gana terreno para la party.`;
  }
  return `${actor.name}${specialText} presiona a ${target.name} con un ataque directo.`;
}

function pickNarrativeAlly(actor, allies) {
  const candidates = (allies || []).filter(Boolean);
  if (!candidates.length) {
    return actor;
  }
  const nonActor = candidates.filter((candidate) => candidate.id !== actor.id);
  return randomItem(nonActor.length ? nonActor : candidates);
}

function pickNarrativeEnemy(enemies) {
  const candidates = (enemies || []).filter(Boolean);
  return candidates.length ? randomItem(candidates) : { name: "el rival" };
}

function pickNarrativeCaster(characters) {
  const casters = (characters || []).filter((character) => hasSpells(character) || getCharacterTags(character).has("spellcaster"));
  return casters.length ? randomItem(casters) : null;
}

function getSpellNarrativeCategory(spellName, metadata) {
  const name = normalizeLookupText(spellName);
  if (/(force buckler|shield|mage armor|armor of agathys|blade ward|ward|protection|sanctuary|barrier|absorb elements)/.test(name)) return "defense";
  if (/(cure|heal|healing|revivify|restoration|mass heal|healing word|lesser restoration|greater restoration)/.test(name)) return "healing";
  if (/(bless|haste|heroism|enhance ability|aid|guidance|shield of faith)/.test(name)) return "buff";
  if (/(command|web|hold|banish|fear|hypnotic|wall|entangle|sleep|slow)/.test(name)) return "control";
  if (/(hex|bane|curse|blind|deaf|ray of enfeeblement|bestow curse)/.test(name)) return "debuff";
  if (/(counterspell|dispel|nullify)/.test(name)) return "anti-magic";
  if (/(misty step|fly|dimension door|teleport|time stop|longstrider|expeditious retreat)/.test(name)) return "mobility";
  if (/(conjure|summon|animate|find steed|find familiar)/.test(name)) return "summon";
  if (/(detect|identify|scry|dream|clairvoyance|demand|augury|divination)/.test(name)) return "information";

  const rawCategory = normalizeLookupText(metadata?.category || metadata?.type);
  if (rawCategory.includes("save") && rawCategory.includes("suck")) return "save-or-suck";
  if (rawCategory.includes("anti") || rawCategory.includes("counter")) return "anti-magic";
  if (rawCategory.includes("heal")) return "healing";
  if (rawCategory.includes("defense")) return "defense";
  if (rawCategory.includes("buff")) return "buff";
  if (rawCategory.includes("debuff")) return "debuff";
  if (rawCategory.includes("control")) return "control";
  if (rawCategory.includes("mobility")) return "mobility";
  if (rawCategory.includes("summon")) return "summon";
  if (rawCategory.includes("information")) return "information";
  if (rawCategory.includes("utility")) return "utility";
  if (rawCategory.includes("damage")) return "damage";
  return "damage";
}

function getSpellNarrativeDamageType(metadata, spellName) {
  const tags = (metadata?.tags || []).map(normalizeLookupText);
  const knownTypes = Object.keys(DAMAGE_TYPE_LABELS);
  const tagType = knownTypes.find((type) => tags.includes(type));
  if (tagType) {
    return tagType;
  }

  const name = normalizeLookupText(spellName);
  if (/(fire|flame|burn|scorch|meteor)/.test(name)) return "fire";
  if (/(cold|ice|frost)/.test(name)) return "cold";
  if (/(poison|venom|acid)/.test(name)) return name.includes("acid") ? "acid" : "poison";
  if (/(thunder|shatter)/.test(name)) return "thunder";
  if (/(lightning|storm)/.test(name)) return "lightning";
  if (/(radiant|guiding|sun|light)/.test(name)) return "radiant";
  if (/(necrotic|blight|chill|death)/.test(name)) return "necrotic";
  if (/(force|missile|eldritch)/.test(name)) return "force";
  if (/(psychic|mind|dissonant)/.test(name)) return "psychic";
  return "magical";
}

function getDamageNarrativeByType(type, targetName) {
  const lines = {
    fire: `el fuego incinera la cobertura de ${targetName} y abre espacio.`,
    cold: `el frio muerde a ${targetName} y le roba velocidad.`,
    poison: `${targetName} queda intoxicado y pierde ritmo.`,
    thunder: `el trueno sacude a ${targetName} y rompe su postura.`,
    acid: `el acido corroe la defensa de ${targetName}.`,
    lightning: `un arco electrico golpea a ${targetName} antes de que pueda reaccionar.`,
    radiant: `la luz radiante quema la guardia de ${targetName}.`,
    necrotic: `la energia necrotica marchita la resistencia de ${targetName}.`,
    force: `la fuerza pura empuja a ${targetName} fuera de posicion.`,
    psychic: `el impacto psiquico desordena la mente de ${targetName}.`,
    bludgeoning: `el golpe magico aplasta la guardia de ${targetName}.`,
    piercing: `la energia perfora la defensa de ${targetName}.`,
    slashing: `el corte magico abre la defensa de ${targetName}.`
  };
  return lines[type] || `la magia impacta a ${targetName} sin confundirse con curacion ni soporte.`;
}

function getRoundStatus(tournament, round, index) {
  const played = tournament.completedMatches.find((match) => match.phase === round);
  if (played) {
    return played.result;
  }
  if (tournament.currentCampaignEvent?.roundIndex === index) {
    return "Evento activo";
  }
  if (tournament.finished && !tournament.champion && index >= tournament.knockoutIndex) {
    return "Pendiente";
  }
  if (
    index === tournament.knockoutIndex &&
    tournament.groupMatches.length === 3 &&
    tournament.groupWins >= 2 &&
    !tournament.finished
  ) {
    return hasCampaignEventForRound(tournament, index) ? "En camino" : "Evento pendiente";
  }
  return "Pendiente";
}

function getCampaignEventStatus(tournament) {
  if (tournament.groupMatches.length < 3 || tournament.groupWins < 2) {
    return "Pendiente";
  }
  if (tournament.currentCampaignEvent) {
    return `${tournament.currentCampaignEvent.phase || "Ronda"} activo`;
  }
  if (tournament.campaignEvents.length) {
    return `${tournament.campaignEvents.length}/${tournament.knockoutRounds.length} resueltos`;
  }
  return "Listo";
}

function hasCampaignEventForRound(tournament, roundIndex) {
  return tournament.campaignEventRoundIndexes.includes(roundIndex);
}

function needsCampaignEventBeforeNextCombat(tournament) {
  return tournament.groupMatches.length === 3 &&
    tournament.groupWins >= 2 &&
    tournament.knockoutIndex < tournament.knockoutRounds.length &&
    !hasCampaignEventForRound(tournament, tournament.knockoutIndex);
}

function createTournamentOpponents() {
  return getRankedAdventureEnemies();
}

function createEnemyTeamFromParty(sourceParty, index) {
  const chosen = [...sourceParty.characters];
  const assignments = autoAssignRoles(chosen);

  const team = {
    id: `enemy-${sourceParty.id}-${index}`,
    name: sourceParty.name,
    theme: sourceParty.theme,
    sourcePartyId: sourceParty.id,
    members: chosen,
    assignments,
    isPlayer: false
  };
  team.score = calculatePartyScore(team);

  return team;
}

const CLASS_COMPATIBLE_ROLES = {
  Barbarian: ["FRONTLINER", "DPS_MELEE"],
  Fighter: ["FRONTLINER", "DPS_MELEE", "TACTICIAN"],
  Paladin: ["FRONTLINER", "SUPPORT", "DPS_MELEE"],
  Rogue: ["DPS_MELEE", "TACTICIAN"],
  Ranger: ["DPS_RANGED", "TACTICIAN"],
  Wizard: ["DPS_RANGED", "TACTICIAN"],
  Sorcerer: ["DPS_RANGED"],
  Warlock: ["DPS_RANGED"],
  Cleric: ["SUPPORT", "FRONTLINER", "DPS_RANGED"],
  Druid: ["SUPPORT", "DPS_RANGED", "FRONTLINER"],
  Bard: ["SUPPORT", "TACTICIAN", "DPS_RANGED"],
  Artificer: ["TACTICIAN", "SUPPORT", "DPS_RANGED"],
  Monk: ["DPS_MELEE", "TACTICIAN"],
  "Blood Hunter": ["DPS_MELEE", "TACTICIAN"]
};

const CLASS_GROUP_COMPATIBLE_ROLES = {
  tank: ["FRONTLINER", "DPS_MELEE"],
  martial: ["FRONTLINER", "DPS_MELEE", "TACTICIAN"],
  skirmisher: ["DPS_MELEE", "TACTICIAN"],
  ranged: ["DPS_RANGED", "TACTICIAN"],
  arcane: ["DPS_RANGED", "TACTICIAN"],
  divine: ["SUPPORT", "FRONTLINER", "DPS_RANGED"],
  primal: ["SUPPORT", "DPS_RANGED", "FRONTLINER"],
  support: ["SUPPORT", "TACTICIAN"]
};

function getClassMetadata(character) {
  const registry = typeof globalThis !== "undefined" ? globalThis.DND_CLASS_DATA : null;
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

function getCharacterRolePriority(character) {
  const metadata = getClassMetadata(character);
  return uniqueRoleIds([
    ...(character.rolePriority || []),
    ...getSubclassRolePriority(character),
    ...(character.roles || []),
    ...(metadata?.roles || [])
  ]);
}

function getSubclassRolePriority(character) {
  const classification = getSubclassClassification(character);
  return uniqueRoleIds(classification?.rolePriority || []);
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

function uniqueRoleIds(roles) {
  return [...new Set(roles.map(normalizeRoleId).filter(Boolean))];
}

function normalizeRoleId(role) {
  const mapped = {
    FRONTLINE: "FRONTLINER",
    DAMAGE_DEALER: "DPS_MELEE"
  };
  return mapped[role] || role;
}

function normalizeLookupText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

function getRoleLabel(role) {
  return ROLE_LABELS[role] || role;
}

function getSpellMetadata(spell) {
  const spellName = getSpellDisplayName(spell);
  if (!spellName || typeof globalThis === "undefined" || typeof globalThis.getSpellInfo !== "function") {
    return null;
  }
  return globalThis.getSpellInfo(spellName) || null;
}

function getSpellDisplayName(spell) {
  return typeof spell === "string" ? spell : spell?.name || "";
}

function getCharacterSpellMetadata(character) {
  return (character.spells || [])
    .map((spell) => ({ spell, metadata: getSpellMetadata(spell) }))
    .filter((entry) => entry.metadata);
}

function characterHasSpellTag(character, tag) {
  return getCharacterSpellMetadata(character)
    .some((entry) => entry.metadata.tags.includes(tag) || entry.metadata.type === tag);
}

const HEALING_SPELL_HINTS = ["heal", "cure", "revivify", "restoration", "vitality", "spare the dying"];
const BUFFER_SPELL_HINTS = ["bless", "haste", "heroism", "shield of faith", "aura", "mantle", "protection", "fly", "pass without trace"];
const DEBUFFER_SPELL_HINTS = ["fear", "web", "hypnotic", "silence", "command", "banish", "blight", "spike growth", "heat metal", "plant growth", "ensnaring", "dissonant"];

function calculatePartyScore(party) {
  const members = party.members || party.characters || [];
  const assignments = party.assignments || {};
  const assignedByRole = getAssignedByRole(members, assignments);
  const roleDetails = [];

  ROLE_ORDER.forEach((role) => {
    const character = assignedByRole[role];
    if (!character) {
      return;
    }

    const multiplier = getRoleFitMultiplier(character, role);
    const power = Math.round(getCharacterPowerScore(character) * multiplier);
    roleDetails.push({ character, role, multiplier, power });
  });

  const assignedIds = new Set(roleDetails.map((detail) => detail.character.id));
  const unassignedMembers = members
    .filter((character) => !assignedIds.has(character.id))
    .sort((left, right) => getCharacterPowerScore(right) - getCharacterPowerScore(left));
  const openRosterSlots = Math.max(0, ROLE_ORDER.length - roleDetails.length);
  const activeUnassignedMembers = unassignedMembers.slice(0, openRosterSlots);
  const reserveMembers = unassignedMembers.slice(openRosterSlots);
  const activeMembers = [
    ...roleDetails.map((detail) => detail.character),
    ...activeUnassignedMembers
  ];
  const unassignedPower = activeUnassignedMembers
    .reduce((sum, character) => sum + Math.round(getCharacterPowerScore(character) * UNASSIGNED_ROLE_MULTIPLIER), 0);
  const rawPower = roleDetails.reduce((sum, detail) => sum + detail.power, 0) + unassignedPower;
  const profile = getPartyProfile(activeMembers, assignedByRole);
  const strengths = [];
  const weaknesses = [];
  let roleBonus = 0;
  let synergyBonus = 0;
  let penalties = 0;
  const rewardBonus = Number(party.permanentScoreBonus || party.rewardBonus || 0);
  const specialGroupSynergy = calculateSpecialGroupBonus(activeMembers);
  const groupBonus = specialGroupSynergy.bonus;
  const missingRoleCount = ROLE_ORDER.filter((role) => !assignedByRole[role]).length;

  if (rewardBonus > 0) {
    strengths.push(`Mejoras permanentes acumuladas (${formatModifier(rewardBonus)})`);
  } else if (rewardBonus < 0) {
    weaknesses.push(`Cicatrices permanentes acumuladas (${formatModifier(rewardBonus)})`);
  }
  if (groupBonus > 0) {
    specialGroupSynergy.details.forEach((detail) => {
      strengths.push(`Grupo ${detail.name}: ${detail.matched}/${detail.total} miembros (${formatModifier(detail.bonus)})`);
    });
  }

  if (missingRoleCount > 0) {
    const missingPenalty = missingRoleCount * 12;
    penalties -= missingPenalty;
    weaknesses.push(`${missingRoleCount} puestos sin cubrir (${formatModifier(-missingPenalty)})`);
  }
  if (activeUnassignedMembers.length) {
    weaknesses.push(`${activeUnassignedMembers.length} personaje${activeUnassignedMembers.length === 1 ? "" : "s"} pelea${activeUnassignedMembers.length === 1 ? "" : "n"} sin puesto asignado y aporta${activeUnassignedMembers.length === 1 ? "" : "n"} solo ${Math.round(UNASSIGNED_ROLE_MULTIPLIER * 100)}%`);
  }
  if (reserveMembers.length) {
    weaknesses.push(`${reserveMembers.length} personaje${reserveMembers.length === 1 ? "" : "s"} queda${reserveMembers.length === 1 ? "" : "n"} en reserva y no suma${reserveMembers.length === 1 ? "" : "n"} score`);
  }

  if (profile.strongFrontliner) {
    roleBonus += 15;
    strengths.push("Frontline fuerte");
  } else if (profile.hasFrontliner) {
    roleBonus += 8;
    strengths.push("Frontline cubierto");
  }
  if (profile.strongDps) {
    roleBonus += 15;
    strengths.push("Damage Dealer fuerte");
  } else if (profile.hasDps) {
    roleBonus += 8;
    strengths.push("Daño consistente");
  }
  if (profile.hasSpellcaster) {
    roleBonus += 10;
    strengths.push("Hay presencia magica o psionica");
  }
  if (profile.hasSupport) {
    roleBonus += 10;
    strengths.push("Support activo");
  }
  if (profile.hasTacticianOrDebuffer) {
    roleBonus += 10;
    strengths.push("Tactician o Debuffer presente");
  }

  if (profile.hasFrontliner && profile.hasArcaneCaster) {
    synergyBonus += 20;
    strengths.push("Sinergia Frontliner + Arcane Caster");
  }
  if (profile.hasFrontliner && profile.hasSupport) {
    synergyBonus += 25;
    strengths.push("Sinergia Frontliner + Support");
  }
  if (profile.hasBuffer && profile.hasDps) {
    synergyBonus += 20;
    strengths.push("Sinergia Buffer + DPS");
  }
  if (profile.hasDebuffer && profile.hasSpellcaster) {
    synergyBonus += 20;
    strengths.push("Sinergia Debuffer + Spellcaster");
  }
  if (profile.hasHealer && profile.hasTank) {
    synergyBonus += 25;
    strengths.push("Sinergia Healer + Tank");
  }

  if (!profile.hasFrontliner) {
    penalties -= 35;
    weaknesses.push("Sin Frontliner");
  }
  if (!profile.hasSupport) {
    penalties -= 25;
    weaknesses.push("Sin Support");
  }
  if (!profile.hasSpellcaster) {
    penalties -= 20;
    weaknesses.push("Sin Spellcaster");
  }
  if (profile.dpsCount >= 4) {
    penalties -= 20;
    weaknesses.push("Demasiados DPS");
  }
  if (profile.averageCon < 12) {
    penalties -= 30;
    weaknesses.push("Party muy fragil: CON promedio menor a 12");
  }

  roleDetails
    .filter((detail) => detail.multiplier >= 1.15)
    .forEach((detail) => strengths.push(`${detail.character.name} esta en su mejor posicion como ${getRoleLabel(detail.role)}`));
  roleDetails
    .filter((detail) => detail.multiplier < 1)
    .forEach((detail) => {
      const note = detail.multiplier <= 0.5 ? "rinde muy mal" : "rinde regular";
      weaknesses.push(`${detail.character.name} ${note} como ${getRoleLabel(detail.role)}`);
    });

  if (typeof calculatePartyCR === "function") {
    const partyCR = calculatePartyCR({ members: activeMembers });
    const affinityBonus = partyCR.affinityBonus || 0;

    strengths.push(
      `CR promedio ${partyCR.averageCR}`,
      `Mejor personaje: ${partyCR.bestCharacter?.characterName || "N/A"}`
    );
    if (partyCR.damageProfile?.damageTypeCount) {
      strengths.push(`Cobertura de daño: ${formatDamageTypeList(partyCR.damageProfile.allTypes)}`);
    }
    if (!partyCR.damageProfile?.hasElemental) {
      weaknesses.push("Sin daño elemental");
    }
    if (!partyCR.damageProfile?.hasSpecial) {
      weaknesses.push("Sin daño radiant, necrotic, force o psychic");
    }
    strengths.push(...partyCR.affinityDetails
        .filter((detail) => detail.score > 0)
        .map((detail) => `Afinidad positiva: ${detail.characterA} + ${detail.characterB} (${formatModifier(detail.points)})`));
    weaknesses.push(...partyCR.affinityDetails
        .filter((detail) => detail.score < 0)
        .map((detail) => `Afinidad negativa: ${detail.characterA} + ${detail.characterB} (${formatModifier(detail.points)})`));

    const finalScore = Math.round(rawPower + roleBonus + synergyBonus + affinityBonus + rewardBonus + groupBonus + penalties);

    return {
      rawPower,
      roleBonus,
      synergyBonus,
      affinityBonus,
      rewardBonus,
      groupBonus,
      groupDetails: specialGroupSynergy.details,
      penalties,
      finalScore,
      strengths,
      weaknesses,
      assignedCharacters: roleDetails,
      activeMembers,
      reserveMembers,
      total: finalScore,
      partyCR
    };
  }

  const finalScore = Math.round(rawPower + roleBonus + synergyBonus + rewardBonus + groupBonus + penalties);

  return {
    rawPower,
    roleBonus,
    synergyBonus,
    rewardBonus,
    groupBonus,
    groupDetails: specialGroupSynergy.details,
    penalties,
    finalScore,
    strengths,
    weaknesses,
    assignedCharacters: roleDetails,
    activeMembers,
    reserveMembers,
    total: finalScore
  };
}

function calculateSpecialGroupBonus(members = []) {
  const registry = typeof globalThis !== "undefined" && Array.isArray(globalThis.SPECIAL_GROUPS)
    ? globalThis.SPECIAL_GROUPS
    : [];
  if (!registry.length || !members.length) {
    return { bonus: 0, details: [] };
  }

  const memberKeys = new Set();
  members.forEach((character) => {
    memberKeys.add(normalizeLookupText(character.id));
    memberKeys.add(normalizeLookupText(character.name));
  });

  const details = [];
  registry.forEach((group) => {
    const requiredIds = Array.isArray(group.memberIds) ? group.memberIds : [];
    const matchedIds = requiredIds.filter((id) => memberKeys.has(normalizeLookupText(id)));
    const threshold = Math.max(2, Number(group.threshold || Math.min(3, requiredIds.length)));

    if (matchedIds.length >= threshold) {
      const bonus = Math.max(1, Number(group.bonus || (10 + matchedIds.length * 4)));
      details.push({
        id: group.id,
        name: group.name || group.id,
        matched: matchedIds.length,
        total: requiredIds.length,
        threshold,
        bonus
      });
    }
  });

  const bonus = details.reduce((sum, detail) => sum + detail.bonus, 0);
  return { bonus, details };
}

function getActiveCombatRoster(members, assignments = {}) {
  const assignedByRole = getAssignedByRole(members, assignments);
  const assignedCharacters = ROLE_ORDER
    .map((role) => assignedByRole[role])
    .filter(Boolean);
  const assignedIds = new Set(assignedCharacters.map((character) => character.id));
  const openRosterSlots = Math.max(0, ROLE_ORDER.length - assignedCharacters.length);
  const activeUnassigned = members
    .filter((character) => !assignedIds.has(character.id))
    .sort((left, right) => getCharacterPowerScore(right) - getCharacterPowerScore(left))
    .slice(0, openRosterSlots);

  return [...assignedCharacters, ...activeUnassigned];
}

function getRoleFitMultiplier(character, role) {
  const rolePriority = getCharacterRolePriority(character);
  const roleIndex = rolePriority.indexOf(role);

  return roleIndex >= 0
    ? ROLE_PRIORITY_MULTIPLIERS[Math.min(roleIndex, ROLE_PRIORITY_MULTIPLIERS.length - 1)]
    : ROLE_PRIORITY_MULTIPLIERS[ROLE_PRIORITY_MULTIPLIERS.length - 1];
}

function getCompatibleRoles(character) {
  const metadata = getClassMetadata(character);
  const explicitTags = new Set((character.tags || []).map((tag) => tag.toLowerCase()));
  const rolePriority = getCharacterRolePriority(character);
  const classGroup = getCharacterClassGroup(character);
  const subclassInfo = getSubclassClassification(character);
  const roles = new Set([
    ...(character.compatibleRoles || []),
    ...rolePriority,
    ...(CLASS_COMPATIBLE_ROLES[character.className] || []),
    ...(CLASS_GROUP_COMPATIBLE_ROLES[classGroup] || [])
  ]);
  const bestMentalStat = Math.max(character.stats.INT, character.stats.WIS, character.stats.CHA);

  if ((hasSpells(character) || isSpellcasterClass(character)) && bestMentalStat >= 16 && hasMeaningfulDamageSpell(character)) {
    roles.add("DPS_RANGED");
  }
  if (hasAnySpellHint(character, HEALING_SPELL_HINTS)) {
    roles.add("SUPPORT");
  }
  if (character.stats.STR + character.stats.CON >= 32) {
    roles.add("FRONTLINER");
  }
  if (getRoleStatScore(character, "DPS_MELEE") >= 32) {
    roles.add("DPS_MELEE");
  }
  if (getRoleStatScore(character, "DPS_RANGED") >= 32) {
    roles.add("DPS_RANGED");
  }
  if (getRoleStatScore(character, "TACTICIAN") >= 28) {
    roles.add("TACTICIAN");
  }

  if (!isDamageTagWorthy(character, rolePriority, classGroup, subclassInfo, explicitTags)) {
    roles.delete("DPS_MELEE");
    roles.delete("DPS_RANGED");
  }

  return uniqueRoleIds([...roles]);
}

function getPartyProfile(members, assignedByRole) {
  const tagsById = new Map(members.map((character) => [character.id, getCharacterTags(character)]));
  const frontliner = assignedByRole.FRONTLINER;
  const meleeDps = assignedByRole.DPS_MELEE;
  const rangedDps = assignedByRole.DPS_RANGED;
  const tactician = assignedByRole.TACTICIAN;
  const hasFrontliner = Boolean(frontliner && isRoleGood(frontliner, "FRONTLINER"));
  const hasRangedDps = Boolean(rangedDps && isRoleGood(rangedDps, "DPS_RANGED")) ||
    members.some((character) => getCompatibleRoles(character).includes("DPS_RANGED"));
  const hasSupport = Boolean(assignedByRole.SUPPORT && isRoleGood(assignedByRole.SUPPORT, "SUPPORT")) ||
    members.some((character) => tagsById.get(character.id).has("support") || tagsById.get(character.id).has("healer"));
  const hasTacticianOrDebuffer = Boolean(tactician && isRoleGood(tactician, "TACTICIAN")) ||
    members.some((character) => tagsById.get(character.id).has("debuffer"));
  const hasSpellcaster = members.some((character) => hasSpells(character) || isSpellcasterClass(character));
  const hasArcaneCaster = members.some((character) =>
    getCharacterClassGroup(character) === "arcane" ||
    (tagsById.get(character.id).has("spellcaster") && ["INT", "CHA"].includes(getClassMetadata(character)?.primaryStat))
  );
  const hasMeleeDps = Boolean(meleeDps && isRoleGood(meleeDps, "DPS_MELEE"));
  const hasDps = hasMeleeDps || hasRangedDps ||
    members.some((character) => tagsById.get(character.id).has("dps"));
  const dpsCount = members.filter((character) => tagsById.get(character.id).has("dps")).length;
  const strongestDps = [meleeDps, rangedDps]
    .filter(Boolean)
    .filter((character) => isRoleGood(character, findAssignedRoleForCharacter(assignedByRole, character.id)))
    .sort((a, b) => getCharacterPowerScore(b) - getCharacterPowerScore(a))[0];

  return {
    hasFrontliner,
    strongFrontliner: Boolean(hasFrontliner && (getCharacterPowerScore(frontliner) >= 70 || frontliner.stats.STR + frontliner.stats.CON >= 32)),
    strongDps: Boolean(strongestDps && (getCharacterPowerScore(strongestDps) >= 70 || Math.max(getRoleStatScore(strongestDps, "DPS_MELEE"), getRoleStatScore(strongestDps, "DPS_RANGED")) >= 34)),
    hasSpellcaster,
    hasArcaneCaster,
    hasRangedDps,
    hasMeleeDps,
    hasSupport,
    hasTacticianOrDebuffer,
    hasBuffer: members.some((character) => tagsById.get(character.id).has("buffer")),
    hasDebuffer: members.some((character) => tagsById.get(character.id).has("debuffer")),
    hasHealer: members.some((character) => tagsById.get(character.id).has("healer")),
    hasTank: members.some((character) => tagsById.get(character.id).has("tank")),
    hasDps,
    dpsCount,
    averageCon: average(members.map((character) => character.stats.CON))
  };
}

function getCharacterTags(character) {
  const explicitTags = new Set((character.tags || []).map((tag) => tag.toLowerCase()));
  const tags = new Set(explicitTags);
  const metadata = getClassMetadata(character);
  (metadata?.tags || [])
    .map((tag) => String(tag).toLowerCase())
    .filter((tag) => tag !== "dps")
    .forEach((tag) => tags.add(tag));
  const roles = getCharacterRolePriority(character);
  const classGroup = getCharacterClassGroup(character);
  const subclassInfo = getSubclassClassification(character);

  applySubclassTags(tags, subclassInfo);

  if (isTankTagWorthy(character, roles, classGroup)) {
    tags.add("tank");
  } else {
    tags.delete("tank");
  }
  if (isDamageTagWorthy(character, roles, classGroup, subclassInfo, explicitTags)) {
    tags.add("dps");
  } else {
    tags.delete("dps");
  }
  if (roles.includes("SUPPORT") || ["Cleric", "Bard", "Druid", "Artificer"].includes(character.className) || ["divine", "primal", "support"].includes(classGroup)) {
    tags.add("support");
  }
  if (roles.includes("TACTICIAN")) {
    tags.add("tactician");
  }
  if (hasSpells(character) || metadata?.spellcasting) {
    tags.add("spellcaster");
  }
  if (hasAnySpellHint(character, HEALING_SPELL_HINTS) || characterHasSpellTag(character, "healing")) {
    tags.add("healer");
  }
  if (hasAnySpellHint(character, BUFFER_SPELL_HINTS) || characterHasSpellTag(character, "buff")) {
    tags.add("buffer");
  }
  if (hasAnySpellHint(character, DEBUFFER_SPELL_HINTS) || characterHasSpellTag(character, "debuff") || characterHasSpellTag(character, "control")) {
    tags.add("debuffer");
  }
  return tags;
}

function applySubclassTags(tags, subclassInfo) {
  if (!subclassInfo) {
    return;
  }

  const roles = [subclassInfo.primaryRole, ...(subclassInfo.secondaryRoles || [])];
  const mechanicalTags = new Set((subclassInfo.tags || []).map((tag) => normalizeLookupText(tag)));

  if (roles.some((role) => ["Tank", "Defensive Caster", "Survivalist"].includes(role))) {
    tags.add("tank");
  }
  if (roles.some((role) => ["Support", "Healer", "Buffer", "Battlefield Leader"].includes(role))) {
    tags.add("support");
  }
  if (roles.includes("Healer") || mechanicalTags.has("healing") || mechanicalTags.has("emergency healing")) {
    tags.add("healer");
  }
  if (roles.includes("Buffer") || mechanicalTags.has("buffs allies")) {
    tags.add("buffer");
  }
  if (roles.some((role) => ["Controller", "Debuffer", "Disruptor", "Area Denial", "Anti-Magic"].includes(role))) {
    tags.add("tactician");
  }
  if (roles.includes("Debuffer") || mechanicalTags.has("debuffs enemies")) {
    tags.add("debuffer");
  }
  if (mechanicalTags.has("spellcasting") || ["Arcane Magic", "Divine Magic", "Primal Magic", "Spellcasting", "Psionics"].includes(subclassInfo.powerSource)) {
    tags.add("spellcaster");
  }
}

function isDamageTagWorthy(character, roles, classGroup, subclassInfo, explicitTags) {
  if (explicitTags.has("dps")) {
    return true;
  }
  if (hasOffensiveSubclassRole(subclassInfo)) {
    return true;
  }

  const primaryRole = roles[0];
  const secondaryRole = roles[1];
  if (["DPS_MELEE", "DPS_RANGED"].includes(primaryRole)) {
    return true;
  }
  if (["DPS_MELEE", "DPS_RANGED"].includes(secondaryRole) && ["martial", "skirmisher", "ranged"].includes(classGroup)) {
    return true;
  }

  return hasMeaningfulDamageSpell(character);
}

function hasOffensiveSubclassRole(subclassInfo) {
  if (!subclassInfo) {
    return false;
  }

  const offensiveRoles = new Set(["Striker", "Blaster", "Nova", "Sustained Damage", "Assassin", "Skirmisher", "Gish"]);
  const roles = [subclassInfo.primaryRole, ...(subclassInfo.secondaryRoles || [])];
  const tags = new Set((subclassInfo.tags || []).map((tag) => normalizeLookupText(tag)));

  return offensiveRoles.has(subclassInfo.primaryRole) ||
    roles.some((role) => offensiveRoles.has(role) && (tags.has("high damage") || tags.has("burst damage") || tags.has("sustained damage") || tags.has("area damage")));
}

function hasMeaningfulDamageSpell(character) {
  const damageSpells = getCharacterSpellMetadata(character)
    .filter((entry) => entry.metadata.type === "damage" || entry.metadata.category === "Damage");

  return damageSpells.some((entry) =>
    Number(entry.metadata.impactScore || 0) >= 7 ||
    Number(entry.metadata.level || 0) >= 3 ||
    Number(entry.metadata.averageDamage || 0) >= 18
  ) || damageSpells.length >= 2;
}

function isTankTagWorthy(character, roles, classGroup) {
  const primaryRole = roles[0];
  const secondaryRole = roles[1];
  const armorClass = getCharacterArmorClass(character);

  if (hasTag(character, "tank")) {
    return true;
  }

  if (classGroup === "tank" || primaryRole === "FRONTLINER") {
    return true;
  }

  return secondaryRole === "FRONTLINER" && armorClass >= 16;
}

function getCharacterClassGroup(character) {
  if (character.classGroup) {
    return String(character.classGroup).toLowerCase();
  }

  const metadata = getClassMetadata(character);
  if (metadata?.classGroup) {
    return String(metadata.classGroup).toLowerCase();
  }

  const className = String(character.className || "").toLowerCase();
  if (["fighter", "paladin"].includes(className)) return "martial";
  if (className === "barbarian") return "tank";
  if (["rogue", "monk", "blood hunter"].includes(className)) return "skirmisher";
  if (className === "ranger") return "ranged";
  if (["wizard", "sorcerer", "warlock"].includes(className)) return "arcane";
  if (className === "cleric") return "divine";
  if (className === "druid") return "primal";
  if (["bard", "artificer"].includes(className)) return "support";
  return "";
}

function isRoleGood(character, role) {
  return getRoleFitMultiplier(character, role) >= 1;
}

function hasSpells(character) {
  return Array.isArray(character.spells) && character.spells.length > 0;
}

function isSpellcasterClass(character) {
  return Boolean(getClassMetadata(character)?.spellcasting);
}

function hasAnySpellHint(character, hints) {
  const spellText = (character.spells || [])
    .map((spell) => {
      const metadata = getSpellMetadata(spell);
      return [
        getSpellDisplayName(spell),
        metadata?.type,
        ...(metadata?.tags || [])
      ].filter(Boolean).join(" ");
    })
    .join(" ")
    .toLowerCase();
  return hints.some((hint) => spellText.includes(hint));
}

function formatSpellList(spells) {
  if (!Array.isArray(spells) || spells.length === 0) {
    return "Sin conjuros";
  }
  return escapeHtml(spells.map(getSpellDisplayName).filter(Boolean).join(", "));
}

function getAssignedByRole(members, assignments) {
  return Object.fromEntries(
    ROLE_ORDER.map((role) => [role, members.find((member) => member.id === assignments[role])])
  );
}

function findAssignedRoleForCharacter(assignedByRole, characterId) {
  return ROLE_ORDER.find((role) => assignedByRole[role]?.id === characterId);
}

function getRoleStatScore(character, role) {
  const stats = character.stats;
  const scores = {
    FRONTLINER: stats.STR + stats.CON,
    DPS_MELEE: Math.max(stats.STR, stats.DEX) + stats.CON,
    DPS_RANGED: Math.max(stats.DEX, stats.INT, stats.WIS, stats.CHA) + Math.max(stats.DEX, stats.INT, stats.WIS, stats.CHA),
    SUPPORT: stats.WIS + stats.CHA + Math.floor(stats.CON / 2),
    TACTICIAN: stats.INT + stats.WIS + Math.floor(stats.DEX / 2)
  };

  return scores[role] || 0;
}

function autoAssignRoles(members) {
  const assignments = {};
  const remaining = [...members];

  ROLE_ORDER.forEach((role) => {
    const best = remaining
      .map((character) => ({
        character,
        value: getRoleFitMultiplier(character, role) * getCharacterPowerScore(character)
      }))
      .sort((a, b) => b.value - a.value)[0];

    if (best) {
      assignments[role] = best.character.id;
      remaining.splice(remaining.findIndex((character) => character.id === best.character.id), 1);
    }
  });

  return assignments;
}

function canStartTournament() {
  return state.draftedCharacters.length > 0;
}

function shouldShowRoleHints() {
  return state.showRoleHints;
}

function renderCoopTurnPill() {
  if (!state.isLocalCoop) {
    return "";
  }

  return `<span class="status-pill coop-pill">${escapeHtml(getCurrentDraftPlayerName())} arma party ${state.activeCoopPlayerIndex + 1}/2</span>`;
}

function getCurrentDraftPlayerName() {
  if (!state.isLocalCoop) {
    return state.partyName;
  }

  return state.playerNames[state.activeCoopPlayerIndex] || "Jugador";
}

function getDraftOwner(character) {
  return state.draftPickOwners[character.id] || "Sin jugador";
}

function getCurrentCoopPartyName() {
  return state.coopPartyNames[state.activeCoopPlayerIndex] || `${getCurrentDraftPlayerName()} Party`;
}

function syncAssignmentsWithDraftedCharacters() {
  const draftedIds = new Set(state.draftedCharacters.map((character) => character.id));
  ROLE_ORDER.forEach((role) => {
    if (!draftedIds.has(state.assignments[role])) {
      state.assignments[role] = "";
    }
  });
  Object.keys(state.draftPickOwners).forEach((characterId) => {
    if (!draftedIds.has(characterId)) {
      delete state.draftPickOwners[characterId];
    }
  });
}

function removeDuplicateAssignments(currentRole, selectedId) {
  if (!selectedId) {
    return;
  }

  ROLE_ORDER.forEach((role) => {
    if (role !== currentRole && state.assignments[role] === selectedId) {
      state.assignments[role] = "";
    }
  });
}

function findAssignedRole(characterId) {
  return ROLE_ORDER.find((role) => state.assignments[role] === characterId);
}

function cloneCharacterForRun(character) {
  return deepCloneData(character);
}

function deepCloneData(value) {
  if (Array.isArray(value)) {
    return value.map(deepCloneData);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [key, deepCloneData(entryValue)])
    );
  }
  return value;
}

function findCharacter(characterId) {
  return getAllCharacters()
    .find((character) => character.id === characterId);
}

function findPartyForCharacter(characterId) {
  return DND_PARTIES.find((party) =>
    party.characters.some((character) => character.id === characterId)
  );
}

function getAllCharacters() {
  return [
    ...DND_PARTIES.flatMap((party) => party.characters),
    ...getSpecialCharacters()
  ];
}

function getAllPartyCharacters() {
  return DND_PARTIES.flatMap((party) => party.characters);
}

function getSpecialCharacters() {
  if (typeof globalThis !== "undefined" && Array.isArray(globalThis.SPECIAL_CHARACTERS)) {
    return globalThis.SPECIAL_CHARACTERS;
  }
  return [];
}

function isSpecialUnlocked(character, tournament = state.tournament) {
  if (!character || !tournament) {
    return false;
  }

  const unlocked = Array.isArray(tournament.unlockedSpecialIds) ? tournament.unlockedSpecialIds : [];
  const characterKeys = [character.id, character.name].map(normalizeLookupText);
  return unlocked.some((id) => characterKeys.includes(normalizeLookupText(id)));
}

function unlockSpecialCharacter(tournament, specialId) {
  if (!tournament || !specialId) {
    return;
  }

  tournament.unlockedSpecialIds = Array.isArray(tournament.unlockedSpecialIds)
    ? tournament.unlockedSpecialIds
    : [];

  const key = normalizeLookupText(specialId);
  if (!tournament.unlockedSpecialIds.some((id) => normalizeLookupText(id) === key)) {
    tournament.unlockedSpecialIds.push(specialId);
  }
}

function findSpecialCharacterById(specialId) {
  const target = normalizeLookupText(specialId);
  return getSpecialCharacters().find((character) =>
    normalizeLookupText(character.id) === target ||
    normalizeLookupText(character.name) === target
  );
}

function getUnlockedRecruitableSpecials(tournament, currentIds = new Set()) {
  if (!tournament) {
    return [];
  }

  return getSpecialCharacters()
    .filter((character) => isSpecialUnlocked(character, tournament))
    .filter((character) => !currentIds.has(normalizeLookupText(character.id)))
    .filter((character) => !(tournament.playerTeam.members || []).some((member) =>
      normalizeLookupText(member.id) === normalizeLookupText(character.id) ||
      normalizeLookupText(member.name) === normalizeLookupText(character.name)
    ));
}

function countBy(items, getKey) {
  return items.reduce((counts, item) => {
    const key = getKey(item);
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function firstText(items, fallback) {
  return Array.isArray(items) && items.length ? items[0].toLowerCase() : fallback;
}

function formatModifier(value) {
  return value >= 0 ? `+${value}` : `${value}`;
}

function cleanDisplayName(value, fallback) {
  const cleaned = String(value || "")
    .trim()
    .replace(/\s+/g, " ");
  return cleaned || fallback;
}

function randomItem(items) {
  return items[randomInt(0, items.length - 1)];
}

function hasTag(character, tag) {
  return (character.tags || []).some((characterTag) =>
    characterTag.toLowerCase() === tag.toLowerCase()
  );
}

function getDisplayTags(character) {
  const tags = new Set([
    ...(character.tags || []).map((tag) => tag.toLowerCase()),
    ...getCharacterTags(character)
  ]);
  const priority = [
    "especial",
    "comico",
    "tank",
    "dps",
    "support",
    "healer",
    "buffer",
    "debuffer",
    "spellcaster",
    "tactician"
  ];
  const visible = priority.filter((tag) => tags.has(tag));
  const mustShow = visible.filter((tag) => tag === "especial" || tag === "comico");
  if (!shouldShowRoleHints()) {
    return mustShow;
  }
  const roleTags = visible.filter((tag) => !mustShow.includes(tag)).slice(0, 4);
  return [...mustShow, ...roleTags];
}

function getTagLabel(tag) {
  const labels = {
    especial: "Especial",
    comico: "Comico",
    tank: "Tank",
    dps: "DPS",
    support: "Support",
    healer: "Healer",
    buffer: "Buffer",
    debuffer: "Debuffer",
    spellcaster: "Spellcaster",
    tactician: "Tactician"
  };
  return labels[tag] || tag;
}

function getTagBadgeClass(tag) {
  const classes = {
    especial: "rainbow",
    comico: "teal",
    tank: "gold",
    dps: "danger",
    support: "success",
    healer: "success",
    buffer: "violet",
    debuffer: "violet",
    spellcaster: "teal",
    tactician: "teal"
  };
  return classes[tag] || "";
}

function shouldRevealCharacterCR(reveal = true) {
  return Boolean(reveal);
}

function getVisibleRatingClass(character, reveal = true) {
  if (!shouldRevealCharacterCR(reveal)) {
    return "rating-hidden";
  }

  return `rating-${getRatingTier(getCharacterTierScore(character))}`;
}

function getVisibleRatingLabel(reveal = true) {
  return shouldRevealCharacterCR(reveal) ? "CR" : "Rango";
}

function getVisibleRatingValue(character, reveal = true) {
  return shouldRevealCharacterCR(reveal) ? getCharacterCRLabel(character) : "?";
}

function getVisibleRatingMetaLabel(reveal = true) {
  return shouldRevealCharacterCR(reveal) ? "Challenge Rating" : "Rating oculto";
}

const DAMAGE_TYPE_LABELS = {
  bludgeoning: "Bludgeoning",
  piercing: "Piercing",
  slashing: "Slashing",
  fire: "Fire",
  cold: "Cold",
  poison: "Poison",
  thunder: "Thunder",
  acid: "Acid",
  lightning: "Lightning",
  radiant: "Radiant",
  necrotic: "Necrotic",
  force: "Force",
  psychic: "Psychic"
};

function getCharacterHitPointInfo(character) {
  if (typeof calculateCharacterCR === "function") {
    const result = calculateCharacterCR(character);
    return {
      hitPoints: result.hitPoints,
      hitDie: result.hitDie || 8,
      source: result.hitPointSource || "calculado"
    };
  }

  return {
    hitPoints: Number(character.hitPoints || 1),
    hitDie: 8,
    source: "manual"
  };
}

function getCharacterDefenseInfo(character) {
  if (typeof calculateCharacterCR === "function") {
    const result = calculateCharacterCR(character);
    return {
      defensiveCR: result.defensiveCR,
      hpDefensiveCR: result.hpDefensiveCR || 0,
      armorClass: result.armorClass,
      armorClassAdjustment: result.armorClassAdjustment || 0,
      armorClassSource: result.armorClassSource || "calculado",
      hitPoints: result.hitPoints
    };
  }

  return {
    defensiveCR: 0,
    hpDefensiveCR: 0,
    armorClass: Number(character.armorClass || 10),
    armorClassAdjustment: 0,
    armorClassSource: "manual",
    hitPoints: Number(character.hitPoints || 1)
  };
}

function renderCharacterDefenseSummary(info) {
  return `
    <div class="defense-summary">
      <div>
        <span>HP base CR</span>
        <strong>${formatDefenseCRValue(info.hpDefensiveCR)}</strong>
      </div>
      <div>
        <span>AC mod</span>
        <strong>${formatModifier(info.armorClassAdjustment)}</strong>
      </div>
      <div>
        <span>AC fuente</span>
        <strong>${escapeHtml(info.armorClassSource)}</strong>
      </div>
    </div>
  `;
}

function getCharacterDamageProfile(character) {
  if (typeof calculateCharacterCR === "function") {
    return calculateCharacterCR(character).damageProfile;
  }

  return null;
}

function renderCharacterDamageSummary(profile) {
  if (!profile || !profile.damageTypeCount) {
    return `<div class="damage-profile compact"><span class="meta-label">Daño</span><span class="muted">Sin daño detectado</span></div>`;
  }

  return `
    <div class="damage-profile compact">
      <span class="meta-label">Daño</span>
      ${renderDamageCategory("Fisico", profile.physical?.types)}
      ${renderDamageCategory("Elemental", profile.elemental?.types)}
      ${renderDamageCategory("Especial", profile.special?.types)}
    </div>
  `;
}

function renderPartyDamageProfile(profile) {
  if (!profile || !profile.damageTypeCount) {
    return "";
  }

  return `
    <div class="damage-profile party-damage-profile">
      <span class="meta-label">Cobertura de daño</span>
      ${renderDamageCategory("Fisico", profile.physical?.types)}
      ${renderDamageCategory("Elemental", profile.elemental?.types)}
      ${renderDamageCategory("Radiant/Necrotic/Force/Psychic", profile.special?.types)}
      ${renderSpellDamageUsers(profile)}
    </div>
  `;
}

function renderDamageCategory(label, types = []) {
  const visibleTypes = (types || []).filter(Boolean);
  if (!visibleTypes.length) {
    return "";
  }

  return `
    <div class="damage-type-row">
      <span>${escapeHtml(label)}</span>
      <div class="damage-chip-row">
        ${visibleTypes.map((type) => `<span class="damage-chip ${escapeHtml(type)}">${escapeHtml(getDamageTypeLabel(type))}</span>`).join("")}
      </div>
    </div>
  `;
}

function renderSpellDamageUsers(profile) {
  const entries = Object.entries(profile.spellUsersByType || {})
    .filter(([, users]) => users.length)
    .sort(([left], [right]) => left.localeCompare(right));

  if (!entries.length) {
    return "";
  }

  return `
    <details class="damage-users">
      <summary>Spells por tipo</summary>
      <div class="damage-user-list">
        ${entries.map(([type, users]) => `
          <div>
            <strong>${escapeHtml(getDamageTypeLabel(type))}</strong>
            <span>${escapeHtml(users.slice(0, 4).join(" | "))}${users.length > 4 ? "..." : ""}</span>
          </div>
        `).join("")}
      </div>
    </details>
  `;
}

function getDamageTypeLabel(type) {
  return DAMAGE_TYPE_LABELS[type] || type;
}

function formatDamageTypeList(types = []) {
  return (types || []).map(getDamageTypeLabel).join(", ");
}

function formatDefenseCRValue(value) {
  const number = Math.round(Number(value || 0) * 100) / 100;
  if (number === 0.13 || number === 0.125) return "1/8";
  if (number === 0.25) return "1/4";
  if (number === 0.5) return "1/2";
  return Number.isInteger(number) ? String(number) : String(number).replace(/0$/, "");
}

function getCharacterCRLabel(character) {
  if (typeof calculateCharacterCR === "function") {
    return calculateCharacterCR(character).roundedCR;
  }
  return estimateFallbackCR(character);
}

function getCharacterCRValue(character) {
  if (typeof calculateCharacterCR === "function") {
    return Number(calculateCharacterCR(character).roundedCRValue || 0);
  }
  return Number(estimateFallbackCR(character) || 0);
}

function getPartyTotalCR(members) {
  return (members || []).reduce((sum, character) => sum + getCharacterCRValue(character), 0);
}

function formatCRNumber(value) {
  const rounded = Math.round(Number(value || 0) * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function getCharacterArmorClass(character) {
  if (typeof calculateCharacterCR === "function") {
    return calculateCharacterCR(character).armorClass;
  }
  return Number(character.armorClass || 10);
}

function getCharacterPowerScore(character) {
  if (typeof calculateCharacterCR === "function") {
    return calculateCharacterCR(character).powerScore;
  }
  return estimateFallbackCR(character) * 10 + Number(character.level || 1) * 2;
}

function getCharacterTierScore(character) {
  return clamp(Math.round(getCharacterPowerScore(character)), 40, 99);
}

function getRatingTier(rating) {
  if (rating >= 90) return "elite";
  if (rating >= 80) return "high";
  if (rating >= 68) return "solid";
  return "prospect";
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function estimateFallbackCR(character) {
  const level = Number(character.level || 1);
  const statScore = Math.max(
    character.stats?.STR || 10,
    character.stats?.DEX || 10,
    character.stats?.CON || 10,
    character.stats?.INT || 10,
    character.stats?.WIS || 10,
    character.stats?.CHA || 10
  );
  const spellBonus = hasSpells(character) ? 0.5 : 0;
  const statBonus = statScore >= 18 ? 1 : statScore >= 16 ? 0.5 : 0;
  return Math.max(0, Math.round((level / 3 + statBonus + spellBonus) * 2) / 2);
}

function getCharacterDraftWeight(character) {
  if (hasTag(character, "especial")) {
    return Number(character.appearanceWeight || 0.25);
  }
  return 1;
}

function weightedPick(items) {
  const totalWeight = items.reduce((sum, item) => sum + getCharacterDraftWeight(item), 0);
  let roll = Math.random() * totalWeight;

  for (const item of items) {
    roll -= getCharacterDraftWeight(item);
    if (roll <= 0) {
      return item;
    }
  }

  return items[items.length - 1];
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

audioManager.loadAudioSettings();
setupGlobalAudioFeedback();
renderStart();
