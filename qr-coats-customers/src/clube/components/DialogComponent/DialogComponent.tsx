import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { CustomButton } from "..";
import { FC, ReactNode } from "react";

interface DialogComponentProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: ReactNode;
  labelBotton: string;
  onActionButton: () => void;
}

const DialogComponent: FC<DialogComponentProps> = ({
  open,
  onClose,
  title,
  content,
  labelBotton,
  onActionButton,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          color: "white",
          backgroundColor: "#2E2F47",
          backdropFilter: "blur(90px)",
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent
        sx={{
          color: "white",
          backgroundColor: "#2E2F47",
          backdropFilter: "blur(90px)",
          paddingTop: "20px !important",
        }}
      >
        {content}
      </DialogContent>
      <DialogActions
        sx={{
          color: "white",
          backgroundColor: "#2E2F47",
          backdropFilter: "blur(90px)",
        }}
      >
        <CustomButton fullWidth={false} label="CANCEL" onClick={onClose} />
        <CustomButton
          style={{ marginLeft: "5px" }}
          fullWidth={false}
          label={labelBotton}
          onClick={onActionButton}
          background="linear-gradient(to bottom, #A482F2, #8CABF0)"
        />
      </DialogActions>
    </Dialog>
  );
};

export default DialogComponent;
