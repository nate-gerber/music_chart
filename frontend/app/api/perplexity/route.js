import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  // Check if the API key is loaded
  console.log('Is Perplexity API Key loaded?', !!process.env.PERPLEXITY_API_KEY);

  const { song, artist } = await request.json();

  if (!song || !artist) {
    return NextResponse.json({ error: 'Song and artist are required' }, { status: 400 });
  }

  const prompt = `Find a high-quality image from the internet for the song "${song}" by ${artist}. This could be the album art, a promotional photo, or a live performance shot. Return ONLY the direct URL to the image file (e.g., ending in .jpg, .png).`;

  try {
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'sonar-reasoning-pro',
        messages: [
          { role: 'system', content: "You are an expert image finder. Your task is to find a relevant, high-quality image for a given song and artist from the internet and return only the direct image URL. Do not provide any other text, explanation, or formatting." },
          { role: 'user', content: prompt },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        },
      }
    );

    const rawContent = response.data.choices[0].message.content;
    
    // Regex to find the first URL in the response string
    const urlRegex = /(https?:\/\/[^\s]+)/;
    const match = rawContent.match(urlRegex);
    const imageUrl = match ? match[0] : null;

    if (!imageUrl) {
        console.error("Perplexity API did not return a valid URL. Raw response:", rawContent);
        throw new Error('API did not return a valid image URL.');
    }
    
    return NextResponse.json({ imageUrl });

  } catch (error) {
    console.error('Error fetching from Perplexity API:', error.response ? error.response.data : error.message);
    return NextResponse.json(
        { 
            error: 'Failed to fetch image from Perplexity API', 
            details: error.response ? error.response.data : error.message 
        }, 
        { status: error.response ? error.response.status : 500 }
    );
  }
} 