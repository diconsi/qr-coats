import { InputAdornment, TextField } from "@mui/material";
import { ChangeEvent, FC, FocusEventHandler, ReactNode } from "react";
interface InputTextProps {
  label?: string;
  type: string;
  name?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  value: string | number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?:
    | FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  endAdornmentIcon?: ReactNode;
  sx?: object;
  showPassword?: boolean;
  onClickIcon?: () => void;
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
  onBlur,
  endAdornmentIcon,
  sx,
  showPassword,
  onClickIcon,
}) => {
  return (
    <TextField
      onBlur={onBlur ? onBlur : undefined}
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
            onClick={onClickIcon}
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
