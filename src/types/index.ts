import { NextRequest } from "next/server";
import { PrismaClient } from "../../generated/prisma";

export interface GraphQLContext {
  req: NextRequest;
  db: PrismaClient;
  user?: { id: string }; // Add user context for auth
}

export interface UserPhotoInput {
  url: string;
  publicId: string;
  order?: number;
}

export interface UserPhotoUpsertInput {
  id?: string; // optional for new photos
  url: string;
  publicId: string;
  order?: number | null;
}

export interface UserPreferences {
  minAge: number;
  maxAge: number;
  distanceKm: number;
  gender?: "MALE" | "FEMALE" | "OTHER";
}

export interface UpdateUserInput {
  clerkId: string;
  name: string;
  birthday: string;
  bio?: string | null;
  gender: "MALE" | "FEMALE" | "OTHER";
  photos?: UserPhotoUpsertInput[]; // Make optional
  location: { lat: number; lng: number };
  preferences?: UserPreferences; // Add preferences support
}

export interface UserProfile {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  age: number;
  birthday: string;
  bio?: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  photos: string[];
  preferences?: UserPreferences;
  lastActiveAt: string;
  location: { lat: number; lng: number };
  isOnline: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterUserArgs {
  clerkId: string;
  email: string;
  name: string;
  birthday: string; // ISO string
  bio?: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  photos?: UserPhotoInput[];
  location: { lat: number; lng: number };
  preferences?: UserPreferences;
}

// Additional helper types for better type safety
export interface Location {
  lat: number;
  lng: number;
}

export interface PhotoInput {
  url: string;
  publicId: string;
  order?: number;
}

export interface PreferenceInput {
  minAge: number;
  maxAge: number;
  distanceKm: number;
  gender?: "MALE" | "FEMALE" | "OTHER";
}