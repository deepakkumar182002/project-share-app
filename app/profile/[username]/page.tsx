'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ProfileHeader from '@/components/ProfileHeader';
import ProjectCard from '@/components/ProjectCard';
import { UserType } from '@/models/User';

export default function PublicProfilePage() {
  const { username } = useParams();
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, [username]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/user/profile/${username}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user data');
      }

      // Format the user data to match the expected structure
      const formattedUserData = {
        ...data,
        joinedDate: data.joinedDate || new Date().toISOString(),
        image: data.image || '/default-avatar.png',
        bio: data.bio || '',
        skills: data.skills || [],
        projects: data.projects || [],
        socialLinks: {
          github: data.socialLinks?.github,
          linkedin: data.socialLinks?.linkedin,
          twitter: data.socialLinks?.twitter,
          website: data.socialLinks?.website,
          portfolio: data.socialLinks?.portfolio,
          instagram: data.socialLinks?.instagram
        },
        stats: {
          totalViews: data.stats?.totalViews || 0,
          totalComments: data.stats?.totalComments || 0,
          followers: data.stats?.followers || []
        }
      };

      setUserData(formattedUserData);
      setError(null);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Error</h3>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <button
            onClick={fetchUserData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">User not found</h3>
          <p className="mt-2 text-sm text-gray-500">
            The user you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const isOwnProfile = session?.user?.email === userData.email;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileHeader 
          user={{
            name: userData.name,
            username: userData.username,
            profilePhoto: userData.image,
            joinedDate: new Date(userData.joinedDate),
            socialLinks: userData.socialLinks,
            stats: userData.stats
          }}
          isOwnProfile={isOwnProfile}
        />

        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Projects</h2>
            {isOwnProfile && (
              <button 
                onClick={() => window.location.href = '/profile/edit'}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit Profile
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData.projects?.slice(0, 6).map((project) => (
              <ProjectCard
                key={project._id}
                project={{
                  ...project,
                  images: project.images || [],
                  tools: project.tools || [],
                  views: project.views || 0,
                  likes: project.likes || 0,
                  comments: project.comments || 0,
                  userName: userData.name,
                  userUsername: userData.username,
                  userImage: userData.image
                }}
                user={userData}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 