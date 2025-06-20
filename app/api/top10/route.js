import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  // Mock data to replace Spotify API call
  const mockTracks = [
    { name: 'Track 1', artist: 'Artist A' },
    { name: 'Track 2', artist: 'Artist B' },
    { name: 'Track 3', artist: 'Artist C' },
    { name: 'Track 4', artist: 'Artist D' },
    { name: 'Track 5', artist: 'Artist E' },
    { name: 'Track 6', artist: 'Artist F' },
    { name: 'Track 7', artist: 'Artist G' },
    { name: 'Track 8', artist: 'Artist H' },
    { name: 'Track 9', artist: 'Artist I' },
    { name: 'Track 10', artist: 'Artist J' },
  ];

  return NextResponse.json(mockTracks);

  /*
  const spotifyApiUrl = `https://api.spotify.com/v1/browse/featured-playlists`;

  try {
    const response = await axios.get(spotifyApiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
      },
      params: {
        limit: 1, 
      },
    });

    const playlist = response.data.playlists.items[0];
    if (!playlist) {
      return NextResponse.json({ error: 'No featured playlists found' }, { status: 404 });
    }

    const playlistId = playlist.id;
    const tracksUrl = `https.api.spotify.com/v1/playlists/${playlistId}/tracks`;

    const tracksResponse = await axios.get(tracksUrl, {
      headers: {
        Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
      },
      params: {
        limit: 10,
      },
    });
    
    const tracks = tracksResponse.data.items.map(item => ({
      name: item.track.name,
      artist: item.track.artists.map(artist => artist.name).join(', '),
    }));

    return NextResponse.json(tracks);
  } catch (error) {
    console.error('Error fetching from Spotify API:', error.response ? error.response.data : error.message);
    return NextResponse.json({ error: 'Failed to fetch data from Spotify', details: error.response ? error.response.data : error.message }, { status: error.response ? error.response.status : 500 });
  }
  */
}