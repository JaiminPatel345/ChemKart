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

    // Use new compounds database if available, fallback to old reactions
    const reactionsToCheck = typeof COMPOUNDS_DB !== 'undefined' ? COMPOUNDS_DB : REACTIONS_DB;

    for (const compoundId in reactionsToCheck) {
      const reaction = reactionsToCheck[compoundId];
      const requiredElements = reaction.inputs.slice().sort();

      if (this.arraysEqual(currentElements, requiredElements)) {
        const conditionsMet = reaction.conditions.every(cond => {
          if (cond === 'heat') return currentTools.includes('Bunsen Burner');
          if (cond === 'mixing') return currentTools.includes('Flask') || currentTools.includes('Beaker');
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
      
      // Stop the timer for successful completion
      this.gameState.stopOrderTimer();
      
      // Hide timer and skip button
      if (this.dom.orderTimer) {
        this.dom.orderTimer.style.display = 'none';
      }
      if (this.dom.skipOrderBtn) {
        this.dom.skipOrderBtn.style.display = 'none';
      }
      
      // Update UI stats after level up
      this.uiManager.updateStats();

      if (!this.gameState.completedRequests.includes(compoundId)) {
        this.gameState.completedRequests.push(compoundId);
      }

      // Create success particles
      window.gameModules.animationManager.createSuccessParticles();

    } else {
      const reactionsToCheck = typeof COMPOUNDS_DB !== 'undefined' ? COMPOUNDS_DB : REACTIONS_DB;
      const correctName = reactionsToCheck[this.gameState.currentCustomerRequest]?.name || 'something else';
      this.dom.customerRequest.textContent = `This is ${reaction.name}, but I asked for ${correctName}...`;
      this.gameState.addCoins(Math.floor(reaction.reward / 4));
      this.gameState.addXP(5);
      this.gameState.correctStreak = 0;
    }

    this.uiManager.showFactModal(`Success! You created ${reaction.name}!`, reaction.fact);
    window.gameModules.clearWorkbench();

    // Check for level up achievements
    window.gameModules.achievementManager.checkAllAchievements();

    // Add a longer delay to prevent immediate popup transition
    setTimeout(() => window.gameModules.getNewCustomerRequest(), 5000);
  }

  handleFailedReaction() {
    this.gameState.correctStreak = 0;
    const reactionsToCheck = typeof COMPOUNDS_DB !== 'undefined' ? COMPOUNDS_DB : REACTIONS_DB;
    const originalRequestName = reactionsToCheck[this.gameState.currentCustomerRequest]?.name || 'something';
    
    // Check if user has correct elements but missing equipment
    const currentElements = window.gameModules.workbenchContents.elements.slice().sort();
    const currentTools = window.gameModules.workbenchContents.tools;
    const targetReaction = reactionsToCheck[this.gameState.currentCustomerRequest];
    
    if (targetReaction) {
      const requiredElements = targetReaction.inputs.slice().sort();
      
      if (this.arraysEqual(currentElements, requiredElements)) {
        // User has correct elements, check what equipment is missing
        const missingConditions = [];
        
        if (targetReaction.conditions.includes('heat') && !currentTools.includes('Bunsen Burner')) {
          missingConditions.push('heat');
        }
        if (targetReaction.conditions.includes('mixing') && !currentTools.includes('Flask') && !currentTools.includes('Beaker')) {
          missingConditions.push('mixing');
        }
        
        if (missingConditions.length > 0) {
          let hintMessage = "You have the right elements, but you need: ";
          if (missingConditions.includes('heat')) {
            hintMessage += "🔥 heat (Bunsen Burner) ";
          }
          if (missingConditions.includes('mixing')) {
            hintMessage += "🧪 mixing equipment (Flask or Beaker) ";
          }
          hintMessage += "to complete this reaction!";
          
          // Create a styled hint message
          const hintDiv = document.createElement('div');
          hintDiv.className = 'equipment-hint';
          if (missingConditions.includes('heat')) {
            hintDiv.classList.add('heat');
          } else {
            hintDiv.classList.add('mixing');
          }
          hintDiv.textContent = hintMessage;
          
          // Clear previous content and add the hint
          this.dom.customerRequest.innerHTML = '';
          this.dom.customerRequest.appendChild(hintDiv);
        } else {
          this.dom.customerRequest.textContent = "That doesn't seem right. Try again!";
        }
      } else {
        this.dom.customerRequest.textContent = "That doesn't seem right. Try again!";
      }
    } else {
      this.dom.customerRequest.textContent = "That doesn't seem right. Try again!";
    }

    this.dom.gameContainer.classList.add('shake');
    window.gameModules.animationManager.createExplosionParticles();

    setTimeout(() => {
      this.dom.gameContainer.classList.remove('shake');
      this.dom.customerRequest.textContent = `Hello! Can you please make me some ${originalRequestName}?`;
      window.gameModules.clearWorkbench();
    }, 3000);
  }
}
