'use client';

import { useUserData } from '@/lib/context/UserDataContext';
import { Github, Linkedin, Twitter, Globe, Instagram } from 'lucide-react';

export default function DashboardPage() {
  const { user, stats, isLoading } = useUserData();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>No user data found.</div>;

  // Directly use user.age
  const age = (user as any).age || '';

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="flex flex-col pt-6 items-center">
        <h2 className="text-2xl text-[#f1ffe7] font-semibold mb-2 tracking-wide" style={{ fontFamily: 'var(--font-space-grotesk)' }}>CheckDisOut - Portfolio</h2>
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="rounded-full border-1 border-[#00d4ff] shadow-lg overflow-hidden w-48 h-48 flex items-center justify-center bg-black" style={{ boxShadow: '0 0 0 6px ##00D4FF, 0 0 30px #00D4FF' }}>
              <img src={user.profilePictureURL || '/profile.jpg'} alt={user.name} className="w-44 h-44 object-cover rounded-full" />
            </div>
          </div>
          {/* Profile Text */}
          <div className="flex-1 flex flex-col md:items-start mt-6 md:mt-0">
            <h1 className="text-3xl font-bold mb-2 rise-up">This is, <span className="italic font-normal underline decoration-[#791E94]">{user.name}</span></h1>
            <h2 className="text-2xl font-bold mb-2">I am a <span className="italic font-normal underline decoration-[#791E94]">{user.qualities?.join(', ')}</span></h2>
            <h2 className="text-2xl font-bold mb-4">I am <span className="underline font-normal decoration-[#791E94]">{age}</span> years old.</h2>
            <div className="flex gap-6 mb-4">
              {user.github && user.github.trim() && (
                <a href={user.github.startsWith('http') ? user.github : `https://${user.github}`} className="text-white hover:text-cyan-300 text-2xl" target="_blank" rel="noopener noreferrer"><Github /></a>
              )}
              {user.linkedin && user.linkedin.trim() && (
                <a href={user.linkedin.startsWith('http') ? user.linkedin : `https://${user.linkedin}`} className="text-white hover:text-cyan-300 text-2xl" target="_blank" rel="noopener noreferrer"><Linkedin /></a>
              )}
              {user.twitter && user.twitter.trim() && (
                <a href={user.twitter.startsWith('http') ? user.twitter : `https://${user.twitter}`} className="text-white hover:text-cyan-300 text-2xl" target="_blank" rel="noopener noreferrer"><Twitter /></a>
              )}
              {user.website && user.website.trim() && (
                <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`} className="text-white hover:text-cyan-300 text-2xl" target="_blank" rel="noopener noreferrer"><Globe /></a>
              )}
              {user.instagram && user.instagram.trim() && (
                <a href={user.instagram.startsWith('http') ? user.instagram : `https://${user.instagram}`} className="text-white hover:text-cyan-300 text-2xl" target="_blank" rel="noopener noreferrer"><Instagram /></a>
              )}
            </div>
          </div>
        </div>
        <div className="border-b-2 border-cyan-400 mt-2 mb-2 mx-auto" style={{ width: 'min(700px, 90%)' }} />
      </div>
      {/* Skills & Achievements */}
      <div className="flex flex-col md:flex-row gap-8 justify-center items-start mt-8 w-full max-w-6xl mx-auto">
        {/* Skills */}
        <div className="flex-1 bg-[#23241e] rounded-xl p-6 min-w-[320px]">
          <h3 className="text-3xl font-bold text-center mb-4">My Skills</h3>
          <ol className="list-none pl-0">
            {user.skills?.map((skill, i) => (
              <li key={skill} className="flex items-center justify-between text-lg mb-2">
                <span className="italic text-gray-200">{String(i+1).padStart(2, '0')}</span>
                <span className="flex-1 border-b border-dotted border-gray-400 mx-2" />
                <span className="text-gray-100 text-right">{skill}</span>
              </li>
            ))}
          </ol>
        </div>
        {/* Achievements */}
        <div className="flex-1 bg-[#23241e] rounded-xl p-6 min-w-[320px]">
          <h3 className="text-3xl font-bold text-center mb-4">Recent Achievements</h3>
          <div className="flex gap-4 justify-center mb-4">
            {stats.recentAchievements.map((ach, i) => (
              <div key={ach.id} className="w-32 h-40 bg-gray-700 rounded-lg flex flex-col items-center justify-end p-2">
                <div className="w-full h-20 bg-gray-600 rounded mb-2" />
                <div className="text-base font-semibold text-gray-100 text-center truncate w-full">{ach.title}</div>
                <div className="text-xs text-gray-400 text-center truncate w-full">{ach.description}</div>
                <a href={`/achievements/${ach.id}`} className="text-xs text-purple-300 underline mt-1">Read More</a>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4">
            <a
              href="/projects"
              style={{ backgroundColor: '#791E94' }}
              className="flex-1 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors text-center"
            >
              Explore the Projects Gallery
            </a>
            <a
              href="/participations"
              style={{ backgroundColor: '#791E94' }}
              className="flex-1 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors text-center"
            >
              Go to the Participations Panel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 