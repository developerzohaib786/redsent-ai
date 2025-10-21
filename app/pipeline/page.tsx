'use client';
import React, { useState } from 'react';
import Navbar from '../components/NavbarComponent';
import Footer from '../components/Footer';
import { Database, Brain, Package, BarChart3, RefreshCw, Shield, ArrowRight, CheckCircle2, TrendingUp, MessageSquare, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function PipelinePage() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const pipelineSteps = [
    {
      id: 1,
      icon: Database,
      title: "Reddit Data Collection",
      color: "bg-[#FF5F1F]",
      hoverColor: "hover:bg-[#E55519]",
      description: "We begin by fetching real Reddit comments through Reddit's public API.",
      details: [
        "Users enter a product name or keyword",
        "The system retrieves top-ranked Reddit threads and user comments",
        "Raw data (username, comment text, timestamp, subreddit) is securely stored"
      ],
      goal: "Gather authentic and unfiltered user opinions from Reddit communities"
    },
    {
      id: 2,
      icon: Brain,
      title: "AI Sentiment Classification",
      color: "bg-[#FF5F1F]",
      hoverColor: "hover:bg-[#E55519]",
      description: "Every comment is passed through our Language Learning Model (LLM) for classification.",
      details: [
        "🟢 Positive – expresses satisfaction or approval",
        "🔵 Neutral – informative or non-emotional tone",
        "🔴 Negative – expresses criticism or dissatisfaction"
      ],
      goal: "Nuanced understanding, capturing even subtle emotions in Reddit discussions"
    },
    {
      id: 3,
      icon: Package,
      title: "Data Processing & Storage",
      color: "bg-[#FF5F1F]",
      hoverColor: "hover:bg-[#E55519]",
      description: "Once the AI completes tagging, data is cleaned and organized.",
      details: [
        "Each comment assigned a sentiment label and confidence score",
        "Cleaned data stored in backend database for visualization",
        "Duplicate or spam comments automatically filtered out"
      ],
      goal: "Create structured dataset as foundation for real-time insights"
    },
    {
      id: 4,
      icon: BarChart3,
      title: "Dashboard Visualization",
      color: "bg-[#FF5F1F]",
      hoverColor: "hover:bg-[#E55519]",
      description: "The processed data powers our interactive analytics dashboard.",
      details: [
        "Sentiment distribution charts (Positive/Negative/Neutral ratios)",
        "Comment timelines showing sentiment shifts over time",
        "Word clouds highlighting trending keywords",
        "Individual comment views with labeled sentiments"
      ],
      goal: "Instantly understand audience perception through visual representation"
    },
    {
      id: 5,
      icon: RefreshCw,
      title: "Continuous Updates & API",
      color: "bg-[#FF5F1F]",
      hoverColor: "hover:bg-[#E55519]",
      description: "Our system is built to scale with automatic updates.",
      details: [
        "Reddit data refreshed periodically to track changing opinions",
        "AI layer connects seamlessly via API keys",
        "Future updates: topic clustering, emotion detection, review summaries"
      ],
      goal: "Enable scalable, real-time market intelligence with seamless integrations"
    }
  ];

  const techStack = [
    { stage: "Data Extraction", desc: "Fetch Reddit threads/comments", tech: "Reddit API" },
    { stage: "AI Processing", desc: "Classify sentiments using LLM", tech: "OpenAI / Gemini API" },
    { stage: "Data Storage", desc: "Store structured data", tech: "MongoDB / Express Backend" },
    { stage: "Visualization", desc: "Display analytics dashboard", tech: "Next.js / React / Tailwind" },
    { stage: "Automation", desc: "Refresh and reprocess data", tech: "Node.js Scheduler" }
  ];

  const outcomes = [
    { icon: TrendingUp, text: "Real Reddit reviews distilled into clear sentiment insights" },
    { icon: MessageSquare, text: "Time-saving automation for market research" },
    { icon: Sparkles, text: "AI-driven visualization transforms raw text into data-backed decisions" }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#FF5F1F] to-[#E55519] rounded-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">AI-Powered Reddit Review Analysis Pipeline</h1>
                <p className="text-slate-600 mt-1">Transform real Reddit discussions into actionable product insights</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Overview Section */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
              <p className="text-slate-700 text-lg leading-relaxed">
                Our intelligent pipeline transforms real Reddit discussions into actionable product insights.
                It automates the entire process—from data extraction to AI-based sentiment labeling and visual
                analytics—giving you a clear view of how people truly feel about your products.
              </p>
            </div>
          </section>

          {/* Pipeline Steps */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">How It Works</h2>

            <div className="space-y-6">
              {pipelineSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = activeStep === step.id;

                return (
                  <div key={step.id} className="relative">
                    <div
                      className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 cursor-pointer ${isActive ? 'border-[#FF5F1F] shadow-xl scale-[1.02]' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      onClick={() => setActiveStep(isActive ? null : step.id)}
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`${step.color} ${step.hoverColor} p-4 rounded-xl transition-colors`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`${step.color} text-white text-sm font-bold px-3 py-1 rounded-full`}>
                                Step {step.id}
                              </span>
                              <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                            </div>

                            <p className="text-slate-600 mb-4">{step.description}</p>

                            {isActive && (
                              <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                  <ul className="space-y-2">
                                    {step.details.map((detail, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-slate-700">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>{detail}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="bg-orange-50 rounded-xl p-4 border border-[#FF5F1F]">
                                  <div className="flex items-start gap-2">
                                    <span className="text-[#E55519] font-semibold">Goal:</span>
                                    <span className="text-slate-800">{step.goal}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <ArrowRight className={`w-6 h-6 transition-transform ${isActive ? 'rotate-90' : ''} text-slate-400`} />
                        </div>
                      </div>
                    </div>

                    {index < pipelineSteps.length - 1 && (
                      <div className="flex justify-center py-4">
                        <div className="w-0.5 h-8 bg-gradient-to-b from-slate-300 to-slate-200"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Data Privacy Section */}
          <section className="mb-16">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 border border-green-200">
              <div className="flex items-start gap-4">
                <Shield className="w-10 h-10 text-green-600 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">Data Privacy & Authenticity</h2>
                  <p className="text-slate-700 text-lg leading-relaxed">
                    We strictly adhere to Reddit&#39;s public data usage policies. All analysis is performed
                    securely using API-based access, ensuring <strong>no personal user data</strong> is
                    stored or misused. The comments remain real—AI only tags their sentiment, preserving authenticity.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Tech Stack Table */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">End-to-End Pipeline Summary</h2>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[#FF5F1F] to-[#E55519] text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Stage</th>
                      <th className="px-6 py-4 text-left font-semibold">Description</th>
                      <th className="px-6 py-4 text-left font-semibold">Technology</th>
                    </tr>
                  </thead>
                  <tbody>
                    {techStack.map((item, index) => (
                      <tr
                        key={index}
                        className={`${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'} hover:bg-orange-50 transition-colors`}
                      >
                        <td className="px-6 py-4 font-semibold text-slate-900">{item.stage}</td>
                        <td className="px-6 py-4 text-slate-700">{item.desc}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-[#D64D15] font-semibold">
                            {item.tech}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Outcomes Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">What You Gain</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {outcomes.map((outcome, index) => {
                const Icon = outcome.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:border-[#FF5F1F] hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className="p-4 bg-gradient-to-br from-[#FF5F1F] to-[#E55519] rounded-full">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-slate-700 text-lg font-medium">{outcome.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <div className="bg-gradient-to-br from-[#FF5F1F] to-[#D64D15] rounded-2xl shadow-2xl p-12">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform RedSent AI?</h2>
              <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
                Start analyzing real customer opinions with our AI-powered pipeline today
              </p>
              <Link href="/categories">
                <button className="bg-white cursor-pointer text-[#FF5F1F] px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-200">
                  Get Started Now
                </button>
              </Link>
            </div>
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}