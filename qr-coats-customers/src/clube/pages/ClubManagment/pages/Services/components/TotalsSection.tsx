import { ModalComponent } from "@/clube/components";
import {
  Alert,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ShoppingTable from "./ShoppingTable";

const TotalsSection = ({ summary,promotion }) => {
  const [decimalValue, setDecimalValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [tipPercentage, setTipPercentage] = useState(0.1);

  const isVisibleTable = summary.some((service) => service.total !== 0);

  const handleDecimalChange = (event) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setDecimalValue(value);
    }
  };

  const handleTipClick = (percentage) => {
    setDecimalValue("");
    setTipPercentage(percentage);
  };

  const onCloseModal = () => {
    setShowModal(false);
    setDecimalValue("");
    setTipPercentage(0.1);
  };

  const onSave = () => {
    if (decimalValue !== "") setShowModal(false);
  };
  const onClickEdit = () => {
    setDecimalValue("");
    setTipPercentage(0);
    setShowModal(true);
  };

  const renderBody = () => {
    return (
      <TextField
        label="Tip"
        type="text"
        placeholder="Tip"
        fullWidth
        variant="filled"
        color="primary"
        name="tip"
        value={decimalValue}
        onChange={handleDecimalChange}
      />
    );
  };

  const renderFooter = () => {
    return (
      <div style={{ display: "flex", gap: "10px" }}>
        <Button variant="contained" onClick={onCloseModal}>
          Cancel
        </Button>
        <Button
          disabled={decimalValue === ""}
          variant="contained"
          onClick={onSave}
        >
          Ok
        </Button>
      </div>
    );
  };

  return (
    <Grid item xs={12} md={6} sx={{ height: "75%" }}>
      <Paper elevation={2} sx={{ height: "100%" }}>
        {isVisibleTable ? (
          <>
            <Grid container justifyContent="center" sx={{ height: "5%" }}>
              <Typography>Select a Tip</Typography>
            </Grid>
            <Grid
              container
              alignItems="center"
              style={{
                height: "15%",
              }}
            >
              {[0.1, 0.15, 0.2].map((percentage, index) => (
                <Grid
                  item
                  justifyContent="center"
                  sx={{ pl: 2, pr: 2 }}
                  xs={3}
                  md={3}
                  key={index}
                >
                  <Button
                    onClick={() => handleTipClick(percentage)}
                    variant="contained"
                    fullWidth
                  >
                    {`${percentage * 100}%`}
                  </Button>
                </Grid>
              ))}
              <Grid item sx={{ pl: 2, pr: 2 }} xs={3} md={3}>
                <Button
                  onClick={onClickEdit}
                  fullWidth
                  variant="contained"
                  style={{ textAlign: "center" }}
                >
                  Edit
                </Button>
              </Grid>
            </Grid>
            <ModalComponent
              center
              showModal={showModal}
              onHide={onCloseModal}
              body={renderBody()}
              footer={renderFooter()}
            />
            <ShoppingTable
              summary={summary}
              promotion={promotion}
              tipPercentage={tipPercentage}
              decimalValue={decimalValue}
            />
          </>
        ) : (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ height: "100%" }}
          >
            <Alert severity="error" variant="filled">
              <Typography>TAP ON ANY ITEM TO ADD IT TO YOUR ORDER.</Typography>
            </Alert>
          </Grid>
        )}
      </Paper>
    </Grid>
  );
};

export default TotalsSection;
