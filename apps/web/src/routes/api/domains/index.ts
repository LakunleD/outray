import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { auth } from "../../../lib/auth";
import { db } from "../../../db";
import { domains } from "../../../db/app-schema";

export const Route = createFileRoute("/api/domains/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session) {
          return json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(request.url);
        const organizationId = url.searchParams.get("organizationId");

        if (!organizationId) {
          return json({ error: "Organization ID required" }, { status: 400 });
        }

        const organizations = await auth.api.listOrganizations({
          headers: request.headers,
        });

        const hasAccess = organizations.find(
          (org) => org.id === organizationId,
        );

        if (!hasAccess) {
          return json({ error: "Unauthorized" }, { status: 403 });
        }

        const result = await db
          .select()
          .from(domains)
          .where(eq(domains.organizationId, organizationId))
          .orderBy(desc(domains.createdAt));

        return json({ domains: result });
      },
      POST: async ({ request }) => {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session) {
          return json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { domain, organizationId } = body;

        if (!domain || !organizationId) {
          return json(
            { error: "Domain and Organization ID required" },
            { status: 400 },
          );
        }

        // Validate that it's a subdomain (has at least 3 parts: subdomain.domain.tld)
        const domainParts = domain.trim().split(".");
        if (domainParts.length < 3) {
          return json(
            {
              error:
                "Only subdomains are allowed. Please enter a subdomain like api.myapp.com",
            },
            { status: 400 },
          );
        }

        // Basic domain validation
        const domainRegex =
          /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/;
        if (!domainRegex.test(domain.trim())) {
          return json(
            { error: "Please enter a valid domain name" },
            { status: 400 },
          );
        }

        const organizations = await auth.api.listOrganizations({
          headers: request.headers,
        });

        const hasAccess = organizations.find(
          (org) => org.id === organizationId,
        );

        if (!hasAccess) {
          return json({ error: "Unauthorized" }, { status: 403 });
        }

        // Check if domain already exists
        const existingDomain = await db.query.domains.findFirst({
          where: eq(domains.domain, domain.trim()),
        });

        if (existingDomain) {
          return json({ error: "Domain already exists" }, { status: 400 });
        }

        const [newDomain] = await db
          .insert(domains)
          .values({
            id: nanoid(),
            domain,
            organizationId,
            userId: session.user.id,
            status: "pending",
          })
          .returning();

        return json({ domain: newDomain });
      },
    },
  },
});
