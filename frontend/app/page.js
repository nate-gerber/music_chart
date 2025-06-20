'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './page.module.css';
import Sparkline from './components/Sparkline';

export default function Home() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [constants, setConstants] = useState({
    w1: 1.0,
    w2: 2.5,
    C: 3.0,
    tau: 20,
    beta: 0.04,
  });

  const fetchAndRank = useCallback(async (currentConstants) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(currentConstants);
      const res = await fetch(`/api/top10?${queryParams.toString()}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || 'Failed to fetch tracks');
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
  }, []);

  useEffect(() => {
    fetchAndRank(constants);
  }, [fetchAndRank]);

  const handleConstantChange = (e) => {
    const { name, value } = e.target;
    setConstants(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleRerankClick = () => {
    fetchAndRank(constants);
  };

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1 className={styles.title}>Top 10 Music Chart</h1>
        <p className={styles.subtitle}>Powered by a Custom Ranking Algorithm</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.controlRow}>
          <div className={styles.sliderGroup}>
            <label htmlFor="w1">Popularity Weight (w1): {constants.w1.toFixed(2)}</label>
            <input type="range" id="w1" name="w1" min="0" max="5" step="0.1" value={constants.w1} onChange={handleConstantChange} />
          </div>
          <div className={styles.sliderGroup}>
            <label htmlFor="w2">Momentum Weight (w2): {constants.w2.toFixed(2)}</label>
            <input type="range" id="w2" name="w2" min="0" max="5" step="0.1" value={constants.w2} onChange={handleConstantChange} />
          </div>
        </div>
        <div className={styles.controlRow}>
          <div className={styles.sliderGroup}>
            <label htmlFor="tau">Decay Half-Life (tau): {constants.tau}</label>
            <input type="range" id="tau" name="tau" min="1" max="52" step="1" value={constants.tau} onChange={handleConstantChange} />
          </div>
          <div className={styles.sliderGroup}>
            <label htmlFor="beta">Weekly Penalty (beta): {constants.beta.toFixed(3)}</label>
            <input type="range" id="beta" name="beta" min="0" max="0.2" step="0.005" value={constants.beta} onChange={handleConstantChange} />
          </div>
        </div>
         <div className={styles.controlRow}>
            <div className={styles.sliderGroup}>
                <label htmlFor="C">Momentum Cap (C): {constants.C.toFixed(2)}</label>
                <input type="range" id="C" name="C" min="1" max="10" step="0.25" value={constants.C} onChange={handleConstantChange} />
            </div>
            <button onClick={handleRerankClick} className={styles.button} disabled={loading}>
                {loading ? 'Ranking...' : 'Re-rank Chart'}
            </button>
        </div>
      </div>

      <div className={styles.grid}>
        {loading && <p>Loading tracks...</p>}
        {error && <p className={styles.error}>Error: {error}</p>}
        {tracks.length > 0 && (
          <ol className={styles.chart}>
            {tracks.map((track, index) => (
              <li key={index} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2><span>{index + 1}.</span> {track.name}</h2>
                  <p>{track.artist}</p>
                </div>
                
                <div className={styles.cardBody}>
                  <div className={styles.rankingDetails}>
                    <h4>Ranking Breakdown:</h4>
                    <ul>
                      <li><strong>Score:</strong> {track.calculation.AdjustedScore.toFixed(4)}</li>
                      <li><strong>Raw Score:</strong> {track.calculation.RawScore.toFixed(2)}</li>
                      <li><strong>Decay:</strong> {track.calculation.Decay.toFixed(3)}</li>
                      <li><strong>Penalty:</strong> {track.calculation.Penalty.toFixed(3)}</li>
                      {track.calculation.FreshBoost > 0 && <li><strong>Boost:</strong> {track.calculation.FreshBoost.toFixed(2)}</li>}
                      <li><strong>Weeks:</strong> {track.weeksOnChart}</li>
                      <li><strong>7d Plays (S):</strong> {track.calculation.S.toLocaleString()}</li>
                      <li><strong>8wk Avg (L):</strong> {track.calculation.L.toFixed(2)}</li>
                      <li><strong>Momentum (M):</strong> {track.calculation.M.toFixed(2)}</li>
                    </ul>
                  </div>
                  <div className={styles.sparklineContainer}>
                      <Sparkline data={track.dailyPlays} />
                      <span className={styles.sparklineLabel}>Play History (63 days)</span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  );
} 