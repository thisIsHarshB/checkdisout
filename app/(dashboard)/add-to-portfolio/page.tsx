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

  const handleAchievementSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await addAchievement(data);
      setSuccessData({ type: 'achievement', title: data.title });
      setShowSuccess(true);
    } catch (error) {
      console.error('Error adding achievement:', error);
      // You could add toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleParticipationSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await addParticipation(data);
      setSuccessData({ type: 'participation', title: data.title });
      setShowSuccess(true);
    } catch (error) {
      console.error('Error adding participation:', error);
      // You could add toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProjectSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await addProject(data);
      setSuccessData({ type: 'project', title: data.name });
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
              Your {successData.type} "{successData.title}" has been added to your portfolio.
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
    <div className="min-h-screen bg-background p-6">
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
        <Card className="p-2">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {tab.icon}
                <div className="text-left">
                  <div className="font-medium">{tab.label}</div>
                  <div className="text-xs opacity-80 hidden sm:block">
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
              onCancel={() => router.back()}
              isLoading={isSubmitting}
            />
          )}
          
          {activeTab === 'participation' && (
            <ParticipationForm
              onSubmit={handleParticipationSubmit}
              onCancel={() => router.back()}
              isLoading={isSubmitting}
            />
          )}
          
          {activeTab === 'project' && (
            <ProjectForm
              onSubmit={handleProjectSubmit}
              onCancel={() => router.back()}
              isLoading={isSubmitting}
            />
          )}
        </div>

        {/* Quick Navigation */}
        <Card className="p-6">
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