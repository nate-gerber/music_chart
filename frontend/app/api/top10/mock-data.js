const trackNames = [
    { name: "Sunset Cruise", artist: "The Midnight" },
    { name: "Ocean Drive", artist: "Duke Dumont" },
    { name: "Mirage", artist: "Else" },
    { name: "Nightcall", artist: "Kavinsky" },
    { name: "A Real Hero", artist: "College & Electric Youth" },
    { name: "Genesis", artist: "Grimes" },
    { name: "Midnight City", artist: "M83" },
    { name: "Sleepwalking", artist: "The Chain Gang of 1974" },
    { name: "Levitating", artist: "Dua Lipa" },
    { name: "Blinding Lights", artist: "The Weeknd" },
    { name: "Solar Power", artist: "Lorde" },
    { name: "Good Days", artist: "SZA" },
    { name: "Kyoto", artist: "Phoebe Bridgers" },
    { name: "Therefore I Am", artist: "Billie Eilish" },
    { name: "Heat Waves", artist: "Glass Animals" },
    { name: "Stay", artist: "The Kid LAROI & Justin Bieber" },
    { name: "INDUSTRY BABY", artist: "Lil Nas X & Jack Harlow" },
    { name: "positions", artist: "Ariana Grande" },
    { name: "Save Your Tears", artist: "The Weeknd" },
    { name: "drivers license", artist: "Olivia Rodrigo" },
];

/**
 * Generates a hypothetical play history for a track.
 * @param {number} length - The number of days of history to generate (e.g., 63).
 * @param {string} trend - 'up', 'down', 'stable', or 'new'.
 * @returns {number[]} An array of daily play counts.
 */
function generatePlayHistory(length, trend) {
    const history = [];
    const startPlays = 500 + Math.random() * 5000;

    for (let i = 0; i < length; i++) {
        let dailyPlays;
        const noise = (Math.random() - 0.5) * 300;
        const progress = i / length;

        switch (trend) {
            case 'up':
                dailyPlays = startPlays * (1 + progress * 2); // Strong upward trend
                break;
            case 'down':
                dailyPlays = startPlays * (2 - progress * 1.5); // Downward trend
                break;
            case 'new':
                dailyPlays = startPlays * progress * 5; // Starts low, grows fast
                break;
            case 'stable':
            default:
                dailyPlays = startPlays + Math.sin(i / 5) * 500; // Stable with weekly cycles
                break;
        }
        history.push(Math.max(0, Math.round(dailyPlays + noise)));
    }
    return history;
}

/**
 * Generates a full set of mock data for ranking.
 * @returns {Object[]} An array of track objects with mock data.
 */
export function generateMockData() {
    return trackNames.map((track, index) => {
        const trends = ['new', 'up', 'stable', 'down'];
        const trend = trends[index % 4];
        
        const weeksOnChart = trend === 'new' ? 0 : Math.floor(Math.random() * 15) + 1;
        const dailyPlays = generatePlayHistory(63, trend); // 9 weeks of data

        return {
            ...track,
            dailyPlays,
            weeksOnChart, // t
            peakMomentum: 1.5 + Math.random() * 2, // M_peak
        };
    });
} 