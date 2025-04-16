import mongoose from 'mongoose';

export interface UserType {
  _id: string;
  name: string;
  username: string;
  email: string;
  image?: string;
  phoneNumber?: string;
  location?: {
    city: string;
    country: string;
  };
  joinedDate: Date;
  skills: Array<{
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    yearsOfExperience: number;
  }>;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
    instagram?: string;
  };
  projects: Array<{
    _id: string;
    title: string;
    description: string;
    githubLink?: string;
    liveLink?: string;
    images: string[];
    views: number;
    likes: number;
    userName: string;
    likedBy: string[];
  }>;
  stats: {
    totalViews: number;
    totalComments: number;
    followers: string[];
  };
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fullName: { type: String },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  resetToken: { type: String, default: undefined },
  resetTokenExpiry: { type: Date, default: undefined },
  profilePhoto: { type: String, default: '' },
  phoneNumber: { type: String },
  location: {
    city: { type: String },
    country: { type: String }
  },
  skills: [{
    name: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
    yearsOfExperience: { type: Number }
  }],
  socialLinks: {
    github: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    portfolio: { type: String },
    instagram: { type: String }
  },
  projects: [{
    title: { type: String, required: true },
    description: { type: String },
    githubLink: { type: String },
    demoLink: { type: String },
    images: [{ type: String }],
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    userName: { type: String },
    likedBy: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
  }],
  stats: {
    totalViews: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 },
    followers: [{ type: String }]
  },
  createdAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

export const User = mongoose.models.User || mongoose.model('User', userSchema); 