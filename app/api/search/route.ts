import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';
import { Project } from '@/models/Project';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    // Search for users
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
      ],
    })
      .select('name username image joinedDate')
      .limit(5)
      .lean();

    // Search for projects
    const projects = await Project.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tools: { $regex: query, $options: 'i' } },
      ],
    })
      .populate('user', 'name username image')
      .limit(5)
      .lean();

    // Format the results
    const formattedUsers = users.map(user => ({
      ...user,
      _id: user._id.toString(),
      joinedDate: user.joinedDate.toISOString(),
      type: 'user'
    }));

    const formattedProjects = projects.map(project => ({
      ...project,
      _id: project._id.toString(),
      user: {
        ...project.user,
        _id: project.user._id.toString()
      },
      type: 'project'
    }));

    return NextResponse.json({
      users: formattedUsers,
      projects: formattedProjects
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 