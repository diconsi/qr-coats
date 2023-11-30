import { InputAdornment, TextField } from "@mui/material";
import { ChangeEvent, FC, ReactNode } from "react";
interface InputTextProps {
  label?: string;
  type: string;
  name?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  endAdornmentIcon?: ReactNode;
  sx?: object;
  showPassword?: boolean;
  onTogglePasswordVisibility?: () => void;
}

const InputText: FC<InputTextProps> = ({
  label,
  type,
  name,
  placeholder,
  error,
  helperText,
  value,
  onChange,
  endAdornmentIcon,
  sx,
  showPassword,
  onTogglePasswordVisibility,
}) => {
  return (
    <TextField
      label={label}
      type={showPassword ? "text" : type}
      id={name}
      name={name}
      placeholder={placeholder}
      value={value}
      fullWidth
      onChange={onChange}
      variant="filled"
      InputLabelProps={{
        style: {
          color: "white",
          marginLeft: "12px",
        },
      }}
      error={error}
      helperText={helperText}
      InputProps={{
        style: {
          color: "white",
          paddingLeft: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        autoComplete: "off",
        endAdornment: (
          <InputAdornment
            sx={{
              color: "white",
              cursor: type === "password" ? "pointer" : "initial",
              marginRight: "12px",
            }}
            position="end"
            onClick={onTogglePasswordVisibility}
          >
            {endAdornmentIcon}
          </InputAdornment>
        ),
        classes: {
          input: "custom-input-class",
        },
      }}
      sx={{
        ...sx,
        margin: "0",
        background: "transparent",
        borderRadius: "30px",
        "& .custom-input-class": {
          paddingTop: "10px!important",
          paddingBottom: "10px!important",
        },
        "& .MuiFilledInput-root": {
          borderRadius: "30px",
          border: "2px solid #B8BCFE",
          marginRight: "12px",
        },
        "& .MuiFilledInput-underline:before": {
          borderBottom: "none !important",
        },
        "& .MuiFilledInput-underline:after": {
          borderBottom: "none !important",
        },
        "&.MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
          borderColor: "transparent",
        },
      }}
    />
  );
};

export default InputText;
