import { CustomButton, InputText, ModalComponent } from "@/clube/components";
import { useAppSelector } from "@/hooks";
import { Fab, Grid, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import ShoppingTable from "./ShoppingTable";

export interface IService {
  enable: boolean;
  id: string;
  name: string;
  price: string;
  status: boolean;
  total: number;
}

const TotalsSection = () => {
  const { services, promotion, totals } = useAppSelector(
    (store) => store.clubState
  );

  const [decimalValue, setDecimalValue] = useState(0.0);
  const [showModal, setShowModal] = useState(false);
  const [tipPercentage, setTipPercentage] = useState(0.1);
  const [value, setValue] = useState(0.0);
  const [activeButtonIndex, setActiveButtonIndex] = useState<number | null>(
    0
  );

  const [isVisibleTable, setIsVisibleTable] = useState(false);

  useEffect(() => {
    setIsVisibleTable(
      services.some((service: IService) => service.total !== 0)
    );
  }, [services]);

  const handleDecimalChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === "0") {
      setValue(parseFloat(value));
    }
  };

  const handleTipClick = (percentage: number, index: number) => {
    setDecimalValue(0.0);
    setActiveButtonIndex(index);
    setTipPercentage(percentage);
  };

  const onCloseModal = () => {
    setShowModal(false);
    setDecimalValue(0.0);
    setTipPercentage(0.1);
  };

  const onSave = () => {
    setDecimalValue(value);
    setShowModal(false);
  };

  const onClickEdit = () => {
    setDecimalValue(0.0);
    setTipPercentage(0);
    setActiveButtonIndex(3);
    setShowModal(true);
  };

  const renderBody = () => {
    return (
      <InputText
        type="number"
        placeholder="Enter Tip"
        name="tip"
        value={value}
        onChange={handleDecimalChange}
      />
    );
  };

  const renderFooter = () => {
    return (
      <Grid container justifyContent={"end"}>
        <CustomButton fullWidth={false} label="CANCEL" onClick={onCloseModal} />
        <CustomButton
          style={{ marginLeft: "5px" }}
          fullWidth={false}
          label="OK"
          onClick={onSave}
          disabled={value === 0.0}
          background="linear-gradient(to bottom, #A482F2, #8CABF0)"
        />
      </Grid>
    );
  };
  return (
    <Grid item xs={12} md={6}>
      {isVisibleTable && (
        <Grid container display={"flex"} justifyContent={"center"}>
          <Grid container justifyContent="center" sx={{ mb: 2, mt: 2 }}>
            <Typography>LEAVE A TIP</Typography>
          </Grid>
          <Grid
            container
            alignItems="center"
            sx={{
              pb: 3,
              width: "80%",
            }}
          >
            {[0.1, 0.15, 0.2].map((percentage, index) => (
              <Grid
                item
                display={"flex"}
                justifyContent="center"
                xs={3}
                md={3}
                key={percentage}
              >
                <Fab
                  size="large"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: 4,
                    color: activeButtonIndex === index ? "black" : "white",
                    bgcolor:
                      activeButtonIndex === index ? "#D5E7FF" : "#656581",
                  }}
                  onClick={() => handleTipClick(percentage, index)}
                >
                  <Typography display="block" variant="h6">{`${
                    percentage * 100
                  }%`}</Typography>
                  <Typography display="block" variant="caption">
                    ${(totals.subtotal * percentage).toFixed(2)}
                  </Typography>
                </Fab>
              </Grid>
            ))}
            <Grid item display={"flex"} justifyContent="center" xs={3} md={3}>
              <Fab
                sx={{
                  padding: 4,
                  fontSize: "20px",
                  color: activeButtonIndex === 3 ? "black" : "white",
                  bgcolor: activeButtonIndex === 3 ? "#D5E7FF" : "#656581",
                }}
                onClick={onClickEdit}
              >
                EDIT
              </Fab>
            </Grid>
          </Grid>
          <ShoppingTable
            promotion={promotion}
            tipPercentage={tipPercentage}
            decimalValue={decimalValue}
          />
          <ModalComponent
            center
            showModal={showModal}
            onHide={onCloseModal}
            body={renderBody()}
            footer={renderFooter()}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default TotalsSection;
