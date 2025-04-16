import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import { Project } from "@/models/Project";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";

interface ProjectData {
  _id: string;
  title: string;
  description: string;
  images: string[];
  views: number;
  likes: number;
  userName: string;
  likedBy: string[];
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  await connectDB();

  const projects = await Project.find()
    .sort({ createdAt: -1 })
    .lean()
    .exec();
  const serializedProjects = projects.map(project => ({
    _id: (project._id as { toString(): string }).toString(),
    title: project.title as string,
    description: project.description as string,
    images: (project.images as string[]) || [],
    views: (project.views as number) || 0,
    likes: (project.likes as number) || 0,
    userName: project.userName as string,
    likedBy: (project.likedBy as string[]) || [],
  })) as ProjectData[];

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Please sign in to view your dashboard
            </h2>
            <div className="mt-4">
              <Link
                href="/login"
                className="text-indigo-600 hover:text-indigo-800"
              >
                Sign in →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Projects</h1>
          <Link
            href="/upload"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Upload New Project
          </Link>
        </div>

        {serializedProjects.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">
              No projects yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Get started by uploading your first project
            </p>
            <div className="mt-6">
              <Link
                href="/upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Upload Project
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serializedProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 