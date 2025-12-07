import { NextRequest, NextResponse } from 'next/server';

// Secure Gemini API route - API key stays on server
export async function POST(request: NextRequest) {
  try {
    const { prompt, propertyData, model = 'gemini-1.5-flash' } = await request.json();

    // Get API key from server-side environment variable
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 50,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const result = await response.json();
    const description = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (description) {
      return NextResponse.json({
        success: true,
        description: formatAndOptimizeDescription(description, propertyData)
      });
    }

    return NextResponse.json(
      { error: 'No description generated' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Gemini API route error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Simple formatting function (can be moved to utils)
function formatAndOptimizeDescription(description: string, data: any): string {
  // Clean up the text
  description = description
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Add SEO keywords
  const propertyType = data.jenis_properti || 'properti';
  const location = data.kabupaten || '';

  const seoKeywords = [`${propertyType} ${location}`, `${propertyType} strategis`, `${propertyType} premium`];
  const missingKeywords = seoKeywords.filter(keyword =>
    !description.toLowerCase().includes(keyword.toLowerCase())
  );

  if (missingKeywords.length > 0 && description.length < 900) {
    const selectedClosing = `${propertyType} ${location} - ${missingKeywords.slice(0, 2).join(' dan ')}.`;
    description += `\n\n${selectedClosing}`;
  }

  // Add code listing
  if (data.kode_listing && !description.includes('Kode listing')) {
    description += `\n\nKode listing: ${data.kode_listing}`;
  }

  return description;
}