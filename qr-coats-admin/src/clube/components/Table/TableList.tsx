import { UserListToolbar } from "@/clube/pages";
import { Card } from "@mui/material";
import { DataTable } from "mantine-datatable";
import { ChangeEvent } from "react";
import { HeaderSectionPage } from "..";
import Scrollbar from "../scrollbar/Scrollbar";
import { newEmployee } from "@/constants";

const TableList = ({
  title,
  handleActioModal,
  titleButton,
  disableButton = false,
  iconHeaderSection,
  data,
  columns,
}) => {
  // console.log(data,columns)
  const handleFilterByName = (event: ChangeEvent<HTMLInputElement>) => {
    // setPage(0);
    // setFilterName(event.target.value);
  };

  const onClick = () => {
    handleActioModal(newEmployee);
  };

  return (
    <>
      <HeaderSectionPage
        title={title}
        onClick={onClick}
        titleButton={titleButton}
        disableButton={disableButton}
        icon={iconHeaderSection}
      />
      <Card style={{ height: "100%" }}>
        <DataTable
          withColumnBorders
          striped
          highlightOnHover
          records={data}
          columns={columns}
          withBorder
          noRecordsText="No se encontraron datos"
        />
      </Card>
    </>
  );
};

export default TableList;
