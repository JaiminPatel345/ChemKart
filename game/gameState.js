// Game State Management
class GameState {
  constructor() {
    this.coins = 25;
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
    this.hasSeenTutorial = false;
    
    // Timer and order management
    this.currentOrderTimer = null;
    this.orderTimeLimit = 120; // 2 minutes in seconds
    this.orderStartTime = null;
    this.orderExpired = false;
    
    // Compound tracking
    this.compoundTracker = new CompoundTracker();
  }

  getInitialUnlockedItems() {
    const sortedElements = Object.keys(PERIODIC_TABLE)
    .sort((a, b) => PERIODIC_TABLE[a].number - PERIODIC_TABLE[b].number)
    .slice(0, 20);

    return [...sortedElements, 'Flask', 'Bunsen Burner'];
  }

  save() {
    // Save compound tracker state
    this.compoundTracker.save();
    
    // Create a copy without the compound tracker for localStorage
    const saveData = { ...this };
    delete saveData.compoundTracker;
    delete saveData.currentOrderTimer;
    delete saveData.orderStartTime;
    
    localStorage.setItem('chemKart', JSON.stringify(saveData));
  }

  load() {
    const savedState = localStorage.getItem('chemKart');
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
      this.hasSeenTutorial = this.hasSeenTutorial || false;
      
      // Initialize timer properties
      this.currentOrderTimer = null;
      this.orderTimeLimit = this.orderTimeLimit || 120;
      this.orderStartTime = null;
      this.orderExpired = false;
      
      // Load compound tracker
      this.compoundTracker = new CompoundTracker();
      this.compoundTracker.load();
    }
  }

  reset() {
    localStorage.removeItem('chemKart');
    localStorage.removeItem('compoundTracker');
    window.location.reload();
  }

  addCoins(amount) {
    this.coins = Math.max(0, this.coins + amount);
    this.save();
    
    // Update UI stats when coins change
    if (window.gameModules && window.gameModules.uiManager) {
      window.gameModules.uiManager.updateStats();
    }
    
    // Update workbench state when coins change (for hint button state)
    if (window.gameModules && window.gameModules.updateWorkbenchState) {
      window.gameModules.updateWorkbenchState();
    }
  }

  addXP(amount) {
    this.xp = Math.max(0, this.xp + amount);
    const requiredXP = 50 * this.level; // LEVEL_UP_XP_BASE * level
    if (this.xp >= requiredXP && this.level < 15) {
      this.levelUp();
    }
    this.save();
    
    // Update UI stats when XP changes
    if (window.gameModules && window.gameModules.uiManager) {
      window.gameModules.uiManager.updateStats();
    }
  }

  levelUp() {
    this.level++;
    this.xp = 0;
    this.unlockNewItems();
    this.save();
    
    // Trigger UI updates for new level
    if (window.gameModules && window.gameModules.uiManager) {
      window.gameModules.uiManager.updateStats();
      window.gameModules.uiManager.updateInventory();
      window.gameModules.uiManager.updateToolsSection();
    }
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

  // Timer management methods
  startOrderTimer() {
    this.orderStartTime = Date.now();
    this.orderExpired = false;
    this.currentOrderTimer = setInterval(() => {
      this.updateOrderTimer();
    }, 1000);
  }

  updateOrderTimer() {
    if (!this.orderStartTime) return;
    
    const elapsed = Math.floor((Date.now() - this.orderStartTime) / 1000);
    const remaining = this.orderTimeLimit - elapsed;
    
    if (remaining <= 0) {
      this.orderExpired = true;
      this.stopOrderTimer();
      this.handleOrderExpired();
    }
    
    // Update UI timer display
    if (window.gameModules && window.gameModules.uiManager) {
      window.gameModules.uiManager.updateOrderTimer(remaining);
    }
  }

  stopOrderTimer() {
    if (this.currentOrderTimer) {
      clearInterval(this.currentOrderTimer);
      this.currentOrderTimer = null;
    }
  }

  handleOrderExpired() {
    // Deduct XP for missing the order
    const xpPenalty = Math.max(5, Math.floor(this.level * 2));
    this.addXP(-xpPenalty);
    
    // Hide timer and skip button
    if (window.gameModules && window.gameModules.domElements) {
      const domElements = window.gameModules.domElements;
      if (domElements.orderTimer) {
        domElements.orderTimer.style.display = 'none';
      }
      if (domElements.skipOrderBtn) {
        domElements.skipOrderBtn.style.display = 'none';
      }
    }
    
    // Show expired popup
    if (window.gameModules && window.gameModules.uiManager) {
      window.gameModules.uiManager.showOrderExpiredPopup(xpPenalty);
    }
    
    // Get new order after a delay
    setTimeout(() => {
      if (window.gameModules && window.gameModules.getNewCustomerRequest) {
        window.gameModules.getNewCustomerRequest();
      }
    }, 3000);
  }

  // Skip order method
  skipOrder() {
    if (this.coins >= 10) {
      this.addCoins(-10);
      this.stopOrderTimer();
      
      // Hide timer and skip button
      if (window.gameModules && window.gameModules.domElements) {
        const domElements = window.gameModules.domElements;
        if (domElements.orderTimer) {
          domElements.orderTimer.style.display = 'none';
        }
        if (domElements.skipOrderBtn) {
          domElements.skipOrderBtn.style.display = 'none';
        }
      }
      
      // Show skip confirmation
      if (window.gameModules && window.gameModules.uiManager) {
        window.gameModules.uiManager.showOrderSkippedPopup();
      }
      
      // Get new order after a delay
      setTimeout(() => {
        if (window.gameModules && window.gameModules.getNewCustomerRequest) {
          window.gameModules.getNewCustomerRequest();
        }
      }, 2000);
      
      return true;
    }
    return false;
  }

  // Get random compound using tracker
  getRandomCompoundForLevel(level) {
    const compoundId = this.compoundTracker.getRandomCompound(level);
    
    // If no compounds available for this level, try lower levels
    if (!compoundId && level > 1) {
      for (let lowerLevel = level - 1; lowerLevel >= 1; lowerLevel--) {
        const lowerCompound = this.compoundTracker.getRandomCompound(lowerLevel);
        if (lowerCompound) {
          return lowerCompound;
        }
      }
    }
    
    return compoundId;
  }
}
