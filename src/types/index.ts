export interface UserImageInput {
  url: string;
  publicId: string;
  order?: number;
}

export interface RegisterUserArgs {
  clerkId: string;
  name: string;
  age: number;
  bio?: string;
  gender: string;
  interests?: string[];
  images?: UserImageInput[];
}


export interface UserProfile {
  id: string;
  clerkId: string;
  name: string;
  age: number;
  bio?: string;
  gender: string;
  interests: string[];
  images: string[];
  createdAt: string;
}