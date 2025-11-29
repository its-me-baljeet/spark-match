"use client";

import { MessageSquare, HeartHandshake } from "lucide-react";

export default function ChatPlaceholder() {
  return (
    <div className="text-center p-10 animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/10">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          <HeartHandshake className="w-5 h-5 text-pink-500 absolute -bottom-2 -right-2 animate-bounce" />
        </div>
      </div>

      <h3 className="text-xl font-semibold">
        Select a match to start chatting 💬
      </h3>

      <p className="text-muted-foreground mt-2 max-w-xs mx-auto leading-relaxed">
        Build meaningful connections by starting a conversation.
        Your messages will appear here!
      </p>
    </div>
  );
}
