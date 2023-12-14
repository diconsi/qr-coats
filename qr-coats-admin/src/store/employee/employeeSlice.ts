import { createSlice } from "@reduxjs/toolkit";
const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    employees: [
      {
        _id: "",
        name: "",
        username: "",
        email: "",
        password: "",
        rol: "employee",
        gender: "",
        status: true,
        clubes: [],
        employees: [],
      },
    ],
  },
  reducers: {
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
    addEmployee: (state, action) => {
      state.employees = [...state.employees, action.payload];
    },
    updateEmployee: (state, action) => {
      const updatedEmployeeIndex = state.employees.findIndex(
        (employee) => employee._id === action.payload._id
      );

      if (updatedEmployeeIndex !== -1) {
        state.employees[updatedEmployeeIndex] = {
          ...state.employees[updatedEmployeeIndex],
          ...action.payload,
        };
      }
    },
    deleteEmployeeById: (state, action) => {
      state.employees = state.employees.filter(
        (employee) => employee._id !== action.payload
      );
    },
  },
});

export const { setEmployees, addEmployee, updateEmployee, deleteEmployeeById } =
  employeeSlice.actions;

export default employeeSlice.reducer;
