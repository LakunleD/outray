import { authClient } from "@/lib/auth-client";
import { Navigate, Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__authenticated")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isPending } = authClient.useSession();
  if (isPending) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <img src="/logo.png" alt="OutRay" className="w-16 h-16 animate-pulse" />
      </div>
    );
  }
  if (!data?.user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
