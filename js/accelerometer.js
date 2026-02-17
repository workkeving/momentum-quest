/**
 * Momentum Quest - Accelerometer/Movement Detection System
 *
 * Detects phone movement using the DeviceMotion API.
 * Calculates acceleration magnitude and compares against threshold.
 */

const Accelerometer = {
  // State
  isListening: false,
  hasPermission: null,  // null = unknown, true = granted, false = denied

  // Current acceleration values
  currentAcceleration: {
    x: 0,
    y: 0,
    z: 0
  },

  // Movement detection
  lastMagnitude: 0,
  isMovingNow: false,

  // Callbacks
  movementCallbacks: [],

  /**
   * Request permission to access device motion (required on iOS 13+)
   * @returns {Promise<boolean>} True if permission granted
   */
  async requestPermission() {
    // Check if DeviceMotionEvent.requestPermission exists (iOS 13+)
    if (typeof DeviceMotionEvent !== 'undefined' &&
        typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceMotionEvent.requestPermission();
        this.hasPermission = (permission === 'granted');
        console.log(`DeviceMotion permission: ${permission}`);
        return this.hasPermission;
      } catch (error) {
        console.error('Error requesting DeviceMotion permission:', error);
        this.hasPermission = false;
        return false;
      }
    } else {
      // Permission not needed on Android/desktop
      this.hasPermission = true;
      return true;
    }
  },

  /**
   * Start listening to device motion events
   * @returns {Promise<boolean>} True if started successfully
   */
  async startListening() {
    // Request permission first if needed
    if (this.hasPermission === null) {
      const granted = await this.requestPermission();
      if (!granted) {
        console.error('DeviceMotion permission denied');
        return false;
      }
    }

    if (this.isListening) {
      console.warn('Already listening to accelerometer');
      return true;
    }

    // Add event listener
    window.addEventListener('devicemotion', this._handleMotion.bind(this));
    this.isListening = true;
    console.log('Accelerometer: Started listening');
    return true;
  },

  /**
   * Stop listening to device motion events
   */
  stopListening() {
    if (!this.isListening) {
      return;
    }

    window.removeEventListener('devicemotion', this._handleMotion.bind(this));
    this.isListening = false;
    this.isMovingNow = false;
    console.log('Accelerometer: Stopped listening');
  },

  /**
   * Internal handler for devicemotion events
   * @private
   */
  _handleMotion(event) {
    // Get acceleration including gravity
    // We use accelerationIncludingGravity because it's more widely supported
    const accel = event.accelerationIncludingGravity;

    if (!accel || accel.x === null) {
      console.warn('Accelerometer data not available');
      return;
    }

    // Store current acceleration
    this.currentAcceleration.x = accel.x || 0;
    this.currentAcceleration.y = accel.y || 0;
    this.currentAcceleration.z = accel.z || 0;

    // Calculate magnitude: √(x² + y² + z²)
    const magnitude = this.getAccelerationMagnitude();
    this.lastMagnitude = magnitude;

    // Check if movement exceeds threshold
    const wasMoving = this.isMovingNow;
    this.isMovingNow = this.isMoving();

    // Trigger callbacks if movement state changed (from still to moving)
    if (!wasMoving && this.isMovingNow) {
      this._notifyMovement();
    }
  },

  /**
   * Calculate the magnitude of acceleration
   * @returns {number} Magnitude value
   */
  getAccelerationMagnitude() {
    const { x, y, z } = this.currentAcceleration;
    return Math.sqrt(x * x + y * y + z * z);
  },

  /**
   * Check if device is currently moving (magnitude > threshold)
   * @returns {boolean} True if moving
   */
  isMoving() {
    return this.lastMagnitude > CONFIG.MOVEMENT_THRESHOLD;
  },

  /**
   * Get the last recorded magnitude
   * @returns {number} Magnitude value
   */
  getLastMagnitude() {
    return this.lastMagnitude;
  },

  /**
   * Register a callback for when movement is detected
   * @param {Function} callback - Function to call when movement detected
   */
  onMovement(callback) {
    this.movementCallbacks.push(callback);
  },

  /**
   * Notify all movement callbacks
   * @private
   */
  _notifyMovement() {
    this.movementCallbacks.forEach(callback => {
      callback(this.lastMagnitude);
    });
  },

  /**
   * Check if accelerometer is supported on this device
   * @returns {boolean} True if supported
   */
  isSupported() {
    return typeof DeviceMotionEvent !== 'undefined';
  },

  /**
   * Reset all values
   */
  reset() {
    this.currentAcceleration = { x: 0, y: 0, z: 0 };
    this.lastMagnitude = 0;
    this.isMovingNow = false;
  }
};
