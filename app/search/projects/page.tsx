import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import { Project } from '@/models/Project';
import ProjectCard from '@/components/ProjectCard';
import { redirect } from 'next/navigation';

export default async function ProjectSearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  await connectDB();
  const query = searchParams.q || '';

  const projects = await Project.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tools: { $regex: query, $options: 'i' } },
    ],
  })
    .populate('user', 'name username image')
    .sort({ createdAt: -1 })
    .lean();

  const formattedProjects = projects.map((project: any) => ({
    _id: project._id.toString(),
    title: project.title,
    description: project.description,
    githubLink: project.githubLink,
    liveLink: project.liveLink,
    images: project.images || [],
    tools: project.tools || [],
    views: project.views || 0,
    likes: project.likes || 0,
    comments: project.comments || 0,
    createdAt: project.createdAt?.toISOString(),
    userName: project.user?.name || '',
    userUsername: project.user?.username || '',
    userImage: project.user?.image,
    likedBy: project.likedBy || []
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Search Results for "{query}"
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Found {projects.length} projects
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">
              No projects found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search or browse all projects
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {formattedProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 