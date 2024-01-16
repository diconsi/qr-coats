import { clubManagmentPath } from "@/constants";
import { Button } from "@mui/material";
import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { FormEvent, useState } from "react";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const resp = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${clubManagmentPath}`,
      },
    });

    const { error } = resp;

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message ?? "NO ERROR MESSAGE AVAILABLE");
    } else {
      setMessage("An unexpected error occured.");
    }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} style={{ width: "100%" }}>
      <LinkAuthenticationElement />
      <PaymentElement id="payment-element" />
      <Button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        variant="contained"
        id="submit"
        sx={{
          background: "linear-gradient(to bottom, #A482F2, #8CABF0)",
          mt: 1,
        }}
      >
        <span id="button-text">
          {isProcessing ? "Processing ... " : "Pay now"}
        </span>
      </Button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};

export default CheckoutForm;
