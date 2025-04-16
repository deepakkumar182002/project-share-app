import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';
import { Document } from 'mongoose';

interface Skill {
  name: string;
  level: string;
  yearsOfExperience: number;
  _id?: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  githubLink?: string;
  liveLink?: string;
  views: number;
  likes: number;
  comments: number;
  createdAt?: string;
}

interface UserDocument extends Document {
  _id: string;
  name: string;
  username: string;
  email: string;
  image?: string;
  bio?: string;
  skills: Skill[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
    portfolio?: string;
    instagram?: string;
  };
  joinedDate: Date;
  projects: Project[];
  stats?: {
    totalViews: number;
    totalComments: number;
    followers: string[];
  };
}

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    await connectDB();

    // Try to find user by username first
    let user = await User.findOne({ username: params.username })
      .select('-password -email -__v')
      .populate({
        path: 'projects',
        select: '_id title description images githubLink liveLink views likes comments createdAt',
        options: { sort: { createdAt: -1 } }
      })
      .lean();

    // If not found by username, try by ID
    if (!user) {
      user = await User.findById(params.username)
        .select('-password -email -__v')
        .populate({
          path: 'projects',
          select: '_id title description images githubLink liveLink views likes comments createdAt',
          options: { sort: { createdAt: -1 } }
        })
        .lean();
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Format the user data
    const formattedUser = {
      ...user,
      _id: user._id.toString(),
      joinedDate: user.joinedDate?.toISOString() || new Date().toISOString(),
      image: user.image || user.profilePhoto || '/default-avatar.png',
      bio: user.bio || '',
      skills: (user.skills || []).map((skill: Skill) => ({
        name: skill.name || '',
        level: skill.level || 'Beginner',
        yearsOfExperience: skill.yearsOfExperience || 0,
        _id: skill._id?.toString()
      })),
      socialLinks: {
        github: user.socialLinks?.github,
        linkedin: user.socialLinks?.linkedin,
        twitter: user.socialLinks?.twitter,
        website: user.socialLinks?.website,
        portfolio: user.socialLinks?.portfolio,
        instagram: user.socialLinks?.instagram
      },
      projects: (user.projects || []).map((project: any) => ({
        _id: project._id.toString(),
        title: project.title,
        description: project.description,
        images: project.images || [],
        tools: project.tools || [],
        views: project.views || 0,
        likes: project.likes || 0,
        comments: project.comments || 0,
        githubLink: project.githubLink,
        liveLink: project.liveLink,
        userName: user.name,
        userUsername: user.username,
        userImage: user.image || user.profilePhoto || '/default-avatar.png',
        likedBy: project.likedBy || []
      })),
      stats: {
        totalViews: user.stats?.totalViews || 0,
        totalComments: user.stats?.totalComments || 0,
        followers: user.stats?.followers || []
      }
    };

    return NextResponse.json(formattedUser);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
} 