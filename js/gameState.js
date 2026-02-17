/**
 * Momentum Quest - Game State Machine
 *
 * Manages all game states and transitions.
 * Uses a simple event-based system to notify listeners when state changes.
 */

const GameState = {
  // Current state
  currentState: GAME_STATES.IDLE,

  // State change listeners (callbacks that get called when state changes)
  stateChangeListeners: [],

  /**
   * Set a new game state
   * @param {string} newState - One of the GAME_STATES enum values
   */
  setState(newState) {
    // Validate that it's a valid state
    if (!Object.values(GAME_STATES).includes(newState)) {
      console.error(`Invalid state: ${newState}`);
      return;
    }

    const oldState = this.currentState;
    this.currentState = newState;

    console.log(`State transition: ${oldState} → ${newState}`);

    // Notify all listeners
    this.stateChangeListeners.forEach(callback => {
      callback(newState, oldState);
    });
  },

  /**
   * Get the current game state
   * @returns {string} Current state
   */
  getCurrentState() {
    return this.currentState;
  },

  /**
   * Check if currently in a specific state
   * @param {string} state - State to check
   * @returns {boolean} True if in that state
   */
  isInState(state) {
    return this.currentState === state;
  },

  /**
   * Register a callback to be notified when state changes
   * @param {Function} callback - Function to call on state change (newState, oldState)
   */
  onStateChange(callback) {
    this.stateChangeListeners.push(callback);
  },

  /**
   * Remove a state change listener
   * @param {Function} callback - The callback to remove
   */
  removeStateChangeListener(callback) {
    const index = this.stateChangeListeners.indexOf(callback);
    if (index > -1) {
      this.stateChangeListeners.splice(index, 1);
    }
  },

  /**
   * Reset to IDLE state
   */
  reset() {
    this.setState(GAME_STATES.IDLE);
  }
};

/**
 * Valid State Transitions
 *
 * IDLE → FOCUS_ACTIVE (user presses "Start")
 * FOCUS_ACTIVE → MOVEMENT_DETECTED (accelerometer detects movement)
 * MOVEMENT_DETECTED → STAMINA_DRAINING (stamina starts decreasing)
 * STAMINA_DRAINING → FAILED (stamina reaches 0)
 * STAMINA_DRAINING → FOCUS_ACTIVE (user stops moving, stamina > 0)
 * FOCUS_ACTIVE → SUCCESS (timer reaches 0)
 * SUCCESS/FAILED → IDLE (user presses "Reset"/"Try Again")
 */
