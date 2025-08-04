// Game State Management
class GameState {
  constructor() {
    this.coins = 0;
    this.level = 1;
    this.xp = 0;
    this.unlockedItems = this.getInitialUnlockedItems();
    this.unlockedAchievements = [];
    this.completedRequests = [];
    this.currentCustomerRequest = null;
    this.lastCustomerRequest = null;
    this.correctStreak = 0;
    this.totalRequests = 0;
    this.discoveredCompounds = [];
    this.hintsUsed = 0;
    this.reactionsWithoutHints = 0;
  }

  getInitialUnlockedItems() {
    const sortedElements = Object.keys(PERIODIC_TABLE)
    .sort((a, b) => PERIODIC_TABLE[a].number - PERIODIC_TABLE[b].number)
    .slice(0, 20);

    return [...sortedElements, 'Flask', 'Bunsen Burner'];
  }

  save() {
    localStorage.setItem('chemShopKeeperEnhanced', JSON.stringify(this));
  }

  load() {
    const savedState = localStorage.getItem('chemShopKeeperEnhanced');
    if (savedState) {
      const loadedState = JSON.parse(savedState);
      Object.assign(this, loadedState);

      // Ensure new properties exist
      this.discoveredCompounds = this.discoveredCompounds || [];
      this.correctStreak = this.correctStreak || 0;
      this.totalRequests = this.totalRequests || 0;
      this.lastCustomerRequest = this.lastCustomerRequest || null;
      this.hintsUsed = this.hintsUsed || 0;
      this.reactionsWithoutHints = this.reactionsWithoutHints || 0;
    }
  }

  reset() {
    localStorage.removeItem('chemShopKeeperEnhanced');
    window.location.reload();
  }

  addCoins(amount) {
    this.coins += amount;
    this.save();
  }

  addXP(amount) {
    this.xp += amount;
    const requiredXP = 50 * this.level; // LEVEL_UP_XP_BASE * level
    if (this.xp >= requiredXP && this.level < 15) {
      this.levelUp();
    }
    this.save();
  }

  levelUp() {
    this.level++;
    this.xp = 0;
    this.unlockNewItems();
    this.save();
  }

  unlockNewItems() {
    // Unlock elements
    const elementsToUnlock = Object.keys(PERIODIC_TABLE)
    .filter(id => PERIODIC_TABLE[id].unlockLevel === this.level && !this.unlockedItems.includes(id));

    // Unlock tools
    const toolsToUnlock = Object.keys(TOOLS_DB)
    .filter(id => TOOLS_DB[id].unlockLevel === this.level && !this.unlockedItems.includes(id));

    this.unlockedItems.push(...elementsToUnlock, ...toolsToUnlock);
  }

  unlockAchievement(id) {
    if (!this.unlockedAchievements.includes(id)) {
      this.unlockedAchievements.push(id);
      this.save();
      return true;
    }
    return false;
  }

  addDiscoveredCompound(compoundId) {
    if (!this.discoveredCompounds.includes(compoundId)) {
      this.discoveredCompounds.push(compoundId);
      this.save();
    }
  }
}
