import * as React from 'react';
import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { AsciiScrambleEngine, type ScramblingAsciiOptions } from './index';

interface AsciiScrambleProps extends Omit<ScramblingAsciiOptions, 'art'> {
  art: string[];
  speed?: number;
  scale?: number;
  onComplete?: () => void;
}

export const AsciiScramble: FC<AsciiScrambleProps> = ({ art, speed, scale, onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scramblerRef = useRef<AsciiScrambleEngine | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      scramblerRef.current = new AsciiScrambleEngine(containerRef.current, {
        art,
        speed,
        scale,
      });

      scramblerRef.current.scramble().then(() => {
        onComplete?.();
      });
    }

    return () => {
      scramblerRef.current?.stop();
    };
  }, [art, speed, scale, onComplete]);

  return <div ref={containerRef} />;
}; 