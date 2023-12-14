import { Card } from "@mui/material";
import { DataTable } from "mantine-datatable";
import { FC } from "react";

interface ITableList<T> {
  data: T[];
  columns: T[];
}

const TableList: FC<ITableList<any>> = ({ data, columns }) => {
  return (
    <Card
      sx={{
        bgcolor: "transparent",
        height: "100%",
        width: "100%",
      }}
    >
      <DataTable
        sx={{ fontFamily: "AttenBold" }}
   
        rowStyle={{ background: "transparent", color: "white" }}
        striped
        highlightOnHover
        records={data}
        columns={columns}

        noRecordsText="No se encontraron datos"
      />
    </Card>
  );
};

export default TableList;
