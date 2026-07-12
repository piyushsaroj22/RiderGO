import { UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
}

export const uploadImage = (
  buffer: Buffer,
  folder: string,
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        const uploadResult = result as UploadApiResponse;

        resolve({
          secureUrl: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        });
      },
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export const deleteImage = async (publicId: string): Promise<void> => {
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId);
};
