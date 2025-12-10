# 💖 SparkMatch

> A modern, feature-rich dating app built with Next.js 15, inspired by Tinder's swipe mechanics. Find your spark with real-time matching, location-based discovery, and smooth animations.

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://spark-match.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-95.8%25-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)

## ✨ Features

### 🔥 Core Features
- **Swipe Mechanics** - Smooth card-based swiping with drag gestures
- **Real-time Matching** - Instant match notifications when both users like each other
- **Location-based Discovery** - Find people near you with adjustable distance filters
- **Online Status** - See who's currently active in real-time
- **Undo Last Action** - Made a mistake? Rewind your last swipe
- **Smart Prefetching** - Seamlessly loads more profiles in the background

### 📱 User Experience
- **Haptic Feedback** - Tactile vibrations for swipes and matches (mobile)
- **Optimistic UI** - Instant feedback on actions before server confirmation
- **Smooth Animations** - Powered by Framer Motion for buttery smooth transitions
- **Responsive Design** - Works beautifully on desktop, tablet, and mobile
- **Toast Notifications** - Beautiful, non-intrusive alerts using Sonner

### 🎯 Discovery & Filtering
- **Dynamic Distance Filter** - Adjust radius from 1km to 200km
- **Online-only Toggle** - Filter to see only currently active users
- **Age & Gender Preferences** - Customize who you see
- **Session-based Location** - Smart location caching with auto-refresh

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible components
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations
- **[Sonner](https://sonner.emilkowal.ski/)** - Elegant toast notifications
- **[Lucide Icons](https://lucide.dev/)** - Modern icon library

### Backend
- **[Prisma](https://www.prisma.io/)** - Type-safe ORM
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[GraphQL](https://graphql.org/)** - API query language
- **[Clerk](https://clerk.com/)** - Authentication & user management

### DevOps
- **[Vercel](https://vercel.com/)** - Deployment & hosting
- **[ESLint](https://eslint.org/)** - Code linting
- **Git** - Version control

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- MongoDB database (local or Atlas)
- Clerk account for authentication

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/baljeet-5ingh/spark-match.git
cd spark-match
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/sparkMatch"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Generate Prisma Client**
```bash
npx prisma generate
```

5. **Push database schema**
```bash
npx prisma db push
```

6. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

7. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
spark-match/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (auth)/            # Auth routes (sign-in, sign-up)
│   │   ├── discover/          # Main swipe interface
│   │   ├── matches/           # Matched users page
│   │   ├── profile/           # User profile pages
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── discover/          # Swipe card components
│   │   ├── ui/                # shadcn/ui components
│   │   └── ...
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   ├── services/              # External services (Prisma, GraphQL)
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Helper functions
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
└── ...config files
```

## 🎮 Usage

### For Users

1. **Sign Up/Sign In** - Create an account with Clerk authentication
2. **Complete Profile** - Add photos, bio, and preferences
3. **Start Swiping** - 
   - Swipe right ❤️ to like
   - Swipe left ❌ to pass
   - Click buttons for the same actions
4. **Adjust Filters** - Set distance and online status filters
5. **Match & Chat** - Get notified when you match with someone
6. **View Matches** - See all your matches in one place

### For Developers

**Key Files to Understand:**
- `src/app/discover/page.tsx` - Main swipe interface logic
- `src/components/discover/tinder-card.tsx` - Card component with animations
- `src/lib/graphql/resolvers/` - GraphQL resolvers for backend logic
- `prisma/schema.prisma` - Database schema and relationships

**GraphQL Queries & Mutations:**
- `getPreferredUsers` - Fetch users based on filters
- `likeUser` - Record a like and check for match
- `passUser` - Record a pass
- `rewindUser` - Undo last action
- `getMyMatches` - Fetch all matches

## 🔧 Configuration

### Prisma Schema
The database uses these main models:
- **User** - User profiles with photos and preferences
- **Like** - Tracks who liked whom
- **Pass** - Tracks who passed on whom
- **Match** - Stores mutual matches
- **Photo** - User profile photos

### Location-based Filtering
Uses the Haversine formula to calculate distances between coordinates:
```typescript
const distance = 6371 * Math.acos(
  Math.sin(lat1) * Math.sin(lat2) +
  Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1)
);
```

## 🎨 UI/UX Features

### Optimistic Updates
All user actions update the UI immediately before server confirmation, creating a snappy, responsive experience.

### Haptic Feedback
- Light vibration on swipe
- Celebration pattern on match
- Subtle feedback on undo

### Smart Animations
- Card exit animations based on swipe direction
- Stacked card preview (top 3 cards visible)
- Smooth transitions between states

## 🚧 Roadmap

- [ ] Real-time chat messaging
- [ ] Video/voice calls
- [ ] Advanced filtering (interests, hobbies)
- [ ] Profile verification badges
- [ ] Instagram integration
- [ ] Super likes
- [ ] Boost feature
- [ ] Analytics dashboard

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Baljeet Singh**
- GitHub: [@baljeet-5ingh](https://github.com/baljeet-5ingh)
- Project: [SparkMatch](https://spark-match.vercel.app)

## 🙏 Acknowledgments

- Design inspiration from Tinder
- UI components from shadcn/ui
- Animation patterns from Framer Motion docs
- Community support from Next.js and Prisma

---

<div align="center">

**Made with ❤️ and lots of ☕**

If you found this project helpful, consider giving it a ⭐!

</div>
