import { useEffect, useState } from "react";
import { LayoutDashboard, LogIn } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { SiGithub } from "react-icons/si";

export const Navbar = () => {
  const { data: session } = authClient.useSession();
  const { data: organizations } = authClient.useListOrganizations();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/80 backdrop-blur-md border-b border-white/5 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="OutRay Logo"
            className={`${scrolled ? "w-10" : "w-12"} transition-all`}
          />
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
          <Link to="/docs/$" className="hover:text-white transition-colors">
            Documentation
          </Link>
          <Link to="/pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/akinloluwami/outray"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <SiGithub size={20} />
          </a>
          {session ? (
            <Link
              to={organizations?.length ? "/$orgSlug" : "/select"}
              params={{
                orgSlug:
                  organizations && organizations.length
                    ? organizations[0].slug
                    : "",
              }}
              className="px-5 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm"
            >
              <LogIn size={16} />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
