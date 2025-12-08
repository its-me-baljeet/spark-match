// components/profile/EditProfileFab.tsx
"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProfileEditForm from "@/components/dialogs/edit-profile-dialog";
import { UserProfile } from "@/types";

export default function EditProfileFab({
  profile,
  onProfileUpdate,
  className = "",
}: {
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={`
    h-12 w-12 sm:h-14 sm:w-14
    rounded-full
    bg-white dark:bg-neutral-900
    flex items-center justify-center
    shadow-[0_4px_20px_rgba(0,0,0,0.25)]
    dark:shadow-[0_4px_20px_rgba(255,255,255,0.1)]
    border border-black/5 dark:border-white/10
    hover:shadow-[0_6px_28px_rgba(0,0,0,0.35)]
    dark:hover:shadow-[0_6px_28px_rgba(255,255,255,0.2)]
    hover:scale-110 active:scale-95
    transition-all duration-300
    backdrop-blur-md
    ${className}
  `}
        >
          <Pencil className="h-5 w-5 text-black dark:text-white" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Edit Your Profile
          </DialogTitle>
        </DialogHeader>

        <ProfileEditForm
          profile={profile}
          onUpdate={(updated) => {
            onProfileUpdate(updated);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
