'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchResults from '@/components/SearchResults';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Search Results for "{query}"
          </h1>
        </div>

        <SearchResults query={query} />
      </div>
    </div>
  );
} 