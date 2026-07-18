"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { getMyBookings, type MyBooking } from "@/actions/booking";

type AuthTab = "signin" | "signup";
// Action to resume once the user is authenticated.
type PendingIntent = "booking" | null;

type AuthModalContextValue = {
  isOpen: boolean;
  tab: AuthTab;
  bookingOpen: boolean;
  myBookingsOpen: boolean;
  myBookings: MyBooking[];
  openAuth: (tab?: AuthTab) => void;
  closeAuth: () => void;
  setTab: (tab: AuthTab) => void;
  // Called by any "Book a Free Consultation" button. Opens the existing
  // reservation popup if the user already has an upcoming booking, else the
  // booking form (or the auth modal when signed out).
  requestBooking: () => void;
  // Force a fresh booking form even if a reservation already exists.
  startNewBooking: () => void;
  // Open the "My Bookings" popup directly (from the user menu).
  openMyBookings: () => void;
  closeMyBookings: () => void;
  // Called by the modal after a successful sign-in/sign-up.
  onAuthSuccess: () => void;
  closeBooking: () => void;
  // Re-fetch the user's bookings (e.g. after creating one).
  refreshBookings: () => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
}

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<AuthTab>("signin");
  const [pending, setPending] = useState<PendingIntent>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [myBookingsOpen, setMyBookingsOpen] = useState(false);
  const [myBookings, setMyBookings] = useState<MyBooking[]>([]);

  const refreshBookings = useCallback(() => {
    if (status !== "authenticated") {
      setMyBookings([]);
      return;
    }
    getMyBookings()
      .then(setMyBookings)
      .catch(() => setMyBookings([]));
  }, [status]);

  // Load the user's bookings whenever they become authenticated.
  useEffect(() => {
    refreshBookings();
  }, [refreshBookings]);

  const openAuth = useCallback((next: AuthTab = "signin") => {
    setTab(next);
    setIsOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setIsOpen(false);
    setPending(null);
  }, []);

  const closeBooking = useCallback(() => setBookingOpen(false), []);

  const openMyBookings = useCallback(() => setMyBookingsOpen(true), []);
  const closeMyBookings = useCallback(() => setMyBookingsOpen(false), []);

  const startNewBooking = useCallback(() => {
    setMyBookingsOpen(false);
    setBookingOpen(true);
  }, []);

  const requestBooking = useCallback(() => {
    if (status === "authenticated") {
      // Already has an upcoming reservation? Show it instead of a new form.
      const hasUpcoming = myBookings.some((b) => b.isUpcoming);
      if (hasUpcoming) {
        setMyBookingsOpen(true);
      } else {
        setBookingOpen(true);
      }
      return;
    }
    // Signed out: remember the intent and open the auth modal.
    setPending("booking");
    setTab("signin");
    setIsOpen(true);
  }, [status, myBookings]);

  const onAuthSuccess = useCallback(() => {
    setIsOpen(false);
    if (pending === "booking") {
      setPending(null);
      setBookingOpen(true);
    }
  }, [pending]);

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        tab,
        bookingOpen,
        myBookingsOpen,
        myBookings,
        openAuth,
        closeAuth,
        setTab,
        requestBooking,
        startNewBooking,
        openMyBookings,
        closeMyBookings,
        onAuthSuccess,
        closeBooking,
        refreshBookings,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}
