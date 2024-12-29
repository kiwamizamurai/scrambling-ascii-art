import { jest } from '@jest/globals';
import { AsciiScrambleEngine } from '../index.js';

describe('AsciiScrambleEngine', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should initialize with correct options', () => {
    const art = ['test'];
    const scramble = new AsciiScrambleEngine(container, { art });
    expect(scramble).toBeDefined();
  });

  describe('String Processing', () => {
    it('can properly process ASCII art containing full-width spaces', () => {
      const art = [
        '　∧＿∧　　', // Full-width spaces at start and end
        '（｡･ω･）　', // Full-width space at end
        '⊂　　ノ', // Full-width spaces in middle
      ];
      const scramble = new AsciiScrambleEngine(container, { art });
      expect(scramble.currentArt).toEqual([
        '　∧＿∧　', // Keeps up to one full-width space at end
        '（｡･ω･）', // Removes full-width space at end
        '⊂　　ノ', // Keeps full-width spaces in middle
      ]);
    });

    it('empty array should display error art', () => {
      const scramble = new AsciiScrambleEngine(container, {
        art: [],
      });
      expect(scramble.currentArt).toEqual([
        '┌───────────────┐',
        '│    ERROR!     │',
        '│  (╯°□°)╯︵ ┻━┻│',
        '└───────────────┘',
      ]);
      const { width, height } = scramble.dimensions;
      expect(height).toBe(4);
      expect(width).toBe(17);
    });

    it('undefined/null should be converted to empty string', () => {
      const art = ['test', undefined, null, 'end'];
      const scramble = new AsciiScrambleEngine(container, { art: art as unknown as string[] });
      expect(scramble.currentArt).toEqual(['test', '', '', 'end']);
    });

    it('art being undefined should display error art', () => {
      const scramble = new AsciiScrambleEngine(container, {
        art: undefined as unknown as string[],
      });
      expect(scramble.currentArt).toEqual([
        '┌───────────────┐',
        '│    ERROR!     │',
        '│  (╯°□°)╯︵ ┻━┻│',
        '└───────────────┘',
      ]);
    });

    it('art not being an array should display error art', () => {
      const scramble = new AsciiScrambleEngine(container, {
        art: 'not an array' as unknown as string[],
      });
      expect(scramble.currentArt).toEqual([
        '┌───────────────┐',
        '│    ERROR!     │',
        '│  (╯°□°)╯︵ ┻━┻│',
        '└───────────────┘',
      ]);
    });
  });

  describe('Display Style', () => {
    it('scaling should be applied correctly', () => {
      const scale = 200;
      const scramble = new AsciiScrambleEngine(container, {
        art: ['test'],
        scale,
      });

      expect(container.style.transform).toBe(`scale(${scale / 100})`);
    });

    it('font family should be set correctly', () => {
      const scramble = new AsciiScrambleEngine(container, {
        art: ['test'],
      });

      expect(container.style.fontFamily).toBe('monospace');
    });

    it('default scale should be applied correctly', () => {
      const scramble = new AsciiScrambleEngine(container, {
        art: ['test'],
      });
      expect(container.style.transform).toBe('scale(0.01)');
    });

    it('default speed should be set correctly', () => {
      const scramble = new AsciiScrambleEngine(container, {
        art: ['test'],
      });
      expect(scramble.currentSpeed).toBe(40);
    });
  });

  describe('Callbacks', () => {
    it('should call onComplete when animation is finished', async () => {
      const onCompleteMock = jest.fn();
      const scramble = new AsciiScrambleEngine(container, {
        art: ['test'],
        speed: 1,
        onComplete: onCompleteMock,
      });

      await scramble.scramble();

      expect(onCompleteMock).toHaveBeenCalledTimes(1);
    });

    it('should work without onComplete callback', async () => {
      const scramble = new AsciiScrambleEngine(container, {
        art: ['test'],
        speed: 1,
      });

      await expect(scramble.scramble()).resolves.not.toThrow();
    });

    it('should stop calling onComplete when animation is stopped', async () => {
      const onCompleteMock = jest.fn();
      const scramble = new AsciiScrambleEngine(container, {
        art: ['test'],
        speed: 1,
        onComplete: onCompleteMock,
      });

      const promise = scramble.scramble();
      scramble.stop();
      await promise;

      expect(onCompleteMock).not.toHaveBeenCalled();
    });
  });
});
