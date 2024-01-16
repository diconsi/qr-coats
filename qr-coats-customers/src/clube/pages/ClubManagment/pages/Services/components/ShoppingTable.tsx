import { useAppDispatch, useAppSelector } from "@/hooks";
import { addTotals } from "@/store/club/clubSlice";
import { Container, Grid } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { IService } from "./TotalsSection";
interface RowElement {
  title: string;
  value: string;
}

export const RowComponent: FC<RowElement> = ({ title, value }) => {
  return (
    <Grid container width={"100%"}>
      <Grid item xs={6} color={"#B8BCFE"}>
        {title}
      </Grid>
      <Grid item xs={6} color={"white"} textAlign={"end"}>
        $ {value}
      </Grid>
    </Grid>
  );
};

const calculateTotalTax = (summary: IService[]) => {
  return summary.reduce(
    (sum: number, item: IService) => sum + parseFloat(item.price) * item.total,
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

  const [subTotal, setsubTotal] = useState(0);
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

  const calculateSubtotal = () => {
    if (status) {
      if (packages === 0) {
        return calculateTotalTax(services);
      } else {
        const copyServices = [...services];
        const newServices = copyServices.map((s) => ({
          ...s,
          total: s.total - packages,
        }));

        const paquetes = newServices.some(
          (service: IService) => service.total !== 0
        );

        return paquetes
          ? packages * price + calculateTotalTax(newServices)
          : packages * price;
      }
    } else {
      return calculateTotalTax(services);
    }
  };

  const tip =
    tipPercentage !== 0.0
      ? subTotal * tipPercentage
      : parseFloat(decimalValue + "");

  const qst = subTotal * 0.05 + subTotal * 0.09975;

  const total =
    decimalValue !== 0.0
      ? subTotal + parseFloat(decimalValue + "") + qst
      : subTotal + qst + tip;

  function ccyFormat(num: string) {
    return `${parseFloat(num).toFixed(2)}`;
  }

  useEffect(() => {
    init();
  }, [services, tipPercentage, decimalValue]);

  const init = () => {
    setsubTotal(calculateSubtotal());
  };

  useEffect(() => {
    dispatch(
      addTotals({
        subtotal: ccyFormat(subTotal + ""),
        tip: ccyFormat(tip + ""),
        qst: ccyFormat(qst + ""),
        total: ccyFormat(total + ""),
        products: combinedTitles,
      })
    );
  }, [subTotal]);

  const combinedTitles = services.flatMap((element: IService) => [
    {
      title: `${element.name.toUpperCase()} RATE`,
      value: parseFloat(element.price).toFixed(2),
    },
    {
      title: `${element.name.toUpperCase()} X ${
        promotion.status
          ? packages === element.total
            ? 0
            : element.total - packages
          : element.total
      }`,
      value: promotion.status
        ? packages === element.total
          ? 0
          : ((element.total - packages) * parseFloat(element.price)).toFixed(2)
        : (element.total * parseFloat(element.price)).toFixed(2),
    },
  ]);

  const example = promotion.status
    ? [
        ...combinedTitles,
        { title: "Promotion RATE", value: promotion.price },
        {
          title: `Promotion X ${packages}`,
          value: price * packages,
        },
      ]
    : combinedTitles;

  const filteredData = [];

  for (let i = 0; i < example.length; i++) {
    if (parseFloat(example[i].value + "") !== 0) {
      filteredData.push(example[i]);
    } else {
      filteredData.pop();
    }
  }

  return (
    <Container
      sx={{
        pl: 8,
        pr: 8,
        width: "100%",
      }}
    >
      {filteredData.map((element, index) => (
        <RowComponent
          key={index}
          title={element.title.toUpperCase()}
          value={element.value + ""}
        />
      ))}
      <RowComponent title={"SUBTOTAL"} value={ccyFormat(subTotal + "")} />
      <RowComponent title={"TIP"} value={ccyFormat(tip + "")} />
      <RowComponent title={"GST/QST"} value={ccyFormat(qst + "")} />
      <RowComponent title={"TOTAL"} value={ccyFormat(total + "")} />
    </Container>
  );
};

export default ShoppingTable;
