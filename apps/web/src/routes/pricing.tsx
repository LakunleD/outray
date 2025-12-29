import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/navbar";
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans";
import { Check, X, Activity } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

function PricingPage() {
  const plans = Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => ({
    id: key,
    ...plan,
  }));

  const formatBandwidth = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb >= 1024) {
      return `${gb / 1024}TB`;
    }
    return `${gb}GB`;
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-accent/30 font-sans">
      <Navbar />

      <div className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Start for free, upgrade as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col p-8 rounded-3xl border ${
                  plan.id === "ray"
                    ? "bg-white/5 border-accent/50 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                    : "bg-[#0c0c0c] border-white/10"
                }`}
              >
                {plan.id === "ray" && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-black text-xs font-bold rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-white/40">/month</span>
                  </div>
                </div>

                <div className="flex-1 space-y-4 mb-8">
                  <FeatureItem
                    label={`${
                      (plan.features.maxTunnels as number) === -1
                        ? "Unlimited"
                        : plan.features.maxTunnels
                    } Tunnels`}
                  />
                  <FeatureItem
                    label={`${
                      (plan.features.maxDomains as number) === -1
                        ? "Unlimited"
                        : plan.features.maxDomains
                    } Custom Domains`}
                    included={plan.features.maxDomains !== 0}
                  />
                  <FeatureItem
                    label={`${
                      (plan.features.maxSubdomains as number) === -1
                        ? "Unlimited"
                        : plan.features.maxSubdomains
                    } Subdomains`}
                  />
                  <FeatureItem
                    label={`${formatBandwidth(
                      plan.features.bandwidthPerMonth,
                    )} Bandwidth`}
                  />
                  <FeatureItem
                    label={`${plan.features.retentionDays} Days Log Retention`}
                  />
                  <FeatureItem
                    label="Priority Support"
                    included={plan.features.prioritySupport}
                  />
                </div>

                <Link
                  to="/login"
                  className={`w-full py-3 rounded-full font-bold text-center transition-all ${
                    plan.id === "ray"
                      ? "bg-white text-black hover:bg-gray-200"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {plan.price === 0 ? "Get Started" : "Subscribe"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-white/10 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-accent rounded-md flex items-center justify-center">
              <Activity className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold">OutRay</span>
          </div>
          <div className="text-white/40 text-sm">
            © {new Date().getFullYear()} OutRay Inc. All rights reserved.
          </div>
          <div className="flex gap-6 text-white/60">
            <a href="#" className="hover:text-white transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-white transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Discord
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureItem({
  label,
  included = true,
}: {
  label: string;
  included?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {included ? (
        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
          <Check size={12} className="text-white" />
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0">
          <X size={12} className="text-white/20" />
        </div>
      )}
      <span className={included ? "text-white/80" : "text-white/40"}>
        {label}
      </span>
    </div>
  );
}
