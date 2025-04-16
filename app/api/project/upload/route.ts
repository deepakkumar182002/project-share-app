import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import { Project } from '@/models/Project';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const tools = (formData.get('tools') as string).split(',').map(tool => tool.trim());
    const contributors = (formData.get('contributors') as string).split(',').map(contributor => contributor.trim());
    const steps = (formData.get('implementation') as string).split('\n').map(step => step.trim());
    const userName = formData.get('userName') as string;
    const education = formData.get('education') as string;
    const contact = formData.get('contact') as string;
    const linkedIn = formData.get('linkedIn') as string;
    const github = formData.get('github') as string;

    // Upload images
    const imageFiles = formData.getAll('images') as File[];
    const imageUrls: string[] = [];
    
    for (const file of imageFiles) {
      if (file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
              if (error) reject(error);
              resolve(result as { secure_url: string });
            }
          ).end(buffer);
        });
        
        if (result?.secure_url) {
          imageUrls.push(result.secure_url);
        }
      }
    }

    // Upload videos
    const videoFiles = formData.getAll('videos') as File[];
    const videoUrls: string[] = [];
    
    for (const file of videoFiles) {
      if (file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { resource_type: 'video' },
            (error, result) => {
              if (error) reject(error);
              resolve(result as { secure_url: string });
            }
          ).end(buffer);
        });
        
        if (result?.secure_url) {
          videoUrls.push(result.secure_url);
        }
      }
    }

    await connectDB();

    const project = await Project.create({
      title,
      description,
      tools,
      contributors,
      steps,
      images: imageUrls,
      videos: videoUrls,
      ownerId: session.user.id,
      userName,
      education,
      contact,
      linkedIn,
      github,
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error uploading project:', error);
    return NextResponse.json(
      { error: 'Failed to upload project' },
      { status: 500 }
    );
  }
} 