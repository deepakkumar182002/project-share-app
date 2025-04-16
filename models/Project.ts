import mongoose from 'mongoose';

export interface ProjectDocument extends mongoose.Document {
  title: string;
  description: string;
  tools: string[];
  contributors: string[];
  steps: string[];
  images: string[];
  videos: string[];
  views: number;
  likes: number;
  viewedBy: string[];
  likedBy: string[];
  ownerId: string;
  userName: string;
  education: string;
  contact: string;
  linkedIn: string;
  github: string;
  createdAt: Date;
  updatedAt: Date;
  user: mongoose.Types.ObjectId;
  githubLink: string;
  liveLink: string;
  comments: number;
}

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    tools: {
      type: [String],
      default: [],
    },
    contributors: {
      type: [String],
      default: [],
    },
    steps: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    videos: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    viewedBy: {
      type: [String],
      default: [],
    },
    likedBy: {
      type: [String],
      default: [],
    },
    ownerId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
    },
    education: {
      type: String,
    },
    contact: {
      type: String,
    },
    linkedIn: {
      type: String,
    },
    github: {
      type: String,
    },
    githubLink: {
      type: String,
      trim: true,
    },
    liveLink: {
      type: String,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const Project = mongoose.models.Project || mongoose.model<ProjectDocument>('Project', projectSchema); 