import { Typography } from "@mui/material";
import { FC } from "react";
import { TimePicker } from "react-ios-time-picker";

interface TimePickerComponentProps {
  placeHolder?: string;
  value: string;
  setValue: (value: string) => void;
}

const TimePickerComponent: FC<TimePickerComponentProps> = ({
  placeHolder,
  value,
  setValue,
}) => {
  const onChange = (timeValue: string) => {
    setValue(timeValue);
  };

  return (
    <div>
      <Typography>{placeHolder}</Typography>
      <TimePicker
        inputClassName="timer-picker"
        popupClassName="popup-picker"
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

export default TimePickerComponent;
