/**
 * Momentum Quest - Rewards & Currency System
 *
 * Manages Moon Tokens (currency) and future gacha functionality.
 * Persists data to localStorage.
 */

const Rewards = {
  // Current token balance
  tokens: 0,

  // Total successful sessions
  sessionsCompleted: 0,

  // Owned skin IDs (for future gacha)
  ownedSkins: [1],  // Start with skin ID 1 (default character)

  // Available skins (loaded from skins.json)
  availableSkins: [],

  /**
   * Initialize the rewards system (load from localStorage)
   */
  init() {
    this.loadProgress();
    console.log(`Rewards initialized: ${this.tokens} tokens, ${this.sessionsCompleted} sessions`);
  },

  /**
   * Grant tokens as a reward for successful focus session
   * @param {number} amount - Number of tokens to grant (default from CONFIG)
   */
  grantReward(amount = CONFIG.REWARD_TOKENS_PER_SUCCESS) {
    this.tokens += amount;
    this.sessionsCompleted++;
    this.saveProgress();

    console.log(`Reward granted: +${amount} tokens (Total: ${this.tokens})`);
  },

  /**
   * Get current token balance
   * @returns {number} Token count
   */
  getTokenBalance() {
    return this.tokens;
  },

  /**
   * Get total completed sessions
   * @returns {number} Session count
   */
  getSessionsCompleted() {
    return this.sessionsCompleted;
  },

  /**
   * Spend tokens (for gacha pulls, etc.)
   * @param {number} amount - Number of tokens to spend
   * @returns {boolean} True if successful, false if insufficient tokens
   */
  spendTokens(amount) {
    if (this.tokens < amount) {
      console.warn(`Insufficient tokens: need ${amount}, have ${this.tokens}`);
      return false;
    }

    this.tokens -= amount;
    this.saveProgress();
    console.log(`Spent ${amount} tokens (Remaining: ${this.tokens})`);
    return true;
  },

  /**
   * Save progress to localStorage
   */
  saveProgress() {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY_TOKENS, this.tokens.toString());
      localStorage.setItem(CONFIG.STORAGE_KEY_SESSIONS, this.sessionsCompleted.toString());
      localStorage.setItem(CONFIG.STORAGE_KEY_SKINS, JSON.stringify(this.ownedSkins));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  },

  /**
   * Load progress from localStorage
   */
  loadProgress() {
    try {
      const savedTokens = localStorage.getItem(CONFIG.STORAGE_KEY_TOKENS);
      const savedSessions = localStorage.getItem(CONFIG.STORAGE_KEY_SESSIONS);
      const savedSkins = localStorage.getItem(CONFIG.STORAGE_KEY_SKINS);

      if (savedTokens !== null) {
        this.tokens = parseInt(savedTokens, 10) || 0;
      }

      if (savedSessions !== null) {
        this.sessionsCompleted = parseInt(savedSessions, 10) || 0;
      }

      if (savedSkins !== null) {
        this.ownedSkins = JSON.parse(savedSkins) || [1];
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  },

  /**
   * Reset all progress (for testing)
   */
  resetProgress() {
    this.tokens = 0;
    this.sessionsCompleted = 0;
    this.ownedSkins = [1];
    this.saveProgress();
    console.log('Progress reset');
  },

  // ============================================================
  // FUTURE GACHA SYSTEM (Placeholder/Stub Functions)
  // ============================================================

  /**
   * Load available skins from data file
   * @param {Array} skins - Array of skin objects from skins.json
   */
  loadSkins(skins) {
    this.availableSkins = skins;
    console.log(`Loaded ${skins.length} available skins`);
  },

  /**
   * Perform a gacha pull (stub for future implementation)
   * @returns {Object|null} Skin object if successful, null if failed
   */
  performGachaPull() {
    // TODO: Implement full gacha logic
    // - Check if enough tokens
    // - Spend tokens
    // - Roll random skin based on rarity
    // - Add to owned skins if not duplicate
    // - Return result

    console.log('Gacha pull (not yet implemented)');
    return null;
  },

  /**
   * Get all owned skins
   * @returns {Array} Array of owned skin IDs
   */
  getOwnedSkins() {
    return this.ownedSkins;
  },

  /**
   * Check if a skin is owned
   * @param {number} skinId - Skin ID to check
   * @returns {boolean} True if owned
   */
  ownsSkin(skinId) {
    return this.ownedSkins.includes(skinId);
  },

  /**
   * Add a skin to owned collection
   * @param {number} skinId - Skin ID to add
   */
  addSkin(skinId) {
    if (!this.ownsSkin(skinId)) {
      this.ownedSkins.push(skinId);
      this.saveProgress();
      console.log(`New skin acquired: ${skinId}`);
    }
  }
};
