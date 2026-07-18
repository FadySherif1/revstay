export type Platform = {
  name: string;
  description: string;
  tag: "OTA" | "Stays" | "B2B";
  /** Subtle brand-tint accent (rgb triplets) used for tag/border only — not
   * a brand logo. Separate light/dark variants keep each accent readable
   * (AA contrast) against the card surface in both themes. */
  accentLight: string;
  accentDark: string;
};

export const PLATFORM_DETAILS: Platform[] = [
  {
    name: "Booking.com",
    description: "The world's largest hotel booking platform",
    tag: "OTA",
    accentLight: "0, 53, 128", // deep blue tint
    accentDark: "52, 136, 255",
  },
  {
    name: "Agoda",
    description: "Asia's leading travel booking powerhouse",
    tag: "OTA",
    accentLight: "197, 30, 58", // red tint
    accentDark: "231, 98, 120",
  },
  {
    name: "Expedia",
    description: "Global reach across flights, stays & packages",
    tag: "OTA",
    accentLight: "148, 104, 0", // amber tint, darkened for AA on light cards
    accentDark: "255, 179, 0",
  },
  {
    name: "Airbnb",
    description: "Boutique stays & apartment-hotel travelers",
    tag: "Stays",
    accentLight: "231, 0, 7", // coral tint, darkened for AA on light cards
    accentDark: "255, 90, 95",
  },
  {
    name: "Hotelbeds",
    description: "B2B distribution to tour operators worldwide",
    tag: "B2B",
    accentLight: "0, 132, 120", // teal tint
    accentDark: "0, 158, 143",
  },
  {
    name: "Hotels.com",
    description: "Loyalty-driven bookers who return",
    tag: "OTA",
    accentLight: "214, 43, 55", // crimson tint
    accentDark: "224, 97, 106",
  },
  {
    name: "Trip.com",
    description: "Gateway to the fast-growing Asian market",
    tag: "OTA",
    accentLight: "32, 106, 255", // bright blue tint
    accentDark: "71, 132, 255",
  },
];

/** Plain name list (used by the hero trust-line badges). */
export const PLATFORMS = PLATFORM_DETAILS.map((p) => p.name);
