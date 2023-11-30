import { tableHistoryPath } from "@/constants";
import { useAppDispatch, useRedirectTo } from "@/hooks";
import { setActiveReceipt } from "@/store/club/clubSlice";
import { formattedDate } from "@/tools";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Grid, IconButton } from "@mui/material";
import { IReceipt } from "../ReceiptHistory";

const CardReceipt = ({ receipt }: { receipt: IReceipt }) => {
  const redirectTo = useRedirectTo();
  const dispatch = useAppDispatch();
  const {
    date,
    totals: { total },
  } = receipt;
  const handleClickHistory = async () => {
    dispatch(setActiveReceipt(receipt));
    redirectTo(tableHistoryPath);
  };
  return (
    <Grid
      sx={{
        mt: 2,
        width: { md: "60%", xs: "100%" },
        height: "15vh",
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
        borderRadius: 8,
        border: "2px solid #B8BCFE",
      }}
      item
      md={12}
      xs={12}
    >
      <Grid container width={"100%"} height={"100%"}>
        <Grid item xs={12} md={5}>
          {formattedDate(date)}
        </Grid>
        <Grid item xs={12} md={5}>
          ${total} USD
        </Grid>
        <Grid item xs={12} md={2}>
          <IconButton sx={{ color: "#B8BCFE" }} onClick={handleClickHistory}>
            <VisibilityOutlinedIcon fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CardReceipt;
