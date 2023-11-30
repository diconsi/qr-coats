import { ClubeLayout } from "@/clube/layout";
import { useAppSelector } from "@/hooks";
import { Grid } from "@mui/material";
import { RowComponent } from "../../ClubManagment/pages/Services/components/ShoppingTable";

const TableShopping = () => {
  const { activeReceipt } = useAppSelector((store) => store.clubState);

  const { totals } = activeReceipt;
  const { products, qst, subtotal, tip, total } = totals;

  return (
    <ClubeLayout>
      <Grid sx={{ p: 4, height: "100%" }}>
        {products.map((element, index) => (
          <RowComponent
            key={index}
            title={element.title.toUpperCase()}
            value={element.value}
          />
        ))}

        <RowComponent title={"SUBTOTAL"} value={subtotal} />
        <RowComponent title={"TIP"} value={tip} />
        <RowComponent title={"GST/QST"} value={qst} />
        <RowComponent title={"TOTAL"} value={total} />
      </Grid>
    </ClubeLayout>
  );
};

export default TableShopping;
