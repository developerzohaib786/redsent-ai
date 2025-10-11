import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai'; // 👈 New SDK

// --- Interface Definitions ---

interface RedditReview {
    comment: string;
    tag: 'positive' | 'negative' | 'neutral';
    link: string;
    author: string;
    subreddit: string;
}

interface LikeDislikePoint {
    heading: string;
    points: string[];
}

interface LikesDislikesData {
    likes: LikeDislikePoint[];
    dislikes: LikeDislikePoint[];
}

// --- API Route Handler ---

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { reviews, productTitle } = body;

        // Validate input
        if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Reviews array is required and must not be empty' },
                { status: 400 }
            );
        }

        // Get API key from environment variables, explicitly using GOOGLE_API_KEY
        const googleApiKey = process.env.GOOGLE_API_KEY; // 👈 Updated Variable Name

        if (!googleApiKey) {
            return NextResponse.json(
                { success: false, error: 'GOOGLE_API_KEY environment variable is not configured' }, // 👈 Updated Error Message
                { status: 500 }
            );
        }

        // Initialize the GoogleGenAI instance
        // Pass the key explicitly to ensure the correct environment variable is used.
        const ai = new GoogleGenAI({ apiKey: googleApiKey }); // 👈 Using googleApiKey

        // Prepare the reviews text (limit to first 50 reviews to avoid token limits)
        const limitedReviews = reviews.slice(0, 50);
        const reviewsText = limitedReviews
            .map((review: RedditReview, idx: number) => {
                const commentText = typeof review.comment === 'string' ? review.comment.substring(0, 300) : '';
                return `Review ${idx + 1} (${review.tag}):\n${commentText}\n`;
            })
            .join('\n');

        // Create the prompt
        const prompt = `You are analyzing Reddit reviews for a product${productTitle ? ` called "${productTitle}"` : ''}. Based on these reviews, generate a comprehensive list of likes and dislikes.

Reddit Reviews:
${reviewsText}

Please analyze these reviews and provide:
1. A list of LIKES (positive aspects) - organized by category with headings
2. A list of DISLIKES (negative aspects) - organized by category with headings

For each category (heading), provide 2-4 specific points based on the reviews.

Return the response in the following JSON format ONLY (no markdown, no code blocks):
{
  "likes": [
    {
      "heading": "Category name for positive aspect",
      "points": ["Point 1", "Point 2", "Point 3"]
    }
  ],
  "dislikes": [
    {
      "heading": "Category name for negative aspect",
      "points": ["Point 1", "Point 2", "Point 3"]
    }
  ]
}

Important:
- Create 3-5 categories for likes and 3-5 categories for dislikes
- Each category should have 2-4 specific points
- Base your analysis strictly on the provided reviews
- Use clear, concise headings
- Make points specific and actionable
- Return ONLY the JSON object, no additional text or formatting`;

        // 🚀 Call the Gemini API using the SDK (using gemini-2.5-flash for speed/cost)
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                // Setting temperature low encourages more deterministic, structured output
                temperature: 0.1,
            }
        });

        const text = response.text; // Use .text from the SDK response

        if (typeof text !== 'string') {
            console.error('Invalid response structure from Gemini:', response);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid response from Google Gemini API (non-textual content)',
                    details: response
                },
                { status: 500 }
            );
        }

        // Clean up the response - remove markdown code blocks if present
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // Parse the JSON response
        let likesDislikesData: LikesDislikesData;
        try {
            likesDislikesData = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('Failed to parse AI JSON response:', cleanedText);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Failed to parse AI response. Please try again.',
                    details: cleanedText.substring(0, 500)
                },
                { status: 500 }
            );
        }

        // Validate the structure
        if (!likesDislikesData.likes || !likesDislikesData.dislikes) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid response structure from AI (missing likes/dislikes keys)',
                    data: likesDislikesData
                },
                { status: 500 }
            );
        }

        // Additional validation - ensure arrays exist
        if (!Array.isArray(likesDislikesData.likes) || !Array.isArray(likesDislikesData.dislikes)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Likes and dislikes must be arrays',
                    data: likesDislikesData
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: likesDislikesData,
            message: 'Likes and dislikes generated successfully'
        });

    } catch (error) {
        console.error('Error generating likes and dislikes:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'An error occurred while generating likes and dislikes',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}