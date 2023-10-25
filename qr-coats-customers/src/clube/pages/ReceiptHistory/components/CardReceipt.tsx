import { tableHistoryPath } from "@/constants";
import { Order } from "@/helepers";
import { useFetchAndLoad, useRedirectTo } from "@/hooks";
import { getOrderById } from "@/services/order.services";
import { setActiveReceipt } from "@/store/club/clubSlice";
import { formattedDate } from "@/tools";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Card, Grid, IconButton } from "@mui/material";
import { useDispatch } from "react-redux";

interface CardReceiptProps {
  receipt: Order;
}

const CardReceipt = ({ receipt }: CardReceiptProps) => {
  const redirectTo = useRedirectTo();
  const dispatch = useDispatch();
  const { callEndpoint } = useFetchAndLoad();
  const { idAdmin, idClub, idOrder, date, total } = receipt;
  const handleClickHistory = async () => {
    const { data } = await callEndpoint(getOrderById(idAdmin, idClub, idOrder));
    console.log(data);
    dispatch(setActiveReceipt(data));
    redirectTo(tableHistoryPath);
  };
  return (
    <Grid
      sx={{ width: "100%", height: "20%", p: 5 }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      item
      md={12}
    >
      <Card
        sx={{
          width: "60%",
          boxShadow: 0,
          textAlign: "center",
          bgcolor: "primary.main",
          py: 5,
          color: "white",
          fontWeight: "bold",
        }}
      >
        <Grid
          container
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item md={5}>
            {formattedDate(date)}
          </Grid>
          <Grid item md={5}>
            ${total} USD
          </Grid>
          <Grid item md={2}>
            <IconButton onClick={handleClickHistory} sx={{ color: "white" }}>
              <VisibilityOutlinedIcon fontSize="large" />
            </IconButton>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};

export default CardReceipt;
