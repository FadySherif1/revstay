import { Suspense } from "react";
import { isGoogleEnabled } from "@/auth.config";
import { AuthModal } from "@/components/auth/auth-modal";
import { BookingModal } from "@/components/auth/booking-modal";
import { MyBookingsModal } from "@/components/auth/my-bookings-modal";

// Mounts the auth + booking modals once at the app root. `isGoogleEnabled`
// is read on the server (env-based) and passed to the client modal.
// AuthModal reads useSearchParams() (to catch NextAuth's ?error=... redirect
// after a failed Google sign-in), which Next requires a Suspense boundary
// around in the app router.
export function AuthRoot() {
  return (
    <>
      <Suspense fallback={null}>
        <AuthModal googleEnabled={isGoogleEnabled} />
      </Suspense>
      <BookingModal />
      <MyBookingsModal />
    </>
  );
}
