'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaGithub, FaLinkedin, FaTwitter, FaGlobe, FaInstagram } from 'react-icons/fa';
import { UserType } from '@/models/User';

const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

type SkillType = {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience: number;
};

export default function EditProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [newSkill, setNewSkill] = useState<SkillType>({ name: '', level: 'Beginner', yearsOfExperience: 0 });
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    githubLink: '',
    liveLink: '',
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
      setUserData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setIsLoading(false);
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

      if (response.ok) {
        const data = await response.json();
        setUserData(prev => prev ? { ...prev, image: data.imageUrl } : null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        router.push(`/profile/${userData.username}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const addSkill = () => {
    if (!userData || !newSkill.name) return;
    setUserData({
      ...userData,
      skills: [...userData.skills, newSkill],
    });
    setNewSkill({ name: '', level: 'Beginner', yearsOfExperience: 0 });
  };

  const removeSkill = (index: number) => {
    if (!userData) return;
    const newSkills = [...userData.skills];
    newSkills.splice(index, 1);
    setUserData({ ...userData, skills: newSkills });
  };

  const addProject = () => {
    if (!userData || !newProject.title) return;
    setUserData({
      ...userData,
      projects: [...userData.projects, { 
        ...newProject, 
        _id: Date.now().toString(),
        images: [],
        views: 0, 
        likes: 0, 
        userName: userData.name,
        likedBy: []
      }],
    });
    setNewProject({ title: '', description: '', githubLink: '', liveLink: '' });
  };

  const removeProject = (index: number) => {
    if (!userData) return;
    const newProjects = [...userData.projects];
    newProjects.splice(index, 1);
    setUserData({ ...userData, projects: newProjects });
  };

  if (isLoading || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Photo */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Photo</h2>
            <div className="flex items-center space-x-6">
              {userData.image ? (
                <Image
                  src={userData.image}
                  alt={userData.name}
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl font-medium text-gray-600">
                    {userData.name[0].toUpperCase()}
                  </span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={userData.username}
                  onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={userData.email}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={userData.phoneNumber || ''}
                  onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    value={userData.location?.city || ''}
                    onChange={(e) => setUserData({
                      ...userData,
                      location: { city: e.target.value, country: userData.location?.country || '' }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    value={userData.location?.country || ''}
                    onChange={(e) => setUserData({
                      ...userData,
                      location: { city: userData.location?.city || '', country: e.target.value }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Skills & Expertise</h2>
            <div className="space-y-4">
              {userData.skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => {
                      const newSkills = [...userData.skills];
                      newSkills[index] = { ...skill, name: e.target.value };
                      setUserData({ ...userData, skills: newSkills });
                    }}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <select
                    value={skill.level}
                    onChange={(e) => {
                      const newSkills = [...userData.skills];
                      newSkills[index] = { ...skill, level: e.target.value as any };
                      setUserData({ ...userData, skills: newSkills });
                    }}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {skillLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={skill.yearsOfExperience}
                    onChange={(e) => {
                      const newSkills = [...userData.skills];
                      newSkills[index] = { ...skill, yearsOfExperience: parseInt(e.target.value) || 0 };
                      setUserData({ ...userData, skills: newSkills });
                    }}
                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Years"
                  />
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="New skill name"
                />
                <select
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as any })}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {skillLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={newSkill.yearsOfExperience}
                  onChange={(e) => setNewSkill({ ...newSkill, yearsOfExperience: parseInt(e.target.value) || 0 })}
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Years"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Social Links</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <FaGithub className="w-6 h-6 text-gray-400" />
                <input
                  type="url"
                  value={userData.socialLinks?.github || ''}
                  onChange={(e) => setUserData({
                    ...userData,
                    socialLinks: { ...userData.socialLinks, github: e.target.value }
                  })}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="GitHub URL"
                />
              </div>
              <div className="flex items-center space-x-4">
                <FaLinkedin className="w-6 h-6 text-gray-400" />
                <input
                  type="url"
                  value={userData.socialLinks?.linkedin || ''}
                  onChange={(e) => setUserData({
                    ...userData,
                    socialLinks: { ...userData.socialLinks, linkedin: e.target.value }
                  })}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="LinkedIn URL"
                />
              </div>
              <div className="flex items-center space-x-4">
                <FaTwitter className="w-6 h-6 text-gray-400" />
                <input
                  type="url"
                  value={userData.socialLinks?.twitter || ''}
                  onChange={(e) => setUserData({
                    ...userData,
                    socialLinks: { ...userData.socialLinks, twitter: e.target.value }
                  })}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Twitter URL"
                />
              </div>
              <div className="flex items-center space-x-4">
                <FaGlobe className="w-6 h-6 text-gray-400" />
                <input
                  type="url"
                  value={userData.socialLinks?.portfolio || ''}
                  onChange={(e) => setUserData({
                    ...userData,
                    socialLinks: { ...userData.socialLinks, portfolio: e.target.value }
                  })}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Portfolio URL"
                />
              </div>
              <div className="flex items-center space-x-4">
                <FaInstagram className="w-6 h-6 text-gray-400" />
                <input
                  type="url"
                  value={userData.socialLinks?.instagram || ''}
                  onChange={(e) => setUserData({
                    ...userData,
                    socialLinks: { ...userData.socialLinks, instagram: e.target.value }
                  })}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Instagram URL"
                />
              </div>
            </div>
          </div>

          {/* Projects */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Projects</h2>
            <div className="space-y-6">
              {userData.projects.map((project, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) => {
                        const newProjects = [...userData.projects];
                        newProjects[index] = { ...project, title: e.target.value };
                        setUserData({ ...userData, projects: newProjects });
                      }}
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Project title"
                    />
                    <textarea
                      value={project.description}
                      onChange={(e) => {
                        const newProjects = [...userData.projects];
                        newProjects[index] = { ...project, description: e.target.value };
                        setUserData({ ...userData, projects: newProjects });
                      }}
                      rows={3}
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Project description"
                    />
                    <input
                      type="url"
                      value={project.githubLink || ''}
                      onChange={(e) => {
                        const newProjects = [...userData.projects];
                        newProjects[index] = { ...project, githubLink: e.target.value };
                        setUserData({ ...userData, projects: newProjects });
                      }}
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="GitHub repository URL"
                    />
                    <input
                      type="url"
                      value={project.liveLink || ''}
                      onChange={(e) => {
                        const newProjects = [...userData.projects];
                        newProjects[index] = { ...project, liveLink: e.target.value };
                        setUserData({ ...userData, projects: newProjects });
                      }}
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Live demo URL"
                    />
                    <button
                      type="button"
                      onClick={() => removeProject(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove Project
                    </button>
                  </div>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="New project title"
                  />
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    rows={3}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="New project description"
                  />
                  <input
                    type="url"
                    value={newProject.githubLink}
                    onChange={(e) => setNewProject({ ...newProject, githubLink: e.target.value })}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="GitHub repository URL"
                  />
                  <input
                    type="url"
                    value={newProject.liveLink}
                    onChange={(e) => setNewProject({ ...newProject, liveLink: e.target.value })}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Live demo URL"
                  />
                  <button
                    type="button"
                    onClick={addProject}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Project
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 