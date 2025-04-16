'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaExternalLinkAlt, FaEye, FaHeart, FaComment } from 'react-icons/fa';
import { UserType } from '@/models/User';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: {
    _id: string;
    title: string;
    description: string;
    githubLink?: string;
    liveLink?: string;
    image?: string;
    images?: string[];
    tools?: string[];
    views: number;
    likes: number;
    comments?: number;
    createdAt?: string;
    userName: string;
    userUsername?: string;
    userImage?: string;
    likedBy?: string[];
  };
  user?: {
    name: string;
    username: string;
    image?: string;
    joinedDate?: Date;
  };
}

export default function ProjectCard({ project, user }: ProjectCardProps) {
  const imageUrl = project.images?.[0] || project.image || '/default-project.png';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={project.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {project.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative w-8 h-8">
            {project.userImage ? (
              <Image
                src={project.userImage}
                alt={project.userName}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm text-gray-600">
                  {project.userName[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div>
            <Link 
              href={`/profile/${project.userUsername || user?.username}`}
              className="text-sm font-medium text-gray-900 hover:text-indigo-600"
            >
              {project.userName}
            </Link>
            <p className="text-xs text-gray-500">
              {project.createdAt ? format(new Date(project.createdAt), 'MMM d, yyyy') : ''}
            </p>
          </div>
        </div>
        
        {project.tools && project.tools.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tools.map((tool, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tool}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                <FaGithub className="text-xl" />
              </a>
            )}
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                <FaExternalLinkAlt className="text-xl" />
              </a>
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <FaEye className="w-4 h-4" />
              <span>{project.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaHeart className="w-4 h-4" />
              <span>{project.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaComment className="w-4 h-4" />
              <span>{project.comments || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 