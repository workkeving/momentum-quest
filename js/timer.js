/**
 * Momentum Quest - Focus Timer System
 *
 * Manages the countdown timer for focus sessions.
 * Notifies listeners every second (tick) and when timer completes.
 */

const Timer = {
  // Timer state
  isRunning: false,
  timeRemaining: 0,  // in seconds
  duration: CONFIG.TIMER_DURATION,
  intervalId: null,

  // Callbacks
  tickCallbacks: [],
  completeCallbacks: [],

  /**
   * Start the timer with specified duration
   * @param {number} duration - Duration in seconds (optional, uses CONFIG default)
   */
  startTimer(duration = CONFIG.TIMER_DURATION) {
    if (this.isRunning) {
      console.warn('Timer already running');
      return;
    }

    this.duration = duration;
    this.timeRemaining = duration;
    this.isRunning = true;

    console.log(`Timer started: ${duration} seconds`);

    // Start the countdown interval
    this.intervalId = setInterval(() => {
      this._tick();
    }, CONFIG.TIMER_UPDATE_INTERVAL);

    // Immediate tick to update UI right away
    this._notifyTick();
  },

  /**
   * Stop and reset the timer
   */
  stopTimer() {
    if (!this.isRunning) {
      return;
    }

    clearInterval(this.intervalId);
    this.intervalId = null;
    this.isRunning = false;
    this.timeRemaining = 0;

    console.log('Timer stopped');
  },

  /**
   * Pause the timer (can be resumed)
   */
  pauseTimer() {
    if (!this.isRunning) {
      return;
    }

    clearInterval(this.intervalId);
    this.intervalId = null;
    this.isRunning = false;

    console.log('Timer paused');
  },

  /**
   * Resume a paused timer
   */
  resumeTimer() {
    if (this.isRunning || this.timeRemaining <= 0) {
      return;
    }

    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this._tick();
    }, CONFIG.TIMER_UPDATE_INTERVAL);

    console.log('Timer resumed');
  },

  /**
   * Internal tick function (called every second)
   * @private
   */
  _tick() {
    if (this.timeRemaining > 0) {
      this.timeRemaining--;
      this._notifyTick();

      // Check if timer completed
      if (this.timeRemaining === 0) {
        this._complete();
      }
    }
  },

  /**
   * Timer completed
   * @private
   */
  _complete() {
    this.stopTimer();
    console.log('Timer completed!');
    this._notifyComplete();
  },

  /**
   * Get the time remaining in seconds
   * @returns {number} Seconds remaining
   */
  getTimeRemaining() {
    return this.timeRemaining;
  },

  /**
   * Get formatted time string (MM:SS)
   * @returns {string} Formatted time
   */
  getFormattedTime() {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  },

  /**
   * Check if timer is running
   * @returns {boolean} True if running
   */
  isActive() {
    return this.isRunning;
  },

  /**
   * Register a callback for timer ticks (called every second)
   * @param {Function} callback - Function to call on each tick
   */
  onTick(callback) {
    this.tickCallbacks.push(callback);
  },

  /**
   * Register a callback for timer completion
   * @param {Function} callback - Function to call when timer completes
   */
  onComplete(callback) {
    this.completeCallbacks.push(callback);
  },

  /**
   * Notify all tick callbacks
   * @private
   */
  _notifyTick() {
    this.tickCallbacks.forEach(callback => {
      callback(this.timeRemaining);
    });
  },

  /**
   * Notify all complete callbacks
   * @private
   */
  _notifyComplete() {
    this.completeCallbacks.forEach(callback => {
      callback();
    });
  },

  /**
   * Reset timer to initial state
   */
  reset() {
    this.stopTimer();
    this.timeRemaining = this.duration;
  }
};
