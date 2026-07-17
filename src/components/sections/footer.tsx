import Link from "next/link";
import { X } from "lucide-react";
import { LinkedinIcon, InstagramIcon } from "@/components/ui/social-icons";

const QUICK_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Results", href: "#results" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const SOCIALS = [
  { icon: LinkedinIcon, label: "LinkedIn", href: "#" },
  { icon: InstagramIcon, label: "Instagram", href: "#" },
  { icon: X, label: "X", href: "#" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-gold-400/20 bg-navy-950">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <p className="mb-3 font-serif text-2xl text-offwhite">Revstay</p>
            <p className="max-w-xs text-sm leading-relaxed text-offwhite/50">
              Revenue growth for hotels on the world&apos;s leading booking
              platforms.
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-offwhite/40">
              Quick Links
            </p>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-offwhite/70 transition-colors hover:text-gold-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-offwhite/40">
              Contact
            </p>
            <a
              href="mailto:hello@revstay.com"
              className="mb-5 block text-sm text-offwhite/70 transition-colors hover:text-gold-400"
            >
              hello@revstay.com
            </a>
            <div className="flex items-center gap-4">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="text-offwhite/50 transition-colors hover:text-gold-400"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-offwhite/10 pt-6 text-center text-xs text-offwhite/40">
          © 2026 Revstay. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
