import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "../../lib/auth-client";
import { useEffect, useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";

export const Route = createFileRoute("/dash/install")({
  component: Install,
});

function Install() {
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const session = await authClient.getSession();
      const orgId = session.data?.session.activeOrganizationId;

      if (orgId) {
        const res = await fetch(`/api/auth-tokens?organizationId=${orgId}`);
        const tokens = await res.json();
        if (tokens.length > 0) {
          setToken(tokens[0].token);
        }
      }
    };
    fetchToken();
  }, []);

  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-8 text-3xl font-bold">Install OutRay</h1>

      {token && (
        <div className="mb-12 rounded-lg border border-gray-800 bg-gray-900/50 p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-200">
            Your Auth Token
          </h3>
          <div className="flex items-center gap-4">
            <code className="flex-1 rounded bg-black px-4 py-3 font-mono text-sm text-gray-300">
              {token}
            </code>
            <button
              onClick={copyToken}
              className="flex items-center gap-2 rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Keep this token secret. It allows access to your organization's
            tunnels.
          </p>
        </div>
      )}

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-xl font-semibold">1. Install the CLI</h2>
          <div className="rounded-lg bg-gray-900 p-4">
            <code className="text-green-400">npm install -g outray</code>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">2. Authenticate</h2>
          <div className="rounded-lg bg-gray-900 p-4">
            <code className="text-green-400">outray login {token}</code>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">3. Start a Tunnel</h2>
          <div className="rounded-lg bg-gray-900 p-4">
            <code className="text-green-400">outray http 3000</code>
          </div>
        </section>
      </div>
    </div>
  );
}
