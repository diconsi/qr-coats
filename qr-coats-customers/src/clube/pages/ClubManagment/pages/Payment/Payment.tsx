import { useAppSelector, useFetchAndLoad } from "@/hooks";
import { createPaymentIntent, getKey } from "@/services";
import { Grid } from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import CheckoutForm from "./components/CheckoutForm";
interface PaymentIntentResponse {
  clientSecret: string;
}

const Payment = () => {
  const [stripePromise, setStripePromise] = useState<Stripe | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const { callEndpoint } = useFetchAndLoad();
  const { totals } = useAppSelector((store) => store.clubState);
  const amount = totals.total * 100;

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data } = await callEndpoint(getKey());
    if (data && typeof data === "string") {
      const stripe = await loadStripe(data);

      const {
        data: { clientSecret },
      } = (await callEndpoint(createPaymentIntent({ amount: amount }))) as {
        data: PaymentIntentResponse;
      };

      setStripePromise(stripe);
      setClientSecret(clientSecret);
    }
  };

  return (
    <Grid container pt={5} height={"90%"}>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </Grid>
  );
};

export default Payment;
