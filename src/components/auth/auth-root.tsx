import { isGoogleEnabled } from "@/auth.config";
import { AuthModal } from "@/components/auth/auth-modal";
import { BookingModal } from "@/components/auth/booking-modal";

// Mounts the auth + booking modals once at the app root. `isGoogleEnabled`
// is read on the server (env-based) and passed to the client modal.
export function AuthRoot() {
  return (
    <>
      <AuthModal googleEnabled={isGoogleEnabled} />
      <BookingModal />
    </>
  );
}
