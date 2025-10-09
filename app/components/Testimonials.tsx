// TestimonialSection.tsx
'use client';

import React from 'react';
import { Quote } from 'lucide-react';
import { testimonialsData, testimonialConfig } from './testimonials.data';

const TestimonialSection: React.FC = () => {
  if (!testimonialsData || testimonialsData.length === 0) {
    return null;
  }

  const { title, subtitle, primaryColor, backgroundColor } = testimonialConfig;

  return (
    <section className="py-20 px-4" style={{ backgroundColor }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: primaryColor }}
          >
            {title}
          </h2>
          <p className="text-gray-600 text-lg">
            {subtitle}
          </p>
        </div>

        {/* Testimonials Column */}
        <div className="space-y-6">
          {testimonialsData.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8 relative overflow-hidden border-2 border-gray-100 hover:shadow-xl transition-all"
            >
              {/* Quote Icon */}
              <div 
                className="absolute top-4 right-4 opacity-10"
                style={{ color: primaryColor }}
              >
                <Quote size={60} fill={primaryColor} />
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Avatar and User Info */}
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {testimonial.username}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {testimonial.timeAgo}
                    </p>
                  </div>
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-gray-700 text-base md:text-lg leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;