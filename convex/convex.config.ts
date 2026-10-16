import { defineApp } from "convex/server";
import staticHosting from "@convex-dev/static-hosting/convex.config";

// The web app is served from Convex itself at https://<deployment>.convex.site.
// Any HTTP endpoints we add later (convex/http.ts) live under /api so the site can own "/".
const app = defineApp({ httpPrefix: "/api" });
app.use(staticHosting, { httpPrefix: "/" });

export default app;
