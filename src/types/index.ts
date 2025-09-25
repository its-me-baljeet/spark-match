export interface RegisterUserArgs {
  clerkId: string;
  name: string;
  age: number;
  bio?: string;
  gender: string;
  interests?: string[];
}