# LearnO Project Architecture & File Organization

The LearnO application has been successfully restructured from a monolithic 8,300+ line prototype into a clean, modular web application architecture. This structure improves maintainability, enables team collaboration, and prepares the app for integration with a backend (e.g., Next.js, Node, Supabase).

## Folder Structure

The code is now organized inside the `learno_app/` directory as follows:

```text
learno_app/
├── index.html        # Main entry point and DOM structure
├── css/
│   └── main.css      # Core styles, theming, responsive design, and game UI
└── js/
    ├── main.js       # Core logic, game engines, state management, and data
    └── cammy.js      # Cammy AI Companion logic, animations, and API integration
```

## Description of Files

### `index.html` (788 lines)
Serves as the skeleton of the application. It contains all the structural DOM elements, including:
- **Splash Screen:** The initial entry sequence.
- **Navigation:** The responsive top navigation bar and theme toggles.
- **App Views:** Container elements for the Home Dashboard, Knowledge Map, Quizzes, Puzzles, Game Hub, and Vault.
- **Modals:** UI structures for profile setup, level-up notifications, and alerts.

### `css/main.css` (1,287 lines)
Contains the entirety of the visual styling, creating the "Black & Gold Luxury" aesthetic.
- **Design Tokens:** CSS custom properties (`:root`) for colors, gradients, and font families.
- **Core Styles:** Button styles, animations, responsive layout breakpoints, and accessibility `focus-visible` outlines.
- **Game Interfaces:** Specific layouts for the Snake Quest, Code Memory, and Tower Build games.

### `js/main.js` (5,106 lines)
The central brain of the application. It manages the entire user journey and local state.
- **State Management:** Manages `ST` (XP, level, streaks, quiz progress). Includes functions like `addXP()`, `updXP()`, and profile sync stubs.
- **Curriculum Data:** Contains `CHAPTERS` (the lesson content) and `PUZZLES` (coding challenges).
- **Game Engines:** Includes the core logic loops, canvas rendering, and collision detection for all educational games (Snake, Tower Build, Code Memory).
- **DOM Manipulation:** Handles tab switching, rendering leaderboards (`rLB()`), and dynamically generating quizzes.

### `js/cammy.js` (1,191 lines)
A dedicated script for the interactive AI companion ("Cammy").
- **Chat Interface:** Controls the floating Cammy widget, chat history, and typing animations.
- **Context Awareness:** Functions that allow Cammy to detect which screen the user is on (e.g., "I see you're struggling with the Snake game...").
- **LLM Integration:** Handles the prompt construction and API requests to the Gemini model for generating dynamic hints and custom vault chapters.

## Next Steps for Development

1. **Backend Integration:** Replace the local `localStorage` state management and stubs (`SUPA_USER`, `addXP`) with live PostgreSQL/Supabase database connections.
2. **Componentization:** Migrate the `index.html` structure into React/Next.js components (e.g., `<Navbar />`, `<GameHub />`, `<SnakeGame />`).
3. **Module Splitting:** Further split `main.js` into modular ES6 imports (`data.js`, `state.js`, `snakeEngine.js`) once a bundler (Vite or Webpack) is introduced.
