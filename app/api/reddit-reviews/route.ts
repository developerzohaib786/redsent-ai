import { NextRequest, NextResponse } from 'next/server';

interface RedditComment {
  comment: string;
  tag: 'positive' | 'negative' | 'neutral';
  link: string;
  author?: string;
  subreddit?: string;
}

interface RedditPost {
  data: {
    children: Array<{
      data: {
        body?: string;
        author: string;
        permalink: string;
        subreddit: string;
        score: number;
      };
    }>;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { productTitle } = await request.json();

    if (!productTitle || typeof productTitle !== 'string') {
      return NextResponse.json(
        { error: 'Product title is required' },
        { status: 400 }
      );
    }

    // Validate title (max 3 words)
    const words = productTitle.trim().split(/\s+/);
    if (words.length > 3 || words.length === 0) {
      return NextResponse.json(
        { error: 'Product title must be 1-3 words' },
        { status: 400 }
      );
    }

    // Step 1: Get Reddit access token
    const redditToken = await getRedditAccessToken();
    
    // Step 2: Search Reddit for comments
    const redditComments = await searchRedditComments(productTitle, redditToken);
    
    // Step 3: Process comments with LLM
    const processedComments = await processCommentsWithLLM(redditComments);

    return NextResponse.json({
      success: true,
      comments: processedComments,
      total: processedComments.length
    });

  } catch (error) {
    console.error('Reddit Reviews API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate reviews' },
      { status: 500 }
    );
  }
}

async function getRedditAccessToken(): Promise<string> {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const userAgent = process.env.REDDIT_USER_AGENT;

  if (!clientId || !clientSecret || !userAgent) {
    throw new Error('Reddit API credentials not configured');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': userAgent,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get Reddit access token');
  }

  const data = await response.json();
  return data.access_token;
}

async function searchRedditComments(productTitle: string, token: string): Promise<any[]> {
  const userAgent = process.env.REDDIT_USER_AGENT;
  const searchQuery = encodeURIComponent(productTitle);
  
  // Search in multiple relevant subreddits
  const subreddits = ['products', 'reviews', 'BuyItForLife', 'gadgets', 'technology', 'AskReddit'];
  const allComments: any[] = [];

  for (const subreddit of subreddits) {
    try {
      const response = await fetch(
        `https://oauth.reddit.com/r/${subreddit}/search.json?q=${searchQuery}&sort=relevance&limit=100&type=comment`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-Agent': userAgent!,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.children) {
          allComments.push(...data.data.children);
        }
      }
    } catch (error) {
      console.error(`Error searching in r/${subreddit}:`, error);
    }
  }

  // Also search general posts for comments
  try {
    const response = await fetch(
      `https://oauth.reddit.com/search.json?q=${searchQuery}&sort=relevance&limit=50`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': userAgent!,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.data && data.data.children) {
        // Get comments from these posts
        for (const post of data.data.children.slice(0, 10)) {
          try {
            const commentsResponse = await fetch(
              `https://oauth.reddit.com${post.data.permalink}.json?limit=20`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'User-Agent': userAgent!,
                },
              }
            );

            if (commentsResponse.ok) {
              const commentsData = await commentsResponse.json();
              if (commentsData[1] && commentsData[1].data && commentsData[1].data.children) {
                allComments.push(...commentsData[1].data.children);
              }
            }
          } catch (error) {
            console.error('Error fetching post comments:', error);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error searching general posts:', error);
  }

  // Filter and randomize comments
  const validComments = allComments
    .filter(comment => 
      comment.data && 
      comment.data.body && 
      comment.data.body.length > 20 && 
      comment.data.body.length < 1000 &&
      !comment.data.body.includes('[deleted]') &&
      !comment.data.body.includes('[removed]')
    )
    .map(comment => ({
      body: comment.data.body,
      author: comment.data.author,
      permalink: `https://reddit.com${comment.data.permalink}`,
      subreddit: comment.data.subreddit,
      score: comment.data.score || 0
    }));

  // Randomize and limit to 30-50 comments
  const shuffled = validComments.sort(() => 0.5 - Math.random());
  const targetCount = Math.floor(Math.random() * 21) + 30; // 30-50
  return shuffled.slice(0, Math.min(targetCount, shuffled.length));
}

async function processCommentsWithLLM(comments: any[]): Promise<RedditComment[]> {
  if (comments.length === 0) {
    return [];
  }

  const googleApiKey = process.env.GOOGLE_API_KEY;
  
  if (!googleApiKey) {
    throw new Error('Google API key not configured');
  }

  const prompt = `
Analyze the following Reddit comments and return a JSON array where each comment is classified with sentiment analysis.

For each comment, return an object with:
- comment: the original comment text (clean and readable)
- tag: either "positive", "negative", or "neutral"
- link: the reddit permalink
- author: the username
- subreddit: the subreddit name

Comments to analyze:
${comments.map((c, i) => `
${i + 1}. Comment: "${c.body}"
   Author: ${c.author}
   Link: ${c.permalink}
   Subreddit: ${c.subreddit}
`).join('\n')}

Return only valid JSON array, no additional text:`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${googleApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to process comments with LLM');
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    // Clean the response and parse JSON
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const processedComments = JSON.parse(cleanedText);

    return processedComments;

  } catch (error) {
    console.error('LLM processing error:', error);
    
    // Fallback: basic sentiment analysis
    return comments.map(comment => ({
      comment: comment.body.substring(0, 500),
      tag: getBasicSentiment(comment.body),
      link: comment.permalink,
      author: comment.author,
      subreddit: comment.subreddit
    }));
  }
}

function getBasicSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'best', 'awesome', 'perfect', 'fantastic'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disappointing', 'useless'];
  
  const lowerText = text.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}