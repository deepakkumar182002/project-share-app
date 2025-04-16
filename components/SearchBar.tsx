'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();
  const [searchType, setSearchType] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const searchPath = searchType === 'projects' ? '/search/projects' : '/search/profiles';
    router.push(`${searchPath}?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center">
      <div className="relative">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="h-10 pl-3 pr-8 text-sm border-r-0 rounded-l-lg border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="projects">Projects</option>
          <option value="profiles">Profiles</option>
        </select>
      </div>
      <div className="relative flex-1">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${searchType}...`}
          className="h-10 w-full pl-4 pr-10 text-sm border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="absolute right-0 top-0 h-10 px-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </form>
  );
} 