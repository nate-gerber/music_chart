/**
 * Calculates the 7-day smoothed play total (S).
 * P_t-i is the play total from i days ago.
 * @param {number[]} dailyPlays - Array of daily play counts (at least 7 days).
 * @returns {number} The 7-day smoothed total.
 */
function calculateS(dailyPlays) {
    // We assume the most recent play data is at the end of the array.
    const recentPlays = dailyPlays.slice(-7);
    return recentPlays.reduce((sum, plays) => sum + plays, 0);
}

/**
 * Calculates the 8-week smoothed baseline (L).
 * P_t-i is the play total from i days ago.
 * The period is from 7 days ago to 62 days ago.
 * @param {number[]} dailyPlays - Array of daily play counts (at least 63 days).
 * @returns {number} The 8-week baseline average.
 */
function calculateL(dailyPlays) {
    const baselinePlays = dailyPlays.slice(0, 56); // Last 8 weeks, excluding the most recent week
    const total = baselinePlays.reduce((sum, plays) => sum + plays, 0);
    return total / 56; // Average daily plays over the 8-week period
}

/**
 * Calculates the momentum ratio (M).
 * @param {number} S - 7-day smoothed play total.
 * @param {number} L - 8-week smoothed baseline.
 * @param {number} epsilon - A small floor value to prevent division by zero.
 * @returns {number} The momentum ratio.
 */
function calculateM(S, L, epsilon) {
    return S / (L + epsilon);
}

/**
 * Calculates the final adjusted score for a track.
 * @param {Object} track - The track object, including dailyPlays, weeksOnChart, and peakMomentum.
 * @param {Object} constants - The constants for the algorithm (w1, w2, C, tau, beta, epsilon).
 * @returns {number} The final adjusted score.
 */
export function calculateAdjustedScore(track, constants) {
    const { dailyPlays, weeksOnChart: t, peakMomentum: M_peak } = track;
    const { w1, w2, C, tau, beta, epsilon } = constants;

    if (dailyPlays.length < 63) {
        // Not enough data to calculate a score
        return -Infinity;
    }

    // 1. Raw popularity + growth
    const S = calculateS(dailyPlays);
    const L = calculateL(dailyPlays);
    const M = calculateM(S, L, epsilon);
    const M_prime = Math.min(M, C); // Dampened momentum
    const RawScore = w1 * Math.log(1 + S) + w2 * M_prime;

    // 2. Age decay factor
    const Decay = Math.exp(-t / tau);

    // 3. Fresh-entry boost
    const FreshBoost = t === 0 ? Math.max(0, (M_peak - M) / C) : 0;

    // 4. Weeks-on-chart penalty
    const Penalty = beta * t;

    // 5. Final adjusted score
    const AdjustedScore = RawScore * Decay + FreshBoost - Penalty;
    
    // Store intermediate values for debugging/display if needed
    track.calculation = { S, L, M, M_prime, RawScore, Decay, FreshBoost, Penalty, AdjustedScore };

    return AdjustedScore;
} 