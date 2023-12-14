import {
  CustomButton,
  HeaderSectionPage,
  InputText,
  ModalComponent,
  TableList,
} from "@/clube/components";
import { ClubeLayout } from "@/clube/layout";
import {
  deleteEmployee,
  editEmployee,
  employee,
  newEmployee,
} from "@/constants";
import { useAppDispatch, useAppSelector } from "@/hooks";
import useFetchAndLoad from "@/hooks/useFetchAndLoad";
import {
  createEmployee,
  deleteUser,
  getEmployeesByAdmin,
  updateUser,
} from "@/services";
import {
  addEmployee,
  deleteEmployeeById,
  setEmployees,
  updateEmployee,
} from "@/store/employee/employeeSlice";
import { ActionIcon, Group } from "@mantine/core";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import {
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

const initialState = {
  _id: "",
  name: "",
  username: "",
  email: "",
  password: "",
  gender: "",
};

const Employes = () => {
  const { callEndpoint } = useFetchAndLoad();
  const dispatch = useAppDispatch();
  const { access_token, uid } = useAppSelector((store) => store.authState);
  const { employees } = useAppSelector((store) => store.employeeState);
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const {
      data: { employees },
    } = await callEndpoint(getEmployeesByAdmin(uid, access_token));
    dispatch(
      setEmployees(
        employees.filter(
          (employe: { status: boolean }) => employe.status !== false
        )
      )
    );
  };

  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [state, setState] = useState(initialState);
  const [activeUser, setActiveUser] = useState("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const onChangeSelect = (event: SelectChangeEvent<string>) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleActioModal = (
    titleModal: string,
    _id: string = "",
    name: string = "",
    username: string = "",
    email: string = "",
    gender: string = ""
  ) => {
    if (_id !== undefined) setActiveUser(_id);
    if (titleModal === editEmployee) {
      setState({ ...state, name, username, email, gender });
    }
    setTitleModal(titleModal);
    setShowModal(true);
  };

  const onClosedModal = () => {
    setShowModal(false);
    setState(initialState);
    setActiveUser("");
  };

  const columns = [
    { accessor: "name", title: "EMPLOYEE", textAlignment: "center" },
    { accessor: "email", title: "EMAIL", textAlignment: "center" },
    { accessor: "username", title: "USERNAME", textAlignment: "center" },
    { accessor: "gender", title: "GENDER", textAlignment: "center" },
    {
      accessor: "password",
      title: "PASSWORD",
      textAlignment: "center",
      render: () => renderPassword(),
    },
    {
      accessor: "acciones",
      title: "ACTIONS",
      textAlignment: "center",
      render: ({
        _id,
        name,
        username,
        email,
        gender,
      }: {
        _id: string;
        name: string;
        username: string;
        email: string;
        gender: string;
      }) => renderOpcion(_id, name, username, email, gender),
    },
  ];

  const renderPassword = () => {
    return (
      <Group spacing={4} position="center" noWrap>
        <ActionIcon color="blue">
          <PasswordOutlinedIcon />
        </ActionIcon>
      </Group>
    );
  };

  const renderOpcion = (
    _id: string,
    name: string,
    username: string,
    email: string,
    gender: string
  ) => {
    return (
      <Group spacing={4} position="center" noWrap>
        <ActionIcon
          color="blue"
          onClick={() =>
            handleActioModal(editEmployee, _id, name, username, email, gender)
          }
        >
          <EditOutlined />
        </ActionIcon>
        <ActionIcon
          color="red"
          onClick={() =>
            handleActioModal(deleteEmployee, _id, name, username, email, gender)
          }
        >
          <DeleteOutline />
        </ActionIcon>
      </Group>
    );
  };

  const onSaveEmployee = async () => {
    const newEmployee = {
      name: state.name,
      username: state.username,
      email: state.email,
      password: state.password,
      gender: state.gender,
      rol: "employee",
      idAdmin: uid,
    };

    const { data, status } = await callEndpoint(
      createEmployee(access_token, newEmployee)
    );

    if (status === 201) {
      setState(initialState);
      dispatch(addEmployee(data));
      onClosedModal();
    }
  };

  const onDeletedEmployee = async () => {
    const {
      status,
      data: { _id },
    } = await callEndpoint(deleteUser(activeUser, access_token));
    if (status === 200) {
      setActiveUser("");
      dispatch(deleteEmployeeById(_id));
      onClosedModal();
    }
  };

  const onEditEmployee = async () => {
    const employee = {
      name: state.name,
      username: state.username,
      email: state.email,
      gender: state.gender,
    };
    const { status, data } = await callEndpoint(
      updateUser(activeUser, employee, access_token)
    );
    if (status === 200) {
      setActiveUser("");
      dispatch(updateEmployee(data));
      onClosedModal();
    }
  };

  const onSave = () => {
    if (titleModal === newEmployee) {
      onSaveEmployee();
    } else if (titleModal === deleteEmployee) {
      onDeletedEmployee();
    } else if (titleModal === editEmployee) {
      onEditEmployee();
    }
  };

  const renderBody = () => {
    return (
      <>
        {titleModal === deleteEmployee ? (
          <Grid item sx={{ width: "100%" }}>
            Realmente quiere eliminar <strong>el usuario!</strong>
          </Grid>
        ) : (
          <Grid container>
            <Grid item mt={1} md={12}>
              <InputText
                type="text"
                placeholder="Full Name"
                name="name"
                value={state.name}
                onChange={onChange}
              />
            </Grid>
            <Grid item mt={1} md={6} p={1}>
              <InputText
                type="text"
                placeholder="Username"
                name="username"
                value={state.username}
                onChange={onChange}
              />
            </Grid>
            {titleModal !== editEmployee && (
              <Grid item mt={1} md={6} p={1}>
                <InputText
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={state.password}
                  onChange={onChange}
                />
              </Grid>
            )}
            <Grid item mt={1} md={6} p={1}>
              <InputText
                type="email"
                placeholder="Email"
                name="email"
                value={state.email}
                onChange={onChange}
              />
            </Grid>
            <Grid item mt={1} md={6} p={1}>
              <FormControl sx={{ width: "100%", p: 0 }}>
                <Select
                  value={state.gender}
                  id="gender"
                  name="gender"
                  onChange={onChangeSelect}
                  placeholder="Gender"
                  sx={{
                    borderRadius: "30px",
                    border: "2px solid #B8BCFE",
                    "& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                      {
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        color:'white'
                      },
                  }}
                >
                  <MenuItem value="">Seleccionar</MenuItem>
                  <MenuItem value="masculino">Masculino</MenuItem>
                  <MenuItem value="femenino">Femenino</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}
      </>
    );
  };

  const renderFooter = () => {
    return (
      <Grid container justifyContent={"end"}>
        <CustomButton
          fullWidth={false}
          label="CANCEL"
          onClick={onClosedModal}
        />
        <CustomButton
          style={{ marginLeft: "5px" }}
          fullWidth={false}
          label="OK"
          onClick={onSave}
          background="linear-gradient(to bottom, #A482F2, #8CABF0)"
        />
      </Grid>
    );
  };

  const newEmploye = () => {
    handleActioModal(newEmployee);
  };

  return (
    <ClubeLayout>
      <Grid container sx={{ height: "100%", width: "100%", p: 2 }}>
        <Grid
          display="flex"
          alignItems={"center"}
          justifyContent={"center"}
          width={"100%"}
          height={"10%"}
          item
          p={2}
        >
          <HeaderSectionPage
            title={employee.toUpperCase()}
            titleButton={newEmployee}
            onClick={newEmploye}
            icon={<PersonAddOutlinedIcon />}
          />
        </Grid>
        <Grid container sx={{ height: "90%", width: "100%", p: 2 }}>
          <TableList data={employees} columns={columns} />
          <ModalComponent
            title={titleModal}
            center
            body={renderBody()}
            showModal={showModal}
            onHide={onClosedModal}
            footer={renderFooter()}
          />
        </Grid>
      </Grid>
    </ClubeLayout>
  );
};

export default Employes;
