import { ClubeLayout } from "@/clube/layout";
import { useAppSelector } from "@/hooks";
import { Container, Typography } from "@mui/material";
import { RowComponent } from "../../ClubManagment/pages/Services/components/ShoppingTable";
import { formattedDate } from "@/tools";

const TableShopping = () => {
  const { activeReceipt } = useAppSelector((store) => store.clubState);

  const { totals,date } = activeReceipt;
  const { products, qst, subtotal, tip, total } = totals;

  const filteredData = [];

  for (let i = 0; i < products.length; i++) {
    if (products[i].value !== 0) {
      filteredData.push(products[i]);
    } else {
      filteredData.pop();
    }
  }

  return (
    <ClubeLayout>
      <Typography pt={2} textAlign={'center'}>{formattedDate(date)}</Typography>
      <Container
        sx={{
          p: 8,
          width: "100%",
        }}
      >
        {filteredData.map((element, index) => (
          <RowComponent
            key={index}
            title={element.title.toUpperCase()}
            value={element.value+""}
          />
        ))}
        <RowComponent title={"SUBTOTAL"} value={subtotal} />
        <RowComponent title={"TIP"} value={tip} />
        <RowComponent title={"GST/QST"} value={qst} />
        <RowComponent title={"TOTAL"} value={total} />
      </Container>
    </ClubeLayout>
  );
};

export default TableShopping;
