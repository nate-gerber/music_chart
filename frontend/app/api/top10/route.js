import { NextResponse } from 'next/server';
import { generateMockData } from './mock-data';
import { calculateAdjustedScore } from './ranking-algorithm';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        // Define the default constants
        const defaultConstants = {
            w1: 1.0,
            w2: 2.5,
            C: 3.0,
            tau: 20,
            beta: 0.04,
            epsilon: 1e-6
        };

        // Override defaults with any valid query parameters
        const constants = {
            w1: searchParams.has('w1') ? parseFloat(searchParams.get('w1')) : defaultConstants.w1,
            w2: searchParams.has('w2') ? parseFloat(searchParams.get('w2')) : defaultConstants.w2,
            C: searchParams.has('C') ? parseFloat(searchParams.get('C')) : defaultConstants.C,
            tau: searchParams.has('tau') ? parseFloat(searchParams.get('tau')) : defaultConstants.tau,
            beta: searchParams.has('beta') ? parseFloat(searchParams.get('beta')) : defaultConstants.beta,
            epsilon: defaultConstants.epsilon
        };

        // 1. Generate the hypothetical data
        const allTracks = generateMockData();

        // 2. Calculate the adjusted score for each track
        allTracks.forEach(track => {
            track.adjustedScore = calculateAdjustedScore(track, constants);
        });

        // 3. Sort tracks by the new score in descending order
        const rankedTracks = allTracks.sort((a, b) => b.adjustedScore - a.adjustedScore);

        // 4. Return the top 10
        const top10 = rankedTracks.slice(0, 10);

        return NextResponse.json(top10);

    } catch (error) {
        console.error("Error in top10 route:", error);
        return NextResponse.json({ error: "Failed to generate top 10 chart", details: error.message }, { status: 500 });
    }
}