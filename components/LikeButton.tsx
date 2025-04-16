'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface LikeButtonProps {
  projectId: string;
  initialLikes: number;
  initialIsLiked?: boolean;
}

export default function LikeButton({ projectId, initialLikes, initialIsLiked = false }: LikeButtonProps) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLike = async () => {
    if (!session) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes);
        setIsLiked(data.isLiked);
      }
    } catch (error) {
      console.error('Error liking project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <button className="flex items-center text-gray-500">
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        {likes}
      </button>
    );
  }

  return (
    <button
      onClick={handleLike}
      disabled={isLoading || !session}
      className={`flex items-center ${
        isLiked ? 'text-red-500' : 'text-gray-500'
      } hover:text-red-500 transition-colors`}
    >
      <svg
        className="w-5 h-5 mr-1"
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {likes}
    </button>
  );
} 