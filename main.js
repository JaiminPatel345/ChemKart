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

    // Filter and pagination
    filterBtns: document.querySelectorAll('.filter-btn'),
    prevPageBtn: document.getElementById('prev-page'),
    nextPageBtn: document.getElementById('next-page'),
    pageInfo: document.getElementById('page-info'),

    // Modals
    starterMenuModal: document.getElementById('starter-menu-modal'),
    startGameBtn: document.getElementById('start-game-btn'),
    showTutorialBtn: document.getElementById('show-tutorial-btn'),
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

    // Close achievements sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (!domElements.achievementsSidebar.contains(e.target) && e.target !== domElements.achievementsBtn) {
        domElements.achievementsSidebar.classList.remove('visible');
      }
    });

    // Starter menu events
    domElements.startGameBtn.addEventListener('click', startGame);
    domElements.showTutorialBtn.addEventListener('click', showStarterMenu);
  }


  function handleDragStart(e) {
    console.log("Came");
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

    if (workbenchContents.tools.includes('Bunsen Burner')) {
      const arrowSpan = document.createElement('span');
      arrowSpan.textContent = ' → ?';
      arrowSpan.style.color = '#ff6b35';
      domElements.equationDisplay.appendChild(arrowSpan);
    }

    // Update tool display
    domElements.toolDisplay.innerHTML = '';
    workbenchContents.tools.forEach(toolId => {
      if (toolId !== 'Bunsen Burner') {
        domElements.toolDisplay.innerHTML += ITEMS_DB[toolId].icon;
      }
    });

    // Update buttons
    const hasItems = workbenchContents.elements.length > 0 || workbenchContents.tools.length > 0;
    domElements.processBtn.disabled = !hasItems;
    domElements.clearBtn.disabled = !hasItems;
    domElements.hintBtn.disabled = !gameState.currentCustomerRequest;
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
    const availableReactions = Object.keys(REACTIONS_DB)
    .filter(id => REACTIONS_DB[id].level <= gameState.level);

    if (availableReactions.length === 0) {
      domElements.customerRequest.textContent = "Keep leveling up to unlock more reactions!";
      return;
    }

    // Avoid repeating the same request immediately
    let filteredReactions = availableReactions;
    if (gameState.lastCustomerRequest && availableReactions.length > 1) {
      filteredReactions = availableReactions.filter(id => id !== gameState.lastCustomerRequest);
    }

    const randomIndex = Math.floor(Math.random() * filteredReactions.length);
    gameState.currentCustomerRequest = filteredReactions[randomIndex];
    gameState.lastCustomerRequest = gameState.currentCustomerRequest;

    const requestName = REACTIONS_DB[gameState.currentCustomerRequest].name;
    domElements.customerRequest.textContent = `Hello! Can you please make me some ${requestName}?`;
    domElements.speechBubble.classList.add('visible');

    domElements.hintBtn.disabled = false;
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
