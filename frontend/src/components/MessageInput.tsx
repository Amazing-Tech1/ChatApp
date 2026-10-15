import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";
import { useChatStore } from "../store/chat";
import { toast } from "sonner";
import useKeyboardSound from "../hooks/useKeyboardSound";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();

  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { sendMessage, isSoundEnabled } = useChatStore();

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  const handleSendMessage = async () => {
    if (!text.trim() && !imageFile) return;

    if (isSoundEnabled) playRandomKeyStrokeSound();

    setIsSending(true);

    try {
      const success = await sendMessage({
        text: text.trim(),
        image: imageFile,
      });

      if (success) {
        setText("");
        setImageFile(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
  };

  const removeImage = () => {
    setImageFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="shrink-0 border-t border-slate-700/50 p-4">
      {imagePreview && (
        <div className="mx-auto mb-3 flex max-w-3xl items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Image preview"
              className="h-20 w-20 rounded-lg border border-slate-700 object-cover"
            />

            <button
              onClick={removeImage}
              type="button"
              aria-label="Remove image"
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-slate-200 hover:bg-slate-700"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="mx-auto flex max-w-3xl space-x-4"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);

            if (isSoundEnabled) playRandomKeyStrokeSound();
          }}
          className="min-w-0 flex-1 rounded-lg border border-slate-700/50 bg-slate-800/50 px-4 py-2"
          placeholder="Type your message..."
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach image"
          className="rounded-lg bg-slate-800/50 px-4 text-slate-400 transition-colors hover:text-slate-200"
        >
          <ImageIcon className="h-5 w-5" />
        </button>

        <button
          type="submit"
          disabled={isSending || (!text.trim() && !imageFile)}
          className="rounded-lg bg-linear-to-r from-cyan-500 to-cyan-600 px-4 py-2 font-medium text-white transition-all hover:from-cyan-600 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <SendIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;
