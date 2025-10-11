"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Send, Loader2, ExternalLink, BarChart3, MessageSquare } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

interface RedditComment {
  comment: string;
  tag: 'positive' | 'negative' | 'neutral';
  link: string;
  author?: string;
  subreddit?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  productTitle?: string;
  comments?: RedditComment[];
  isLoading?: boolean;
}

export default function RedditReviewsGenerator() {
  const [productTitle, setProductTitle] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      type: 'system',
      content: '👋 Welcome to Reddit Reviews Generator! Enter a product title (max 5 words) to get started.',
      timestamp: new Date(),
    },
    {
      id: 'howto-2',
      type: 'system',
      content: 'How it works: \n  Enter a product name → AI searches Reddit \n  → Analyzes 30-50 comments \n  → Returns sentiment analysis',
      timestamp: new Date(),
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [messageCounter, setMessageCounter] = useState(3);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Validate product title (max 5 words)
  const validateTitle = (title: string): boolean => {
    const words = title.trim().split(/\s+/);
    return words.length <= 5 && words.length > 0 && words.every(word => word.length > 0);
  };

  // Add message to chat with unique ID
  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${messageCounter}-${Date.now()}`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    setMessageCounter(prev => prev + 1);
    return newMessage.id;
  };

  // Update message
  const updateMessage = (id: string, updates: Partial<ChatMessage>) => {
    setMessages(prev => prev.map(msg =>
      msg.id === id ? { ...msg, ...updates } : msg
    ));
  };

  // Generate reviews
  const generateReviews = async () => {
    if (!validateTitle(productTitle)) {
      addMessage({
        type: 'system',
        content: '❌ Please enter a product title with maximum 5 words',
      });
      return;
    }

    // Add user message
    addMessage({
      type: 'user',
      content: productTitle,
      productTitle,
    });

    // Add loading message
    const loadingId = addMessage({
      type: 'bot',
      content: 'Searching Reddit for comments about "' + productTitle + '"...',
      isLoading: true,
    });

    setLoading(true);
    setProductTitle('');

    try {
      const response = await fetch('/api/reddit-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productTitle }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate reviews');
      }

      const data = await response.json();

      // Update loading message with results
      updateMessage(loadingId, {
        content: `✅ Generated ${data.comments.length} reviews for "${productTitle}"`,
        comments: data.comments,
        isLoading: false,
      });

    } catch (err) {
      updateMessage(loadingId, {
        content: `❌ Failed to generate reviews: ${err instanceof Error ? err.message : 'An error occurred'}`,
        isLoading: false,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const words = value.trim().split(/\s+/);

    if (words.length <= 5) {
      setProductTitle(value);
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      generateReviews();
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (comments: RedditComment[]) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(comments, null, 2));
      addMessage({
        type: 'system',
        content: '📋 Copied to clipboard!',
      });
    } catch (err) {
      addMessage({
        type: 'system',
        content: '❌ Failed to copy to clipboard',
      });
    }
  };

  // Get tag color
  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      case 'neutral': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const wordCount = productTitle.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="min-h-screen bg-gray-50 w-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 w-full">
        <div className="w-full px-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            Reddit Reviews Generator
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            AI-powered sentiment analysis from Reddit comments
          </p>
        </div>
      </div>

      {/* Chat Messages - Flexible area */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="w-full px-6 py-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              {/* User Message */}
              {message.type === 'user' && (
                <div className="flex justify-end">
                  <div className="max-w-xs lg:max-w-md">
                    <div className="bg-blue-600 text-white rounded-lg px-4 py-2">
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Bot Message */}
              {message.type === 'bot' && (
                <div className="flex justify-start">
                  <div className="w-full max-w-5xl">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        {message.isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        ) : (
                          <BarChart3 className="w-4 h-4 text-blue-600" />
                        )}
                        <p className="text-sm font-medium">{message.content}</p>
                      </div>

                      {/* Comments Display */}
                      {message.comments && message.comments.length > 0 && (
                        <div className="mt-4">
                          {/* Copy Button */}
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium text-gray-900">
                              Reviews ({message.comments.length})
                            </h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(message.comments!)}
                              className="flex cursor-pointer items-center gap-2 bg-white"
                            >
                              <Copy className="w-3 h-3 bg-white" />
                              Copy Array
                            </Button>
                          </div>

                          {/* Statistics */}
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <div className="text-lg font-bold text-green-600">
                                {message.comments.filter(c => c.tag === 'positive').length}
                              </div>
                              <div className="text-xs text-green-700">Positive</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-lg font-bold text-gray-600">
                                {message.comments.filter(c => c.tag === 'neutral').length}
                              </div>
                              <div className="text-xs text-gray-700">Neutral</div>
                            </div>
                            <div className="text-center p-3 bg-red-50 rounded-lg">
                              <div className="text-lg font-bold text-red-600">
                                {message.comments.filter(c => c.tag === 'negative').length}
                              </div>
                              <div className="text-xs text-red-700">Negative</div>
                            </div>
                          </div>

                          {/* Comments List */}
                          <div className="space-y-3">
                            {message.comments.map((comment, index) => (
                              <div
                                key={`${message.id}-comment-${index}`}
                                className="p-3 border border-gray-100 rounded-lg bg-gray-50"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <Badge className={getTagColor(comment.tag)}>
                                    {comment.tag.toUpperCase()}
                                  </Badge>
                                  <a
                                    href={comment.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    <span className="text-xs">View</span>
                                  </a>
                                </div>
                                <p className="text-gray-800 text-sm leading-relaxed mb-2">
                                  {comment.comment}
                                </p>
                                {comment.author && (
                                  <div className="text-xs text-gray-500">
                                    by u/{comment.author}
                                    {comment.subreddit && ` in r/${comment.subreddit}`}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )}

              {/* System Message */}
              {message.type === 'system' && (
                <div className="flex justify-center">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                    <p className="text-sm text-yellow-800 whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input Area */}
      <div className="fixed bottom-0  z-9999 left-10 right-0 flex justify-center items-center p-4">
        <div className="flex justify-center items-center w-full">
          <div className="flex items-center bg-white space-x-3" style={{ width: '1024px' }}>
            <div className="flex-1">
              <Input
                type="text"
                value={productTitle}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter product title (max 5 words)..."
                style={{
                  width: '100%',
                  background: 'transparent',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                className="min-h-[44px] bg-white px-4 py-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <Button
              onClick={generateReviews}
              disabled={loading || !validateTitle(productTitle)}
              className="min-h-[44px] px-4 bg-[#FF5F1F] text-black cursor-pointer hover:bg-[#f59772] disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}