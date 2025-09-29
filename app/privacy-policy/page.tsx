import React from 'react';
import Navbar from '@/app/components/NavbarComponent';
import Footer from '@/app/components/Footer';
import { Shield, Lock, Eye, Database, UserCheck, Mail, Globe, AlertCircle } from 'lucide-react';

export default function PrivacyPolicy() {
    const lastUpdated = "September 29, 2025";

    const sections = [
        {
            icon: <Database className="w-6 h-6" />,
            title: "Information We Collect",
            content: [
                {
                    subtitle: "Personal Information",
                    text: "We collect information you provide directly to us, including your name, email address, and any other information you choose to provide when you create an account, subscribe to our newsletter, or contact us."
                },
                {
                    subtitle: "Usage Information",
                    text: "We automatically collect certain information about your device and how you interact with our website, including your IP address, browser type, operating system, referring URLs, and pages viewed."
                },
                {
                    subtitle: "Cookies and Tracking",
                    text: "We use cookies and similar tracking technologies to collect information about your browsing activities and preferences. You can control cookies through your browser settings."
                }
            ]
        },
        {
            icon: <Eye className="w-6 h-6" />,
            title: "How We Use Your Information",
            content: [
                {
                    text: "We use the information we collect to provide, maintain, and improve our services, communicate with you, personalize your experience, analyze usage patterns, detect and prevent fraud, and comply with legal obligations."
                }
            ]
        },
        {
            icon: <Lock className="w-6 h-6" />,
            title: "Data Security",
            content: [
                {
                    text: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure."
                }
            ]
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: "Information Sharing",
            content: [
                {
                    subtitle: "Third-Party Services",
                    text: "We may share your information with third-party service providers who perform services on our behalf, such as hosting, analytics, and customer support."
                },
                {
                    subtitle: "Legal Requirements",
                    text: "We may disclose your information if required by law or in response to valid requests by public authorities."
                },
                {
                    subtitle: "Business Transfers",
                    text: "In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction."
                }
            ]
        },
        {
            icon: <UserCheck className="w-6 h-6" />,
            title: "Your Rights",
            content: [
                {
                    text: "You have the right to access, update, or delete your personal information. You can also object to or restrict certain processing of your data. To exercise these rights, please contact us using the information provided below."
                },
                {
                    subtitle: "Data Retention",
                    text: "We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law."
                }
            ]
        },
        {
            icon: <AlertCircle className="w-6 h-6" />,
            title: "Children's Privacy",
            content: [
                {
                    text: "Our services are not directed to children under the age of 13, and we do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete it."
                }
            ]
        },
        {
            icon: <Mail className="w-6 h-6" />,
            title: "Contact Us",
            content: [
                {
                    text: "If you have any questions about this Privacy Policy or our privacy practices, please contact us at privacy@yourwebsite.com or through our contact form."
                }
            ]
        }
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-black">
                {/* Header */}
                <div className="bg-gradient-to-b from-gray-900 to-black border-b border-gray-800">
                    <div className="max-w-4xl mx-auto px-6 py-16">
                        <div className="flex items-center justify-center mb-6">
                            <div className="bg-[#FF5F1F]/10 p-4 rounded-full">
                                <Shield className="w-12 h-12 text-[#FF5F1F]" />
                            </div>
                        </div>
                        <h1 className="text-5xl font-bold text-white text-center mb-4">
                            Privacy <span className="text-[#FF5F1F]">Policy</span>
                        </h1>
                        <p className="text-gray-400 text-center text-lg">
                            Your privacy is important to us. Learn how we collect, use, and protect your information.
                        </p>
                        <p className="text-gray-500 text-center text-sm mt-4">
                            Last Updated: {lastUpdated}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-6 py-12">
                    {/* Introduction */}
                    <div className="mb-12 p-6 bg-gray-900 rounded-xl border border-gray-800">
                        <p className="text-gray-300 leading-relaxed">
                            This Privacy Policy describes how we collect, use, disclose, and protect your information when you use our website and services. By accessing or using our services, you agree to the terms of this Privacy Policy.
                        </p>
                    </div>

                    {/* Sections */}
                    <div className="space-y-8">
                        {sections.map((section, index) => (
                            <div
                                key={index}
                                className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-[#FF5F1F]/30 transition-all duration-300"
                            >
                                <div className="p-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="bg-[#FF5F1F]/10 p-3 rounded-lg text-[#FF5F1F] flex-shrink-0">
                                            {section.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-bold text-white mb-4">
                                                {section.title}
                                            </h2>
                                            <div className="space-y-4">
                                                {section.content.map((item, idx) => (
                                                    <div key={idx}>
                                                        {item.subtitle && (
                                                            <h3 className="text-lg font-semibold text-[#FF5F1F] mb-2">
                                                                {item.subtitle}
                                                            </h3>
                                                        )}
                                                        <p className="text-gray-300 leading-relaxed">
                                                            {item.text}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Policy Updates */}
                    <div className="mt-12 p-6 bg-gradient-to-r from-[#FF5F1F]/10 to-transparent rounded-xl border border-[#FF5F1F]/20">
                        <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-[#FF5F1F]" />
                            Changes to This Policy
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically for any changes.
                        </p>
                    </div>

                    {/* Footer CTA */}
                    <div className="mt-12 text-center">
                        <p className="text-gray-400 mb-6">
                            Have questions about our privacy practices?
                        </p>
                        <button className="bg-[#FF5F1F] text-black px-8 py-3 rounded-lg font-semibold hover:bg-[#f59772] transition-colors inline-flex items-center gap-2">
                            <Mail className="w-5 h-5" />
                            Contact Us
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}