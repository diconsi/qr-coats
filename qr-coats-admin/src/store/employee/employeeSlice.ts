import { createSlice } from "@reduxjs/toolkit";
const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    employees: [],
    activeEmployee: null,
  },
  reducers: {
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
    addEmployee: (state, action) => {
      state.employees.push(action.payload);
    },
    setActiveEmployee: (state, action) => {
      state.activeEmployee = action.payload;
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

export const {
  setEmployees,
  addEmployee,
  setActiveEmployee,
  updateEmployee,
  deleteEmployeeById,
} = employeeSlice.actions;

export default employeeSlice.reducer;
