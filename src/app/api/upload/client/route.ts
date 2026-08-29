import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAuthed } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Hands the browser a short-lived token so it can upload straight to Blob.
 *
 * A Vercel function may only receive a 4.5 MB request body, which is smaller
 * than most phone photos and every video — so on Vercel the file must never
 * pass through the server at all.
 */

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

const IMAGE_MAX = 8 * 1024 * 1024;
const VIDEO_MAX = 64 * 1024 * 1024;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as HandleUploadBody | null;
  if (!body) {
    return Response.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await isAuthed())) throw new Error("Unauthorized");

        const media = pathname.startsWith("media/");
        if (!media && !pathname.startsWith("gallery/")) {
          throw new Error("Invalid path");
        }
        return {
          allowedContentTypes: media ? VIDEO_TYPES : IMAGE_TYPES,
          maximumSizeInBytes: media ? VIDEO_MAX : IMAGE_MAX,
          addRandomSuffix: false,
        };
      },
      // The browser tells us the URL once it is done; this webhook never fires
      // on localhost, so it must not be the only place uploads are recorded.
      onUploadCompleted: async () => {},
    });

    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return Response.json({ ok: false, error: message }, { status: 400 });
  }
}
