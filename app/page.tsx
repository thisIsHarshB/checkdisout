'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  Users, 
  Code, 
  FileText, 
  Download, 
  Globe, 
  Github, 
  Linkedin, 
  Mail,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Palette,
  Smartphone,
  Database,
  Cloud
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00fff7]/10 via-transparent to-[#7fffd4]/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold mb-8" style={{ 
              textShadow: '0 0 20px #7fffd4, 0 0 40px #7fffd4',
              fontFamily: "'Space Grotesk', sans-serif"
            }}>
              CheckDisOut
            </h1>
            <p className="text-xl md:text-2xl text-[#bafffa] mb-12 max-w-4xl mx-auto leading-relaxed">
              Your comprehensive portfolio management platform for achievements, participations, and projects. 
              Showcase your professional journey with style and efficiency in one beautiful, organized space.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link 
                href="/login"
                className="inline-flex items-center gap-2 bg-[#00fff7] text-black font-bold px-10 py-5 rounded-lg hover:bg-[#7fffd4] transition-all duration-300 shadow-[0_0_20px_rgba(0,255,255,0.3)] text-lg"
              >
                Get Started
                <ArrowRight className="h-6 w-6" />
              </Link>
              <Link 
                href="#features"
                className="inline-flex items-center gap-2 border-2 border-[#00fff7] text-[#00fff7] font-bold px-10 py-5 rounded-lg hover:bg-[#00fff7]/10 transition-all duration-300 text-lg"
              >
                Learn More
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6">
                <Trophy className="h-12 w-12 text-[#00fff7] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#7fffd4] mb-2">Track Achievements</h3>
                <p className="text-[#bafffa] text-sm">Document your accomplishments and awards</p>
              </div>
              <div className="text-center p-6">
                <Users className="h-12 w-12 text-[#00fff7] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#7fffd4] mb-2">Manage Participations</h3>
                <p className="text-[#bafffa] text-sm">Record events, hackathons, and collaborations</p>
              </div>
              <div className="text-center p-6">
                <Code className="h-12 w-12 text-[#00fff7] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#7fffd4] mb-2">Showcase Projects</h3>
                <p className="text-[#bafffa] text-sm">Display your technical work and skills</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-[#181A16] min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-[#7fffd4]" style={{ textShadow: '0 0 15px #7fffd4' }}>
              Why Choose CheckDisOut?
            </h2>
            <p className="text-xl text-[#bafffa] max-w-4xl mx-auto leading-relaxed">
              A modern platform designed to showcase your professional journey with style and efficiency. 
              Built for developers, designers, and professionals who want to make their mark.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="p-8 bg-[#23272a] rounded-xl shadow-[0_8px_32px_rgba(0,255,255,0.15)] hover:shadow-[0_12px_48px_rgba(0,255,255,0.25)] transition-all duration-300 hover:transform hover:scale-105">
              <Trophy className="h-16 w-16 text-[#00fff7] mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-[#7fffd4]">Achievement Tracking</h3>
              <p className="text-[#bafffa] leading-relaxed">Document and showcase your accomplishments, awards, and recognitions with detailed descriptions, certificates, and supporting evidence. Keep a comprehensive record of your professional milestones.</p>
            </div>

            <div className="p-8 bg-[#23272a] rounded-xl shadow-[0_8px_32px_rgba(0,255,255,0.15)] hover:shadow-[0_12px_48px_rgba(0,255,255,0.25)] transition-all duration-300 hover:transform hover:scale-105">
              <Users className="h-16 w-16 text-[#00fff7] mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-[#7fffd4]">Participation Management</h3>
              <p className="text-[#bafffa] leading-relaxed">Track your event participations, hackathons, workshops, conferences, and team collaborations with comprehensive details including team members, roles, and outcomes.</p>
            </div>

            <div className="p-8 bg-[#23272a] rounded-xl shadow-[0_8px_32px_rgba(0,255,255,0.15)] hover:shadow-[0_12px_48px_rgba(0,255,255,0.25)] transition-all duration-300 hover:transform hover:scale-105">
              <Code className="h-16 w-16 text-[#00fff7] mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-[#7fffd4]">Project Showcase</h3>
              <p className="text-[#bafffa] leading-relaxed">Display your technical projects with technologies used, team information, live demos, and detailed descriptions. Showcase your coding skills and problem-solving abilities.</p>
            </div>

            <div className="p-8 bg-[#23272a] rounded-xl shadow-[0_8px_32px_rgba(0,255,255,0.15)] hover:shadow-[0_12px_48px_rgba(0,255,255,0.25)] transition-all duration-300 hover:transform hover:scale-105">
              <FileText className="h-16 w-16 text-[#00fff7] mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-[#7fffd4]">PDF Export</h3>
              <p className="text-[#bafffa] leading-relaxed">Generate professional PDF portfolios for job applications, presentations, and sharing with stakeholders. Customizable layouts with your branding and professional formatting.</p>
            </div>

            <div className="p-8 bg-[#23272a] rounded-xl shadow-[0_8px_32px_rgba(0,255,255,0.15)] hover:shadow-[0_12px_48px_rgba(0,255,255,0.25)] transition-all duration-300 hover:transform hover:scale-105">
              <Download className="h-16 w-16 text-[#00fff7] mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-[#7fffd4]">Easy Sharing</h3>
              <p className="text-[#bafffa] leading-relaxed">Share your portfolio with potential employers, clients, or collaborators through secure links and exports. Control who sees your information and track engagement.</p>
            </div>

            <div className="p-8 bg-[#23272a] rounded-xl shadow-[0_8px_32px_rgba(0,255,255,0.15)] hover:shadow-[0_12px_48px_rgba(0,255,255,0.25)] transition-all duration-300 hover:transform hover:scale-105">
              <Palette className="h-16 w-16 text-[#00fff7] mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-[#7fffd4]">Modern UI</h3>
              <p className="text-[#bafffa] leading-relaxed">Beautiful neon/cyan themed interface with responsive design that works perfectly on all devices. Intuitive navigation and smooth animations enhance user experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-32 bg-[#121212] min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-[#7fffd4]" style={{ textShadow: '0 0 15px #7fffd4' }}>
              Built with Modern Technologies
            </h2>
            <p className="text-xl text-[#bafffa] max-w-4xl mx-auto leading-relaxed">
              Leveraging cutting-edge technologies for a seamless user experience. 
              Built with scalability, performance, and user experience in mind.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <div className="text-center p-8 bg-[#23272a] rounded-xl shadow-[0_8px_32px_rgba(0,255,255,0.15)] hover:shadow-[0_12px_48px_rgba(0,255,255,0.25)] transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-4xl font-bold text-[#00fff7] mb-4">Next.js</div>
              <p className="text-[#bafffa] text-base leading-relaxed">React Framework with App Router for optimal performance and SEO</p>
            </div>
            <div className="text-center p-8 bg-[#23272a] rounded-xl shadow-[0_8px_32px_rgba(0,255,255,0.15)] hover:shadow-[0_12px_48px_rgba(0,255,255,0.25)] transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-4xl font-bold text-[#00fff7] mb-4">Firebase</div>
              <p className="text-[#bafffa] text-base leading-relaxed">Backend services, authentication, and real-time database</p>
            </div>
            <div className="text-center p-8 bg-[#23272a] rounded-xl shadow-[0_8px_32px_rgba(0,255,255,0.15)] hover:shadow-[0_12px_48px_rgba(0,255,255,0.25)] transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-4xl font-bold text-[#00fff7] mb-4">Tailwind</div>
              <p className="text-[#bafffa] text-base leading-relaxed">Utility-first CSS framework for rapid UI development</p>
            </div>
            <div className="text-center p-8 bg-[#23272a] rounded-xl shadow-[0_8px_32px_rgba(0,255,255,0.15)] hover:shadow-[0_12px_48px_rgba(0,255,255,0.25)] transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-4xl font-bold text-[#00fff7] mb-4">Cloudinary</div>
              <p className="text-[#bafffa] text-base leading-relaxed">Cloud-based image and file management service</p>
            </div>
            <div className="text-center p-8 bg-[#23272a] rounded-xl shadow-[0_8px_32px_rgba(0,255,255,0.15)] hover:shadow-[0_12px_48px_rgba(0,255,255,0.25)] transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-4xl font-bold text-[#00fff7] mb-4">TypeScript</div>
              <p className="text-[#bafffa] text-base leading-relaxed">Type-safe JavaScript for better development experience</p>
            </div>
            <div className="text-center p-8 bg-[#23272a] rounded-xl shadow-[0_8px_32px_rgba(0,255,255,0.15)] hover:shadow-[0_12px_48px_rgba(0,255,255,0.25)] transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-4xl font-bold text-[#00fff7] mb-4">jsPDF</div>
              <p className="text-[#bafffa] text-base leading-relaxed">Client-side PDF generation for portfolio exports</p>
            </div>
            <div className="text-center p-8 bg-[#23272a] rounded-xl shadow-[0_8px_32px_rgba(0,255,255,0.15)] hover:shadow-[0_12px_48px_rgba(0,255,255,0.25)] transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-4xl font-bold text-[#00fff7] mb-4">Lucide</div>
              <p className="text-[#bafffa] text-base leading-relaxed">Beautiful and consistent icon library</p>
            </div>
            <div className="text-center p-8 bg-[#23272a] rounded-xl shadow-[0_8px_32px_rgba(0,255,255,0.15)] hover:shadow-[0_12px_48px_rgba(0,255,255,0.25)] transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-4xl font-bold text-[#00fff7] mb-4">Vercel</div>
              <p className="text-[#bafffa] text-base leading-relaxed">Cloud platform for deployment and hosting</p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-32 bg-[#181A16] min-h-screen flex items-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-12 text-[#7fffd4]" style={{ textShadow: '0 0 15px #7fffd4' }}>
            Meet the Developer
          </h2>
          <div className="bg-[#23272a] rounded-xl p-12 shadow-[0_8px_32px_rgba(0,255,255,0.15)] max-w-4xl mx-auto">
            <h3 className="text-4xl font-bold mb-6 text-[#7fffd4]">Harsh Balolia</h3>
            <p className="text-xl text-[#bafffa] mb-8 leading-relaxed max-w-3xl mx-auto">
              Full-stack developer passionate about creating innovative web applications with modern technologies. 
              Specializing in React, Next.js, and cloud technologies to build scalable and user-friendly solutions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center p-6">
                <Code className="h-12 w-12 text-[#00fff7] mx-auto mb-4" />
                <h4 className="text-lg font-bold text-[#7fffd4] mb-2">Full-Stack Development</h4>
                <p className="text-[#bafffa] text-sm">React, Next.js, Node.js, and modern web technologies</p>
              </div>
              <div className="text-center p-6">
                <Database className="h-12 w-12 text-[#00fff7] mx-auto mb-4" />
                <h4 className="text-lg font-bold text-[#7fffd4] mb-2">Database Design</h4>
                <p className="text-[#bafffa] text-sm">Firebase, Firestore, and cloud database solutions</p>
              </div>
              <div className="text-center p-6">
                <Cloud className="h-12 w-12 text-[#00fff7] mx-auto mb-4" />
                <h4 className="text-lg font-bold text-[#7fffd4] mb-2">Cloud Services</h4>
                <p className="text-[#bafffa] text-sm">AWS, Vercel, and cloud deployment expertise</p>
              </div>
            </div>
            <div className="flex justify-center gap-8">
              <a href="https://github.com/thisIsHarshB" target="_blank" rel="noopener noreferrer" 
                 className="flex items-center gap-3 text-[#00fff7] hover:text-[#7fffd4] transition-colors text-lg">
                <Github className="h-8 w-8" />
                GitHub
              </a>
              <a href="www.linkedin.com/in/harsh-balolia-999429362" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-3 text-[#00fff7] hover:text-[#7fffd4] transition-colors text-lg">
                <Linkedin className="h-8 w-8" />
                LinkedIn
              </a>
              <a href="mailto:harshbalolia2006@gmail.com"
                 className="flex items-center gap-3 text-[#00fff7] hover:text-[#7fffd4] transition-colors text-lg">
                <Mail className="h-8 w-8" />
                Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-[#121212] min-h-screen flex items-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-[#7fffd4]" style={{ textShadow: '0 0 15px #7fffd4' }}>
            Ready to Showcase Your Journey?
          </h2>
          <p className="text-xl text-[#bafffa] mb-12 leading-relaxed max-w-4xl mx-auto">
            Join thousands of professionals who trust CheckDisOut to manage their portfolios. 
            Start building your professional presence today and stand out in the competitive job market.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6">
              <Star className="h-12 w-12 text-[#00fff7] mx-auto mb-4" />
              <h4 className="text-lg font-bold text-[#7fffd4] mb-2">Professional</h4>
              <p className="text-[#bafffa] text-sm">Create polished, professional portfolios</p>
            </div>
            <div className="text-center p-6">
              <Zap className="h-12 w-12 text-[#00fff7] mx-auto mb-4" />
              <h4 className="text-lg font-bold text-[#7fffd4] mb-2">Fast</h4>
              <p className="text-[#bafffa] text-sm">Quick setup and easy management</p>
            </div>
            <div className="text-center p-6">
              <Shield className="h-12 w-12 text-[#00fff7] mx-auto mb-4" />
              <h4 className="text-lg font-bold text-[#7fffd4] mb-2">Secure</h4>
              <p className="text-[#bafffa] text-sm">Your data is safe and private</p>
            </div>
          </div>
          <Link 
            href="/login"
            className="inline-flex items-center gap-3 bg-[#00fff7] text-black font-bold px-12 py-6 rounded-lg hover:bg-[#7fffd4] transition-all duration-300 shadow-[0_0_20px_rgba(0,255,255,0.3)] text-xl"
          >
            Start Building Your Portfolio
            <ArrowRight className="h-7 w-7" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#181A16] border-t border-[#00fff7]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-[#7fffd4]" style={{ textShadow: '0 0 10px #7fffd4' }}>
              CheckDisOut
            </h3>
            <p className="text-[#bafffa] mb-6">
              Your comprehensive portfolio management platform
            </p>
            <div className="flex justify-center gap-6 mb-6">
              <a href="/login" className="text-[#00fff7] hover:text-[#7fffd4] transition-colors">Login</a>
              <a href="#features" className="text-[#00fff7] hover:text-[#7fffd4] transition-colors">Features</a>
              <a href="mailto:harshbalolia@gmail.com" className="text-[#00fff7] hover:text-[#7fffd4] transition-colors">Contact</a>
            </div>
            <p className="text-sm text-[#bafffa]/70">
              © 2024 CheckDisOut. Developed by Harsh Balolia. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
