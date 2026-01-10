import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/__authenticated/$orgSlug/settings/")({
  component: () => {
    const { selectedOrganization } = useAppStore();
    return (
      <Navigate
        to="/$orgSlug/settings/profile"
        params={{
          orgSlug: selectedOrganization?.slug!,
        }}
      />
    );
  },
});
