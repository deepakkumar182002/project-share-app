import Image from 'next/image';
import { FaGithub, FaLinkedin, FaTwitter, FaGlobe, FaInstagram } from 'react-icons/fa';
import { format } from 'date-fns';

interface ProfileHeaderProps {
  user: {
    name: string;
    username: string;
    profilePhoto: string;
    joinedDate: Date;
    socialLinks?: {
      github?: string;
      linkedin?: string;
      twitter?: string;
      portfolio?: string;
      instagram?: string;
    };
    stats?: {
      totalViews?: number;
      totalComments?: number;
      followers?: string[];
    };
  };
  isOwnProfile?: boolean;
}

export default function ProfileHeader({ user, isOwnProfile = false }: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative w-32 h-32">
          <Image
            src={user.profilePhoto || '/default-avatar.png'}
            alt={user.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-600">@{user.username}</p>
          <p className="text-gray-500 text-sm mt-1">
            Joined {format(new Date(user.joinedDate), 'MMMM yyyy')}
          </p>

          {user.stats && (
            <div className="flex gap-6 mt-4 justify-center md:justify-start">
              <div className="text-center">
                <p className="font-semibold">{user.stats.followers?.length || 0}</p>
                <p className="text-sm text-gray-600">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{user.stats.totalViews || 0}</p>
                <p className="text-sm text-gray-600">Views</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{user.stats.totalComments || 0}</p>
                <p className="text-sm text-gray-600">Comments</p>
              </div>
            </div>
          )}

          {user.socialLinks && (
            <div className="flex gap-4 mt-4 justify-center md:justify-start">
              {user.socialLinks.github && (
                <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer">
                  <FaGithub className="text-gray-600 hover:text-gray-900 text-xl" />
                </a>
              )}
              {user.socialLinks.linkedin && (
                <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="text-gray-600 hover:text-gray-900 text-xl" />
                </a>
              )}
              {user.socialLinks.twitter && (
                <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <FaTwitter className="text-gray-600 hover:text-gray-900 text-xl" />
                </a>
              )}
              {user.socialLinks.portfolio && (
                <a href={user.socialLinks.portfolio} target="_blank" rel="noopener noreferrer">
                  <FaGlobe className="text-gray-600 hover:text-gray-900 text-xl" />
                </a>
              )}
              {user.socialLinks.instagram && (
                <a href={user.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="text-gray-600 hover:text-gray-900 text-xl" />
                </a>
              )}
            </div>
          )}

          {isOwnProfile && (
            <div className="flex gap-4 mt-6 justify-center md:justify-start">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Edit Profile
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                View Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 