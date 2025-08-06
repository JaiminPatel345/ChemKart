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

    const unlockedElementCount = Object.keys(PERIODIC_TABLE)
    .filter(id => this.gameState.unlockedItems.includes(id)).length;
    this.dom.unlockedElementsStat.textContent = unlockedElementCount;
    this.dom.totalElementsStat.textContent = Object.keys(PERIODIC_TABLE).length;
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
        Object.entries(REACTIONS_DB).forEach(([formula, compound]) => {
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

    const reaction = REACTIONS_DB[compoundId];
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
      });
    }

    hintHTML += `<p><em>Tip: You can double-click items to add them to the workbench!</em></div>`;

    this.dom.hintContent.innerHTML = hintHTML;
    this.showModal(this.dom.hintModal, true);

    // Deduct coins for hint
    if (this.gameState.coins >= 5) {
      this.gameState.addCoins(-5);
      this.gameState.hintsUsed++;
      this.gameState.reactionsWithoutHints = 0;
      this.updateStats();
      this.dom.hintContent.innerHTML += `<p style="color: #e74c3c; font-size: 0.9em; margin-top: 10px;">💰 Hint cost: 5 coins</p>`;
    }
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
  tooltipDiv.style.left = rect.left + window.scrollX + rect.width / 2 - tooltipDiv.offsetWidth / 2 + 'px';
  tooltipDiv.style.top = rect.top + window.scrollY - 32 + 'px';
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
