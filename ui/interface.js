// UI Interface Management
class UIManager {
  constructor(gameState, domElements) {
    this.gameState = gameState;
    this.dom = domElements;
    this.currentFilter = 'all';
    this.currentPage = 1;
    this.itemsPerPage = 20;
  }

  updateStats() {
    this.dom.coinsStat.textContent = this.gameState.coins.toLocaleString();
    this.dom.levelStat.textContent = this.gameState.level;
    this.updateXPDisplay();

    const unlockedElementCount = Object.keys(PERIODIC_TABLE)
    .filter(id => this.gameState.unlockedItems.includes(id)).length;
    this.dom.unlockedElementsStat.textContent = unlockedElementCount;
    this.dom.totalElementsStat.textContent = Object.keys(PERIODIC_TABLE).length;
  }

  updateXPDisplay() {
    const xpStat = document.getElementById('xp-stat');
    const currentXP = this.gameState.xp;
    const requiredXP = 50 * this.gameState.level;
    const progressPercentage = Math.min((currentXP / requiredXP) * 100, 100);
    
    // Update the level display to show XP
    this.dom.levelStat.textContent = `${this.gameState.level} (${currentXP}/${requiredXP})`;
    
    // Create or update progress bar
    let progressContainer = xpStat.querySelector('.xp-progress-container');
    if (!progressContainer) {
      progressContainer = document.createElement('div');
      progressContainer.className = 'xp-progress-container';
      progressContainer.innerHTML = `
        <div class="xp-info">Level ${this.gameState.level} Progress</div>
        <div class="xp-progress-bar">
          <div class="xp-progress-fill"></div>
        </div>
        <div class="xp-info">${currentXP} / ${requiredXP} XP</div>
      `;
      xpStat.appendChild(progressContainer);
    } else {
      const progressFill = progressContainer.querySelector('.xp-progress-fill');
      const xpInfoElements = progressContainer.querySelectorAll('.xp-info');
      
      progressFill.style.width = `${progressPercentage}%`;
      xpInfoElements[0].textContent = `Level ${this.gameState.level} Progress`;
      xpInfoElements[1].textContent = `${currentXP} / ${requiredXP} XP`;
    }
  }

  updateToolsSection() {
    this.dom.toolsContainer.innerHTML = '';

    Object.keys(TOOLS_DB).forEach(toolId => {
      const tool = TOOLS_DB[toolId];
      const isUnlocked = this.gameState.unlockedItems.includes(toolId);

      if (isUnlocked) {
        const toolEl = document.createElement('div');
        toolEl.className = 'tool-item';
        toolEl.draggable = true;
        toolEl.dataset.itemId = toolId;

        const icon = document.createElement('div');
        icon.textContent = tool.icon;

        const name = document.createElement('span');
        name.textContent = tool.name;

        toolEl.appendChild(icon);
        toolEl.appendChild(name);
        this.dom.toolsContainer.appendChild(toolEl);

        // Tooltip events
        toolEl.addEventListener('mouseenter', (e) => {
          showTooltip(e.currentTarget, 'Double-click or drag to add to process');
        });
        toolEl.addEventListener('mouseleave', hideTooltip);
      }
    });
  }

  getFilteredItems() {
    const searchTerm = this.dom.searchInput.value.toLowerCase().trim();
    let allItems = Object.keys(PERIODIC_TABLE); // Only elements in main inventory

    // Apply category filter
    if (this.currentFilter !== 'all') {
      allItems = allItems.filter(id => PERIODIC_TABLE[id] && PERIODIC_TABLE[id].category === this.currentFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const exactMatches = allItems.filter(id => {
        const item = PERIODIC_TABLE[id];
        return item.symbol?.toLowerCase() === searchTerm || item.name.toLowerCase() === searchTerm;
      });

      const partialMatches = allItems.filter(id => {
        if (exactMatches.includes(id)) return false;
        const item = PERIODIC_TABLE[id];
        return item.name.toLowerCase().includes(searchTerm) ||
            item.symbol?.toLowerCase().includes(searchTerm) ||
            (item.category && item.category.toLowerCase().includes(searchTerm));
      });

      allItems = [...exactMatches, ...partialMatches];
    }

    // Sort by atomic number
    allItems.sort((a, b) => PERIODIC_TABLE[a].number - PERIODIC_TABLE[b].number);
    return allItems;
  }

  updateInventory() {
    const filteredItems = this.getFilteredItems();
    const maxPages = Math.ceil(filteredItems.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, endIndex);

    this.dom.inventoryItemsContainer.innerHTML = '';

    currentItems.forEach(itemId => {
      const itemData = PERIODIC_TABLE[itemId];
      if (!itemData) return;

      const isUnlocked = this.gameState.unlockedItems.includes(itemId);
      const itemEl = document.createElement('div');
      itemEl.className = 'inventory-item';
      itemEl.dataset.itemId = itemId;

      if (itemData.category) {
        itemEl.dataset.category = itemData.category;
      }

      if (!isUnlocked) {
        itemEl.classList.add('locked');
      } else {
        itemEl.draggable = true;
        // Tooltip events
        itemEl.addEventListener('mouseenter', (e) => {
          showTooltip(e.currentTarget, 'Double-click or drag to add to process');
        });
        itemEl.addEventListener('mouseleave', hideTooltip);
      }

      const icon = document.createElement('div');
      icon.textContent = itemData.symbol;

      const name = document.createElement('span');
      name.textContent = itemData.name;

      itemEl.appendChild(icon);
      itemEl.appendChild(name);
      this.dom.inventoryItemsContainer.appendChild(itemEl);
    });

    // Update pagination
    this.dom.pageInfo.textContent = `Page ${this.currentPage} of ${Math.max(1, maxPages)}`;
    this.dom.prevPageBtn.disabled = this.currentPage <= 1;
    this.dom.nextPageBtn.disabled = this.currentPage >= maxPages;

    // Update tools section
    this.updateToolsSection();
  }

  updateAchievements() {
    this.dom.achievementsList.innerHTML = '';
    for (const id in ACHIEVEMENTS_DB) {
      const achievement = ACHIEVEMENTS_DB[id];
      const el = document.createElement('div');
      el.className = 'achievement';
      if (this.gameState.unlockedAchievements.includes(id)) {
        el.classList.add('unlocked');
      }
      el.innerHTML = `<h3>${achievement.name}</h3><p>${achievement.description}</p>`;
      this.dom.achievementsList.appendChild(el);
    }
  }

  displayCodex(activeTab = 'elements') {
    this.dom.codexContent.innerHTML = '';

    switch(activeTab) {
      case 'elements':
        this.dom.codexContent.innerHTML = '<h3>Periodic Table Elements</h3>';
        const categories = ['metal', 'nonmetal', 'noble', 'transition', 'metalloid', 'lanthanide', 'actinide'];
        categories.forEach(category => {
          const elements = Object.values(PERIODIC_TABLE)
          .filter(e => e.category === category)
          .sort((a, b) => a.number - b.number);

          if (elements.length > 0) {
            this.dom.codexContent.innerHTML += `<h4 style="color: var(--accent-color); margin-top: 15px;">${category.charAt(0).toUpperCase() + category.slice(1)}s</h4>`;
            elements.forEach(element => {
              const unlocked = this.gameState.unlockedItems.includes(element.symbol);
              this.dom.codexContent.innerHTML += `<p style="opacity: ${unlocked ? '1' : '0.5'}">${unlocked ? '' : '🔒 '}<strong>${element.symbol} - ${element.name}</strong> (Atomic #${element.number})</p>`;
            });
          }
        });
        break;

      case 'compounds':
        this.dom.codexContent.innerHTML = '<h3>Discovered Compounds</h3>';
        const compoundsToShow = typeof COMPOUNDS_DB !== 'undefined' ? COMPOUNDS_DB : REACTIONS_DB;
        Object.entries(compoundsToShow).forEach(([formula, compound]) => {
          const discovered = this.gameState.discoveredCompounds.includes(formula);
          this.dom.codexContent.innerHTML += `<p style="opacity: ${discovered ? '1' : '0.3'}">${discovered ? '✓' : '?'} <strong>${compound.name} (${formula})</strong>: ${discovered ? compound.fact : 'Compound not yet discovered'}</p>`;
        });
        break;

      case 'tools':
        this.dom.codexContent.innerHTML = '<h3>Laboratory Tools</h3>';
        Object.values(TOOLS_DB).forEach(tool => {
          const unlocked = this.gameState.unlockedItems.includes(Object.keys(TOOLS_DB).find(key => TOOLS_DB[key] === tool));
          this.dom.codexContent.innerHTML += `<p style="opacity: ${unlocked ? '1' : '0.5'}">${unlocked ? '' : '🔒 '}<strong>${tool.name}</strong>: Essential laboratory equipment</p>`;
        });
        break;
    }
  }

  showModal(modal, show) {
    modal.classList.toggle('visible', show);
  }

  showFactModal(title, text) {
    this.dom.factTitle.textContent = title;
    this.dom.factText.textContent = text;
    this.showModal(this.dom.factModal, true);
  }

  showHintModal(compoundId) {
    if (!compoundId) return;
    
    // Check if player has enough coins
    if (this.gameState.coins < 5) {
      this.dom.hintContent.innerHTML = `
        <div class="hint-content">
          <h4>💡 Hint Unavailable</h4>
          <p>You need 5 coins to get a hint.</p>
          <p>Current coins: ${this.gameState.coins}</p>
          <p><em>Complete reactions to earn more coins!</em></p>
        </div>`;
      this.showModal(this.dom.hintModal, true);
      return;
    }

    const reaction = COMPOUNDS_DB[compoundId] || REACTIONS_DB[compoundId];
    const compound = reaction.name;
    let hintHTML = `
            <div class="hint-content">
                <h4>Target: ${compound} (${compoundId})</h4>
                <p><strong>Required Elements:</strong></p>
                <div class="hint-ingredients">
        `;

    // Count each element
    const elementCounts = {};
    reaction.inputs.forEach(element => {
      elementCounts[element] = (elementCounts[element] || 0) + 1;
    });

    // Display elements with counts
    Object.entries(elementCounts).forEach(([element, count]) => {
      const elementName = PERIODIC_TABLE[element]?.name || TOOLS_DB[element]?.name || element;
      hintHTML += `<span class="hint-ingredient">${element} (${elementName}) × ${count}</span>`;
    });

    hintHTML += `</div>`;

    if (reaction.conditions.length > 0) {
      hintHTML += `<p><strong>Required Conditions:</strong></p>`;
      reaction.conditions.forEach(condition => {
        if (condition === 'heat') {
          hintHTML += `<div class="hint-ingredients"><span class="hint-ingredient">🔥 Heat (Bunsen Burner)</span></div>`;
        }
        if (condition === 'mixing') {
          hintHTML += `<div class="hint-ingredients"><span class="hint-ingredient">🧪 Mixing (Flask or Beaker)</span></div>`;
        }
      });
    }

    hintHTML += `<p><em>Tip: You can double-click items to add them to the workbench!</em></div>`;

    this.dom.hintContent.innerHTML = hintHTML;
    this.showModal(this.dom.hintModal, true);
    
    // Deduct coins for hint
    this.gameState.addCoins(-5);
    this.gameState.hintsUsed++;
    this.gameState.save();
  }

  // Timer display methods
  updateOrderTimer(remainingSeconds) {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Update timer display
    if (this.dom.orderTimer) {
      this.dom.orderTimer.textContent = timeString;
      
      // Change color based on time remaining
      if (remainingSeconds <= 30) {
        this.dom.orderTimer.style.color = '#e74c3c'; // Red
      } else if (remainingSeconds <= 60) {
        this.dom.orderTimer.style.color = '#f39c12'; // Orange
      } else {
        this.dom.orderTimer.style.color = '#27ae60'; // Green
      }
    }
  }

  showOrderExpiredPopup(xpPenalty) {
    const popupHTML = `
      <div class="order-expired-popup">
        <div class="popup-content">
          <h3>⏰ Oops! You missed it!</h3>
          <p>The customer got tired of waiting and left.</p>
          <p><strong>XP Penalty: -${xpPenalty}</strong></p>
          <p>Try to complete orders faster next time!</p>
        </div>
      </div>
    `;
    
    // Remove existing popup if any
    const existingPopup = document.querySelector('.order-expired-popup');
    if (existingPopup) {
      existingPopup.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      const popup = document.querySelector('.order-expired-popup');
      if (popup) {
        popup.remove();
      }
    }, 3000);
  }

  showOrderSkippedPopup() {
    const popupHTML = `
      <div class="order-skipped-popup">
        <div class="popup-content">
          <h3>⏭️ Order Skipped!</h3>
          <p>You paid 10 coins to skip this order.</p>
          <p>New customer incoming...</p>
        </div>
      </div>
    `;
    
    // Remove existing popup if any
    const existingPopup = document.querySelector('.order-skipped-popup');
    if (existingPopup) {
      existingPopup.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    
    // Auto-remove after 2 seconds
    setTimeout(() => {
      const popup = document.querySelector('.order-skipped-popup');
      if (popup) {
        popup.remove();
      }
    }, 2000);
  }
}

// Tooltip logic (global, outside class)
let tooltipDiv = null;
function showTooltip(target, text) {
  hideTooltip();
  tooltipDiv = document.createElement('div');
  tooltipDiv.className = 'custom-tooltip';
  tooltipDiv.textContent = text;
  document.body.appendChild(tooltipDiv);
  const rect = target.getBoundingClientRect();
  // Default: above
  let top = rect.top + window.scrollY - tooltipDiv.offsetHeight - 8;
  let left = rect.left + window.scrollX + rect.width / 2 - tooltipDiv.offsetWidth / 2;
  // If not enough space above, show below
  if (top < window.scrollY) {
    top = rect.bottom + window.scrollY + 8;
  }
  // Prevent going off left edge
  if (left < 4) left = 4;
  // Prevent going off right edge
  const maxLeft = window.scrollX + document.documentElement.clientWidth - tooltipDiv.offsetWidth - 4;
  if (left > maxLeft) left = maxLeft;
  tooltipDiv.style.left = left + 'px';
  tooltipDiv.style.top = top + 'px';
  setTimeout(() => {
    if (tooltipDiv) tooltipDiv.classList.add('visible');
  }, 10);
}
function hideTooltip() {
  if (tooltipDiv) {
    tooltipDiv.classList.remove('visible');
    setTimeout(() => {
      if (tooltipDiv && tooltipDiv.parentNode) tooltipDiv.parentNode.removeChild(tooltipDiv);
      tooltipDiv = null;
    }, 150);
  }
}
