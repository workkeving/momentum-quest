/**
 * Momentum Quest - Configuration File
 *
 * All game configuration constants in one place.
 * Modify these values to tweak game behavior without hunting through code.
 */

const CONFIG = {
  // Timer Settings
  TIMER_DURATION: 20,           // Focus session duration in seconds (20 for testing, 1800 = 30min for real use)
  TIMER_UPDATE_INTERVAL: 1000,  // How often to update timer display (milliseconds)

  // Movement Detection Settings
  MOVEMENT_THRESHOLD: 1.2,      // Acceleration magnitude threshold for movement detection
                                 // Lower = more sensitive, Higher = more lenient
                                 // Recommended: 1.0-2.0 (1.2 is a good starting point)

  // Stamina Settings
  STAMINA_MAX: 100,              // Maximum stamina value
  STAMINA_DRAIN_RATE: 5,         // Stamina drained per second when moving
  STAMINA_RECOVERY_RATE: 0,      // Stamina recovered per second when still (0 = no recovery)

  // Reward Settings
  REWARD_TOKENS_PER_SUCCESS: 1,  // Moon Tokens awarded for successful focus session

  // UI Settings
  SHOW_DEBUG_INFO: true,         // Show movement magnitude and debug info

  // LocalStorage Keys
  STORAGE_KEY_TOKENS: 'momentum_quest_tokens',
  STORAGE_KEY_SESSIONS: 'momentum_quest_sessions',
  STORAGE_KEY_SKINS: 'momentum_quest_owned_skins'
};

// Game States Enum
const GAME_STATES = {
  IDLE: 'IDLE',                       // Waiting to start
  FOCUS_ACTIVE: 'FOCUS_ACTIVE',       // Timer running, monitoring movement
  MOVEMENT_DETECTED: 'MOVEMENT_DETECTED',  // User moved phone
  STAMINA_DRAINING: 'STAMINA_DRAINING',    // Stamina decreasing
  FAILED: 'FAILED',                   // Stamina reached 0
  SUCCESS: 'SUCCESS'                  // Timer completed successfully
};

// Export for use in other modules
// (In a module system, you'd use export. For simple script includes, these are global)
