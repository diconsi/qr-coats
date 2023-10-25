import { TimePicker } from "react-ios-time-picker";

const TimePickerComponent = ({ placeHolder, value, setValue }) => {
  const onChange = (timeValue) => {
    setValue(timeValue);
  };

  return (
    <div>
      <TimePicker placeHolder={placeHolder} onChange={onChange} value={value} />
    </div>
  );
};

export default TimePickerComponent;
