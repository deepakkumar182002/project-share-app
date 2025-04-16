'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaGithub, FaLinkedin, FaGlobe, FaCode, FaUserFriends, FaGraduationCap, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

interface IconProps {
  icon: React.ReactNode;
  className?: string;
}

const StyledIcon = ({ icon, className }: IconProps) => (
  <div className={className}>
    {icon}
  </div>
);

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    location: {
      city: '',
      country: ''
    },
    profilePhoto: '',
    skills: [] as Array<{ name: string; level: string; yearsOfExperience: number }>,
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      portfolio: '',
      instagram: ''
    },
    projects: [] as Array<{
      title: string;
      description: string;
      githubLink: string;
      demoLink: string;
      createdAt: Date;
    }>
  });

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    fetchUserData();
  }, [session]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      
      const formattedData = {
        ...data,
        skills: data.skills || [],
        projects: data.projects || [],
        location: data.location || { city: '', country: '' },
        socialLinks: data.socialLinks || {
          github: '',
          linkedin: '',
          twitter: '',
          portfolio: '',
          instagram: ''
        }
      };
      
      setUserData(formattedData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/user/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setUserData({ ...userData, profilePhoto: data.imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      // You might want to show an error message to the user here
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Profile</h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Profile Photo */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-32 h-32 mb-4">
                  {userData.profilePhoto ? (
                    <Image
                      src={userData.profilePhoto}
                      alt="Profile"
                      fill
                      className="rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-lg">
                      <span className="text-4xl text-indigo-600 font-bold">
                        {userData.name?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-2 text-sm text-gray-600"
                  />
                )}
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={userData.name || ''}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={userData.email || ''}
                      disabled
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <div className="relative">
                      <StyledIcon 
                        icon={<FaPhone size={20} />} 
                        className="absolute left-3 top-3 text-gray-400" 
                      />
                      <input
                        type="tel"
                        value={userData.phoneNumber || ''}
                        onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
                        disabled={!isEditing}
                        className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <div className="relative">
                      <StyledIcon 
                        icon={<FaMapMarkerAlt size={20} />} 
                        className="absolute left-3 top-3 text-gray-400" 
                      />
                      <input
                        type="text"
                        value={`${userData.location.city || ''}, ${userData.location.country || ''}`}
                        onChange={(e) => {
                          const [city, country] = e.target.value.split(', ');
                          setUserData({
                            ...userData,
                            location: { city: city || '', country: country || '' }
                          });
                        }}
                        disabled={!isEditing}
                        className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <StyledIcon 
                    icon={<FaCode size={24} />} 
                    className="text-indigo-600 mr-2" 
                  />
                  <h2 className="text-xl font-semibold text-gray-800">Skills & Expertise</h2>
                </div>
                {userData.skills.map((skill, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                      type="text"
                      value={skill.name || ''}
                      onChange={(e) => {
                        const newSkills = [...userData.skills];
                        newSkills[index] = { ...skill, name: e.target.value };
                        setUserData({ ...userData, skills: newSkills });
                      }}
                      disabled={!isEditing}
                      placeholder="Skill name"
                      className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <select
                      value={skill.level || 'Beginner'}
                      onChange={(e) => {
                        const newSkills = [...userData.skills];
                        newSkills[index] = { ...skill, level: e.target.value };
                        setUserData({ ...userData, skills: newSkills });
                      }}
                      disabled={!isEditing}
                      className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                    <input
                      type="number"
                      value={skill.yearsOfExperience || 0}
                      onChange={(e) => {
                        const newSkills = [...userData.skills];
                        newSkills[index] = { ...skill, yearsOfExperience: parseInt(e.target.value) || 0 };
                        setUserData({ ...userData, skills: newSkills });
                      }}
                      disabled={!isEditing}
                      placeholder="Years of experience"
                      className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                ))}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setUserData({
                      ...userData,
                      skills: [...userData.skills, { name: '', level: 'Beginner', yearsOfExperience: 0 }]
                    })}
                    className="mt-2 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    Add Skill
                  </button>
                )}
              </div>

              {/* Social Links */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <StyledIcon 
                    icon={<FaUserFriends size={24} />} 
                    className="text-indigo-600 mr-2" 
                  />
                  <h2 className="text-xl font-semibold text-gray-800">Social Links</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                    <div className="relative">
                      <StyledIcon 
                        icon={<FaGithub size={20} />} 
                        className="absolute left-3 top-3 text-gray-400" 
                      />
                      <input
                        type="url"
                        value={userData.socialLinks.github || ''}
                        onChange={(e) => setUserData({
                          ...userData,
                          socialLinks: { ...userData.socialLinks, github: e.target.value }
                        })}
                        disabled={!isEditing}
                        className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                    <div className="relative">
                      <StyledIcon 
                        icon={<FaLinkedin size={20} />} 
                        className="absolute left-3 top-3 text-gray-400" 
                      />
                      <input
                        type="url"
                        value={userData.socialLinks.linkedin || ''}
                        onChange={(e) => setUserData({
                          ...userData,
                          socialLinks: { ...userData.socialLinks, linkedin: e.target.value }
                        })}
                        disabled={!isEditing}
                        className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>
                    <div className="relative">
                      <StyledIcon 
                        icon={<FaGlobe size={20} />} 
                        className="absolute left-3 top-3 text-gray-400" 
                      />
                      <input
                        type="url"
                        value={userData.socialLinks.portfolio || ''}
                        onChange={(e) => setUserData({
                          ...userData,
                          socialLinks: { ...userData.socialLinks, portfolio: e.target.value }
                        })}
                        disabled={!isEditing}
                        className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 