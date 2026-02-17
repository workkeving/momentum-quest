/**
 * Momentum Quest - Main Application File
 *
 * Initializes all systems and wires them together.
 * This is the entry point that connects the game loop.
 */

// Main game controller
const Game = {
  /**
   * Initialize the game
   */
  async init() {
    console.log('🌙 Momentum Quest - Initializing...');

    // Initialize systems
    Rewards.init();
    UI.init();

    // Wire up all event listeners
    this.setupEventListeners();

    // Check accelerometer support
    if (!Accelerometer.isSupported()) {
      this.showError('Accelerometer not supported on this device. Please use a mobile device.');
      return;
    }

    console.log('✅ Game initialized successfully');
  },

  /**
   * Setup all event listeners and wire systems together
   */
  setupEventListeners() {
    // ===== Button Events =====
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');
    const grantPermissionButton = document.getElementById('grant-permission-button');
    const skipPermissionButton = document.getElementById('skip-permission-button');

    if (startButton) {
      startButton.addEventListener('click', () => this.startSession());
    }

    if (resetButton) {
      resetButton.addEventListener('click', () => this.resetSession());
    }

    if (grantPermissionButton) {
      grantPermissionButton.addEventListener('click', () => this.requestMotionPermission());
    }

    if (skipPermissionButton) {
      skipPermissionButton.addEventListener('click', () => this.hidePermissionScreen());
    }

    // ===== Game State Changes =====
    GameState.onStateChange((newState, oldState) => {
      console.log(`Game State: ${oldState} → ${newState}`);
      UI.updateState(newState);
      UI.updateButtons(newState);
      this.handleStateChange(newState, oldState);
    });

    // ===== Timer Events =====
    Timer.onTick((timeRemaining) => {
      UI.updateTimer(timeRemaining);
    });

    Timer.onComplete(() => {
      console.log('✅ Focus session completed!');
      this.onSessionSuccess();
    });

    // ===== Stamina Events =====
    Stamina.onChange((current, max) => {
      UI.updateStamina(current, max);
    });

    Stamina.onDepleted(() => {
      console.log('❌ Stamina depleted!');
      this.onSessionFailed();
    });

    // ===== Accelerometer Events =====
    Accelerometer.onMovement((magnitude) => {
      console.log(`Movement detected: ${magnitude.toFixed(2)}`);
      this.onMovementDetected();
    });

    // Update movement debug and check movement status every 100ms
    setInterval(() => {
      if (Accelerometer.isListening) {
        const magnitude = Accelerometer.getLastMagnitude();
        UI.updateMovementDebug(magnitude);

        // Check if we should stop draining stamina
        if (GameState.isInState(GAME_STATES.STAMINA_DRAINING)) {
          if (!Accelerometer.isMoving()) {
            // Movement stopped - stop draining and return to focus
            Stamina.stopDraining();
            GameState.setState(GAME_STATES.FOCUS_ACTIVE);
            console.log('Movement stopped - stamina drain stopped');
          }
        }

        // Check if movement started during focus
        if (GameState.isInState(GAME_STATES.FOCUS_ACTIVE)) {
          if (Accelerometer.isMoving()) {
            this.onMovementDetected();
          }
        }
      }
    }, 100);
  },

  /**
   * Handle state changes
   */
  handleStateChange(newState, oldState) {
    switch (newState) {
      case GAME_STATES.FOCUS_ACTIVE:
        // Session is active, just monitoring
        break;

      case GAME_STATES.MOVEMENT_DETECTED:
        // Start draining stamina
        if (!Stamina.isDraining) {
          GameState.setState(GAME_STATES.STAMINA_DRAINING);
        }
        break;

      case GAME_STATES.STAMINA_DRAINING:
        // Start stamina drain
        Stamina.startDraining();
        UI.flashScreen('rgba(255, 107, 107, 0.2)');
        break;

      case GAME_STATES.SUCCESS:
        // Stop all systems
        this.stopAllSystems();
        break;

      case GAME_STATES.FAILED:
        // Stop all systems
        this.stopAllSystems();
        break;
    }
  },

  /**
   * Request motion permission with better UX
   */
  async requestMotionPermission() {
    console.log('📱 Requesting motion permission...');

    try {
      const hasPermission = await Accelerometer.requestPermission();

      if (hasPermission) {
        console.log('✅ Permission granted!');
        this.hidePermissionScreen();
        this.showSuccess('Motion access granted! You can now start a focus session.');
      } else {
        console.error('❌ Permission denied');
        this.showError('Motion permission denied. Please go to Settings → Safari → Motion & Orientation Access and enable it, then refresh this page.');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      this.showError('Unable to request permission. Make sure you\'re using Safari on iOS.');
    }
  },

  /**
   * Show permission screen (for iOS)
   */
  showPermissionScreen() {
    const permissionScreen = document.getElementById('permission-screen');
    if (permissionScreen) {
      permissionScreen.style.display = 'flex';
    }
  },

  /**
   * Hide permission screen
   */
  hidePermissionScreen() {
    const permissionScreen = document.getElementById('permission-screen');
    if (permissionScreen) {
      permissionScreen.style.display = 'none';
    }
  },

  /**
   * Start a new focus session
   */
  async startSession() {
    console.log('🎯 Starting focus session...');

    // Request permission directly in this click handler (iOS requirement)
    const hasPermission = await Accelerometer.requestPermission();

    if (!hasPermission) {
      // Show helpful error message with instructions
      this.showError('⚠️ Motion permission denied!\n\n' +
        'iOS Users: Go to Settings → Safari → Motion & Orientation Access and turn it ON.\n\n' +
        'Then refresh this page and try again.');
      return;
    }

    console.log('✅ Permission granted, starting session...');

    // Reset all systems
    Stamina.resetStamina();
    Timer.reset();
    Accelerometer.reset();

    // Start accelerometer listening
    await Accelerometer.startListening();

    // Start timer
    Timer.startTimer();

    // Set state to FOCUS_ACTIVE
    GameState.setState(GAME_STATES.FOCUS_ACTIVE);

    console.log('Focus session started!');
  },

  /**
   * Called when movement is detected during focus session
   */
  onMovementDetected() {
    if (GameState.isInState(GAME_STATES.FOCUS_ACTIVE)) {
      GameState.setState(GAME_STATES.MOVEMENT_DETECTED);
    }
  },

  /**
   * Called when session completes successfully
   */
  onSessionSuccess() {
    // Grant reward
    Rewards.grantReward();
    UI.updateTokens();

    // Set success state
    GameState.setState(GAME_STATES.SUCCESS);

    console.log('🎉 Session successful!');
  },

  /**
   * Called when session fails (stamina depleted)
   */
  onSessionFailed() {
    // Set failed state
    GameState.setState(GAME_STATES.FAILED);

    console.log('💔 Session failed');
  },

  /**
   * Reset/Continue after success or failure
   */
  resetSession() {
    this.stopAllSystems();

    // Reset all systems
    Timer.reset();
    Stamina.reset();
    Accelerometer.reset();

    // Back to idle
    GameState.reset();

    // Update UI
    UI.updateAll();

    console.log('Session reset');
  },

  /**
   * Stop all active systems
   */
  stopAllSystems() {
    Timer.stopTimer();
    Stamina.stopDraining();
    Accelerometer.stopListening();
  },

  /**
   * Show error message
   */
  showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
      errorDiv.style.backgroundColor = 'rgba(255, 107, 107, 0.2)';
      errorDiv.style.borderColor = '#ff6b6b';
    }
    console.error(message);
  },

  /**
   * Show success message
   */
  showSuccess(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
      errorDiv.style.backgroundColor = 'rgba(78, 205, 196, 0.2)';
      errorDiv.style.borderColor = '#4ecdc4';
    }
    console.log(message);

    // Auto-hide after 3 seconds
    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 3000);
  }
};

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
  Game.init();
});
