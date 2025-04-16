'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

interface Skill {
  name: string;
  level: string;
  yearsOfExperience: number;
  _id?: string;
}

interface Developer {
  _id: string;
  name: string;
  username: string;
  image: string;
  bio: string;
  skills: Skill[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
    portfolio?: string;
    instagram?: string;
  };
  joinedDate: string;
  projects: {
    _id: string;
    title: string;
    description: string;
    image: string;
  }[];
}

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const fetchDevelopers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/developers');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch developers');
      }

      const data = await response.json();
      setDevelopers(data);
    } catch (err) {
      console.error('Error fetching developers:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching developers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading developers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchDevelopers}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (developers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">No developers found</h3>
            <p className="mt-2 text-sm text-gray-500">
              There are no developers registered yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Developers</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developers.map((developer) => (
            <div
              key={developer._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative h-16 w-16">
                    <Image
                      src={developer.image}
                      alt={developer.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <Link href={`/profile/${developer.username}`} className="group">
                      <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {developer.name}
                      </h2>
                    </Link>
                    <p className="text-gray-600">@{developer.username}</p>
                  </div>
                </div>

                <p className="mt-4 text-gray-600">{developer.bio}</p>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900">Skills</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {developer.skills.map((skill) => (
                      <span
                        key={skill._id || skill.name}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900">Social Links</h3>
                  <div className="mt-2 flex space-x-4">
                    {developer.socialLinks.github && (
                      <a
                        href={developer.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                      >
                        GitHub
                      </a>
                    )}
                    {developer.socialLinks.linkedin && (
                      <a
                        href={developer.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                      >
                        LinkedIn
                      </a>
                    )}
                    {developer.socialLinks.twitter && (
                      <a
                        href={developer.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                      >
                        Twitter
                      </a>
                    )}
                    {developer.socialLinks.website && (
                      <a
                        href={developer.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                      >
                        Website
                      </a>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900">Recent Projects</h3>
                  <div className="mt-2 space-y-2">
                    {developer.projects.slice(0, 3).map((project) => (
                      <Link
                        key={project._id}
                        href={`/projects/${project._id}`}
                        className="block p-2 hover:bg-gray-50 rounded-md transition-colors duration-200"
                      >
                        <p className="font-medium text-gray-900">{project.title}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {project.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  Joined {format(new Date(developer.joinedDate), 'MMMM yyyy')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 