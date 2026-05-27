import {
  v2 as cloudinary,
  type UploadApiOptions,
  type UploadApiResponse,
} from "cloudinary";

/* ── Configuration ───────────────────────────────────────── */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const UPLOAD_TIMEOUT_MS = 120_000;

/* ── Upload image ────────────────────────────────────────── */
export async function uploadImage(
  file: string | Buffer,
  folder: string = "autostore/vehicles",
): Promise<{
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}> {
  const options: UploadApiOptions = {
    folder,
    resource_type: "image",
    timeout: UPLOAD_TIMEOUT_MS,
    transformation: [
      { width: 1200, height: 800, crop: "limit" },
      { quality: "auto:good" },
      { fetch_format: "auto" },
    ],
  };

  const result =
    typeof file === "string"
      ? await cloudinary.uploader.upload(file, options)
      : await new Promise<UploadApiResponse>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            options,
            (error, uploadResult) => {
              if (error) {
                reject(error);
                return;
              }

              if (!uploadResult) {
                reject(new Error("Cloudinary upload returned no result"));
                return;
              }

              resolve(uploadResult);
            },
          );

          stream.end(file);
        });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
  };
}

/* ── Delete image ────────────────────────────────────────── */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("[deleteImage]", error);
    return false;
  }
}

/* ── Get optimized URL ───────────────────────────────────── */
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "avif" | "auto";
  } = {},
): string {
  const { width, height, quality = "auto", format = "auto" } = options;

  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop: "fill", gravity: "auto" },
      { quality, fetch_format: format },
    ],
    secure: true,
  });
}

/* ── Generate blur placeholder ───────────────────────────── */
export function getBlurPlaceholder(publicId: string): string {
  return cloudinary.url(publicId, {
    transformation: [
      { width: 10, quality: 30, effect: "blur:200" },
      { fetch_format: "auto" },
    ],
    secure: true,
  });
}

export default cloudinary;
