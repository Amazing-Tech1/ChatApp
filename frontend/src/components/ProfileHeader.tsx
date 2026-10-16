import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useAuthStore } from "../store/auth";
import { useChatStore } from "../store/chat";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();

  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      e.target.value = "";
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;
    setSelectedImg(previewUrl);

    const formData = new FormData();
    formData.append("profilePic", file);

    setIsUploading(true);

    try {
      await updateProfile(formData);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSoundToggle = () => {
    mouseClickSound.currentTime = 0;
    void mouseClickSound.play().catch((error) => console.error("Audio play failed:", error));

    toggleSound();
  };

  return (
    <div className="shrink-0 border-b border-base-300 p-3 sm:p-4">
      <div className="flex min-w-0 items-center justify-between gap-3">
        {/* Profile avatar and details */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="avatar avatar-online shrink-0">
            <button
              type="button"
              aria-label="Change profile picture"
              title="Change profile picture"
              disabled={isUploading}
              className="group relative size-11 overflow-hidden rounded-full sm:size-14"
              onClick={() => fileInputRef.current?.click()}
            >
              <img
                src={selectedImg || authUser?.image_url || "/avatar.png"}
                alt="Profile"
                className="size-full object-cover"
              />

              <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                {isUploading ? "Uploading..." : "Change"}
              </span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold sm:text-base">
              {authUser?.name || "User"}
            </h3>

            <p className="text-xs text-success">{isUploading ? "Updating profile..." : "Online"}</p>
          </div>
        </div>

        {/* DaisyUI action buttons */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            className="btn btn-ghost btn-circle btn-sm sm:btn-md"
            aria-label={isSoundEnabled ? "Mute sound" : "Enable sound"}
            title={isSoundEnabled ? "Mute sound" : "Enable sound"}
            onClick={handleSoundToggle}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-circle btn-sm text-error sm:btn-md"
            aria-label="Log out"
            title="Log out"
            onClick={() => void logout()}
          >
            <LogOutIcon className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
