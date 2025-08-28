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

    if (!stripe || !elements) {
      setErrorMessage("Stripe n'est pas initialisé.");
      return;
    }

    setIsLoading(true);

    try {
      // 1) Validation côté Stripe
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(
          submitError.message || "Une erreur inconnue est survenue."
        );
        return;
      }

      // 2) Récupération du client_secret depuis ton backend
      const { data } = await axios.post<{ client_secret: string }>(
        "https://site--sook--dnxhn8mdblq5.code.run/payment"
      );
      const clientSecret = data?.client_secret;
      if (!clientSecret) {
        throw new Error("Client secret introuvable.");
      }

      // 3) Confirmation du paiement avec Stripe
      const stripeResponse = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/`,
        },
        redirect: "if_required", // pas de redirection si pas nécessaire
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
      const error = err as any;
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de l'initialisation du paiement."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="w-full max-w-md mx-auto bg-white/90 rounded-2xl p-6 shadow-lg text-center">
        <h2 className="text-2xl font-semibold text-green-700 mb-2">
          ✅ Paiement effectué
        </h2>
        <p className="text-gray-700">Merci pour votre achat !</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto bg-white/90 rounded-2xl p-6 shadow-lg space-y-4"
    >
      {/* Mode test */}
      <div className="text-xs text-gray-600">
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
        className="
          w-full h-12 rounded-md font-bold text-white
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
