# Stock 101 - Refactored Architecture

This project has been refactored following SOLID, KISS, YAGNI, and DRY principles to create a maintainable and scalable codebase.

## Architecture Overview

The code is now organized into a modular structure with clear separation of concerns:

```
js/
├── config/
│   └── GameConfig.js          # Game constants and configuration
├── core/
│   └── Game.js               # Main game orchestrator
├── events/
│   └── EventManager.js       # User interaction handling
├── models/
│   ├── GameState.js          # Game state management
│   └── ColorManager.js       # Color-related logic
├── services/
│   ├── AnimationService.js   # Animation and visual effects
│   └── GameLogicService.js   # Core game mechanics
├── ui/
│   └── UIManager.js          # DOM manipulation and rendering
├── utils/
│   └── Utilities.js          # Helper functions and utilities
├── mobile-support.js         # Mobile device optimization
└── app.js                    # Application entry point
```

## Design Principles Applied

### SOLID Principles

- **Single Responsibility**: Each class has one clear purpose
- **Open/Closed**: Classes are open for extension, closed for modification
- **Liskov Substitution**: Interfaces are properly defined
- **Interface Segregation**: Classes depend only on methods they use
- **Dependency Inversion**: High-level modules don't depend on low-level modules

### KISS (Keep It Simple, Stupid)

- Simple, readable code structure
- Clear method names and responsibilities
- Minimal complexity in each component

### YAGNI (You Aren't Gonna Need It)

- Only implemented features that are actually used
- Removed unnecessary abstractions
- Focused on current requirements

### DRY (Don't Repeat Yourself)

- Centralized configuration in `GameConfig.js`
- Shared utilities in `Utilities.js`
- Reusable components and services

## Key Components

### Core Game (`js/core/Game.js`)

- Orchestrates all game components
- Handles high-level game flow
- Manages dependencies between services

### State Management (`js/models/GameState.js`)

- Manages game state and history
- Handles undo/redo functionality
- Encapsulates state logic

### UI Management (`js/ui/UIManager.js`)

- Handles all DOM manipulation
- Manages rendering and display updates
- Provides clean interface for UI operations

### Event Handling (`js/events/EventManager.js`)

- Manages all user interactions
- Handles keyboard, mouse, and touch events
- Provides centralized event management

### Game Logic (`js/services/GameLogicService.js`)

- Contains core game mechanics
- Handles board operations and tile logic
- Manages game rules and validation

### Animation (`js/services/AnimationService.js`)

- Handles all visual animations
- Manages smooth transitions
- Provides performance-optimized animations

### Mobile Support (`js/mobile-support.js`)

- Optimizes game for mobile devices
- Handles touch interactions
- Provides responsive design adjustments

## Benefits of This Architecture

1. **Maintainability**: Easy to modify individual components without affecting others
2. **Testability**: Each component can be tested in isolation
3. **Scalability**: New features can be added without changing existing code
4. **Readability**: Clear separation of concerns makes code easier to understand
5. **Reusability**: Components can be reused in different contexts
6. **Cross-platform**: Mobile support ensures the game works on all devices

## Usage

The game is initialized through `js/app.js` which creates a new `Game` instance and sets up all necessary components. The HTML file simply includes the app.js module:

```html
<script type="module" src="js/app.js"></script>
```

## Error Handling

All components use the `safeExecute` utility function to provide consistent error handling and logging throughout the application.

## Performance Optimizations

- Intersection Observer for efficient DOM updates
- Debounced event handlers
- Optimized animation using requestAnimationFrame
- Touch event optimization for mobile devices
- Responsive design for cross-platform compatibility

## File Structure Details

### Configuration Layer

- **GameConfig.js**: Centralized game settings, constants, and configuration parameters

### Core Layer

- **Game.js**: Main game controller that orchestrates all other components

### Event Layer

- **EventManager.js**: Handles all user interactions and input events

### Model Layer

- **GameState.js**: Manages game state, history, and data persistence
- **ColorManager.js**: Handles color schemes and visual theming

### Service Layer

- **GameLogicService.js**: Core game mechanics and rules implementation
- **AnimationService.js**: Visual effects and smooth transitions

### UI Layer

- **UIManager.js**: DOM manipulation and user interface management

### Utility Layer

- **Utilities.js**: Shared helper functions and common utilities
- **mobile-support.js**: Mobile device optimization and touch handling

### Entry Point

- **app.js**: Application initialization and bootstrap
