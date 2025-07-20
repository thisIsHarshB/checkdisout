'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TextAnimationProps {
  text: string;
  type?: 'slide-up' | 'fade-in' | 'bounce-in';
  delay?: number;
  duration?: number;
  className?: string;
  children?: React.ReactNode;
}

interface RotatingTextProps {
  texts: string[];
  interval?: number;
  className?: string;
}

export const TextAnimation: React.FC<TextAnimationProps> = ({
  text,
  type = 'slide-up',
  delay = 0,
  duration = 500,
  className,
  children
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const animationClasses = {
    'slide-up': 'animate-slide-up',
    'fade-in': 'animate-fade-in',
    'bounce-in': 'animate-bounce-in'
  };

  return (
    <div
      className={cn(
        'transition-all duration-500 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        animationClasses[type],
        className
      )}
      style={{ animationDelay: `${delay}ms`, animationDuration: `${duration}ms` }}
    >
      {children || text}
    </div>
  );
};

export const RotatingText: React.FC<RotatingTextProps> = ({
  texts,
  interval = 3000,
  className
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return (
    <div className={cn('relative h-8 overflow-hidden', className)}>
      {texts.map((text, index) => (
        <div
          key={text}
          className={cn(
            'absolute inset-0 flex items-center transition-all duration-500 ease-in-out',
            index === currentIndex
              ? 'opacity-100 translate-y-0'
              : index < currentIndex
              ? 'opacity-0 -translate-y-full'
              : 'opacity-0 translate-y-full'
          )}
        >
          <span className="text-primary font-semibold">{text}</span>
        </div>
      ))}
    </div>
  );
};

export const TypewriterText: React.FC<{ text: string; speed?: number; className?: string }> = ({
  text,
  speed = 100,
  className
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={cn('inline-block', className)}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

export const PulseText: React.FC<{ text: string; className?: string }> = ({
  text,
  className
}) => {
  return (
    <span className={cn('animate-pulse', className)}>
      {text}
    </span>
  );
}; 