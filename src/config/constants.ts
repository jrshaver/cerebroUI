export class constants {
  static API_ENDPOINT = 'https://cerebro-beta-bot.herokuapp.com';
  static CARD_IMG_ENDPOINT = 'https://cerebrodatastorage.blob.core.windows.net/cerebro-cards';
  static EMAIL_CLIENT_API_KEY = 'b3=y*NcFk~a64xMH';
  static BEARER_TOKEN = 'ghu_oRjoUyESbISEQjdxqXLAEfbVA23pzV2iVSrA';
  static FUSE_OPTIONS = {
    fieldNormWeight: 1,
    findAllMatches: true,
    includeMatches: true,
    includeScore: true,
    minMatchCharLength: 3,
    shouldSort: true,
    keys: ['Name', 'Subname', 'Classification', {
      name: 'Type',
      weight: 2
    }, {
      name: 'Traits',
      weight: 3
    }, {
      name: 'Rules',
      weight: 1
    }]
  }
  static filters = {
    // CLASSIFICATIONS: ['Aggression', 'Basic', 'Determination', 'Encounter', 'Hero', 'Justice', 'Leadership', 'Player', 'Protection'],
    ASPECTS: ['Aggression', 'Basic', 'Justice', 'Leadership', 'Protection'],
    COSTS: ['None', '-', '0', '1', '2', '3', '4', '5', '6'],
    RESOURCES: [{
      name: 'Energy',
      value: '{e}'
    }, {
      name: 'Mental',
      value: '{m}'
    }, {
      name: 'Physical',
      value: '{p}'
    }, {
      name: 'Wild',
      value: '{w}'
    }],
    TRAITS: ["Aerial", "Android", "Ants", "Armor", "Arrow", "Artifact", "Asgard", "Attack", "Attorney", "Avenger", "Black Panther", "Brotherhood of Mutants", "Captive", "Champion", "Civilian", "Condition", "Cosmic Entity", "Creature", "Cyborg", "Defender", "Defense", "Dragon", "Enhanced", "Gamma", "Genius", "Giant", "Guardian", "Hero for Hire", "Hydra", "Inhuman", "Invocation", "Item", "King", "Kree", "Location", "Mercenary", "Milano Mod", "Mystic", "Nova Corps", "Olympus", "Outlaw", "Persona", "Preparation", "S.H.I.E.L.D", "Scientist", "Skill", "Soldier", "Space Knight", "Spell", "Spy", "Superpower", "Symbiote", "Tactic", "Team", "Tech", "Technique", "Temporal", "Thwart", "Tiny", "Title", "Vampire", "Vehicle", "Wakanda", "Weapon", "Web-Warrior", "X-Factor"],
    TYPES: ["Ally", "Alter-Ego", "Attachment", "Event", "Hero", "Resource", "Side Scheme", "Support", "Upgrade"],
    // TRAITS: ["Accuser Corps", "Aerial", "Android", "Ants", "Armor", "Arrow", "Artifact", "Asgard", "Assassin", "Attack", "Attorney", "Avenger", "Badoon", "Bird", "Black Order", "Black Panther", "Bounty Hunter", "Brotherhood of Mutants", "Brute", "Businessman", "Captive", "Champion", "Civilian", "Condition", "Cosmic Entity", "Creature", "Criminal", "Crossfire's Crew", "Cyborg", "Damaged", "Defender", "Defense", "Dragon", "Drone", "Elder", "Elite", "Enhanced", "Experimental", "Expert Mode Only", "Gamma", "Genius", "Ghost", "Giant", "Goblin", "Guardian", "Hero For Hire", "Hero for Hire", "Hydra", "Ice", "Illusion", "Infinity Stone", "Inhuman", "Invocation", "Item", "King", "Kree", "Leviatron", "Location", "Masters of Evil", "Mercenary", "Metal", "Milano Mod", "Mutate", "Mystic", "Nova Corps", "Olympus", "Outlaw", "Persona", "Preparation", "Quiet", "Ringing", "Robot", "S.H.I.E.L.D", "Scientist", "Scoundrel", "Setting", "Skill", "Soldier", "Space Knight", "Spell", "Spy", "Standard Mode Only", "Stone", "Superpower", "Symbiote", "Tactic", "Team", "Tech", "Technique", "Temporal", "Thwart", "Tiny", "Titan", "Title", "Traitor", "Undead", "Vampire", "Vehicle", "Wakanda", "Weapon", "Web-Warrior", "Wood", "Wounded", "Wrecking Crew", "X-Factor"],
    // TYPES: ["Ally", "Alter-Ego", "Attachment", "Environment", "Event", "Hero", "Main Scheme", "Minion", "Obligation", "Resource", "Side Scheme", "Support", "Treachery", "Upgrade", "Villain"],
    // ORIGINS: ["Official", "Unofficial"]
    ORIGINS: ["Official"]
  }
}

export interface FilterOption {
  name: string,
  value: string
}
