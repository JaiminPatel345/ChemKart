// Main Game Controller
document.addEventListener('DOMContentLoaded', () => {
  // Create HTML for hint modal
  const hintModalHTML = `
    <div id="hint-modal" class="modal">
        <div class="modal-content">
            <h2>💡 Reaction Hint</h2>
            <div id="hint-content"></div>
            <button id="close-hint-modal">Got it!</button>
        </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', hintModalHTML);

  // DOM Element References
  const domElements = {
    gameContainer: document.getElementById('game-container'),
    coinsStat: document.getElementById('coins-stat'),
    levelStat: document.getElementById('level-stat'),
    unlockedElementsStat: document.getElementById('unlocked-elements-stat'),
    totalElementsStat: document.getElementById('total-elements-stat'),
    inventoryToolbar: document.getElementById('inventory-toolbar'),
    inventoryItemsContainer: document.getElementById('inventory-items-container'),
    toolsContainer: document.getElementById('tools-container'),
    searchInput: document.getElementById('search-inventory'),
    workbenchZone: document.getElementById('workbench-zone'),
    customerRequest: document.getElementById('customer-request'),
    speechBubble: document.getElementById('speech-bubble'),
    equationDisplay: document.getElementById('equation-display'),
    toolDisplay: document.getElementById('tool-display'),
    orderTimer: document.getElementById('order-timer'),
    skipOrderBtn: document.getElementById('skip-order-btn'),

    // Filter and pagination
    filterBtns: document.querySelectorAll('.filter-btn'),
    prevPageBtn: document.getElementById('prev-page'),
    nextPageBtn: document.getElementById('next-page'),
    pageInfo: document.getElementById('page-info'),

    // Modals
    starterMenuModal: document.getElementById('starter-menu-modal'),
    startGameBtn: document.getElementById('start-game-btn'),
    factModal: document.getElementById('fact-modal'),
    factTitle: document.getElementById('fact-title'),
    factText: document.getElementById('fact-text'),
    closeFactModalBtn: document.getElementById('close-fact-modal'),
    codexModal: document.getElementById('codex-modal'),
    codexContent: document.getElementById('codex-content'),
    codexTabs: document.querySelectorAll('.tab-btn'),
    closeCodexModalBtn: document.getElementById('close-codex-modal'),
    resetConfirmModal: document.getElementById('reset-confirm-modal'),
    achievementsSidebar: document.getElementById('achievements-sidebar'),
    achievementsList: document.getElementById('achievements-list'),
    hintModal: document.getElementById('hint-modal'),
    hintContent: document.getElementById('hint-content'),
    closeHintModalBtn: document.getElementById('close-hint-modal'),

    // Buttons
    tutorialBtn: document.getElementById('tutorial-btn'),
    achievementsBtn: document.getElementById('achievements-btn'),
    codexBtn: document.getElementById('codex-btn'),
    resetBtn: document.getElementById('reset-btn'),
    processBtn: document.getElementById('process-btn'),
    clearBtn: document.getElementById('clear-btn'),
    hintBtn: document.getElementById('hint-btn'),
    confirmResetBtn: document.getElementById('confirm-reset-btn'),
    cancelResetBtn: document.getElementById('cancel-reset-btn'),

    // Canvas
    canvas: document.getElementById('reaction-canvas'),
    ctx: document.getElementById('reaction-canvas').getContext('2d')
  };

  // Initialize canvas
  domElements.canvas.width = 500;
  domElements.canvas.height = 320;

  // Combine all items databases
  const ITEMS_DB = { ...PERIODIC_TABLE, ...TOOLS_DB };
  
  // Use new compounds database if available, fallback to old reactions
  const REACTIONS_DB_TO_USE = typeof COMPOUNDS_DB !== 'undefined' ? COMPOUNDS_DB : REACTIONS_DB;

  // Game instances
  const gameState = new GameState();
  const uiManager = new UIManager(gameState, domElements);
  const reactionProcessor = new ReactionProcessor(gameState, uiManager, domElements);
  const achievementManager = new AchievementManager(gameState, uiManager);
  const animationManager = new AnimationManager(domElements.canvas, domElements.ctx);

  // Workbench state
  let workbenchContents = { elements: [], tools: [] };
  let draggedItem = null;

  // Initialize game
  function init() {
    gameState.load();
    uiManager.updateStats();
    uiManager.updateInventory();
    uiManager.updateAchievements();
    uiManager.displayCodex();
    updateWorkbenchState();
    setupEventListeners();
    animationManager.start();
    
    // Show starter menu for new players
    if (!gameState.hasSeenTutorial) {
      showStarterMenu();
    } else {
      getNewCustomerRequest();
    }
    
    // Ensure stats are updated after initialization
    setTimeout(() => {
      uiManager.updateStats();
    }, 100);
  }

// Update the setupEventListeners function in main.js

  function setupEventListeners() {
    // Fix: Add drag and drop for the new elements sidebar
    const elementsContainer = document.getElementById('inventory-items-container');
    const toolsContainer = document.getElementById('tools-container');

    // Drag and drop for elements (right sidebar)
    elementsContainer.addEventListener('dragstart', handleDragStart);
    elementsContainer.addEventListener('dblclick', handleDoubleClick);

    // Drag and drop for tools (bottom bar)
    toolsContainer.addEventListener('dragstart', handleDragStart);
    toolsContainer.addEventListener('dblclick', handleDoubleClick);

    // Drop zone (workbench)
    domElements.workbenchZone.addEventListener('dragover', handleDragOver);
    domElements.workbenchZone.addEventListener('drop', handleDrop);

    // Remove the old inventory toolbar listeners (they're not needed now)
    // domElements.inventoryToolbar.addEventListener('dragstart', handleDragStart);
    // domElements.inventoryToolbar.addEventListener('dblclick', handleDoubleClick);

    // Search and filters
    domElements.searchInput.addEventListener('input', () => uiManager.updateInventory());
    domElements.filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        domElements.filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        uiManager.currentFilter = e.target.dataset.filter;
        uiManager.currentPage = 1;
        uiManager.updateInventory();
      });
    });

    // Pagination
    domElements.prevPageBtn.addEventListener('click', () => {
      if (uiManager.currentPage > 1) {
        uiManager.currentPage--;
        uiManager.updateInventory();
      }
    });

    domElements.nextPageBtn.addEventListener('click', () => {
      const filteredItems = uiManager.getFilteredItems();
      const maxPages = Math.ceil(filteredItems.length / uiManager.itemsPerPage);
      if (uiManager.currentPage < maxPages) {
        uiManager.currentPage++;
        uiManager.updateInventory();
      }
    });

    // Modal events
    domElements.closeFactModalBtn.addEventListener('click', () => uiManager.showModal(domElements.factModal, false));
    domElements.codexBtn.addEventListener('click', () => {
      uiManager.displayCodex();
      uiManager.showModal(domElements.codexModal, true);
    });
    domElements.closeCodexModalBtn.addEventListener('click', () => uiManager.showModal(domElements.codexModal, false));
    domElements.closeHintModalBtn.addEventListener('click', () => uiManager.showModal(domElements.hintModal, false));

    // Codex tabs
    domElements.codexTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        domElements.codexTabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        uiManager.displayCodex(e.target.dataset.tab);
      });
    });

    // Game action buttons
    domElements.tutorialBtn.addEventListener('click', showStarterMenu);
    domElements.achievementsBtn.addEventListener('click', () => domElements.achievementsSidebar.classList.toggle('visible'));
    domElements.resetBtn.addEventListener('click', () => uiManager.showModal(domElements.resetConfirmModal, true));
    domElements.cancelResetBtn.addEventListener('click', () => uiManager.showModal(domElements.resetConfirmModal, false));
    domElements.confirmResetBtn.addEventListener('click', () => gameState.reset());
    domElements.processBtn.addEventListener('click', () => reactionProcessor.checkReaction(workbenchContents));
    domElements.clearBtn.addEventListener('click', clearWorkbench);
    domElements.hintBtn.addEventListener('click', () => uiManager.showHintModal(gameState.currentCustomerRequest));
    
    // Add tooltip for hint button to show cost
    domElements.hintBtn.addEventListener('mouseenter', (e) => {
      showTooltip(e.currentTarget, 'Get a hint for the current reaction (costs 5 coins)');
    });
    domElements.hintBtn.addEventListener('mouseleave', hideTooltip);

    // Skip order button
    if (domElements.skipOrderBtn) {
      domElements.skipOrderBtn.addEventListener('click', () => {
        // Show confirmation popup
        const popupHTML = `
          <div class="skip-confirmation-popup">
            <div class="popup-content">
              <h3>⏭️ Skip Order?</h3>
              <p>Are you sure you want to skip this order?</p>
              <p><strong>Cost: -10 coins</strong></p>
              <p>Current coins: ${gameState.coins}</p>
              <div class="popup-buttons">
                <button id="confirm-skip-btn" class="primary-btn">Proceed</button>
                <button id="cancel-skip-btn" class="secondary-btn">Cancel</button>
              </div>
            </div>
          </div>
        `;
        
        // Remove existing popup if any
        const existingPopup = document.querySelector('.skip-confirmation-popup');
        if (existingPopup) {
          existingPopup.remove();
        }
        
        document.body.insertAdjacentHTML('beforeend', popupHTML);
        
        // Add event listeners for popup buttons
        document.getElementById('confirm-skip-btn').addEventListener('click', () => {
          if (gameState.skipOrder()) {
            // Success - popup will be shown by skipOrder method
          } else {
            // Show insufficient coins message
            const insufficientPopup = `
              <div class="order-skipped-popup">
                <div class="popup-content">
                  <h3>💰 Not enough coins!</h3>
                  <p>You need 10 coins to skip an order.</p>
                  <p>Current coins: ${gameState.coins}</p>
                </div>
              </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', insufficientPopup);
            
            setTimeout(() => {
              const popup = document.querySelector('.order-skipped-popup');
              if (popup) {
                popup.remove();
              }
            }, 2000);
          }
          
          // Remove confirmation popup
          const popup = document.querySelector('.skip-confirmation-popup');
          if (popup) {
            popup.remove();
          }
        });
        
        document.getElementById('cancel-skip-btn').addEventListener('click', () => {
          const popup = document.querySelector('.skip-confirmation-popup');
          if (popup) {
            popup.remove();
          }
        });
      });
      
      domElements.skipOrderBtn.addEventListener('mouseenter', (e) => {
        showTooltip(e.currentTarget, 'Skip this order (costs 10 coins)');
      });
      domElements.skipOrderBtn.addEventListener('mouseleave', hideTooltip);
    }

    // Close achievements sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (!domElements.achievementsSidebar.contains(e.target) && e.target !== domElements.achievementsBtn) {
        domElements.achievementsSidebar.classList.remove('visible');
      }
    });

    // Starter menu events
    domElements.startGameBtn.addEventListener('click', startGame);

    // Header tooltips for stats
    const statDivs = document.querySelectorAll('.stats-display .stat');
    statDivs[0].addEventListener('mouseenter', (e) => {
      showTooltip(e.currentTarget, 'Coins');
    });
    statDivs[0].addEventListener('mouseleave', hideTooltip);
    
    // XP stat tooltip (level stat)
    const xpStat = document.getElementById('xp-stat');

    xpStat.addEventListener('mouseleave', hideTooltip);
    
    statDivs[2].addEventListener('mouseenter', (e) => {
      showTooltip(e.currentTarget, 'Unlocked Elements');
    });
    statDivs[2].addEventListener('mouseleave', hideTooltip);

    // Header tooltips for buttons
    domElements.tutorialBtn.addEventListener('mouseenter', (e) => {
      showTooltip(e.currentTarget, 'Show the tutorial and how to play');
    });
    domElements.tutorialBtn.addEventListener('mouseleave', hideTooltip);

    domElements.achievementsBtn.addEventListener('mouseenter', (e) => {
      showTooltip(e.currentTarget, 'View your unlocked achievements');
    });
    domElements.achievementsBtn.addEventListener('mouseleave', hideTooltip);

    domElements.codexBtn.addEventListener('mouseenter', (e) => {
      showTooltip(e.currentTarget, 'Open the Chemistry Codex (elements, compounds, tools)');
    });
    domElements.codexBtn.addEventListener('mouseleave', hideTooltip);

    domElements.resetBtn.addEventListener('mouseenter', (e) => {
      showTooltip(e.currentTarget, 'Reset all progress and start over');
    });
    domElements.resetBtn.addEventListener('mouseleave', hideTooltip);
  }


  function handleDragStart(e) {
    if ((e.target.classList.contains('inventory-item') || e.target.classList.contains('tool-item')) && !e.target.classList.contains('locked')) {
      draggedItem = e.target.dataset.itemId;
      e.target.classList.add('dragging');
      setTimeout(() => e.target.classList.remove('dragging'), 0);
    } else {
      e.preventDefault();
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    if (draggedItem) {
      addItemToWorkbench(draggedItem);
      draggedItem = null;
    }
  }

  function handleDoubleClick(e) {
    if ((e.target.classList.contains('inventory-item') || e.target.classList.contains('tool-item')) && !e.target.classList.contains('locked')) {
      const itemId = e.target.dataset.itemId;
      addItemToWorkbench(itemId);
    }
  }

  function addItemToWorkbench(itemId) {
    if (PERIODIC_TABLE[itemId]) {
      workbenchContents.elements.push(itemId);
    } else if (TOOLS_DB[itemId]) {
      if (!workbenchContents.tools.includes(itemId)) {
        workbenchContents.tools.push(itemId);
      }
    }
    updateWorkbenchState();
  }

  function updateWorkbenchState() {
    // Update equation display
    domElements.equationDisplay.innerHTML = '';
    workbenchContents.elements.forEach((el, index) => {
      const elSpan = document.createElement('span');
      elSpan.textContent = ITEMS_DB[el].symbol || ITEMS_DB[el].name;
      domElements.equationDisplay.appendChild(elSpan);
      if (index < workbenchContents.elements.length - 1) {
        const plusSpan = document.createElement('span');
        plusSpan.textContent = ' + ';
        domElements.equationDisplay.appendChild(plusSpan);
      }
    });

    // Add reaction arrow if conditions are met
    const hasHeat = workbenchContents.tools.includes('Bunsen Burner');
    const hasMixing = workbenchContents.tools.includes('Flask') || workbenchContents.tools.includes('Beaker');
    
    if (hasHeat || hasMixing) {
      const arrowSpan = document.createElement('span');
      arrowSpan.textContent = ' → ?';
      arrowSpan.className = 'reaction-arrow';
      if (hasHeat) {
        arrowSpan.classList.add('heat');
      } else {
        arrowSpan.classList.add('mixing');
      }
      domElements.equationDisplay.appendChild(arrowSpan);
    }

    // Check if user has correct elements but missing equipment
    if (gameState.currentCustomerRequest) {
      const reactionsToCheck = typeof COMPOUNDS_DB !== 'undefined' ? COMPOUNDS_DB : REACTIONS_DB;
      const targetReaction = reactionsToCheck[gameState.currentCustomerRequest];
      
      if (targetReaction) {
        const requiredElements = targetReaction.inputs.slice().sort();
        const currentElements = workbenchContents.elements.slice().sort();
        
        if (arraysEqual(currentElements, requiredElements)) {
          // User has correct elements, check what equipment is missing
          const missingConditions = [];
          
          if (targetReaction.conditions.includes('heat') && !hasHeat) {
            missingConditions.push('heat');
          }
          if (targetReaction.conditions.includes('mixing') && !hasMixing) {
            missingConditions.push('mixing');
          }
          
          if (missingConditions.length > 0) {
            // Add a warning indicator
            const warningSpan = document.createElement('span');
            warningSpan.textContent = ' ⚠️';
            warningSpan.style.color = '#f39c12';
            warningSpan.style.fontSize = '1.2em';
            warningSpan.title = 'Missing equipment: ' + missingConditions.join(', ');
            domElements.equationDisplay.appendChild(warningSpan);
          }
        }
      }
    }

    // Update tool display
    domElements.toolDisplay.innerHTML = '';
    workbenchContents.tools.forEach(toolId => {
      // Show all tools except Bunsen Burner (which is shown as heat indicator)
      if (toolId !== 'Bunsen Burner') {
        const toolIcon = document.createElement('span');
        toolIcon.className = 'tool-icon';
        toolIcon.textContent = ITEMS_DB[toolId].icon;
        toolIcon.title = ITEMS_DB[toolId].name;
        domElements.toolDisplay.appendChild(toolIcon);
      }
    });
    // Hide tool-display if empty, show if not
    if (domElements.toolDisplay.children.length === 0) {
      domElements.toolDisplay.style.display = 'none';
    } else {
      domElements.toolDisplay.style.display = '';
    }

    // Update buttons
    const hasItems = workbenchContents.elements.length > 0 || workbenchContents.tools.length > 0;
    domElements.processBtn.disabled = !hasItems;
    domElements.clearBtn.disabled = !hasItems;
    domElements.hintBtn.disabled = !gameState.currentCustomerRequest || gameState.coins < 5;
  }

  // Helper function to compare arrays
  function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  }

  function clearWorkbench() {
    workbenchContents.elements = [];
    workbenchContents.tools = [];
    updateWorkbenchState();
  }

  function showStarterMenu() {
    uiManager.showModal(domElements.starterMenuModal, true);
  }

  function startGame() {
    uiManager.showModal(domElements.starterMenuModal, false);
    gameState.hasSeenTutorial = true;
    gameState.save();
    getNewCustomerRequest();
  }

  function getNewCustomerRequest() {
    // Stop any existing timer
    gameState.stopOrderTimer();
    
    // Get compound using the new tracking system
    const compoundId = gameState.getRandomCompoundForLevel(gameState.level);
    
    if (!compoundId) {
      domElements.customerRequest.textContent = "Keep leveling up to unlock more reactions!";
      return;
    }

    gameState.currentCustomerRequest = compoundId;
    gameState.lastCustomerRequest = compoundId;

    const compound = REACTIONS_DB_TO_USE[compoundId];
    const requestName = compound.name;
    domElements.customerRequest.textContent = `Hello! Can you please make me some ${requestName}?`;
    domElements.speechBubble.classList.add('visible');

    // Start timer for this order
    gameState.startOrderTimer();
    
    // Update UI
    domElements.hintBtn.disabled = false;
    if (domElements.orderTimer) {
      domElements.orderTimer.style.display = 'block';
    }
    if (domElements.skipOrderBtn) {
      domElements.skipOrderBtn.style.display = 'block';
    }
    
    // Update stats to ensure header values are current
    uiManager.updateStats();
    
    gameState.save();
  }

  // Make functions accessible to other modules
  window.gameModules = {
    gameState,
    uiManager,
    reactionProcessor,
    achievementManager,
    animationManager,
    workbenchContents,
    updateWorkbenchState,
    clearWorkbench,
    getNewCustomerRequest,
    ITEMS_DB
  };

  // Initialize the game
  init();
});
