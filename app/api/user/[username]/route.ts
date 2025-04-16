import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    await connectDB();
    
    const user = await User.findOne({ username: params.username })
      .select('-password -email')
      .lean();

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
      joinedDate: user.joinedDate.toISOString(),
      projects: user.projects?.map(project => ({
        ...project,
        _id: project._id.toString()
      })) || []
    };

    return NextResponse.json(formattedUser);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 