import { prisma } from "@/lib/prisma";

const DAY = 24 * 60 * 60 * 1000;

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export type TimePoint = { date: string; visits: number; bookings: number };

export type AdminDashboardData = {
  kpis: {
    totalVisits: number;
    uniqueVisitors: number;
    visitsToday: number;
    visits7d: number;
    totalUsers: number;
    users7d: number;
    totalBookings: number;
    pendingBookings: number;
  };
  conversion: {
    visitorToAccount: number; // %
    visitorToBooking: number; // %
  };
  series: TimePoint[]; // last 14 days
  bookingStatus: { pending: number; confirmed: number; cancelled: number };
  recentBookings: {
    id: string;
    name: string;
    email: string;
    phone: string;
    hotelName: string;
    hotelLocation: string;
    roomCount: number;
    hasListings: boolean;
    platforms: string[];
    otherPlatform: string | null;
    scheduledAt: Date;
    status: string;
    createdAt: Date;
  }[];
  users: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    // How they signed up: "email" (password) or "google" (OAuth).
    signUpMethod: "email" | "google";
    createdAt: Date;
    bookingCount: number;
  }[];
};

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const today = startOfToday();
  const weekAgo = new Date(Date.now() - 7 * DAY);
  const since14 = new Date(today.getTime() - 13 * DAY);

  const [
    totalVisits,
    uniqueVisitorRows,
    visitsToday,
    visits7d,
    totalUsers,
    users7d,
    totalBookings,
    pending,
    confirmed,
    cancelled,
    recent,
    userRows,
    views14,
    bookings14,
  ] = await Promise.all([
    prisma.pageView.count(),
    prisma.pageView.findMany({ distinct: ["visitorId"], select: { visitorId: true } }),
    prisma.pageView.count({ where: { createdAt: { gte: today } } }),
    prisma.pageView.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.count({ where: { status: "CANCELLED" } }),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { _count: { select: { bookings: true } } },
    }),
    prisma.pageView.findMany({
      where: { createdAt: { gte: since14 } },
      select: { createdAt: true },
    }),
    prisma.booking.findMany({
      where: { createdAt: { gte: since14 } },
      select: { createdAt: true },
    }),
  ]);

  const uniqueVisitors = uniqueVisitorRows.length;

  // Build the 14-day time series (visits + bookings per day).
  const buckets = new Map<string, { visits: number; bookings: number }>();
  for (let i = 0; i < 14; i++) {
    const d = new Date(since14.getTime() + i * DAY);
    buckets.set(dateKey(d), { visits: 0, bookings: 0 });
  }
  for (const v of views14) {
    const b = buckets.get(dateKey(v.createdAt));
    if (b) b.visits++;
  }
  for (const bk of bookings14) {
    const b = buckets.get(dateKey(bk.createdAt));
    if (b) b.bookings++;
  }
  const series: TimePoint[] = Array.from(buckets.entries()).map(([date, v]) => ({
    date,
    visits: v.visits,
    bookings: v.bookings,
  }));

  return {
    kpis: {
      totalVisits,
      uniqueVisitors,
      visitsToday,
      visits7d,
      totalUsers,
      users7d,
      totalBookings,
      pendingBookings: pending,
    },
    conversion: {
      visitorToAccount: uniqueVisitors > 0 ? round1((totalUsers / uniqueVisitors) * 100) : 0,
      visitorToBooking: uniqueVisitors > 0 ? round1((totalBookings / uniqueVisitors) * 100) : 0,
    },
    series,
    bookingStatus: { pending, confirmed, cancelled },
    recentBookings: recent.map((b) => ({
      id: b.id,
      name: b.name,
      email: b.email,
      phone: b.phone,
      hotelName: b.hotelName,
      hotelLocation: b.hotelLocation,
      roomCount: b.roomCount,
      hasListings: b.hasListings,
      platforms: b.platforms,
      otherPlatform: b.otherPlatform,
      scheduledAt: b.scheduledAt,
      status: b.status,
      createdAt: b.createdAt,
    })),
    users: userRows.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      // Email/password users have a hashedPassword; OAuth-only users don't.
      signUpMethod: (u.hashedPassword ? "email" : "google") as "email" | "google",
      createdAt: u.createdAt,
      bookingCount: u._count.bookings,
    })),
  };
}

function dateKey(d: Date): string {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
