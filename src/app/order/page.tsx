import { redirect } from "next/navigation";

// Unified checkout has merged into /cart (Requirements 79-84).
// Redirect any /order traffic directly to /cart.
export default function OrderPage() {
  redirect("/cart");
}
