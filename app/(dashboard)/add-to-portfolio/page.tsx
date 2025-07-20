'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AchievementForm } from '@/components/forms/AchievementForm';
import { ParticipationForm } from '@/components/forms/ParticipationForm';
import { ProjectForm } from '@/components/forms/ProjectForm';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  Trophy, 
  Users, 
  Code, 
  CheckCircle, 
  ArrowLeft,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  addAchievement, 
  addParticipation, 
  addProject 
} from '@/lib/hooks/useFirestore';

type TabType = 'achievement' | 'participation' | 'project';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const tabs: Tab[] = [
  {
    id: 'achievement',
    label: 'Achievement',
    icon: <Trophy className="h-5 w-5" />,
    description: 'Add your wins, competitions, and accomplishments'
  },
  {
    id: 'participation',
    label: 'Participation',
    icon: <Users className="h-5 w-5" />,
    description: 'Track your event participations and experiences'
  },
  {
    id: 'project',
    label: 'Project',
    icon: <Code className="h-5 w-5" />,
    description: 'Showcase your development projects and contributions'
  }
];

export default function AddToPortfolioPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('achievement');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{
    type: TabType;
    title: string;
  } | null>(null);

  const handleAchievementSubmit = async (data: unknown) => {
    setIsSubmitting(true);
    try {
      await addAchievement(data);
      setSuccessData({ type: 'achievement', title: (data as any).title });
      setShowSuccess(true);
    } catch (error) {
      console.error('Error adding achievement:', error);
      // You could add toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleParticipationSubmit = async (data: unknown) => {
    setIsSubmitting(true);
    try {
      await addParticipation(data);
      setSuccessData({ type: 'participation', title: (data as any).title });
      setShowSuccess(true);
    } catch (error) {
      console.error('Error adding participation:', error);
      // You could add toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProjectSubmit = async (data: unknown) => {
    setIsSubmitting(true);
    try {
      await addProject(data);
      setSuccessData({ type: 'project', title: (data as any).name });
      setShowSuccess(true);
    } catch (error) {
      console.error('Error adding project:', error);
      // You could add toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAnother = () => {
    setShowSuccess(false);
    setSuccessData(null);
    // Keep the same tab active for adding another item
  };

  const handleViewAll = () => {
    const routes = {
      achievement: '/achievements',
      participation: '/participations',
      project: '/projects'
    };
    router.push(routes[successData!.type]);
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  if (showSuccess && successData) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-heading font-bold text-foreground mb-4">
              Successfully Added!
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              Your {successData.type} &quot;{successData.title}&quot; has been added to your portfolio.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleAddAnother}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Another {successData.type.charAt(0).toUpperCase() + successData.type.slice(1)}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleViewAll}
                className="gap-2"
              >
                View All {successData.type.charAt(0).toUpperCase() + successData.type.slice(1)}s
              </Button>
              
              <Button
                variant="outline"
                onClick={handleBackToDashboard}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans p-6" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          
          <div>
            <h1 className="text-4xl font-heading font-bold text-foreground">
              Add to Portfolio
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Choose what you'd like to add to your portfolio
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <Card className="p-4 bg-[#181A16] border-none rounded-xl shadow-[0_0_25px_rgba(0,255,255,0.1)]">
          <div className="flex flex-col sm:flex-row gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-start gap-3 px-6 py-5 rounded-2xl transition-all duration-200 border border-transparent group focus:outline-none",
                  activeTab === tab.id
                    ? "bg-[#101212] text-[#00fff7] shadow-[0_0_16px_2px_rgba(0,255,255,0.25)] border-[#00fff7] z-10"
                    : "bg-[#181A16] text-white/90 hover:text-[#00fff7] hover:border-[#00fff7] border-[#23272a] opacity-90"
                )}
                tabIndex={0}
                aria-current={activeTab === tab.id}
                aria-label={tab.label}
              >
                <div className={cn("mt-1", activeTab === tab.id ? "text-[#00fff7]" : "text-white/80 group-hover:text-[#00fff7]")}>{tab.icon}</div>
                <div className="text-left">
                  <div className={cn("font-bold text-lg", activeTab === tab.id ? "text-[#00fff7]" : "text-white/90 group-hover:text-[#00fff7]")}>{tab.label}</div>
                  <div className="text-xs opacity-80 mt-1">
                    {tab.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Form Content */}
        <div className="space-y-6">
          {activeTab === 'achievement' && (
            <AchievementForm
              onSubmit={handleAchievementSubmit}
              onCancel={() => {}}
              isLoading={isSubmitting}
              resetOnCancel={true}
            />
          )}
          {activeTab === 'participation' && (
            <ParticipationForm
              onSubmit={handleParticipationSubmit}
              onCancel={() => {}}
              isLoading={isSubmitting}
              resetOnCancel={true}
            />
          )}
          {activeTab === 'project' && (
            <ProjectForm
              onSubmit={handleProjectSubmit}
              onCancel={() => {}}
              isLoading={isSubmitting}
              resetOnCancel={true}
            />
          )}
        </div>

        {/* Quick Navigation */}
        <Card className="p-6 bg-[#181A16] border-none rounded-xl shadow-[0_0_25px_rgba(0,255,255,0.1)]">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Quick Navigation
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/achievements')}
              className="gap-2"
            >
              <Trophy className="h-4 w-4" />
              View Achievements
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/participations')}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              View Participations
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/projects')}
              className="gap-2"
            >
              <Code className="h-4 w-4" />
              View Projects
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
} 