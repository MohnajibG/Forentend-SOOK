import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!stripe || !elements) {
      setErrorMessage("Stripe n'est pas initialisé.");
      return;
    }

    setIsLoading(true);

    try {
      // 1) Validation côté Stripe (ex: champs obligatoires remplis)
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(
          submitError.message || "Une erreur inconnue est survenue."
        );
        return;
      }

      // 2) Confirmation du paiement
      const stripeResponse = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`, // redirection si besoin
        },
        redirect: "if_required", // évite la redirection auto
      });

      if (stripeResponse.error) {
        setErrorMessage(
          stripeResponse.error.message ||
            "Échec de la confirmation du paiement."
        );
      } else if (stripeResponse.paymentIntent?.status === "succeeded") {
        setCompleted(true);
      }
    } catch (err: unknown) {
      setErrorMessage((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="w-full pt-4 border-t border-white/30 text-center">
        <h2 className="text-xl font-bold mb-1">✅ Paiement effectué</h2>
        <p className="text-sm text-white/85">
          Merci pour votre achat ! Le vendeur a été notifié.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full pt-4 border-t border-white/30 space-y-4"
    >
      {/* Mode test */}
      <div className="text-xs text-white/80 bg-white/10 rounded-md p-2.5">
        <span className="font-semibold">Mode test Stripe :</span> utilisez la
        carte <span className="font-semibold">4242 4242 4242 4242</span>, une
        date future, un CVC et un code postal au choix.
      </div>

      {/* Élément Stripe */}
      <div className="rounded-md border border-gray-300 bg-white p-3">
        <PaymentElement />
      </div>

      {/* Message d'erreur */}
      {errorMessage && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          {errorMessage}
        </div>
      )}

      {/* Bouton de paiement */}
      <button
        type="submit"
        disabled={!stripe || !elements || isLoading}
        className="btn-primary w-full h-12"
      >
        {isLoading ? "Paiement en cours..." : "Payer"}
      </button>
    </form>
  );
};

export default CheckoutForm;
