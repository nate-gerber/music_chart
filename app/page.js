'use client';
import { useEffect, useState } from 'react';
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/top10')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTracks(data);
          setError(null);
        } else if (data && data.error) {
          setError(typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
          setTracks([]);
        } else {
          setError('Unexpected response from server.');
          setTracks([]);
        }
      })
      .catch((err) => {
        setError('Failed to fetch tracks.');
        setTracks([]);
      });
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Get started by editing <code>app/page.js</code>.
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
      <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
        <h1>Spotify Top 10</h1>
        {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
        {tracks.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tracks.map((track, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <img src={track.image} alt={track.name} width={64} height={64} style={{ borderRadius: 8, marginRight: 16 }} />
                <div>
                  <a href={track.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', fontSize: 18 }}>
                    {track.name}
                  </a>
                  <div style={{ color: '#555' }}>{track.artist}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {!error && tracks.length === 0 && <div>No tracks found.</div>}
      </div>
    </div>
  );
}
