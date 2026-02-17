# 🌙 Momentum Quest

**A fantasy-themed focus game to reduce phone addiction using accelerometer-based mechanics.**

Keep your phone completely still during focus sessions. Movement causes your character to lose balance and drain stamina. Complete the session to earn Moon Tokens!

---

## 🎮 How to Play

1. **Press "Start Focus Session"** - Begin your quest
2. **Place your phone down** on a stable surface
3. **Keep it completely still** for the entire duration (20 seconds for testing)
4. **Stay focused!**
   - If you move the phone → Character wobbles
   - Stamina drains when moving
   - Stamina reaches 0 → Session fails
5. **Complete the timer** → Earn 1 Moon Token! 🌙

---

## 🚀 How to Run

### Option 1: Direct Open (Desktop Testing)
1. Open `index.html` directly in a web browser
2. Use Chrome DevTools to simulate mobile sensors:
   - Press `F12` to open DevTools
   - Press `Ctrl+Shift+M` for Device Mode
   - Go to "Sensors" tab (⋮ menu → More tools → Sensors)
   - Enable "Override motion sensors"
   - Shake/move the virtual device to test

### Option 2: Local Server (Recommended for Mobile)

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Using Node.js:**
```bash
npx http-server -p 8000
```

**Using PHP:**
```bash
php -S localhost:8000
```

Then open: `http://localhost:8000` in your browser

### Option 3: Mobile Testing (Real Device)

**IMPORTANT:** iOS requires HTTPS for DeviceMotion API.

#### For HTTP Testing (Android):
1. Run a local server (see Option 2)
2. Find your computer's local IP:
   - Windows: `ipconfig` (look for IPv4)
   - Mac/Linux: `ifconfig` or `ip addr`
3. On your phone, navigate to: `http://YOUR_IP:8000`
4. Grant motion permission when prompted

#### For HTTPS Testing (iOS):
Use one of these services to create an HTTPS tunnel:

**ngrok:**
```bash
ngrok http 8000
```
Copy the HTTPS URL and open on your phone.

**localtunnel:**
```bash
npx localtunnel --port 8000
```

**GitHub Pages** (easiest for permanent hosting):
1. Create a GitHub repository
2. Push this project
3. Enable GitHub Pages in repository settings
4. Access via: `https://username.github.io/repo-name`

---

## 📁 Project Structure

```
momentum-quest/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # All styling (fantasy theme)
├── js/
│   ├── main.js            # Entry point, game initialization
│   ├── gameState.js       # State machine (IDLE, FOCUS_ACTIVE, etc.)
│   ├── accelerometer.js   # Movement detection via DeviceMotion API
│   ├── timer.js           # Countdown timer system
│   ├── stamina.js         # Stamina drain/recovery
│   ├── rewards.js         # Moon Tokens & future gacha
│   ├── ui.js              # UI updates and display
│   └── config.js          # All configuration constants
├── data/
│   └── skins.json         # Character skins (future gacha)
├── docs/
│   └── skills/            # Expert skills for development
└── README.md              # This file
```

---

## ⚙️ Configuration

Edit `js/config.js` to adjust game behavior:

```javascript
const CONFIG = {
  TIMER_DURATION: 20,           // Focus duration (20s for testing, 1800s = 30min)
  MOVEMENT_THRESHOLD: 1.2,      // Sensitivity (lower = stricter)
  STAMINA_MAX: 100,
  STAMINA_DRAIN_RATE: 5,        // Per second when moving
  REWARD_TOKENS_PER_SUCCESS: 1,
  SHOW_DEBUG_INFO: true         // Show movement magnitude
};
```

---

## 🧪 Testing

### Desktop (Chrome DevTools)
1. Open `index.html` in Chrome
2. Press `F12` → Device Mode (`Ctrl+Shift+M`)
3. Sensors tab → "Override motion sensors"
4. Adjust alpha/beta/gamma or shake to simulate movement
5. Start session and test

### Mobile (Real Device)
1. Serve via HTTPS (see "How to Run" section)
2. Open on phone browser
3. Grant motion permission
4. Press Start
5. Try:
   - Keeping phone completely still ✅
   - Moving phone slightly ⚠️
   - Shaking phone ❌

### Expected Behavior
- **Still phone** → Stamina stays at 100, timer counts down
- **Small movement** → "Movement Detected", stamina drains
- **Continuous movement** → Stamina reaches 0 → FAILED
- **Complete timer** → SUCCESS → +1 token

---

## 🎨 Features Implemented

### ✅ Core Gameplay
- [x] Accelerometer movement detection
- [x] Configurable focus timer (20s default)
- [x] Stamina system (drains on movement)
- [x] Game state machine (6 states)
- [x] Success/Failure conditions

### ✅ UI/UX
- [x] Mobile-first responsive design
- [x] Fantasy theme (purple/gold/teal)
- [x] Timer display (MM:SS)
- [x] Stamina bar (visual feedback)
- [x] State messages
- [x] Token counter

### ✅ Persistence
- [x] localStorage for tokens/sessions
- [x] Progress saved automatically

### ✅ Future-Ready
- [x] Rewards system structure
- [x] Skin data schema (gacha placeholder)
- [x] Modular, extensible architecture

---

## 🔮 Future Features (Not Yet Implemented)

1. **Gacha System**
   - Pull mechanics with rarity rates
   - Character skin unlocks
   - Animated reveals

2. **Visual Assets**
   - Character sprites & animations
   - Background art (mountains, night sky)
   - Particle effects

3. **Audio**
   - Sound effects (movement, success, fail)
   - Calming background music

4. **Progression**
   - Daily quests
   - Streak tracking
   - Achievements
   - Difficulty levels (longer sessions)

5. **Polish**
   - Haptic feedback
   - Better animations
   - Settings menu (sensitivity, duration)
   - Tutorial/onboarding

6. **PWA Features**
   - Install as app
   - Offline support
   - Push notifications

---

## 🛠️ Tech Stack

- **HTML5** - Structure
- **CSS3** - Styling (no frameworks)
- **Vanilla JavaScript** - Logic (no frameworks)
- **DeviceMotion API** - Accelerometer access
- **localStorage** - Data persistence

**Why no frameworks?**
This is a beginner-friendly project designed to teach fundamentals. Adding React/Vue would add complexity without much benefit for this prototype.

---

## 🐛 Troubleshooting

### "Accelerometer not supported"
- **Solution**: Use a mobile device or Chrome DevTools with sensor simulation

### Motion permission denied (iOS)
- **Solution**: Enable motion in Safari Settings → Privacy → Motion & Orientation

### Movement not detected
- **Solution**: Increase sensitivity in `config.js`:
  ```javascript
  MOVEMENT_THRESHOLD: 0.8  // Lower = more sensitive
  ```

### False positives (movement detected while still)
- **Solution**: Decrease sensitivity:
  ```javascript
  MOVEMENT_THRESHOLD: 1.5  // Higher = less sensitive
  ```

### DeviceMotion not working (iOS)
- **Solution**: Must use HTTPS! Use ngrok, localtunnel, or GitHub Pages

---

## 📚 Learning Resources

This project teaches:
- **JavaScript fundamentals** - Variables, functions, objects, events
- **Game state management** - State machines, event-driven programming
- **Mobile Web APIs** - DeviceMotion, localStorage
- **DOM manipulation** - Updating UI based on data
- **Modular code organization** - Separation of concerns
- **Mobile-first design** - Responsive CSS, touch interfaces

---

## 🤝 Development Workflow

### Using Expert Skills

This project includes custom Claude Code skills for specialized help:

```bash
# Install skills (run once)
./install-skills.bat  # Windows
./install-skills.sh   # Mac/Linux

# Then use skills:
/game-director        # High-level architecture decisions
/accelerometer-expert # Movement detection tuning
/ui-expert            # Interface improvements
/qa-expert            # Testing guidance
```

See `docs/skills/README.md` for more info.

---

## 📝 License

This is a learning project. Feel free to use, modify, and learn from it!

---

## 🎯 Next Steps

1. **Test the prototype** - Verify everything works on mobile
2. **Tune sensitivity** - Adjust `MOVEMENT_THRESHOLD` for your device
3. **Add character sprites** - Replace emoji with actual art
4. **Implement gacha** - Build the pull mechanic
5. **Add sound effects** - Enhance feedback
6. **Share & iterate!** - Get feedback from users

---

**Built with Claude Code** 🤖
_Version 1.0 - Prototype_

Happy focusing! 🌙✨
