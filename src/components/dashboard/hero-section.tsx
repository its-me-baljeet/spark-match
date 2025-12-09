import { Card } from "@/components/ui/card";
import Link from "next/link";
import {
  User,
  Heart,
  Bell,
  MessageCircle,
  Star,
  Zap,
  ArrowRight,
} from "lucide-react";

export default function HeroSection() {
  const features = [
    {
      icon: <User className="w-6 h-6 text-rose-500" />,
      title: "Create Profile",
      desc: "Set up your profile with photos and a bio to show your personality.",
    },
    {
      icon: <Heart className="w-6 h-6 text-rose-500" />,
      title: "Swipe & Match",
      desc: "Swipe right to like, left to pass, and find your perfect match.",
    },
    {
      icon: <Bell className="w-6 h-6 text-rose-500" />,
      title: "Get Notified",
      desc: "Stay updated when someone likes you or when you get a new match.",
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-rose-500" />,
      title: "Instant Chat",
      desc: "Start conversations instantly with people you match with.",
    },
    {
      icon: <Star className="w-6 h-6 text-rose-500" />,
      title: "Premium Features",
      desc: "Unlock exclusive perks and enhance your experience soon.",
    },
    {
      icon: <Zap className="w-6 h-6 text-rose-500" />,
      title: "Fast Connections",
      desc: "Quickly discover and match with people near you effortlessly.",
    },
  ];

  return (
    <main className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 text-center text-foreground overflow-hidden py-5">
      <div className="text-4xl sm:text-5xl font-bold mb-4 text-foreground flex items-center  w-5xl">
        <div className="w-4/6 flex justify-end">
          <h1 className="">SparkMatch</h1>
        </div>
        <div className="w-2/5 flex justify-end">
          <Link
            href="/discover"
            className="
    group
    bg-gradient-to-r from-pink-500 via-red-500 to-orange-500
    text-white font-semibold
    px-8 py-2 rounded-full
    shadow-lg shadow-pink-500/30
    hover:shadow-2xl hover:shadow-pink-500/40
    transition-all duration-300
    text-lg sm:text-xl
    hover:scale-105 active:scale-95
    flex items-center gap-2
  "
          >
            <span>Start Discovering</span>

            {/* Right arrow appears on hover */}
            <span
              className="
      opacity-0 translate-x-0 
      group-hover:opacity-100 group-hover:translate-x-1
      transition-all duration-300
    "
            >
              <ArrowRight className="h-5 w-5" />
            </span>
          </Link>
        </div>
      </div>

      <p className="text-lg sm:text-xl mb-8 max-w-2xl text-muted-foreground">
        Perfect destination to find connections, swipe, match, and chat
        instantly.
      </p>

      {/* ⭐ BIG CTA BUTTON */}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl w-full">
        {features.map((feature, idx) => (
          <Card
            key={idx}
            className="flex flex-col p-6 hover:shadow-lg transition-shadow duration-200"
          >
            {/* Icon + Title */}
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
            </div>

            <p className="text-sm text-muted-foreground text-left">
              {feature.desc}
            </p>
          </Card>
        ))}
      </div>
    </main>
  );
}
