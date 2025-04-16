import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import { Project } from '@/models/Project';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  await connectDB();

  // Get project first to check if it exists
  const project = await Project.findById(params.id);
  if (!project) {
    notFound();
  }

  // Track unique view
  if (session?.user?.id) {
    if (!project.viewedBy.includes(session.user.id)) {
      await Project.findByIdAndUpdate(params.id, {
        $inc: { views: 1 },
        $push: { viewedBy: session.user.id }
      });
    }
  }

  const isLiked = session?.user?.id ? project.likedBy.includes(session.user.id) : false;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Project Images */}
          {project.images && project.images.length > 0 && project.images[0] && (
            <div className="relative h-96">
              <Image
                src={project.images[0]}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {project.title}
                </h1>
                <div className="flex items-center text-gray-500 text-sm">
                  <span className="mr-4">
                    {project.views} views
                  </span>
                  <span className="mr-4">
                    {project.likes} likes
                  </span>
                  {session?.user && !isLiked && (
                    <form action={`/api/projects/${project._id}/like`} method="POST">
                      <button
                        type="submit"
                        className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Like</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            <div className="prose max-w-none mb-8">
              <p className="text-gray-600">{project.description}</p>
            </div>

            {/* Tools and Technologies */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Tools and Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Implementation Steps */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Implementation Steps</h2>
              <ol className="list-decimal list-inside space-y-2">
                {project.steps.map((step: string, index: number) => (
                  <li key={index} className="text-gray-600">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Contributors */}
            {project.contributors && project.contributors.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Contributors</h2>
                <div className="flex flex-wrap gap-2">
                  {project.contributors.map((contributor: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      {contributor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {project.videos && project.videos.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Project Videos</h2>
                <div className="grid gap-4">
                  {project.videos.map((video: string, index: number) => (
                    <div key={index} className="relative aspect-video">
                      <video
                        src={video}
                        controls
                        className="w-full h-full rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 