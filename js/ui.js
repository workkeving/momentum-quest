/**
 * Momentum Quest - UI Management System
 *
 * Handles all UI updates and display logic.
 * Updates based on game state, timer, stamina, and rewards.
 */

const UI = {
  // DOM element references (set in init())
  elements: {},

  /**
   * Initialize UI system and cache DOM elements
   */
  init() {
    // Cache all DOM elements for performance
    this.elements = {
      // Timer
      timerDisplay: document.getElementById('timer-display'),

      // Stamina
      staminaBar: document.getElementById('stamina-bar'),
      staminaFill: document.getElementById('stamina-fill'),
      staminaText: document.getElementById('stamina-text'),

      // State
      stateDisplay: document.getElementById('state-display'),
      stateMessage: document.getElementById('state-message'),

      // Tokens
      tokenCount: document.getElementById('token-count'),

      // Buttons
      startButton: document.getElementById('start-button'),
      resetButton: document.getElementById('reset-button'),

      // Debug
      debugInfo: document.getElementById('debug-info'),
      movementValue: document.getElementById('movement-value')
    };

    console.log('UI initialized');
    this.updateAll();
  },

  /**
   * Update all UI elements
   */
  updateAll() {
    this.updateTimer();
    this.updateStamina();
    this.updateState();
    this.updateTokens();
  },

  /**
   * Update timer display
   * @param {number} timeRemaining - Seconds remaining (optional)
   */
  updateTimer(timeRemaining) {
    if (!this.elements.timerDisplay) return;

    const time = timeRemaining !== undefined ? timeRemaining : Timer.getTimeRemaining();
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    this.elements.timerDisplay.textContent = formatted;
  },

  /**
   * Update stamina bar visualization
   * @param {number} current - Current stamina (optional)
   * @param {number} max - Maximum stamina (optional)
   */
  updateStamina(current, max) {
    if (!this.elements.staminaFill) return;

    const stamina = current !== undefined ? current : Stamina.getCurrentStamina();
    const maxStamina = max !== undefined ? max : Stamina.max;
    const percentage = (stamina / maxStamina) * 100;

    // Update width
    this.elements.staminaFill.style.width = `${percentage}%`;

    // Update color based on percentage
    let color = '#4ECDC4';  // Green (full)
    if (percentage <= 30) {
      color = '#FF6B6B';  // Red (danger)
    } else if (percentage <= 60) {
      color = '#FFD93D';  // Yellow (warning)
    }
    this.elements.staminaFill.style.backgroundColor = color;

    // Update text
    if (this.elements.staminaText) {
      this.elements.staminaText.textContent = `${Math.round(stamina)} / ${maxStamina}`;
    }
  },

  /**
   * Update state display and message
   * @param {string} state - Current game state (optional)
   */
  updateState(state) {
    if (!this.elements.stateDisplay) return;

    const currentState = state || GameState.getCurrentState();
    let displayText = '';
    let messageText = '';

    switch (currentState) {
      case GAME_STATES.IDLE:
        displayText = 'Ready to Begin';
        messageText = 'Press Start to begin your focus quest';
        break;
      case GAME_STATES.FOCUS_ACTIVE:
        displayText = 'Focus Active';
        messageText = 'Keep your phone still...';
        break;
      case GAME_STATES.MOVEMENT_DETECTED:
        displayText = 'Movement Detected!';
        messageText = 'Your character is wobbling...';
        break;
      case GAME_STATES.STAMINA_DRAINING:
        displayText = 'Stamina Draining!';
        messageText = 'Stop moving to recover!';
        break;
      case GAME_STATES.FAILED:
        displayText = 'Focus Lost';
        messageText = 'Every attempt makes you stronger. Try again?';
        break;
      case GAME_STATES.SUCCESS:
        displayText = '🌙 Quest Complete!';
        messageText = `You earned ${CONFIG.REWARD_TOKENS_PER_SUCCESS} Moon Token!`;
        break;
    }

    this.elements.stateDisplay.textContent = displayText;
    if (this.elements.stateMessage) {
      this.elements.stateMessage.textContent = messageText;
    }

    // Update state display styling
    this.elements.stateDisplay.className = `state-${currentState.toLowerCase()}`;
  },

  /**
   * Update token count display
   */
  updateTokens() {
    if (!this.elements.tokenCount) return;

    const tokens = Rewards.getTokenBalance();
    this.elements.tokenCount.textContent = tokens;
  },

  /**
   * Update movement debug info
   * @param {number} magnitude - Acceleration magnitude
   */
  updateMovementDebug(magnitude) {
    if (!CONFIG.SHOW_DEBUG_INFO || !this.elements.movementValue) return;

    this.elements.movementValue.textContent = magnitude.toFixed(2);

    // Highlight if over threshold
    if (magnitude > CONFIG.MOVEMENT_THRESHOLD) {
      this.elements.movementValue.style.color = '#FF6B6B';
      this.elements.movementValue.style.fontWeight = 'bold';
    } else {
      this.elements.movementValue.style.color = '#4ECDC4';
      this.elements.movementValue.style.fontWeight = 'normal';
    }
  },

  /**
   * Show/hide buttons based on state
   * @param {string} state - Current game state
   */
  updateButtons(state) {
    if (!this.elements.startButton || !this.elements.resetButton) return;

    switch (state) {
      case GAME_STATES.IDLE:
        this.elements.startButton.style.display = 'block';
        this.elements.startButton.textContent = 'Start Focus Session';
        this.elements.resetButton.style.display = 'none';
        break;

      case GAME_STATES.FOCUS_ACTIVE:
      case GAME_STATES.MOVEMENT_DETECTED:
      case GAME_STATES.STAMINA_DRAINING:
        this.elements.startButton.style.display = 'none';
        this.elements.resetButton.style.display = 'none';
        break;

      case GAME_STATES.SUCCESS:
        this.elements.startButton.style.display = 'none';
        this.elements.resetButton.style.display = 'block';
        this.elements.resetButton.textContent = 'Continue';
        break;

      case GAME_STATES.FAILED:
        this.elements.startButton.style.display = 'none';
        this.elements.resetButton.style.display = 'block';
        this.elements.resetButton.textContent = 'Try Again';
        break;
    }
  },

  /**
   * Show debug information panel
   */
  showDebugInfo() {
    if (this.elements.debugInfo) {
      this.elements.debugInfo.style.display = CONFIG.SHOW_DEBUG_INFO ? 'block' : 'none';
    }
  },

  /**
   * Flash the screen (for movement detection feedback)
   * @param {string} color - Flash color
   */
  flashScreen(color = 'rgba(255, 107, 107, 0.3)') {
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.backgroundColor = color;
    flash.style.pointerEvents = 'none';
    flash.style.transition = 'opacity 0.3s';
    flash.style.zIndex = '9999';

    document.body.appendChild(flash);

    setTimeout(() => {
      flash.style.opacity = '0';
      setTimeout(() => flash.remove(), 300);
    }, 100);
  }
};
