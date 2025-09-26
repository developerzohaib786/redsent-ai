'use client';

import React, { useState } from 'react';
import Navbar from '@/app/components/NavbarComponent';
import Footer from '@/app/components/Footer';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: 'Why can\'t I trust the top results on Google or Amazon anymore?',
      answer: 'You\'re not alone. Many top reviews are sponsored, overly optimistic, or written by people who haven\'t genuinely used the product. Our platform solves this by aggregating and analyzing thousands of real, unfiltered discussions from authentic user communities. We cut through the marketing noise to show you what real people actually think.'
    },
    {
      question: 'How do I know these recommendations are from real users?',
      answer: 'We don\'t rely on professional critics or paid reviews. Our entire system is built on data from massive online communities known for honest, crowd-sourced advice. We track mentions, sentiments, and specific model recommendations from people who have already bought and tested the products you\'re researching.'
    },
    {
      question: 'How do you calculate your scores and rankings?',
      answer: 'We use a transparent scoring algorithm that analyzes real user discussions. It weighs factors like the volume of positive mentions, the specificity of the recommendation (e.g., mentioning a exact model number), and the ratio of positive to negative feedback. Essentially, we do the math to quantify the "wisdom of the crowd."'
    },
    {
      question: 'Is the data up-to-date with the latest products and opinions?',
      answer: 'Yes. Our data is continuously refreshed. We analyze discussions from the past year and update our rankings weekly. This ensures our recommendations reflect the most current user experiences and recent market releases, so you\'re not looking at outdated "best picks."'
    },
    {
      question: 'I have a very specific need. Can your site help with that?',
      answer: 'Absolutely. Beyond overall "best" lists, we provide filtered recommendations for specific use cases. Whether you need the "best for small kitchens," "top for competitive gaming," or "most durable for travel," our categories help you find the perfect product for your exact situation.'
    },
    {
      question: 'How can I suggest a product category for you to cover?',
      answer: 'We love hearing from our users! The best way to suggest a category is to join our community on social media or contact us through our website. Your feedback directly influences what we research next.'
    },
    {
      question: 'How is this service free? How does the site support itself?',
      answer: 'Access to our research and rankings will always be free. We are supported through affiliate commissions. This means if you find a product you like and purchase it through our links, we may earn a small fee at no extra cost to you. This allows us to keep the lights on and continue providing unbiased, data-driven recommendations.'
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
   <>
   <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: 'linear-gradient(to right, #FF5F1F, #FF8C00)' }}></div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full border" style={{ backgroundColor: '#FF5F1F20', borderColor: '#FF5F1F50' }}>
            <span className="text-sm font-medium" style={{ color: '#FF5F1F' }}>Frequently Asked Questions</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-white leading-tight">
            Frequently Asked<br />
            <span style={{ color: '#FF5F1F' }}>Questions</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Got questions about our product recommendation platform? We&apos;ve got the answers you need to make smarter purchasing decisions.
          </p>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">Real user data</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">Updated weekly</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">Always free</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-20">
        <div className="grid gap-6">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:shadow-2xl"
              style={{ 
                borderColor: openIndex === index ? '#FF5F1F' : '',
                boxShadow: openIndex === index ? `0 25px 50px -12px #FF5F1F40` : ''
              }}
              onMouseEnter={(e) => {
                if (openIndex !== index) {
                  e.currentTarget.style.borderColor = '#FF5F1F50';
                  e.currentTarget.style.boxShadow = '0 25px 50px -12px #FF5F1F20';
                }
              }}
              onMouseLeave={(e) => {
                if (openIndex !== index) {
                  e.currentTarget.style.borderColor = '';
                  e.currentTarget.style.boxShadow = '';
                }
              }}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full text-left p-8 hover:bg-white/5 transition-all duration-300"
              >
                <div className="flex justify-between items-start gap-4">
                  <h2 className="text-xl font-bold text-white transition-colors duration-300 pr-4" style={{ color: openIndex === index ? '#FF5F1F' : '' }}>
                    {item.question}
                  </h2>
                  <div 
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transform transition-all duration-300 ${
                      openIndex === index ? 'rotate-180 scale-110' : 'group-hover:scale-110'
                    }`}
                    style={{ backgroundColor: '#FF5F1F' }}
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-8 pb-8">
                  <div className="h-px mb-6" style={{ background: 'linear-gradient(to right, #FF5F1F80, transparent)' }}></div>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="rounded-3xl p-8 border" style={{ backgroundColor: '#FF5F1F10', borderColor: '#FF5F1F30' }}>
            <h3 className="text-2xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-300 mb-8 text-lg">
              Explore our platform to discover the products that best match your needs and preferences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-white overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
                style={{ 
                  backgroundColor: '#FF5F1F',
                  boxShadow: '0 0 0 0 #FF5F1F30'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 25px 50px -12px #FF5F1F50';
                  e.currentTarget.style.backgroundColor = '#FF4500';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 0 #FF5F1F30';
                  e.currentTarget.style.backgroundColor = '#FF5F1F';
                }}
              >
                <span className="relative z-10">Explore Platform</span>
              </a>
              
              <button className="inline-flex items-center justify-center px-8 py-4 bg-white/5 border border-white/20 rounded-full font-semibold text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300">
                Browse Categories
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse opacity-20" 
          style={{ backgroundColor: '#FF5F1F' }}
        ></div>
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse opacity-20" 
          style={{ backgroundColor: '#FF5F1F', animationDelay: '2s' }}
        ></div>
      </div>
    </div>
    <Footer/>
   </>
  );
};

export default FAQPage;