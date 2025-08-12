import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import axios from "axios";

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!elements) return;
    setIsLoading(true);

    // 1) Validation côté Stripe (PaymentElement)
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(
        submitError.message || "Une erreur inconnue est survenue."
      );
      setIsLoading(false);
      return;
    }

    try {
      // 2) Crée l'intention de paiement côté backend -> client_secret
      const { data } = await axios.post(
        "https://site--sook--dnxhn8mdblq5.code.run/payment"
      );
      const clientSecret = data?.client_secret;
      if (!clientSecret) {
        throw new Error("Client secret introuvable.");
      }

      // 3) Confirmation du paiement
      if (!stripe) {
        setErrorMessage("Stripe n'est pas initialisé.");
        setIsLoading(false);
        return;
      }

      const stripeResponse = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          // Utilise l’origine courante plutôt que localhost en dur
          return_url: `${window.location.origin}/`,
        },
        redirect: "if_required",
      });

      if (stripeResponse.error) {
        setErrorMessage(
          stripeResponse.error.message ||
            "Échec de la confirmation du paiement."
        );
      } else if (
        stripeResponse.paymentIntent &&
        stripeResponse.paymentIntent.status === "succeeded"
      ) {
        setCompleted(true);
      }
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Erreur lors de l'initialisation du paiement."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="w-full max-w-md mx-auto rounded-xl bg-white/90 p-6 text-center shadow-md">
        <h2 className="text-lg font-semibold text-green-700 mb-1">
          Paiement effectué ✅
        </h2>
        <p className="text-sm text-black/70">Merci pour votre achat.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto rounded-xl bg-white/90 p-6 shadow-md space-y-4"
    >
      {/* Astuce test mode (retire si tu n’en veux pas) */}
      <div className="text-xs text-black/60">
        Mode test Stripe : utilisez la carte{" "}
        <span className="font-semibold">4242 4242 4242 4242</span>, une date
        future, CVC et code postal quelconques.
      </div>

      <div className="rounded-md border border-black/10 bg-white p-3">
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || isLoading}
        className="
          w-full h-11 rounded-md font-bold text-white
          bg-[#dfa080bd] hover:bg-[#c87660]
          disabled:opacity-60 disabled:cursor-not-allowed
          transition-colors
        "
      >
        {isLoading ? "Paiement en cours..." : "Payer"}
      </button>
    </form>
  );
};

export default CheckoutForm;
