export type Platform = {
  name: string;
  description: string;
  tag: "OTA" | "Stays" | "B2B";
  /** Subtle accent tint (rgb triplet) used for tag/border only — not a brand logo. */
  accent: string;
};

export const PLATFORM_DETAILS: Platform[] = [
  {
    name: "Booking.com",
    description: "The world's largest hotel booking platform",
    tag: "OTA",
    accent: "0, 53, 128", // deep blue tint
  },
  {
    name: "Agoda",
    description: "Asia's leading travel booking powerhouse",
    tag: "OTA",
    accent: "197, 30, 58", // red tint
  },
  {
    name: "Expedia",
    description: "Global reach across flights, stays & packages",
    tag: "OTA",
    accent: "255, 179, 0", // amber-yellow tint
  },
  {
    name: "Airbnb",
    description: "Boutique stays & apartment-hotel travelers",
    tag: "Stays",
    accent: "255, 90, 95", // coral tint
  },
  {
    name: "Hotelbeds",
    description: "B2B distribution to tour operators worldwide",
    tag: "B2B",
    accent: "0, 150, 136", // teal tint
  },
  {
    name: "Hotels.com",
    description: "Loyalty-driven bookers who return",
    tag: "OTA",
    accent: "214, 43, 55", // crimson tint
  },
  {
    name: "Trip.com",
    description: "Gateway to the fast-growing Asian market",
    tag: "OTA",
    accent: "41, 112, 255", // bright blue tint
  },
];

/** Plain name list (used by the hero trust-line badges). */
export const PLATFORMS = PLATFORM_DETAILS.map((p) => p.name);
