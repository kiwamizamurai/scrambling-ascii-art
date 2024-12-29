import { useEffect, useState } from 'react';
import { asciiArtCollection } from './constants/asciiArtCollection';
import { AsciiScramble } from 'scrambling-ascii-art/react';

export const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % asciiArtCollection.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: '2rem',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            marginBottom: '1rem',
          }}
        >
          I am a developer
        </h1>
        <p
          style={{
            fontSize: '1.2rem',
            color: '#666',
          }}
        >
          Hello world
        </p>
      </div>

      <AsciiScramble art={asciiArtCollection[currentIndex]} speed={80} scale={200} />
    </div>
  );
};
