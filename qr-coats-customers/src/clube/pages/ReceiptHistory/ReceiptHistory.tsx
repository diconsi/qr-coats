import { ClubeLayout } from "@/clube/layout";
import { useAppDispatch, useAppSelector, useFetchAndLoad } from "@/hooks";
import { getOrders } from "@/services/order.services";
import { setReceiptHistory } from "@/store/club/clubSlice";
import { Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import CardReceipt from "./components/CardReceipt";

export interface IReceipt {
  _id: string;
  date: string;
  clubId: string;
  creator: string;
  totals: {
    subtotal: string;
    tip: string;
    qst: string;
    total: string;
    products: [
      {
        title: string;
        value: number;
      }
    ];
  };
}

const ReceiptHistory = () => {
  const { receiptHistory } = useAppSelector((store) => store.clubState);
  const { uid, access_token } = useAppSelector((store) => store.authState);
  const dispatch = useAppDispatch();
  const { callEndpoint } = useFetchAndLoad();
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data } = await callEndpoint(getOrders(uid, access_token));
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
          overflowY: "scroll",
        }}
      >
        <Typography sx={{ pt: 2 }} variant="h4">
          RECEIPT LIST
        </Typography>
        {receiptHistory.map((receipt: IReceipt) => (
          <CardReceipt key={receipt._id} receipt={receipt} />
        ))}
      </Grid>
    </ClubeLayout>
  );
};

export default ReceiptHistory;
