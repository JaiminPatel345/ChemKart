// Reaction Processing Logic
class ReactionProcessor {
  constructor(gameState, uiManager, domElements) {
    this.gameState = gameState;
    this.uiManager = uiManager;
    this.dom = domElements;
  }

  checkReaction(workbenchContents) {
    const currentElements = workbenchContents.elements.slice().sort();
    const currentTools = workbenchContents.tools;

    for (const compoundId in REACTIONS_DB) {
      const reaction = REACTIONS_DB[compoundId];
      const requiredElements = reaction.inputs.slice().sort();

      if (this.arraysEqual(currentElements, requiredElements)) {
        const conditionsMet = reaction.conditions.every(cond => {
          if (cond === 'heat') return currentTools.includes('Bunsen Burner');
          return false;
        });

        if (conditionsMet && reaction.level <= this.gameState.level) {
          this.handleSuccessfulReaction(compoundId, reaction);
          return;
        }
      }
    }

    this.handleFailedReaction();
  }

  arraysEqual(a, b) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  }

  handleSuccessfulReaction(compoundId, reaction) {
    // Add to discovered compounds
    this.gameState.addDiscoveredCompound(compoundId);

    if (this.gameState.currentCustomerRequest === compoundId) {
      this.dom.customerRequest.textContent = "Perfect! Thank you so much!";
      this.gameState.addCoins(reaction.reward);
      this.gameState.addXP(reaction.reward);
      this.gameState.correctStreak++;
      this.gameState.totalRequests++;
      this.gameState.reactionsWithoutHints++;

      if (!this.gameState.completedRequests.includes(compoundId)) {
        this.gameState.completedRequests.push(compoundId);
      }

      // Create success particles
      window.gameModules.animationManager.createSuccessParticles();

    } else {
      const correctName = REACTIONS_DB[this.gameState.currentCustomerRequest]?.name || 'something else';
      this.dom.customerRequest.textContent = `This is ${reaction.name}, but I asked for ${correctName}...`;
      this.gameState.addCoins(Math.floor(reaction.reward / 4));
      this.gameState.addXP(5);
      this.gameState.correctStreak = 0;
    }

    this.uiManager.showFactModal(`Success! You created ${reaction.name}!`, reaction.fact);
    window.gameModules.clearWorkbench();

    // Check for level up achievements
    window.gameModules.achievementManager.checkAllAchievements();

    setTimeout(() => window.gameModules.getNewCustomerRequest(), 3000);
  }

  handleFailedReaction() {
    this.gameState.correctStreak = 0;
    const originalRequestName = REACTIONS_DB[this.gameState.currentCustomerRequest]?.name || 'something';
    this.dom.customerRequest.textContent = "That doesn't seem right. Try again!";

    this.dom.gameContainer.classList.add('shake');
    window.gameModules.animationManager.createExplosionParticles();

    setTimeout(() => {
      this.dom.gameContainer.classList.remove('shake');
      this.dom.customerRequest.textContent = `Hello! Can you please make me some ${originalRequestName}?`;
      window.gameModules.clearWorkbench();
    }, 2000);
  }
}
