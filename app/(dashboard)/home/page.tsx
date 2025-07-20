'use client';

import React from 'react';
import { useUserData } from '@/lib/context/UserDataContext';
import { TextAnimation, RotatingText } from '@/components/animations/TextAnimation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Trophy, Users, Code, Calendar, MapPin, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const { user, achievements, participations, projects, isLoading, stats } = useUserData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-4">
            Welcome to CheckDisOut
          </h1>
          <p className="text-muted-foreground mb-6">
            Please complete your profile to get started.
          </p>
          <Link href="/profile">
            <Button>Complete Profile</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Profile Info */}
          <div className="space-y-6">
            <TextAnimation type="slide-up" delay={200}>
              <h1 className="text-4xl lg:text-5xl font-heading font-bold text-foreground">
                Hello, I'm{' '}
                <span className="text-primary">{user.displayName}</span>
              </h1>
            </TextAnimation>

            <TextAnimation type="slide-up" delay={400}>
              <div className="flex items-center gap-4 text-muted-foreground">
                {user.age && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{user.age} years old</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}
              </div>
            </TextAnimation>

            <TextAnimation type="slide-up" delay={600}>
              <div className="space-y-2">
                <p className="text-lg text-muted-foreground">I am a</p>
                <RotatingText 
                  texts={user.qualities} 
                  interval={2500}
                  className="text-xl font-semibold"
                />
              </div>
            </TextAnimation>

            {user.bio && (
              <TextAnimation type="slide-up" delay={800}>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {user.bio}
                </p>
              </TextAnimation>
            )}

            <TextAnimation type="slide-up" delay={1000}>
              <div className="flex gap-4">
                <Link href="/projects">
                  <Button size="lg" className="gap-2">
                    <Code className="h-4 w-4" />
                    View Projects
                  </Button>
                </Link>
                <Link href="/participations">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Users className="h-4 w-4" />
                    View Participations
                  </Button>
                </Link>
              </div>
            </TextAnimation>
          </div>

          {/* Profile Picture */}
          <TextAnimation type="bounce-in" delay={300}>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {user.profilePicture ? (
                  <Image
                    src={user.profilePicture}
                    alt={user.displayName}
                    width={300}
                    height={300}
                    className="rounded-full border-4 border-primary/20 shadow-2xl"
                  />
                ) : (
                  <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-4 border-primary/20 shadow-2xl flex items-center justify-center">
                    <span className="text-6xl font-heading font-bold text-primary">
                      {user.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </TextAnimation>
        </div>
      </section>

      {/* Skills Section */}
      {user.skills.length > 0 && (
        <section className="max-w-6xl mx-auto">
          <TextAnimation type="slide-up" delay={1200}>
            <h2 className="text-3xl font-heading font-bold text-foreground mb-6">
              Skills & Technologies
            </h2>
            <div className="flex flex-wrap gap-3">
              {user.skills.map((skill, index) => (
                <TextAnimation key={skill} type="scale-in" delay={1400 + index * 100}>
                  <span className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium hover:bg-primary/20 transition-colors">
                    {skill}
                  </span>
                </TextAnimation>
              ))}
            </div>
          </TextAnimation>
        </section>
      )}

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto">
        <TextAnimation type="slide-up" delay={1600}>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                {stats.totalAchievements}
              </h3>
              <p className="text-muted-foreground">Achievements</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-full mx-auto mb-4">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                {stats.totalParticipations}
              </h3>
              <p className="text-muted-foreground">Participations</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mx-auto mb-4">
                <Code className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                {stats.totalProjects}
              </h3>
              <p className="text-muted-foreground">Projects</p>
            </Card>
          </div>
        </TextAnimation>
      </section>

      {/* Recent Achievements */}
      {stats.recentAchievements.length > 0 && (
        <section className="max-w-6xl mx-auto">
          <TextAnimation type="slide-up" delay={1800}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-heading font-bold text-foreground">
                Recent Achievements
              </h2>
              <Link href="/achievements">
                <Button variant="outline" size="sm" className="gap-2">
                  View All
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {stats.recentAchievements.map((achievement, index) => (
                <TextAnimation key={achievement.id} type="slide-up" delay={2000 + index * 200}>
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        <span className="text-sm text-muted-foreground">
                          {achievement.eventType}
                        </span>
                      </div>
                      {achievement.position && (
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                          {achievement.position === 1 ? '1st' : 
                           achievement.position === 2 ? '2nd' : 
                           achievement.position === 3 ? '3rd' : 
                           `${achievement.position}th`} Place
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {achievement.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {achievement.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Card>
                </TextAnimation>
              ))}
            </div>
          </TextAnimation>
        </section>
      )}

      {/* Social Links */}
      {user.socialLinks && Object.values(user.socialLinks).some(link => link) && (
        <section className="max-w-6xl mx-auto">
          <TextAnimation type="slide-up" delay={2200}>
            <h2 className="text-3xl font-heading font-bold text-foreground mb-6">
              Connect With Me
            </h2>
            <div className="flex gap-4">
              {user.socialLinks.linkedin && (
                <a
                  href={user.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              )}
              {user.socialLinks.github && (
                <a
                  href={user.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              )}
              {user.socialLinks.twitter && (
                <a
                  href={user.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              )}
              {user.socialLinks.portfolio && (
                <a
                  href={user.socialLinks.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
            </div>
          </TextAnimation>
        </section>
      )}
    </div>
  );
} 