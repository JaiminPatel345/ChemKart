// game/achievementManager.js
class AchievementManager {
  constructor(gameState, uiManager) {
    this.gameState = gameState;
    this.uiManager = uiManager;
  }

  checkAllAchievements() {
    this.checkBasicAchievements();
    this.checkSpecialAchievements();
    this.checkProgressAchievements();
    this.uiManager.updateAchievements();
  }

  checkBasicAchievements() {
    // First creation
    if (this.gameState.discoveredCompounds.length >= 1) {
      this.unlockAchievement('first_creation');
    }

    // Level achievements
    if (this.gameState.level >= 2) this.unlockAchievement('level_2');
    if (this.gameState.level >= 5) this.unlockAchievement('level_5');
    if (this.gameState.level >= 10) this.unlockAchievement('level_10');
    if (this.gameState.level >= 15) this.unlockAchievement('level_15');
  }

  checkSpecialAchievements() {
    // Compound achievements
    if (this.gameState.discoveredCompounds.length >= 50) this.unlockAchievement('master_chemist');
    if (this.gameState.discoveredCompounds.length === Object.keys(REACTIONS_DB).length) this.unlockAchievement('researcher');

    // Element achievements
    const unlockedElementCount = Object.keys(PERIODIC_TABLE).filter(id => this.gameState.unlockedItems.includes(id)).length;
    if (unlockedElementCount >= 50) this.unlockAchievement('element_collector');
    if (unlockedElementCount === Object.keys(PERIODIC_TABLE).length) this.unlockAchievement('periodic_master');

    // Money achievement
    if (this.gameState.coins >= 10000) this.unlockAchievement('millionaire');

    // Special compound achievements
    const preciousMetals = ['AuCl3', 'Ag2O', 'PtCl2'].filter(compound => this.gameState.discoveredCompounds.includes(compound));
    if (preciousMetals.length === 3) this.unlockAchievement('precious_metals');

    const radioactive = ['UO2', 'PuO2', 'ThO2', 'AmO2'].some(compound => this.gameState.discoveredCompounds.includes(compound));
    if (radioactive) this.unlockAchievement('radioactive');
  }

  checkProgressAchievements() {
    // Streak achievement
    if (this.gameState.correctStreak >= 20) this.unlockAchievement('speed_demon');

    // Request achievement
    if (this.gameState.totalRequests >= 100) this.unlockAchievement('perfectionist');

    // Hint minimalist
    if (this.gameState.reactionsWithoutHints >= 50) this.unlockAchievement('hint_minimalist');

    // Category-specific achievements
    this.checkCategoryAchievements();
  }

  checkCategoryAchievements() {
    // Transition metals
    const transitionCompounds = this.gameState.discoveredCompounds.filter(compound => {
      const reaction = REACTIONS_DB[compound];
      return reaction && reaction.inputs.some(element => PERIODIC_TABLE[element]?.category === 'transition');
    });
    if (transitionCompounds.length >= 10) this.unlockAchievement('transition_metals');

    // Rare earth elements
    const rareEarthCompounds = this.gameState.discoveredCompounds.filter(compound => {
      const reaction = REACTIONS_DB[compound];
      return reaction && reaction.inputs.some(element => {
        const category = PERIODIC_TABLE[element]?.category;
        return category === 'lanthanide' || category === 'actinide';
      });
    });
    if (rareEarthCompounds.length >= 1) this.unlockAchievement('rare_earth');

    // Noble gases
    const nobleGasElements = Object.keys(PERIODIC_TABLE).filter(id => PERIODIC_TABLE[id].category === 'noble');
    const usedNobleGases = this.gameState.discoveredCompounds.filter(compound => {
      const reaction = REACTIONS_DB[compound];
      return reaction && reaction.inputs.some(element => PERIODIC_TABLE[element]?.category === 'noble');
    }).length;
    if (usedNobleGases >= nobleGasElements.length) this.unlockAchievement('noble_gases');

    // Acids
    const acidCompounds = ['HCl', 'H3PO4', 'H2SO4', 'HNO3', 'H2S'].filter(compound => this.gameState.discoveredCompounds.includes(compound));
    if (acidCompounds.length >= 5) this.unlockAchievement('acid_expert');

    // Oxides
    const oxideCompounds = this.gameState.discoveredCompounds.filter(compound => compound.includes('O'));
    if (oxideCompounds.length >= 20) this.unlockAchievement('oxide_master');
  }

  unlockAchievement(id) {
    if (this.gameState.unlockAchievement(id)) {
      const achievement = ACHIEVEMENTS_DB[id];
      setTimeout(() => {
        this.uiManager.showFactModal(`Achievement Unlocked!`, `${achievement.name}: ${achievement.description}`);
      }, 1000);
    }
  }
}

