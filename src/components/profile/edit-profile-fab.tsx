// components/profile/EditProfileFab.tsx
"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProfileEditForm from "@/components/dialogs/edit-profile-dialog";
import { UserProfile } from "@/types";

interface Props {
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

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
    <Dialog open={open} onOpenChange={setOpen} onc>
      <DialogTrigger asChild>
        <button
          type="button"
          className={`
            rounded-full bg-white dark:bg-neutral-800
            shadow-[0_6px_16px_rgba(0,0,0,0.25)]
            hover:scale-110 active:scale-95 transition-transform
            flex items-center justify-center
            ${className}
          `}
          aria-label="Edit profile"
        >
          <Pencil className="h-4 w-4 md:h-5 md:w-5 text-gray-900 dark:text-gray-100" />
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
