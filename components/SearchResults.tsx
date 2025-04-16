import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import ProjectCard from './ProjectCard';

interface SearchResult {
  _id: string;
  type: 'user' | 'project';
  name?: string;
  username?: string;
  image?: string;
  joinedDate?: string;
  title?: string;
  description?: string;
  user?: {
    name: string;
    username: string;
    image: string;
  };
}

export default function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState<{
    users: SearchResult[];
    projects: SearchResult[];
  }>({ users: [], projects: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Users Section */}
      {results.users.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Users</h2>
          <div className="grid grid-cols-1 gap-4">
            {results.users.map((user) => (
              <Link
                key={user._id}
                href={`/profile/${user.username}`}
                className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || ''}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600">
                      {user.name?.[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                  {user.joinedDate && (
                    <p className="text-xs text-gray-400">
                      Joined {format(new Date(user.joinedDate), 'MMM yyyy')}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Projects Section */}
      {results.projects.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Projects</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={{
                  ...project,
                  _id: project._id,
                  title: project.title || '',
                  description: project.description || '',
                  images: [],
                  views: 0,
                  likes: 0,
                  userName: project.user?.name || '',
                  likedBy: []
                }}
                user={project.user}
              />
            ))}
          </div>
        </div>
      )}

      {results.users.length === 0 && results.projects.length === 0 && (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900">No results found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your search or browse all projects
          </p>
        </div>
      )}
    </div>
  );
} 