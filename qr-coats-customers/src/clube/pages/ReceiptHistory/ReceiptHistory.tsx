import { ClubeLayout } from "@/clube/layout";
import { Order } from "@/helepers";
import { useFetchAndLoad } from "@/hooks";
import { ordersByIdCustomer } from "@/services/order.services";
import { setReceiptHistory } from "@/store/club/clubSlice";
import { Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardReceipt from "./components/CardReceipt";

const ReceiptHistory = () => {
  const { receiptHistory } = useSelector((store) => store.clubState);
  const { uid } = useSelector((store) => store.authState);
  const dispatch = useDispatch();
  const { callEndpoint } = useFetchAndLoad();
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data } = await callEndpoint(ordersByIdCustomer(uid));
    dispatch(setReceiptHistory(data));
  };

  return (
    <ClubeLayout>
      <Grid
        display="flex"
        justifyContent="center"
        container
        sx={{
          height: "100%",
          width: "100%",
        }}
      >
        <Typography variant="h4">Receipt List</Typography>
        {receiptHistory.map((h: Order) => (
          <CardReceipt key={h.id} receipt={h} />
        ))}
      </Grid>
    </ClubeLayout>
  );
};

export default ReceiptHistory;
