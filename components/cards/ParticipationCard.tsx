'use client';

import React, { useState } from 'react';
import { Participation, TeamMember } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { 
  Users, 
  User, 
  Calendar, 
  Wifi, 
  Globe, 
  Edit, 
  Trash2, 
  Share2, 
  ExternalLink,
  Tag,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ParticipationCardProps {
  participation: Participation;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
  className?: string;
}

export const ParticipationCard: React.FC<ParticipationCardProps> = ({
  participation,
  onEdit,
  onDelete,
  onShare,
  className
}) => {
  const [showCertificate, setShowCertificate] = useState(false);
  const [showTeamMembers, setShowTeamMembers] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: participation.title,
          text: participation.description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const text = `${participation.title}\n${participation.description}\n${participation.eventName}`;
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    }
  };

  return (
    <>
      <Card className={cn("p-6 hover:shadow-lg transition-all duration-300 group", className)}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-secondary/10 rounded-full">
              <Users className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg group-hover:text-secondary transition-colors">
                {participation.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {participation.eventName}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {participation.description}
        </p>

        {/* Event Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(participation.eventDate)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {participation.eventType === 'online' ? (
              <Wifi className="h-4 w-4" />
            ) : (
              <Globe className="h-4 w-4" />
            )}
            <span className="capitalize">{participation.eventType} Event</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {participation.isSolo ? (
              <User className="h-4 w-4" />
            ) : (
              <Users className="h-4 w-4" />
            )}
            <span>{participation.isSolo ? 'Solo Participation' : 'Team Participation'}</span>
          </div>
        </div>

        {/* Team Members */}
        {!participation.isSolo && participation.teamMembers && participation.teamMembers.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setShowTeamMembers(!showTeamMembers)}
              className="flex items-center gap-2 text-sm text-secondary hover:text-secondary/80 transition-colors"
            >
              <Users className="h-4 w-4" />
              <span>View Team Members ({participation.teamMembers.length})</span>
            </button>
            
            {showTeamMembers && (
              <div className="mt-3 space-y-2">
                {participation.teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-secondary">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{member.name}</p>
                      {member.role && (
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      )}
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-gray-800 hover:text-gray-900 transition-colors"
                        >
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {participation.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {participation.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certificate */}
        {participation.certificateUrl && (
          <div className="mb-4">
            <button
              onClick={() => setShowCertificate(true)}
              className="flex items-center gap-2 text-sm text-secondary hover:text-secondary/80 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>View Certificate</span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex gap-2">
            {onEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(participation.id)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(participation.id)}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={handleShare}
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </Card>

      {/* Certificate Modal */}
      {showCertificate && participation.certificateUrl && (
        <Modal
          isOpen={showCertificate}
          onClose={() => setShowCertificate(false)}
          title="Certificate"
          size="lg"
        >
          <div className="space-y-4">
            <div className="relative aspect-[3/2] bg-muted rounded-lg overflow-hidden">
              <Image
                src={participation.certificateUrl}
                alt="Certificate"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex justify-end">
              <a
                href={participation.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open in new tab</span>
              </a>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}; 