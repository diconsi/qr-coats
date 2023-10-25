import { ModalComponent, TableList } from "@/clube/components";
import { ClubeLayout } from "@/clube/layout";
import { deleteEmployee, editEmployee, newEmployee } from "@/constants";
import useFetchAndLoad from "@/hooks/useFetchAndLoad";
import { createEmployee, deleteUser, updateUser } from "@/services";
import {
  addEmployee,
  deleteEmployeeById,
  updateEmployee,
} from "@/store/employee/employeeSlice";
import { ActionIcon, Group } from "@mantine/core";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import {
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const initialState = {
  name: "",
  username: "",
  email: "",
  password: "",
  gender: "",
};
const Employes = () => {
  const { access_token, uid } = useSelector((store) => store.authState);
  const {
    activeClub: { _id },
  } = useSelector((store) => store.clubState);
  const { employees } = useSelector((store) => store.employeeState);
  const { callEndpoint } = useFetchAndLoad();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [state, setState] = useState(initialState);
  const [activeUser, setActiveUser] = useState({});

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleActioModal = (titleModal: string, user: any) => {
    if (user !== undefined) setActiveUser(user);
    if (titleModal === editEmployee) {
      const { name, username, email, gender } = user;
      setState({ ...state, name, username, email, gender });
    }
    setTitleModal(titleModal);
    setShowModal(true);
  };

  const onClosedModal = () => {
    setShowModal(false);
    setState(initialState);
    setActiveUser({});
  };
  const columns = [
    { accessor: "name", title: "Employee", textAlignment: "center" },
    { accessor: "email", title: "Email", textAlignment: "center" },
    { accessor: "username", title: "Username", textAlignment: "center" },
    { accessor: "gender", title: "Gender", textAlignment: "center" },
    {
      accessor: "password",
      title: "Password",
      textAlignment: "center",
      render: (row) => renderPassword(row),
    },
    {
      accessor: "acciones",
      title: "Acciones",
      textAlignment: "center",
      render: (row) => renderOpcion(row),
    },
  ];

  const renderPassword = (row) => {
    return (
      <Group spacing={4} position="center" noWrap>
        <ActionIcon color="blue">
          <PasswordOutlinedIcon />
        </ActionIcon>
      </Group>
    );
  };

  const renderOpcion = (row) => {
    return (
      <Group spacing={4} position="center" noWrap>
        <ActionIcon
          color="blue"
          onClick={() => handleActioModal(editEmployee, row)}
        >
          <EditOutlined />
        </ActionIcon>
        <ActionIcon
          color="red"
          onClick={() => handleActioModal(deleteEmployee, row)}
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
      idClub: _id,
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
    } = await callEndpoint(deleteUser(activeUser._id, access_token));
    if (status === 200) {
      setActiveUser({});
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
      updateUser(activeUser._id, employee, access_token)
    );
    if (status === 200) {
      setActiveUser({});
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
              <TextField
                fullWidth
                type="text"
                label="Full Name"
                placeholder="Full Name"
                id="name"
                name="name"
                value={state.name}
                onChange={onChange}
              />
            </Grid>
            <Grid item mt={1} md={6} p={1}>
              <TextField
                label="Username"
                type="text"
                placeholder="Username"
                fullWidth
                variant="filled"
                color="primary"
                name="username"
                id="username"
                value={state.username}
                onChange={onChange}
              />
            </Grid>
            {titleModal !== editEmployee && (
              <Grid item mt={1} md={6} p={1}>
                <TextField
                  fullWidth
                  type="password"
                  label="Password"
                  placeholder="Password"
                  id="password"
                  name="password"
                  value={state.password}
                  onChange={onChange}
                />
              </Grid>
            )}
            <Grid item mt={1} md={6} p={1}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                placeholder="Email"
                id="email"
                name="email"
                value={state.email}
                onChange={onChange}
              />
            </Grid>
            <Grid item mt={1} md={6} p={1}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel>Género</InputLabel>
                <Select
                  value={state.gender}
                  id="gender"
                  name="gender"
                  onChange={onChange}
                  label="Género"
                >
                  <MenuItem value="">
                    <em>Seleccionar</em>
                  </MenuItem>
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

  return (
    <ClubeLayout>
      <Container sx={{ height: "80%", maxWidth: "100% !important" }}>
        <TableList
          title=" Employees"
          titleButton={newEmployee}
          iconHeaderSection={<PersonAddOutlinedIcon />}
          data={employees}
          columns={columns}
          handleActioModal={handleActioModal}
        />
        <ModalComponent
          title={titleModal}
          center
          body={renderBody()}
          showModal={showModal}
          onClose={onClosedModal}
          onSave={onSave}
        />
      </Container>
    </ClubeLayout>
  );
};

export default Employes;
