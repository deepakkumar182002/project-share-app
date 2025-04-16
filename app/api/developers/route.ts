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
}

interface Developer extends Document {
  _id: string;
  name: string;
  username: string;
  image?: string;
  bio?: string;
  skills: Skill[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  joinedDate: Date;
  projects: Project[];
}

export async function GET() {
  try {
    await connectDB();

    // First, check if the database connection is successful
    const developers = await User.find({})
      .select('-password -email -__v')
      .populate({
        path: 'projects',
        select: '_id title description image',
        options: { limit: 3 }
      })
      .sort({ joinedDate: -1 })
      .lean(); // Use lean() for better performance

    if (!developers) {
      return NextResponse.json(
        { error: 'Failed to fetch developers' },
        { status: 500 }
      );
    }

    if (developers.length === 0) {
      return NextResponse.json(
        { error: 'No developers found' },
        { status: 404 }
      );
    }

    const formattedDevelopers = developers.map((developer: any) => ({
      _id: developer._id.toString(),
      name: developer.name,
      username: developer.username,
      image: developer.image || '/default-avatar.png',
      bio: developer.bio || '',
      skills: (developer.skills || []).map((skill: any) => ({
        name: skill.name || '',
        level: skill.level || 'Beginner',
        yearsOfExperience: skill.yearsOfExperience || 0,
        _id: skill._id?.toString()
      })),
      socialLinks: {
        github: developer.socialLinks?.github,
        linkedin: developer.socialLinks?.linkedin,
        twitter: developer.socialLinks?.twitter,
        website: developer.socialLinks?.website
      },
      joinedDate: developer.joinedDate?.toISOString() || new Date().toISOString(),
      projects: (developer.projects || []).map((project: any) => ({
        _id: project._id.toString(),
        title: project.title,
        description: project.description,
        image: project.image
      }))
    }));

    return NextResponse.json(formattedDevelopers);
  } catch (error) {
    console.error('Error fetching developers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch developers. Please try again later.' },
      { status: 500 }
    );
  }
} 