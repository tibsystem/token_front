import PropertyCheckout from "../../components/CheckoutTokens/ConfirmPurchase";
import { useRouter } from 'next/router';

export default function CheckoutPage() {
  const router = useRouter();
  let property = null;
  if (router.query.property) {
    try {
      property = JSON.parse(decodeURIComponent(router.query.property));
    } catch {}
  }
  return (
    <div className="container mx-auto px-4 py-5">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      <PropertyCheckout property={property} />
    </div>
  );
}