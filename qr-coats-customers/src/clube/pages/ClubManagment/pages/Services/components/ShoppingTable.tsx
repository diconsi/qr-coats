import { addTotals } from "@/store/club/clubSlice";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const calculateTotalTax = (summary) => {
  return summary.reduce((sum, item) => sum + item.tax * item.total, 0);
};

const ShoppingTable = ({ summary, tipPercentage, decimalValue, promotion }) => {
  const dispatch = useDispatch();
  const { status, price } = promotion;
  const totals = summary.reduce(
    (accumulator, item) => {
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
      remnantEntry * summary.find((item) => item.name === "Entry").price +
      remnantCoat * summary.find((item) => item.name === "Coat").price
    : calculateTotalTax(summary);

  const tip =
    tipPercentage !== 0 ? subtotal * tipPercentage : parseFloat(decimalValue);

  const qst = subtotal * 0.05 + subtotal * 0.09975;

  const total =
    decimalValue !== "" ? subtotal + decimalValue + qst : subtotal + qst + tip;
  function ccyFormat(num: number) {
    return `${num.toFixed(2)}`;
  }

  function priceRow(qty: number, unit: number) {
    return qty * unit;
  }

  function createRow(desc: string, qty: number, unit: number) {
    const price = priceRow(qty, unit);
    return { desc, qty, unit, price };
  }

  const rows = summary.map((item) => {
    const itemName = item.name;
    const itemTotal =
      packages !== 0
        ? itemName === "Entry"
          ? remnantEntry
          : remnantCoat
        : item.total;
    const itemTax = item.price;
    return createRow(itemName, itemTotal, itemTax);
  });

  rows.unshift(createRow("Promotion", packages, price));
  useEffect(() => {
    dispatch(
      addTotals({
        subtotal: ccyFormat(subtotal),
        tip: ccyFormat(tip),
        qst: ccyFormat(qst),
        total: ccyFormat(total),
        products: rows,
      })
    );
  }, [summary, tipPercentage, decimalValue]);

  return (
    <TableContainer sx={{ maxHeight: "80%", height: "100%" }} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell align="right">Qty.</TableCell>
            <TableCell align="right">Unit</TableCell>
            <TableCell align="right">Sum</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.desc}>
              <TableCell>{row.desc}</TableCell>
              <TableCell align="right">{row.qty}</TableCell>
              <TableCell align="right">{row.unit}</TableCell>
              <TableCell align="right">{ccyFormat(row.price)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell rowSpan={4} />
            <TableCell colSpan={2}>Subtotal</TableCell>
            <TableCell align="right">{ccyFormat(subtotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Tip</TableCell>
            <TableCell align="right">{ccyFormat(tip)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>GST/QST</TableCell>
            <TableCell align="right">{ccyFormat(qst)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="right">{total}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ShoppingTable;
