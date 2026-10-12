import cloudinary from "../lib/cloudinary.js";

type ImageType = "avatar" | "message";

export const uploadImage = async (file: string, type: ImageType = "message") => {
  const transformation =
    type === "avatar"
      ? { width: 300, height: 300, crop: "fill", gravity: "face" }
      : { width: 1200, height: 1200, crop: "limit" };

  return cloudinary.uploader.upload(file, {
    folder: `chatapp/${type === "avatar" ? "avatars" : "messages"}`,
    transformation: [transformation],
    quality: "auto",
    fetch_format: "auto",
  });
};
