import { ClubeLayout } from "@/clube/layout";
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useSelector } from "react-redux";

const TableShopping = () => {
  const {
    activeReceipt: {
      totals: { products, subtotal, tip, qst, total },
    },
  } = useSelector((store) => store.clubState);
  return (
    <ClubeLayout>
      <Grid
        height="100%"
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <TableContainer
          sx={{ maxHeight: "80%", height: "100%", width: "50%" }}
          component={Paper}
        >
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
              {products.map((row) => (
                <TableRow key={row.desc}>
                  <TableCell>{row.desc}</TableCell>
                  <TableCell align="right">{row.qty}</TableCell>
                  <TableCell align="right">{row.unit}</TableCell>
                  <TableCell align="right">{row.price}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell rowSpan={4} />
                <TableCell colSpan={2}>Subtotal</TableCell>
                <TableCell align="right">{subtotal}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Tip</TableCell>
                <TableCell align="right">{tip}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>GST/QST</TableCell>
                <TableCell align="right">{qst}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell align="right">{total}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </ClubeLayout>
  );
};

export default TableShopping;
