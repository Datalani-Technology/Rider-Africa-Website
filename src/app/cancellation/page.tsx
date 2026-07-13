import type { Metadata } from "next";
import PolicyLayout from "@/components/PolicyLayout";

export const metadata: Metadata = {
  title: "Cancellation Policy",
  description: "Rider Africa Cancellation Policy — driver and customer cancellation rules.",
};

export default function CancellationPage() {
  return (
    <PolicyLayout
      title="Cancellation Policy"
      subtitle="Clear, fair cancellation rules for customers and driver-partners."
      lastUpdated="June 2026"
    >
      <h2>1. Purpose</h2>
      <p>
        This policy explains the rules and any applicable fees that apply when
        a booking on the Rider Africa Platform is cancelled by the customer or
        by the driver-partner. All amounts are in Namibian Dollars (N$).
      </p>

      <h2>2. Customer Cancellations</h2>

      <h3>2.1 Free Cancellation Window</h3>
      <p>
        Customers may cancel a booking <strong>free of charge</strong> within{" "}
        <strong>3 minutes</strong> of placing the order, provided a driver has
        not yet been assigned.
      </p>

      <h3>2.2 Cancellation After Driver Assignment</h3>
      <p>
        Once a driver has been assigned and is en route to the pickup location:
      </p>
      <ul>
        <li>
          <strong>Cancellation within 5 minutes of driver dispatch:</strong> No
          fee
        </li>
        <li>
          <strong>Cancellation 5–15 minutes after driver dispatch:</strong>{" "}
          Cancellation fee of N$ 25
        </li>
        <li>
          <strong>Cancellation more than 15 minutes after driver dispatch,
          or after driver arrival at pickup:</strong> Cancellation fee of N$ 50
        </li>
      </ul>
      <p>
        Cancellation fees are deducted from your pre-payment or charged to your
        in-app wallet or registered payment method.
      </p>

      <h3>2.3 No-Show</h3>
      <p>
        If a customer is not present at the pickup location within 10 minutes
        of the driver&apos;s arrival, the booking will be automatically cancelled
        and a no-show fee of <strong>N$ 50</strong> will apply.
      </p>

      <h2>3. Driver-Partner Cancellations</h2>
      <p>
        Driver-partners are expected to complete all accepted bookings. A
        driver who cancels an accepted booking without a valid reason will
        receive a warning. Repeated cancellations may result in temporary
        suspension or permanent removal from the platform.
      </p>
      <p>
        If a driver cancels after accepting your booking, no fee will be
        charged to you and you will be immediately re-matched with another
        available driver.
      </p>

      <h2>4. Rider Africa-Initiated Cancellations</h2>
      <p>
        Rider Africa reserves the right to cancel a booking in the following
        situations:
      </p>
      <ul>
        <li>No available drivers in the requested area</li>
        <li>Safety concerns identified by the system or a driver</li>
        <li>Suspected prohibited item transport</li>
        <li>System or technical failure</li>
      </ul>
      <p>
        In such cases, no cancellation fee will be charged to the customer and
        any pre-payment will be fully refunded.
      </p>

      <h2>5. How to Cancel</h2>
      <p>
        Bookings can be cancelled directly within the Rider Africa app by
        navigating to your active booking and selecting &quot;Cancel Booking&quot;. You
        may also contact support at <strong>+264 81 469 8594</strong> or <strong>+264 81 732 7089</strong>.
      </p>

      <h2>6. Disputes</h2>
      <p>
        If you believe a cancellation fee was applied incorrectly, contact us
        at <strong>admin@riderafrica.com</strong> within 24 hours of the
        cancellation. We will investigate and respond within 2 business days.
      </p>

      <h2>7. Contact</h2>
      <p>
        <strong>Email:</strong> admin@riderafrica.com<br />
        <strong>Phone / WhatsApp:</strong> +264 81 469 8594 / +264 81 732 7089
      </p>
    </PolicyLayout>
  );
}
