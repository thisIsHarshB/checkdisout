'use client';
import React from 'react';
import { jsPDF } from 'jspdf';

interface Props {
  user: any;
  achievements: any[];
  projects: any[];
  participations: any[];
  selected: Record<string, boolean>;
  disabled?: boolean;
}

const PortfolioPDFDownloadButton: React.FC<Props> = ({ user, achievements, projects, participations, selected, disabled }) => {
  const [loading, setLoading] = React.useState(false);

  const handleExport = () => {
    setLoading(true);
    const doc = new jsPDF();
    let y = 10;
    const pageHeight = 297; // mm, A4
    const margin = 10;
    const maxY = pageHeight - margin;
    const lineHeight = 7;
    const addLine = (text: string, fontStyle: 'normal' | 'bold' | 'italic' = 'normal', fontSize = 12, indent = 0) => {
      if (y > maxY) {
        doc.addPage();
        y = margin;
      }
      doc.setFont('helvetica', fontStyle);
      doc.setFontSize(fontSize);
      doc.text(text, 10 + indent, y);
      y += lineHeight;
    };

    // Always include name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    addLine(user?.name || '', 'bold', 18);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    addLine(user?.email || '', 'normal', 12);
    if (user?.bio) {
      addLine(user.bio, 'italic', 12);
    }

    // Always include qualities
    if (user?.qualities && user.qualities.length > 0) {
      addLine('Qualities:', 'bold', 14);
      user.qualities.forEach((q: string) => addLine(`- ${q}`, 'italic', 12, 2));
    }

    // Always include skills
    if (user?.skills && user.skills.length > 0) {
      addLine('Skills:', 'bold', 14);
      user.skills.forEach((s: string) => addLine(`- ${s}`, 'italic', 12, 2));
    }

    // Always include socials
    const socials = [
      { label: 'GitHub', value: user?.github },
      { label: 'LinkedIn', value: user?.linkedin },
      { label: 'Twitter', value: user?.twitter },
      { label: 'Instagram', value: user?.instagram },
      { label: 'Website', value: user?.website },
    ];
    const filteredSocials = socials.filter(s => s.value);
    if (filteredSocials.length > 0) {
      addLine('Socials:', 'bold', 14);
      filteredSocials.forEach(s => addLine(`${s.label}: ${s.value}`, 'normal', 12, 2));
    }

    // Achievements
    if (selected.achievements && achievements && achievements.length > 0) {
      addLine('Achievements', 'bold', 16);
      achievements.forEach(a => {
        if (a?.title) addLine(`Title: ${a.title}`, 'bold', 12);
        if (a?.position) addLine(`Position: ${a.position}`, 'normal', 12, 2);
        if (a?.eventName) addLine(`Event: ${a.eventName}`, 'normal', 12, 2);
        if (a?.eventDate) {
          const date = new Date(a.eventDate).toLocaleDateString();
          addLine(`Date: ${date}`, 'normal', 12, 2);
        }
        if (a?.eventType) addLine(`Type: ${a.eventType.charAt(0).toUpperCase() + a.eventType.slice(1)}`, 'normal', 12, 2);
        addLine(`Effort: ${a.isSolo ? 'Solo' : 'Team'}`, 'normal', 12, 2);
        if (a?.description) {
          addLine('Description:', 'bold', 12, 2);
          addLine(a.description, 'italic', 12, 4);
        }
        if (a?.certificateUrl) addLine(`Certificate: ${a.certificateUrl}`, 'italic', 12, 2);
        if (a?.tags && a.tags.length > 0) addLine('Tags: ' + a.tags.join(', '), 'italic', 12, 2);
        y += 2;
      });
    }

    // Projects
    if (selected.projects && projects && projects.length > 0) {
      addLine('Projects', 'bold', 16);
      projects.forEach(p => {
        if (p?.name) addLine(`Name: ${p.name}`, 'bold', 12);
        if (p?.description) {
          addLine('Description:', 'bold', 12, 2);
          addLine(p.description, 'italic', 12, 4);
        }
        if (p?.technologies && p.technologies.length > 0) addLine('Technologies: ' + p.technologies.join(', '), 'italic', 12, 2);
        addLine(`Type: ${p.isSolo ? 'Solo Project' : 'Team Project'}`, 'normal', 12, 2);
        if (!p.isSolo && p.teamMembers && p.teamMembers.length > 0) {
          addLine('Team Members:', 'bold', 12, 2);
          p.teamMembers.forEach((m: any) => addLine(`- ${m.name}${m.role ? ' (' + m.role + ')' : ''}`, 'italic', 12, 4));
        }
        if (p?.tags && p.tags.length > 0) addLine('Tags: ' + p.tags.join(', '), 'italic', 12, 2);
        if (p?.githubUrl) addLine('GitHub: ' + p.githubUrl, 'italic', 12, 2);
        y += 2;
      });
    }

    // Participations
    if (selected.participations && participations && participations.length > 0) {
      addLine('Participations', 'bold', 16);
      participations.forEach(p => {
        if (p?.title) addLine(`Title: ${p.title}`, 'bold', 12);
        if (p?.eventName) addLine(`Event: ${p.eventName}`, 'normal', 12, 2);
        if (p?.eventDate) {
          const date = new Date(p.eventDate).toLocaleDateString();
          addLine(`Date: ${date}`, 'normal', 12, 2);
        }
        if (p?.eventType) addLine(`Type: ${p.eventType.charAt(0).toUpperCase() + p.eventType.slice(1)}`, 'normal', 12, 2);
        addLine(`Effort: ${p.isSolo ? 'Solo' : 'Team'}`, 'normal', 12, 2);
        if (p?.description) {
          addLine('Description:', 'bold', 12, 2);
          addLine(p.description, 'italic', 12, 4);
        }
        if (p?.certificateUrl) addLine(`Certificate: ${p.certificateUrl}`, 'italic', 12, 2);
        if (p?.tags && p.tags.length > 0) addLine('Tags: ' + p.tags.join(', '), 'italic', 12, 2);
        y += 2;
      });
    }

    // Always include CheckDisOut promo message
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 255, 255);
    addLine('This PDF was made using CheckDisOut (CDO).', 'normal', 12);
    y += 7;
    addLine('Create your own beautiful portfolio PDF at:', 'normal', 12);
    y += 7;
    doc.setTextColor(0, 0, 255);
    doc.textWithLink('https://checkdisout.com', 10, y, { url: 'https://checkdisout.com' });
    doc.setTextColor(0, 0, 0);

    doc.save('portfolio.pdf');
    setLoading(false);
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading || disabled}
      className={`w-full py-3 rounded-lg font-bold text-lg transition-all shadow-[0_0_12px_rgba(0,255,255,0.15)] ${loading || disabled ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-[#00fff7] text-black hover:bg-cyan-300'}`}
    >
      {loading ? 'Generating PDF...' : 'Export PDF'}
    </button>
  );
};

export default PortfolioPDFDownloadButton; 