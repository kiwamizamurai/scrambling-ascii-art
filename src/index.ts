export interface ScramblingAsciiOptions {
  art: string[];
  className?: string;
  speed?: number;
  scale?: number;
  onComplete?: () => void;
}

export class AsciiScrambleEngine {
  private static readonly ERROR_ART = [
    '┌───────────────┐',
    '│    ERROR!     │',
    '│  (╯°□°)╯︵ ┻━┻│',
    '└───────────────┘',
  ];

  private el: HTMLElement;
  private chars: string;
  private resolve: (() => void) | null = null;
  private frameRequest: number;
  private frame: number;
  private originalArt: string[];
  private speed: number;
  private artWidth: number;
  private artHeight: number;
  private scale: number;
  private onComplete?: () => void;

  constructor(el: HTMLElement, options: ScramblingAsciiOptions) {
    this.el = el;
    this.chars = '██▓▒░█▄▀■□▢▣▤▥▦▧▨▩▪▫▬▭▮▯╔╗╚╝║═╠╣╦╩╬░▒▓█│┌┐└┘├┤┬┴┼━┃┏┓┗┛┣┫┳┻╋┠┯┨┷┿┝┰┥┸╂';

    if (!Array.isArray(options.art) || options.art.length === 0) {
      this.originalArt = AsciiScrambleEngine.ERROR_ART;
    } else {
      this.originalArt = options.art.map((line) => {
        if (line == null) return '';

        const trimmed = String(line)
          .replace(/\r?\n/g, '')
          .replace(/[ \t]+$/, '')
          .replace(/　+$/, '');

        if (line === options.art[0] && line.endsWith('　')) {
          return `${trimmed}　`;
        }
        return trimmed;
      });
    }

    this.speed = options.speed || 40;
    this.artHeight = this.originalArt.length;
    this.artWidth = Math.max(
      ...this.originalArt.map((line) => {
        const expandedLine = line.replace(/\t/g, '    ');
        return Array.from(expandedLine)
          .filter((char) => {
            return !char.match(
              /\u200B|\uFEFF|\u0300-\u036F|\u1AB0-\u1AFF|\u1DC0-\u1DFF|\u20D0-\u20FF|\uFE20-\uFE2F/
            );
          })
          .map((char) => {
            if (char.match(/[─━═╾╿│┃┆┇┊┋]/)) {
              return 1;
            }
            return 1;
          })
          .reduce((sum, count) => sum + count, 0);
      })
    );

    this.resolve = null;
    this.frame = 0;
    this.frameRequest = 0;
    this.scale = options.scale || 1;
    this.update = this.update.bind(this);
    this.onComplete = options.onComplete;

    this.setupStyles();
  }

  private setupStyles() {
    this.el.style.display = 'inline-block';
    this.el.style.whiteSpace = 'pre';
    this.el.style.lineHeight = '1';
    this.el.style.letterSpacing = '0';
    this.el.style.fontFamily = 'monospace';
    this.el.style.transform = `scale(${this.scale / 100})`;
    this.el.style.transformOrigin = 'center center';
    this.el.style.position = 'relative';
    this.el.style.margin = '50px';
  }

  public scramble(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.resolve = resolve;
      this.frame = 0;
      this.update();
    });
  }

  private update = (): void => {
    let isComplete = true;
    const output = this.originalArt.map((currentLine, i) => {
      let outputLine = '';
      for (let x = 0; x < this.artWidth; x++) {
        const targetChar = currentLine[x] || ' ';
        if (this.frame >= (x + i) * (this.speed / 10)) {
          outputLine += targetChar;
        } else {
          isComplete = false;
          outputLine += this.chars[Math.floor(Math.random() * this.chars.length)];
        }
      }
      return outputLine;
    });

    this.el.textContent = output.join('\n');
    if (isComplete) {
      if (this.resolve) {
        this.resolve();
      }
      if (this.onComplete) {
        this.onComplete();
      }
    } else {
      this.frame++;
      this.frameRequest = requestAnimationFrame(this.update);
    }
  };

  public stop(): void {
    if (this.frameRequest) {
      cancelAnimationFrame(this.frameRequest);
      this.frameRequest = 0;
      if (this.resolve) {
        this.resolve();
        this.resolve = null;
      }
    }
  }

  // Add getters for testing
  public get currentArt(): string[] {
    return this.originalArt;
  }

  public get currentSpeed(): number {
    return this.speed;
  }

  public get dimensions(): { width: number; height: number } {
    return {
      width: this.artWidth,
      height: this.artHeight,
    };
  }
}
