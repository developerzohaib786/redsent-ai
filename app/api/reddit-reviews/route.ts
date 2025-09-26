import { NextRequest, NextResponse } from 'next/server';

interface RedditComment {
  comment: string;
  tag: 'positive' | 'negative' | 'neutral';
  link: string;
  author?: string;
  subreddit?: string;
}

// Removed unused RedditPost interface

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
    if (words.length > 5 || words.length === 0) {
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

type ExtractedRedditComment = {
  body: string;
  author: string;
  permalink: string;
  subreddit: string;
  score?: number;
};

async function searchRedditComments(productTitle: string, token: string): Promise<ExtractedRedditComment[]> {
  const userAgent = process.env.REDDIT_USER_AGENT;
  const searchQuery = encodeURIComponent(productTitle);
  
  // Search in multiple relevant subreddits
  const subreddits = ['products', 'reviews', 'BuyItForLife', 'gadgets', 'technology', 'AskReddit'];
  const allComments: unknown[] = [];

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
        if (data && data.data && Array.isArray(data.data.children)) {
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
        if (data && data.data && Array.isArray(data.data.children)) {
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
              if (Array.isArray(commentsData) && commentsData[1] && commentsData[1].data && Array.isArray(commentsData[1].data.children)) {
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
  const validComments: ExtractedRedditComment[] = allComments
    .filter((c): c is Record<string, unknown> => typeof c === 'object' && c !== null && 'data' in (c as Record<string, unknown>))
    .map(c => (c as Record<string, unknown>).data as Record<string, unknown>)
    .filter(d => typeof d?.body === 'string' && d.body.length > 20 && d.body.length < 1000 && !String(d.body).includes('[deleted]') && !String(d.body).includes('[removed]'))
    .map(d => {
      const dd = d as Record<string, unknown>;
      const body = typeof dd['body'] === 'string' ? dd['body'] as string : '';
      const author = typeof dd['author'] === 'string' ? dd['author'] as string : 'unknown';
      const permalink = typeof dd['permalink'] === 'string' ? dd['permalink'] as string : '';
      const subreddit = typeof dd['subreddit'] === 'string' ? dd['subreddit'] as string : 'unknown';
      const score = typeof dd['score'] === 'number' ? dd['score'] as number : 0;
      return {
        body: String(body),
        author: String(author),
        permalink: `https://reddit.com${String(permalink)}`,
        subreddit: String(subreddit),
        score,
      } as ExtractedRedditComment;
    });

  // Randomize and limit to 30-50 comments
  const shuffled = validComments.sort(() => 0.5 - Math.random());
  const targetCount = Math.floor(Math.random() * 21) + 30; // 30-50
  return shuffled.slice(0, Math.min(targetCount, shuffled.length));
}

async function processCommentsWithLLM(comments: ExtractedRedditComment[]): Promise<RedditComment[]> {
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
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== 'string') {
      throw new Error('Invalid LLM response');
    }

    // Clean the response and parse JSON
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanedText);

    // Basic runtime validation: expect an array of objects with required fields
    if (!Array.isArray(parsed)) throw new Error('LLM returned non-array');
    const processedComments: RedditComment[] = (parsed as unknown[]).map((p) => {
      const obj = p as Record<string, unknown>;
      return {
        comment: String(obj.comment ?? obj.commentText ?? ''),
        tag: (obj.tag === 'positive' || obj.tag === 'negative') ? (obj.tag as 'positive' | 'negative') : 'neutral',
        link: String(obj.link ?? obj.permalink ?? ''),
        author: typeof obj.author === 'string' ? obj.author : undefined,
        subreddit: typeof obj.subreddit === 'string' ? obj.subreddit : undefined,
      } as RedditComment;
    });

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