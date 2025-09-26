'use client';

import React from 'react';
import Navbar from '@/app/components/NavbarComponent';
import Footer from '@/app/components/Footer';

const AboutUsPage: React.FC = () => {
  const stats = [
    { number: '100K+', label: 'Products Analyzed', icon: '📊' },
    { number: '50+', label: 'Categories Covered', icon: '🏷️' },
    { number: '1M+', label: 'User Discussions', icon: '💬' },
    { number: '99%', label: 'Accuracy Rate', icon: '🎯' }
  ];

  const values = [
    {
      icon: '🔍',
      title: 'Transparency',
      description: 'We believe in complete transparency. Our scoring algorithms are open, our data sources are clear, and our methodology is straightforward.'
    },
    {
      icon: '👥',
      title: 'Community-Driven',
      description: 'Real people, real experiences. We aggregate authentic discussions from users who have actually purchased and tested the products.'
    },
    {
      icon: '⚡',
      title: 'Always Current',
      description: 'Our data is refreshed weekly to ensure you get the most up-to-date recommendations based on recent user experiences.'
    },
    {
      icon: '🎯',
      title: 'Precision',
      description: 'We use advanced algorithms to analyze sentiment, specificity, and credibility to deliver the most accurate product recommendations.'
    }
  ];

  const team = [
    {
      name: 'Data Analytics Team',
      role: 'Algorithm Development',
      description: 'Our data scientists work continuously to improve our recommendation algorithms and ensure accuracy.'
    },
    {
      name: 'Research Team',
      role: 'Market Analysis',
      description: 'Dedicated researchers who monitor trends and identify new product categories to cover.'
    },
    {
      name: 'Community Team',
      role: 'User Experience',
      description: 'Focused on understanding user needs and improving the platform based on feedback.'
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ background: 'linear-gradient(to right, #FF5F1F, #FF8C00)' }}></div>
          <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
            <div className="inline-block mb-6 px-4 py-2 rounded-full border" style={{ backgroundColor: '#FF5F1F20', borderColor: '#FF5F1F50' }}>
              <span className="text-sm font-medium" style={{ color: '#FF5F1F' }}>About Our Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black mb-6 text-white leading-tight">
              Cutting Through The
              <br />
              <span style={{ color: '#FF5F1F' }}>Marketing Noise</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              We&apos;re on a mission to help you make smarter purchasing decisions by analyzing real user experiences and cutting through sponsored reviews and marketing hype.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold mb-1" style={{ color: '#FF5F1F' }}>{stat.number}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              In a world flooded with sponsored content and biased reviews, we believe consumers deserve access to genuine, 
              unfiltered opinions from real users. We aggregate and analyze authentic discussions to provide you with 
              data-driven product recommendations you can trust.
            </p>
          </div>

          {/* How We Work Section */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-white text-center mb-12">How We Work</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: '#FF5F1F' }}>
                  🔄
                </div>
                <h4 className="text-xl font-semibold text-white mb-4">Data Collection</h4>
                <p className="text-gray-300">
                  We continuously monitor and collect user discussions from authentic online communities where real buyers share their experiences.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: '#FF5F1F' }}>
                  🤖
                </div>
                <h4 className="text-xl font-semibold text-white mb-4">Analysis</h4>
                <p className="text-gray-300">
                  Our algorithms analyze sentiment, specificity, and credibility to identify the most reliable and helpful recommendations.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: '#FF5F1F' }}>
                  📈
                </div>
                <h4 className="text-xl font-semibold text-white mb-4">Ranking</h4>
                <p className="text-gray-300">
                  We compile transparent rankings based on real user feedback, giving you clear insights into what products actually deliver.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-white text-center mb-12">Our Values</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-opacity-30 transition-all duration-300" style={{ borderColor: '#FF5F1F30' }}>
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h4 className="text-2xl font-bold text-white mb-4">{value.title}</h4>
                  <p className="text-gray-300 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-white text-center mb-12">Our Team</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl" style={{ backgroundColor: '#FF5F1F20', border: '2px solid #FF5F1F' }}>
                    👨‍💻
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{member.name}</h4>
                  <p className="font-semibold mb-4" style={{ color: '#FF5F1F' }}>{member.role}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{member.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="rounded-3xl p-8 border text-center" style={{ backgroundColor: '#FF5F1F10', borderColor: '#FF5F1F30' }}>
            <h3 className="text-3xl font-bold text-white mb-6">Why Choose Our Platform?</h3>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="text-xl font-semibold text-white mb-4">✅ No Sponsored Content</h4>
                <p className="text-gray-300 mb-6">
                  We don&apos;t accept payment for rankings. Our recommendations are based purely on user data and analysis.
                </p>
                
                <h4 className="text-xl font-semibold text-white mb-4">✅ Transparent Methodology</h4>
                <p className="text-gray-300">
                  Our scoring system is open and clear. You can understand exactly how we arrive at our recommendations.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-4">✅ Real User Focus</h4>
                <p className="text-gray-300 mb-6">
                  We aggregate opinions from people who have actually purchased and used the products, not professional reviewers.
                </p>
                
                <h4 className="text-xl font-semibold text-white mb-4">✅ Always Free</h4>
                <p className="text-gray-300">
                  Access to our research and rankings will always be free for consumers who just want to make better buying decisions.
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <a
                href="#"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
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
                Start Exploring Products
              </a>
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
      <Footer />
    </>
  );
};

export default AboutUsPage;