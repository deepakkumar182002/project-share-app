'use client';

import { useState, useEffect, useRef } from 'react';

const commonTools = [
  'React',
  'Node.js',
  'MongoDB',
  'Express',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'Python',
  'Django',
  'Flask',
  'Java',
  'Spring Boot',
  'PHP',
  'Laravel',
  'MySQL',
  'PostgreSQL',
  'Redis',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'Google Cloud',
  'Git',
  'GitHub',
  'CI/CD',
  'REST API',
  'GraphQL',
  'WebSocket',
  'HTML',
  'CSS',
  'Tailwind CSS',
  'Bootstrap',
  'Material-UI',
  'Redux',
  'Vue.js',
  'Angular',
  'Svelte',
  'Firebase',
  'Jest',
  'Cypress',
  'Selenium',
];

interface ToolsInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ToolsInput({ value, onChange }: ToolsInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue) {
      const filtered = commonTools.filter(tool =>
        tool.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const currentTools = value.split(',').map(tool => tool.trim());
    const lastTool = currentTools.pop() || '';
    const newTools = [...currentTools, suggestion];
    onChange(newTools.join(', '));
    setShowSuggestions(false);
  };

  return (
    <div className="relative" ref={inputRef}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        placeholder="Enter tools (comma-separated)"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
          <ul className="max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 