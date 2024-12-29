# Scrambling ASCII Art

![NPM Version](https://img.shields.io/npm/v/scrambling-ascii-art)
![NPM Downloads](https://img.shields.io/npm/dm/scrambling-ascii-art)
[![CI](https://github.com/kiwamizamurai/scrambling-ascii-art/actions/workflows/ci.yml/badge.svg)](https://github.com/kiwamizamurai/scrambling-ascii-art/actions/workflows/ci.yml)

A TypeScript library for creating scrambling ASCII art animations with optional React support.

## Features

- 🎨 ASCII art scrambling animation
- ⚛️ React component support
- 🎮 Customizable animation speed and scale
- 📦 Zero dependencies
- 💪 TypeScript support
- 🌐 Browser compatible

## Installation

```bash
npm install scrambling-ascii-art
```

## Usage

### Vanilla JavaScript/TypeScript

```typescript
import { AsciiScrambleEngine } from 'scrambling-ascii-art';

const container = document.querySelector('#container');
const art = [
  " ∧＿∧ ",
  " （｡･ω･） ",
  "⊂　　ノ ",
  " しーＪ ",
];

const scrambler = new AsciiScrambleEngine(container, {
  art: art,
  speed: 80, // Optional: animation speed (default: 40)
  scale: 100 // Optional: display scale in percentage (default: 100)
});

// Start animation
scrambler.scramble().then(() => {
  console.log('Animation completed!');
});

// Stop animation if needed
scrambler.stop();
```

### React Component

```tsx
import { AsciiScramble } from 'scrambling-ascii-art/react';

function App() {
  const art = [
    " ∧＿∧ ",
    " （｡･ω･） ",
    "⊂　　ノ ",
    " しーＪ ",
  ];

  return (
    <AsciiScramble
      art={art}
      speed={80}
      scale={100}
      onComplete={() => console.log('Animation completed')}
    />
  );
}
```

## API Reference

### AsciiScramble Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| art | string[] | Required | ASCII art as array of strings |
| speed | number | 40 | Animation speed (higher is slower) |
| scale | number | 100 | Display scale in percentage |

### Methods

| Method | Return Type | Description |
|--------|-------------|-------------|
| scramble() | Promise<void> | Start scrambling animation |
| stop() | void | Stop current animation |

## Contributing

Contributions are welcome! Feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details
