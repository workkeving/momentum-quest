/**
 * Momentum Quest - Stamina Management System
 *
 * Manages stamina (health) that drains when phone is moved.
 * Triggers failure state when stamina reaches 0.
 */

const Stamina = {
  // Stamina state
  current: CONFIG.STAMINA_MAX,
  max: CONFIG.STAMINA_MAX,
  isDraining: false,
  drainIntervalId: null,

  // Callbacks
  changeCallbacks: [],
  depletedCallbacks: [],

  /**
   * Reset stamina to maximum
   */
  resetStamina() {
    this.current = this.max;
    this.isDraining = false;
    this._stopDraining();
    this._notifyChange();
    console.log('Stamina reset to max');
  },

  /**
   * Start draining stamina (called when movement detected)
   */
  startDraining() {
    if (this.isDraining) {
      return;  // Already draining
    }

    this.isDraining = true;
    console.log('Stamina: Started draining');

    // Drain stamina every second
    this.drainIntervalId = setInterval(() => {
      this.drainStamina(CONFIG.STAMINA_DRAIN_RATE);
    }, 1000);
  },

  /**
   * Stop draining stamina (called when movement stops)
   */
  stopDraining() {
    if (!this.isDraining) {
      return;
    }

    this.isDraining = false;
    this._stopDraining();
    console.log('Stamina: Stopped draining');
  },

  /**
   * Internal method to clear the drain interval
   * @private
   */
  _stopDraining() {
    if (this.drainIntervalId) {
      clearInterval(this.drainIntervalId);
      this.drainIntervalId = null;
    }
  },

  /**
   * Drain stamina by a specific amount
   * @param {number} amount - Amount to drain
   */
  drainStamina(amount) {
    if (this.current <= 0) {
      return;  // Already depleted
    }

    this.current = Math.max(0, this.current - amount);
    this._notifyChange();

    console.log(`Stamina drained: -${amount} (${this.current}/${this.max})`);

    // Check if depleted
    if (this.current === 0) {
      this._onDepleted();
    }
  },

  /**
   * Recover stamina by a specific amount
   * @param {number} amount - Amount to recover
   */
  recoverStamina(amount) {
    if (this.current >= this.max) {
      return;  // Already at max
    }

    this.current = Math.min(this.max, this.current + amount);
    this._notifyChange();

    console.log(`Stamina recovered: +${amount} (${this.current}/${this.max})`);
  },

  /**
   * Get current stamina value
   * @returns {number} Current stamina
   */
  getCurrentStamina() {
    return this.current;
  },

  /**
   * Get stamina as a percentage (0-100)
   * @returns {number} Percentage
   */
  getPercentage() {
    return (this.current / this.max) * 100;
  },

  /**
   * Check if stamina is empty
   * @returns {boolean} True if empty
   */
  isEmpty() {
    return this.current === 0;
  },

  /**
   * Check if stamina is at max
   * @returns {boolean} True if at maximum
   */
  isFull() {
    return this.current === this.max;
  },

  /**
   * Get stamina status color (for UI)
   * @returns {string} Color indicator (green/yellow/red)
   */
  getStatusColor() {
    const percentage = this.getPercentage();
    if (percentage > 60) return 'green';
    if (percentage > 30) return 'yellow';
    return 'red';
  },

  /**
   * Register a callback for when stamina changes
   * @param {Function} callback - Function to call on stamina change
   */
  onChange(callback) {
    this.changeCallbacks.push(callback);
  },

  /**
   * Register a callback for when stamina is depleted (reaches 0)
   * @param {Function} callback - Function to call when depleted
   */
  onDepleted(callback) {
    this.depletedCallbacks.push(callback);
  },

  /**
   * Notify all change callbacks
   * @private
   */
  _notifyChange() {
    this.changeCallbacks.forEach(callback => {
      callback(this.current, this.max);
    });
  },

  /**
   * Handle stamina depletion
   * @private
   */
  _onDepleted() {
    this._stopDraining();
    console.log('Stamina depleted!');

    this.depletedCallbacks.forEach(callback => {
      callback();
    });
  },

  /**
   * Reset to initial state
   */
  reset() {
    this._stopDraining();
    this.current = this.max;
    this.isDraining = false;
  }
};
