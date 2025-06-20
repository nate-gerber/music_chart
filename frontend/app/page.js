'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTop10() {
      try {
        setLoading(true);
        const res = await fetch('/api/top10');
        if (!res.ok) {
          throw new Error('Failed to fetch tracks');
        }
        const data = await res.json();
        setTracks(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setTracks([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTop10();
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1 className={styles.title}>Top 10 Music Chart</h1>
      </div>

      <div className={styles.grid}>
        {loading && <p>Loading...</p>}
        {error && <p className={styles.error}>Error: {error}</p>}
        {tracks.length > 0 && (
          <ol className={styles.chart}>
            {tracks.map((track, index) => (
              <li key={index} className={styles.card}>
                <h2><span>{index + 1}.</span> {track.name}</h2>
                <p>{track.artist}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  );
} 