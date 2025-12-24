import { createFileRoute } from "@tanstack/react-router";
import { CustomerPortal } from "@polar-sh/tanstack-start";
import { auth } from "../../../lib/auth";
import { db } from "../../../db";
import { subscriptions } from "../../../db/subscription-schema";
import { eq } from "drizzle-orm";

export const Route = createFileRoute("/api/portal/polar")({
  server: {
    handlers: {
      GET: CustomerPortal({
        accessToken: process.env.POLAR_ACCESS_TOKEN!,
        getCustomerId: async (request: Request) => {
          const session = await auth.api.getSession({
            headers: request.headers,
          });
          if (!session?.user) {
            throw new Error("Unauthorized");
          }

          const url = new URL(request.url);
          const organizationId = url.searchParams.get("organizationId");

          if (!organizationId) {
            throw new Error("Organization ID required");
          }

          const [subscription] = await db
            .select()
            .from(subscriptions)
            .where(eq(subscriptions.organizationId, organizationId))
            .limit(1);

          if (!subscription?.polarCustomerId) {
            throw new Error("No subscription found");
          }

          return subscription.polarCustomerId;
        },
        returnUrl: process.env.APP_URL + "/dash/billing",
        server:
          process.env.POLAR_SERVER === "sandbox" ? "sandbox" : "production",
      }),
    },
  },
});
