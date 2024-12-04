// import {
//   PaymentElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import { useState } from "react";
// import axios from "axios";

// // Define a type for props
// interface CheckoutFormProps {
//   title: string;
//   price: number;
// }

// const CheckoutForm = ({ title, price }: CheckoutFormProps) => {
//   const stripe = useStripe();
//   const elements = useElements();

//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [completed, setCompleted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (event: { preventDefault: () => void }) => {
//     event.preventDefault();
//     setErrorMessage(null);
//     setIsLoading(true);

//     if (!stripe || !elements) {
//       setErrorMessage("Stripe.js or elements not loaded.");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "https://lereacteur-vinted-api.herokuapp.com/v2/payment",
//         { title, amount: price }
//       );

//       const clientSecret = response.data.client_secret;

//       const stripeResponse = await stripe.confirmPayment({
//         elements,
//         clientSecret,
//         confirmParams: { return_url: "http://localhost:5173/" },
//         redirect: "if_required",
//       });

//       if (stripeResponse.error) {
//         setErrorMessage(stripeResponse.error.message);
//       } else if (stripeResponse.paymentIntent.status === "succeeded") {
//         setCompleted(true);
//       }
//     } catch (error) {
//       console.error(error);
//       setErrorMessage("Erreur lors de la transaction : " + error.message);
//     }

//     setIsLoading(false);
//   };

//   return completed ? (
//     <p>Paiement effectué avec succès !</p>
//   ) : (
//     <form onSubmit={handleSubmit}>
//       <PaymentElement />
//       {isLoading && <div>Processing payment...</div>}
//       <button type="submit" disabled={!stripe || !elements || isLoading}>
//         Pay
//       </button>
//       {errorMessage && <div>{errorMessage}</div>}
//     </form>
//   );
// };

// export default CheckoutForm;
