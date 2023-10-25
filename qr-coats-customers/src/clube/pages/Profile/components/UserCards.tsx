import { ClubeLayout } from "@/clube/layout";
import { startNewCard } from "@/store/auth";
import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const UserCards = () => {
  const { nameCard, cardNumber, expireDate, cvv } = useSelector(
    (store) => store.authState
  );

  useEffect(() => {
    setNameUser(nameCard);
    setCardNumberUser(cardNumber);
    setExpireDateUser(expireDate);
    setCvvUser(cvv);
  }, []);

  const [nameUser, setNameUser] = useState("");
  const [cardNumberUser, setCardNumberUser] = useState("");
  const [expireDateUser, setExpireDateUser] = useState("");
  const [cvvUser, setCvvUser] = useState("");

  const dispatch = useDispatch();
  const handleUpdate = () => {
    const newCard = {
      nameCard: nameUser,
      cardNumber: cardNumberUser,
      expireDate: expireDateUser,
      cvv: cvvUser,
    };
    dispatch(startNewCard(newCard));
  };

  return (
    <ClubeLayout>
      <Container sx={{ paddingTop: "10%" }}>
        <Typography variant="h6" gutterBottom>
          Payment method
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="cardName"
              label="Name on card"
              value={nameUser}
              onChange={(e) => setNameUser(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="cardNumber"
              label="Card number"
              value={cardNumberUser}
              onChange={(e) => setCardNumberUser(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="expDate"
              label="Expiry date"
              value={expireDateUser}
              onChange={(e) => setExpireDateUser(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="cvv"
              label="CVV"
              type="password"
              value={cvvUser}
              onChange={(e) => setCvvUser(e.target.value)}
              helperText="Last three digits on signature strip"
              fullWidth
            />
          </Grid>
          <Grid item md={12}>
            <Button variant="contained" onClick={handleUpdate}>
              Update Card
            </Button>
          </Grid>
        </Grid>
      </Container>
    </ClubeLayout>
  );
};

export default UserCards;
