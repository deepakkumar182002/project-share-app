import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import { Project } from '@/models/Project';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if user has already liked the project
    if (project.likedBy.includes(session.user.id)) {
      return NextResponse.json({ error: 'Already liked' }, { status: 400 });
    }

    // Add like and user to likedBy array
    await Project.findByIdAndUpdate(
      params.id,
      {
        $inc: { likes: 1 },
        $push: { likedBy: session.user.id }
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error liking project:', error);
    return NextResponse.json(
      { error: 'Error liking project' },
      { status: 500 }
    );
  }
} 