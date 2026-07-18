"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { useSession } from "next-auth/react";

type AuthTab = "signin" | "signup";
// Action to resume once the user is authenticated.
type PendingIntent = "booking" | null;

type AuthModalContextValue = {
  isOpen: boolean;
  tab: AuthTab;
  bookingOpen: boolean;
  openAuth: (tab?: AuthTab) => void;
  closeAuth: () => void;
  setTab: (tab: AuthTab) => void;
  // Called by any "Book a Free Consultation" button.
  requestBooking: () => void;
  // Called by the modal after a successful sign-in/sign-up.
  onAuthSuccess: () => void;
  closeBooking: () => void;
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

  const openAuth = useCallback((next: AuthTab = "signin") => {
    setTab(next);
    setIsOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setIsOpen(false);
    setPending(null);
  }, []);

  const closeBooking = useCallback(() => setBookingOpen(false), []);

  const requestBooking = useCallback(() => {
    if (status === "authenticated") {
      setBookingOpen(true);
      return;
    }
    // Signed out: remember the intent and open the auth modal.
    setPending("booking");
    setTab("signin");
    setIsOpen(true);
  }, [status]);

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
        openAuth,
        closeAuth,
        setTab,
        requestBooking,
        onAuthSuccess,
        closeBooking,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}
