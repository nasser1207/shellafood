import { createRouteHandler } from "uploadthing/next";
import { UTApi } from "uploadthing/server";

import { fileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
	router: fileRouter,
});

