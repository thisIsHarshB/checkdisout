"use client"
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import PortfolioPDFDownloadButton from '@/components/pdf/PortfolioPDFDownloadButton';
import { useUserData } from '@/lib/context/UserDataContext';

// Dynamically import PortfolioPDF to avoid SSR issues
const PortfolioPDF = dynamic(() => import('../../../components/pdf/PortfolioPDF'), { ssr: false });

const sectionList = [
  { key: 'achievements', label: 'Achievements' },
  { key: 'projects', label: 'Projects' },
  { key: 'participations', label: 'Participations' },
] as const;

type SectionKey = typeof sectionList[number]['key'];

type SelectedSections = Record<SectionKey, boolean>;

export default function ExportPortfolioPage() {
  const { user, achievements, projects, participations, isLoading, userError, achievementsError, projectsError, participationsError } = useUserData();
  const [selected, setSelected] = useState<SelectedSections>({
    achievements: true,
    projects: true,
    participations: true,
  });
  const [loading, setLoading] = useState(false);
  const hasError = userError || achievementsError || projectsError || participationsError;

  const handleToggle = (key: SectionKey) => {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allUnchecked = !selected.achievements && !selected.projects && !selected.participations;

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans p-6" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
      <div className="max-w-2xl mx-auto p-8 bg-[#181A16] rounded-2xl shadow-[0_0_24px_2px_#00fff7] border-none mt-10 flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-[#7fffd4] text-center mb-4" style={{ textShadow: '0 0 10px #7fffd4, 0 0 20px #7fffd4' }}>
          Export Portfolio PDF
        </h1>
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-cyan-200">Select Sections to Include:</h2>
          <div className="flex flex-col gap-3">
            {sectionList.map((section) => (
              <label key={section.key} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors text-lg font-medium ${selected[section.key] ? 'bg-[#2a2a2e] text-cyan-200 shadow-[0_0_8px_#00fff7]' : 'bg-[#23272a] text-neutral-400'}`} style={{ border: selected[section.key] ? '2px solid #00fff7' : '2px solid #23272a' }}>
                <input
                  type="checkbox"
                  checked={selected[section.key]}
                  onChange={() => handleToggle(section.key)}
                  className="accent-cyan-400 w-5 h-5"
                />
                <span>{section.label}</span>
              </label>
            ))}
          </div>
        </div>
        <PortfolioPDFDownloadButton
          user={user || { name: '', email: '', bio: '' }}
          achievements={achievements}
          projects={projects}
          participations={participations}
          selected={selected}
          disabled={allUnchecked || isLoading || !!hasError}
        />
        {hasError && <div className="text-red-400 text-center font-semibold">Error loading your data. Please try again later.</div>}
      </div>
    </div>
  );
} 