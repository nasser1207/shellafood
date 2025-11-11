import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// File router for your app, can contain multiple FileRoutes
export const fileRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
		// Set permissions and file types for this FileRoute
		.onUploadComplete(async ({ metadata, file }) => {
			// This code RUNS ON YOUR SERVER after upload
			console.log("Upload complete for userId:", metadata);
			console.log("file url", file.url);
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof fileRouter;

