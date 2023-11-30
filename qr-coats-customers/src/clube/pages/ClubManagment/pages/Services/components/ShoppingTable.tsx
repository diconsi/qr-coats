import { useAppDispatch, useAppSelector } from "@/hooks";
import { addTotals } from "@/store/club/clubSlice";
import { Grid } from "@mui/material";
import { FC, useEffect } from "react";
import { IService } from "./TotalsSection";
interface RowElement {
  title: string;
  value: string | number;
}

export const RowComponent: FC<RowElement> = ({ title, value }) => {
  return (
    <Grid container width={"70%"}>
      <Grid color={"#B8BCFE"} item md={6} xs={6}>
        {title}
      </Grid>
      <Grid color={"white"} textAlign={"end"} item md={6} xs={6}>
        $ {value}
      </Grid>
    </Grid>
  );
};

const calculateTotalTax = (summary: IService[]) => {
  return summary.reduce(
    (sum: number, item: IService) => sum + item.price * item.total,
    0
  );
};

interface IPromotion {
  name: string;
  price: number;
  status: boolean;
}

interface ShoppingTableProps {
  tipPercentage: number;
  decimalValue: number;
  promotion: IPromotion;
}

const ShoppingTable: FC<ShoppingTableProps> = ({
  tipPercentage,
  decimalValue,
  promotion,
}) => {
  const { services } = useAppSelector((store) => store.clubState);
  const dispatch = useAppDispatch();
  const { status, price } = promotion;
  const totals = services.reduce(
    (accumulator, item: IService) => {
      if (item.name === "Coat") {
        accumulator.COAT += item.total;
      } else if (item.name === "Entry") {
        accumulator.ENTRY += item.total;
      }
      return accumulator;
    },
    { COAT: 0, ENTRY: 0 }
  );

  const packages = Math.min(totals.COAT, totals.ENTRY);
  const remnantCoat = totals.COAT - packages;
  const remnantEntry = totals.ENTRY - packages;

  const subtotal = status
    ? packages * price +
      (remnantEntry *
        (services.find((item: IService) => item.name === "Entry")?.price || 0) +
        remnantCoat *
          (services.find((item: IService) => item.name === "Coat")?.price || 0))
    : calculateTotalTax(services);

  const tip =
    tipPercentage !== 0.0
      ? subtotal * tipPercentage
      : parseFloat(decimalValue + "");

  const qst = subtotal * 0.05 + subtotal * 0.09975;

  const total =
    decimalValue !== 0.0
      ? subtotal + parseFloat(decimalValue + "") + qst
      : subtotal + qst + tip;

  function ccyFormat(num: string) {
    return `${parseFloat(num).toFixed(2)}`;
  }

  useEffect(() => {
    dispatch(
      addTotals({
        subtotal: ccyFormat(subtotal + ""),
        tip: ccyFormat(tip + ""),
        qst: ccyFormat(qst + ""),
        total: ccyFormat(total + ""),
        products: combinedTitles,
      })
    );
  }, [services, tipPercentage, decimalValue]);

  const combinedTitles = services
    .flatMap((element: IService) => [
      {
        title: `${element.name.toUpperCase()} RATE`,
        value: element.price,
      },
      {
        title: `${element.name.toUpperCase()} X ${
          total > packages ? element.total - packages : element.total
        }`,
        value:
          packages === total
            ? 0
            : total >= packages
            ? (element.total - packages) * element.price
            : element.price * element.total,
      },
    ])
    .concat([
      { title: "Promotion RATE", value: price },
      { title: `Promotion X ${packages}`, value: price * packages },
    ]);

  const filteredData = [];

  for (let i = 0; i < combinedTitles.length; i++) {
    if (combinedTitles[i].value !== 0) {
      filteredData.push(combinedTitles[i]);
    } else {
      filteredData.pop();
    }
  }

  return (
    <Grid container display={"flex"} justifyContent={"center"}>
      {filteredData.map((element, index) => (
        <RowComponent
          key={index}
          title={element.title.toUpperCase()}
          value={element.value}
        />
      ))}
      <RowComponent title={"SUBTOTAL"} value={ccyFormat(subtotal + "")} />
      <RowComponent title={"TIP"} value={ccyFormat(tip + "")} />
      <RowComponent title={"GST/QST"} value={ccyFormat(qst + "")} />
      <RowComponent title={"TOTAL"} value={ccyFormat(total + "")} />
    </Grid>
  );
};

export default ShoppingTable;
