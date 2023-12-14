import { Button } from "@mui/material";
import { FC, ReactNode } from "react";
const gradientStyle = {
  color: "white",
  fontWeight: "bold",
  borderRadius: "30px",
  border: "2px solid #816CB5",
  transition: "background 0.3s ease",
  "&:hover": {
    background: "linear-gradient(to bottom, #8CABF0, #A482F2)",
  },
};

interface CustomButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  style?: object;
  fullWidth?: boolean;
  background?: string;
  startIcon?: ReactNode;
}

const CustomButton: FC<CustomButtonProps> = ({
  onClick,
  label,
  disabled = false,
  className,
  fullWidth = false,
  startIcon,
  style,
  background,
}) => {
  return (
    <Button
      startIcon={startIcon}
      className={className}
      style={{
        ...gradientStyle,
        background: disabled ? "#8E8EA4" : background ? background : "#656581",
        ...style,
      }}
      fullWidth={fullWidth}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </Button>
  );
};

export default CustomButton;
