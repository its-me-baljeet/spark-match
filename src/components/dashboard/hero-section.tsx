import { Card } from "@/components/ui/card";
import { User, Heart, Bell, MessageCircle, Star, Zap } from "lucide-react";

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
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">
        MatchSpark
      </h1>
      <p className="text-lg sm:text-xl mb-8 max-w-2xl text-muted-foreground">
        Your perfect destination to find meaningful connections, swipe, match,
        and chat instantly.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl w-full">
        {features.map((feature, idx) => (
          <Card
            key={idx}
            className="flex flex-col p-6 hover:shadow-lg transition-shadow duration-200"
          >
            {/* Icon + Title in single line */}
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex items-center justify-center ">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
            </div>

            {/* Description below */}
            <p className="text-sm text-muted-foreground text-left">
              {feature.desc}
            </p>
          </Card>
        ))}
      </div>
    </main>
  );
}
